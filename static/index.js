
// Prevent reSending post data on page refresh or back button
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

function toggleSignUp(e){
    e.preventDefault();
    $('#logreg-forms .form-signin').toggle(); // display:block or none
    $('#logreg-forms .form-signup').toggle(); // display:block or none
}

$('#logreg-forms #btn-signup').click(toggleSignUp);
$('#logreg-forms #cancel_signup').click(toggleSignUp);