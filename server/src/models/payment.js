const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const User = require("./user");

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    subscription: {
      type: DataTypes.JSON,
    },

    plan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      trim: true,
    },

  },
  {
    tableName: "Payment",
    updatedAt: false,
  }
);

(async () => {
  await Payment.sync({ force: false });
})();

Payment.belongsTo(User, { foreignKey: "userId" });

module.exports = Payment;
