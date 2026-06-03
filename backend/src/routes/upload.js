const express = require('express')
const router = express.Router()
const multer = require('multer')
const db = require('../db')
const { uploadToS3 } = require('../lib/s3')
const { detectLabels } = require('../lib/rekognition')

// Store file in memory (no disk writes needed)
const upload = multer({ storage: multer.memoryStorage() })

/**
 * POST /upload
 * Accepts multipart/form-data with the following fields:
 *   u        — user_id
 *   ty       — year
 *   tmo      — month
 *   td       — day
 *   th       — hour
 *   tmi      — minute
 *   ts       — second
 *   lat      — latitude
 *   lon      — longitude
 *   waccel   — wrist accelerometer data "[x;y;z],[x;y;z],..."
 *   paccel   — phone accelerometer data
 *   pgyro    — phone gyroscope data
 *   pmag     — phone magnetometer data
 *   videofile — the video file (.mp4)
 */
router.post('/', upload.single('videofile'), async (req, res) => {
  try {
    const userId = req.body.u?.trim()
    if (!userId) return res.status(400).json({ error: 'Missing user ID' })

    // Validate user exists
    const [users] = await db.query(
      'SELECT user_id FROM users WHERE user_id = ?',
      [userId]
    )
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid user ID' })
    }

    // Parse date/time fields
    const year   = req.body.ty?.trim()
    const month  = req.body.tmo?.trim()
    const day    = req.body.td?.trim()
    const hour   = req.body.th?.trim()
    const minute = req.body.tmi?.trim()
    const second = req.body.ts?.trim()

    if (!year || !month || !day || !hour || !minute || !second) {
      return res.status(400).json({ error: 'Missing date/time fields' })
    }

    const creation = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}`

    const lat    = req.body.lat?.trim() || null
    const lon    = req.body.lon?.trim() || null
    const waccel = req.body.waccel?.trim() || null
    const paccel = req.body.paccel?.trim() || null
    const pgyro  = req.body.pgyro?.trim() || null
    const pmag   = req.body.pmag?.trim() || null

    if (!req.file) {
      return res.status(400).json({ error: 'Missing video file' })
    }

    // Build video filename matching original convention
    const videoName = `${userId}-${year}${month.padStart(2, '0')}${day.padStart(2, '0')}-${hour.padStart(2, '0')}${minute.padStart(2, '0')}${second.padStart(2, '0')}-video.mp4`

    // Upload video to S3
    await uploadToS3(videoName, req.file.buffer, 'video/mp4')

    // Run Rekognition for CV tags
    const cvTags = await detectLabels(req.file.buffer, videoName)

    // Insert into database
    await db.query(
      `INSERT INTO items
        (user_id, type, creation, hour, minute, second, day, month, year,
         latitude, longitude, wrist_accel, phone_accel, phone_gyro, phone_mag,
         cv_tags, user_tags, video)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', ?)`,
      [userId, 'multimodal', creation, hour, minute, second, day, month, year,
       lat, lon, waccel, paccel, pgyro, pmag, cvTags, videoName]
    )

    res.json({ status: 'OK' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
