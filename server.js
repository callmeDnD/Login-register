import express from "express";
import mysql from "mysql2";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Change accordingly
  database: "auth_db"
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected");
});

// Register Endpoint
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, hashedPassword], (err, result) => {
    if (err) return res.status(500).json({ message: "Error registering user" });
    res.json({ message: "User registered successfully" });
  });
});

// Login Endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err || results.length === 0) 
      return res.status(401).json({ message: "Invalid credentials" });
    
    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
    
    const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "1h" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  });
});

// Protected Route
app.get("/profile", (req, res) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, "secret", (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    res.json({ message: "Welcome to your profile", userId: decoded.id });
  });
});

app.listen(8000, () => console.log("Server running on port 8000"));
