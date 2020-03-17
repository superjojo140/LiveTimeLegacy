import express from "express";

const app = express();

app.get('/', function (req, res) {
  res.send('Hello my darling!');
});

app.listen(3546, function () {
  console.log('LiveTime Server listening on http://localhost:3546');
});