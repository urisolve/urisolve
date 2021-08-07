<?php


require_once '../vendor/autoload.php';
require_once './db-connect.php';


if(isset($_SESSION['loggedin'])){
    $userData['firstname']   = $_SESSION['firstname'];
    $userData['lastname']    = $_SESSION['lastname'];
    $userData['email']       = $_SESSION['email'];
    $userData['mechnr']      = $_SESSION['mechnr'];
    $userData['institution'] = $_SESSION['institution'];

    echo json_encode($userData);
}
else{
    echo $_SESSION['loggedin']; 
}
