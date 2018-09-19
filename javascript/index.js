function displayAllPosts() {
    // Display a list of all posts
    var database = firebase.database();
    var dataDump = database.ref('posts').orderByChild('index');
    var string_of_posts = "";
    dataDump.on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            // Create thumbnail url, create default if it doesn't exist
            var thumbnail_url = childData['thumbnail'];
            if (thumbnail_url == null) {
                thumbnail_url = "testimg.jpg";
            }

            var postNum = (childData['index']);

            /* appending "" or "2" to post for correct alternate colour scheme */
            var post = getPostAppend(postNum);

            string_of_posts += '<div class="post' + post + '" onclick="displayPost(' + postNum + ')">';
            /* In string_of_posts for thumbnail: <img src="' + thumbnail_url + '" class="thumbnail" align="right" alt="test!" /> */
             string_of_posts += '<div class="postContent' + post + '">' +
                    '<table class="postHeader"><tr><td><h2>' + childData['title'] + '</h2></td>' +
                    '<td class="postHeaderDate"><h3>' + childData['date'] + '</h3></td></tr></table>' ;

            var blurb = childData['text'].slice(0,250);
            // Strip HTML tags so we don't get images in the posts list
            var blurbStripped = blurb.replace(/<[^>]+>/g, '');
            string_of_posts += blurbStripped + '....<strong> Continue</strong><br /><h5>';
            // Display all tags of a post
            for(var i = 0; i < childData['tags'].length; i++) {
                string_of_posts += '<mark class="tag">&nbsp;' + childData['tags'][i] + '&nbsp;</mark>&nbsp;&nbsp;';
            }
            string_of_posts += '</h5></div></div>';
        });
        // Map HTML to #main div content
        var list_of_posts = string_of_posts;
        $('#main').html(list_of_posts);
    });
}

function getUrlParameter(name) {
    // Retrieve post parameter from URL
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function findPostFromParameter(para) {
    // Retrieve post number from title and display it
    var database = firebase.database();
    var post_string = "";
    var dataDump = database.ref('posts').orderByChild('index');
    var postNum = null;
    dataDump.on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            if (childData['title'] == para) {
                postNum = childData['index'];
                // Display found post
                displayPost(postNum);
                return true;
            }
        });
    });
}

var para = getUrlParameter('post');
    if (para == "" ) {
        // If the URL has no parameter, display all posts
        displayAllPosts();
    }
    else {
        // Otherwise, get post from parameter name and display
        findPostFromParameter(para);
}

function displayPost(postNum) {
    // Display Selected Post when displayPost() is called
    var database = firebase.database();
    var post_string = "";
    var post_title = "";
    var dataDump = database.ref('posts').orderByChild('index');

    dataDump.on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            if(childData['index'] == postNum) {
                /* appending "" or "2" to post for correct alternate colour scheme */
                var post = getPostAppend(postNum);
                post_string += '<div class="post' + post + '">';
                post_string += '<div class="postContentFull' + post + '">' +
                '<h3><a href="index.html">< Return</a></h3>' +
                '<h1>' + childData['title'] + '</h1>' +
                '<h3>' + childData['date'] + '</h3>' +
                '<h5><strong>Tags </strong>';
                // Display all tags
                for(var i = 0; i < childData['tags'].length; i++) {
                    post_string += '<mark class="tag">&nbsp;' + childData['tags'][i] + '&nbsp;</mark>&nbsp;&nbsp;';
                }
                post_string += '</h5>' + childData['text'] + '<br /><br />' +
                    '<h3><a href="index.html">< Return</a></h3></div></div>';
                post_title = childData['title'];
            }
        });
    });
    // add url parameter of post title
    var para = getUrlParameter('post');
    if (para != post_title) {
        addOrUpdateUrlParam("post", post_title);
    }
    // Set data to #main div
    $('#main').html(post_string);
    // Re-render prism highlighting on inserted HTML
    Prism.highlightAll();
}

function addOrUpdateUrlParam(name, value) {
    // Add value parameter to url
    var href = window.location.href;
    var pageUrl = window.location.href + "?post=" + value;
    window.history.pushState('','',pageUrl);
}

function getPostAppend(num) {
    if(parseInt(num) % 2 == 0 || num == 1) {
        return "";
    }
    else {
        return "2";
    }
}
