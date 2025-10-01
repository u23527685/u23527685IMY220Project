const express = require("express");
const path = require("path");

import * as api from "../api.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("frontend/public"));

// Handle all React Router routes
app.get('/', (req, res) => {
  res.sendFile(path.resolve('frontend', 'public', 'index.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.resolve('frontend', 'public', 'index.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.resolve('frontend', 'public', 'index.html'));
});

app.get('/profile/:username', (req, res) => {
  res.sendFile(path.resolve('frontend', 'public', 'index.html'));
});

app.get('/projects/:username', (req, res) => {
  res.sendFile(path.resolve('frontend', 'public', 'index.html'));
});

app.get('/projects/:username/:name/:owner', (req, res) => {
  res.sendFile(path.resolve('frontend', 'public', 'index.html'));
});

app.get('/project/:name/:owner', (req, res) => {
  res.sendFile(path.resolve('frontend', 'public', 'index.html'));
});


app.get("/api/projects",async(req,res)=> {
  const projects= await api.getAllProjects();
  res.json(projects);
})

app.get("/api/projects/:userid",async(req,res)=> {
  const {userid}=req.params;
  const projects= await api.userProjects(userid);
  res.json(projects);
})

app.post("/api/signup",async(req,res)=>{
  const newuser= await api.signupUser(req.body);
  res.json(newuser);
})

app.post("/api/login",async(req,res)=>{
  const newuser= await api.authenticateUser(req.body);
  res.json(newuser);
})

app.post("/api/project/feed",async(req,res)=>{
  const feed=await api.getActivityFeed(req.body);
  res.json(feed);
})

app.post("/api/project/discussions",async(req,res)=>{
  const feed=await api.getDiscussions(req.body);
  res.json(feed);
})

app.get("/api/types",async(req,res)=> {
  const projects= await api.getAllTypes();
  res.json(projects);
})

app.get("/api/types/:typeid",async(req,res)=> {
  const {typeid}=req.params;
  const projects= await api.getProjectType(typeid);
  res.json(projects);
})

app.get("/api/user/:userid",async(req,res)=>{
  const {userid}=req.params;
  const user= await api.getUser(userid)
  res.json(user);
})

async function startServer() {
    try {
        await api.connectToMongoDB();
        app.listen(port, () => {
            console.log(`Database running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

app.listen(port, () => {
  console.log(`Veyo app Listening on http://localhost:${port}`);
});

process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    await api.closeDatabaseConnection();
    process.exit(0);
});

startServer();