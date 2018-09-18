//tags = new Set();

function displayTags() {
    // display a list of tags used in posts
    var database = firebase.database();
    var dataDump = database.ref('posts').orderByChild('index');
    var tags_string = "";
    tags = new Set();
    dataDump.on('value', function(snapshot) {
         snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            for(var i = 0; i < childData['tags'].length; i++) {
                var temp = childData['tags'][i];
                tags.add(temp);
            }
     }); 
        var tagNum = 0;
        for (var it = tags.values(), val= null; val=it.next().value; ) {
            console.log("tagnum: " + tagNum);
            tags_string += '<mark id="tagNum' + tagNum + '" onclick="toggleTag(' + tagNum++ + ')">&nbsp;' + val + ' x &nbsp;</mark>&nbsp;&nbsp;';
         }
       $('#tags').html(tags_string);
     });
}

function showTaggedPosts() {
    
    // todo: only display post if the tag filter is true
    
        var database = firebase.database();
    var string_of_posts = "";
        var dataDump = database.ref('posts').orderByChild('index');

    dataDump.on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            var postNum = childData['index'];
            string_of_posts += '<h3><li><a id="titleLink" href="#" onclick="displayPost(' + postNum + ');return false;">' + childData['title'] + '</a></li></h3>';                  
            // Display all tags of a post
            string_of_posts +=  '<h5><strong>Tags </strong>';
            for(var i = 0; i < childData['tags'].length; i++) {
                string_of_posts += '<mark>&nbsp;' + childData['tags'][i] + '&nbsp;</mark>&nbsp;&nbsp;';
            }
            string_of_posts += '</h5>';
        });
        string_of_posts += '</ul><br />things!</div>';
        // Map HTML to #main div content
        var list_of_posts = string_of_posts;
        $('#posts').html(list_of_posts);   
    });
}

function updateFilters() {
    console.log("update filters");
    // call showTaggedPosts?
}

function toggleTag(num) {
    console.log("toggle taggy");
    var taggy = '#tagNum' + num;
    console.log("taggy: " + taggy);
    $(taggy).css("background-color: red");
}
