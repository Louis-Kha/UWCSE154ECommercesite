"use strict";

/*
 * Name: Louis Kha
 * Date: 5/7/2023
 * Section: CSE 154 AA
 * TA: Elias Martin
 * The javascript index file used to add functionality to item-view.html
 */

(function() {

  window.addEventListener("load", init);

  /**
   * adds eventlistener when webpage is loaded in.
   */
  function init() {
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