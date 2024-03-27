const jwt = require("jsonwebtoken");
const { User, BlacklistJWT } = require("@models");
const dotenv = require("dotenv");
const { messages, userConstants } = require("@constants");
const { Op } = require("sequelize");
const { userResponse } = require("@utils/userResponse");

dotenv.config();

function createJWTToken(userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "2h" });
  return token;
}

// Controller function for user registration
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, isAdmin, bio, phone, photoURL } = req.body;
    let { profileType } = req.body;
    let existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (isAdmin) {
      profileType = "private";
    }
    const authToken = await User.generateAuthToken();

    const newUser = await User.create({
      firstName: firstName || userConstants.defaultFName,
      lastName: lastName || userConstants.defaultLName,
      email,
      profileType: profileType || userConstants.defaultProfileType,
      password: password,
      authToken,
      bio,
      phone,
      isAdmin,
    });
    const token = createJWTToken(newUser.id);

    return res.status(201).json({ message: "User registered successfully", user: userResponse(newUser), token });
  } catch (error) {
    console.log(error, Object.keys(error));
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Controller function for user login
exports.login = async (req, res) => {
  try {
    let user = await User.findOne({ where: { email: { [Op.iLike]: req.body.email }, isDeleted: false } });

    if (!user || !user.passwordValid(req.body.password)) {
      res.status(200).json({ message: messages.USER.INVALID_CREDS, success: false });
      return;
    }
    const token = createJWTToken(user.id);

    return res.status(200).json({ message: "User logged in successfully", user: userResponse(user), token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Controller function for user logout
exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    let existingJWT = await BlacklistJWT.findOne({ where: { blacklistedJWTs: token } });
    if (existingJWT) {
      return res.status(200).json({ message: "User already logged out" });
    } else {
      await BlacklistJWT.create({
        blacklistedJWTs: token,
      });
    }
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.googleSignIn = async (req, res) => {
  return res.status(200).json({ message: "User logged in successfully" });
};
