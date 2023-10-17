const router = require('express').Router()

const { Blog, User, ReadingLists } = require('../models')

router.get('/', async(req, res) => {
    const readingList = await ReadingLists.findAll({})
    res.json(readingList)
})

router.post('/', async(req, res) => {
    try {
        const body = req.body

        const blog = await Blog.findByPk(body.blogId)
        const user = await User.findByPk(body.userId)

        if (!blog) return res.status(404).json({ error: 'blog not found' })
        if (!user) return res.status(404).json({ error: 'user not found' })

        const readingList = await ReadingLists.create(body)
        res.json(readingList)
    } catch (error) {
        return res.status(400).json({ error })
    } 
})


module.exports = router