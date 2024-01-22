const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Plan = sequelize.define(
  "Plan",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    planName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    logo: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      trim: true,
    },
  },
  {
    tableName: "Plan",
    updatedAt: false,
  }
);

(async () => {
  await Plan.sync({ force: false });
})();

module.exports = Plan;
