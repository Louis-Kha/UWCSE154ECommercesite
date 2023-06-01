"use strict";
(function() {

  window.addEventListener("load", init);

  /**
   * adds eventlistener when webpage is loaded in.
   */
  function init() {
    if (localStorage.getItem('username') != null) {
      let button = document.createElement('button');
      button.addEventListener
      document.body.appendChild(button);
      button.addEventListener('click', testButton);

      let cartButtons = document.getElementById('cart-buttons').querySelectorAll('button');
      let clearButton = cartButtons[0];
      let checkoutButton = cartButtons[1];

      clearButton.addEventListener('click', clearCart);
      checkoutButton.addEventListener('click', checkout);

      getCart();
    } else {
      handleNotLoggedIn();
    }
  }

  function testButton() {
    let username = localStorage.getItem('username');
    let itemName = "test1";
    fetch('/itemview/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "username": username,
        "itemName": itemName
      })
    })
      .then(() => {
        let itemList = id('item-list');
        itemList.appendChild(createItem(itemName, "https://www.shutterstock.com/image-vector/common-supermarket-grocery-products-flat-260nw-1589944774.jpg", "1"));
      })
  }

  function handleNotLoggedIn() {
    let error = document.getElementById('error');
    error.classList.remove('hidden');
  }

  function checkout() {
    const currentDate = new Date();
    const isoString = currentDate.toISOString();
    const format = isoString.replace('T', ' ');
    const END = 19;
    const formattedDate = format.slice(0, END);

    let username = localStorage.getItem('username');

    console.log('huih');
    let allItems = document.querySelectorAll('.item');
    for (let i = 0; i< allItems.length; i++) {
      let itemName = allItems[i].querySelector('h2').textContent;
      let quantity = allItems[i].querySelector('.quantity-menu').querySelector('h3').textContent;
      fetch('/checkout/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "username": username,
          "quantity": quantity,
          "itemName": itemName,
          "date": formattedDate
        })
      })
      .then(data => data.text())
      .then(clearCart);
    }
  }

  function getCart() {
    let username = localStorage.getItem('username');
    fetch('/checkout/cart/' + username)
      .then(data => data.json())
      .then(data => {
        let itemList = id('item-list');
        for (let i = 0; i < data.length; i++) {
          // fetch('/item/' + data[i].name)
          //   .then()
          itemList.appendChild(createItem(data[i].itemName, "https://www.shutterstock.com/image-vector/common-supermarket-grocery-products-flat-260nw-1589944774.jpg", data[i].quantity));
          console.log(data[i]);
        }
      });
  }

  function clearCart() {
    let username = localStorage.getItem('username');
    fetch('/checkout/clear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "username": username,
      })
    })
      .then(() => {
        let itemList = id('item-list');
        itemList.innerHTML = "";
      })
  }

  function changeQuantity() {
    let itemName = this.parentNode.parentNode.querySelector('h2').textContent;
    let username = localStorage.getItem('username');
    let flag = this.textContent;

    fetch('/checkout/quantity', {
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
      .then(data => data.text())
      .then(data => {
        this.parentNode.querySelector('h3').textContent = "Quantity: " + data;
        if (data === "0") {
          this.parentNode.parentNode.remove();
        }
      })

    // this.parentNode.remove();
  }

  function createItem(itemName, itemsrc, itemQuantity) {
    let article = document.createElement('article');
    article.classList.add('item');

    let nameHeader = document.createElement('h2');
    nameHeader.textContent = itemName;
    article.appendChild(nameHeader);

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