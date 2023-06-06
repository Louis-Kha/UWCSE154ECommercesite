"use strict";
(function() {

  window.addEventListener("load", init);

  /**
   * adds eventlistener when webpage is loaded in.
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
   * a
   */
  function handleNotLoggedIn() {
    let error = document.getElementById('error');
    error.classList.remove('hidden');
  }

  /**
   * a
   * @returns {String} - a
   */
  function generateUID() {
    let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let UID = "";

    for (let i = 0; i < 6; i++) {
      UID += numbers[Math.floor(Math.random() * 10)];
    }
    return UID;
  }

  /**
   * a
   * @returns {boolean} - as
   */
  async function checkStock() {
    let username = localStorage.getItem('username');
    let results = await fetch('checkout/stock/' + username)
      .then(data => data.text())
      .then(data => {
        if (data === "Sufficient Stock") {
          return true;
        }
        return false;
      });
    return results;
  }

  /**
   * f
   */
  async function checkout() {
    const currentDate = new Date();
    const isoString = currentDate.toISOString();
    const format = isoString.replace('T', ' ');
    const END = 19;
    const formattedDate = format.slice(0, END);

    let bool = await checkStock();
    console.log(bool + "bool");
    if (bool) {
      let username = localStorage.getItem('username');
      let allItems = document.querySelectorAll('.item');
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
        let itemName = allItems[i].querySelector('h2').textContent;
        let quantity = allItems[i].querySelector('.quantity-menu').querySelector('h3').textContent.split(':')[1];
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
        .then(data => data.text())

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
        });
      }
      clearCart();
    } else {

    }
  }

  /**
   * f
   */
  function getCart() {
    let username = localStorage.getItem('username');
    fetch('/checkout/cart/' + username)
      .then(data => data.json())
      .then(data => {
        let itemList = document.getElementById('item-list');
        for (let i = 0; i < data.length; i++) {
          itemList.appendChild(
            createItem(data[i].name, data[i].src, data[i].quantity, data[i].price)
          );
        }
      });
  }

  /**
   * s
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
      .then(() => {
        let itemList = document.getElementById('item-list');
        itemList.innerHTML = "";
      });
  }

  /**
   * a
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
      .then(data => data.text())
      .then(data => {
        this.parentNode.querySelector('h3').textContent = "Quantity: " + data;
        if (data === "0") {
          this.parentNode.parentNode.remove();
        }
      });
  }

  /**
   * a
   * @param {String} itemName - a
   * @param {String} itemsrc - a
   * @param {String} itemQuantity - a
   * @param {String} itemPrice - a
   * @returns {HTMLElement} - a
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