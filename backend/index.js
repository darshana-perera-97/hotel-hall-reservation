const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5011;
const DATA_FILE = "users.json"; // File to store user data
const PACKAGES_FILE = "packages.json"; // File to store packages data

app.use(cors());
app.use(express.json());

// Load existing users from file or initialize an empty array
let users = [];
if (fs.existsSync(DATA_FILE)) {
  try {
    users = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (error) {
    console.error("Error reading users.json:", error);
    users = []; // Reset to empty array if invalid
  }
}

// Load existing packages from file or initialize an empty array
let packages = [];
if (fs.existsSync(PACKAGES_FILE)) {
  try {
    packages = JSON.parse(fs.readFileSync(PACKAGES_FILE, "utf8"));
  } catch (error) {
    console.error("Error reading packages.json:", error);
    packages = []; // Reset to empty array if invalid
  }
}

// API to add a new user
app.post("/addUser", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  // Check if the username already exists
  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    return res.status(400).json({
      error: "Username already exists. Please choose a different username.",
    });
  }

  // Add new user to the array
  users.push({ username, password });

  // Save updated users list to the JSON file
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));

  res.json({ message: "User registered successfully" });
});

// API to login (check credentials)
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  // Check if user exists and the password matches
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(400).json({ error: "Invalid username or password" });
  }

  res.json({ message: "Login successful!" });
});

// API to list all users (for debugging)
app.get("/users", (req, res) => {
  res.json(users);
});

// API to add a new package
app.post("/addPackage", (req, res) => {
  const { packageName, price, items } = req.body;
  const owner = req.body.owner || null; // Owner should be passed, or use localStorage value

  // Check if all required fields are provided
  if (
    !packageName ||
    !price ||
    !Array.isArray(items) ||
    items.length === 0 ||
    !owner
  ) {
    return res
      .status(400)
      .json({ error: "Package name, price, items, and owner are required" });
  }

  // Create a new package object
  const newPackage = {
    packageName,
    owner,
    price,
    items,
  };

  // Add new package to the array
  packages.push(newPackage);

  // Save updated packages list to the JSON file
  fs.writeFileSync(PACKAGES_FILE, JSON.stringify(packages, null, 2));

  res.json({ message: "Package added successfully", package: newPackage });
});

// API to list all packages (for debugging)
app.get("/packages", (req, res) => {
  res.json(packages);
});

// API to get all packages for a specific owner
app.get("/getPackagesByOwner", (req, res) => {
  const owner = req.query.owner;

  // Check if owner is provided
  if (!owner) {
    return res.status(400).json({ error: "Owner is required" });
  }

  // Filter packages by the owner's username
  const userPackages = packages.filter((pkg) => pkg.owner === owner);

  res.json(userPackages);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
