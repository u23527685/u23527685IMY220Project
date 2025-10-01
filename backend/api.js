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