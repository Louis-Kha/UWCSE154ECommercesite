/*
 * Name: Mitchell Ly
 * Date: 5/7/2023
 * Section: CSE 154 AD
 * TA: Benjamin and Kasten
 * The javascript index file used to add functionality to main-view.html. This also
 * populates the page with all items in the cart and also displays error messages
 */

"use strict";
(function() {

  window.addEventListener("load", init);

  /**
   * Sets up the cart buttons if the user is logged in, or displays an error message
   * if the user is not loged in.
   */
  function init() {
    if (localStorage.getItem('username') !== null) {
      let cartButtons = document.getElementById('cart-buttons').querySelectorAll('button');
      let clearButton = cartButtons[0];
      let checkoutButton = cartButtons[1];

      let confirmButtonsDiv = document.getElementById('cart-buttons').querySelector('div');
      let confirmButton = confirmButtonsDiv.querySelectorAll('button')[0];
      confirmButton.addEventListener('click', () => {
        checkout();
        checkoutButton.classList.remove('hidden');
        confirmButtonsDiv.classList.add('hidden');
      });
      let cancelButton = confirmButtonsDiv.querySelectorAll('button')[1];
      cancelButton.addEventListener('click', () => {
        checkoutButton.classList.remove('hidden');
        confirmButtonsDiv.classList.add('hidden');
      });
      clearButton.addEventListener('click', clearCart);
      checkoutButton.addEventListener('click', () => {
        checkoutButton.classList.add('hidden');
        confirmButtonsDiv.classList.remove('hidden');
      });
      getCart();
    } else {
      handleNotLoggedIn();
    }
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
   * This shows an error message if the user is not logged in
   */
  function handleNotLoggedIn() {
    let error = document.querySelector('article');
    error.classList.remove('hidden');
  }

  /**
   * This function displays an error message if an item is out of stock
   */
  function handleOutOfStock() {
    let errorMessage = document.createElement('p');
    errorMessage.textContent = "Error: Some Item has insufficient stock";
    errorMessage.classList.add('error');
    let body = document.getElementById('cart-view');
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
      .then(data => {
        isUnique = data.text() === '0';
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
   * @returns {boolean} - Whether or not stock is available
   */
  async function checkStock() {
    let username = localStorage.getItem('username');
    let results = await fetch('checkout/stock/' + username)
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
   * This formats the current date
   * @returns {String} - String of the formatted date
   */
  function formatDate() {
    const currentDate = new Date();
    const isoString = currentDate.toISOString();
    const format = isoString.replace('T', ' ');
    const END = 19;
    const formattedDate = format.slice(0, END);
    return formattedDate;
  }

  /**
   * This handles changing the stock after a purchase in the database
   * @param {String} itemName - The item name for the item we are changing
   * @param {String} username - Username of the user
   * @param {String} quantity - Quantity of items that was bought
   */
  async function handleStock(itemName, username, quantity) {
    await fetch('/checkout/changeStock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "itemName": itemName,
        "username": username,
        "stock": quantity
      })
    })
      .then(statusCheck)
      .catch(handleError);
  }

  /**
   * This handles putting the purchase into the database
   * @param {String} quantity - the amount of items that was bought
   * @param {String} itemName  - The name of the item
   * @param {String} formattedDate  - The formatted date
   * @param {String} uid - The UID for this purchase
   */
  async function handleCheckout(quantity, itemName, formattedDate, uid) {
    let username = localStorage.getItem('username');
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
        'uid': uid
      })
    })
      .then(statusCheck)
      .catch(handleError);
  }

  /**
   * This handles checking out the cart and buying the items and then clearing the cart after
   */
  async function checkout() {
    let formattedDate = formatDate();
    let bool = await checkStock();
    if (bool) {
      let username = localStorage.getItem('username');
      let allItems = document.querySelectorAll('.item');
      let uid = await generateUID();
      for (let i = 0; i < allItems.length; i++) {
        let itemName = allItems[i].querySelector('h2').textContent;
        let quantity =
          allItems[i].querySelector('.quantity-menu').querySelector('h3').textContent.split(':')[1];
        handleCheckout(quantity, itemName, formattedDate, uid);

        await handleStock(itemName, username, quantity);
      }
      clearCart();
    }
  }

  /**
   * This gets all items currently in the cart for the user and populates the view with them
   */
  function getCart() {
    let username = localStorage.getItem('username');
    fetch('/checkout/cart/' + username)
      .then(statusCheck)
      .then(data => data.json())
      .then(data => {
        let itemList = document.getElementById('item-list');
        for (let i = 0; i < data.length; i++) {
          itemList.appendChild(
            createItem(data[i].name, data[i].src, data[i].quantity, data[i].price)
          );
        }
      })
      .catch(handleError);
  }

  /**
   * This clears the cart's HTML and in the database
   */
  function clearCart() {
    let username = localStorage.getItem('username');
    fetch('/checkout/clear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "username": username
      })
    })
      .then(statusCheck)
      .then(() => {
        let itemList = document.getElementById('item-list');
        itemList.innerHTML = "";
      })
      .catch(handleError);
  }

  /**
   * This changes the stock of an item by the quantity bought
   */
  async function changeQuantity() {
    let itemName = this.parentNode.parentNode.querySelector('h2').textContent;
    let username = localStorage.getItem('username');
    let flag = this.textContent;

    await fetch('/checkout/quantity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "itemName": itemName,
        "username": username,
        "flag": flag
      })
    })
      .then(statusCheck)
      .then(data => data.text())
      .then(data => {
        this.parentNode.querySelector('h3').textContent = "Quantity: " + data;
        if (data === "0") {
          this.parentNode.parentNode.remove();
        }
      })
      .catch(handleError);
  }

  /**
   * This creates an HTML Element of the item that shows all the item information
   * @param {String} itemName - The item name
   * @param {String} itemsrc - The picture src for the item
   * @param {String} itemQuantity - The current quantity of the item
   * @param {String} itemPrice - The price of the item
   * @returns {HTMLElement} - The HTML Element containing all the item details formatted
   */
  function createItem(itemName, itemsrc, itemQuantity, itemPrice) {
    let article = document.createElement('article');
    article.classList.add('item');

    let nameHeader = document.createElement('h2');
    nameHeader.textContent = itemName;
    article.appendChild(nameHeader);

    let priceHeader = document.createElement('h3');
    priceHeader.textContent = "Price: $" + itemPrice;
    article.appendChild(priceHeader);

    let itemImage = document.createElement('img');
    itemImage.src = itemsrc;
    article.appendChild(itemImage);

    let div = document.createElement('div');
    div.classList.add('quantity-menu');

    let quantityHeading = document.createElement('h3');
    quantityHeading.textContent = "Quantity: " + itemQuantity;
    div.appendChild(quantityHeading);

    let decreaseButton = document.createElement('button');
    decreaseButton.textContent = "-";
    decreaseButton.addEventListener('click', changeQuantity);
    let increaseButton = document.createElement('button');
    increaseButton.textContent = "+";
    increaseButton.addEventListener('click', changeQuantity);
    div.appendChild(decreaseButton);
    div.appendChild(increaseButton);

    article.appendChild(div);
    return article;
  }
})();