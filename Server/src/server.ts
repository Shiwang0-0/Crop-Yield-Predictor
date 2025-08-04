import express from 'express';
import cors from 'cors';
import dotenv from "dotenv"
import { corsOptions } from './utils/corsConfig';
import userRoute from './routes/user'
import connectDB from './utils/database';
import errorMiddleware from './middleware/error';
import cookieParser from "cookie-parser";
import { getLeaderboardEntries } from './controller/leaderboard';
import { support } from './controller/support';

const app=express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

dotenv.config({
    path:"./.env"
})

const URI=process.env.MONGO_URI;
const PORT=process.env.PORT;

connectDB();

app.get('/',(req,res)=>{
    res.send("connected to ts backend");
});

app.get("/leaderboard",getLeaderboardEntries);
app.get("/support", support);
app.use('/user', userRoute);

app.use(errorMiddleware)

app.listen(PORT,()=>{
    console.log("server running on port",PORT);
})