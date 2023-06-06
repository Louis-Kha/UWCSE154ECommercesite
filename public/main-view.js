"use strict";

/*
 * Name: Louis Kha
 * Date: 5/7/2023
 * Section: CSE 154 AA
 * TA: Elias Martin
 * The javascript index file used to add functionality to main-view.html
 */

(function() {

  window.addEventListener("load", init);

  let storeItems;
  let page = 0;

  /**
   * adds eventlistener when webpage is loaded in.
   */
  function init() {
    requestItems();
    id("search-button").addEventListener("click", requestSearch);
    id("search-button").addEventListener("click", pageToZero);
    id("view-button").addEventListener("click", toggleView);
    id('previous-btn').addEventListener('click', togglePage);
    id('next-btn').addEventListener('click', togglePage);
  }

  /**
   * Sets global variable page to zero.
   */
  function pageToZero() {
    page = 0;
    id('next-btn').disabled = false;
  }

  /**
   * Toggles page to show more items.
   */
  function togglePage() {
    const count = 4;
    if (this.textContent === "Previous Page") {
      if (page > 0) {
        page = page - 1;
        requestSearch();
        if (id('item-display').childElementCount >= 1) {
          id('next-btn').disabled = false;
        }
      }
    } else if (this.textContent === "Next Page") {
      page = page + 1;
      requestSearch();
      if (id('item-display').childElementCount <= count) {
        id('next-btn').disabled = true;
      }
    }
  }

  /**
   * Toggles page view type between grid and list.
   */
  function toggleView() {
    if (id('item-display').classList.contains("hidden")) {
      id('item-display').classList.remove("hidden");
      id('list-display').classList.add("hidden");
      id('next-btn').classList.remove("hidden");
      id('previous-btn').classList.remove("hidden");
    } else {
      id('item-display').classList.add("hidden");
      id('list-display').classList.remove("hidden");
      id('next-btn').classList.add("hidden");
      id('previous-btn').classList.add("hidden");
    }
  }

  /**
   * Sets specific item selected into local storage to be accessed in item-view.html.
   */
  function storeName() {
    localStorage.removeItem('item');

    for (let i = 0; i < storeItems['store'].length; i++) {
      if (storeItems['store'][i]['name'] === this.textContent) {
        localStorage.setItem('item', JSON.stringify(storeItems['store'][i]));
      }
    }
  }

  /**
   * Get requests a JSON list of searched items.
   */
  function requestSearch() {
    if (id('category-bar').value === "None") {
      fetch("http://localhost:8000/main-view/items?search=" + id('search-bar').value)
        .then(statusCheck)
        .then(res => res.text())
        .then(processAllItems)
        .catch(handleError);
    } else if (id('search-bar').value === '' && id('category-bar').value !== "None") {
      fetch("http://localhost:8000/main-view/items?category=" + id('category-bar').value)
        .then(statusCheck)
        .then(res => res.text())
        .then(processAllItems)
        .catch(handleError);
    } else if (id('search-bar').value !== '' && id('category-bar').value !== "None") {
      fetch("http://localhost:8000/main-view/items?category=" + id('category-bar').value + "&search=" + id('search-bar').value)
        .then(statusCheck)
        .then(res => res.text())
        .then(processAllItems)
        .catch(handleError);
    }
  }

  /**
   * Creates dom element and appends all item information to it and returns.
   * @param {JSON} data - Item data for one specific item.
   * @returns {DOM} - DOM element which contains all card information.
   */
  function createItemCard(data) {
    let itemCard = document.createElement('article');
    let itemImage = document.createElement('img');
    let itemName = document.createElement('a');
    let itemCatagory = document.createElement('p');
    let cartButton = document.createElement('button');

    if (data['src'] !== null) {
      itemImage.setAttribute('src', data['src']);
    }
    itemImage.setAttribute('alt', "Picture of " + data['name']);
    itemName.textContent = data['name'];
    itemCatagory.textContent = data['category'];
    cartButton.textContent = "Add to Cart";
    cartButton.addEventListener('click', addToCart);

    itemCard.appendChild(itemImage);
    itemCard.appendChild(itemName);
    itemCard.appendChild(itemCatagory);
    itemCard.appendChild(cartButton);

    itemCard.classList.add('item');
    cartButton.classList.add('cart-btn');
    itemImage.classList.add('item-image');
    itemName.href = 'http://localhost:8000/item-view.html';
    itemName.addEventListener('click', storeName);
    return itemCard;
  }

  /**
   * Post request to allow user to add item to cart.
   */
  function addToCart() {
    let itemName = this.parentNode.querySelector('a').textContent;
    let username = localStorage.getItem('username');
    fetch('/itemview/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "username": username,
        "itemName": itemName
      })
    });
  }

  /**
   * Processes the store item data to be uploaded to the main-view.
   * @param {JSON} data - JSON of entire store items.
   */
  function processAllItems(data) {
    storeItems = JSON.parse(data);
    const count = 5;
    id('item-display').innerHTML = '';
    id('list-display').innerHTML = '';
    for (let i = 0; i < storeItems['store'].length; i++) {
      if (id('item-display').childElementCount < count) {
        let itemCard = createItemCard(storeItems['store'][i + (page * count)]);
        id('item-display').appendChild(itemCard);
      }
    }

    for (let i = 0; i < storeItems['store'].length; i++) {
      let itemCard = createItemCard(storeItems['store'][i]);
      itemCard.classList.add('list');
      id('list-display').appendChild(itemCard);
    }
  }

  /**
   * Get requests a JSON list of all items.
   */
  function requestItems() {
    fetch("http://localhost:8000/main-view/items")
      .then(statusCheck)
      .then(res => res.text())
      .then(processAllItems)
      .catch(handleError);
  }

  /**
   * Processes error from failed function.
   * @param {String} err - Error message from failed function.
   * @returns {String} err - The error message from the failed function.
   */
  function handleError(err) {
    return err;
  }

  /**
   * This function checks the result of the promise (used from lecture)
   * @param {Promise} res - the promise status
   * @returns {string} - returns error message.
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }
})();