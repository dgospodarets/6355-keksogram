'use strict';


define([], function() {
  var Key = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };

  /**
   * -------------
   * GALLERY OBJECT
   * -------------
   */
  var Gallery = function() {
    this._photos = [];

    this._galleryOverlay = document.querySelector('.gallery-overlay');
    this._closeButton = document.querySelector('.gallery-overlay-close');

    this._onDocumentKeyDownBinded = this._onDocumentKeyDown.bind(this);
    this._closeHandlerBinded = this._closeHandler.bind(this);
  };

  /**
   *
   * @param {Array} picturesUrls
   *
   * @returns {undefined}
   */
  Gallery.prototype.setPhotos = function(picturesUrls) {
    this._photos = picturesUrls;
  };

  Gallery.prototype.setCurrentPhoto = function(index) {
    this._currentPhoto = index;

    var photoUrl = this._photos[this._currentPhoto];

    // Show the photo in the gallery
    this._galleryOverlay.querySelector('.gallery-overlay-image').src = photoUrl;

    // !!!FOR REVIEW!!!
    // COULDN'T FIND A BLOCK WHERE THIS DATA
    // HAST TO BE SHOWN
    // ToDo и пишет ее номер в соответствующем блоке
  };


  /**
   * SHOW / HIDE
   */

  Gallery.prototype.show = function() {
    this._galleryOverlay.classList.remove('invisible');
    document.body.addEventListener('keydown', this._onDocumentKeyDownBinded);
    this._closeButton.addEventListener('click', this._closeHandlerBinded);
  };

  Gallery.prototype.hide = function() {
    this._galleryOverlay.classList.add('invisible');
    document.body.removeEventListener('keydown', this._onDocumentKeyDownBinded);
    this._closeButton.removeEventListener('click', this._closeHandlerBinded);
  };

  /**
   * EVENTS
   */
  Gallery.prototype._onDocumentKeyDown = function(event) {
    switch (event.keyCode) {
      case Key.LEFT:
        console.log('show previos photo');
        break;
      case Key.RIGHT:
        console.log('show next photo');
        break;
      case Key.ESC:
        this.hide();
        break;
    }
  };

  Gallery.prototype._closeHandler = function(event) {
    event.preventDefault();
    this.hide();
  };

  // !!!FOR REVIEW!!!
  // FOR SOME REASONS, THIS METHOD IS ASKED IN THE TASK
  // BUT IT IS NOT USED AT ALL
  Gallery.prototype._onPhotoClick = function() {
    //this.setCurrentPhoto(index);
  };


  return Gallery;
});
