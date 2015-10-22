'use strict';
/**
 * self-invokes function
 * to prevent global vars
 */
(function() {
  /**
   * -------------
   * GLOBAL VARS FOR THIS FILE
   * -------------
   */
  var picturesData = [];
  var picturesDataFiltered = [];
  var PICTURES_ON_PAGE = 12;
  var currentPage = 0;
  var picturesEl = document.querySelector('.pictures');

  /**
   * -------------
   * METHODS
   * -------------
   */

  /**
   * Fills next page by images
   * and tracks current page index
   *
   * @returns {undefined}
   */
  function fillNextPage() {
    var picturesFrom = currentPage * PICTURES_ON_PAGE;
    var picturesTo = picturesFrom + PICTURES_ON_PAGE;

    // check the last page
    if (picturesFrom > picturesData.length) {
      return;
    }

    fillImages(picturesDataFiltered, picturesFrom, picturesTo);

    currentPage = currentPage + 1;
  }

  /**
   * Inserts image
   * @param {HTMLElement} template -
   * @param {Object} picture -
   *
   * @returns {undefined}
   */
  function insertImage(template, picture) {
    var image = new Image(182, 182);
    var imgToReplace = template.content.querySelector('img');
    var link = template.content.querySelector('a');

    image.onload = function() {
      imgToReplace.parentNode.replaceChild(image, imgToReplace);
    };
    image.onerror = function() {
      link.classList.add('picture-load-failure');
    };
    image.src = picture.url;
  }

  /**
   * Function to be colled
   * when pictures data is loaded
   *
   * @param {String} responseText -
   *
   * @returns {undefined}
   */
  function onAjaxSuccess(responseText) {
    // store original pictures data
    picturesData = JSON.parse(responseText);
    picturesDataFiltered = picturesData.slice();// clone the original

    // apply filter on init
    var filter = localStorage.getItem('filter') || 'popular';
    document.querySelector('.filters').classList.remove('hidden');// show filters block
    document.querySelector('#filter-' + filter).checked = true;
    applyFilter(filter);


    fillNextPage();

    initEvents();
  }

  /**
   * Adds pictures
   *
   * @param {Array} pictures -
   * @param {Number} startIndex -
   * @param {Number} [endIndex] -
   *
   * @returns {undefined}
   */
  function fillImages(pictures, startIndex, endIndex) {
    // VARS
    var fragment = document.createDocumentFragment();

    // PROCESS PAGE PICTURES
    endIndex = endIndex || startIndex + PICTURES_ON_PAGE;
    pictures = pictures.slice(startIndex, endIndex);
    pictures.forEach(function(picture) {
      var template = document.querySelector('.picture-template').cloneNode(true);

      insertImage(template, picture);

      template.content.querySelector('.picture-comments').innerHTML = picture.comments;
      template.content.querySelector('.picture-likes').innerHTML = picture.likes;
      fragment.appendChild(template.content);
    });

    // FILL
    picturesEl.appendChild(fragment);

  }

  /**
   * Removes pictures and fills by new ones
   *
   * @returns {undefined}
   */
  function removeAndFillImages() {
    // REMOVE
    currentPage = 0;
    picturesEl.innerHTML = '';

    fillNextPage();
  }

  /**
   * Function is called on filters click
   * 1) it checks which filter was clicked
   * 2) applies an appropriate filter for pictures data
   * 3) runs a refill of pictures block
   *
   * @param {Event} event -
   * @returns {undefined}
   */
  function onFiltersClick(event) {
    // VARS
    var target = event.target;
    var filter = target.getAttribute('value');

    applyFilter(filter);
    localStorage.setItem('filter', filter);

  }

  /**
   * Applies filter by value
   *
   * @param {String} filter -
   * @returns {undefined}
   */
  function applyFilter(filter) {
    picturesDataFiltered = picturesData.slice();

    switch (filter) {
      default:
        break;

    /**
     * POPULAR
     */
      case 'popular':
        picturesDataFiltered = picturesData;
        break;

    /**
     * NEW
     */
      case 'new':
        // filter
        picturesDataFiltered = picturesDataFiltered.filter(function(pictureData) {
          var today = new Date();
          var oneMonthAgo = +new Date(today.getUTCFullYear(), today.getMonth() - 1, today.getDate());

          var date = +new Date(pictureData.date);

          return date > oneMonthAgo;
        });

        // sort
        picturesDataFiltered.sort(function(a, b) {
          return +new Date(b.date) - +new Date(a.date);
        });

        break;

    /**
     * DISCUSSED
     */
      case 'discussed':
        // sort
        picturesDataFiltered.sort(function(a, b) {
          return b.comments - a.comments;
        });
    }

    /**
     * Run a refill of pictures block
     */
    removeAndFillImages(picturesDataFiltered);
  }

  /**
   * -------------
   * SCRIPT INIT
   * -------------
   */
  document.querySelector('.filters').classList.add('hidden');// hide filters block


  /**
   * XHR INIT
   */
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'data/pictures.json', true);

  /**
   * XHR EVENTS LISTENERS
   */

    // SHOW/HIDE LOADER
  xhr.onloadstart = function() {
    picturesEl.classList.add('pictures-loading');
  };

  xhr.onload = function() {
    picturesEl.classList.remove('pictures-loading');
  };

  // SUCCESS CHECK
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        // XHR SUCCESS


        onAjaxSuccess(xhr.responseText);
      }
    }
  };

  // ERROR CHECK
  function errorTimeout() {
    picturesEl.classList.add('pictures-failure');
  }

  xhr.onerror = errorTimeout;
  xhr.ontimeout = errorTimeout;

  /**
   * XHR SEND
   */
  xhr.send();

  /**
   * -------------
   * EVENTS
   * -------------
   */

  function initEvents() {
    // listen filters clicks
    var form = document.querySelector('.filters');
    form.addEventListener('click', onFiltersClick);

    // listen custom event
    window.addEventListener('fill-next-page', fillNextPage);

    // listen window scroll
    var someTimeout;
    window.addEventListener('scroll', function() {
      if (picturesEl.getBoundingClientRect().bottom - 50 < window.innerHeight) {
        clearTimeout(someTimeout);
        someTimeout = setTimeout(function() {
          window.dispatchEvent(
            new CustomEvent('fill-next-page')
          );
        }, 100);
      }
    });
  }
}());
