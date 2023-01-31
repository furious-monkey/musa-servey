function createSurvey(data) {
  let queries = [];
  for(let i=0; i<data.level.length; i++){
    const query = [];
    query.push(data.level[i]);
    query.push(data.location[i]);
    query.push(data.day[i]);
    query.push(data.time[i]);
    query.push(data.season[i]);
    queries.push(query)
  }
  var sql = "INSERT INTO survey (level, location, day, time, season) VALUES ?"
  return new Promise(function (resolve, reject) {
    db.query(
      sql,
      [queries],
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
  let { season, day, location } = data;
  sql = "SELECT * FROM survey WHERE season=? AND location=? AND day=?";
  return new Promise(function (resolve, reject) {
    db.query(sql, [season, location, day], (err, res) => {
      if(err) {
        reject(err)
      }
      else {
        resolve(res)
      }
    })
  });
}

module.exports = {
  createSurvey,
  getSurvey
};
