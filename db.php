<?php

$conn = mysqli_connect("localhost","root","m123456","mydb");
if (mysqli_connect_errno())
{
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}
  
?>