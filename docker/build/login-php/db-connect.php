<?php

// Database credentials
define('DB_SERVER', 'mysql-server');
define('DB_USERNAME', 'youusername');
define('DB_PASSWORD', 'secret');
define('DB_NAME', 'urisolve');
define("HTML_EOL", "<br>");
// define('DB_SERVER', 'mysql-server');
// define('DB_USERNAME', 'root');
// define('DB_PASSWORD', 'secret');
// define('DB_NAME', 'urisolve');

// Enable us to use Headers
ob_start();

// Set sessions
if(!isset($_SESSION)) {
    session_start();
}


// Connection to DB
$link = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

//echo('Trying to connect...');

if (mysqli_connect_errno()) {
   die("ERROR: Could not connect. " . mysqli_connect_error());
   //echo ' not connected';
   
}

//echo "Success: A proper connection to MySQL was made! " . HTML_EOL;
//echo "Host information: " . mysqli_get_host_info($link) . HTML_EOL;



?>