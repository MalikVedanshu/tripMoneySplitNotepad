import express from "express";
const port = process.env.PORT || 5000;
const app = express();
import path from 'path';
import { fileURLToPath } from 'url';
import './Utils/dbConnect.js';

import userRouter from './Controllers/usersRouter.js';
import tripRouter from './Controllers/tripRouter.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'build')));


app.use(express.json())

app.use('/api/users', userRouter);
app.use('/api/trip',tripRouter);

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname+'/build/index.html'));
})

app.listen(port,() => {
    console.log(`app started at ${port}`);
})
