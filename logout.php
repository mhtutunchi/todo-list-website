<?php
session_start();
// Destroying All Sessions
if(session_destroy())
{
// Redirecting To Login Page
header("Location: index.php");
}
?> 
