function analyseCircuit(analysismet) {
    loadingModalResults();
    switch (analysismet) {
        case "MTN":
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
        break;
        case "MCR":
            setTimeout(function() {
                let retriesNumber = 5;
                let successFlag = false;
                for (let i = 0; i < retriesNumber; i++) {
                    try {
                        loadFileAsTextMCR();
                        successFlag = true;
                    } catch (error) {
                        console.log("Error in MCR: " + error);
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
        break;
        case "MCM":
            setTimeout(function() {
                let retriesNumber = 5;
                let successFlag = false;
                for (let i = 0; i < retriesNumber; i++) {
                    try {
                        loadFileAsTextMCM();
                        successFlag = true;
                    } catch (error) {
                        console.log("Error in MCM: " + error);
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
        break;
        default:
            $("#loadpage").hide();
            alert('Please select a valid analysis method.');
        break;
    }
};