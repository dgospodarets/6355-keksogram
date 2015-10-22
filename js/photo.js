'use strict';
(function() {
  var Photo = function(data) {
    this._data = data;
    this._element = null;
    this._image = null;


    this._onClick = this._onClick.bind(this);
  };

  /**
   * @private
   */
  Photo.prototype._onClick = function() {
    if (!this._element.classList.contains('.picture-load-failure')) {
      var galleryEvent = new CustomEvent('galleryclick');
      window.dispatchEvent(galleryEvent);
    }
  };

  Photo.prototype.render = function() {
    var template = this._data.template.cloneNode(true);
    var picture = this._data.picture;

    var image = new Image(182, 182);
    this._image = image;
    var imgToReplace = template.querySelector('img');
    this._element = template;

    // EVENTS
    image.onload = function() {
      imgToReplace.parentNode.replaceChild(image, imgToReplace);
    };

    image.onerror = function() {
      template.classList.add('picture-load-failure');
    };

    image.src = picture.url;

    this._element.addEventListener('click', this._onClick);

    return template;
  };

  Photo.prototype.unrender = function() {
    this._element.parentNode.removeChild(this._element);

    // EVENTS
    this._image.onload = null;
    this._image.onerror = null;
    this._element.removeEventListener('click', this._onClick);
  };
  window.Photo = Photo;
}());
