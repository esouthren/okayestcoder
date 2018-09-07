 function deletePostButton() {
     // is a post selected?
     if($("#postToEdit").val() == "") {
         alert("You haven't selected a post to delete!");
     }
     else {
         // are we logged in?
         if(!firebase.auth().currentUser) {
             alert("You're not logged in!");
         }
         else {
            var r = confirm("Sure you want to delete that?");
            if (r == true) {
                deletePost();
            }
         }

     }
 }

function createPostsDropDownMenu() {
    /* Creating a drop down menu of posts for the editpost.html page */
    var database = firebase.database();
    var dataDump = database.ref('posts').orderByChild('index');
    dataDump.on('value', function(snapshot) {
        var dropdown_string = '<select id="postToEdit" onchange="updateEditPostFields()"><option value=""></option>';
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            dropdown_string += '<option value="' + childData['index'] + '">' + childData['title'] + '</option>';
        });
    dropdown_string += '</select>';
     $('#dropDownMenu').html(dropdown_string);  
    });
}

function updateEditPostFields() {
    var database = firebase.database();
    var dataDump = database.ref('posts').orderByChild('index');
    var selectedPost = $("#postToEdit").val();
    console.log("selectedPost: " + selectedPost);
     dataDump.on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            if(childData['index'] == selectedPost) {
                /* appending "" or "2" to post for correct alternate colour scheme */
                 $('#postTitle').val(childData['title']);
                $('#postDate').val(childData['date']);
                $('#thumbnail').val(childData['thumbnail']);
                $('#postText').val(childData['text']);
                $('#postTags').val(childData['tags']);
                $('#postName').val(childSnapshot.key);

            }                  
        });
    });
}

function deletePost() {
    var selectedPost = $("#postName").val();
    // Increment 'PostCount' by 1
    firebase.database().ref('/count/postCount').once('value').then(function(snapshot) {
        var count = (snapshot.val());
        count -=1;            
        firebase.database().ref('count').set({
            postCount: count
             });
        // Write Post Data
        firebase.database().ref('posts/' + selectedPost).set(null);
        logOut();
        window.location.href = 'index.html';
    }); 
}

var imagesList = [];

function updatePost() {
    // Upload post to firebase
    var postTitle = document.getElementById('postTitle').value;
    var postDate = document.getElementById('postDate').value;
    var postText = document.getElementById('postText').value;
    var postTags = document.getElementById('postTags').value;
    var postThumbnail = document.getElementById('thumbnail').value;
    var postIndex = parseInt($("#postToEdit").val());
    var postName = document.getElementById('postName').value;

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

        /* Check if user is logged in */
        if (checkIfUserLoggedIn()) {                    
            console.log("User is signed in!");
                // Write Post Data
                firebase.database().ref('posts/' + postName).set({
                    title: postTitle,
                    date: postDate,
                    text : postText,
                    tags : postTags,
                    thumbnail : postThumbnail,
                    index : postIndex,
                });
                console.log("Data written!");
                window.location.href = 'index.html';
                logOut();

        } 
        else {
            alert("Upload failed; try refreshing the page to trigger log in");
        }
    }   
}
       