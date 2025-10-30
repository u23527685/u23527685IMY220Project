import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import * as api from "../backend/api";
import multer from "multer";
import fs from "fs";
import { ObjectId } from 'mongodb';
import { use } from "react";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("frontend/public"));

// Error code to HTTP status code mapping
const errorCodeToStatus = {
  // 400 - Bad Request
  MISSING_CREDENTIALS: 400,
  MISSING_FIELDS: 400,
  MISSING_USER_ID: 400,
  MISSING_PROJECT_ID: 400,
  MISSING_TYPE_ID: 400,
  MISSING_IDS: 400,
  MISSING_OWNER_ID: 400,
  MISSING_PROJECT_NAME: 400,
  MISSING_PROJECT_TYPE: 400,
  MISSING_SEARCH_TERM: 400,
  MISSING_FILE: 400,
  MISSING_FILENAME: 400,
  INVALID_EMAIL: 400,
  INVALID_USER_ID: 400,
  INVALID_PROJECT_ID: 400,
  INVALID_TYPE_ID: 400,
  INVALID_ID_FORMAT: 400,
  INVALID_OWNER_ID: 400,
  INVALID_FEED_FORMAT: 400,
  INVALID_DISCUSSIONS_FORMAT: 400,
  SELF_REQUEST: 400,
  REQUEST_INCORRECT: 400,

  // 401 - Unauthorized
  INVALID_CREDENTIALS: 401,

  // 403 - Forbidden
  UNAUTHORIZED: 403,

  // 404 - Not Found
  USER_NOT_FOUND: 404,
  PROJECT_NOT_FOUND: 404,
  TYPE_NOT_FOUND: 404,
  REQUEST_NOT_FOUND: 404,
  FILE_NOT_FOUND: 404,
  ENDPOINT_NOT_FOUND: 404,

  // 409 - Conflict
  USER_EXISTS: 409,
  USERNAME_TAKEN: 409,
  PROJECT_NAME_EXISTS: 409,
  ALREADY_FRIENDS: 409,
  ALREADY_MEMBER: 409,
  REQUEST_EXISTS: 409,

  // 422 - Unprocessable Entity
  NOT_MEMBER: 422,

  // 500 - Internal Server Error (default)
  AUTH_ERROR: 500,
  SIGNUP_ERROR: 500,
  FETCH_PROJECTS_ERROR: 500,
  FETCH_USER_PROJECTS_ERROR: 500,
  FETCH_ACTIVITY_ERROR: 500,
  FETCH_DISCUSSIONS_ERROR: 500,
  FETCH_TYPES_ERROR: 500,
  FETCH_PROJECT_TYPE_ERROR: 500,
  FETCH_USER_ERROR: 500,
  FETCH_PROJECT_ERROR: 500,
  FETCH_FILES_ERROR: 500,
  FETCH_FILE_ERROR: 500,
  UPDATE_USER_ERROR: 500,
  UPDATE_PROJECT_ERROR: 500,
  CREATE_PROJECT_ERROR: 500,
  PROJECT_INSERT_FAILED: 500,
  USER_UPDATE_FAILED: 500,
  FRIEND_REQUEST_ERROR: 500,
  ACCEPT_REQUEST_ERROR: 500,
  DECLINE_REQUEST_ERROR: 500,
  REMOVE_FRIEND_ERROR: 500,
  ADD_ACTIVITY_ERROR: 500,
  ACTIVITY_INSERT_FAILED: 500,
  ADD_DISCUSSION_ERROR: 500,
  DISCUSSION_INSERT_FAILED: 500,
  DELETE_PROJECT_ERROR: 500,
  DELETE_USER_ERROR: 500,
  DELETE_FAILED: 500,
  SEARCH_USERS_ERROR: 500,
  SEARCH_ALL_ERROR: 500,
  ADD_MEMBER_ERROR: 500,
  PROMOTE_MEMBER_ERROR: 500,
  PIN_PROJECT_ERROR: 500,
  ASP_ERROR: 500,
  UPLOAD_ERROR: 500,
  FILE_TOO_LARGE: 400,
  SERVER_ERROR: 500
};

// Helper function to get appropriate status code
function getStatusCode(errorCode) {
  return errorCodeToStatus[errorCode] || 500;
}

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

app.get('/project/:name/:owner/:projectId', (req, res) => {
  res.sendFile(path.resolve('frontend', 'public', 'index.html'));
});

app.get('/project/:name/:owner', (req, res) => {
  res.sendFile(path.resolve('frontend', 'public', 'index.html'));
});

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// File upload configuration
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const projectId = req.params.projectId;
    const uniqueName = `${projectId}_${file.originalname}`;
    cb(null, uniqueName);
  }
});

export const upload = multer({ storage });

// ---------- PROFILE UPLOADS ----------
const profileUploadDir = path.join(process.cwd(), "profiles");
if (!fs.existsSync(profileUploadDir)) fs.mkdirSync(profileUploadDir);

const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, profileUploadDir);
  },
  filename: function (req, file, cb) {
    const userId = req.params.userId;
    const uniqueName = `${userId}_profile${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

export const profileUpload = multer({ storage: profileStorage });
// API Routes

app.get("/api/projects", async (req, res) => {
  try {
    const projects = await api.getAllProjects();
    if (projects.success) {
      res.status(200).json(projects);
    } else {
      const statusCode = getStatusCode(projects.errorCode);
      res.status(statusCode).json(projects);
    }
  } catch (error) {
    console.error('Error in /api/projects:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      errorCode: 'SERVER_ERROR'
    });
  }
});

app.get("/api/projects/:userid", async (req, res) => {
  try {
    const { userid } = req.params;
    
    if (!userid) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required',
        errorCode: 'MISSING_USER_ID'
      });
    }

    const projects = await api.userProjects(userid);
    
    if (projects.success) {
      res.status(200).json(projects);
    } else {
      const statusCode = getStatusCode(projects.errorCode);
      res.status(statusCode).json(projects);
    }
  } catch (error) {
    console.error('Error in /api/projects/:userid:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      errorCode: 'SERVER_ERROR'
    });
  }
});

app.post("/api/signup", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    if (!username || !password || !email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username, password, and email are required',
        errorCode: 'MISSING_FIELDS'
      });
    }

    const newuser = await api.signupUser(req.body);
    
    if (newuser.success) {
      res.status(201).json(newuser);
    } else {
      const statusCode = getStatusCode(newuser.errorCode);
      res.status(statusCode).json(newuser);
    }
  } catch (error) {
    console.error('Error in /api/signup:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      errorCode: 'SERVER_ERROR'
    });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required',
        errorCode: 'MISSING_CREDENTIALS'
      });
    }

    const result = await api.authenticateUser(req.body);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      const statusCode = getStatusCode(result.errorCode);
      res.status(statusCode).json(result);
    }
  } catch (error) {
    console.error('Error in /api/login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      errorCode: 'SERVER_ERROR'
    });
  }
});

app.post("/api/project/feed", async (req, res) => {
  try {
    if (!req.body || !Array.isArray(req.body)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid feed format',
        errorCode: 'INVALID_FEED_FORMAT'
      });
    }

    const feed = await api.getActivityFeed(req.body);
    
    if (feed.success) {
      res.status(200).json(feed);
    } else {
      const statusCode = getStatusCode(feed.errorCode);
      res.status(statusCode).json(feed);
    }
  } catch (error) {
    console.error('Error in /api/project/feed:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      errorCode: 'SERVER_ERROR'
    });
  }
});

app.post("/api/project/discussions", async (req, res) => {
  try {
    if (!req.body || !Array.isArray(req.body)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid discussions format',
        errorCode: 'INVALID_DISCUSSIONS_FORMAT'
      });
    }

    const discussions = await api.getDiscussions(req.body);
    
    if (discussions.success) {
      res.status(200).json(discussions);
    } else {
      const statusCode = getStatusCode(discussions.errorCode);
      res.status(statusCode).json(discussions);
    }
  } catch (error) {
    console.error('Error in /api/project/discussions:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      errorCode: 'SERVER_ERROR'
    });
  }
});

app.get("/api/types", async (req, res) => {
  try {
    const types = await api.getAllTypes();
    
    if (types.success) {
      res.status(200).json(types);
    } else {
      const statusCode = getStatusCode(types.errorCode);
      res.status(statusCode).json(types);
    }
  } catch (error) {
    console.error('Error in /api/types:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      errorCode: 'SERVER_ERROR'
    });
  }
});

app.get("/api/types/:typeid", async (req, res) => {
  try {
    const { typeid } = req.params;
    
    if (!typeid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Type ID is required',
        errorCode: 'MISSING_TYPE_ID'
      });
    }

    const types = await api.getProjectType(typeid);
    
    if (types.success) {
      res.status(200).json(types);
    } else {
      const statusCode = getStatusCode(types.errorCode);
      res.status(statusCode).json(types);
    }
  } catch (error) {
    console.error('Error in /api/types/:typeid:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      errorCode: 'SERVER_ERROR'
    });
  }
});

app.get("/api/user/:userid", async (req, res) => {
  try {
    const { userid } = req.params;
    
    if (!userid) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required',
        errorCode: 'MISSING_USER_ID'
      });
    }

    const user = await api.getUser(userid);
    
    if (user.success) {
      res.status(200).json(user);
    } else {
      const statusCode = getStatusCode(user.errorCode);
      res.status(statusCode).json(user);
    }
  } catch (error) {
    console.error('Error in /api/user/:userid:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      errorCode: 'SERVER_ERROR'
    });
  }
});

app.get("/ap/project/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    
    if (!projectId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project ID is required',
        errorCode: 'MISSING_PROJECT_ID'
      });
    }

    const project = await api.getProject(projectId);
    
    if (project.success) {
      res.status(200).json(project);
    } else {
      const statusCode = getStatusCode(project.errorCode);
      res.status(statusCode).json(project);
    }
  } catch (error) {
    console.error('Error in /ap/project/:projectId:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      errorCode: 'SERVER_ERROR'
    });
  }
});

app.put("/api/user", async (req, res) => {
  try {
    const { _id, ...updateData } = req.body;
    
    if (!_id || typeof _id !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required and must be a string',
        errorCode: 'MISSING_USER_ID'
      });
    }

    const response = await api.updateUserInfo(req.body);
    
    if (response.success) {
      res.status(200).json(response);
    } else {
      const statusCode = getStatusCode(response.errorCode);
      res.status(statusCode).json(response);
    }
  } catch (error) {
    console.error("Error in /api/user PUT:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      errorCode: 'SERVER_ERROR'
    });
  }
});

app.put("/api/project", async (req, res) => {
  try {
    if (!req.body._id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project ID is required',
        errorCode: 'MISSING_PROJECT_ID'
      });
    }

    const response = await api.updateProject(req.body);
    
    if (response.success) {
      res.status(200).json(response);
    } else {
      const statusCode = getStatusCode(response.errorCode);
      res.status(statusCode).json(response);
    }
  } catch (error) {
    console.error("Error in /api/project PUT:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      errorCode: 'SERVER_ERROR'
    });
  }
});

app.post("/api/projects/create", async (req, res) => {
  try {
    const { ownerId, projectName, projectType } = req.body;
    
    if (!ownerId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Owner ID is required',
        errorCode: 'MISSING_OWNER_ID'
      });
    }

    if (!projectName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project name is required',
        errorCode: 'MISSING_PROJECT_NAME'
      });
    }

    if (!projectType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project type is required',
        errorCode: 'MISSING_PROJECT_TYPE'
      });
    }

    const response = await api.createProject(req.body, ownerId);
    
    if (response.success) {
      res.status(201).json(response);
    } else {
      const statusCode = getStatusCode(response.errorCode);
      res.status(statusCode).json(response);
    }
  } catch (error) {
    console.error("Error in /api/projects/create:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      errorCode: 'SERVER_ERROR'
    });
  }
});

app.post('/api/friends/request', async (req, res) => {
  try {
    const { receiverId, senderId } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Sender and receiver IDs are required',
        errorCode: 'MISSING_IDS'
      });
    }

    if (senderId === receiverId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot send friend request to yourself',
        errorCode: 'SELF_REQUEST'
      });
    }

    const response = await api.sendFriendRequest(senderId, receiverId);
    
    if (response.success) {
      res.status(200).json(response);
    } else {
      const statusCode = getStatusCode(response.errorCode);
      res.status(statusCode).json(response);
    }
  } catch (error) {
    console.error('Error in /api/friends/request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      errorCode: 'SERVER_ERROR'
    });
  }
});

app.post('/api/friends/accept', async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Sender and receiver IDs are required',
        errorCode: 'MISSING_IDS'
      });
    }

    if (receiverId === senderId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot accept your own request',
        errorCode: 'SELF_REQUEST'
      });
    }

    const response = await api.acceptFriendRequest(receiverId, senderId);
    
    if (response.success) {
      res.status(200).json(response);
    } else {
      const statusCode = getStatusCode(response.errorCode);
      res.status(statusCode).json(response);
    }
  } catch (error) {
    console.error('Error in /api/friends/accept:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      errorCode: 'SERVER_ERROR'
    });
  }
});

app.post('/api/friends/decline', async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Sender and receiver IDs are required',
        errorCode: 'MISSING_IDS'
      });
    }

    if (receiverId === senderId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot decline your own request',
        errorCode: 'SELF_REQUEST'
      });
    }

    const response = await api.declineFriendRequest(receiverId, senderId);
    
    if (response.success) {
      res.status(200).json(response);
    } else {
      const statusCode = getStatusCode(response.errorCode);
      res.status(statusCode).json(response);
    }
  } catch (error) {
    console.error('Error in /api/friends/decline:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      errorCode: 'SERVER_ERROR'
    });
  }
});

app.post('/api/friends/remove', async (req, res) => {
  try {
    const { friendId, userId } = req.body;

    if (!userId || !friendId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID and friend ID are required',
        errorCode: 'MISSING_IDS'
      });
    }

    if (userId === friendId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot remove yourself as a friend',
        errorCode: 'SELF_REQUEST'
      });
    }

    const response = await api.removeFriend(userId, friendId);
    
    if (response.success) {
      res.status(200).json(response);
    } else {
      const statusCode = getStatusCode(response.errorCode);
      res.status(statusCode).json(response);
    }
  } catch (error) {
    console.error('Error in /api/friends/remove:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      errorCode: 'SERVER_ERROR'
    });
  }
});

app.post("/api/activity", async (req, res) => {
  try {
    const { projectId, userId, type, message } = req.body;

    if (!projectId || !userId || !type || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project ID, user ID, type, and message are required',
        errorCode: 'MISSING_FIELDS'
      });
    }

    const response = await api.addActivityEntry(req.body);
    
    if (response.success) {
      res.status(201).json(response);
    } else {
      const statusCode = getStatusCode(response.errorCode);
      res.status(statusCode).json(response);
    }
  } catch (error) {
    console.error('Error in /api/activity:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      errorCode: 'SERVER_ERROR'
    });
  }
});

app.post("/api/discussion", async (req, res) => {
  try {
    const { projectId, userId, message } = req.body;

    if (!projectId || !userId || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project ID, user ID, and message are required',
        errorCode: 'MISSING_FIELDS'
      });
    }

    const response = await api.addDiscussionEntry(req.body);
    
    if (response.success) {
      res.status(201).json(response);
    } else {
      const statusCode = getStatusCode(response.errorCode);
      res.status(statusCode).json(response);
    }
  } catch (error) {
    console.error('Error in /api/discussion:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      errorCode: 'SERVER_ERROR'
    });
  }
});

app.delete('/api/projects/:projectId/:requesterId', async (req, res) => {
  try {
    const { projectId, requesterId } = req.params;

    if (!projectId || !requesterId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project ID and requester ID are required',
        errorCode: 'MISSING_IDS'
      });
    }

    const response = await api.deleteProject(projectId, requesterId);
    
    if (response.success) {
      res.status(200).json(response);
    } else {
      const statusCode = getStatusCode(response.errorCode);
      res.status(statusCode).json(response);
    }
  } catch (error) {
    console.error('Error in DELETE /api/projects/:projectId/:requesterId:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      errorCode: 'SERVER_ERROR'
    });
  }
});

app.delete('/api/users/:userId/:requesterId', async (req, res) => {
  try {
    const { userId, requesterId } = req.params;

    if (!userId || !requesterId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID and requester ID are required',
        errorCode: 'MISSING_IDS'
      });
    }

    if (userId !== requesterId) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only delete your own account',
        errorCode: 'UNAUTHORIZED'
      });
    }

    const response = await api.deleteUser(userId, requesterId);
    
    if (response.success) {
      res.status(200).json(response);
    } else {
      const statusCode = getStatusCode(response.errorCode);
      res.status(statusCode).json(response);
    }
  } catch (error) {
    console.error('Error in DELETE /api/users/:userId/:requesterId:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      errorCode: 'SERVER_ERROR'
    });
  }
});

app.get("/api/users/search", async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ 
        success: false, 
        message: "Search term 'q' is required",
        errorCode: 'MISSING_SEARCH_TERM'
      });
    }

    const response = await api.searchUsers(q);
    
    if (response.success) {
      res.status(200).json(response);
    } else {
      const statusCode = getStatusCode(response.errorCode);
      res.status(statusCode).json(response);
    }
  } catch (error) {
    console.error('Error in /api/users/search:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      errorCode: 'SERVER_ERROR'
    });
  }
});

app.get("/api/search", async (req, res) => { 
  try {
    const { q: searchTerm } = req.query;
    
    if (!searchTerm) {
      return res.status(400).json({ 
        success: false, 
        message: "Search term 'q' is required",
        errorCode: 'MISSING_SEARCH_TERM'
      });
    }

    const response = await api.searchAll(searchTerm);
    
    if (response.success) {
      res.status(200).json(response);
    } else {
      const statusCode = getStatusCode(response.errorCode);
      res.status(statusCode).json(response);
    }
  } catch (error) {
    console.error('Error in /api/search:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      errorCode: 'SERVER_ERROR'
    });
  }
});

app.post("/api/projects/add-member", async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    if (!projectId || !userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project ID and user ID are required',
        errorCode: 'MISSING_IDS'
      });
    }

    const response = await api.addMemberToProject(projectId, userId);
    
    if (response.success) {
      res.status(200).json(response);
    } else {
      const statusCode = getStatusCode(response.errorCode);
      res.status(statusCode).json(response);
    }
  } catch (error) {
    console.error('Error in /api/projects/add-member:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      errorCode: 'SERVER_ERROR'
    });
  }
});

app.post("/api/projects/promote", async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    if (!projectId || !userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project ID and user ID are required',
        errorCode: 'MISSING_IDS'
      });
    }

    const response = await api.promoteMemberToOwner(projectId, userId);
    
    if (response.success) {
      res.status(200).json(response);
    } else {
      const statusCode = getStatusCode(response.errorCode);
      res.status(statusCode).json(response);
    }
  } catch (error) {
    console.error('Error in /api/projects/promote:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      errorCode: 'SERVER_ERROR'
    });
  }
});

app.post("/api/users/pin", async (req, res) => {
  try {
    const { userId, projectId } = req.body;

    if (!userId || !projectId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID and project ID are required',
        errorCode: 'MISSING_IDS'
      });
    }

    const response = await api.pinProjectToUser(userId, projectId);
    
    if (response.success) {
      res.status(200).json(response);
    } else {
      const statusCode = getStatusCode(response.errorCode);
      res.status(statusCode).json(response);
    }
  } catch (error) {
    console.error('Error in /api/users/pin:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      errorCode: 'SERVER_ERROR'
    });
  }
});

app.post("/api/projects/:projectId/upload", upload.single("file"), async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!ObjectId.isValid(projectId)) {
      return res.status(400).json({ success: false, message: "Invalid project ID" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const db = await api.connectToMongoDB();
    const projectObjectId = new ObjectId(projectId);
    const project = await db.collection("projects").findOne({ _id: projectObjectId });

    if (!project) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const fileName = req.file.originalname;
    const storedName = `${projectId}_${fileName}`;
    const filePath = path.join(uploadDir, storedName);

    // If existing file with same name, delete it first
    if (fs.existsSync(filePath) && filePath !== req.file.path) {
      fs.unlinkSync(filePath);
    }

    const fileData = {
      fileName,
      filePath: `/uploads/${storedName}`,
      fileSize: req.file.size,
      uploadedAt: new Date(),
      lastModifiedAt: new Date()
    };

    // Update DB: replace old file entry if it exists
    await db.collection("projects").updateOne(
      { _id: projectObjectId },
      {
        $pull: { files: { fileName } },
        $push: { files: fileData }
      }
    );

    res.status(201).json({
      success: true,
      message: "File uploaded/updated successfully",
      file: fileData
    });
  } catch (error) {
    console.error("Error uploading project file:", error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: "Upload failed", error: error.message });
  }
});

app.post("/api/user/:userId/upload", profileUpload.single("file"), async (req, res) => {
  try {
    const { userId } = req.params;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const db = await api.connectToMongoDB();
    const userObjectId = new ObjectId(userId);
    const user = await db.collection("users").findOne({ _id: userObjectId });

    if (!user) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const storedName = `${userId}_profile${path.extname(req.file.originalname)}`;
    const filePath = path.join(profileUploadDir, storedName);

    // Overwrite existing file if it exists
    if (fs.existsSync(filePath) && filePath !== req.file.path) {
      fs.unlinkSync(filePath);
    }

    const fileData = {
      fileName: req.file.originalname,
      filePath: `/profiles/${storedName}`,
      fileSize: req.file.size,
      uploadedAt: new Date(),
      lastModifiedAt: new Date()
    };

    // Update user's profile picture in DB
    await db.collection("users").updateOne(
      { _id: userObjectId },
      { $set: { profilePicture: fileData } }
    );

    res.status(201).json({
      success: true,
      message: "Profile picture uploaded/updated successfully",
      file: fileData
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: "Upload failed", error: error.message });
  }
});

app.get("/api/projects/:projectId/files", async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({ 
        success: false, 
        message: "Project ID is required",
        errorCode: "MISSING_PROJECT_ID"
      });
    }

    const response = await api.getProjectFiles(projectId);

    if (response.success) {
      return res.status(200).json(response);
    }

    const statusCode = getStatusCode(response.errorCode);
    return res.status(statusCode).json(response);

  } catch (error) {
    console.error("Error in /api/projects/:projectId/files:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      errorCode: "SERVER_ERROR",
      error: error.message
    });
  }
});


app.get("/api/projects/:projectId/files/:filename", async (req, res) => {
  try {
    const { projectId, filename } = req.params;

    if (!projectId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project ID is required',
        errorCode: 'MISSING_PROJECT_ID'
      });
    }

    if (!filename) {
      return res.status(400).json({ 
        success: false, 
        message: 'Filename is required',
        errorCode: 'MISSING_FILENAME'
      });
    }

    const filePath = path.join(process.cwd(), "uploads", `${projectId}_${filename}`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        success: false, 
        message: "File not found",
        errorCode: 'FILE_NOT_FOUND'
      });
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error("Error serving file:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching file",
      errorCode: 'FETCH_FILE_ERROR',
      error: error.message
    });
  }
});

app.get("/api/users/:userId/profile", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: "User ID is required",
        errorCode: "MISSING_USER_ID"
      });
    }

    const profileDir = path.join(process.cwd(), "profiles");
    if (!fs.existsSync(profileDir)) {
      return res.status(404).json({
        success: false,
        message: "Profile directory not found",
        errorCode: "DIR_NOT_FOUND"
      });
    }

    // Dynamically find the correct file (any extension)
    const files = fs.readdirSync(profileDir);
    const matchingFile = files.find(f => f.startsWith(`${userId}_profile`));

    if (!matchingFile) {
      return res.status(404).json({
        success: false,
        message: "Profile image not found",
        errorCode: "FILE_NOT_FOUND"
      });
    }

    const filePath = path.join(profileDir, matchingFile);
    res.sendFile(filePath);
  } catch (error) {
    console.error("Error serving profile image:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching file",
      errorCode: "FETCH_FILE_ERROR",
      error: error.message
    });
  }
});

app.get("/api/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const response = await api.getUserById(userId);

    if (!response.success) {
      const status = response.message === "User not found" ? 404 : 400;
      return res.status(status).json(response);
    }

    res.json(response);
  } catch (error) {
    console.error("Error in GET /api/user/:userId:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});


// Global error handler middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  // Handle Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large',
        errorCode: 'FILE_TOO_LARGE'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
      errorCode: 'UPLOAD_ERROR'
    });
  }
  
  // Handle other errors
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    errorCode: 'SERVER_ERROR',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    errorCode: 'ENDPOINT_NOT_FOUND'
  });
});

// Start server
async function startServer() {
  try {
    await api.connectToMongoDB();
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  try {
    await api.closeDatabaseConnection();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\nReceived SIGTERM, shutting down gracefully...');
  try {
    await api.closeDatabaseConnection();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();