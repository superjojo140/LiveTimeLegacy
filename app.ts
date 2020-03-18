import dotenv from "dotenv"
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import jwtAuth from "./middleware/jwt-auth"
import jwt from "jsonwebtoken"

dotenv.config();
const app = express();

//Body parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Allow CORS
app.use(cors());


const port: number = Number(process.env.PORT);

app.get('/', function (req, res) {
    res.send('Hello my darling!');
});

//This route is protected by JWT Auth Middleware
app.get('/secret', jwtAuth, function (req, res) {
    res.send('I will tell you a secret...');
});

app.post('/login', (req, res) => {
    const username: string = req.body.username;
    const password: string = req.body.password;

    if (password == "secret") {

        const token = jwt.sign(
            {
                username: username
            },
            process.env.JWT_KEY,
            {
                expiresIn: "1h"
            }
        );
        return res.status(200).json({
            message: "Auth successful",
            token: token
        });
    }
    res.status(401).json({
        message: "Auth failed"
    });

});

app.listen(port, function () {
    console.log(`LiveTime Server listening on http://localhost:${port}`);
});