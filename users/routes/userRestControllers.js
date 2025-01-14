const express = require("express");
const {
  registerUser,
  getUser,
  loginUser,
} = require("../models/userAccessDataService");
const auth = require("../../auth/authService");
const { handleError } = require("../../utils/handleErrors");
const { validateLogin, validateRegistration } = require("../validation/userValidationService");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const validateErrorMessage = validateRegistration(req.body);
    if (validateErrorMessage !== "") {
      return handleError(res, 400, "Validation" + validateErrorMessage);
    }
    let user = await registerUser(req.body);
    res.send(user);
  } catch (error) {
handleError(res, error.status || 400, error.message);
}
});

router.get("/:id", auth, async (req, res) => {
  try {
    const userInfo = req.user;
    let { id } = req.params;

    if (userInfo._id != id && !userInfo.isAdmin) {
      return res
        .status(403)
        .send(
          "Authorization Error: Only the same user or admin can get user info"
        );
    }

    let user = await getUser(id);
    res.send(user);
  } catch (error) {
    handleError(res, error.status || 400, error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const validateErrorMessage = validateLogin(req.body);
    if (validateErrorMessage !== "") {
      return handleError(res, 400, "Validation" + validateErrorMessage);
    }
    let { email, password } = req.body;
    const token = await loginUser(email, password);
    res.send(token);
  } catch (error) {
    handleError(res, error.status || 400, error.message);
  }
});

module.exports = router;