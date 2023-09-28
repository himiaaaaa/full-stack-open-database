const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')

const sequelize = new Sequelize(DATABASE_URL)

const connectToBlogDatabase = async () => {
    
    try {
        await sequelize.authenticate()
        console.log('connected to the database')
    } catch (err) {
        console.log('fail to connect to the database')
        return process.exit(1)
    }

    return null
}

module.exports = { connectToBlogDatabase, sequelize }