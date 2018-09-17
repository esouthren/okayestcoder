var imagesList = [];

function setAddPostButtons() {
    var postString = "";
    postString +=  '<input id="clickMe" type="button" value="Add Post" onclick="submitPost()" />';
    $('.pageSpecificButtons').html(postString);
}

function setAddPostTitle() {
    $('.pageTitle').html("Add a Post");
}

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
