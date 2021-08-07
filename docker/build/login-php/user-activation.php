<?php include('./user-validation.php'); ?>

<!DOCTYPE html>
<html>
<!-- colors:  FFA73B / 2A6F2A / 950404-->
<head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <style type="text/css">
        @media screen {
            @font-face {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 400;
                src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 700;
                src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: italic;
                font-weight: 400;
                src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: italic;
                font-weight: 700;
                src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
            }
        }

        /* CLIENT-SPECIFIC STYLES */
        body,
        table,
        td,
        a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table,
        td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        img {
            -ms-interpolation-mode: bicubic;
        }

        /* RESET STYLES */
        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }

        table {
            border-collapse: collapse !important;
        }

        body {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
        }

        /* iOS BLUE LINKS */
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        /* MOBILE STYLES */
        @media screen and (max-width:600px) {
            h1 {
                font-size: 32px !important;
                line-height: 32px !important;
            }
        }

        /* ANDROID CENTER FIX */
        div[style*="margin: 16px 0;"] {
            margin: 0 !important;
        }
    </style>
</head>

<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
    <!-- HIDDEN PREHEADER TEXT -->
    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"></div>
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <!-- LOGO -->
        <tr>
            <td bgcolor="#c13240" align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#c13240" align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 700px;">
                    <tr>
                        <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                            <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Validation status</h1> <img src="../img/logo_350px.png" width="200" style="display: block; border: 0px;" />
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 700px;">
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;">Your U=RIsolve account confirmation status is shown below.</p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 50px 30px;">
                                        <table border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                            <?php echo $buttonMsg; ?>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr> <!-- COPY -->
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                        <?php echo $activationMsg; ?>
                        </td>
                    </tr> <!-- COPY -->
                    <tr>
                        <td bgcolor="#ffffff" align="left" height="10" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <tr>
                            <td bgcolor="#ffffff" height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td align="center" bgcolor="#ffffff">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td>
                                            <table border="0" align="left" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                                                <tr>
                                                    <td align="left" style="padding-left: 20px;">
                                                        <a href="https://urisolve.pt" style="display: block; border-style: none !important; border: 0 !important;"><img width="120" border="0" style="display: block; width: 100px;" src="../img/logo_350px.png" alt="" /></a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                      <td align="left" style="padding-left: 20px;">
                                                    <a href="https://urisolve.pt:" style="color: #888888; font-size: 14px; font-family: 'Hind Siliguri', Calibri, Sans-serif; font-weight: 400;">www.urisolve.pt</a>
                                                  </td>
                                                </tr>
                
                                            </table>
                                            <table border="0" align="right" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                                                <tr>
                                                    <td style="color: #888888; font-size: 14px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 23px; padding-right: 20px;"
                                                        class="text_color">
                                                        <div style="color: #333333; font-size: 14px; font-family: 'Work Sans', Calibri, sans-serif; font-weight: 600; line-height: 23px;">
                                                            Best grades, <br/> <a style="color: #888888; font-size: 14px; font-family: 'Hind Siliguri', Calibri, Sans-serif; font-weight: 400;">The U=RIsolve Team</a>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="left" style="color: #888888; font-size: 14px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 23px;"
                                                        class="text_color">
                                                        <div style="color: #333333; font-size: 14px; font-family: 'Work Sans', Calibri, sans-serif; font-weight: 600; line-height: 23px;">
                                                            Email us: <br/> <a href="mailto:" style="color: #888888; font-size: 14px; font-family: 'Hind Siliguri', Calibri, Sans-serif; font-weight: 400;">info@urisolve.pt</a>
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
                    </tr>
                    
                </table>
            </td>
        </tr>
        <tr>
</body>

</html>