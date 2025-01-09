const { generateAuthToken } = require("../../auth/providers/jwt");
const { createError } = require("../../utils/handleErrors");
const { generatePassword } = require("../helpers/bcrypt");
const User = require("./mongodb/User");

const registerUser = async (newUser) => {
  try {
    newUser.password = generatePassword(newUser.password);
    let user = new User(newUser);
    user = await user.save();
    user = { email: user.email, name: user.name, _id: user._id };
    return user;
  } catch (error) {
    return createError("Mongoose", error);
  }
};

const getUser = async (UserId) => {
  try {
    let user = await User.findById(UserId);
    return user;
  } catch (error) {
    return createError("Mongoose", error);
  }
};

const loginUser = async (email, password) => {
  try {
    const userFromBD = await User.findOne({ email });
    if (!userFromBD) {
const error = new Error("user not exist , please register");
error.status = 401; 
createError("Authentication", error);

    }
    if (userFromBD.password !== password) {
      const error = new Error("password not correct");
      error.status = 401; 
      createError("Authentication", error);    }
    const token = generateAuthToken(userFromBD);
    return token;
  } catch (error) {
createError("Mongoose", error);
  }
};

module.exports = { registerUser, getUser, loginUser };