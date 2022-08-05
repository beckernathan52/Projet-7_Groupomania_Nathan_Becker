import { DataTypes } from "sequelize";
import {database} from "./index.js";

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
        defaultValue: 'defaultPostPicture.png'
        //allowNull: true
    },
    /*likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    dislikes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    usersLiked: {
        type: DataTypes.STRING,
        defaultValue: '[]'
    },
    usersDisliked: {
        type: DataTypes.STRING,
        defaultValue: '[]'
    }*/
})

export {Post}
