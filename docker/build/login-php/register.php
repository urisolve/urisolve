<?php

// Include Files
include 'email-sender.php';
require_once '../vendor/autoload.php';
require_once "./db-connect.php";


// Status Messages
global $errorCodes, $emailExist, $fnameErr, $lnameErr, $emailErr, $mechErr, $instErr, $pwErr;

// Form server-side validation
if(!empty($_POST['email']) && !empty($_POST['mech-nr']) && 
   !empty($_POST['first-name']) && !empty($_POST['last-name']) && 
  (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) === false) && 
   !empty($_POST['password']) && ($_POST['password'] == $_POST['re-pass'])){

    // Define and initialize variables
    $email       = $_POST['email'];
    $firstname   = $_POST['first-name'];
    $lastname    = $_POST['last-name'];
    $mech        = $_POST['mech-nr'];
    $institution = $_POST['institution'];
    $password    = $_POST['password'];

    // Check if email exists
    $emailQuery = mysqli_query($link, "SELECT * FROM users WHERE email = '{$email}' ");
    $rowCount = mysqli_num_rows($emailQuery);

    if($rowCount > 0){
      $emailExist = "<div><strong><span class='text-lead text-danger mt-2 mb-2'>E-mail already exists!</span></strong></div>";
      $errorCodes['emailExistEn'] = $emailExist;
      $emailExist = "<div><strong><span class='text-lead text-danger mt-2 mb-2'>O e-mail fornecido já existe!</span></strong></div>";
      $errorCodes['emailExistPt'] = $emailExist;
    }

    else{
      // Clean the form data before sending to database
      $_first_name = mysqli_real_escape_string($link, $firstname);
      $_last_name = mysqli_real_escape_string($link, $lastname);
      $_email = mysqli_real_escape_string($link, $email);
      $_mech = mysqli_real_escape_string($link, $mech);
      $_institution = mysqli_real_escape_string($link, $institution);
      $_password = mysqli_real_escape_string($link, $password);

      // perform validation
      if(!preg_match("/^[a-zA-Z ]*$/", $_first_name)) {
        $fnameErr = "<div><strong><span class='text-lead text-danger'>
                      Only letters and white space allowed (first name).
                      </span></strong></div>";
        $errorCodes['firstNameErr'] = $fnameErr;
      }
      if(!preg_match("/^[a-zA-Z ]*$/", $_last_name)) {
        $lnameErr = "<div><strong><span class='text-lead text-danger'>
                      Only letters and white space allowed (last name).
                      </span></strong></div>";
        $errorCodes['lastNameErr'] = $lnameErr;
      }
      if(!preg_match("/^[a-zA-Z ]*$/", $_institution)) {
        $instErr = "<div><strong><span class='text-lead text-danger'>
                      Only letters and white space allowed (institution).
                      </span></strong></div>";
        $errorCodes['institutionErr'] = $instErr;
      }
      if(!filter_var($_email, FILTER_VALIDATE_EMAIL)) {
          $emailErr= "<div><strong><span class='text-lead text-danger'>
                        Email format is invalid.
                        </span></strong></div>";
          $errorCodes['emailErr'] = $emailErr;
      }
      if(!preg_match("/^[0-9]{5,10}+$/", $_mech)) {
          $mechErr = "<div><strong><span class='text-lead text-danger'>
                        Only numbers of 10-digit max allowed.
                        </span></strong></div>";
          $errorCodes['numberErr'] = $mechErr;
      }
      // TODO: password validation (actual: 4 - 16 chars / change to 6-10?)

      // Generate random activation token
      $token = md5(rand().time());

      // Password hash
      $password_hash = password_hash($password, PASSWORD_BCRYPT);

      // Query insertion
      $insertQuery = "INSERT INTO users (email, first_name, last_name, mech_nr, institution, password, token, status, join_date,
      nvm_sim, mcm_sim, bcm_sim, total_sim) VALUES ('{$email}', '{$firstname}', '{$lastname}', '{$mech}', '{$institution}', 
      '{$password_hash}', '{$token}', '0', now(), '0', '0', '0', '0')";

      // Create mysql query
      $sqlQuery = mysqli_query($link, $insertQuery);

      if(!$sqlQuery){
        die("MySQL query failed!" . mysqli_error($link));
      } 
    
      // Success
      if($sqlQuery) {
        //print_r("MySQL query succeeded! <br>");
      }

      $message = createHTMLemail($firstname, $token, 0);
      sendEmail($email, $message,"Email Verification");
    }

    echo json_encode($errorCodes);
    
    //var_dump($email, $firstname, $lastname, $mech, $institution, $password);

  }