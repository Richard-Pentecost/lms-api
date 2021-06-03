const mysql = require('mysql2/promise');
// require path to handle file paths
const path = require('path');

// extract any command line arguments from argv
const args = process.argv.slice(2)[0];

// use args to detemine if .env or .env.test shoudl be loaded
const envFile = args === 'test' ? '../.env.test' : '../.env';

// load environment variables from env files
require('dotenv').config({
  path: path.join(__dirname, envFile),
});

// destructure environment variables from process.env
const { DB_PASSWORD, DB_NAME, DB_USER, DB_HOST, DB_PORT } = process.env;

// This asynchronous function will run before app
const setupDatabase = async () => {
  try {
    // connect to the database
    const db = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT,
    });

    // create the database if it doesn't exist
    await db.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
    await db.query(`USE ${DB_NAME}`);
    await db.query(`CREATE TABLE IF NOT EXISTS Book (
      id INT PRIMARY KEY auto_increment,
      name VARCHAR(100),
      author VARCHAR(25)
    )`);
    db.close();
  } catch (err) {
    console.log(`Your environment variables might be wrong. Please check .env file`);
    console.log(err);
  }
};

// run the async function
setupDatabase();
