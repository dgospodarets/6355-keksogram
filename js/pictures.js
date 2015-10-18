/**
 * self-invokes function
 * to prevent global vars
 */
(function () {
  /**
   * global vars for this file
   */
  var picturesData = [];

  /**
   * Insert image
   * @param template {{DomeNode}}
   * @param pictureUrl {{String}}
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
   *
   * @param pictures {{Array}}
   */
  function onAjaxSuccess(pictures) {
    fillImages(pictures);

    document.querySelector('.filters').classList.remove('hidden');//show filters block

    // listen filters clicks
    var form = document.querySelector('.filters');
    form.addEventListener("click", onFiltersClick);
  }

  /**
   * Removes pictures and fills by new ones
   *
   * @param pictures {{Array}}
   */
  function fillImages(pictures) {
    // VARS
    var fragment = document.createDocumentFragment();
    var picturesEl = document.querySelector('.pictures');

    //PROCESS EACH PICTURE
    pictures.forEach(function (picture) {
      var template = document.querySelector('.picture-template').cloneNode(true);

      insertImage(template, picture.url);

      template.content.querySelector('.picture-comments').innerHTML = picture.comments;
      template.content.querySelector('.picture-likes').innerHTML = picture.likes;
      fragment.appendChild(template.content);
    });

    // REMOVE AND FILL
    picturesEl.innerHTML = '';
    picturesEl.appendChild(fragment);
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
    var picturesDataCopy = picturesData.slice();

    // check which filter was clicked
    switch (target.getAttribute('value')) {
    /**
     * POPULAR
     */
      case 'popular':
        break;

    /**
     * NEW
     */
      case 'new':
        // filter
        picturesDataCopy = picturesDataCopy.filter(function (pictureData) {
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
        picturesDataCopy.sort(function (a, b) {
          return a.date > b.date;// ToDo doesn't work as expected
        });

        break;

    /**
     * DISCUSSED
     */
      case 'discussed':
        // sort
        picturesDataCopy.sort(function (a, b) {
          return a.comments < b.comments;// ToDo doesn't work as expected
        });
    }

    /**
     * Run a refill of pictures block
     */
    fillImages(picturesDataCopy);
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
