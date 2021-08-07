<!DOCTYPE html>
<html lang="en-US">

<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title>Password Reset</title>
<meta http-equiv="x-ua-compatible" content="ie=edge">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

<link rel="stylesheet" href="../vendor/fontawesome/css/all.min.css">
<link rel="stylesheet" href="../css/bootstrap-toggle.min.css">
<link rel="stylesheet" href="../css/bootstrap-select.min.css">
<link rel="stylesheet" href="../css/login-register.css">
<link rel="stylesheet" href="../css/app.css">
<link rel="stylesheet" href="../css/ldld.min.css"/>

<script src="../js/jquery.min.js"></script>
<script src="../js/bootstrap-toggle.min.js"></script>
<script src="../js/bootstrap.min.js"></script>
<script src="../js/ldld.min.js"></script>

</head>
<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">

<div class="w-100" style="height: 400px; background-color: #c13240;"></div>    

<!-- MODAL LOGIN ==============-->
<div class="modal fade login" id="reset-modal">
    <div class="modal-dialog login animated">
        <div class="modal-content">
            <div class="modal-header">
                    <h4 class="modal-title text-center"><span> Password Reset</span></h4>
            </div>
            <div class="modal-body">
                <div class="box">
                    <div class="content">
                        <div class="social">
                        <img src="../img/logo_350px.png" alt="" class="img-fluid" style="max-width: 200px;" id="login-logo">
                        </div>
                        <span id="inbox-text" class="text-black-50"> Reset your password below</span>
                        <div class="division">
                            <div class="line l"></div>
                            <span>&nbsp;</span>
                            <div class="line r"></div>
                        </div>
                        <!-- Login Box -->
                        <div class="form pwResetBox">
                        <!-- </?php echo $_GET['resettoken'];?> -->
                            <!-- <form action="password-reset.php?resettoken=" id="reset-pw" method="POST" accept-charset="UTF-8"> -->
                            <form action="javascript:void(0);" id="reset-pw" method="POST" accept-charset="UTF-8" class="submitForm">
                            <div style="width: 100%;">
                                <i class="fas fa-lock pt-3 pl-2" style="position: absolute;"></i>
                                <input id="new-pw" class="form-control" type="password" placeholder="Password" name="new-pw" minlength="4" maxlength="16" required>
                            </div>
                            <div style="width: 100%;">
                                <i class="fas fa-lock pt-3 pl-2" style="position: absolute;"></i>
                                <input id="re-new-pw" class="form-control" type="password" placeholder="Repeat Password" name="re-new-pw" minlength="4" maxlength="16" onkeyup="validateNewPw(); return false;" required>
                            </div>
                            <input type="hidden" name="token" value="<?php echo $_GET['resettoken'];?>" />
                            <div id="statusMsg"></div>
                            <button type="submit" class="btn btn-default btn-login" name="newPwButton" id="newPwButton">
                                <span>Reset Password</span>
                                <div class="ldld bare em-1 dark d-inline-block ml-1 align-middle" id="resetLoader"></div>
                            </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
                
            <div class="modal-footer">
                <div class="forgot register-footer">
                    <span>The U=RIsolve Team</span>
                    
                </div>
            </div>
        </div>
    </div>
</div>


<!-- Show Modal -->
<script type="text/javascript">
    $(window).on('load',function(){
        $('#reset-modal').modal('show');
        
    });
    
    $("#reset-modal").modal({
            backdrop: 'static',
            keyboard: false
        });
</script>

<script type="text/javascript">
    $("#reset-pw").submit(function(event){
        let ldld = new ldLoader({ root: "#resetLoader" }); 
        ldld.on();
        event.preventDefault();
        var $form = $(this);
        var serializedData = $form.serialize();
        request = $.ajax({
            url: './password-reset.php',
            type: 'post',
            data: serializedData,
        }); 

        request.done(function (response, textStatus, jqXHR){
            // Log a message to the console
            console.log(response);
            $("#statusMsg").html(response);
            if(response.includes("Successfully Changed")){
                $("#newPwButton").prop('disabled', true);
                $("#new-pw").prop('disabled', true);
                $("#re-new-pw").prop('disabled', true);
                $('#newPwButton').addClass('noHover');
            }
            ldld.off();
        });
        return(false);
    });

</script>

<!-- Validate Password -->
<script type="text/javascript">
function validateNewPw(){
    let pw1 = document.getElementById('new-pw');
    let pw2 = document.getElementById('re-new-pw');
    let msg = document.getElementById('statusMsg');

    let success = "#28a745";
    let error   = "#cc330d";
    let successMsg = "<div class='mb-2'><strong><span class='text-lead'>Passwords Match</span></strong></div>";
    let errorMsg = "<div class='mb-2'><strong><span class='text-lead'>Passwords Do Not Match!</span></strong></div>";

    if(pw1.value == pw2.value){
        pw2.style.backgroundColor = "#0296237d";
        msg.style.color = success;
        msg.innerHTML = successMsg;
        return true;
    }
    else{
        pw2.style.backgroundColor = "#de263787";
        msg.style.color = error;
        msg.innerHTML = errorMsg;
        return false;
    }
}
</script>

<script src="../js/jquery.easing.min.js"></script>

</body>
</html>