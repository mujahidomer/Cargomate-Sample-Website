/**
 * Created by mukht on 3/6/2017.
 */


var email = 'abc@xyz.com';
var displayName = 'Mr. Anonymous';
var photoURL =  'images/user-24.png';

/**
 * Function called when clicking the Login/Logout button.
 */
// [START buttoncallback]
function toggleSignIn() {
    if (!firebase.auth().currentUser) {
        console.log('trying to sign in');
        // [START createprovider]
        var provider = new firebase.auth.GoogleAuthProvider();
        // [END createprovider]
        // [START addscopes]
        provider.addScope('https://www.googleapis.com/auth/plus.login');
        // [END addscopes]
        // [START signin]
        firebase.auth().signInWithRedirect(provider);
        // [END signin]
    } else {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
    }
}
// [END buttoncallback]


/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 *  - firebase.auth().getRedirectResult(): This promise completes when the user gets back from
 *    the auth redirect flow. It is where you can get the OAuth access token from the IDP.
 */
function initApp() {
    // Result from Redirect auth flow.
    // [START getidptoken]
    firebase.auth().getRedirectResult().then(function(result) {
        if (result.credential) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
        }
        // The signed-in user info.
        var user = result.user;
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // [START_EXCLUDE]
        if (errorCode === 'auth/account-exists-with-different-credential') {
            alert('You have already signed up with a different auth provider for that email.');
            // If you are using multiple auth providers on your app you should handle linking
            // the user's accounts here.
        } else {
            console.error(error);
        }
        // [END_EXCLUDE]
    });

    firebase.auth().onAuthStateChanged(function(user) {
        // [START_EXCLUDE silent]
        //document.getElementById('quickstart-verify-email').disabled = true;
        // [END_EXCLUDE]
        if (user) {
            console.log("google sign in successful!!");
            // User is signed in.
            displayName = user.displayName;
            email = user.email;
            var emailVerified = user.emailVerified;
            photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            // [START_EXCLUDE silent]
            document.getElementById('display_name').textContent = displayName;
            document.getElementById('display_email').textContent = email;
            document.getElementById('display_photo').src = photoURL;
            if (!emailVerified) {
                //document.getElementById('quickstart-verify-email').disabled = false;
            }
            // [END_EXCLUDE]
        } else {
            // User is signed out.
            // [START_EXCLUDE silent]
            email = 'abc@xyz.com';
            password = '';
            displayName = 'Mr. Anonymous';
            photoURL =  'images/logo_original.png';
            // [END_EXCLUDE]
        }
        // [START_EXCLUDE silent]
        //document.getElementById('quickstart-sign-in').disabled = false;
        // [END_EXCLUDE]
    });

    document.getElementById('google_sign_in').addEventListener('click', toggleSignIn, false);
}

window.onload = function() {
    initApp();
};
