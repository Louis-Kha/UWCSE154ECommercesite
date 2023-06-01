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

      let previousTransaction = document.getElementById('purchases');
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
        window.location.href = '/checkout-page.html';
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
    let previousTransactions = document.getElementById('purchases');
    previousTransactions.classList.add('hidden');
    let navBar = document.querySelector('nav');
    navBar.classList.add('hidden');

    loginButton.addEventListener('click', handleLogin)
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
                p.textContent = allItems[i].itemName + " " + allItems[i].quantity;
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