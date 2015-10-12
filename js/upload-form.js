(function () {
    var uploadForm = document.forms['upload-select-image'];
    var resizeForm = document.forms['upload-resize'];
    var filterForm = document.forms['upload-filter'];

    var fileElement = uploadForm['upload-file'];

    function uploadImage(element, callback) {
        var fileReader = new FileReader();
        fileReader.onload = function (evt) {
            var image = evt.target.result;
            callback(image);
        };

        fileReader.readAsDataURL(element.files[0]);
    }

    fileElement.onchange = function () {
        if (fileElement.value) {
            fileElement.classList.add('upload-input-hasvalue');
        }
    };

    uploadForm.onsubmit = function (evt) {
        evt.preventDefault();

        uploadImage(fileElement, function (image) {
            sessionStorage.setItem('uploaded-image', image);
            var resizeImage = resizeForm.querySelector('.resize-image-preview');
            resizeImage.src = image;//show uploaded image in html
            setResizeFormDefaults(resizeImage.width, resizeImage.height);  //SET DEFAULTS

            filterForm.querySelector('.filter-image-preview').src = image;

            uploadForm.classList.add('invisible');
            resizeForm.classList.remove('invisible');
        });
    };

    uploadForm.onreset = function () {
        fileElement.classList.remove('upload-input-hasvalue');
    };

    /**
     *  SET RESIZE FORM DEFAULT
     * */
    var resizeX = document.getElementById('resize-x');
    var resizeY = document.getElementById('resize-y');
    var resizeSize = document.getElementById('resize-size');
    var imageWidth = 0;
    var imageHeight = 0;

    function setResizeFormDefaults(width, height) {
        resizeX.value = 0;
        resizeY.value = 0;
        resizeSize.value = Math.min(width, height);
        imageWidth = width;
        imageHeight = height;

        setMinValues(0);
        setMaxValues();
    }

    function setMinValues(value) {
        resizeX.min = value;
        resizeY.min = value;
        resizeSize.min = value;
    }

    function setMaxValues() {
        var resizeXVal = resizeX.value;
        var resizeYVal = resizeY.value;
        var resizeSizeVal = resizeSize.value;

        // X
        resizeX.max = imageWidth - resizeSizeVal;

        //Y
        resizeY.max = imageHeight - resizeSizeVal;

        //Size
        var maxWidthSize = imageWidth - resizeXVal;
        var maxHeightSize = imageHeight - resizeYVal;
        resizeSize.max = Math.min(maxWidthSize, maxHeightSize);
    }

    /**
     *  RESIZE FORM EVENTS
     * */
    resizeX.oninput = setMaxValues;
    resizeY.oninput = setMaxValues;
    resizeSize.oninput = setMaxValues;
})();
