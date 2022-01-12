<?php

/*
    the Api endpoints to communnicate between web application and database
*/

require_once 'db.php';
$action = $_GET["action"];
header('Content-Type: application/json; charset=utf-8');

if ($action == 'get') // Read TODOs from database
{
    $userid = $_GET["userid"];

    $query = "SELECT * FROM todo WHERE author={$userid}";

    if (isset($_GET["search"])) {
        $s = strval($_GET["search"]);
        $query .= " and description LIKE '%{$s}%'";
    }
    if (isset($_GET["filter"])) {
        $query .= " and status=1";
    }

    $result = mysqli_query($conn, $query);

    $rows = array();
    while ($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print json_encode($rows);

} else if ($action == 'insert') // Create a TODO in database
{
    $userid = $_GET["userid"];
    $desc=$_GET['desc'];

    if(mysqli_query($conn,"INSERT INTO todo(description,author) VALUES ('{$desc}', '{$userid}')")){
        $response_array['status']="success";
    }else {
        $response_array['status']="error";
    }
    print json_encode($response_array);
} 

else if ($action == 'edit') // Update a TODO in database
{
    $id = $_GET["id"];
    
    $new_status = $_GET["new_status"];

    $new_data="status={$new_status}";
    
    if (isset($_GET["new_desc"])){
        $new_desc = $_GET["new_desc"];
        $new_data .=", description='{$new_desc}'";
    }

    if(mysqli_query($conn,"UPDATE todo SET {$new_data} WHERE id={$id}")){
        $response_array['status']="success";
    }else {
        $response_array['status']="error";
    }
    print json_encode($response_array);
}
if ($action == 'delete') // Delete a TODO from database
{
    $id = $_GET["id"];
    if(mysqli_query($conn,"DELETE FROM todo WHERE id={$id}")){
        $response_array['status']="success";
    }else {
        $response_array['status']="error";
    }
    print json_encode($response_array);
}




