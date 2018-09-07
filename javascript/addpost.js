var imagesList = [];

function submitPost() {
    // Upload post to firebase
    var postTitle = document.getElementById('postTitle').value;
    var postDate = document.getElementById('postDate').value;
    var postText = document.getElementById('postText').value;
    var postTags = document.getElementById('postTags').value;
    var postThumbnail = document.getElementById('thumbnail').value;

    if( (postTitle === "") ||
        (postDate === "") ||
        (postText === "") ||
        (postTags === "") )
        {
            console.log("Need data!");
            $('.postLog').html("Error: All Fields Need Data");
    }
    else {
        postTags = postTags.toLowerCase();
        postTags = postTags.split(',');
        if (checkIfUserLoggedIn()) {                    
            console.log("User is signed in!");
            // Increment 'PostCount' by 1
            firebase.database().ref('/count/postCount').once('value').then(function(snapshot) {
                var count = (snapshot.val());
                count +=1;            
                firebase.database().ref('count').set({
                    postCount: count
                     });
                // Write Post Data
                firebase.database().ref('posts/post' + count).set({
                    title: postTitle,
                    date: postDate,
                    text : postText,
                    tags : postTags,
                    thumbnail : postThumbnail,
                    // Negative index to maintain order when displaying posts page
                    index: (count*-1)

                });
                window.location.href = 'index.html';
                logOut();
            });    
        } 
        else {
            alert("Upload failed; try refreshing the page to trigger log in");
        }
    }   
}



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
    var user = firebase.auth().currentUser;
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
