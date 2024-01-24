const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const User = require("./user");

const Connection = sequelize.define(
  "Connection",
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

  },
  {
    tableName: "Connection",
    updatedAt: false,
  }
);

(async () => {
  await Connection.sync({ force: false });
})();

Connection.belongsTo(User, { foreignKey: "user" });
Connection.belongsTo(User, { foreignKey: "withUser" });

module.exports = Connection;