-- Drop the tables if they already exist to avoid errors when recreating
DROP TABLE IF EXISTS visited_countries, users;

-- Create the 'users' table with a unique name and optional color
CREATE TABLE users (
  id SERIAL PRIMARY KEY,           -- Auto-incrementing primary key
  name VARCHAR(15) UNIQUE NOT NULL,-- User's name (must be unique, can't be null)
  color VARCHAR(15)                -- Optional color associated with the user
);

-- Create the 'visited_countries' table
CREATE TABLE visited_countries (
  id SERIAL PRIMARY KEY,           -- Auto-incrementing primary key
  country_code CHAR(2) NOT NULL,   -- 2-letter country code (e.g., 'US', 'FR')
  user_id INTEGER REFERENCES users(id) -- Foreign key linking to the 'users' table
);

-- Insert sample users into the 'users' table
INSERT INTO users (name, color)
VALUES ('Angela', 'teal'), ('Jack', 'powderblue');

-- Insert sample visited countries linked to user IDs
INSERT INTO visited_countries (country_code, user_id)
VALUES ('FR', 1), ('GB', 1), ('CA', 2), ('FR', 2);

-- Query to join both tables and show visited countries with user info
SELECT *
FROM visited_countries
JOIN users
ON users.id = user_id;
