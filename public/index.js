"use strict";
(function() {

  window.addEventListener("load", init);

  /**
   * adds eventlistener when webpage is loaded in and displays the correct page
   * depending if the user is logged in or not
   */
  function init() {
    if (localStorage.getItem('username') !== null) {
      let loginScreen = document.getElementById('login');
      loginScreen.classList.add('hidden');

      let previousTransaction = document.getElementById('purchases-background');
      previousTransaction.classList.remove('hidden');
      getPurchases();
    } else {
      handleNotLoggedIn();
    }

    let logOut = document.querySelector('button');
    logOut.addEventListener('click', handleLogout);
  }

  /**
   * This function handles login and moves user to the next page if they successfuly log in
   * @param {Event} event - This is the event triggered by the login submission
   */
  function handleLogin(event) {
    event.preventDefault();
    let input = this.parentNode.querySelectorAll('input');
    let username = input[0].value;
    let password = input[1].value;

    fetch('login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "username": username,
        "password": password
      })
    })
      .then(statusCheck)
      .then(data => data.text())
      .then(() => {
        localStorage.setItem('username', username);
        window.location.href = '/main-view.html';
      })
      .catch(handleLoginError);
  }

  /**
   * This function handles errors when the wrong password is entered
   */
  function handleLoginError() {
    let articleError = document.querySelector('article');
    articleError.classList.remove('hidden');
    const seconds = 2000;

    setTimeout(() => {
      articleError.classList.add('hidden');
    }, seconds);
  }

  /**
   * This is an async function that checks the status of a resolution to make sure
   * there are no errors, and throw an error if there is one.
   * @param {resolution} res - The resolution of a promise.
   * @throws {error} - it shows what error it ran into
   * @returns {resolution} - The resolution if there's no error
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * This logs the user out
   */
  function handleLogout() {
    localStorage.removeItem('username');
    handleNotLoggedIn();
  }

  /**
   * This shows the correct screen depending on the login state of the user.
   */
  function handleNotLoggedIn() {
    let pageBackground = document.getElementById('page-background');
    pageBackground.classList.add('login-background');
    let loginScreen = document.getElementById('login');
    loginScreen.classList.remove('hidden');
    let loginButton = document.getElementById('login-button');
    let previousTransactions = document.getElementById('purchases-background');
    previousTransactions.classList.add('hidden');
    let navBar = document.querySelector('nav');
    navBar.classList.add('hidden');

    loginButton.addEventListener('click', handleLogin);
  }

  /**
   * This gets all previous purchases of a user if they are logged in
   */
  function getPurchases() {
    let username = localStorage.getItem('username');
    fetch('/purchases/history/' + username)
      .then(statusCheck)
      .then(data => data.json())
      .then(async data => {
        let itemList = document.getElementById('all-purchases');
        for (let i = 0; i < data.length; i++) {
          await fetch('/purchases/history/' + username + "?uid=" + data[i].uid)
            .then(statusCheck)
            .then(singleDate => singleDate.json())
            .then(allItems => {
              itemList.append(createPurchaseCard(data[i].uid, allItems));
            })
            .catch(handleError);
        }
      })
      .catch(handleError);
  }

  /**
   * This creates the purchase card for all previous purchases
   * @param {string} orderNumber - ordersds
   * @param {*} allItems - All Items for a single purchase
   * @returns {HTMLElement} - The entire HTML element for a single purchase
   */
  function createPurchaseCard(orderNumber, allItems) {
    let entirePurchase = document.createElement('article');

    let order = document.createElement('div');
    order.classList.add('order-number');

    let orderHeader = document.createElement('h2');
    orderHeader.textContent = "ORDER NUMBER: #" + orderNumber;
    order.appendChild(orderHeader);

    let repurchaseButton = document.createElement('button')
    repurchaseButton.textContent = "Repurchase";
    repurchaseButton.addEventListener('click', repurchase);
    order.appendChild(repurchaseButton);

    entirePurchase.appendChild(order);

    let itemContainer = document.createElement('div');
    itemContainer.classList.add('single-transaction');
    entirePurchase.appendChild(itemContainer);

    createItems(allItems, itemContainer);

    let dateHeader = document.createElement('h2');
    dateHeader.textContent = "Made on " + allItems[0].date;
    dateHeader.classList.add('end');
    entirePurchase.appendChild(dateHeader);

    return entirePurchase;
  }

  /**
   * This creates all the individual item cards for each item
   * @param {HTMLElement} allItems - All Items for a single purchase
   * @param {HTMLElement} itemContainer - Where the items are stored
   */
  function createItems(allItems, itemContainer) {
    for (let i = 0; i < allItems.length; i++) {
      let itemSection = document.createElement('section');
      itemSection.classList.add('item-info');

      let nameHeader = document.createElement('h3');
      nameHeader.textContent = allItems[i].itemName;
      itemSection.appendChild(nameHeader);

      let itemImage = document.createElement('img');
      itemImage.src = allItems[i].src;
      itemImage.alt = "Picture for " + allItems[i].itemName;
      itemSection.append(itemImage);

      let quantity = document.createElement('p');
      quantity.textContent = "Quantity: " + allItems[i].quantity;
      itemSection.append(quantity);

      let price = document.createElement('p');
      price.textContent = "Price: $" + allItems[i].price;
      itemSection.append(price);

      itemContainer.append(itemSection);
    }
  }

  /**
   * This function generates a unique ID consisting of 6 random numbers.
   * @returns {String} - The generated UID
   */
  async function generateUID() {
    let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let UID = "";
    const codeLength = 6;

    let isUnique = false;
    for (let i = 0; i < codeLength; i++) {
      UID += numbers[Math.floor(Math.random() * numbers.length)];
    }

    await fetch('checkout/uid?uid=' + UID)
      .then(statusCheck)
      .then(data => data.text())
      .then(data => {
        isUnique = data === '0';
      })
      .catch(handleError);

    while (!isUnique) {
      UID = "";
      for (let i = 0; i < codeLength; i++) {
        UID += numbers[Math.floor(Math.random() * numbers.length)];
      }
      await fetch('checkout/uid?uid=' + UID)
        .then(statusCheck)
        .then(data => data.text())
        .then(data => {
          isUnique = data === '0';
        })
        .catch(handleError);
    }
    return UID;
  }

  /**
   * This function checks the stock availability of all items
   * for the user and gives an error if any items in the cart don't have enough stock
   * @param {String} orderNumber - orderNumber for the purchase we are checking
   * @returns {boolean} - Whether or not stock is available
   */
  async function checkStock(orderNumber) {
    let username = localStorage.getItem('username');
    let results = await fetch('purchases/stock/' + username + "/" + orderNumber)
      .then(statusCheck)
      .then(data => data.text())
      .then(data => {
        if (data === "Sufficient Stock") {
          return true;
        }
        return false;
      })
      .catch(handleOutOfStock);
    return results;
  }

  /**
   * This purchases and puts the purchased items into the database
   * @param {HTMLElement} allItems - HTML Element of each item
   * @param {String} username - username string
   * @param {String} formattedDate - Current date formatted correctly
   * @param {String} uid - New unique id for the purchase
   */
  async function checkout(allItems, username, formattedDate, uid) {
    for (let i = 0; i < allItems.length; i++) {
      let itemName = allItems[i].querySelector('h3').textContent;
      let quantity = allItems[i].querySelector('p').textContent.split(':')[1];
      await fetch('/checkout/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "username": username,
          "quantity": quantity,
          "itemName": itemName,
          "date": formattedDate,
          "uid": uid
        })
      })
        .then(statusCheck)
        .catch(handleError);
    }
  }

  /**
   * This function displays an error message if an item is out of stock
   */
  function handleOutOfStock() {
    let errorMessage = document.createElement('p');
    errorMessage.textContent = "Error: Some Item has insufficient stock";
    errorMessage.classList.add('error');
    let body = document.getElementById('purchases-background');
    body.prepend(errorMessage);

    const seconds = 2000;

    setTimeout(() => {
      errorMessage.classList.add('hidden');
    }, seconds);
  }

  /**
   * This function displays an error message whenever an unknown error occurs
   */
  function handleError() {
    let error = document.createElement('p');
    error.textContent = "Error Occured";
    error.classList.add('error');

    document.body.prepend(error);

    const seconds = 2000;

    setTimeout(() => {
      error.classList.add('hidden');
    }, seconds);
  }

  /**
   * This allows a user to completely repurchase a previous transaction they had already
   * made before and displays an error if there is not enough stock.
   */
  async function repurchase() {
    let orderNumber =
      this.parentNode.parentNode.querySelector('.order-number')
        .querySelector('h2').textContent.split('#')[1];
    let bool = await checkStock(orderNumber);
    if (bool) {
      const currentDate = new Date();
      const isoString = currentDate.toISOString();
      const format = isoString.replace('T', ' ');
      const END = 19;
      const formattedDate = format.slice(0, END);

      let username = localStorage.getItem('username');
      let allItems = this.parentNode.parentNode.querySelector('.single-transaction')
        .querySelectorAll('.item-info');
      let uid = await generateUID();
      checkout(allItems, username, formattedDate, uid);

      let itemList = document.getElementById('all-purchases');
      await fetch('/purchases/history/' + username + "?uid=" + orderNumber)
        .then(statusCheck)
        .then(singleDate => singleDate.json())
        .then(purchase => {
          itemList.prepend(createPurchaseCard(uid, purchase));
        })
        .catch(handleError);
    }
  }
})();