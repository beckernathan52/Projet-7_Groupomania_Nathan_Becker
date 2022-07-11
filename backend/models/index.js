import {Sequelize} from "sequelize";
import dotenv from "dotenv";
dotenv.config()

const database = new Sequelize({
        database: process.env.MYSQL_DATABASE,
        password: process.env.MYSQL_PASSWORD,
        username: process.env.MYSQL_USERNAME,
        host: 'localhost',
        dialect: "mysql",
    }
);

export {database}