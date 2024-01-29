const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const User = require("./user");

const Profile = sequelize.define(
  "Profile",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    profileImg: {
      type: DataTypes.STRING,
    },
    profileDescription: {
      type: DataTypes.STRING,
    },
    partners: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "Profile",
    updatedAt: false,
  }
);

(async () => {
  await Profile.sync({ force: false });
})();

Profile.belongsTo(User, { foreignKey: "userId" });

module.exports = Profile;
