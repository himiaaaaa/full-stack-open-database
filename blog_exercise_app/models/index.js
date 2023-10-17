const Blog = require('./blog')
const User = require('./user')
const UserBlogs = require('./userBlog')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: UserBlogs, as: 'marked_blogs' })
Blog.belongsToMany(User, { through: UserBlogs, as: 'users_marked' })

module.exports = {
    Blog, User
}