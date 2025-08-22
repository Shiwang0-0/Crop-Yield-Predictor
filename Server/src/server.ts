import express from 'express';
import cors from 'cors';
import dotenv from "dotenv"
import { corsOptions } from './utils/corsConfig.js';
import userRoute from './routes/user.js'
import connectDB from './utils/database.js';
import errorMiddleware from './middleware/error.js';
import cookieParser from "cookie-parser";
import { getLeaderboardEntries } from './controller/leaderboard.js';
import { allSupportReq } from './controller/support.js';
import path from 'path';
import { fileURLToPath } from 'url';

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
app.get("/support", allSupportReq);
app.use('/user', userRoute);

// ----------- Deployment  ------------

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const _dirname1 = path.resolve(__dirname, '..', '..')

if(process.env.NODE_ENV=='production'){
    app.use(express.static(path.join(_dirname1, "Client", "dist")));

    app.all('/{*any}',(req,res)=>{
        res.sendFile(path.resolve(_dirname1,"Client","dist","index.html"));
    });
}
else{
    app.get("/",(req,res)=>{
        res.send("Success");
    })
}

// ----------- Deployment  ------------

app.use(errorMiddleware)
console.log(process.env.NODE_ENV)

app.listen(PORT,()=>{
    console.log("server running on port",PORT);
})