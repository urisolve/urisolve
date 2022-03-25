function trainChoice (){
    $("#editor_train").show();
    $("#train").show();
    $("#modal_train").modal('show');
    
}

function methodChoice (){
    $("#editor_method").show();
    $("#method").show();
    $("#modal_method").modal('show');
    
}

function analyseCircuit() {
    loadingModalResults();
                setTimeout(function() {
                let retriesNumber = 5;
                let successFlag = false;
                for (let i = 0; i < retriesNumber; i++) {
                    try {
                        loadFileAsTextMTN();
                        successFlag = true;
                    } catch (error) {
                        console.log("Error in MTN: " + error);
                        successFlag = false;
                    }
                    if (successFlag) {
                        break;
                    }
                    if(i== (retriesNumber-1)) {
                        alert("An error occurred. Please try again!");
                    }
                }
                $("#loadpage").hide();
            }, 500);
}