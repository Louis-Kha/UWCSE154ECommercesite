"use strict";
(function() {

  window.addEventListener("load", init);

  /**
   * adds eventlistener when webpage is loaded in.
   */
  function init() {
    let button = document.querySelector('button');
    button.addEventListener('click', handleLogin);
  }

  function handleLogin(event) {
    event.preventDefault();
    let input = this.parentNode.querySelectorAll('input');
    let username = input[0].value;
    let password = input[1].value;

    console.log(username + " " + password)
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
      .then(data => data.text())
      .then(data => {
        if (data === "true") {
          console.log('hi')
          localStorage.setItem('username', username);
          window.location.href = '/checkout-page.html';
        } else {
          console.log('bye')
        }
      })

    let p = document.createElement('p');
    p.textContent = "Hfksdjfls";
    document.body.appendChild(p);
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