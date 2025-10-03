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
        const user = await db.collection('users').findOne({ 
            username: new RegExp(`^${username}$`, 'i'), 
            password: password 
        });
        if(!user)
            return { success:false, message:"User does not exist"};
        return { success:true, message:"User logged successfully" , user:user};
    } catch (error) {
        console.error('Error authenticating user:', error);
        return { success:false, message:error};
    }
}

export async function signupUser({username,password,email}){
    try{
        const existingUser  = await db.collection('users').findOne({
            $or: [
                { username: new RegExp(`^${username}$`, 'i') },
                { email:  new RegExp(`^${email}$`, 'i') }
            ]
        });
        
        if (existingUser ) {
            return { success:false, message:"user or email already exists"};
        }
        // If no user found, create a new user
        const newUser  = {
            username,
            password,
            email,
            profileImage: null,
            personalInfo: {
                birthday:null,
                work:null,
                contactInfo:[
                    email
                ],
                bio:null,
                socials:[],
                website:null
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
            surname: null
        };
        const result = await db.collection('users').insertOne(newUser );
        if (result.insertedId) {
            return { success:true, message:"User signedUp successfully" , user:newUser} ; // or return the inserted user with _id
        } else {
            throw new Error('Failed to create user');
        }
    }catch (error) {
        console.error('Error signing up user user:', error);
        return null;
    }
}

export async function getAllProjects(){
    try{
        const projects= await db.collection('projects').find({}).toArray();
        return { success:true,projects:projects};
    }catch (error){
        console.error("Error getting projects: ",error);
        return { success:false,message:error} ;
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
    try{
        const userObjectId = new ObjectId(userid);
        const projects= await db.collection('projects').find({
            $or:[
                {owner:userObjectId },
                {members:{ $in: [userObjectId ] }}
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
        return { success:true,projects:{ ownedProjects, memberOfProjects}};
    }catch (error){
        console.error("Error getting projects: ",error);
        return { success:false,message:error} ;
    }
}

export async function getActivityFeed(Feed){
    const activityfeed=[];
    Feed.forEach(f=>{
        activityfeed.push(new ObjectId(f));
    })
    try{
        const activities= await db.collection('activities').find({
            _id: { $in: activityfeed }
        }).toArray();

        return { success:true,activities:activities};
    }catch (error){
        console.error("Error getting activity feed: ",error);
        return { success:false,message:error} ;
    }
}

export async function getDiscussions(discussions){
    const iddicussuins=[];
    discussions.forEach(discussion=>{
        iddicussuins.push(new ObjectId(discussion));
    })
    try{
        const activities= await db.collection('discussions').find({
            _id: { $in: iddicussuins }
        }).toArray();

        return { success:true,discussions:activities};
    }catch (error){
        console.error("Error getting discussions: ",error);
        return { success:false,message:error} ;
    }
}

export async function getAllTypes(){
    try{
        const types= await db.collection('project_types').find({}).toArray();
        return { success:true,types:types};
    }catch (error){
        console.error("Error getting Types: ",error);
        return { success:false,message:error} ;
    }
}

export async function getProjectType(Typeid){
    const objtypeid=new ObjectId(Typeid);
    try{
        const types= await db.collection('project_types').find({
            _id:{$in:[objtypeid]}
        }).toArray();
        return { success:true,types:types};
    }catch (error){
        console.error("Error getting project: ",error);
        return { success:false,message:error} ;
    }
}

export async function getUser(userId){
    const objectid= new ObjectId(userId);
    try{
        const user= await db.collection('users').findOne({
            _id:{$in:[objectid]}
        });
        return { success:true,user:user};
    }catch(error){
        console.error("Error getting user: ",error);
        return { success:false,message:error} ;
    }
}

export async function updateUserInfo(user){
    try {
        const userId = new ObjectId(user._id);

        const existingUser = await db.collection('users').findOne({ _id: userId });
        if (!existingUser) {
            return { success: false, message: "User not found" };
        }

        if (user.username && user.username !== existingUser.username) {
            const usernameTaken = await db.collection('users').findOne({
                username: user.username,
                _id: { $ne: userId } // exclude current user
            });

            if (usernameTaken) {
                return { success: false, message: "Username is already taken" };
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

        return { success: true, message: "User updated successfully" };

    } catch (error) {
        console.error("Error updating user:", error);
        return { success: false, message: error.message };
    }
}

export async function updateProject(project){
    try {
        if (!project._id) {
            return { success: false, message: "Project ID is required" };
        }

        const projectId = new ObjectId(project._id);

        const updateFields = {};

        if (project.name !== undefined) updateFields.name = project.name;
        if (project.description !== undefined) updateFields.description = project.description;
        if (project.hashtags !== undefined) updateFields.hashtags = project.hashtags;

        if (project.type !== undefined) {
            updateFields.type = new ObjectId(project.type);
        }

        updateFields.updatedAt = new Date();

        await db.collection("projects").updateOne(
            { _id: projectId },
            { $set: updateFields }
        );

        return { success: true, message: "Project updated successfully" };

    } catch (error) {
        console.error("Error updating project:", error);
        return { success: false, message: error.message };
    }
}

export async function createProject(data, ownerId) {
    try {
        const ownerObjectId = new ObjectId(ownerId);

        const existingProject = await db.collection("projects").findOne({
            name: data.projectName,
            owner: ownerObjectId
        });

        if (existingProject) {
            return {
                success: false,
                message: "You already have a project with this name."
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
            members: [], // starts empty
            status: "checked_out",
            checkedOutBy: null,
            files: [],
            activityFeed: [],
            discussionBoard: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            versionHistory: []
        };

        // Insert the new project and capture the result (including _id)
        const insertResult = await db.collection("projects").insertOne(newProject);
        const projectId = insertResult.insertedId; // This is the new ObjectId
        if (!projectId) {
        return { success: false, message: 'Failed to create project' };
        }
        // Update the owner's user document to add this project to ownedProjects
        const userUpdateResult = await db.collection("users").updateOne(
        { _id: ownerObjectId },
        { $addToSet: { ownedProjects: projectId } } 
        );
        // Check if user was found and updated
        if (userUpdateResult.matchedCount === 0) {
        // Optional: Rollback project creation if user not found (but for simplicity, we keep it)
        console.warn('User  not found, but project was created. Manual cleanup may be needed.');
        return { 
            success: false, 
            message: 'Project created, but owner user not found. Check user ID.' 
        };
        }
        // Fetch the full project with _id for return
        const createdProject = await db.collection("projects").findOne({ _id: projectId });
        return {
        success: true,
        message: "Project created successfully",
        project: createdProject 
        };

    } catch (error) {
        console.error("Error creating project:", error);
        return { success: false, message: error.message };
    }
}

export async function sendFriendRequest(senderId, receiverId) {
  try {
    const senderObjectId = new ObjectId(senderId);
    const receiverObjectId = new ObjectId(receiverId);

    await db.collection("users").updateOne(
      { _id: senderObjectId },
      { $addToSet: { friendRequestsSent: receiverObjectId } }
    );

    await db.collection("users").updateOne(
      { _id: receiverObjectId },
      { $addToSet: { friendRequestsReceived: senderObjectId } }
    );

    return { success: true, message: "Friend request sent" };

  } catch (error) {
    console.error("Error sending friend request:", error);
    return { success: false, message: error.message };
  }
}

export async function acceptFriendRequest(receiverId, senderId) {
  try {
    const receiverObjectId = new ObjectId(receiverId);
    const senderObjectId = new ObjectId(senderId);

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

    return { success: true, message: "Friend request accepted" };

  } catch (error) {
    console.error("Error accepting request:", error);
    return { success: false, message: error.message };
  }
}

export async function declineFriendRequest(receiverId, senderId) {
  try {
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

    return { success: true, message: "Friend request declined" };

  } catch (error) {
    console.error("Error declining request:", error);
    return { success: false, message: error.message };
  }
}

export async function removeFriend(userId, friendId) {
  try {
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

    return { success: true, message: "Friend removed successfully" };

  } catch (error) {
    console.error("Error removing friend:", error);
    return { success: false, message: error.message };
  }
}


export async function addActivityEntry({projectId, userId, type, message, projectVersion}) {
  try {

    if(!projectId || !userId || !type || !message)
        return {success:false, message: "request incorrect"};
    const projectObjectId = new ObjectId(projectId);
    const userObjectId = new ObjectId(userId);

    // Prepare activity entry
    const activityEntry = {
      projectId: projectObjectId,
      userId: userObjectId,
      type: type,
      message: message,
      projectVersion: projectVersion || '1.0.0',
      createdAt: new Date(),
      downloads: 0 
    };

    // Insert into activityfeed collection
    const insertResult = await db.collection("activities").insertOne(activityEntry);
    const entryId = insertResult.insertedId;

    if (!entryId) {
      return { success: false, message: 'Failed to add activity entry' };
    }

    // Fetch the full entry with _id for return
    const createdEntry = await db.collection("activities").findOne({ _id: entryId });
    
    const addtoproject = await db.collection("projects").updateOne(
        {_id:projectObjectId},
        {
            $addToSet:{activityFeed:entryId}
        }
    )

    const added= addtoproject.insertedId;

    if(!added){
        return {
            success: true,
            message: 'Activity entry added successfully but project not found',
            entry: createdEntry // Includes _id and all fields
        };
    }

    return {
      success: true,
      message: 'Activity entry added successfully',
      entry: createdEntry // Includes _id and all fields
    };

  } catch (error) {
    console.error("Error adding activity entry:", error);
    return { success: false, message: error.message || 'Failed to add activity entry' };
  }
}

export async function addDiscussionEntry({projectId, userId, message}) {
  try {

    if(!projectId || !userId  || !message)
        return {success:false, message: "request incorrect"};

    const projectObjectId = new ObjectId(projectId);
    const userObjectId = new ObjectId(userId);

    // Prepare discussion entry
    const discussionEntry = {
      projectId: projectObjectId,
      userId: userObjectId,
      message: message,
      createdAt: new Date()
    };

    // Insert into discussions collection
    const insertResult = await db.collection("discussions").insertOne(discussionEntry);
    const entryId = insertResult.insertedId;

    if (!entryId) {
      return { success: false, message: 'Failed to add discussion entry' };
    }

    // Fetch the full entry with _id for return
    const createdEntry = await db.collection("discussions").findOne({ _id: entryId });

    const addtoproject = await db.collection("projects").updateOne(
        {_id:projectObjectId},
        {
            $addToSet:{discussionBoard:entryId}
        }
    )

    const added= addtoproject.insertedId;

    if(!added){
        return {
            success: true,
            message: 'Discussion entry added successfully but project not found',
            entry: createdEntry // Includes _id and all fields
        };
    }

    return {
      success: true,
      message: 'Discussion entry added successfully',
      entry: createdEntry // Includes _id and all fields
    };

  } catch (error) {
    console.error("Error adding discussion entry:", error);
    return { success: false, message: error.message || 'Failed to add discussion entry' };
  }
}

// Helper function to validate ObjectId string
function validateObjectId(id) {
  return new ObjectId(id);
}

export async function deleteProject(projectId,requesterId) {
  try {
    const projectObjectId = validateObjectId(projectId);
    const requesterObjectId = validateObjectId(requesterId);

    const project = await db.collection('projects').findOne({ _id: projectObjectId });
    if (!project) {
      return { success: false, message: 'Project not found' };
    }
    if (!project.owner.equals(requesterObjectId)) {
      return { success: false, message: 'Only the project owner can delete it' };
    }

    const activityDeleteResult = await db.collection('activities').deleteMany({ projectId: projectObjectId });

    const discussionDeleteResult = await db.collection('discussions').deleteMany({ projectId: projectObjectId });

    const affectedUsers = await db.collection('users').find({
      $or: [
        { ownedProjects: { $in: [projectObjectId] } },
        { memberOfProjects: { $in: [projectObjectId] } },
        { pinnedProjects: { $in: [projectObjectId] } }  // Assumes pinnedProject is an array
      ]
    }).toArray();

    const uniqueUserIds = [...new Set(affectedUsers.map(user => user._id.toString()))];
    let updatedUserCount = 0;
    // Update each unique user: Pull from all relevant fields
    for (const userIdStr of uniqueUserIds) {
      const userObjectId = new ObjectId(userIdStr);
      const updateOps = { $pull: {} };
      // Always attempt pulls (MongoDB ignores if field doesn't exist or value not present)
      updateOps.$pull.ownedProjects = projectObjectId;
      updateOps.$pull.memberOfProjects = projectObjectId;
      updateOps.$pull.pinnedProject = projectObjectId;
      const updateResult = await db.collection('users').updateOne(
        { _id: userObjectId },
        updateOps
      );
      if (updateResult.modifiedCount > 0) {
        updatedUserCount++;
      }
    }

    const projectDeleteResult = await db.collection('projects').deleteOne({ _id: projectObjectId });
    if (projectDeleteResult.deletedCount === 0) {
      return { success: false, message: 'Failed to delete project' };
    }

    return {
      success: true,
      message: `Project "${project.name}" deleted successfully.`
    };

  }catch (error) {
    console.error('Error deleting project:', error);
    return { success: false, message: error.message || 'Failed to delete project' };
  }
}

// Function to delete a user and clean up related data
export async function deleteUser (userId,requesterId) {
  try {

    if (userId !== requesterId) {
      return { success: false, message: 'You can only delete your own account' };
    }

    const userObjectId = validateObjectId(userId);

    // Check if user exists
    const user = await db.collection('users').findOne({ _id: userObjectId });
    if (!user) {
      return { success: false, message: 'User  not found' };
    }

    // Step 1: Delete all projects owned by this user (cascade deletion)
    const ownedProjects = user.ownedProjects || [];
    let deletedProjectCount = 0;
    for (const projId of ownedProjects) {
      const projectResponse = await deleteProject(projId.toString()); // Recursive call
      if (projectResponse.success) {
        deletedProjectCount++;
      } else {
        console.warn(`Failed to delete owned project ${projId}: ${projectResponse.message}`);
      }
    }

    // Step 2: Remove user from all projects' members arrays (for non-owned projects)
    const memberProjects = await db.collection('projects').find({ members: userObjectId }).toArray();
    for (const project of memberProjects) {
      await db.collection('projects').updateOne(
        { _id: project._id },
        { $pull: { members: userObjectId } }
      );
    }

    // Step 3: Clean friendships (remove from all friends' friends arrays)
    const friends = user.friends || [];
    for (const friendId of friends) {
      await db.collection('users').updateOne(
        { _id: friendId },
        { $pull: { friends: userObjectId } }
      );
    }

    // Clean sent friend requests (remove from receivers' received)
    const sentRequests = user.friendRequestsSent || [];
    for (const receiverId of sentRequests) {
      await db.collection('users').updateOne(
        { _id: receiverId },
        { $pull: { friendRequestsReceived: userObjectId } }
      );
    }

    // Clean received friend requests (remove from senders' sent)
    const receivedRequests = user.friendRequestsReceived || [];
    for (const senderId of receivedRequests) {
      await db.collection('users').updateOne(
        { _id: senderId },
        { $pull: { friendRequestsSent: userObjectId } }
      );
    }

    const activityDeleteResult = await db.collection('activities').deleteMany({ userId: userObjectId });

    const discussionDeleteResult = await db.collection('discussions').deleteMany({ userId: userObjectId });

    const userDeleteResult = await db.collection('users').deleteOne({ _id: userObjectId });
    if (userDeleteResult.deletedCount === 0) {
      return { success: false, message: 'Failed to delete user' };
    }

    return {
      success: true,
      message: `User  "${user.name || userId}" deleted successfully. Deleted ${deletedProjectCount} owned projects, cleaned ${memberProjects.length} memberships, ${friends.length} friendships, and related activities/discussions.`
    };

  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, message: error.message || 'Failed to delete user' };
  }
}

export async function getProject(projectId){
  const objectid= new ObjectId(projectId);
    try{
        const user= await db.collection('projects').findOne({
            _id:{$in:[objectid]}
        });
        return { success:true,project:user};
    }catch(error){
        console.error("Error getting project: ",error);
        return { success:false,message:error} ;
    }
}

export async function searchUsers(searchTerm) {
    try {
        const users = await db.collection('users').find({
            username: new RegExp(searchTerm, 'i')
        }).project({ password: 0 }).toArray();
        return { success: true, users: users };
    } catch (error) {
        console.error('Error searching users:', error);
        return { success: false, message: error.message };
    }
}

// In api.js, add this new function
export async function searchAll(searchTerm) {
    try {
        if (!searchTerm || searchTerm.trim().length < 2) {
            return { success: true, results: { users: [], projects: [], hashtags: [] } };
        }

        const regex = new RegExp(searchTerm.trim(), 'i'); // Case-insensitive partial match

        // Search users by username
        const users = await db.collection('users')
            .find({ username: regex })
            .project({ password: 0, email: 0 }) // Exclude sensitive fields
            .limit(10) // Limit results for performance
            .toArray();

        // Search projects by name
        const projectsByName = await db.collection('projects')
            .find({ name: regex })
            .limit(10)
            .toArray();

        // Search projects by hashtags (match any hashtag in the array)
        const projectsByHashtag = await db.collection('projects')
            .find({ hashtags: regex }) // MongoDB $regex on array elements
            .limit(10)
            .toArray();

        // Combine projects (remove duplicates by _id)
        const allProjects = [...new Map([...projectsByName, ...projectsByHashtag].map(p => [p._id, p])).values()];

        // Extract unique hashtags from matching projects (for hashtag results)
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
        return { success: false, message: error.message };
    }
}
