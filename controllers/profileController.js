const { User } = require("@models");
const { Op } = require("sequelize");
const { userResponse } = require("@utils/userResponse");

// Controller function for getting current user's profile
exports.getMyProfile = async (req, res) => {
  try {
    let user = await User.findOne({ where: { id: req.user.userId, isDeleted: false } });
    if (!user) {
      res.status(httpStatuses.SUCCESS).json({ message: "User not found", success: false });
      return;
    }
    return res.status(200).json({ message: "User profile fetched successfully", user: userResponse(user) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Controller function for editing current user's profile
exports.editMyProfile = async (req, res) => {
  try {
    let user = await User.findOne({ where: { id: req.user.userId, isDeleted: false } });
    if (!user) {
      res.status(httpStatuses.SUCCESS).json({ message: "User not found", success: false });
      return;
    }
    const { email, firstName, lastName, bio, photoURL, phone, password } = req.body;
    user.email = email || user.email;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.bio = bio || user.bio;
    user.photoURL = photoURL || user.photoURL;
    user.phone = phone || user.phone;
    if (password) {
      let hashPassword = user.hashPassword(password);
      user.password = hashPassword;
    }

    await user.save();

    return res.status(200).json({ message: "User profile updated successfully", user: userResponse(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Controller function for getting all profiles (only accessible by admin users)
exports.getAllProfiles = async (req, res) => {
  try {
    let user = await User.findOne({ where: { id: req.user.userId, isDeleted: false } });
    if (!user) {
      res.status(httpStatuses.SUCCESS).json({ message: "User not found", success: false });
      return;
    }

    let allProfileProfileFilter = `public`;
    if (user.isAdmin) {
      console.log(`user is admin so fetching all profiles`);
      allProfileProfileFilter = {
        [Op.ne]: null,
      };
    } else {
      console.log(`user is not admin so fetching only public profiles`);
    }
    const allProfiles = await User.findAll({
      where: {
        profileType: allProfileProfileFilter,
        isDeleted: false,
      },
      attributes: {
        exclude: ["password", "authToken", "isAdmin"],
      },
    });
    res.json(allProfiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
