const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5011; // Changed port to 5011
const USERS_FILE = "users.json";

app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests

// Root API
app.get("/", (req, res) => {
  res.json({ message: "Hello from Node.js backend!" });
});

// Login API
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Read user data from JSON file
  fs.readFile(USERS_FILE, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error reading user data" });
    }

    const users = JSON.parse(data);
    const user = users.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      res.json({ message: "Login successful", user });
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  });
});

// Add User API
app.post("/addUser", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  // Read current users
  fs.readFile(USERS_FILE, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error reading user data" });
    }

    let users = JSON.parse(data);

    // Check if user already exists
    if (users.some((user) => user.username === username)) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Add new user
    users.push({ username, password });

    // Save to file
    fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Error saving user data" });
      }
      res.json({ message: "User added successfully" });
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} 🎯`);
});
