(function () {
    //images
    function insertImage(imgToReplace, picture) {
        var image = new Image(182, 182);

        image.onload = function () {
            imgToReplace.parentNode.replaceChild(image, imgToReplace);
        };
        image.onerror = function () {
            imgToReplace.parentNode.classList.add('picture-load-failure');
        };
        image.src = picture.url;
    }

    document.querySelector('.filters').classList.add('hidden');//hide filters block

    var fragment = document.createDocumentFragment();

    //PROCESS EACH PICTURE
    pictures.forEach(function (picture) {
        var template = document.getElementById('picture-template').content.cloneNode(true);

        insertImage(template.querySelector('img'), picture);

        template.querySelector('.picture-comments').innerHTML = picture.comments;
        template.querySelector('.picture-likes').innerHTML = picture.likes;
        fragment.appendChild(template);
    });

    document.querySelector('.pictures').appendChild(fragment);

    document.querySelector('.filters').classList.remove('hidden');//show filters block
}());