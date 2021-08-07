<?php

// Include Files
include 'email-sender.php';
require_once '../vendor/autoload.php';
require_once "./db-connect.php";


// Form server-side validation
if(!empty($_POST['email']) && (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) === false)){

    $email = $_POST['email'];

    // Check if email exists
    $emailQuery = mysqli_query($link, "SELECT * FROM users WHERE email = '{$email}' ");
    $rowCount = mysqli_num_rows($emailQuery);

    $errorCodes['emailNotFound'] = false;
    if($rowCount <= 0){
        $emailExist = true;
        $errorCodes['emailNotFound'] = $emailExist;
    }

    else{
        $_email = mysqli_real_escape_string($link, $email);

        // Generate random reset token
        $reset_token = md5(rand().time());

        // Remove pre-existent email in password recovery
        $deleteQuery = "DELETE FROM password_resets WHERE email = '{$email}' ";
        $sqlQuery = mysqli_query($link, $deleteQuery);

        // Query insertion
        $resetQuery = "INSERT INTO password_resets (email, token, token_date) 
                        VALUES ('{$email}', '{$reset_token}', now())";

        // Create mysql query
        $sqlQuery = mysqli_query($link, $resetQuery);

        if(!$sqlQuery){
        die("MySQL query failed!" . mysqli_error($link));
        }
        
        // Send Reset Email
        $message = createHTMLemail('', $reset_token, 1);
        sendEmail($email, $message,"Password Reset Request");
    }

    echo json_encode($errorCodes);
}