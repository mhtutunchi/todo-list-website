<?php
require_once 'db.php';
if (session_status() === PHP_SESSION_NONE) {
	session_start();
}
// Check if Logged in ...
if (isset($_SESSION["userid"])) {
	$userid = $_SESSION["userid"];
} else {
	header("Location: index.php");
}
?>

<!DOCTYPE html>
<html>

<head>
	<title>ToDo-List | Home</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="static/styles.css">
	<link rel="stylesheet" href="static/bootstrap/bootstrap.min.css">
	<link rel="stylesheet" href="static/alertify/alertify.min.css">
	<link rel="stylesheet" href="static/alertify/default.min.css">
	<link rel="stylesheet" href="static/alertify/semantic.min.css">
	<link rel="stylesheet" href="static/alertify/bootstrap.min.css">
	<!--
	<link rel="stylesheet" href="static/font-awesome/font-awesome.min.css">
	-->
	<script src="static/jquery/jquery-3.6.0.min.js"></script>
	<script src="static/bootstrap/bootstrap.min.js"></script>
	<script src="static/alertify/alertify.min.js"></script>
	<meta charset="utf-8">

</head>



<body class="bg">


	<input type="hidden" id="userid" name="userid" value="<?php echo $userid ?>">

	<div class="container myContainer" style="margin-top: 32px; margin-bottom: 32px;">
	
		<div class="mainContent">
			

			<div style="display: flex; justify-content: center; align-self: center; align-items: center;">
				<img src="static/logo.png" style="margin: 8px ;">
			</div>

			<div class="row">
				<div class="col-md-offset-7 col-xs-6 col-md-3">
					<div class="input-group">
						<input type="text" class="form-control" placeholder="Search" id="txtSearch" />
						<div class="input-group-btn">
							<button class="btn btn-primary" onclick="search(txtSearch.value);" type="submit">Search</button>
						</div>
					</div>
				</div>
			</div>


			<div class="row" style="margin-top: 16px;">
				<div class="col-md-8 col-md-offset-2">
					<div class="alert alert-success" role="alert">
						<h4>TODO List Management Web Application</h4>
					</div>
				</div>
			</div>


			<div class="row">
				<div class="col-md-8 col-md-offset-2">
					<div class="input-group">
						<input type="text" class="form-control" id="txtNewItem" placeholder="Description of New Item">
						<span class="input-group-btn">
							<button class="btn btn-primary" id="addButton" onclick="insertItem();" type="button">Add New</button>
						</span>
					</div>

					<div style="margin-top: 32px ;">
						<input type="checkbox" id="filter" name="filter" value="no">
						<label for="filter">Filter: Show only done items</label><br>
					</div>
				</div>
			</div>


			<div class="row" style="margin-top: 8px;">
				<div id="list" class="col-md-8 col-md-offset-2">

					<table class="table" id="todoListTable">

						<thead>

							<th class="col">ID</th>
							<th class="col">Status</th>
							<th class="col">Title</th>
							<th class="col">
								<div class="pull-right">Action</div>
							</th>

						</thead>

						
						<tbody id="mytable" >

						</tbody>
					</table>

				</div>
			</div>
		</div>



	</div>

	<script src="static/home.js"></script>
</body>

</html>