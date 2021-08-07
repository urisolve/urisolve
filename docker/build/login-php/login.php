<?php

/**
 * Login System
 * @return errorCodes (array)
 *  Error Code 1: Email doesnt exist
 *  Error Code 2: Invalid Email or Password
 *  Error Code 3: Account not verified
 *  Error Code 4: Email empty
 *  Error Code 5: Password empty
 */


require_once '../vendor/autoload.php';
require_once "./db-connect.php";

$errorCodes = array();
$_SESSION['loggedin'] = false;
$email_login    = $_POST['email-login'];
$password_login = $_POST['password-login'];

// clean data 
$user_email = filter_var($email_login, FILTER_SANITIZE_EMAIL);
$pswd = mysqli_real_escape_string($link, $password_login);


// Query if email exists in db
$sql = "SELECT * From users WHERE email = '{$email_login}' ";
$query = mysqli_query($link, $sql);
$rowCount = mysqli_num_rows($query);

// If query fails, show the reason 
if(!$query){
    die("SQL query failed: " . mysqli_error($link));
}

if(!empty($email_login) && !empty($password_login)){

    // Check if email exist
    if($rowCount <= 0) {
        array_push($errorCodes,1);
    }
    else{
        // Fetch user data and store in php session
        while($row = mysqli_fetch_array($query)) {
            $id            = $row['id'];
            $firstname     = $row['first_name'];
            $lastname      = $row['last_name'];
            $email         = $row['email'];
            $institution   = $row['institution'];
            $mechnr        = $row['mech_nr'];
            $pass_word     = $row['password'];
            $token         = $row['token'];
            $status        = $row['status'];
        }

        // Verify password
        $password = password_verify($password_login, $pass_word);

        // Allow only verified user
        if($status == '1') {
            if($email_login == $email && $password_login == $password) {
               $_SESSION['loggedin'] = true;
               $_SESSION['id'] = $id;
               $_SESSION['firstname'] = $firstname;
               $_SESSION['lastname'] = $lastname;
               $_SESSION['email'] = $email;
               $_SESSION['mechnr'] = $mechnr;
               $_SESSION['institution'] = $institution;
               $_SESSION['token'] = $token;
            }
            else{
                array_push($errorCodes,2);
            }
        }

        else{
            array_push($errorCodes,3);
        }
    }

}

else{
    if(empty($email_login)){
        array_push($errorCodes,4);
    }
    
    if(empty($password_login)){
        array_push($errorCodes,5);
    }            
}

echo json_encode($errorCodes);

