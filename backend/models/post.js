import { DataTypes } from "sequelize";
import {database} from "./index.js";
import {Like} from "./like.js";

const Post = database.define("Post" , {
    id: {
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false
    },
    filePicture: {
        type: DataTypes.STRING,
        defaultValue: '',
        allowNull: true
    },
    hasUserLiked: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    hasUserDisliked: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
})

export {Post}

// Un Post à plusieurs Likes
Post.hasMany(Like,{
    onDelete: 'cascade',
    foreignKey: { name: 'postId', allowNull: false},
    hooks: true
})

// Un Like appartient à un Post
Like.belongsTo(Post, {
    onDelete: 'cascade',
    foreignKey: { name: 'postId', allowNull: false },
    hooks: true
})