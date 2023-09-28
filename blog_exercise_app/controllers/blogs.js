const router = require('express').Router()

const { Blog } = require('../models')

router.get('/', async(req, res) => {
    const blogs = await Blog.findAll()
    console.log(JSON.stringify(blogs, null, 2))
    res.json(blogs)
})

router.post('/', async(req, res) => {
    try {
        const blog = await Blog.create(req.body)
        return res.json(blog)
    } catch (error) {
        return res.status(400).json({ error })
    }
})

router.delete('/:id', async(req, res) => {
    const blog = await Blog.findByPk(req.body.id)
    if(blog){
        await blog.destroy()
    }
    res.status(204).end()
})

module.exports = router