const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const User = sequelize.define('user', {
    uid: { type: DataTypes.UUID, primaryKey: true },
    email: { type: DataTypes.STRING(100), unique: true },
    password: { type: DataTypes.STRING(100) },
    nickname: { type: DataTypes.STRING(30), unique: true }
})

const Tag = sequelize.define('tag', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    //creator: { type: DataTypes.UUID },
    name: { type: DataTypes.STRING(40) },
    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 }
})

const UserTag = sequelize.define('user_tag', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
})

User.belongsToMany(Tag, { through: UserTag })
Tag.belongsToMany(User, { through: UserTag })

User.hasMany(Tag)
Tag.belongsTo(User);


module.exports = {
    User,
    Tag,
    UserTag
}