import {DataTypes} from "sequelize";
import {database} from "./index.js";
import {Post} from "./post.js";
import {Like} from "./like.js";

const User = database.define("User" , {
    id: {
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})

// Un Post appartient à un utilisateur
Post.belongsTo(User, {
    onDelete: 'cascade',
    foreignKey: { name: 'userId', allowNull: false},
    hooks: true
})

// Un utilisateur a plusieurs Posts
User.hasMany(Post,{
    onDelete: 'cascade',
    foreignKey: { name: 'userId', allowNull: false},
    hooks: true
})

// Un Like appartient à un utilisateur
Like.belongsTo(User, {
    onDelete: 'cascade',
    foreignKey: { name: 'userId', allowNull: false },
    hooks: true
})

export {User}