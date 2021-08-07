<?php

// Database connection
include('./db-connect.php');

// Verification Message
global $activationMsg, $buttonMsg;


// GET the token = ?token
if(!empty($_GET['token'])){
    $token = $_GET['token'];
 } else {
     $token = "";
 }

 if($token != "") {
    $tokenQuery = mysqli_query($link, "SELECT * FROM users WHERE token = '$token' ");
    $countRow = mysqli_num_rows($tokenQuery);

    if($countRow == 1){
        while($rowData = mysqli_fetch_array($tokenQuery)){
            $status = $rowData['status'];
            if($status == 0) {
                $update = mysqli_query($link, "UPDATE users SET status = '1' WHERE token = '$token' ");
                  if($update){
                    // Success
                    $buttonMsg =' <td align="center" style="border-radius: 3px;" bgcolor="#2A6F2A">
                    <a target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; 
                    color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; 
                    border-radius: 2px; border: 1px solid #2A6F2A; display: inline-block;">Successful Activation</a></td>';
                    $activationMsg = '<p style="margin: 0;">Your account has been successfully activated.</p>';
                  }
             } else {
                    // Already verified
                    $buttonMsg =' <td align="center" style="border-radius: 3px;" bgcolor="#FFA73B">
                    <a target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; 
                    color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; 
                    border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">Account Activated</a></td>';
                    $activationMsg = '<p style="margin: 0;">Your account has already been activated.</p>';
             }
       }
    }
    else{
        // Error User Doesn't exist
        $buttonMsg =' <td align="center" style="border-radius: 3px;" bgcolor="#950404">
        <a target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; 
        color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; 
        border-radius: 2px; border: 1px solid #950404; display: inline-block;">Activation Failed</a></td>';
        $activationMsg = '<p style="margin: 0;">Activation failed. User not found.</p>';
    }

 }