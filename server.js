import express from 'express';
import mysql from 'mysql'
import cors from 'cors'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';
const salt = 10;

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const db = mysql.createConnection({
    host : "localhost",
    user: "root",
    password :"",
    database : 'signup'
})
app.post('/register', (req,res) => {
    const sql = "INSERT INTO login('name', 'email', 'password')V ALUES(?)";
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if(err) return req.json({Error: "Error for hashing password"})
    })
    const value = [
        req.body.name,
        req.body.password,
        req.body.email
    ]
    db.query(sql,[values], (err, result) => {
        if(err) return res.json({Error: "error isnerting in server"})
        return req.json({Status: "Succes"});
        })

})

app.post('/login', (req,res) => {
    const sql = 'SELECT * FROM login WHERE email = ? ';
    db.query(sql, [req.body.email], (err, data) => {
        if(err) return res.json({Error: "Login error"})
            return req.json({Status: "Succes"});

            })
    })

const PORT = 4000;
app.listen(PORT, () => {
    console.log("Running on ${PORT}")
})