

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
            tags_string += '<mark class="tagSearch" id="tagNum' + tagNum + '" onclick="toggleTag(' + tagNum++ + ')">&nbsp;' + val + ' &nbsp;</mark>&nbsp;&nbsp;';
         }
       $('#tags').html(tags_string);
       tagList = tags;
     });
}

function showTaggedPosts() {
    console.log("updating posts...");
    tags = getSelectedTagList();
    console.log(tags);
    // todo: only display post if the tag filter is true

    var database = firebase.database();
    var string_of_posts = "";
    var dataDump = database.ref('posts').orderByChild('index');

    dataDump.on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            var postNum = childData['index'];
            // check if tags match - if they do, add to HTML string
            
            string_of_posts += '<h3><li><a id="titleLink" href="#" onclick="displayPost(' + postNum + ');return false;">' + childData['title'] + '</a></li></h3>';

            string_of_posts += '</h5>';
        });
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
    var taggy = '#tagNum' + num;
    var curr = $(taggy).css("background-color");
    console.log(curr);
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
  console.log("turning on all tags...");
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
