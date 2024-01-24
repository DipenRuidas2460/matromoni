const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const User = require("./user");

const ConnectionRequest = sequelize.define(
  "ConnectionRequest",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    withUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("accept", "pending", "reject"),
      defaultValue: "pending",
    },
  },
  {
    tableName: "ConnectionRequest",
    updatedAt: false,
  }
);

(async () => {
  await ConnectionRequest.sync({ force: false });
})();

ConnectionRequest.belongsTo(User, { foreignKey: "user", as: "request-sender" });
ConnectionRequest.belongsTo(User, { foreignKey: "withUser", as: "request-accept" });

module.exports = ConnectionRequest;