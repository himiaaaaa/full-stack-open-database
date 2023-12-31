const jwt = require('jsonwebtoken')
const router = require('express').Router()
const { sequelize } = require('../util/db')

const { Blog, User, Session } = require('../models')
const { SECRET } = require('../util/config')
const { Op } = require('sequelize')


router.get('/', async(req, res) => {
    const where = {}

    if( req.query.search ) {
        where[Op.or]= [
            {
                title: {
                    [Op.substring]: req.query.search
                }
            },
            {
                author: {
                    [Op.substring]: req.query.search
                }
            }
        ]
    }

    const blogs = await Blog.findAll({
        attributes: { 
            exclude: ['userId']   
        },
        include: {
            model: User,
            attributes: ['name']
        },
        where,
        order: [
            [sequelize.literal('likes'), 'DESC']
        ]
    })
    console.log(JSON.stringify(blogs, null, 2))
    res.json(blogs)
})

const tokenExtractor = async (req, res, next) => {
    const authorization = req.get('authorization')
    if(authorization && authorization.toLowerCase().startsWith('bearer ')){
        try {
            req.decodedToken = jwt.verify(authorization.substring(7), SECRET)

            const session = await Session.findOne({
                where: { 
                    userId: req.decodedToken.id, 
                    token: authorization.substring(7) 
                }
              })

              if(!session) {
                return res.status(400).json({ error: 'Session expired!'})
              }
              
        } catch {
            return res.status(401).json({ error: 'token invalid' })
        }
    } else{
        return res.status(401).json({ error: 'token missing' })
    }
    next()
}

router.post('/', tokenExtractor, async(req, res) => {
    console.log('!!!decodedToken!!!', req.decodedToken)
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({...req.body, userId: user.id, date: new Date()})
    return res.json(blog)
})

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

router.get('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
      res.json(req.blog)
    } else {
      res.status(404).end()
    }
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    if(req.blog && user){
        await req.blog.destroy()
    }
    res.status(204).end()
})

router.put('/:id', blogFinder, async (req, res) => {
    if(req.blog){
        req.blog.likes = req.body.likes

        if(req.body.year) {

            if(req.body.year < 1991 || req.body.year > new Date().getFullYear()) {
                return res.status(401).json({ error: 'Year must be between 1991 and current year' });
            }
            req.blog.year = req.body.year; 
        }

        await req.blog.save()
        res.json(req.blog)
    } else {
        res.status(404).end()
    }
})

module.exports = router