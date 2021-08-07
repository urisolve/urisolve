<?php

require_once '../vendor/autoload.php';
require_once "./db-connect.php";

$new_pass = mysqli_real_escape_string($link, $_POST['new-pw']);
$new_pass_c = mysqli_real_escape_string($link, $_POST['re-new-pw']);

// $token = $_GET['resettoken'];
$token = mysqli_real_escape_string($link, $_POST['token']);

$errorCode = "";

if (empty($new_pass) || empty($new_pass_c)){
    $errorCode = "<div class='mb-2'><strong><span class='text-lead text-danger'>
                 Password must not be empty!</span></strong></div>";
}
else if ($new_pass !== $new_pass_c){
    $errorCode = "<div class='mb-2'><strong><span class='text-lead text-danger'>
                 Passwords Do Not Match!</span></strong></div>"; 
}

if( strlen($errorCode) < 2 ){
    // select email address of user from the password_resets table 
    $sql = "SELECT email FROM password_resets WHERE token='$token' LIMIT 1";
    $results = mysqli_query($link, $sql);
    $email = mysqli_fetch_assoc($results)['email'];
    if ($email) {
        $new_pass_hash = password_hash($new_pass, PASSWORD_BCRYPT);
        $sql = "UPDATE users SET password = '{$new_pass_hash}' WHERE email = '{$email}'";
        $results = mysqli_query($link, $sql);
        //header('location: http://localhost');
        if(!$results)   
            die("MySQL query failed!" . mysqli_error($link));
    

    $errorCode = "<div class='mb-2'><strong><span class='text-lead'>
                  Password Successfully Changed. </br> You may now close this page and login!</span></strong></div>";
    }
    
}

echo $errorCode;
