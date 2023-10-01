const router = require('express').Router()

const { User, Blog } = require('../models')

router.get('/', async(req, res) => {
    const users = await User.findAll({
        include: {
            model: Blog,
            attributes: { exclude: ['userId'] } 
        }
    })
    console.log(JSON.stringify(users, null, 2))
    res.json(users)
})

router.post('/', async(req, res) => {
    try {
        const user = await User.create(req.body)
        res.json(user)
    } catch(error) {
        return res.status(400).json({ error: "Validation isEmail on username failed" })
    }  
})

router.put('/:username', async(req, res) => {
    
    const username = req.params.username
    const user = await User.findOne({username: username})
    if(user){
        const newUsername = req.body.newUsername
        user.username = newUsername
        await user.save()
        res.json(user)
    } else {
        res.status(400).end()
    }
       
})

module.exports = router


