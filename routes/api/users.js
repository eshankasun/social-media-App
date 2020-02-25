/** @format */

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const User = require('../../model/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

//@route POST api/users
// @desc Register User
//@access public
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more Characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // check user exist
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }
      // gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      // Create new user
      user = new User({
        name,
        email,
        avatar,
        password
      });
      // Hash Password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);
      // save user in DB
      await user.save();
      // assighn JWT TOKEN
      const payload = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      };
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
