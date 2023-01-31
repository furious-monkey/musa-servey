const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const survey_routes = require("./routes/survey.routes");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api/survey", survey_routes);

global.db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "musadb",
});

db.connect(function (err) {
  if (err) throw err;
  console.log("Connected to MySQL!");
  console.log("Success!");
});

app.listen(5000, () => {
  console.log("Server started at http://localhost:5000");
});
