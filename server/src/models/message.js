const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const User = require("./user");
const Chat = require("./chat");

const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
    
    chatId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "Message",
    updatedAt:false,
  }
);

(async () => {
  await Message.sync({ force: false });
})();

Message.belongsTo(User, { foreignKey: "senderId", as: "sender" });

Chat.hasMany(Message, { foreignKey: "chatId", as:"msg" });
Message.belongsTo(Chat, { foreignKey: "chatId", as:"msg"  });

module.exports = Message;