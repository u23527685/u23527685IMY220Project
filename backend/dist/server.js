"use strict";

var _express = _interopRequireDefault(require("express"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
// CREATE APP
var app = (0, _express["default"])();
var port = process.env.PORT || 3000;
// SERVE A STATIC PAGE IN THE PUBLIC DIRECTORY
app.use(_express["default"]["static"]("frontend/public"));
// PORT TO LISTEN TO
app.listen(port, function () {
  console.log("Veyo app Listening on http://localhost:".concat(port));
});