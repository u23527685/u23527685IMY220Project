import { MongoClient } from "mongodb";

const connectionString="mongodb+srv://ProjectUser:ProjecyUser77@databases.rkr0bx9.mongodb.net/?retryWrites=true&w=majority&appName=Databases";
const dbName="VeyoDatabase";

let client;
let db;

export async function connectToMongoDB(){
    try {
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
        return user;
    } catch (error) {
        console.error('Error authenticating user:', error);
        return null;
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
            throw new Error('Username or email already taken');
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
                contactInfo:{
                    email
                },
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
            return newUser ; // or return the inserted user with _id
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
        return projects;
    }catch (error){
        console.error("Error getting projects: ",error);
        return[];
    }
}