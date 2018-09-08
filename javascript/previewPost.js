function previewPost() {
    var post_string = "";
    var postTitle = document.getElementById('postTitle').value;
    var postDate = document.getElementById('postDate').value;
    var postText = document.getElementById('postText').value;
    var postTags = document.getElementById('postTags').value;
    var postThumbnail = document.getElementById('thumbnail').value;
    
    post_string += '<div class="postContentFull">' +
    '<h1>' + postTitle + '</h1>' +
    '<h3>' + postDate + '</h3>' +
    '<h5><strong>Tags </strong>';
    // Display all tags
    var tagsSplit = postTags.split(',');
    for(var i = 0; i < tagsSplit.length; i++) {
        post_string += '<mark>&nbsp;' + tagsSplit[i] + '&nbsp;</mark>&nbsp;&nbsp;';  
    }
    post_string += '</h5>' + postText + '<br /><br />' +
        '</div>';
    $('.postPreviewContent').html(post_string);
    $('.postPreviewBackground').css("display", "block");
}

function closePreview() {
    $('.postPreviewBackground').css("display", "none");
}