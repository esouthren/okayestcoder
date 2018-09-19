

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
            tags_string += '<mark class="tagSearch" id="tagNum' + tagNum + '" onclick="toggleTag(' + tagNum++ + ')">&nbsp;' + val + '&nbsp;</mark>&nbsp;&nbsp;';
            if(tagNum % 4 == 0 ) { tags_string += "<br />"; }
         }
       $('#tags').html(tags_string);
       tagList = tags;
     });
}

function showTaggedPosts() {
    tags = getSelectedTagList();
    var database = firebase.database();
    var string_of_posts = "";
    var dataDump = database.ref('posts').orderByChild('index');
    var postCount = 0;
    dataDump.on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            var postNum = childData['index'];
            // check if tags match - if they do, add to HTML string
            var postTags = new Set();
            for(var i = 0; i < childData['tags'].length; i++) {
              postTags.add($.trim(childData['tags'][i]));
            }
            var intersect = new Set();
            for(var x of tags) if(postTags.has(x)) intersect.add(x);

            if(intersect.size > 0) {
              string_of_posts += '<h3><a id="titleLink" href="#" onclick="displayPost(' + postNum + ');return false;">' + childData['title'] + '</a></h3>';
              postCount++;
            }
        });
        if(postCount == 0) {
          string_of_posts += "Click some tags above to show tagged articles.<br /><br />";
        }
        $('#posts').html(string_of_posts);
    });
}

function toggleTag(num) {
    var taggy = '#tagNum' + num;
    var curr = $(taggy).css("background-color");
    if(curr=="rgb(255, 255, 255)") {
        $(taggy).css("background-color", "var(--post-two-color)");
    } else {
    $(taggy).css("background-color", "white");
  }
  showTaggedPosts();
}

function showNoTags() {
  var tags = $("#tags").children("mark");
  for(var i = 0; i < tags.length; i++) {
    $(tags[i]).css("background-color", "white");
  }
  showTaggedPosts();
}

function showAllTags() {
  var tags = $("#tags").children("mark");
  for(var i = 0; i < tags.length; i++) {
    $(tags[i]).css("background-color", "var(--post-two-color)");
  }
  showTaggedPosts();
}

function getTagList() {
  // return a list of all tags displayed on the page
  var tags = $("#tags").children("mark");
  tagList = new Set();
  for(var i = 0; i < tags.length; i++) {
    tagList.add($.trim($(tags[i]).text()));
  }
  return tagList;
}

function getSelectedTagList() {
  // return a list of all user selected tags
  var tags = $("#tags").children("mark");
  tagList = new Set();
  for(var i = 0; i < tags.length; i++) {
    var curr = $(tags[i]).css("background-color");
    if(curr != "rgb(255, 255, 255)") {
      tagList.add($.trim($(tags[i]).text()));
  }
  }
  return tagList;

}
