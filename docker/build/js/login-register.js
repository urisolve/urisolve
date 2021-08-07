/*
 * login-register modal
 * Form validation methods
 */


/**
 * Register Form fields submit
 * After form submited: display response to users
 */
$(function()
{
    function after_form_submitted(data){
        console.log(data);
        let ldld = new ldLoader({ root: "#registerLoader" });
        let errCodes = {}; 
        if(data != "null" && data != null)
            errCodes = JSON.parse(data);
        // Check if user exists - Output PT
        if(!errCodes.hasOwnProperty('emailExistPt')){
            errCodes.emailExistPt = '';
            errCodes.emailExistEn = '';
        }
        if(document.getElementById("lang-sel-txt").innerText.toLowerCase() == "português"){

            if(errCodes.emailExistPt.length > 0){
                ldld.off(); 
                $('#form-error-message').html(errCodes.emailExistPt);  
                $('.modal-title').html('Utilizador existente'); 
                $("#recover-button").attr('value', 'Recuperar Password');
                
                $('.loginBox, .registerBox, .resetPWBox').hide()
                $('#inbox-text').hide();
                $('#register-text').hide();

                $('.resetBox').show();
                $('#login-logo').show();
                
                $('.register-footer, .reset-footer').hide();
                $('.login-footer').show();
            }
            else{
                ldld.off(); 
                $('.modal-title').html('Verifique o e-mail');
                $('.loginBox, .registerBox, .resetBox, .resetPWBox').hide()
                $('#register-text').hide();
                $('#inbox-text').show();
                $('#login-logo').show();     
            }
        }
        else{
            // Check if user exists - Output EN
            if(errCodes.emailExistEn.length > 0){ 
                ldld.off(); 
                $('#form-error-message').html(errCodes.emailExistEn);  
                $('.modal-title').html('User registered'); 
                $("#recover-button").attr('value', 'Recover Password');

                $('.loginBox, .registerBox, .resetPWBox').hide()
                $('#inbox-text').hide();
                $('#register-text').hide();
               
                $('.resetBox').show();
                $('#login-logo').show();

                $('.register-footer, .reset-footer').hide();
                $('.login-footer').show();
            }
            else{
                ldld.off();
                $('.modal-title').html('Check your e-mail');
                $('.loginBox, .registerBox, .resetBox, .resetPWBox').hide()
                $('#register-text').hide();
                $('#inbox-text').show();
                $('#login-logo').show();
            }
        }
        document.getElementById("register-form").reset();
    }

    $('#register-form').submit(function(e){
        let ldld = new ldLoader({ root: "#registerLoader" }); 
		ldld.on();
        e.preventDefault();
        $form = $(this);
        // Send to PHP
        $.ajax({
            type: "POST",
            url: './login-php/register.php',
            data: $form.serialize(),
            success: after_form_submitted,
            error: function(e){
                console.log(e);
                },
        }); 
        
    });

});

/**
 * Reset Form email submit
 * After reset submited: display response to users
 */
$(function()
{
    function after_reset_submitted(data){
        console.log(data);
        let ldld = new ldLoader({ root: "#resetLoader" }); 
        ldld.off();
        let errCodes = JSON.parse(data);
        if(errCodes.emailNotFound){
            let errorMsg = '';
            if(document.getElementById("lang-sel-txt").innerText.toLowerCase() == "português"){
                errorMsg  = "<div><strong><span class='text-lead text-danger mt-2 mb-2'>";
                errorMsg += "E-mail não registado!</span></strong></div>";
            }
            else{
                errorMsg  = "<div><strong><span class='text-lead text-danger mt-2 mb-2'>";
                errorMsg += "E-mail not found!</span></strong></div>";
            }
            $('#newPwConfirm').html(errorMsg);
        }
        else{
            let successMsg = "";
            if(document.getElementById("lang-sel-txt").innerText.toLowerCase() == "português"){
                successMsg  = "<div><strong><span class='text-lead text-success mt-2 mb-2'>";
                successMsg += "E-mail enviado, verifique a caixa de correio.</span></strong></div>";
            }
            else{
                successMsg  = "<div><strong><span class='text-lead text-success mt-2 mb-2'>";
                successMsg += "E-mail sent, please check your inbox.</span></strong></div>";
            }
            $('#newPwConfirm').html(successMsg);
        }
                 
    }

    $('#reset-data').submit(function(e){
        let ldld = new ldLoader({ root: "#resetLoader" }); 
        ldld.on();
        $('#newPwConfirm').html('');
        e.preventDefault();
        $form = $(this);
        // Send to PHP
        $.ajax({
            type: "POST",
            url: './login-php/reset-request.php',
            data: $form.serialize(),
            success: after_reset_submitted,
            error: function(e){
                console.log(e);
                },
        }); 
        
    });

});


/**
 * Login form submit
 * After login submited: display response to users
 */
$(function()
{
    function after_login_submitted(data){
        //console.log(data);
        let ldld = new ldLoader({ root: "#loginLoader" }); 
        ldld.off();
        let errorCodes = JSON.parse(data);
        let errorMsg = "<div><strong><span class='text-lead text-danger mt-2 mb-2'>";
        if(errorCodes.length == 0){
            sessionStorage.setItem('status','loggedIn') 
            console.log("Login Successfull");
            window.location.href = "http://localhost";
        }
        if (errorCodes.length > 0 && errorCodes.length < 6){
            console.log("Login Failed");
            if(document.getElementById("lang-sel-txt").innerText.toLowerCase() == "português"){
                for(let i = 0; i< errorCodes.length; i++){
                    switch (errorCodes[i]) {
                        case 1:
                            errorMsg += "Conta de utilizador não existente."
                            break;

                        case 2:
                            errorMsg += "E-mail ou password incorretos."
                            break;

                        case 3:
                            errorMsg += "Conta de utilizador não verificada."
                            break;

                        case 4:
                            errorMsg += "Por favor preencha o e-mail corretamente."
                            break;

                        case 5:
                            errorMsg += "Por favor digite a sua password." 
                            break;
                    }
                }
            }
            else{
                for(let i = 0; i< errorCodes.length; i++){
                    switch (errorCodes[i]) {
                        case 1:
                            errorMsg += "User account does not exist."
                            break;

                        case 2:
                            errorMsg += "Either e-mail or password is incorrect."
                            break;

                        case 3:
                            errorMsg += "Account not yet verified."
                            break;

                        case 4:
                            errorMsg += "Email not provided."
                            break;

                        case 5:
                            errorMsg += "Password not provided." 
                            break;
                    }
                }
            }
        }

        errorMsg += "</span></strong></div>";
        $('#loginMessage').html(errorMsg);       
    }

    $('#login-form').submit(function(e){
        let ldld = new ldLoader({ root: "#loginLoader" }); 
        ldld.on();
        $('#loginMessage').html('');
        e.preventDefault();
        $form = $(this);
        // Send to PHP
        $.ajax({
            type: "POST",
            url: './login-php/login.php',
            data: $form.serialize(),
            success: after_login_submitted,
            error: function(e){
                console.log(e);
                },
        }); 
        
    });

});


/**
 * Edit Account form submit
 * User can edit: First | last name | mech-nr |institution
 */

$(function()
{
    function after_edit_done(data){
        let ldld = new ldLoader({ root: "#editLoader" }); 
        ldld.off();
        if(data){
            let info = JSON.parse(data);
            console.log(info);
            $('#editConfirm').removeClass('hidden');
        }          
    }

    $('#edit-form').submit(function(e){
        let ldld = new ldLoader({ root: "#editLoader" }); 
        ldld.on();
        $('#editConfirm').addClass('hidden');
        e.preventDefault();
        $form = $(this);
        // Send to PHP
        $.ajax({
            type: "POST",
            url: './login-php/edit-account.php',
            data: $form.serialize(),
            success: after_edit_done,
            error: function(e){
                console.log(e);
                },
        }); 
        
    });

});

/**
 * Modals Dynamic Display
 * RegisterModal | Login Modal | Reset Modal | Logout Modal
 */

function showRegisterForm(){
    // Set Placeholders
    let regString = "Sign Up to U=RIsolve";
    if(document.getElementById("lang-sel-txt").innerText.toLowerCase() == "português"){
        regString = "Registe-se em U=RIsolve";
        $("#register-button").attr('value', 'Criar conta');
        $("#mech-nr").attr('placeholder', 'Nº Mecanográfico');
        $("#institution").attr('placeholder', 'Instituição');
        $("#re-pass").attr('placeholder', 'Repita Password');
        $("#last-name").attr('placeholder', 'Último Nome');
        $("#first-name").attr('placeholder', 'Primeiro Nome');
    }
    else{
        $("#register-button").attr('value', 'Create account');
        $("#mech-nr").attr('placeholder', 'Mechanographic Nr.');
        $("#institution").attr('placeholder', 'Institution');
        $("#re-pass").attr('placeholder', 'Repeat Password');
        $("#last-name").attr('placeholder', 'Last Name');
        $("#first-name").attr('placeholder', 'First Name');
    }

    $('.loginBox, .resetBox, .resetPWBox').hide();
    $('#login-logo').hide();
    $('.register-footer, .reset-footer').hide();
    $('#loginMessage').html('');
  
    $('.registerBox').show();
    $('.login-footer').show();
    $('.modal-title').html(regString);
    $('#register-text').show();
    $('.error').removeClass('alert alert-danger').html('');
       
}
function showLoginForm(){
    
    let welcomeString = "Welcome !";
    if(document.getElementById("lang-sel-txt").innerText.toLowerCase() == "português")
        welcomeString = "Bem vindo !";

    $('.registerBox, .resetBox, .resetPWBox').hide();
    $('#register-text').hide();
    $('#inbox-text').hide();
    $('.login-footer').hide();
    $('#loginMessage').html('');
    $('.modal-title').html(welcomeString);
    $('.loginBox').show();
    $('#login-logo').show();
    $('.reset-footer, .register-footer').show();       
    $('.error').removeClass('alert alert-danger').html(''); 
}
function showResetForm(){
    let resetString = "Reset your password";
    if(document.getElementById("lang-sel-txt").innerText.toLowerCase() == "português")
        resetString = "Redefina a sua password";
    $('.modal-title').html(resetString);

    $('.registerBox, .resetBox, .loginBox').hide();
    $('#register-text').hide();
    $('#inbox-text').hide();
    $('.register-footer, .reset-footer').hide();
    $('#loginMessage').html('');

    $('.resetPWBox').show();
    $('#login-logo').show();
    $('.login-footer').show();       

}
function openLoginModal(){
    showLoginForm();
    setTimeout(function(){
        $('#loginModal').modal('show');    
    }, 230);
}
function updateLogoutModal(fields){
    let icon ='<i class="far fa-grin ml-2"></i>';
    $("#logout-modal-title").append(fields.firstname + icon);
    $("#edit-first-name").val(fields.firstname);
    $("#edit-last-name").val(fields.lastname);
    $("#edit-mech-nr").val(fields.mechnr);
    $("#edit-institution").val(fields.institution);
}
function openLogoutModal(){
    
    $('#editConfirm').addClass('hidden');
    setTimeout(function(){
        $('#logoutModal').modal('show');    
    }, 230);
}


/**
 * 
 * Form Validation Functions
 * Email | Numbers | Text | Passwords
 * 
 */

function validateEmail(msg){

    let regMail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let email = document.getElementById(msg.split('.')[0]).value;
    if(regMail.test(email) == false){
        let spantext = "<div class='mb-2'><strong><span class='text-lead text-danger'>Invalid Email Address.</span></strong></div>";
        if(document.getElementById("lang-sel-txt").innerText.toLowerCase() == "português")
            spantext = "<div class='mb-2'><strong><span class='text-lead text-danger'>Endereço de Email inválido.</span></strong></div>";
        document.getElementById(msg.split('.')[1]).innerHTML = spantext;
        return false;
    }
    else{
        document.getElementById(msg.split('.')[1]).innerHTML = "";
        return true;
    }
    
}

function validateNrOnly(numberDOM){
    let number = numberDOM.value;
    number = number.replace(/[\\A-Za-z!"£$%^&\,*+_={};:'@#~,.Š\/<>?|`¬\]\[\s\r\n]/g,'');
    numberDOM.value = number;
    numberDOM.focus();
}

function validateTxtOnly(textDOM){
    textDOM.value = textDOM.value.replace(/[^a-zA-Z-\n\r\s]+/g, '');
    textDOM.focus();
}

function validatePW(){
    let pw1 = document.getElementById('password');
    let pw2 = document.getElementById('re-pass');
    let msg = document.getElementById('confirmMessage');

    let success = "#28a745";
    let error   = "#cc330d";
    let successMsg = "<div class='mb-2'><strong><span class='text-lead'>Passwords Match</span></strong></div>";
    let errorMsg = "<div class='mb-2'><strong><span class='text-lead'>Passwords Do Not Match!</span></strong></div>";
    
    if(document.getElementById("lang-sel-txt").innerText.toLowerCase() == "português"){
        successMsg = "<div class='mb-2'><strong><span class='text-lead'>Passwords Correspondem</span></strong></div>";
        errorMsg = "<div class='mb-2'><strong><span class='text-lead'>Passwords Não Correspondem!</span></strong></div>";
    }

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

