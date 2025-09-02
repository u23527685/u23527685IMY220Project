import express from "express";
// CREATE APP
const app = express();
const port=process.env.PORT||3000;
// SERVE A STATIC PAGE IN THE PUBLIC DIRECTORY
app.use(express.static("frontend/public"));
// PORT TO LISTEN TO
app.listen(port, () => {
console.log(`Veyo app Listening on http://localhost:${port}`);
});