import {Model, DataTypes , Sequelize} from "sequelize";
const sequelize = new Sequelize('mysql::memory:');

const userSchema = (sequelize) => {
    class User extends Model {

    }
    User.init({
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
    }, {sequelize, modelName: 'User',});
    return User;
};

const User =  userSchema(sequelize)

export {User}
