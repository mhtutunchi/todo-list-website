<?php

/*
    the MySql database connection that will be used in api.php and index.php
*/
$host="localhost";
$user="root";
$password="m123456";
$database="mydb";

$conn = mysqli_connect($host,$user,$password,$database);
if (mysqli_connect_errno())
{
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}
  
?>