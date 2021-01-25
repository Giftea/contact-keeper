const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator/check");
//we are bringing in the middleware auth we just created and it is for protected routes i.e private
const auth = require("../middleware/auth");
const User = require("../models/User");
const router = express.Router();

//@route   GET api/auth
// @desc   Get logged in user
//@access  Private
//to use our auth middlewarecreated we need to addd it as a second param
router.get("/", auth, async (req, res) => {
  try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
  } catch (error) {
      console.error(error.message)
      res.status(500).send('Server error')
  }
});

//@route   POST api/auth
// @desc   Auth user and get token
//@access  Public
router.post(
  "/",
  [
    check("email", "Please incldue a valid email").isEmail(),
    check("password", "Password should be longer than 6 characters").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
