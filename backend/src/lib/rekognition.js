const { RekognitionClient, DetectLabelsCommand } = require('@aws-sdk/client-rekognition')
const { execSync } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { uploadToS3 } = require('./s3')

const rekognition = new RekognitionClient({
  region: process.env.AWS_REGION || 'us-east-2',
})

/**
 * Extracts the first frame from a video buffer using ffmpeg,
 * uploads it to S3 as a temporary JPEG, runs Rekognition on it,
 * then deletes the temporary frame from S3.
 * Returns a cv_tags string "label,confidence;label,confidence;..."
 */
async function detectLabels(videoBuffer, videoKey) {
  const tmpDir = os.tmpdir()
  const tmpVideo = path.join(tmpDir, `${Date.now()}-input.mp4`)
  const tmpFrame = path.join(tmpDir, `${Date.now()}-frame.jpg`)
  const frameKey = `frames/${path.basename(tmpFrame)}`

  try {
    // Write video buffer to temp file
    fs.writeFileSync(tmpVideo, videoBuffer)

    // Extract first frame using ffmpeg
    execSync(`ffmpeg -i ${tmpVideo} -vframes 1 -q:v 2 ${tmpFrame}`, { stdio: 'ignore' })

    // Upload frame to S3
    const frameBuffer = fs.readFileSync(tmpFrame)
    await uploadToS3(frameKey, frameBuffer, 'image/jpeg')

    // Run Rekognition on the frame
    const command = new DetectLabelsCommand({
      Image: {
        S3Object: {
          Bucket: process.env.S3_BUCKET,
          Name: frameKey,
        },
      },
      MaxLabels: 10,
      MinConfidence: 50,
    })

    const response = await rekognition.send(command)

    const cvTags = response.Labels
      .map(label => `${label.Name},${label.Confidence.toFixed(2)}`)
      .join(';')

    return cvTags
  } catch (err) {
    console.error('Rekognition error:', err)
    return ''
  } finally {
    // Clean up temp files
    if (fs.existsSync(tmpVideo)) fs.unlinkSync(tmpVideo)
    if (fs.existsSync(tmpFrame)) fs.unlinkSync(tmpFrame)
  }
}

module.exports = { detectLabels }
