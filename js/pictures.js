/**
 * self-invokes function
 * to prevent global vars
 */
(function () {
  /**
   * global vars for this file
   */
  var picturesData = [];
  var picturesDataFiltered = [];
  var PICTURES_ON_PAGE = 12;
  var currentPage = 0;

  /**
   * Fills next page by images
   * and tracks current page index
   */
  function fillNextPage(){
    var picturesFrom = currentPage * PICTURES_ON_PAGE;
    var picturesTo = picturesFrom + PICTURES_ON_PAGE;

    // check the last page
    if (picturesFrom > picturesData.length) return;

    fillImages(picturesDataFiltered, picturesFrom, picturesTo);

    currentPage = currentPage + 1;
  }

  /**
   * Insert image
   * @param template {{DomeNode}}
   * @param pictureUrl {String}
   */
  function insertImage(template, pictureUrl) {
    var image = new Image(182, 182);
    var imgToReplace = template.content.querySelector('img');
    var link = template.content.querySelector('a');

    image.onload = function () {
      imgToReplace.parentNode.replaceChild(image, imgToReplace);
    };
    image.onerror = function () {
      link.classList.add('picture-load-failure');
    };
    image.src = pictureUrl;
  }

  /**
   * Function to be colled
   * when pictures data is loaded
   */
  function onAjaxSuccess() {
    fillNextPage();

    document.querySelector('.filters').classList.remove('hidden');//show filters block

    // listen filters clicks
    var form = document.querySelector('.filters');
    form.addEventListener("click", onFiltersClick);
  }

  /**
   * Adds pictures
   *
   * @param pictures {Array}
   * @param startIndex {Number}
   * @param [endIndex] {Number}
   */
  function fillImages(pictures, startIndex, endIndex) {
    // VARS
    var fragment = document.createDocumentFragment();
    var picturesEl = document.querySelector('.pictures');

    //PROCESS PAGE PICTURES
    endIndex = endIndex || startIndex + PICTURES_ON_PAGE;
    pictures = pictures.slice(startIndex, endIndex);
    pictures.forEach(function (picture) {
      var template = document.querySelector('.picture-template').cloneNode(true);

      insertImage(template, picture.url);

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
   * @param pictures {Array}
   * @param startIndex {Number}
   * @param [endIndex] {Number}
   */
  function removeAndFillImages(pictures, startIndex, endIndex) {
    // VARS
    var picturesEl = document.querySelector('.pictures');

    // REMOVE
    picturesEl.innerHTML = '';

    fillImages(pictures, startIndex, endIndex);
  }

  /**
   * Function is called on filters click
   * 1) it checks which filter was clicked
   * 2) applies an appropriate filter for pictures data
   * 3) runs a refill of pictures block
   *
   * @param event
   */
  function onFiltersClick(event) {
    // VARS
    var target = event.target;
    picturesDataFiltered = picturesData.slice();

    // check which filter was clicked
    switch (target.getAttribute('value')) {
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
        picturesDataFiltered = picturesDataFiltered.filter(function (pictureData) {
          var today = new Date;
          var oneMonthAgo = +new Date(today.getUTCFullYear(), today.getMonth() - 1, today.getDate());

          var date = +new Date(pictureData.date);

          //noinspection RedundantIfStatementJS
          if (date > oneMonthAgo) {
            return true;
          } else {
            return false;
          }
        });

        // sort
        picturesDataFiltered.sort(function (a, b) {
          return +new Date(b.date) - +new Date(a.date);
        });

        break;

    /**
     * DISCUSSED
     */
      case 'discussed':
        // sort
        picturesDataFiltered.sort(function (a, b) {
          return b.comments - a.comments;
        });
    }

    /**
     * Run a refill of pictures block
     */
    removeAndFillImages(picturesDataFiltered, 0);
  }

  /**
   *
   * SCRIPT INIT
   *
   */
  document.querySelector('.filters').classList.add('hidden');//hide filters block


  /**
   * XHR INIT
   */
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'data/pictures.json', true);

  /**
   * XHR EVENTS LISTENERS
   */

    // SHOW/HIDE LOADER
  xhr.onloadstart = function () {
    document.querySelector('.pictures').classList.add('pictures-loading');
  };

  xhr.onload = function () {
    document.querySelector('.pictures').classList.remove('pictures-loading');
  };

  // SUCCESS CHECK
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        // XHR SUCCESS
        picturesData = JSON.parse(xhr.responseText);
        picturesDataFiltered = picturesData;

        onAjaxSuccess(picturesData);
      }
    }
  };

  // ERROR CHECK
  var errorTimeout = function () {
    document.querySelector('.pictures').classList.add('pictures-failure');
  };

  xhr.onerror = errorTimeout;
  xhr.ontimeout = errorTimeout;

  /**
   * XHR SEND
   */
  xhr.send();
}());
