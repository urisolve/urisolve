<?php

require_once '../vendor/autoload.php';
require_once './db-connect.php';


if(isset($_SESSION['loggedin'])){
    $infoCodes = array();
    $email = $_SESSION['email'];

    if(!empty($_POST['edit-first-name']) && ($_POST['edit-first-name'] != $_SESSION['firstname']) ){
        $firstname = mysqli_real_escape_string($link, $_POST['edit-first-name']);
        $sql = "UPDATE users SET first_name = '{$firstname}' WHERE email = '{$email}'";
        $result = mysqli_query($link, $sql);
        if(!$result)   
            die("MySQL query failed!" . mysqli_error($link));
        array_push($infoCodes,"First Name Changed");
    }

    if(!empty($_POST['edit-last-name']) && ($_POST['edit-last-name'] != $_SESSION['lastname'])){
        $lastname = mysqli_real_escape_string($link, $_POST['edit-last-name']);
        $sql = "UPDATE users SET last_name = '{$lastname}' WHERE email = '{$email}'";
        $result = mysqli_query($link, $sql);
        if(!$result)   
            die("MySQL query failed!" . mysqli_error($link));
        array_push($infoCodes,"Last Name Changed");
    }

    if(!empty($_POST['edit-mech-nr']) && ($_POST['edit-mech-nr'] != $_SESSION['mechnr'])){
        $mechnr = mysqli_real_escape_string($link, $_POST['edit-mech-nr']);
        $sql = "UPDATE users SET mech_nr = '{$mechnr}' WHERE email = '{$email}'";
        $result = mysqli_query($link, $sql);
        if(!$result)   
            die("MySQL query failed!" . mysqli_error($link));
        array_push($infoCodes,"Mech Nr Changed");
    }

    if(!empty($_POST['edit-institution']) && ($_POST['edit-institution'] != $_SESSION['institution'])){
        $institution = mysqli_real_escape_string($link, $_POST['edit-institution']);
        $sql = "UPDATE users SET institution = '{$institution}' WHERE email = '{$email}'";
        $result = mysqli_query($link, $sql);
        if(!$result)   
            die("MySQL query failed!" . mysqli_error($link));
        array_push($infoCodes,"Institution Changed");
    }

    echo json_encode($infoCodes);

}
else{
    echo false; 
}


?>