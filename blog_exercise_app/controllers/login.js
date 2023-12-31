const router = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Session = require('../models/session')
const { SECRET } = require('../util/config')


router.post('/', async(req, res) => {
    const body = req.body

    const user = await User.findOne({
        where: {
            username: body.username
        }
    })

    const passwordCorrect = body.password === 'secret'

    if(!user || !passwordCorrect){
        return res.status(401).json({ 
            error: 'invalid username or password' 
        })
    }

    if(user.disable){
        return res.status(401).json({ 
            error: 'invalid user' 
        })
    }

    const userForToken = {
        username: user.username,
        id: user.id
    }

    const token = jwt.sign(userForToken, SECRET)

    await Session.create({ token, userId: user.id })

    res.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = router