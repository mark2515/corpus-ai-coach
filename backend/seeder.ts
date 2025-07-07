import mongoose from "mongoose";
import dotenv from 'dotenv';
import connectDB from "./config/db";
import users from "./data/users";
import wordLists from "./data/wordLists";
import User from "./models/userModel";
import WordLists from "./models/wordListsModel";

dotenv.config();
connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;
        const sampleWordLists = wordLists.map(wordLists => {
            return { ...wordLists, user: adminUser }
        });
        await WordLists.insertMany(sampleWordLists);
        console.log('Sample data has been inserted!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
    }
}

const destroyData = async () => {
    try {
        await User.deleteMany();
        await WordLists.deleteMany();
        console.log('Sample data has been destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
    }
}

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
