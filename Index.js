import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.set("view engine", "ejs");

const database = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "123456",
  port: 5432,
});
database.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

let users = [
  { id: 1, name: "Name one", color: "red" },
  { id: 2, name: "Name teo", color: "beige
];

async function checkVisited() {
  const result = await database.query(
    `SELECT country_code 
     FROM visited_countries 
     JOIN users ON users.id = user_id 
     WHERE user_id = $1;`,
    [currentUserId]
  );
  return result.rows.map((row) => row.country_code);
}

async function getCurrentUser() {
  const result = await database.query("SELECT * FROM users");
  users = result.rows;
  return users.find((user) => user.id === Number(currentUserId));
}

app.get("/", async (req, res) => {
  const countries = await checkVisited();
  const currentUser = await getCurrentUser();

  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: currentUser?.color || "white",
  });
});

app.post("/add", async (req, res) => {
  const input = req.body["country"];
  const currentUser = await getCurrentUser();

  try {
    const result = await database.query(
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
      await database.query(
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

app.post("/user", async (req, res) => {
  if (req.body.add === "new") {
    res.render("new.ejs");
  } else {
    currentUserId = Number(req.body.user);
    res.redirect("/");
  }
});

app.post("/new", async (req, res) => {
  const name = req.body.name;
  const color = req.body.color;

  const result = await database.query(
    `INSERT INTO users (name, color) 
     VALUES($1, $2) 
     RETURNING *;`,
    [name, color]
  );

  currentUserId = result.rows[0].id;

  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
