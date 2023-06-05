"use strict";
(function() {

  window.addEventListener("load", init);

  /**
   * adds eventlistener when webpage is loaded in.
   */
  function init() {
    if (localStorage.getItem('username') != null) {
      let loginScreen = document.getElementById('login');
      loginScreen.classList.add('hidden');

      let previousTransaction = document.getElementById('purchases-background');
      previousTransaction.classList.remove('hidden');
      getPurchases();
    } else {
      handleNotLoggedIn();
    }
    // getPurchases();
    let logOut = document.querySelector('button');
    logOut.addEventListener('click', handleLogout)
  }

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
      .then(data => {
        console.log("hi")
        localStorage.setItem('username', username);
        window.location.href = '/main-view.html';
      })
      .catch(handleError)
  }

  function handleError(error) {
    let articleError = document.querySelector('article');
    articleError.classList.remove('hidden');

    setTimeout(() => {
      articleError.classList.add('hidden');
    }, 2000);
  }

  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  function handleLogout() {
    localStorage.removeItem('username');
    handleNotLoggedIn();
  }

  function handleNotLoggedIn() {
    let pageBackground = document.getElementById('page-background');
    pageBackground.classList.add('login-background')
    let loginScreen = document.getElementById('login');
    loginScreen.classList.remove('hidden');
    let loginButton = document.getElementById('login-button');
    let previousTransactions = document.getElementById('purchases-background');
    previousTransactions.classList.add('hidden');
    let navBar = document.querySelector('nav');
    navBar.classList.add('hidden');

    loginButton.addEventListener('click', handleLogin)
  }

  function getPurchases() {
    let username = localStorage.getItem('username');
    fetch('/purchases/history/' + username)
      .then(data => data.json())
      .then(async data => {
        let itemList = id('all-purchases');
        for (let i = 0; i < data.length; i++) {
          await fetch('/purchases/history/' + username + "?uid=" + data[i].uid)
            .then(singleDate => singleDate.json())
            .then(allItems => {
              itemList.append(createPurchaseCard(data[i].uid, allItems));
            })
        }
      });
  }

  function createPurchaseCard(orderNumber, allItems) {
    let entirePurchase = document.createElement('article');
    // entirePurchase.id = "all-purchases";

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

    for (let i = 0; i < allItems.length; i++) {
      let itemSection = document.createElement('section');
      itemSection.classList.add('item-info');

      let nameHeader = document.createElement('h3');
      nameHeader.textContent = allItems[i].itemName;
      itemSection.appendChild(nameHeader);

      let itemImage = document.createElement('img')
      itemImage.src = allItems[i].src;
      itemImage.alt = "Picture for " + allItems[i].itemName
      itemSection.append(itemImage);

      let quantity = document.createElement('p');
      quantity.textContent = "Quantity: " + allItems[i].quantity;
      itemSection.append(quantity);

      let price = document.createElement('p');
      price.textContent = "Price: $" + allItems[i].price;
      itemSection.append(price);

      itemContainer.append(itemSection);
    }

    let dateHeader = document.createElement('h2');
    dateHeader.textContent = "Made on " + allItems[0].date;
    dateHeader.classList.add('end');
    entirePurchase.appendChild(dateHeader);

    return entirePurchase;
  }

  function generateUID() {
    let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let UID = "";

    for (let i = 0; i < 6; i++) {
      UID += numbers[Math.floor(Math.random() * 10)];
    }
    return UID;
  }

  async function repurchase() {
    const currentDate = new Date();
    const isoString = currentDate.toISOString();
    const format = isoString.replace('T', ' ');
    const END = 19;
    const formattedDate = format.slice(0, END);

    let username = localStorage.getItem('username');
    let allItems = this.parentNode.parentNode.querySelector('.single-transaction').querySelectorAll('.item-info');
    let uid = generateUID();
    let isUnique = false;
    await fetch('checkout/uid?uid=' + uid)
      .then(data => data.text())
      .then(data => {
        if (data === '0') {
          isUnique =  true;
        }
      })
    while (!isUnique) {
      uid = generateUID();
      await fetch('checkout/uid?uid=' + uid)
      .then(data => data.text())
      .then(data => {
        if (data === '0') {
          isUnique =  true;
        }
      })
    }
    for (let i = 0; i< allItems.length; i++) {
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
      .then(data => data.text())
      .then(data => {
      });
    }
    let itemList = id('all-purchases');
    await fetch('/purchases/history/' + username + "?uid=" + uid)
      .then(singleDate => singleDate.json())
      .then(purchase => {
        itemList.prepend(createPurchaseCard(uid, purchase));
      })
  }

  /**
 * Returns the element that has the ID attribute with the specified value.
 * @param {string} id - element ID.
 * @returns {object} - DOM object associated with id.
 */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Returns first element matching selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} - DOM object associated selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} query - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }

})();