<?php
require_once 'db.php';

if (session_status() === PHP_SESSION_NONE) {
	session_start();
}
// Check if Logged in, Redirect to home 
if (isset($_SESSION["userid"])) {
	header("Location: home.php");
}


$invalidCreds = false;
if (isset($_POST['signin'])) {
	// removes backslashes
	$username = stripslashes($_POST['username']);
	//escapes special characters in a string
	$username = mysqli_real_escape_string($conn, $username);
	$password = stripslashes($_POST['password']);
	$password = mysqli_real_escape_string($conn, $password);
	//Checking is user existing in the database or not
	$query = "SELECT * FROM `users` WHERE username='$username' AND password='" . md5($password) . "'";
	$result = mysqli_query($conn, $query) or die($conn->error);
	$rows = mysqli_num_rows($result);

	if ($rows == 1) {

		while ($r = mysqli_fetch_array($result)) {
			$_SESSION['userid']  = $r['id'];
		}

		header("Location: home.php");
		exit();
	} else {
		$invalidCreds = true;
	}
}

if (isset($_POST['signup'])) {
	// removes backslashes
	$username = stripslashes($_POST['username']);
	//escapes special characters in a string
	$username = mysqli_real_escape_string($conn, $username);
	$email = stripslashes($_POST['email']);
	$email = mysqli_real_escape_string($conn, $email);
	$password = stripslashes($_POST['password']);
	$password = mysqli_real_escape_string($conn, $password);
	$query = "INSERT into `users` (username, password, email) VALUES ('$username', '" . md5($password) . "', '$email')";
	$result = mysqli_query($conn, $query);
	if ($result) {
		$_SESSION["signedUp"] = "ok";
		header("Location: index.php");
		exit();
	} else {
		$_SESSION["signedUp"] = "failed";
		header("Location: index.php");
		exit();
	}
}



?>

<!DOCTYPE html>
<html>


<head>
	<title>ToDo-List | Login</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="static/styles.css">
	<link rel="stylesheet" href="static/bootstrap/bootstrap.min.css">
	<!--
	<link rel="stylesheet" href="static/font-awesome/font-awesome.min.css">
	-->
	<script src="static/jquery/jquery-3.6.0.min.js"></script>
	<script src="static/bootstrap/bootstrap.min.js"></script>

<body>

	<div style="display: flex; justify-content: center; align-self: center; align-items: center;">

		<img src="static/logo.png" style="padding: 16px 16px 0 16px ;">

	</div>

	<div id="logreg-forms">

		<!-- Sign in Form -->
		<form class="form-signin" action="" method="POST">

			<h1 class="h3 mb-3 font-weight-normal" style="text-align: center;">Welcome to ToDo-List Website!</h1>

			<?php

			if (isset($_SESSION["signedUp"]) &&  $_SESSION["signedUp"] != "") {
				if ($_SESSION["signedUp"] == "ok") {
					echo '<div style="text-align: center;" class="form">
          <p> You have successfully registered. Now you can sign in ! </p>';
				} else {
					echo '<div style="text-align: center;" class="form">
          <p> Invalid input data. Please try again ! </p>';
				}
				$_SESSION["signedUp"] = "";
			}

			if ($invalidCreds) {
				echo '<p style="text-align:center;margin-top: 32px;">Invalid Username/Password !</p>';
			} else {
				echo '<p style="text-align:center;margin-top: 32px;">Please enter your username and password :</p>';
			}

			?>

			<input type="hidden" id="signin" name="signin" value="yes">
			<input type="username" id="username" name="username" class="form-control" placeholder="Username" required="" autofocus="">
			<input type="password" id="password" name="password" class="form-control" placeholder="Password" required="">
			<button class="btn btn-success btn-block" type="submit"><i class="fas fa-sign-in-alt"></i> Sign in</button>
			<hr>
			<button class="btn btn-primary btn-block" type="button" id="btn-signup"><i class="fas fa-user-plus"></i> Don't
				have an account? Sign Up!</button>
		</form>

		<!-- Sign Up Form -->

		<form class="form-signup" action="" method="POST">

			<p style="text-align:center;margin-top: 32px;">Please enter your account details :</p>
			<input type="hidden" id="signup" name="signup" value="yes">
			<input type="text" id="username" name="username" class="form-control" placeholder="UserName" required="" autofocus="">
			<input type="email" id="email" name="email" class="form-control" placeholder="Email address" required autofocus="">
			<input type="password" id="password" name="password" class="form-control" placeholder="Password" required autofocus="">
			<input type="password" id="password-repeat" name="password-repeat" class="form-control" placeholder="Repeat Password" required autofocus="">
			<button class="btn btn-primary btn-block" type="submit"><i class="fas fa-user-plus"></i> Sign Up</button>
			<a href="#" id="cancel_signup"><i class="fas fa-angle-left"></i> Back</a>
		</form>
		<br>

	</div>

	<script type="text/javascript" src="static/index.js"></script>
</body>

</html>