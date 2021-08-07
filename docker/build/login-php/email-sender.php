<?php
require_once "../vendor/phpmailer/phpmailer/class.phpmailer.php";

global $mailSentStatus;

function sendEmail(string $email, string $message, string $subject){
    // php mailer code starts
    $mail = new PHPMailer(true);
    // telling the class to use SMTP
    $mail->IsSMTP();
    // enable SMTP authentication
    $mail->SMTPAuth = true;   
    // sets the prefix to the server
    $mail->SMTPSecure = "ssl"; 
    // sets GMAIL as the SMTP server
    $mail->Host = "cpanel23.dnscpanel.com"; 
    // set the SMTP port
    $mail->Port = 465; 
    // set your username here
    $mail->Username = 'noreply@urisolve.pt';
    $mail->Password = 'secret';
    // set subject
    $mail->Subject = $subject;
    // sending mail from
    $mail->SetFrom('noreply@urisolve.pt', 'U=RIsolve Team');
    // add logo
    $mail->addEmbeddedImage('../img/logo_350px.png', 'uri_logo');
    // sending to
    $mail->AddAddress($email);
    // set the message
    $mail->MsgHTML($message);

    try {
        $mail->send();
        //print_r("<br> Mail Sent !<br>");
        $mailSentStatus = 1;
    } 
    catch (Exception $ex) {
        echo $msg = $ex->getMessage();
        $mailSentStatus = -1;
     }
}

function createHTMLemail($name, $token, $reset){
    $emailUrl = $title = $description = $text = $button = $greeting = $hello = '';

    if($reset == 0){
        $emailUrl = 'https://urisolve.pt/app/login-php/user-activation.php?token='.$token;
        $title = 'Welcome to U=RIsolve Simulator, <span style="color: #be202f;">'.$name.'</span>';
        $description = 'Thank you for joining U=RIsolve.';
        $text = 'Please verify your e-mail address using the link below.';
        $button = 'VERIFY ACCOUNT';
        $greeting = 'Welcome to U=RIsolve!';
        $hello = 'Hi '.$name.',';
    }
    else if($reset == 1){
        $emailUrl = 'https://urisolve.pt/app/login-php/pw-reset-page.php?resettoken='.$token;
        $title = 'Your password reset request';
        $description = 'You recently requested to reset your U=RIsolve password.';
        $text = 'Use the button below to reset it.';
        $button = 'RESET PASSWORD';
        $greeting = '';
        $hello = 'Greetings,';
    }
    
    $emailMsg = '<!DOCTYPE html>
    <html>
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <link href="https://fonts.googleapis.com/css?family=Work+Sans:300,400,500,600,700" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Quicksand:300,400,700" rel="stylesheet">
    <title>U=RIsolve Team</title>
    <style type="text/css">
        body {
            width: 100%;
            background-color: #ffffff;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
            mso-margin-top-alt: 0px;
            mso-margin-bottom-alt: 0px;
            mso-padding-alt: 0px 0px 0px 0px;
        }
        p, h1, h2, h3, h4 {
            margin-top: 0;
            margin-bottom: 0;
            padding-top: 0;
            padding-bottom: 0;
        }
        span.preheader {display: none; font-size: 1px;}
        html {width: 100%;}
        table {font-size: 14px; border: 0;}
        @media only screen and (max-width: 640px) {
            .main-header {font-size: 20px !important;}
            .main-section-header {font-size: 28px !important;}
            .show {display: block !important;}
            .hide {display: none !important;}
            .align-center {text-align: center !important;}
            .no-bg {background: none !important;}
            .main-image img {width: 440px !important; height: auto !important;}
            .divider img {width: 440px !important;}
            .container590 {width: 440px !important;}
            .container580 {width: 400px !important;}
            .main-button {width: 220px !important;}
            .section-img img {width: 320px !important;height: auto !important;}
            .team-img img {width: 100% !important;height: auto !important;}
        }
        @media only screen and (max-width: 479px) {
            .main-header { font-size: 18px !important;}
            .main-section-header {font-size: 26px !important;}
            .divider img {width: 280px !important;}
            .container590 {width: 280px !important;}
            .container580 {width: 260px !important;}
            .section-img img {width: 280px !important; height: auto !important;}
        }
    </style>
</head>
<body class="respond" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
    <table style="display:none!important;">
        <tr>
            <td>
                <div style="overflow:hidden;display:none;font-size:1px;color:#ffffff;line-height:1px;font-family:Arial;maxheight:0px;max-width:0px;opacity:0;">
                    '.$greeting.'
                </div>
            </td>
        </tr>
    </table>
    <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff">
        <tr>
            <td align="center">
                <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590">
                    <tr>
                        <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td align="center">
                            <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590">
                                <tr>
                                    <td align="center" height="70" style="height:70px;">
                                        <a href="https://urisolve.pt" style="display: block; border-style: none !important; border: 0 !important;"><img width="200" border="0" style="display: block; width: 200px;" src="cid:uri_logo" alt="" /></a>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <table width="360 " border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"
                                            class="container590 hide">
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff" class="bg_color">
        <tr>
            <td align="center">
                <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590">
                    <tr>
                        <td align="center" style="color: #343434; font-size: 24px; font-family: Quicksand, Calibri, sans-serif; font-weight:700;letter-spacing: 3px; line-height: 35px;"
                            class="main-header">
                            <div style="line-height: 35px">
                                '.$title.'
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td align="center">
                            <table border="0" width="40" align="center" cellpadding="0" cellspacing="0" bgcolor="eeeeee">
                                <tr>
                                    <td height="2" style="font-size: 2px; line-height: 2px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td align="left">
                            <table border="0" width="590" align="center" cellpadding="0" cellspacing="0" class="container590">
                                <tr>
                                    <td align="left" style="color: #888888; font-size: 16px; font-family: '. "'Work Sans'".', Calibri, sans-serif; line-height: 24px;">
                                        <p style="line-height: 24px; margin-bottom:20px;">
                                            '.$hello.'
                                        </p>
                                        <p style="line-height: 24px;">
                                            '.$description.'
                                        </p>
                                        <p style="line-height: 24px;margin-bottom:25px;">
                                            '.$text.'
                                        </p>
                                        <table border="0" align="center" width="180" cellpadding="0" cellspacing="0" bgcolor="be202f" style="margin-bottom:20px;">
                                            <tr>
                                                <td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td align="center" style="color: #ffffff; font-size: 14px; font-family:'. "'Work Sans'".', Calibri, sans-serif; line-height: 22px; letter-spacing: 2px;">
                                                    <div style="line-height: 22px;">
                                                        <a href="'.$emailUrl.'" style="color: #ffffff; text-decoration: none;">'.$button.'</a>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td>
                                            </tr>
                                        </table>
                                        <p style="line-height: 24px">
                                            Best grades,</br>
                                        </p>
                                        <p style="line-height: 24px;">
                                            The U=RIsolve Team
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
        </tr>
    </table>
    <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="f4f4f4">
        <tr>
            <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
        </tr>
        <tr>
            <td align="center">
                <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590">
                    <tr>
                        <td>
                            <table border="0" align="left" cellpadding="0" cellspacing="0" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"
                                class="container590">
                                <tr>
                                    <td align="left">
                                        <a href="https://urisolve.pt" style="display: block; border-style: none !important; border: 0 !important;"><img width="120" border="0" style="display: block; width: 100px;" src="cid:uri_logo" alt="" /></a>
                                    </td>
                                </tr>
                                <tr>
            						<td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td>
        						</tr>
                                <tr>
                               	   <td align="left">
                                    <a href="https://urisolve.pt" style="color: #888888; font-size: 14px; font-family:'. "'Hind Siliguri'".', Calibri, Sans-serif; font-weight: 400;">www.urisolve.pt</a>
                                  </td>
                                </tr>
							</table>
                            <table border="0" align="right" cellpadding="0" cellspacing="0" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"
                                class="container590">
                                <tr>
            						<td height="40" style="font-size: 40px; line-height: 40px;">&nbsp;</td>
        						</tr>
                                <tr>
                                    <td align="left" style="color: #888888; font-size: 14px; font-family: '. "'Work Sans'".', Calibri, sans-serif; line-height: 23px;"
                                        class="text_color">
                                        <div style="color: #333333; font-size: 14px; font-family: '. "'Work Sans'".', Calibri, sans-serif; font-weight: 600; mso-line-height-rule: exactly; line-height: 23px;">
                                            E-mail us:<br/> <a href="mailto:" style="color: #888888; font-size: 14px; font-family:'. "'Hind Siliguri'".', Calibri, Sans-serif; font-weight: 400;">info@urisolve.pt</a>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
        </tr>
    </table>
</body>
</html>    
';

return $emailMsg;

}