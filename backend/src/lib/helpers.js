const { getPresignedUrl } = require('./s3')

/**
 * Extracts the numeric user ID from the Auth0 JWT sub field.
 * Auth0 sub looks like "auth0|123456" — we want the part after the pipe.
 */
function getUserId(req) {
  const sub = req.auth.payload.sub
  const parts = sub.split('|')
  if (parts.length < 2 || !parts[1]) throw new Error('Invalid Auth0 sub format')
  return parts[1]
}

/**
 * Parses the cv_tags DB column into an array of tag name strings.
 * Format: "tag1,confidence;tag2,confidence;..."
 * Only the first element (tag name) of each semicolon-separated entry is used.
 */
function parseCvTags(cvTagsStr) {
  if (!cvTagsStr) return []
  return cvTagsStr
    .split(';')
    .map(entry => entry.split(',')[0].trim())
    .filter(Boolean)
}

/**
 * Parses the user_tags DB column into an array of tag strings.
 * Format: "tag1,tag2,tag3"
 */
function parseUserTags(userTagsStr) {
  if (!userTagsStr) return []
  return userTagsStr.split(',').map(t => t.trim()).filter(Boolean)
}

/**
 * Serializes an array of user tags back to the DB column format.
 */
function formatUserTags(tagsArray) {
  return tagsArray.join(',')
}

/**
 * Parses the wrist_accel DB column into { x, z } arrays.
 * Format: "[x;y;z],[x;y;z],..."
 * Values are multiplied by 10 to match the original PHP scaling.
 * Only X and Z axes are returned — Y is not used by the frontend.
 */
function parseAccel(wristAccelStr) {
  if (!wristAccelStr) return { x: [], z: [] }

  const x = []
  const z = []

  wristAccelStr.split(',').forEach(triplet => {
    const inner = triplet.slice(1, -1) // strip [ and ]
    const parts = inner.split(';')
    if (parts.length >= 3) {
      x.push(parseFloat(parts[0]) * 10)
      z.push(parseFloat(parts[2]) * 10)
    }
  })

  return { x, z }
}

/**
 * Formats a raw DB row into a clean clip object for the API response.
 * Async because it generates a presigned S3 URL for the video.
 */
async function formatClip(row) {
  return {
    id: row.id,
    minute: row.minute,
    hour: row.hour,
    day: row.day,
    month: row.month,
    year: row.year,
    video: row.video,
    video_url: await getPresignedUrl(row.video),
    cv_tags: parseCvTags(row.cv_tags),
    user_tags: parseUserTags(row.user_tags),
  }
}

module.exports = { getUserId, parseCvTags, parseUserTags, formatUserTags, formatClip, parseAccel }
