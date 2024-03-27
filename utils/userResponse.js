const userResponse = function (user) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    profileType: user.profileType,
    authToken: user.authToken,
    bio: user.bio,
    phone: user.phone,
    photoURL: user.photoURL,
  };
};

module.exports = {
  userResponse,
};
