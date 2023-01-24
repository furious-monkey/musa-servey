function createSurvey(data) {
  return new Promise(function (resolve, reject) {
    db.query(
      "INSERT INTO survey (level, location, date, time, season) VALUES (?,?,?,?,?)",
      [
        data.level,
        data.location,
        data.date,
        data.time,
        data.season
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

async function getSurvey(data) {
  let sql;
  let { type, date, location } = data;
  console.log("Date:", date, typeof (date));
  switch (type) {
    case "month": {
      let year = parseInt(date.slice(0, 4));
      let month = parseInt(date.slice(5, 7));
      sql = "SELECT * FROM `survey` WHERE YEAR(date)=? AND MONTH(date)=? AND location=?";
      return new Promise(function (resolve, reject) {
        db.query(
          sql,
          [year, month, location],
          (err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          }
        );
      });
    }
    case "date": {
      sql = "SELECT * FROM `survey` WHERE DATE(date)=? AND location=?";
      date = date.slice(0, 10);
      return new Promise(function (resolve, reject) {
        db.query(
          sql,
          [date, location],
          (err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          }
        );
      });
    }
    case "season":
    case "year": {
      date = parseInt(date);
      sql = "SELECT * FROM `survey` WHERE YEAR(date)=? AND location=?";
      return new Promise(function (resolve, reject) {
        db.query(
          sql,
          [date, location],
          (err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          }
        );
      });
    }
    default: break;
  }

}

module.exports = {
  createSurvey,
  getSurvey
};
