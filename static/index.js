
// Prevent reSending post data on page refresh or back button
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// a function to change between SignIn/SignUp froms
function toggleSignUp(e){
    e.preventDefault();
    $('#logreg-forms .form-signin').toggle(); // display:block or none
    $('#logreg-forms .form-signup').toggle(); // display:block or none
}

// Buttons events...

$('#logreg-forms #btn-signup').click(toggleSignUp);
$('#logreg-forms #cancel_signup').click(toggleSignUp);

// Check SignUp fields validation
$("#signUpSubmit").click(function(e){

    if($("#r_password").val()=="" || $("#r_password").val()=="" || $("#r_password").val()=="" || $("#r_password").val()==""){
        e.preventDefault();
        alertify.error("please fill out all fields!");
    }
    else if ($("#r_password").val() != $("#r_password_repeat").val()){
        e.preventDefault();
        alertify.error("Password and repeat password doesn't match!");
    }
});