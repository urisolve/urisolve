<?php

require_once("{$_SERVER['DOCUMENT_ROOT']}/router.php");

// ## Static GET
get('/', 'index.php');

// ## Dynamic GET using 1 variable
// The $id will be available in user.php
get('/circuit/$id', 'circuit.php');

// ## Dynamic GET using 2 variables
// Both $method and $netlist will be available in academy.php
get('/academy/$method/$netlist', 'academy.php');

// ## Dynamic GET using 2 variables with static
// In the URL -> http://domain/circuit/analyse/method/mtn
// Both $analyse and $method will be available in analyse.php
get('/circuit/$analyse/method/:mtn', 'analyse.php');

// ## ANY method stands for GETs or POSTs
// The error.php has access to $_GET and $_POST
any('/error','views/error.php');