"use strict";

var express = require("express");
var path = require("path");
var app = express();
var port = process.env.PORT || 3000;
app.use(express["static"]("frontend/public"));
app.get('/profile', function (req, res) {
  res.sendFile(path.resolve('frontend', 'public', 'index.html'));
});
app.get('/home', function (req, res) {
  res.sendFile(path.resolve('frontend', 'public', 'index.html'));
});
app.get('/', function (req, res) {
  res.sendFile(path.resolve('frontend', 'public', 'index.html'));
});
app.listen(port, function () {
  console.log("Veyo app Listening on http://localhost:".concat(port));
});