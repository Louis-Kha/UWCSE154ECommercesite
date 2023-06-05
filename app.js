"use strict";

const express = require('express');
const app = express();
const multer = require("multer");
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');


app.use(express.urlencoded({extended: true})); // built-in middleware
app.use(express.json()); // built-in middleware
app.use(multer().none()); // requires the "multer" module

/**
 * a POST request that allows users to add reviews to the database.
 */
app.post('/item-view/rate', async (req, res) => {
  try {
    if (req.body.item && req.body.username && req.body.review && req.body.score) {
      let db = await getDBConnection();
      let query = "INSERT INTO reviews (item, username, score, review, date) VALUES ('" +
      req.body.item + "', '" + req.body.username + "', '" + req.body.score + "', '" +
      req.body.review + "', DATETIME())";
      await db.run(query);
      await db.close();
      res.type('text').send("Successfully Added Review!");
    } else {
      await db.close();
      res.type('text').send("Missing one or more parameters, please try again!");
    }
  } catch (err) {
    await db.close();
    res.type('text').send("An error occurred on the server. Try again later.");
  }
});


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
    // await db.run(' users');

    // await db.run('DELETE FROM users WHERE username = "test"');
    await db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, ["test1", "123"]);
    let results = await db.all('SELECT * from users WHERE username = ? AND password = ?', [username, password]);
    await db.close();
    if (results.length != 0) {
      res.type('text').send(results.username);
    } else {
      res.status(400);
      res.type('text').send("Incorrect Uesrname or Password");
    }
  } catch (err) {
    // status code
    res.status(500);
    res.type('text').send('something went wsrong');
  }
});

app.get('/checkout/stock/:username', async (req, res) => {
  let username = req.params.username;
  try {
    let db = await getDBConnection();
    let results = await db.all("SELECT * FROM cart, store WHERE cart.username = ? " +
      "AND cart.itemName = store.name AND (cart.quantity > store.stock) AND store.stock != -1",
      [username]);
    if (results.length != 0) {
      res.status(400);
      res.type('text').send('Error: Insufficient Stock');
    } else {
      res.type('text').send('Sufficient Stock');
    }
  } catch (err) {
    res.status(500);
    res.type('text').send('something went wrong');
  }
})

app.get('/checkout/cart/:username', async (req, res) => {
  let username = req.params.username;
  console.log(username)
  try {
    let db = await getDBConnection();

    await db.run(`CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      itemName TEXT,
      quantity INTEGER,
      username TEXT,
      date TIMESTAMP,
      uid INTEGER
    )`);
    await db.run(`CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      itemName TEXT,
      quantity INTEGER,
      username TEXT
    )`);


    // await db.run('INSERT INTO cart (name, quantity, username) VALUES (?, ?, ?)', ["other", "2", username]);
    let results = await db.all(`SELECT store.name, store.price, store.src, cart.quantity FROM cart, store WHERE cart.username = ? AND cart.itemName = store.name`, [username]);
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
  let uid = req.body.uid;
  try {
    let db = await getDBConnection();
    await db.run(`CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      itemName TEXT,
      quantity INTEGER,
      username TEXT,
      date TIMESTAMP,
      uid INTEGER
    )`);

    await db.run('INSERT INTO purchases (itemName, quantity, username, date, uid) VALUES (?, ?, ?, ?, ?)', [itemName, quantity, username, date, uid]);
    await db.close();
    res.type('text').send(uid);


  } catch (err) {
    res.status(500);
    res.type('text').send(err);
  }
});

app.get('/checkout/uid', async (req, res) => {
  try {
    let db = await getDBConnection();
    let uid = req.query.uid;
    let results = await db.all('SELECT * FROM purchases WHERE uid = ?', [uid])
    if (results.length === 0) {
      res.type('text').send('0');
    } else {
      res.type('text').send('1')
    }
  } catch (err) {
    res.status(500);
    res.type('text').send(err);
  }
})

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

    console.log("create table")
    await db.run(`CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      itemName TEXT,
      quantity INTEGER,
      username TEXT
    )`);

    console.log(itemName);
    console.log(username);
    let results = await db.all('SELECT * FROM cart WHERE itemName = ? AND username = ?', [itemName, username]);

    console.log("after check")
    if (results.length != 0) {
      await db.run('UPDATE cart SET quantity = ? WHERE itemName = ? AND username = ?', [parseInt(results[0].quantity) + 1, itemName, username]);
      res.type('text').send("Increased " + itemName + " by 1 in cart");
    } else {
      await db.run('INSERT INTO cart (itemName, username, quantity) VALUES (?, ?, 1)', [itemName, username]);
      res.type('text').send("Added item into cart" + itemName);
    }
    console.log("finish")
    await db.close();
  } catch (err) {
    res.status(500);
    res.type('text').send(err);
  }
});

app.get('/purchases/history/:username', async (req, res) => {
  let username = req.params.username;
  let uid = req.query.uid;
  if (username) {
    try {
      let db = await getDBConnection();
      let results;
      // console.log("here");
      if (uid) {
        // console.log("here1");
        results = await db.all('SELECT purchases.itemName, purchases.quantity, store.price, store.src, purchases.date FROM purchases, store WHERE username = ? AND uid = ? AND purchases.itemName = store.name', [username, uid]);
        // console.log("here2");
      } else {
        // console.log("here3");
        results = await db.all('SELECT uid FROM purchases WHERE username = ? GROUP BY date ORDER BY date DESC', [username]);
        // console.log("here4");
      }
      await db.close();
      console.log(results);
      res.json(results);

      // await db.run('INSERT INTO cart (name, quantity, username) VALUES (?, ?, ?)', ["other", "2", username]);

    } catch (err) {
      res.status(500);
      res.type('text').send(err);
    }
  } else {
    res.status(400);
    res.type('text').send("User is not logged in");
  }
});

/**
 * Get request that retrieves all reviews from the database.
 */
app.get('/item-view/reviews/:item', async (req, res) => {
  try {
    if (req.params['item']) {
      let db = await getDBConnection();
      let query = "SELECT * FROM reviews WHERE item LIKE '%" + req.params['item'] + "%'";
      let results = await db.all(query);
      res.type('json').send({"reviews": results});
    } else {
      res.type('text').send("Missing item parameter, please try again!");
    }
  } catch (err) {
    res.type('text').send("An error occurred on the server. Try again later.");
  }
});

/**
 * Get request endpoint that allows all items from the store to be retrieved.
 */
app.get('/main-view/items', async (req, res) => {
  try {
    let db = await getDBConnection();
    if (req.query.search && req.query.category && req.query.category !== "None") {
      let query = "SELECT * FROM store WHERE name LIKE '%" + req.query.search + "%' AND category LIKE '%" +
      req.query.category + "%'";
      let results = await db.all(query);
      await db.close();
      res.type('json').send({"store": results});
    } else if (req.query.search) {
      let query = "SELECT * FROM store WHERE name LIKE '%" + req.query.search + "%'";
      let results = await db.all(query);
      await db.close();
      res.type('json').send({"store": results});
    } else if (req.query.category && req.query.category !== "None") {
      let query = "SELECT * FROM store WHERE category LIKE '%" + req.query.category + "%'";
      let results = await db.all(query);
      await db.close();
      res.type('json').send({"store": results});
    } else {
      let query = "SELECT * FROM store";
      let results = await db.all(query);
      await db.close();
      res.type('json').send({"store": results});
    }
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

