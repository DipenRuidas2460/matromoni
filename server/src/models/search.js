const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Search = sequelize.define(
  "Search",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    lookingFor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    aged1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    aged2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    community: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    livingIn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Search",
  }
);

(async () => {
  await Search.sync({ force: false });
})();

module.exports = Search;
