const express = require('express')
require('express-async-errors')
const app = express()

const { PORT } = require('./util/config')
const { connectToBlogDatabase } = require('./util/db')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const readinglistsRouter = require('./controllers/readingLists')
const logoutRouter = require('./controllers/logout')

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readinglists', readinglistsRouter)
app.use('/api/logout', logoutRouter)

const start = async () => {
    await connectToBlogDatabase()

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

start()

