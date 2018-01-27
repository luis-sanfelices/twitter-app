const express = require('express');
const router = express.Router();

const User = require('../models/user');

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;


router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (username === '' || password === '') {
    const error = 'Usuario y password no pueden estar vacios';
    res.render('auth/signup', { error });
  } else {
    User.findOne({ username })
      .then((user) => {
        if (!user) {
          const salt = bcrypt.genSaltSync(bcryptSalt);
          const hashPass = bcrypt.hashSync(password, salt);
          const newUser = {
            username,
            password: hashPass,
          };
          User.create(newUser)
            .then((doc) => {
              res.redirect('/');
            })
            .catch(() => {
              const error = 'Ha ocurrido algo al crear el usuario, vuelva a intentarlo';
              res.render('auth/signup', { error });
            });
        } else {
          const error = 'El usuario ya existe';
          res.render('auth/signup', { error });
        }
      })
      .catch((error) => {

      });
  }
});

module.exports = router;
