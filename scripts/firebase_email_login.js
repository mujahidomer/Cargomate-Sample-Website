/**
 * Created by mukht on 11/27/2016.
 * Handles the sign in button press.
 */
var app = angular.module("login", []);
var email = 'abc@xyz.com';
var password = '';
var displayName = 'Mr. Anonymous';
var photoURL =  'images/user-24.png';
app.controller("FirebaseLoginChecker", function ($scope, $http, $rootScope) {
    initApp($rootScope);
    $scope.userDetailsSet = function () {
        $scope.emailDisplay = email;
        $scope.photoDisplay = photoURL;
        $scope.nameDisplay = displayName;
        console.log('In userDetailsSet() function');
    };
    $scope.userDetailsSet();
    $scope.sendDataToServer = function ()  {
        console.log('In SendData(). Sending User Details to Server');
        var data = $.param({
            email: email,
            password: password
        });
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        $http.post('/login', data, config)
            .then(function (data, status, headers, config) {
                    console.log("Sending Success..!")
                    $scope.PostDataResponse = data;
                }
                ,function (data, status, header, config) {
                    $scope.ResponseDetails = "Data: " + data +
                        "<hr />status: " + status +
                        "<hr />headers: " + header +
                        "<hr />config: " + config;
                });
    };
    $rootScope.$on('signInStatusChanged', function () {
        $scope.sendDataToServer();
        $scope.$apply($scope.userDetailsSet());
        console.log('In FirebaseLoginChecker. User change catched!');
    })
});

app.controller("FirebaseLoginController", function ($scope, $http) {
    $scope.LoginWithEmail = function () {
        console.log('In LoginWithEmail() function');
        email = $scope.emailFetch;
        password = $scope.passwordFetch;
        toggleSignIn();
    };
});


function toggleSignIn() {
    if (firebase.auth().currentUser) {
        console.log('In toggleSignIn(). User already signed!');
        firebase.auth().signOut();
        console.log('In toggleSignIn(). User signed out!');
        Materialize.toast('User Signed Out!', 4000);
    } else {
        console.log('In toggleSignIn(). User signing in Progress!');
        if (email.length < 4) {
            alert('Please enter an email address.');
            return;
        }
        if (password.length < 4) {
            alert('Please enter a password.');
            return;
        }
        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
                Materialize.toast('Wrong password!', 4000);
            } else {
                alert(errorMessage);
            }
            console.log(error);
            //document.getElementById('quickstart-sign-in').disabled = false;
            // [END_EXCLUDE]
        });
        // [END authwithemail]
    }
    //document.getElementById('quickstart-sign-in').disabled = true;
}
/**
 * Handles the sign up button press.
 */
function handleSignUp() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (password.length < 4) {
        alert('Please enter a password.');
        return;
    }
    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
    });
    // [END createwithemail]
}
/**
 * Sends an email verification to the user.
 */
function sendEmailVerification() {
    // [START sendemailverification]
    firebase.auth().currentUser.sendEmailVerification().then(function() {
        // Email Verification sent!
        // [START_EXCLUDE]
        alert('Email Verification Sent!');
        // [END_EXCLUDE]
    });
    // [END sendemailverification]
}
function sendPasswordReset() {
    var email = document.getElementById('email').value;
    // [START sendpasswordemail]
    firebase.auth().sendPasswordResetEmail(email).then(function() {
        // Password Reset Email Sent!
        // [START_EXCLUDE]
        alert('Password Reset Email Sent!');
        // [END_EXCLUDE]
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/invalid-email') {
            alert(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
            alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
    });
    // [END sendpasswordemail];
}
/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp($rootScope) {
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user) {
        // [START_EXCLUDE silent]
        //document.getElementById('quickstart-verify-email').disabled = true;
        // [END_EXCLUDE]
        if (user) {
            // User is signed in.
            displayName = user.displayName;
            email = user.email;
            var emailVerified = user.emailVerified;
            photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            // [START_EXCLUDE silent]
            $rootScope.$broadcast('signInStatusChanged', []);
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
    // [END authstatelistener]
    /*document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
    document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
    document.getElementById('quickstart-verify-email').addEventListener('click', sendEmailVerification, false);
    document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset, false);*/
}