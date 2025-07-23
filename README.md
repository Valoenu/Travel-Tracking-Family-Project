# 🌍 World Visited Countries Tracker

This is a Node.js + PostgreSQL web app I built as part of **The Complete Web Development Bootcamp** by [The App Brewery](https://www.appbrewery.co/). It helped me learn how to work with **Express**, **PostgreSQL**, **EJS**, and RESTful routing — all while building something real and visual!

Track the countries you’ve visited — and see how your adventures stack up!
This is a full-stack web app built with Node.js, Express, PostgreSQL, and EJS, created as part of The Complete Web Development Bootcamp by The App Brewery.

## 📚 What It Does

This app lets users:
- Select their user profile.
- Search for countries they’ve visited by name.
- Add those countries to their personal visited list.
- See the total count of countries visited.
- Switch between users or add new ones.

Everything is saved to a PostgreSQL database.

## 💡 Technologies Used

- **Node.js** (JavaScript runtime)
- **Express.js** (web framework)
- **PostgreSQL** (relational database)
- **EJS** (for rendering dynamic HTML)
- **Body-parser** (middleware for parsing POST data)

## 🧠 What I Learned

- How to set up and connect to a PostgreSQL database using `pg`.
- How to use `EJS` templates to dynamically render data on the front-end.
- How to create RESTful routes in Express (`GET`, `POST`).
- How to structure a full-stack app using MVC principles.
- How to join SQL tables and use query parameters securely with prepared statements.

## 🗃️ Database Schema

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(15) UNIQUE NOT NULL,
  color VARCHAR(15)
);

CREATE TABLE visited_countries (
  id SERIAL PRIMARY KEY,
  country_code CHAR(2) NOT NULL,
  user_id INTEGER REFERENCES users(id)
);
