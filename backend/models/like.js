import {DataTypes} from "sequelize";
import {database} from "./index.js";

const Like = database.define("Like" , {
    like: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
})

export {Like}