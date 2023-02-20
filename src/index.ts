import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express, {Application, Request, Response} from 'express';
import bodyParser from "body-parser";

const app:Application = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

app.get("./", (req: Request, res: Response) =>{
    res.send("helthey");
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`);
});
console.log("secret code = ", process.env.SECRET_CODE);

// if you want anyone to be able to connect 
app.use(cors({origin: true}));
//if you want to connect only your frontend to connect 
app.use(cors({origin: "http://localhost:3000"})) 
