import { MongoClient } from "mongodb";
import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const connectionString = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

let client;
let db;

export async function connectToMongoDB(){
    try {
        if (!connectionString || !dbName) {
            throw new Error("Missing MONGODB_URI or DB_NAME environment variables");
        }
        client = new MongoClient(connectionString);
        await client.connect();
        db = client.db(dbName);
        console.log('Connected to MongoDB');
        return db;
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
}

export async function authenticateUser({username, password}) {
    try {
        if (!username || !password) {
            return { 
                success: false, 
                message: "Username and password are required",
                errorCode: "MISSING_CREDENTIALS"
            };
        }

        const user = await db.collection('users').findOne({ 
            username: new RegExp(`^${username}$`, 'i'), 
            password: password 
        });
        
        if (!user) {
            return { 
                success: false, 
                message: "Invalid username or password",
                errorCode: "INVALID_CREDENTIALS"
            };
        }
        
        return { 
            success: true, 
            message: "User logged in successfully", 
            user: user
        };
    } catch (error) {
        console.error('Error authenticating user:', error);
        return { 
            success: false, 
            message: "Authentication failed due to server error",
            errorCode: "AUTH_ERROR",
            error: error.message
        };
    }
}

export async function signupUser({username, password, email}){
    try {
        if (!username || !password || !email) {
            return { 
                success: false, 
                message: "Username, password, and email are required",
                errorCode: "MISSING_FIELDS"
            };
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { 
                success: false, 
                message: "Invalid email format",
                errorCode: "INVALID_EMAIL"
            };
        }

        const existingUser = await db.collection('users').findOne({
            $or: [
                { username: new RegExp(`^${username}$`, 'i') },
                { email: new RegExp(`^${email}$`, 'i') }
            ]
        });
        
        if (existingUser) {
            return { 
                success: false, 
                message: "Username or email already exists",
                errorCode: "USER_EXISTS"
            };
        }

        const newUser = {
            username,
            password,
            email,
            profileImage: "default user",
            personalInfo: {
                birthday: null,
                work: null,
                contactInfo: [email],
                bio: null,
                socials: [],
                website: null
            },
            friends: [],
            friendRequestsSent: [],
            friendRequestsReceived: [],
            ownedProjects: [],
            memberOfProjects: [],
            favoriteLanguages: [],
            role: "registered_user",
            isVerified: false,
            verificationRequest: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            name: null,
            surname: null,
            savedProjects: []
        };

        const result = await db.collection('users').insertOne(newUser);
        
        if (result.insertedId) {
            return { 
                success: true, 
                message: "User signed up successfully", 
                user: newUser
            };
        } else {
            throw new Error('Failed to create user');
        }
    } catch (error) {
        console.error('Error signing up user:', error);
        return { 
            success: false, 
            message: "Signup failed due to server error",
            errorCode: "SIGNUP_ERROR",
            error: error.message
        };
    }
}

export async function getAllProjects(){
    try {
        const projects = await db.collection('projects').find({}).toArray();
        return { 
            success: true, 
            projects: projects
        };
    } catch (error) {
        console.error("Error getting projects:", error);
        return { 
            success: false, 
            message: "Failed to retrieve projects",
            errorCode: "FETCH_PROJECTS_ERROR",
            error: error.message
        };
    }
}

export async function closeDatabaseConnection() {
    try {
        if (client) {
            await client.close();
            console.log('MongoDB connection closed');
        }
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
    }
}

export async function userProjects(userid){
    try {
        if (!userid) {
            return { 
                success: false, 
                message: "User ID is required",
                errorCode: "MISSING_USER_ID"
            };
        }

        if (!ObjectId.isValid(userid)) {
            return { 
                success: false, 
                message: "Invalid user ID format",
                errorCode: "INVALID_USER_ID"
            };
        }

        const userObjectId = new ObjectId(userid);
        const projects = await db.collection('projects').find({
            $or: [
                { owner: userObjectId },
                { members: { $in: [userObjectId] }}
            ]
        }).toArray();

        const ownedProjects = [];
        const memberOfProjects = [];
        
        projects.forEach(project => {
            if (project.owner.equals(userObjectId)) {
                ownedProjects.push(project);
            } else {
                memberOfProjects.push(project);
            }
        });

        return { 
            success: true, 
            projects: { ownedProjects, memberOfProjects }
        };
    } catch (error) {
        console.error("Error getting user projects:", error);
        return { 
            success: false, 
            message: "Failed to retrieve user projects",
            errorCode: "FETCH_USER_PROJECTS_ERROR",
            error: error.message
        };
    }
}

export async function getActivityFeed(Feed){
    try {
        if (!Feed || !Array.isArray(Feed)) {
            return { 
                success: false, 
                message: "Invalid feed format",
                errorCode: "INVALID_FEED_FORMAT"
            };
        }

        const activityfeed = [];
        Feed.forEach(f => {
            if (ObjectId.isValid(f)) {
                activityfeed.push(new ObjectId(f));
            }
        });

        const activities = await db.collection('activities').find({
            _id: { $in: activityfeed }
        }).toArray();

        return { 
            success: true, 
            activities: activities
        };
    } catch (error) {
        console.error("Error getting activity feed:", error);
        return { 
            success: false, 
            message: "Failed to retrieve activity feed",
            errorCode: "FETCH_ACTIVITY_ERROR",
            error: error.message
        };
    }
}

export async function getDiscussions(discussions){
    try {
        if (!discussions || !Array.isArray(discussions)) {
            return { 
                success: false, 
                message: "Invalid discussions format",
                errorCode: "INVALID_DISCUSSIONS_FORMAT"
            };
        }

        const iddiscussions = [];
        discussions.forEach(discussion => {
            if (ObjectId.isValid(discussion)) {
                iddiscussions.push(new ObjectId(discussion));
            }
        });

        const discussionsList = await db.collection('discussions').find({
            _id: { $in: iddiscussions }
        }).toArray();

        return { 
            success: true, 
            discussions: discussionsList
        };
    } catch (error) {
        console.error("Error getting discussions:", error);
        return { 
            success: false, 
            message: "Failed to retrieve discussions",
            errorCode: "FETCH_DISCUSSIONS_ERROR",
            error: error.message
        };
    }
}

export async function getAllTypes(){
    try {
        const types = await db.collection('project_types').find({}).toArray();
        return { 
            success: true, 
            types: types
        };
    } catch (error) {
        console.error("Error getting types:", error);
        return { 
            success: false, 
            message: "Failed to retrieve project types",
            errorCode: "FETCH_TYPES_ERROR",
            error: error.message
        };
    }
}

export async function getProjectType(Typeid){
    try {
        if (!Typeid) {
            return { 
                success: false, 
                message: "Type ID is required",
                errorCode: "MISSING_TYPE_ID"
            };
        }

        if (!ObjectId.isValid(Typeid)) {
            return { 
                success: false, 
                message: "Invalid type ID format",
                errorCode: "INVALID_TYPE_ID"
            };
        }

        const objtypeid = new ObjectId(Typeid);
        const types = await db.collection('project_types').find({
            _id: { $in: [objtypeid] }
        }).toArray();

        if (types.length === 0) {
            return { 
                success: false, 
                message: "Project type not found",
                errorCode: "TYPE_NOT_FOUND"
            };
        }

        return { 
            success: true, 
            types: types
        };
    } catch (error) {
        console.error("Error getting project type:", error);
        return { 
            success: false, 
            message: "Failed to retrieve project type",
            errorCode: "FETCH_PROJECT_TYPE_ERROR",
            error: error.message
        };
    }
}

export async function getUser(userId){
    try {
        if (!userId) {
            return { 
                success: false, 
                message: "User ID is required",
                errorCode: "MISSING_USER_ID"
            };
        }

        if (!ObjectId.isValid(userId)) {
            return { 
                success: false, 
                message: "Invalid user ID format",
                errorCode: "INVALID_USER_ID"
            };
        }

        const objectid = new ObjectId(userId);
        const user = await db.collection('users').findOne({
            _id: { $in: [objectid] }
        });

        if (!user) {
            return { 
                success: false, 
                message: "User not found",
                errorCode: "USER_NOT_FOUND"
            };
        }

        return { 
            success: true, 
            user: user
        };
    } catch (error) {
        console.error("Error getting user:", error);
        return { 
            success: false, 
            message: "Failed to retrieve user",
            errorCode: "FETCH_USER_ERROR",
            error: error.message
        };
    }
}

export async function updateUserInfo(user){
    try {
        if (!user._id) {
            return { 
                success: false, 
                message: "User ID is required",
                errorCode: "MISSING_USER_ID"
            };
        }

        if (!ObjectId.isValid(user._id)) {
            return { 
                success: false, 
                message: "Invalid user ID format",
                errorCode: "INVALID_USER_ID"
            };
        }

        const userId = new ObjectId(user._id);
        const existingUser = await db.collection('users').findOne({ _id: userId });
        
        if (!existingUser) {
            return { 
                success: false, 
                message: "User not found",
                errorCode: "USER_NOT_FOUND"
            };
        }

        if (user.username && user.username !== existingUser.username) {
            const usernameTaken = await db.collection('users').findOne({
                username: user.username,
                _id: { $ne: userId }
            });

            if (usernameTaken) {
                return { 
                    success: false, 
                    message: "Username is already taken",
                    errorCode: "USERNAME_TAKEN"
                };
            }
        }

        const updateFields = {
            username: user.username ?? existingUser.username,
            email: user.email ?? existingUser.email,
            name: user.name ?? existingUser.name,
            surname: user.surname ?? existingUser.surname,
            personalInfo: {
                bio: user.personalInfo?.bio ?? existingUser.personalInfo?.bio ?? null,
                website: user.personalInfo?.website ?? existingUser.personalInfo?.website ?? null,
                socials: user.personalInfo?.socials ?? existingUser.personalInfo?.socials ?? [],
                birthday: user.personalInfo?.birthday ?? existingUser.personalInfo?.birthday ?? null,
                contactInfo: user.personalInfo?.contactInfo ?? existingUser.personalInfo?.contactInfo ?? [],
                work: user.personalInfo?.work ?? existingUser.personalInfo?.work ?? null
            },
            updatedAt: new Date()
        };

        await db.collection('users').updateOne(
            { _id: userId },
            { $set: updateFields }
        );

        return { 
            success: true, 
            message: "User updated successfully"
        };
    } catch (error) {
        console.error("Error updating user:", error);
        return { 
            success: false, 
            message: "Failed to update user",
            errorCode: "UPDATE_USER_ERROR",
            error: error.message
        };
    }
}

export async function updateProject(project){
    try {
        if (!project._id) {
            return { 
                success: false, 
                message: "Project ID is required",
                errorCode: "MISSING_PROJECT_ID"
            };
        }

        if (!ObjectId.isValid(project._id)) {
            return { 
                success: false, 
                message: "Invalid project ID format",
                errorCode: "INVALID_PROJECT_ID"
            };
        }

        const projectId = new ObjectId(project._id);
        const existingProject = await db.collection("projects").findOne({ _id: projectId });

        if (!existingProject) {
            return { 
                success: false, 
                message: "Project not found",
                errorCode: "PROJECT_NOT_FOUND"
            };
        }

        const updateFields = {};

        if (project.name !== undefined) updateFields.name = project.name;
        if (project.description !== undefined) updateFields.description = project.description;
        if (project.hashtags !== undefined) updateFields.hashtags = project.hashtags;

        if (project.type !== undefined) {
            if (!ObjectId.isValid(project.type)) {
                return { 
                    success: false, 
                    message: "Invalid project type ID",
                    errorCode: "INVALID_TYPE_ID"
                };
            }
            updateFields.type = new ObjectId(project.type);
        }

        updateFields.updatedAt = new Date();

        await db.collection("projects").updateOne(
            { _id: projectId },
            { $set: updateFields }
        );

        return { 
            success: true, 
            message: "Project updated successfully"
        };
    } catch (error) {
        console.error("Error updating project:", error);
        return { 
            success: false, 
            message: "Failed to update project",
            errorCode: "UPDATE_PROJECT_ERROR",
            error: error.message
        };
    }
}

export async function createProject(data, ownerId) {
    try {
        if (!ownerId) {
            return {
                success: false,
                message: "Owner ID is required",
                errorCode: "MISSING_OWNER_ID"
            };
        }

        if (!ObjectId.isValid(ownerId)) {
            return {
                success: false,
                message: "Invalid owner ID format",
                errorCode: "INVALID_OWNER_ID"
            };
        }

        if (!data.projectName) {
            return {
                success: false,
                message: "Project name is required",
                errorCode: "MISSING_PROJECT_NAME"
            };
        }

        if (!data.projectType) {
            return {
                success: false,
                message: "Project type is required",
                errorCode: "MISSING_PROJECT_TYPE"
            };
        }

        const ownerObjectId = new ObjectId(ownerId);

        const existingProject = await db.collection("projects").findOne({
            name: data.projectName,
            owner: ownerObjectId
        });

        if (existingProject) {
            return {
                success: false,
                message: "You already have a project with this name",
                errorCode: "PROJECT_NAME_EXISTS"
            };
        }

        let hashtags = [];
        if (data.projectLanguages) {
            hashtags = data.projectLanguages
                .split(" ")
                .map(tag => tag.replace(/^#/, "").trim())
                .filter(tag => tag.length > 0);
        }

        const newProject = {
            name: data.projectName,
            description: data.projectDescription,
            projectImage: data.projectImage || null,
            type: new ObjectId(data.projectType),
            hashtags: hashtags,
            version: data.projectVersion,
            owner: ownerObjectId,
            members: [],
            status: "checked_out",
            checkedOutBy: null,
            files: [],
            activityFeed: [],
            discussionBoard: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            versionHistory: [],
            image: "default"
        };

        const insertResult = await db.collection("projects").insertOne(newProject);
        const projectId = insertResult.insertedId;
        
        if (!projectId) {
            return { 
                success: false, 
                message: 'Failed to create project',
                errorCode: "PROJECT_INSERT_FAILED"
            };
        }

        const userUpdateResult = await db.collection("users").updateOne(
            { _id: ownerObjectId },
            { $addToSet: { ownedProjects: projectId } }
        );

        if (userUpdateResult.matchedCount === 0) {
            console.warn('User not found, but project was created. Manual cleanup may be needed.');
            return { 
                success: false, 
                message: 'Project created, but owner user not found. Check user ID.',
                errorCode: "USER_UPDATE_FAILED"
            };
        }

        const createdProject = await db.collection("projects").findOne({ _id: projectId });
        
        return {
            success: true,
            message: "Project created successfully",
            project: createdProject
        };
    } catch (error) {
        console.error("Error creating project:", error);
        return { 
            success: false, 
            message: "Failed to create project",
            errorCode: "CREATE_PROJECT_ERROR",
            error: error.message
        };
    }
}

export async function sendFriendRequest(senderId, receiverId) {
    try {
        if (!senderId || !receiverId) {
            return { 
                success: false, 
                message: "Sender and receiver IDs are required",
                errorCode: "MISSING_IDS"
            };
        }

        if (!ObjectId.isValid(senderId) || !ObjectId.isValid(receiverId)) {
            return { 
                success: false, 
                message: "Invalid ID format",
                errorCode: "INVALID_ID_FORMAT"
            };
        }

        if (senderId === receiverId) {
            return { 
                success: false, 
                message: "Cannot send friend request to yourself",
                errorCode: "SELF_REQUEST"
            };
        }

        const senderObjectId = new ObjectId(senderId);
        const receiverObjectId = new ObjectId(receiverId);

        // Check if users exist
        const sender = await db.collection("users").findOne({ _id: senderObjectId });
        const receiver = await db.collection("users").findOne({ _id: receiverObjectId });

        if (!sender || !receiver) {
            return { 
                success: false, 
                message: "One or both users not found",
                errorCode: "USER_NOT_FOUND"
            };
        }

        // Check if already friends
        if (sender.friends?.some(id => id.equals(receiverObjectId))) {
            return { 
                success: false, 
                message: "Users are already friends",
                errorCode: "ALREADY_FRIENDS"
            };
        }

        // Check if request already sent
        if (sender.friendRequestsSent?.some(id => id.equals(receiverObjectId))) {
            return { 
                success: false, 
                message: "Friend request already sent",
                errorCode: "REQUEST_EXISTS"
            };
        }

        await db.collection("users").updateOne(
            { _id: senderObjectId },
            { $addToSet: { friendRequestsSent: receiverObjectId } }
        );

        await db.collection("users").updateOne(
            { _id: receiverObjectId },
            { $addToSet: { friendRequestsReceived: senderObjectId } }
        );

        return { 
            success: true, 
            message: "Friend request sent"
        };
    } catch (error) {
        console.error("Error sending friend request:", error);
        return { 
            success: false, 
            message: "Failed to send friend request",
            errorCode: "FRIEND_REQUEST_ERROR",
            error: error.message
        };
    }
}

export async function acceptFriendRequest(receiverId, senderId) {
    try {
        if (!receiverId || !senderId) {
            return { 
                success: false, 
                message: "Receiver and sender IDs are required",
                errorCode: "MISSING_IDS"
            };
        }

        if (!ObjectId.isValid(receiverId) || !ObjectId.isValid(senderId)) {
            return { 
                success: false, 
                message: "Invalid ID format",
                errorCode: "INVALID_ID_FORMAT"
            };
        }

        const receiverObjectId = new ObjectId(receiverId);
        const senderObjectId = new ObjectId(senderId);

        // Verify request exists
        const receiver = await db.collection("users").findOne({ _id: receiverObjectId });
        if (!receiver || !receiver.friendRequestsReceived?.some(id => id.equals(senderObjectId))) {
            return { 
                success: false, 
                message: "Friend request not found",
                errorCode: "REQUEST_NOT_FOUND"
            };
        }

        await db.collection("users").updateOne(
            { _id: receiverObjectId },
            {
                $addToSet: { friends: senderObjectId },
                $pull: { friendRequestsReceived: senderObjectId }
            }
        );

        await db.collection("users").updateOne(
            { _id: senderObjectId },
            {
                $addToSet: { friends: receiverObjectId },
                $pull: { friendRequestsSent: receiverObjectId }
            }
        );

        return { 
            success: true, 
            message: "Friend request accepted"
        };
    } catch (error) {
        console.error("Error accepting request:", error);
        return { 
            success: false, 
            message: "Failed to accept friend request",
            errorCode: "ACCEPT_REQUEST_ERROR",
            error: error.message
        };
    }
}

export async function declineFriendRequest(receiverId, senderId) {
    try {
        if (!receiverId || !senderId) {
            return { 
                success: false, 
                message: "Receiver and sender IDs are required",
                errorCode: "MISSING_IDS"
            };
        }

        if (!ObjectId.isValid(receiverId) || !ObjectId.isValid(senderId)) {
            return { 
                success: false, 
                message: "Invalid ID format",
                errorCode: "INVALID_ID_FORMAT"
            };
        }

        const receiverObjectId = new ObjectId(receiverId);
        const senderObjectId = new ObjectId(senderId);

        await db.collection("users").updateOne(
            { _id: receiverObjectId },
            { $pull: { friendRequestsReceived: senderObjectId } }
        );

        await db.collection("users").updateOne(
            { _id: senderObjectId },
            { $pull: { friendRequestsSent: receiverObjectId } }
        );

        return { 
            success: true, 
            message: "Friend request declined"
        };
    } catch (error) {
        console.error("Error declining request:", error);
        return { 
            success: false, 
            message: "Failed to decline friend request",
            errorCode: "DECLINE_REQUEST_ERROR",
            error: error.message
        };
    }
}

export async function removeFriend(userId, friendId) {
    try {
        if (!userId || !friendId) {
            return { 
                success: false, 
                message: "User ID and friend ID are required",
                errorCode: "MISSING_IDS"
            };
        }

        if (!ObjectId.isValid(userId) || !ObjectId.isValid(friendId)) {
            return { 
                success: false, 
                message: "Invalid ID format",
                errorCode: "INVALID_ID_FORMAT"
            };
        }

        const userObjectId = new ObjectId(userId);
        const friendObjectId = new ObjectId(friendId);

        await db.collection("users").updateOne(
            { _id: userObjectId },
            { $pull: { friends: friendObjectId } }
        );

        await db.collection("users").updateOne(
            { _id: friendObjectId },
            { $pull: { friends: userObjectId } }
        );

        return { 
            success: true, 
            message: "Friend removed successfully"
        };
    } catch (error) {
        console.error("Error removing friend:", error);
        return { 
            success: false, 
            message: "Failed to remove friend",
            errorCode: "REMOVE_FRIEND_ERROR",
            error: error.message
        };
    }
}

export async function addActivityEntry({projectId, userId, type, message, projectVersion}) {
    try {
        if (!projectId || !userId || !type || !message) {
            return {
                success: false, 
                message: "Project ID, user ID, type, and message are required",
                errorCode: "MISSING_FIELDS"
            };
        }

        if (!ObjectId.isValid(projectId) || !ObjectId.isValid(userId)) {
            return {
                success: false,
                message: "Invalid ID format",
                errorCode: "INVALID_ID_FORMAT"
            };
        }

        const projectObjectId = new ObjectId(projectId);
        const userObjectId = new ObjectId(userId);

        const activityEntry = {
            projectId: projectObjectId,
            userId: userObjectId,
            type: type,
            message: message,
            projectVersion: projectVersion || '1.0.0',
            createdAt: new Date(),
            downloads: 0
        };

        const insertResult = await db.collection("activities").insertOne(activityEntry);
        const entryId = insertResult.insertedId;

        if (!entryId) {
            return { 
                success: false, 
                message: 'Failed to add activity entry',
                errorCode: "ACTIVITY_INSERT_FAILED"
            };
        }

        const createdEntry = await db.collection("activities").findOne({ _id: entryId });

        const addtoproject = await db.collection("projects").updateOne(
            { _id: projectObjectId },
            { $addToSet: { activityFeed: entryId } }
        );

        if (addtoproject.matchedCount === 0) {
            return {
                success: true,
                message: 'Activity entry added successfully but project not found',
                entry: createdEntry,
                warning: "PROJECT_NOT_FOUND"
            };
        }

        return {
            success: true,
            message: 'Activity entry added successfully',
            entry: createdEntry
        };
    } catch (error) {
        console.error("Error adding activity entry:", error);
        return { 
            success: false, 
            message: "Failed to add activity entry",
            errorCode: "ADD_ACTIVITY_ERROR",
            error: error.message
        };
    }
}

export async function addDiscussionEntry({projectId, userId, message}) {
    try {
        if (!projectId || !userId || !message) {
            return {
                success: false, 
                message: "Project ID, user ID, and message are required",
                errorCode: "MISSING_FIELDS"
            };
        }

        if (!ObjectId.isValid(projectId) || !ObjectId.isValid(userId)) {
            return {
                success: false,
                message: "Invalid ID format",
                errorCode: "INVALID_ID_FORMAT"
            };
        }

        const projectObjectId = new ObjectId(projectId);
        const userObjectId = new ObjectId(userId);

        const discussionEntry = {
            projectId: projectObjectId,
            userId: userObjectId,
            message: message,
            createdAt: new Date()
        };

        const insertResult = await db.collection("discussions").insertOne(discussionEntry);
        const entryId = insertResult.insertedId;

        if (!entryId) {
            return { 
                success: false, 
                message: 'Failed to add discussion entry',
                errorCode: "DISCUSSION_INSERT_FAILED"
            };
        }

        const createdEntry = await db.collection("discussions").findOne({ _id: entryId });

        const addtoproject = await db.collection("projects").updateOne(
            { _id: projectObjectId },
            { $addToSet: { discussionBoard: entryId } }
        );

        if (addtoproject.matchedCount === 0) {
            return {
                success: true,
                message: 'Discussion entry added successfully but project not found',
                entry: createdEntry,
                warning: "PROJECT_NOT_FOUND"
            };
        }

        return {
            success: true,
            message: 'Discussion entry added successfully',
            entry: createdEntry
        };
    } catch (error) {
        console.error("Error adding discussion entry:", error);
        return { 
            success: false, 
            message: "Failed to add discussion entry",
            errorCode: "ADD_DISCUSSION_ERROR",
            error: error.message
        };
    }
}

function validateObjectId(id) {
    if (!ObjectId.isValid(id)) {
        throw new Error(`Invalid ObjectId: ${id}`);
    }
    return new ObjectId(id);
}

export async function deleteProject(projectId, requesterId) {
    try {
        if (!projectId || !requesterId) {
            return { 
                success: false, 
                message: "Project ID and requester ID are required",
                errorCode: "MISSING_IDS"
            };
        }

        const projectObjectId = validateObjectId(projectId);
        const requesterObjectId = validateObjectId(requesterId);

        const project = await db.collection('projects').findOne({ _id: projectObjectId });
        
        if (!project) {
            return { 
                success: false, 
                message: 'Project not found',
                errorCode: "PROJECT_NOT_FOUND"
            };
        }
        
        if (!project.owner.equals(requesterObjectId)) {
            return { 
                success: false, 
                message: 'Only the project owner can delete it',
                errorCode: "UNAUTHORIZED"
            };
        }

        await db.collection('activities').deleteMany({ projectId: projectObjectId });
        await db.collection('discussions').deleteMany({ projectId: projectObjectId });

        const affectedUsers = await db.collection('users').find({
            $or: [
                { ownedProjects: { $in: [projectObjectId] } },
                { memberOfProjects: { $in: [projectObjectId] } },
                { pinnedProjects: { $in: [projectObjectId] } }
            ]
        }).toArray();

        const uniqueUserIds = [...new Set(affectedUsers.map(user => user._id.toString()))];
        
        for (const userIdStr of uniqueUserIds) {
            const userObjectId = new ObjectId(userIdStr);
            const updateOps = { $pull: {} };
            updateOps.$pull.ownedProjects = projectObjectId;
            updateOps.$pull.memberOfProjects = projectObjectId;
            updateOps.$pull.pinnedProject = projectObjectId;
            
            await db.collection('users').updateOne(
                { _id: userObjectId },
                updateOps
            );
        }

        const projectDeleteResult = await db.collection('projects').deleteOne({ _id: projectObjectId });
        
        if (projectDeleteResult.deletedCount === 0) {
            return { 
                success: false, 
                message: 'Failed to delete project',
                errorCode: "DELETE_FAILED"
            };
        }

        return {
            success: true,
            message: `Project "${project.name}" deleted successfully.`
        };
    } catch (error) {
        console.error('Error deleting project:', error);
        return { 
            success: false, 
            message: "Failed to delete project",
            errorCode: "DELETE_PROJECT_ERROR",
            error: error.message
        };
    }
}

export async function deleteUser(userId, requesterId) {
    try {
        if (!userId || !requesterId) {
            return { 
                success: false, 
                message: "User ID and requester ID are required",
                errorCode: "MISSING_IDS"
            };
        }

        if (userId !== requesterId) {
            return { 
                success: false, 
                message: 'You can only delete your own account',
                errorCode: "UNAUTHORIZED"
            };
        }

        const userObjectId = validateObjectId(userId);

        const user = await db.collection('users').findOne({ _id: userObjectId });
        
        if (!user) {
            return { 
                success: false, 
                message: 'User not found',
                errorCode: "USER_NOT_FOUND"
            };
        }

        const ownedProjects = user.ownedProjects || [];
        let deletedProjectCount = 0;
        
        for (const projId of ownedProjects) {
            const projectResponse = await deleteProject(projId.toString(), userId);
            if (projectResponse.success) {
                deletedProjectCount++;
            } else {
                console.warn(`Failed to delete owned project ${projId}: ${projectResponse.message}`);
            }
        }

        const memberProjects = await db.collection('projects').find({ members: userObjectId }).toArray();
        for (const project of memberProjects) {
            await db.collection('projects').updateOne(
                { _id: project._id },
                { $pull: { members: userObjectId } }
            );
        }

        const friends = user.friends || [];
        for (const friendId of friends) {
            await db.collection('users').updateOne(
                { _id: friendId },
                { $pull: { friends: userObjectId } }
            );
        }

        const sentRequests = user.friendRequestsSent || [];
        for (const receiverId of sentRequests) {
            await db.collection('users').updateOne(
                { _id: receiverId },
                { $pull: { friendRequestsReceived: userObjectId } }
            );
        }

        const receivedRequests = user.friendRequestsReceived || [];
        for (const senderId of receivedRequests) {
            await db.collection('users').updateOne(
                { _id: senderId },
                { $pull: { friendRequestsSent: userObjectId } }
            );
        }

        await db.collection('activities').deleteMany({ userId: userObjectId });
        await db.collection('discussions').deleteMany({ userId: userObjectId });

        const userDeleteResult = await db.collection('users').deleteOne({ _id: userObjectId });
        
        if (userDeleteResult.deletedCount === 0) {
            return { 
                success: false, 
                message: 'Failed to delete user',
                errorCode: "DELETE_FAILED"
            };
        }

        return {
            success: true,
            message: `User "${user.username || userId}" deleted successfully. Deleted ${deletedProjectCount} owned projects, cleaned ${memberProjects.length} memberships, ${friends.length} friendships, and related activities/discussions.`
        };
    } catch (error) {
        console.error('Error deleting user:', error);
        return { 
            success: false, 
            message: "Failed to delete user",
            errorCode: "DELETE_USER_ERROR",
            error: error.message
        };
    }
}

export async function getProject(projectId){
    try {
        if (!projectId) {
            return { 
                success: false, 
                message: "Project ID is required",
                errorCode: "MISSING_PROJECT_ID"
            };
        }

        if (!ObjectId.isValid(projectId)) {
            return { 
                success: false, 
                message: "Invalid project ID format",
                errorCode: "INVALID_PROJECT_ID"
            };
        }

        const objectid = new ObjectId(projectId);
        const project = await db.collection('projects').findOne({
            _id: { $in: [objectid] }
        });

        if (!project) {
            return { 
                success: false, 
                message: "Project not found",
                errorCode: "PROJECT_NOT_FOUND"
            };
        }

        return { 
            success: true, 
            project: project
        };
    } catch (error) {
        console.error("Error getting project:", error);
        return { 
            success: false, 
            message: "Failed to retrieve project",
            errorCode: "FETCH_PROJECT_ERROR",
            error: error.message
        };
    }
}

export async function searchUsers(searchTerm) {
    try {
        if (!searchTerm || searchTerm.trim().length === 0) {
            return { 
                success: false, 
                message: "Search term is required",
                errorCode: "MISSING_SEARCH_TERM"
            };
        }

        const users = await db.collection('users').find({
            username: new RegExp(searchTerm, 'i')
        }).project({ password: 0 }).toArray();

        return { 
            success: true, 
            users: users
        };
    } catch (error) {
        console.error('Error searching users:', error);
        return { 
            success: false, 
            message: "Failed to search users",
            errorCode: "SEARCH_USERS_ERROR",
            error: error.message
        };
    }
}

export async function searchAll(searchTerm) {
    try {
        if (!searchTerm || searchTerm.trim().length < 2) {
            return { 
                success: true, 
                results: { users: [], projects: [], hashtags: [] }
            };
        }

        const regex = new RegExp(searchTerm.trim(), 'i');

        const users = await db.collection('users')
            .find({ username: regex })
            .project({ password: 0, email: 0 })
            .limit(10)
            .toArray();

        const projectsByName = await db.collection('projects')
            .find({ name: regex })
            .limit(10)
            .toArray();

        const projectsByHashtag = await db.collection('projects')
            .find({ hashtags: regex })
            .limit(10)
            .toArray();

        const allProjects = [...new Map([...projectsByName, ...projectsByHashtag].map(p => [p._id, p])).values()];

        const allHashtags = new Set();
        allProjects.forEach(project => {
            project.hashtags?.forEach(tag => {
                if (regex.test(tag)) {
                    allHashtags.add(tag);
                }
            });
        });
        const hashtags = Array.from(allHashtags);

        return {
            success: true,
            results: {
                users: users,
                projects: allProjects,
                hashtags: hashtags
            }
        };
    } catch (error) {
        console.error('Error in searchAll:', error);
        return { 
            success: false, 
            message: "Search failed",
            errorCode: "SEARCH_ALL_ERROR",
            error: error.message
        };
    }
}

export async function asp(){
    try {
        await db.collection("projects").updateMany(
            {},
            { $set: { image: "default" } }
        );
        return { 
            success: true, 
            message: "All projects updated"
        };
    } catch (error) {
        console.error('Error in asp:', error);
        return { 
            success: false, 
            message: "Update failed",
            errorCode: "ASP_ERROR",
            error: error.message
        };
    }
}

export async function addMemberToProject(projectId, userId) {
    try {
        if (!projectId || !userId) {
            return { 
                success: false, 
                message: "Project ID and user ID are required",
                errorCode: "MISSING_IDS"
            };
        }

        if (!ObjectId.isValid(projectId) || !ObjectId.isValid(userId)) {
            return { 
                success: false, 
                message: "Invalid ID format",
                errorCode: "INVALID_ID_FORMAT"
            };
        }

        const projectObjectId = new ObjectId(projectId);
        const userObjectId = new ObjectId(userId);

        const project = await db.collection("projects").findOne({ _id: projectObjectId });
        if (!project) {
            return { 
                success: false, 
                message: "Project not found",
                errorCode: "PROJECT_NOT_FOUND"
            };
        }

        const user = await db.collection("users").findOne({ _id: userObjectId });
        if (!user) {
            return { 
                success: false, 
                message: "User not found",
                errorCode: "USER_NOT_FOUND"
            };
        }

        if (
            project.owner.toString() === userObjectId.toString() ||
            project.members?.some(m => m.toString() === userObjectId.toString())
        ) {
            return { 
                success: false, 
                message: "User is already a member or owner",
                errorCode: "ALREADY_MEMBER"
            };
        }

        await db.collection("projects").updateOne(
            { _id: projectObjectId },
            { $addToSet: { members: userObjectId } }
        );

        await db.collection("users").updateOne(
            { _id: userObjectId },
            { $addToSet: { memberOfProjects: projectObjectId } }
        );

        return { 
            success: true, 
            message: "User added as member successfully"
        };
    } catch (error) {
        console.error("Error adding member to project:", error);
        return { 
            success: false, 
            message: "Failed to add member",
            errorCode: "ADD_MEMBER_ERROR",
            error: error.message
        };
    }
}

export async function promoteMemberToOwner(projectId, userId) {
    try {
        if (!projectId || !userId) {
            return { 
                success: false, 
                message: "Project ID and user ID are required",
                errorCode: "MISSING_IDS"
            };
        }

        if (!ObjectId.isValid(projectId) || !ObjectId.isValid(userId)) {
            return { 
                success: false, 
                message: "Invalid ID format",
                errorCode: "INVALID_ID_FORMAT"
            };
        }

        const projectObjectId = new ObjectId(projectId);
        const userObjectId = new ObjectId(userId);

        const project = await db.collection("projects").findOne({ _id: projectObjectId });
        if (!project) {
            return { 
                success: false, 
                message: "Project not found",
                errorCode: "PROJECT_NOT_FOUND"
            };
        }

        const isMember = project.members?.some(m => m.toString() === userObjectId.toString());
        if (!isMember) {
            return { 
                success: false, 
                message: "User must be a member before becoming owner",
                errorCode: "NOT_MEMBER"
            };
        }

        await db.collection("projects").updateOne(
            { _id: projectObjectId },
            {
                $set: { owner: userObjectId },
                $pull: { members: userObjectId }
            }
        );

        await db.collection("users").updateOne(
            { _id: userObjectId },
            {
                $addToSet: { ownedProjects: projectObjectId },
                $pull: { memberOfProjects: projectObjectId }
            }
        );

        const prevOwnerId = project.owner;
        if (prevOwnerId) {
            await db.collection("users").updateOne(
                { _id: new ObjectId(prevOwnerId) },
                {
                    $pull: { ownedProjects: projectObjectId },
                    $addToSet: { memberOfProjects: projectObjectId }
                }
            );
        }

        return { 
            success: true, 
            message: "Member promoted to owner successfully"
        };
    } catch (error) {
        console.error("Error promoting member to owner:", error);
        return { 
            success: false, 
            message: "Failed to promote member",
            errorCode: "PROMOTE_MEMBER_ERROR",
            error: error.message
        };
    }
}

export async function pinProjectToUser(userId, projectId) {
    try {
        if (!userId || !projectId) {
            return { 
                success: false, 
                message: "User ID and project ID are required",
                errorCode: "MISSING_IDS"
            };
        }

        if (!ObjectId.isValid(userId) || !ObjectId.isValid(projectId)) {
            return { 
                success: false, 
                message: "Invalid ID format",
                errorCode: "INVALID_ID_FORMAT"
            };
        }

        const userObjectId = new ObjectId(userId);
        const projectObjectId = new ObjectId(projectId);

        const user = await db.collection("users").findOne({ _id: userObjectId });
        if (!user) {
            return { 
                success: false, 
                message: "User not found",
                errorCode: "USER_NOT_FOUND"
            };
        }

        const project = await db.collection("projects").findOne({ _id: projectObjectId });
        if (!project) {
            return { 
                success: false, 
                message: "Project not found",
                errorCode: "PROJECT_NOT_FOUND"
            };
        }

        const isOwner = project.owner?.toString() === userObjectId.toString();
        const isMember = project.members?.some(m => m.toString() === userObjectId.toString());

        if (!isOwner && !isMember) {
            return {
                success: false,
                message: "User must be an owner or member to pin this project",
                errorCode: "UNAUTHORIZED"
            };
        }

        await db.collection("users").updateOne(
            { _id: userObjectId },
            { $addToSet: { pinnedProjects: projectObjectId } }
        );

        return { 
            success: true, 
            message: "Project pinned successfully"
        };
    } catch (error) {
        console.error("Error pinning project:", error);
        return { 
            success: false, 
            message: "Failed to pin project",
            errorCode: "PIN_PROJECT_ERROR",
            error: error.message
        };
    }
}

export async function getProjectFiles(projectId) {
  try {
    if (!ObjectId.isValid(projectId)) {
      return {
        success: false,
        message: "Invalid project ID format",
        errorCode: "INVALID_PROJECT_ID"
      };
    }

    const db = await connectToMongoDB();
    const project = await db.collection("projects").findOne(
      { _id: new ObjectId(projectId) },
      { projection: { files: 1 } }
    );

    if (!project) {
      return {
        success: false,
        message: "Project not found",
        errorCode: "PROJECT_NOT_FOUND"
      };
    }

    return {
      success: true,
      message: "Files fetched successfully",
      files: project.files || []
    };
  } catch (error) {
    console.error("Error in getProjectFiles:", error);
    return {
      success: false,
      message: "Error fetching project files",
      errorCode: "FETCH_FILES_ERROR",
      error: error.message
    };
  }
}

export async function getUserById(userId) {
  try {
    if (!ObjectId.isValid(userId)) {
      return { success: false, message: "Invalid user ID format" };
    }
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(userId) },
      {
        projection: {
          password: 0,              // exclude sensitive data
          verificationRequest: 0,
        },
      }
    );

    if (!user) {
      return { success: false, message: "User not found" };
    }

    return { success: true, user };
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return { success: false, message: error.message };
  }
}
