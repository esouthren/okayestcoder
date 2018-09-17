function showTaggedPosts() {
    

    console.log("displaying posts...");
    var database = firebase.database();
    var dataDump = database.ref('posts').orderByChild('index');
    
    var filteredTags = getUserFilteredTags(dataDump);
    console.log("size:" + filteredTags.size);
    for (var it = filteredTags.values(), val= null;         val=it.next().value; ) {
        console.log(val);
    }
    
    var string_of_posts = "";
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

function getUserFilteredTags(data) {
    /* loop through posts, create set of tags in them */
    
    let tags = new Set();
     data.on('value', function(snapshot) {
         snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            for(var i = 0; i < childData['tags'].length; i++) {
                console.log("adding...." + childData['tags'][i]);
                tags.add(childData['tags'][i]);
            }
     });
     });
    return tags;
}