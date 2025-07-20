// Import required modules
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

// Create Express app
const app = express();
const port = 3000;

// Set EJS as the view engine (required to render .ejs templates)
app.set("view engine", "ejs");

// Set up PostgreSQL client with connection configuration
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "123456",
  port: 5432,
});
db.connect(); // Connect to PostgreSQL database

// Middleware to parse URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (e.g., CSS, images) from "public" directory
app.use(express.static("public"));

// Variable to track the currently selected user
let currentUserId = 1;

// Fallback users array in case DB query fails
let users = [
  { id: 1, name: "Person one", color: "white" },
  { id: 2, name: "Person two", color: "beige" },
];

// Function to get a list of visited country codes for the current user
async function checkVisited() {
  const result = await

Here's the **complete fixed and commented code** ready to copy:

```js
// Import required modules
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

// Create Express app
const app = express();
const port = 3000;

// Set EJS as the view engine
app.set("view engine", "ejs");

// Set up PostgreSQL client with connection configuration
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "123456",
  port: 5432,
});
db.connect(); // Connect to PostgreSQL

// Middleware to parse URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from "public" directory
app.use(express.static("public"));

// Track the currently selected user
let currentUserId = 1;

// Default users (used if DB not populated yet)
let users = [
  { id: 1, name: "Angela", color: "teal" },
  { id: 2, name: "Jack", color: "powderblue" },
];

// Get list of visited countries (by country code) for the current user
async function checkVisited() {
  const result = await db.query(
    `SELECT country_code 
     FROM visited_countries 
     JOIN users ON users.id = user_id 
     WHERE user_id = $1;`,
    [currentUserId]
  );

  // Extract country codes into array
  return result.rows.map((row) => row.country_code);
}

// Get current user info from database
async function getCurrentUser() {
  const result = await db.query("SELECT * FROM users");
  users = result.rows; // Update global users array

  // Find and return current user object
  return users.find((user) => user.id === Number(currentUserId));
}

// Route: GET /
app.get("/", async (req, res) => {
  const countries = await checkVisited(); // Countries visited by current user
  const currentUser = await getCurrentUser(); // Current user object

  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: currentUser?.color || "white", // fallback color
  });
});

// Route: POST /add – Add a visited country for current user
app.post("/add", async (req, res) => {
  const input = req.body["country"];
  const currentUser = await getCurrentUser();

  try {
    // Find country code from country name (partial match)
    const result = await db.query(
      `SELECT country_code 
       FROM countries 
       WHERE LOWER(country_name) LIKE '%' || $1 || '%';`,
      [input.toLowerCase()]
    );

    if (result.rows.length === 0) {
      console.log("No matching country found.");
      return res.redirect("/");
    }

    const countryCode = result.rows[0].country_code;

    try {
      // Insert visited country for the current user
      await db.query(
        `INSERT INTO visited_countries (country_code, user_id) 
         VALUES ($1, $2);`,
        [countryCode, currentUserId]
      );
    } catch (err) {
      console.error("Error inserting visited country:", err);
    }
  } catch (err) {
    console.error("Error querying country:", err);
  }

  res.redirect("/");
});

// Route: POST /user – Switch user or add a new user
app.post("/user", async (req, res) => {
  if (req.body.add === "new") {
    // Render new user form
    res.render("new.ejs");
  } else {
    // Change current user
    currentUserId = Number(req.body.user);
    res.redirect("/");
  }
});

// Route: POST /new – Add a new user
app.post("/new", async (req, res) => {
  const name = req.body.name;
  const color = req.body.color;

  // Insert new user and return inserted row
  const result = await db.query(
    `INSERT INTO users (name, color) 
     VALUES($1, $2) 
     RETURNING *;`,
    [name, color]
  );

  // Update current user ID to the new user
  currentUserId = result.rows[0].id;

  res.redirect("/");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
