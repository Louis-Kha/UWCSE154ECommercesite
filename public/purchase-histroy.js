"use strict";
(function() {

  window.addEventListener("load", init);

  /**
   * adds eventlistener when webpage is loaded in.
   */
  function init() {
    getPurchases();
  }

  function getPurchases() {
    let username = localStorage.getItem('username');
    fetch('/purchases/history/' + username, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(data => data.json())
      .then(async data => {
        let itemList = id('item-list');
        for (let i = 0; i < data.length; i++) {
          let p1 = document.createElement('p');
          p1.textContent = data[i].date;
          itemList.appendChild(p1);
          await fetch('/purchases/history/' + username, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "date": data[i].date
            })
          })
            .then(singleDate => singleDate.json())
            .then(allItems => {
              for (let i = 0; i < allItems.length; i++) {
                let p = document.createElement('p');
                p.textContent = allItems[i].itemName + " " + allItems[1].quantity;
                itemList.appendChild(p);
              }
            })

        }
        console.log(data);
      });
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