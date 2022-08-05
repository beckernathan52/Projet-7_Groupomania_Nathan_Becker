import {DataTypes} from "sequelize";
import {database} from "./index.js";
import {Post} from "./post.js";
import {User} from "./user.js";

const Like = database.define("Like" , {
    like: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
})

Like.belongsTo(User, {
    onDelete: 'cascade',
    foreignKey: { name: 'userId', allowNull: false },
    hooks: true
})

Like.belongsTo(Post, {
    onDelete: 'cascade',
    foreignKey: { name: 'postId', allowNull: false },
    hooks: true
})

export {Like}