const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-2',
})

/**
 * Generates a presigned URL for a private S3 object.
 * Expires in 6 hours — long enough for a browsing session.
 */
async function getPresignedUrl(key) {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
  })
  return getSignedUrl(s3, command, { expiresIn: 60 * 60 * 6 })
}

/**
 * Uploads a file buffer to S3.
 */
async function uploadToS3(key, buffer, contentType = 'video/mp4') {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  })
  await s3.send(command)
}

module.exports = { getPresignedUrl, uploadToS3 }
