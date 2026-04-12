const express = require('express')
const router = express.Router()
const db = require('../db')
const { getUserId, parseUserTags, formatUserTags, formatClip, parseAccel } = require('../lib/helpers')

const MAX_TAG_LENGTH = 100

// GET /clips?h=&d=&m=&y=
router.get('/', async (req, res) => {
  try {
    const userId = getUserId(req)

    const h = parseInt(req.query.h, 10)
    const d = parseInt(req.query.d, 10)
    const m = parseInt(req.query.m, 10)
    const y = parseInt(req.query.y, 10)

    if (isNaN(h) || h < 0 || h > 23) return res.status(400).json({ error: 'Invalid hour' })
    if (isNaN(d) || d < 1 || d > 31) return res.status(400).json({ error: 'Invalid day' })
    if (isNaN(m) || m < 1 || m > 12) return res.status(400).json({ error: 'Invalid month' })
    if (isNaN(y) || y < 2000 || y > 2100) return res.status(400).json({ error: 'Invalid year' })

    const [rows] = await db.query(
      'SELECT * FROM items WHERE user_id = ? AND hour = ? AND day = ? AND month = ? AND year = ? ORDER BY minute ASC',
      [userId, h, d, m, y]
    )

    res.json(await Promise.all(rows.map(formatClip)))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /clips/:id/accel
router.get('/:id/accel', async (req, res) => {
  try {
    const userId = getUserId(req)
    const id = parseInt(req.params.id, 10)
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid clip ID' })

    const [rows] = await db.query(
      'SELECT wrist_accel FROM items WHERE id = ? AND user_id = ?',
      [id, userId]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Clip not found' })
    }

    res.json(parseAccel(rows[0].wrist_accel))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /clips/:id
router.get('/:id', async (req, res) => {
  try {
    const userId = getUserId(req)
    const id = parseInt(req.params.id, 10)
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid clip ID' })

    const [rows] = await db.query(
      'SELECT * FROM items WHERE id = ? AND user_id = ?',
      [id, userId]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Clip not found' })
    }

    res.json(await formatClip(rows[0]))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /clips/:id/tags
// Body: { tag: "string" }
router.post('/:id/tags', async (req, res) => {
  try {
    const userId = getUserId(req)
    const id = parseInt(req.params.id, 10)
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid clip ID' })

    const { tag } = req.body

    if (!tag || typeof tag !== 'string' || !tag.trim()) {
      return res.status(400).json({ error: 'tag is required and must be a non-empty string' })
    }

    const cleanTag = tag.trim()

    if (cleanTag.length > MAX_TAG_LENGTH) {
      return res.status(400).json({ error: `tag must be ${MAX_TAG_LENGTH} characters or fewer` })
    }

    const [rows] = await db.query(
      'SELECT user_tags FROM items WHERE id = ? AND user_id = ?',
      [id, userId]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Clip not found' })
    }

    const existing = parseUserTags(rows[0].user_tags)

    if (existing.includes(cleanTag)) {
      return res.json({ user_tags: existing })
    }

    const updated = [...existing, cleanTag]

    await db.query(
      'UPDATE items SET user_tags = ? WHERE id = ? AND user_id = ?',
      [formatUserTags(updated), id, userId]
    )

    res.json({ user_tags: updated })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE /clips/:id/tags/:tag
router.delete('/:id/tags/:tag', async (req, res) => {
  try {
    const userId = getUserId(req)
    const id = parseInt(req.params.id, 10)
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid clip ID' })

    if (req.params.tag.length > MAX_TAG_LENGTH) {
      return res.status(400).json({ error: 'Invalid tag' })
    }

    const [rows] = await db.query(
      'SELECT user_tags FROM items WHERE id = ? AND user_id = ?',
      [id, userId]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Clip not found' })
    }

    const existing = parseUserTags(rows[0].user_tags)
    const updated = existing.filter(t => t !== req.params.tag)

    await db.query(
      'UPDATE items SET user_tags = ? WHERE id = ? AND user_id = ?',
      [formatUserTags(updated), id, userId]
    )

    res.json({ user_tags: updated })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
