<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once './vendor/autoload.php';

use FormGuide\Handlx\FormHandler;


$pp = new FormHandler();

$validator = $pp->getValidator();
$validator->fields(['name','email'])->areRequired()->maxLength(50);
$validator->field('email')->isEmail();
$validator->field('message')->maxLength(6000);

$mailer = $pp->getMailer();
$mailer->CharSet = 'UTF-8';
$mailer->IsSMTP();
$mailer->SMTPAuth = true;
$mailer->SMTPSecure = 'tls';
$mailer->Host = "smtp.gmail.com";
$mailer->Mailer = "smtp2";
$mailer->Port = 587;
$mailer->Username = "email@gmail.com";
$mailer->Password = "emailpass";

$mailer->setFrom('sender@gmail.com', 'Contacto via URIsolve');

// Add Multiple Recipients
$pp->sendEmailTo('email1@domain.com');
$pp->sendEmailTo('email2@domain.com');
echo $pp->process($_POST);