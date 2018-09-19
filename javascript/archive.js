function displayArchivePosts() {
  var database = firebase.database();
  var dataDump = database.ref('posts').orderByChild('index');
  // Generate list of post titles
  var string_of_posts = '<div class="post"><div class="postContentFull"><div class="addPostForm"><h1>Archive</h1>';
  dataDump.on('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
          var childData = childSnapshot.val();
          var postNum = childData['index'];
          string_of_posts += '<h3><a id="titleLink" href="#" onclick="displayPost(' + postNum + ');return false;">' + childData['title'] + '</a></h3>';
          // Display all tags of a post
          string_of_posts +=  '<h5><strong>Tags </strong>';
          for(var i = 0; i < childData['tags'].length; i++) {
              string_of_posts += '<mark class="tag">&nbsp;' + childData['tags'][i] + '&nbsp;</mark>&nbsp;&nbsp;';
          }
          string_of_posts += '</h5>';
      });
      string_of_posts += '<br /></div>';
      // Map HTML to #main div content
      var list_of_posts = string_of_posts;
      $('#main').html(list_of_posts);
  });
}
