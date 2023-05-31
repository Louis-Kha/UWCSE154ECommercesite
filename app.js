"use strict";

const express = require('express');
const app = express();
const multer = require("multer");
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');


app.use(express.urlencoded({extended: true})); // built-in middleware
app.use(express.json()); // built-in middleware
app.use(multer().none()); // requires the "multer" module

app.post('/login', async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  try {
    let db = await getDBConnection();
    await db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      password TEXT
    )`);

    // await db.run('DELETE FROM users WHERE username = "test"');
    // await db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, ["test", "123"]);
    let results = await db.all('SELECT * from users WHERE username = ? AND password = ?', [username, password]);
    await db.close();
    if (results.length != 0) {
      res.type('text').send("true");
    } else {
      res.type('text').send("false");
    }
  } catch (err) {
    // status code
    res.status(500);
    res.type('text').send('something went wrong');
  }
});

app.get('/checkout/cart/:username', async (req, res) => {
  let username = req.params.username;
  try {
    let db = await getDBConnection();
    await db.run(`CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      itemName TEXT,
      quantity INTEGER,
      username TEXT
    )`);
    // await db.run('INSERT INTO cart (name, quantity, username) VALUES (?, ?, ?)', ["other", "2", username]);
    let results = await db.all(`SELECT * FROM cart WHERE username = ?`, [username]);
    await db.close();
    res.json(results);
  } catch (err) {
    res.status(500);
    res.type('text').send('something went wrong');
  }
});

app.post('/checkout/quantity', async (req, res) => {
  let itemName = req.body.itemName;
  let username = req.body.username;
  let flag = req.body.flag;
  try {
    let db = await getDBConnection();
    let results = await db.get('SELECT * FROM cart WHERE itemName = ? AND username = ?', [itemName, username]);
    let quantity;
    if (flag === "+") {
      quantity = parseInt(results.quantity) + 1;
    } else {
      quantity = parseInt(results.quantity) - 1;
    }

    if (quantity === 0) {
      await db.run('DELETE FROM cart WHERE itemName = ? AND username = ?', [itemName, username]);
    } else {
      await db.run('UPDATE cart SET quantity = ? WHERE itemName = ? AND username = ?', [quantity, itemName, username]);
    }
    await db.close();
    res.type('text').send(quantity.toString());

    // await db.run('INSERT INTO cart (name, quantity, username) VALUES (?, ?, ?)', ["other", "2", username]);

  } catch (err) {
    res.status(500);
    res.type('text').send(err);
  }
});

app.post('/checkout/buy', async (req, res) => {
  let username = req.body.username;
  let itemName = req.body.itemName;
  let quantity = req.body.quantity;
  let date = req.body.date;
  try {
    let db = await getDBConnection();
    await db.run(`CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      itemName TEXT,
      quantity INTEGER,
      username TEXT,
      date TIMESTAMP
    )`);
    await db.run('INSERT INTO purchases (itemName, quantity, username, date) VALUES (?, ?, ?, ?)', [itemName, quantity, username, date]);
    await db.close();
    res.type('text').send("Purchased item: " + itemName);


  } catch (err) {
    res.status(500);
    res.type('text').send(err);
  }
});

app.post('/checkout/clear', async (req, res) => {
  let username = req.body.username;
  try {
    let db = await getDBConnection();
    let results = await db.get('DELETE FROM cart WHERE username = ?', [username]);
    await db.close();
    res.type('text').send("cleared");

    // await db.run('INSERT INTO cart (name, quantity, username) VALUES (?, ?, ?)', ["other", "2", username]);

  } catch (err) {
    res.status(500);
    res.type('text').send(err);
  }
});

app.post('/itemview/add', async (req, res) => {
  let itemName = req.body.itemName;
  let username = req.body.username;
  try {
    let db = await getDBConnection();
    await db.run(`CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      itemName TEXT,
      quantity INTEGER,
      username TEXT
    )`);

    let results = await db.all('SELECT * FROM cart WHERE itemName = ? AND username = ?', [itemName, username]);

    if (results.length != 0) {
      await db.run('UPDATE cart SET quantity = ? WHERE itemName = ? AND username = ?', [parseInt(results[0].quantity) + 1, itemName, username]);
      res.type('text').send("Increased " + itemName + " by 1 in cart");
    } else {
      await db.run('INSERT INTO cart (itemName, username, quantity) VALUES (?, ?, 1)', [itemName, username]);
      res.type('text').send("Added item into cart" + itemName);
    }
    await db.close();
  } catch (err) {
    res.status(500);
    res.type('text').send(err);
  }
});

app.post('/purchases/history/:username', async (req, res) => {
  let username = req.params.username;
  let date = req.body.date;
  console.log(date)
  try {
    let db = await getDBConnection();

    let results;
    if (date) {
      results = await db.all('SELECT * FROM purchases WHERE username = ? AND date = ?', [username, date]);
    } else {
      results = await db.all('SELECT date FROM purchases WHERE username = ? GROUP BY date', [username]);
    }
    await db.close();
    res.json(results);

    // await db.run('INSERT INTO cart (name, quantity, username) VALUES (?, ?, ?)', ["other", "2", username]);

  } catch (err) {
    res.status(500);
    res.type('text').send(err);
  }
});
/**
 * Establishes a database connection to the database and returns the database object.
 * Any errors that occur should be caught in the function that calls this one.
 * @returns {sqlite3.Database} - The database object for the connection.
 */
async function getDBConnection() {
  const db = await sqlite.open({
      filename: 'data.db',
      driver: sqlite3.Database
  });
  return db;
}


app.use(express.static('public'));

const otherPort = 8000;
const PORT = process.env.PORT || otherPort;

app.listen(PORT);
