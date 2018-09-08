// Initialize Firebase
function initialiseFirebase() {
    var config = {
        apiKey: "AIzaSyButp2-SFrYWWGZEZORCtE5K12WATgyPvc",
        authDomain: "okayestcoder.firebaseapp.com",
        databaseURL: "https://okayestcoder.firebaseio.com",
        projectId: "okayestcoder",
        storageBucket: "okayestcoder.appspot.com",
        messagingSenderId: "935764653668"
    };
    firebase.initializeApp(config); 
}

function logIn() {
    // sign in pop up
    var user = firebase.auth().currentUser;
    if (user) {
        console.log("User is signed in");   
    } 
    else {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            console.log("User signed in");
            changeLoggedInStatus();
        }).catch(function(error) {
            console.log("login error :/ " + error.code + ' Message: ' + error.message);
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential; 
        });             
    }
}

function logOut() {
    // Sign out of user account
    firebase.auth().signOut().then(function() {
        changeLoggedInStatus()
    }, function(error) {
      console.error('Sign Out Error', error);
    });
}

function changeLoggedInStatus() {
 if (checkIfUserLoggedIn()) {
        $('.logInStatus').html("You are logged in");
        $('.logInStatus').css("background-color","green"); 
        console.log("logged in");
    }
   else {
        $('.logInStatus').html("You are not logged in");
        $('.logInStatus').css("background-color","red"); 
        console.log("not logged in");
    }
}
            
function checkIfUserLoggedIn() {
    // change text in addPost.html to indicate whether user is logged in or not
    return firebase.auth().currentUser;
}
