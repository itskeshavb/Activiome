const express = require('express')
const router = express.Router()
const db = require('../db')
const { getUserId, parseUserTags, formatClip } = require('../lib/helpers')

// GET /tags
// Returns all unique user tags for the logged-in user, sorted alphabetically
router.get('/', async (req, res) => {
  try {
    const userId = getUserId(req)

    const [rows] = await db.query(
      "SELECT user_tags FROM items WHERE user_tags <> '' AND user_id = ?",
      [userId]
    )

    const allTags = new Set()
    rows.forEach(row => {
      parseUserTags(row.user_tags).forEach(tag => allTags.add(tag))
    })

    res.json([...allTags].sort())
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /tags/:tag
// Returns all clips that have the given user tag, sorted newest first
router.get('/:tag', async (req, res) => {
  try {
    const userId = getUserId(req)

    if (!req.params.tag || req.params.tag.length > 100) {
      return res.status(400).json({ error: 'Invalid tag' })
    }

    const [rows] = await db.query(
      `SELECT * FROM items
       WHERE user_id = ? AND FIND_IN_SET(?, user_tags) > 0
       ORDER BY year DESC, month DESC, day DESC, hour DESC, minute ASC`,
      [userId, req.params.tag]
    )

    res.json(await Promise.all(rows.map(formatClip)))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
