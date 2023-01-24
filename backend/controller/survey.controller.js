const Survey = require("../models/survey.model");

const createSurvey = (req, res) => {
  if (
    req.body.level == undefined ||
    req.body.location == undefined ||
    req.body.date == undefined ||
    req.body.time == undefined ||
    req.body.season == undefined
  )
    res.send({ success: "false" });
  else {
    const surveyData = {
      level: req.body.level,
      location: req.body.location,
      date: req.body.date,
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
  }
};

const getSurvey = (req, res) => {
  if (req.body.location == undefined || req.body.date == undefined)
    res.send({ success: "false" });
  else {
    const data = {
      type: req.body.type,
      date: req.body.date,
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
