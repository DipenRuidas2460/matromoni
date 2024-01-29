const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const User = require("./user");

const Partner = sequelize.define(
  "Partner",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    partnerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Partner",
    updatedAt: false,
  }
);

(async () => {
  await Partner.sync({ force: false });
})();

Partner.belongsTo(User, { foreignKey: "userId" });
Partner.belongsTo(User, { foreignKey: "partnerId" });

module.exports = Partner;
