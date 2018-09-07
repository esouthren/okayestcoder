function uploadImage() {
    // Upload image to firebase
    if (checkIfUserLoggedIn()) {
        const ref = firebase.storage().ref('post_images');
        const file = document.querySelector('#myFile').files[0]
        const name = (+new Date()) + '-' + file.name;
        const metadata = {
          contentType: file.type
        };
        const task = ref.child(name).put(file, metadata);
        task.then((snapshot) => {
            var url = snapshot.downloadURL
            imagesList.push(url);
            displayImages();


        }).catch((error) => {
            console.error(error);
        });
    }
    else {
      alert("Upload failed, user is not logged in");
    }
}

function deleteImage(url, fileLocation) {
    var index = imagesList.indexOf(fileLocation);
    if (index > -1) {
        imagesList.splice(index, 1);
    }
    var storage = firebase.storage();
    var storageRef = storage.ref();               
    if (checkIfUserLoggedIn()) {
        var fullUrl = 'post_images/' + url;
        var ref = storageRef.child(fullUrl);
        // Delete the file
        ref.delete().then(function() {
          console.log('image deleted');
            images.pop
            displayImages();
        }).catch(function(error) {
          console.log('error deleting image: ' + fullUrl);
        });
    } else {
        alert("Must be logged in to delete image");
    }
}

function displayImages() {
    var images = "";
    for (var i = 0; i < imagesList.length; i++) {
        var fileName = imagesList[i] + '';
        var slash = fileName.lastIndexOf('2F') + 2;
        var end = fileName.lastIndexOf('?');
        fileName = fileName.slice(slash, end);
        // Update page with newly uploaded image
        images += '<img src="' + imagesList[i] + '" width="100" /><button onclick="copyToClipboard(\'' + imagesList[i] + '\')">Copy URL </button> <button onclick="deleteImage(\'' + fileName + '\', \'' + imagesList[i] + '\')"> X </button><br />';
    }
    $('#images').html(images); 
}

function copyToClipboard(texty) {
    // Copy the URL link to the clipboard to insert into img tag
    // Creates temporary text element, appends our text, and copies the selected 'focus'
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(texty).select();
    document.execCommand("copy");
    $temp.remove();
} 