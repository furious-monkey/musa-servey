const Survey = require("../models/survey.model");

const createSurvey = (req, res) => {
  const surveyData = {
    level: req.body.level,
    location: req.body.location,
    day: req.body.day,
    season: req.body.season,
    time: req.body.time
  };
  Survey
    .createSurvey(surveyData)
    .then((resolve) => {
      res.json({
        success: true,
        result: resolve
      });
    })
    .catch();
};

const getSurvey = (req, res) => {
  if (req.body.location == undefined || req.body.season == undefined || req.body.day == undefined)
    res.send({ success: "false" });
  else {
    const data = {
      season: req.body.season,
      day: req.body.day,
      location: req.body.location,
    };
    console.log("Data:", data);
    Survey
      .getSurvey(data)
      .then((resolve) => {
        console.log("Resolve:", resolve);
        res.json({
          success: true,
          result: resolve
        });
      });
  }
};

module.exports = { createSurvey, getSurvey };
