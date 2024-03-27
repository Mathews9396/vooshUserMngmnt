"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const { messages } = require("@constants");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // instance methods
    passwordValid(plainPassword) {
      return bcrypt.compareSync(plainPassword, this.password);
    }

    hashPassword(plainPassword) {
      return bcrypt.hashSync(plainPassword, salt);
    }

    static async generateAuthToken() {
      let authToken = uuidv4();
      const user = await User.findOne({ where: { authToken: authToken } });
      if (!user) {
        return authToken;
      }
      return User.generateAuthToken();
    }

    static async resetPassword(email, newPassword) {
      const user = await User.findOne({ where: { email: email } });
      await user.update({
        password: bcrypt.hashSync(newPassword, salt),
      });
    }
  }

  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: messages.USER.EMAIL_TAKEN },
      },
      profileType: {
        type: DataTypes.ENUM,
        values: ["public", "private"],
      },
      authToken: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [8, 150],
            msg: messages.USER.INVALID_PASSWORD,
          },
        },
      },
      bio: DataTypes.STRING,
      phone: DataTypes.STRING,
      photoURL: DataTypes.STRING,
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      hooks: {
        beforeCreate: (user, options) => {
          user.password = bcrypt.hashSync(user.password, salt);
        },
      },
      sequelize,
      modelName: "User",
      indexes: [
        {
          name: "Users_email_key",
          unique: true,
          fields: ["email"],
        },
        {
          name: "Users_authToken_key",
          unique: true,
          fields: ["authToken"],
        },
      ],
    }
  );
  return User;
};
