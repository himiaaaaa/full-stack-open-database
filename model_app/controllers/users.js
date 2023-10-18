const router = require('express').Router()

const { User, Note, Team } = require('../models')

const { tokenExtractor } = require('../util/middleware')

const isAdmin = async (req, res, next) => {
    const user = await User.findByPk(req.decodedToken.id)
    if(!user.admin){
        return res.status(401).json({ error: 'operation not allowed' })
    }
    next()
}

router.put('/:username', tokenExtractor, isAdmin, async (req, res) => {
    const user = await User.findOne({
        where: {
            username: req.params.username
        }
    })
    if (user) {
        user.disabled = req.body.disabled
        await user.save()
        res.json(user)
    } else {
        res.status(404).end()
    }

})

router.get('/', async(req, res) => {
    const users = await User.findAll({
        include: [
        {
            model: Note,
            attributes: { exclude: ['userId'] }
        }, 
        {
            model: Team,
            attributes: ['name', 'id'],
            through: {          
                attributes: []        
            }
        }
      ]
    })
    res.json(users)

    const jamiUsers = User.scope({ method: ['name', '%jami%'] }).findAll()
    console.log(JSON.stringify(jamiUsers, null, 2))

    const jami = await User.findOne({ name: 'Jami Kousa'})
    const cnt = await jami.number_of_notes()    
    console.log(`Jami has created ${cnt} notes`)

    const twoNoteUsers = await User.with_notes(2)
    console.log(JSON.stringify(twoNoteUsers, null, 2))
    twoNoteUsers.forEach(u => {
        console.log(u.name)
    })

})

router.post('/', async(req, res) => {
    try {
        const user = await User.create(req.body)
        res.json(user)
    } catch(error){
        return res.status(400).json({ error })
    } 
})

router.get('/:id', async(req, res) => {
    const user = await User.findByPk(req.params.id, {
        include: [
        {
            model: Note,
            attributes: { exclude: ['userId'] }
        },
        {
            model: Note,
            as: 'marked_notes',
            attributes: { exclude: ['userId'] },
            through: {
                attributes: []
            },
            include: {
                model: User,
                attributes: ['name']
            }
        },
        {
            model: Team,
            attributes: ['name', 'id'],
            through: {
                attributes: []
            }
        }
      ]
    })


    if(!user){
        return res.status(400).end()
    } 

    let teams = undefined
    if (req.query.teams) {
        teams = await user.getTeam({
            attributes: ['name'],
            joinTableAttributes: []
        })
    }
    res.json({ ...user.toJSON(), teams })
})

module.exports = router