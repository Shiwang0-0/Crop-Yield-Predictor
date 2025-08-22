import express, {Request, Response} from 'express';
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
import fs from 'fs';

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

app.get("/api/leaderboard",getLeaderboardEntries);
app.get("/api/support", allSupportReq);
app.use('/api/user', userRoute);

// ----------- Deployment  ------------

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
    const projectRoot = path.resolve(__dirname, '..', '..');

    const clientDistPath = path.join(projectRoot, "Client", "dist");

    app.use(express.static(clientDistPath));

    app.all('/*splat', (req:Request, res:Response) => {
        const indexPath = path.join(clientDistPath, 'index.html');
        if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
        } else {
            res.status(404).send('index.html not found');
        }
    });
}else{
    app.get("/",(req,res)=>{
        res.send("Success");
    })
}

// ----------- Deployment  ------------

app.use(errorMiddleware)

app.listen(PORT,()=>{
    console.log("server running on port",PORT);
})