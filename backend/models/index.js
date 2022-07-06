import {Sequelize} from "sequelize";
import dotenv from "dotenv";
dotenv.config()

const sequelize = new Sequelize({
        database: process.env.MYSQL_DATABASE,
        password: process.env.MYSQL_PASSWORD,
        username: process.env.MYSQL_USERNAME,
        host: 'localhost',
        dialect: "mysql",
    }
);

const database = {};

database.Sequelize = Sequelize;
database.sequelize = sequelize;



database.User = import ("./user.js")

export {database}