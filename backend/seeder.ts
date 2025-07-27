import mongoose from "mongoose";
import dotenv from 'dotenv';
import connectDB from "./config/db";
import users from "./data/users";
import wordLists from "./data/wordLists";
import User from "./models/usersModel";
import WordLists from "./models/wordListsModel";

dotenv.config();
connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await User.insertMany(users);
        const sampleWordLists = wordLists.map(wordLists => {
            return wordLists;
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
