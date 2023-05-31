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

  /**
   * adds eventlistener when webpage is loaded in.
   */
  function init() {
    requestItems();
    id("search-button").addEventListener("click", requestSearch);
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
    fetch("http://localhost:8000/main-view/items?search=" + id('search-bar').value)
      .then(statusCheck)
      .then(res => res.text())
      .then(processAllItems)
      .catch(handleError);
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

    //itemImage.setAttribute('src', data['src']);
    itemImage.setAttribute('alt', "Store Item Picture");
    itemName.textContent = data['name'];
    itemCatagory.textContent = data['category'];

    itemCard.appendChild(itemImage);
    itemCard.appendChild(itemName);
    itemCard.appendChild(itemCatagory);

    itemCard.classList.add('item');
    itemName.href = 'http://localhost:8000/item-view.html';
    itemName.addEventListener('click', storeName);
    return itemCard;
  }

  /**
   * Processes the store item data to be uploaded to the main-view.
   * @param {JSON} data - JSON of entire store items.
   */
  function processAllItems(data) {
    storeItems = JSON.parse(data);

    id('item-display').innerHTML = '';
    for (let i = 0; i < storeItems['store'].length; i++) {
      if (id('item-display').childElementCount < 8) {
        let itemCard = createItemCard(storeItems['store'][i]);
        id('item-display').appendChild(itemCard);
      }
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
   * Handles error.
   */
  function handleError() {
    console.log("error");
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