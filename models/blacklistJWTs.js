"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BlacklistJWT extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }

  BlacklistJWT.init(
    {
      blacklistedJWTs: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "BlacklistJWT",
      indexes: [
        {
          name: "blacklist_jwts",
          unique: true,
          fields: ["blacklistedJWTs"],
        },
      ],
    }
  );
  return BlacklistJWT;
};
