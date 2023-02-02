function signUp(userData) {
  return new Promise(function (resolve, reject) {
    db.query(
      "INSERT INTO user (email, password, remember) VALUES (?,?,?)",
      [
        userData.email,
        userData.password,
        userData.remember
      ],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

function findUser(email) {
  return new Promise(function (resolve, reject) {
    db.query(
      "SELECT * FROM user WHERE email=?",
      [email],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

function loginUser(email) {
  return new Promise(function (resolve, reject) {
    db.query(
      "SELECT * FROM user WHERE email=?",
      [email],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

module.exports = {
  signUp,
  findUser,
  loginUser,
};
