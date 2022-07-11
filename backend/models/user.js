import { DataTypes } from "sequelize";
import {database} from "./index.js";

const User = database.define("User" , {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
    profilePic: {
        type: DataTypes.STRING,
        defaultValue: 'defaultUserProfile.png'
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})

export {User}