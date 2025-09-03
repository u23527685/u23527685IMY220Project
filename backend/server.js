const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("frontend/public"));

app.get('/home', (req, res) => {
  res.sendFile(path.resolve('frontend', 'public', 'index.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve('frontend', 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Veyo app Listening on http://localhost:${port}`);
});