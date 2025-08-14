import mongoose from "mongoose";
import dotenv from 'dotenv';
import connectDB from "./config/db";
import User from "./models/usersModel";
import WordLists from "./models/wordListsModel";
import Messages from "./models/messagesModel";
import Assistants from "./models/assistantsModel";
import Sessions from "./models/sessionsModel";

dotenv.config();
connectDB();

const destroyData = async () => {
    try {
        await User.deleteMany();
        await WordLists.deleteMany();
        await Messages.deleteMany();
        await Assistants.deleteMany();
        await Sessions.deleteMany();
        console.log('Sample data has been destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
    }
}

if (process.argv[2] === '-d') {
    destroyData();
}
