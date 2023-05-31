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

  let item = JSON.parse(localStorage.getItem('item'));

  /**
   * adds eventlistener when webpage is loaded in.
   */
  function init() {
    requestReviews(item['name'])
    setPage();
  }

  /**
   * Returns review score based on review from user.
   * @param {Integer} score - an int between 1-5 to select image src.
   * @returns {String} - img src corresponding to review score.
   */
  function selectReviewScore(score) {
    switch(score) {
      case 1:
        return "/images/1-star.png";
      case 2:
        return "/images/2-star.png";
      case 3:
        return "/images/3-star.png";
      case 4:
        return "/images/4-star.png";
      case 5:
        return "/images/5-star.png";
    }
  }

  /**
   * Helper function to create new DOM element for review section.
   * @param {JSON} data - Specific Item information.
   * @returns {DOM} - returns document element to be added to page.
   */
  function createReviewCard(data) {
    let reviewCard = document.createElement('article');
    let reviewScore = document.createElement('img');
    let review = document.createElement('p');
    let reviewUser = document.createElement('p');
    let reviewDate = document.createElement('p');

    reviewScore.setAttribute('src', selectReviewScore(data['score']));
    review.textContent = data['review'];
    reviewUser.textContent = data['username'];
    reviewDate.textContent = data['date'];

    reviewCard.appendChild(reviewUser);
    reviewCard.appendChild(review);
    reviewCard.appendChild(reviewScore);
    reviewCard.appendChild(reviewDate);

    reviewScore.classList.add('score');
    reviewDate.classList.add('date');
    reviewCard.classList.add('review');

    return reviewCard;

  }

  /**
   * Uses item details from parameter to append reviews to review section.
   * @param {JSON} data - JSON object of item details.
   */
  function processReviews(data) {
    let reviews = JSON.parse(data);
    id('reviews').innerHTML = '';

    for (let i = 0; i < reviews['reviews'].length; i++) {
      let reviewCard = createReviewCard(reviews['reviews'][i]);
      id('reviews').appendChild(reviewCard);
    }
  }

  /**
   * Get request with item query parameter to recieve JSON object of item.
   * @param {String} item - Name of the item being requested.
   */
  function requestReviews(item) {
    fetch("http://localhost:8000/item-view/reviews/" + item)
      .then(statusCheck)
      .then(res => res.text())
      .then(processReviews)
      .catch(handleError);
  }

  /**
   * Uses Global varible item to set the corresponding sections of the page.
   */
  function setPage() {
    id('item-name').textContent = "Item Name: " + item['name'];
    id('item-price').textContent = "Item Price: $" + item['price'];
    id('item-category').textContent = "Item Category: " + item['category'];
    id('detailed-description').textContent = "Description: " + item['description'];
    if (item['src'] !== null) {
      id('selected-item').setAttribute('src', item['src']);
    }
  }

  /**
   * Handles error.
   */
  function handleError(error) {
    console.log(error);
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