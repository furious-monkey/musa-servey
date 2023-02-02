const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signUp = (req, res) => {
  if (
    req.body.password == undefined ||
    req.body.email == undefined
  )
    res.send({ hello: "hello" });
  else {
    const userData = {
      password: req.body.password,
      email: req.body.email,
      remember: req.body.remember
    };
    userModel
      .findUser(userData.email)
      .then((resolve) => {
        if (resolve.length > 0)
          res.send({ success: false, error: "Email is already exist" });
        else {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(userData.password, salt, (err, hash) => {
              if (err) throw err;
              userData.password = hash;
              userModel
                .signUp(userData)
                .then((resolve) => {
                  res.send({
                    success: true,
                    resolve
                  });
                })
                .catch();
            });
          });
        }
      });
  }
};

const signIn = (req, res) => {
  if (req.body.email == undefined || req.body.password == undefined)
    res.send({ hello: "hello" });
  else {
    const userData = {
      email: req.body.email,
      password: req.body.password,
      remember: req.body.remember
    };
    userModel.loginUser(userData.email).then((resolve) => {
      if (resolve.length == 0) res.send({ success: false, error: "User not found" });
      else {
        bcrypt
          .compare(userData.password, resolve[0].password)
          .then((isMatch) => {
            if (isMatch) {
              // User Matched
              const payload = {
                id: resolve[0].id,
                email: resolve[0].email,
              }; // Create JWT Payload

              // Sign Token
              jwt.sign(payload, "secret", { expiresIn: 3600 }, (err, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token,
                });
              });
            } else {
              return res.json({ success: false, error: "Password incorrect" });
            }
          });
      }
    });
  }
};

module.exports = { signUp, signIn };
