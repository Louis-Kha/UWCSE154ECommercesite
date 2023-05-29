'use strict';

const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const multer = require('multer');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

/**
 * Get request endpoint that allows all items from the store to be retrieved.
 */
app.get('/main-view/items', async (req, res) => {
  try {
    let db = await getDBConnection();
    let query = "SELECT * FROM store";
    let results = await db.all(query);
    res.type('json').send({"store": results});

  } catch (err) {
    res.type('text').send("An error occurred on the server. Try again later.");
  }
});

/**
 * Establishes a database connection to the database and returns the database object.
 * Any errors that occur should be caught in the function that calls this one.
 * @returns {sqlite3.Database} - The database object for the connection.
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: "store.db", // replace this with your db file name
    driver: sqlite3.Database
  });
  return db;
}

app.use(express.static('public'));
const PORT = process.env.PORT || 8000;
app.listen(PORT);

