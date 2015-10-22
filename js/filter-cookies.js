'use strict';

(function() {
  function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
      '(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
    ));
    return matches ? decodeURIComponent(matches[1]) : void (0);
  }

  function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires === 'number' && expires) {
      var d = new Date();
      d.setTime(d.getTime() + expires * 1000);
      expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
      options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + '=' + value;

    for (var propName in options) {
      if (options.hasOwnProperty(propName)) {
        updatedCookie += '; ' + propName;
        var propValue = options[propName];
        if (propValue !== true) {
          updatedCookie += '=' + propValue;
        }
      }

    }

    document.cookie = updatedCookie;
  }

  // getCookie

  var name = 'filterChecked';
  var selectedFilter = getCookie(name);
  if (selectedFilter) {
    var radioButton = document.querySelector('input[name="upload-filter"][value="' + selectedFilter + '"]');
    radioButton.checked = true;
  }

  // setCookie

  var button = document.getElementById('filter-fwd');

  button.onclick = function() {
    var value = document.querySelector('input[name = "upload-filter"]:checked').value;

    var DateLifeCookie = new Date();
    var Birthday = new Date();
    Birthday.setMonth(9);
    Birthday.setDate(4);
    var today = new Date();
    if ((Birthday - today) > 0) {
      Birthday.setFullYear(today.getFullYear() - 1);
    }
    DateLifeCookie.setTime(+today + (today - Birthday));

    setCookie(name, value, {expires: DateLifeCookie});
  };
})();
