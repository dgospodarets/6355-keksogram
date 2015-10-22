'use strict';
(function() {
  var Key = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };
  var pictures = document.querySelector('.pictures');
  var closeButton = document.querySelector('.gallery-overlay-close');
  var galleryOverlay = document.querySelector('.gallery-overlay');


  /**
   * METHODS
   */

  function showGalary() {
    galleryOverlay.classList.remove('invisible');
    document.body.addEventListener('keydown', keyHandler);
    closeButton.addEventListener('click', closeHandler);
  }

  function hideGallery() {
    galleryOverlay.classList.add('invisible');
    document.body.removeEventListener('keydown', keyHandler);
    closeButton.removeEventListener('click', closeHandler);
  }


  /**
   * EVENTS
   */

  function closeHandler(event) {
    event.preventDefault();
    hideGallery();
  }

  function openHandler(event) {
    event.preventDefault();
    showGalary();
  }

  function keyHandler(event) {
    switch (event.keyCode) {
      case Key.LEFT:
        console.log('show previos photo');
        break;
      case Key.RIGHT:
        console.log('show next photo');
        break;
      case Key.ESC:
        hideGallery();
        break;
    }
  }

  /**
   * INIT
   */
  pictures.addEventListener('click', openHandler);
}());
