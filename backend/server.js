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

// api calls

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

app.get("/ap/project/:projectId",async(req,res)=>{
  const {projectId}=req.params;
  const user= await api.getProject(projectId);
  res.json(user);
})

app.put("/api/user", async (req, res) => {
  try {
    const { _id, ...updateData } = req.body;
    if (!_id || typeof _id !== 'string') {
      return res.status(400).json({ success: false, message: 'User  ID is required and must be a string' });
    }

    const response = await api.updateUserInfo(req.body);
    
    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response); 
    }
  } catch (error) {
    console.error("Error updating user: ", error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.put("/api/project",async(req,res)=>{
  const response= await api.updateProject(req.body);
  res.json(response);
})

app.post("/api/projects/create", async (req, res) => {
    const ownerId = req.body.ownerId;
    const response = await api.createProject(req.body, ownerId);
    res.json(response);
});

app.post('/api/friends/request', async (req, res) => {
  try {
    const { receiverId,senderId } = req.body;

    // Check for self-request
    if (senderId === receiverId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot send friend request to yourself' 
      });
    }

    const response = await api.sendFriendRequest(senderId, receiverId);
    res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error('Error in send friend request route:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/friends/accept', async (req, res) => {
  try {
    const { senderId,receiverId } = req.body;

    // Check for self-accept
    if (receiverId === senderId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot accept your own request' 
      });
    }

    const response = await api.acceptFriendRequest(receiverId, senderId);
    res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error('Error in accept friend request route:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/friends/decline', async (req, res) => {
  try {
    const { senderId,receiverId } = req.body;

    // Check for self-decline
    if (receiverId === senderId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot decline your own request' 
      });
    }

    const response = await api.declineFriendRequest(receiverId, senderId);
    res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error('Error in decline friend request route:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/friends/remove', async (req, res) => {
  try {
    const { friendId,userId } = req.body;

    // Check for self-remove
    if (userId === friendId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot remove yourself as a friend' 
      });
    }

    const response = await api.removeFriend(userId, friendId);
    res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error('Error in remove friend route:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post("/api/activity",async(req,res)=>{
  try{
    const response = await api.addActivityEntry(req.body);
    res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error('Error in remove friend route:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
})

app.post("/api/discussion",async(req,res)=>{
  try{
    const response = await api.addDiscussionEntry(req.body);
    res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error('Error in remove friend route:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
})

// DELETE /api/projects/:projectId - Delete a project (requires auth, must be owner)
app.delete('/api/projects/:projectId/:requesterId', async (req, res) => {
  try {
    const { projectId,requesterId } = req.params;

    // Validate projectId format
    if (!projectId) {
      return res.status(400).json({ 
        success: false, 
        message: 'project id needed' 
      });
    }

    const response = await api.deleteProject(projectId,requesterId);
    res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error('Error in delete project route:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/users/:userId - Delete a user (requires auth, must be self)
app.delete('/api/users/:userId/:requesterId', async (req, res) => {
  try {
    const { userId,requesterId } = req.params;

    // Validate userId format and ensure self-deletion
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'UserId needed' 
      });
    }
    if (userId !== requesterId) {
      return res.status(403).json({ success: false, message: 'You can only delete your own account' });
    }

    const response = await api.deleteUser (userId,requesterId);
    res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error('Error in delete user route:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


//api
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