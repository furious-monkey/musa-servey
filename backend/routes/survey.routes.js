const express = require("express");
const surveyController = require("../controller/survey.controller");
const router = express.Router();

router.post("/createSurvey", surveyController.createSurvey);
router.post("/getSurvey", surveyController.getSurvey);

module.exports = router;
