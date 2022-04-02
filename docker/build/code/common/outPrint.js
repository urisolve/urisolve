/**
 * Function to generate the Errors text
 * @param {array} errList error Codes
 * @returns {string} html String
 */
 function errorOutput(errList){

    // Warnings html string
    let htmlstr = '';

    // Create warning panel
    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="alert alert-danger alert-dismissible fade show">';
    // Generate Title
    htmlstr += '<h4 class="alert-heading"><i class="fas fa-exclamation-triangle mr-2"></i>';
    htmlstr += '<strong><span data-translate="_errorTitle"></span></strong></h4>';
    // Generate info
    htmlstr += '<strong><p data-translate="_errorInfo"></p></strong><hr>';

    // Topic header
    let header = '<div class="container-fluid mb-1"><div class="d-flex flex-row">';
    header += '<div><i class="fas fa-angle-right mr-1 fa-lg"></i></div>';

    // All error codes test
    // errList = [];
    // let error = {
    //     errorCode: 0,
    //     nodeNumber : 2
    // };
    // errList.push(error);

    // error = {
    //     errorCode: 2,
    //     wrongNamesGND: ["gnD", "GND", "GnD"]
    // };
    // errList.push(error);
    
    // error = {
    //     errorCode: 4,
    //     elementNames: ["R2", "R1", "V2"],
    //     wrongUnits: ["jOhm","Om","Volt"]
    // };
    // errList.push(error);

    // error = {
    //     errorCode: 5,
    //     elementNames: ["R2", "L1", "C1"]
    // };
    // errList.push(error);
    // error = {
    //     errorCode: 6,
    //     cpList: ["C2", "L2"]
    // };
    // errList.push(error);
    // let sourcesArr = new Array();
    // sourcesArr.push(["I2","I1"]);
    // sourcesArr.push(["I5","I6","I10"]);
    // error = {
    //     errorCode: 7,
    //     MultipleSources:sourcesArr
    // };
    // errList.push(error);
    // error = {
    //     errorCode: 11,
    //     nodes: ["A","gnd"]
    // };
    // errList.push(error);

    // Create information for each warning
    let warnString = '';

    for(let i = 0; i < errList.length; i++){
        switch (errList[i].errorCode) {
            /* Error Code 0 */
            case 0:
                warnString += header;

                if(errList[i].nodeNumber == 1){
                    warnString += '<div><span data-translate="_errCode00-0"></span>';
                    warnString += '<strong><span>&nbsp&nbsp1&nbsp&nbsp<span></strong>';
                    warnString += '<span data-translate="_errCode00-1"></span></div>';
                }
                else{
                    warnString += '<div><span data-translate="_errCode00-2"></span>';
                    warnString += '<strong><span>&nbsp&nbsp'+errList[i].nodeNumber+'&nbsp&nbsp<span></strong>';
                    warnString += '<span data-translate="_errCode00-3"></span></div>';
                }
                warnString += '</div></div>';
                break;

            /* Error Code 2 */
            case 2:
                warnString += header;
                warnString += '<div><span data-translate="_errCode02-0"></span>';
                warnString += '<strong><span>';
                for(let k = 0; k < errList[i].wrongNamesGND.length; k++){
                    warnString += '&nbsp&nbsp' +  errList[i].wrongNamesGND[k] + ',&nbsp&nbsp';
                    if(k == errList[i].wrongNamesGND.length - 1){
                        warnString = warnString.slice(0,warnString.lastIndexOf(',')) + warnString.slice(warnString.lastIndexOf(',')+1);
                    }
                }
                warnString += '&nbsp&nbsp<span></strong></div>';
                warnString += '</div></div>';
                break;

            /* Error Code 4 */
            case 4:
                warnString += header;
                warnString += '<div><span data-translate="_errCode04-0"></span></div></div>';
                for(let k = 0; k<errList[i].wrongUnits.length; k++){
                    warnString += '<div class="d-flex flex-row ml-3"><div><i class="fas fa-exclamation mr-1 fa-sm text-danger"></i></div>';
                    warnString += '<div><span data-translate="_errCode04-1"></span><strong><span>&nbsp&nbsp';
                    warnString += errList[i].elementNames[k] + '&nbsp&nbsp</span></strong>';
                    warnString += '<span data-translate="_errCode04-2"></span>';
                    warnString += '<strong><span>&nbsp&nbsp'+errList[i].wrongUnits[k]+'</span></strong></div></div>';
                }
                warnString += '</div>';
                break;

            /* Error Code 5 */
            case 5:
                warnString += header;
                warnString += '<div><span data-translate="_errCode05-0"></span><strong><span>';
                for(let k = 0; k < errList[i].elementNames.length; k++){
                    warnString += '&nbsp&nbsp' +  errList[i].elementNames[k] + ',&nbsp&nbsp';
                    if(k == errList[i].elementNames.length - 1){
                        warnString = warnString.slice(0,warnString.lastIndexOf(',')) + warnString.slice(warnString.lastIndexOf(',')+1);
                    }
                }
                warnString += '</span></strong></div></div></div>';
                break;

            /* Error Code 6 */
            case 6:
                warnString += header;
                warnString += '<div><span data-translate="_errCode06-0"></span><strong><span>';
                for(let k = 0; k < errList[i].cpList.length; k++){
                    warnString += '&nbsp&nbsp' +  errList[i].cpList[k] + ',&nbsp&nbsp';
                    if(k == errList[i].cpList.length - 1){
                        warnString = warnString.slice(0,warnString.lastIndexOf(',')) + warnString.slice(warnString.lastIndexOf(',')+1);
                    }
                }
                warnString += '</span></strong></div></div></div>';
                break;

             /* Error Code 7 */
             case 7:
                warnString += header;
                warnString += '<div><span data-translate="_errCode07-0"></span></div></div>';
                for(let k = 0; k<errList[i].MultipleSources.length; k++){
                    warnString += '<div class="d-flex flex-row ml-3"><div><i class="fas fa-exclamation mr-1 fa-sm text-danger"></i></div>';
                    warnString += '<div><span data-translate="_errCode07-1"></span><strong><span>';
                    for(let j = 0; j<errList[i].MultipleSources[k].length; j++){
                        warnString += '&nbsp&nbsp' +  errList[i].MultipleSources[k][j] + ',&nbsp&nbsp';
                        if(j == errList[i].MultipleSources[k].length - 1){
                            warnString = warnString.slice(0,warnString.lastIndexOf(',')) + warnString.slice(warnString.lastIndexOf(',')+1);
                        }
                    }
                    warnString += '</span></strong></div></div>';
                }
                warnString += '</div>';
                break;

                break;

             /* Error Code 11 */
            case 11:
                warnString += header;
                warnString += '<div><span data-translate="_errCode11-0"></span><strong><span>';
                for(let k = 0; k < errList[i].nodes.length; k++){
                    warnString += '&nbsp&nbsp' +  errList[i].nodes[k] + ',&nbsp&nbsp';
                    if(k == errList[i].nodes.length - 1){
                        warnString = warnString.slice(0,warnString.lastIndexOf(',')) + warnString.slice(warnString.lastIndexOf(',')+1);
                    }
                }
                warnString += '</span></strong></div></div></div>';
                break;

            /* Error Code 15 */
            case 15:
                warnString += header;
                warnString += '<div><span data-translate="_errCode15"></span></div>';
                warnString += '</div></div>';
                break;
        }
       
    }
    htmlstr += warnString;
    // Close button
    htmlstr += '<button type="button" class="close" data-dismiss="alert">&times;</button>'; 
    // Close panel
    htmlstr += '</div></div>' ;
    
    return htmlstr;
}

/**
 * Function to generate the Warnings text
 * @param {array} errList error Codes
 * @returns {string} html String
 */
function warningOutput(errList){

    if(errList.length <=2 ){
        let end = 0;
        for(let i= 0; i< errList.length; i++){
            if(errList[i].errorCode!=9 && errList[i].errorCode !=13)
                end=1;
        }
        if(end == 0)
            return 0;
    }

    // Warnings html string
    let htmlstr = '';

    // Create warning panel
    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="alert alert-warning alert-dismissible fade show">';
    // Generate Title
    htmlstr += '<h4 class="alert-heading"><i class="fas fa-exclamation-triangle mr-2"></i>';
    htmlstr += '<strong><span data-translate="_warningTitle"></span></strong></h4>';
    // Generate info
    htmlstr += '<strong><p data-translate="_warningInfo"></p></strong><hr>';

    // Topic header
    let header = '<div class="container-fluid mb-2"><div class="d-flex flex-row">'
    header += '<div><i class="fas fa-angle-right mr-1 fa-lg"></i></div>';

    // TEST --> All the warnings
    // errList = [];
    // let error = {
    //     errorCode: 1,
    //     IDs : ["A", "B", "C","D"]
    // };
    // errList.push(error);
    // error = {
    //     errorCode: 3,
    //     badIDs : ["VA", "VB", "VC", "VD"],
    //     newIDs : ["A", "F", "G", "H"]
    // };

    // let mprobes= ["Pr1","Pr2","Pr3"];
    // let mprobes2= ["Pr4","Pr5","Pr6"];
    // let mprobe2D = new Array();
    // mprobe2D.push(mprobes);
    // mprobe2D.push(mprobes2); 
    // errList.push(error);
    // let error = {
    //     errorCode: 8,
    //     MultipleProbes : mprobe2D,
    //     chosenProbes :  ["Pr1", "Pr4"]
    // };
    // errList.push(error);
    // vsources = {
    //     names: ["V1", "V2", "V3"],
    //     frequencies: ["20 Hz", "1 kHz", "50 Hz"]
    // }
    // let error ={
    //     errorCode: 10,
    //     chosenFreq: 50,
    //     chosenFreqUnit: "Hz",
    //     sources: vsources
    // }
    // errList.push(error);
    // error ={
    //     errorCode: 12,
    //     removed: ["Pr1", "Pr2", "Pr4"]
    // }
    // errList.push(error);

    // Create information for each warning
    let warnString = '';
    for(let i = 0; i < errList.length; i++){
        switch (errList[i].errorCode) {
            /* Warning Error Code 1 */
            case 1:
                warnString += header;
                warnString += '<div><span data-translate="_warning01-1"></span><strong><span>';
                for(let k = 0; k< errList[i].IDs.length; k++){
                    if(k == errList[i].IDs.length-1 && errList[i].IDs.length > 1){
                        warnString = warnString.slice(0,warnString.lastIndexOf(',')) + warnString.slice(warnString.lastIndexOf(',')+1);
                        warnString += '</strong><span data-translate="_and"></span><strong><span>&nbsp;&nbsp;' + errList[i].IDs[k]+'&nbsp;&nbsp;</span>';
                        break;
                    }
                    else{
                        warnString += '&nbsp;&nbsp;' +  errList[i].IDs[k] + ',&nbsp;&nbsp;';
                        if(errList[i].IDs.length == 1)
                            warnString = warnString.slice(0,warnString.lastIndexOf(',')) + warnString.slice(warnString.lastIndexOf(',')+1);
                    }
                }
                warnString += '</strong><span data-translate="_warning01-2"></span></span></div></div></div>';
                break;

            /* Warning Error Code 3 */
            case 3:
                warnString += header;
                warnString += '<span data-translate="_warning03-1"></span></div>';
                for(let k = 0; k< errList[i].badIDs.length; k++){
                    warnString += '<div class="d-flex flex-row ml-3"><div><i class="fas fa-check mr-1 text-success fa-sm"></i></div>';
                    warnString += '<div><span data-translate="_warning03-2"></span>';
                    warnString += '<strong><span>&nbsp;&nbsp;'+ errList[i].badIDs[k] + '&nbsp;&nbsp;</span></strong>';
                    warnString += '<span data-translate="_warning03-3"></span>';
                    warnString += '<strong><span>&nbsp;&nbsp;'+ errList[i].newIDs[k] + '&nbsp;&nbsp;</span></strong></div></div>';
                }
                warnString += '</div>';
                break;

            /* Warning Error Code 8 */
            case 8:
                warnString += header;
                warnString += '<span data-translate="_warning08-1"></span></div>';
                for(let k = 0; k< errList[i].MultipleProbes.length; k++){
                    warnString += '<div class="d-flex flex-row ml-3"><div><i class="fas fa-check mr-1 text-success fa-sm"></i></div>';
                    warnString += '<div><span data-translate="_warning08-2"></span>';
                    for(let j = 0; j < errList[i].MultipleProbes[k].length; j++){
                        if(j == errList[i].MultipleProbes[k].length-1 && errList[i].MultipleProbes[k].length > 1){
                            
                            warnString = warnString.slice(0,warnString.lastIndexOf(',')) + warnString.slice(warnString.lastIndexOf(',')+1);
                            warnString += '<span data-translate="_and"></span><strong><span>&nbsp;&nbsp;';
                            warnString += errList[i].MultipleProbes[k][j]+'&nbsp;&nbsp;</strong></span>';
                            break;
                        }
                        else{
                            warnString += '<strong><span>&nbsp;&nbsp;' +  errList[i].MultipleProbes[k][j] + ',&nbsp;&nbsp;</span></strong>';
                            if(errList[i].MultipleProbes[k].length == 1)
                                warnString = warnString.slice(0,warnString.lastIndexOf(',')) + warnString.slice(warnString.lastIndexOf(',')+1);
                        }
                    }
                    warnString += '<span data-translate="_warning08-3"></span></span>';
                    warnString += '<strong><span>&nbsp;&nbsp;'+ errList[i].chosenProbes[k] + '&nbsp;&nbsp;</strong></span>';
                    warnString += '<span data-translate="_warning08-4"></span></span></div></div>';   
                }
                
                warnString += '</div>';
                break;

            /* Warning Error Code 9 */
           // case 9:
                // Doesn't output anything yet
             //   break;

            /* Warning Error Code 10 */
            case 10:
                warnString += header;
                warnString += '<span data-translate="_warning10-1"></span></div>';
                warnString += '<div class="d-flex flex-row ml-3"><div><i class="fas fa-exclamation-triangle mr-1 text-warning fa-sm"></i></div>';
                warnString += '<div><span data-translate="_warning10-2"></span>';
                for(let k = 0; k< errList[i].sources.names.length; k++){
                    warnString += '<strong><span>'+ errList[i].sources.names[k]+': </strong></span>';
                    warnString += '<span>' + errList[i].sources.frequencies[k]+',&nbsp</span>';
                }
                warnString = warnString.slice(0,warnString.lastIndexOf(',')) + warnString.slice(warnString.lastIndexOf(',')+1);
                warnString += '</div></div>';

                warnString += '<div class="d-flex flex-row ml-3"><div><i class="fas fa-check mr-1 text-success fa-sm"></i></div>';
                warnString += '<div><span data-translate="_warning10-3"></span>';
                let latexstr = '\\; F = ' + errList[i].chosenFreq + '\\;' + errList[i].chosenFreqUnit;
                warnString += katex.renderToString(latexstr, {throwOnError: false})
                
                warnString += '</div></div></div>';
                break;

             /* Warning Error Code 12 */
            case 12:
                warnString += header;
                warnString += '<span data-translate="_warning12-1"></span></div>';
                warnString += '<div class="d-flex flex-row ml-3"><div><i class="fas fa-check mr-1 text-success fa-sm"></i></div>';
                warnString += '<div><span data-translate="_warning12-2"></span><strong>';
                for(let k = 0; k< errList[i].removed.length; k++){
                    if(k ==  errList[i].removed.length-1 && errList[i].removed.length > 1){
                        warnString = warnString.slice(0,warnString.lastIndexOf(',')) + warnString.slice(warnString.lastIndexOf(',')+1);
                        warnString += '</strong><span data-translate="_and"></span><strong><span>&nbsp;&nbsp;' + errList[i].removed[k]+'&nbsp;&nbsp;</span>';
                        break;
                    }
                    else{
                        warnString += '&nbsp;&nbsp;' +  errList[i].removed[k] + ',&nbsp;&nbsp;';
                        if(errList[i].removed.length == 1)
                            warnString = warnString.slice(0,warnString.lastIndexOf(',')) + warnString.slice(warnString.lastIndexOf(',')+1);
                    }
                }

                warnString += '</div></div></div>';
                break;

            //case 13:
                // Doesn't output anything yet
               // break;
            
            case 14:
                warnString += header;
                warnString += '<span data-translate="_warning14-1"></span>';
                warnString += '<strong><span>&nbsp;&nbsp;'+ errList[i].newGnd+ '&nbsp;&nbsp;</span></strong>';
                warnString += '<span data-translate="_warning14-2"></span>';
                warnString += '</div></div>';
                break;

            /* Warning Error Code 8 */
            case 16:
                warnString += header;
                warnString += '<span data-translate="_warning16-0"></span></div>';
                for(let k = 0; k< errList[i].list.length; k++){
                    warnString += '<div class="d-flex flex-row ml-3"><div><i class="fas fa-check mr-1 text-success fa-sm"></i></div>';
                    warnString += '<div><span data-translate="_warning16-1"></span>';
                    for(let j = 0; j < errList[i].list[k].srcSet.length; j++){
                        if(j == errList[i].list[k].srcSet.length-1 && errList[i].list[k].srcSet.length > 1){
                            
                            warnString = warnString.slice(0,warnString.lastIndexOf(',')) + warnString.slice(warnString.lastIndexOf(',')+1);
                            warnString += '<span data-translate="_and"></span><strong><span>&nbsp;&nbsp;';
                            warnString += errList[i].list[k].srcSet[j]+'&nbsp;&nbsp;</strong></span>';
                            break;
                        }
                        else{
                            warnString += '<strong><span>&nbsp;' +  errList[i].list[k].srcSet[j] + ',&nbsp;</span></strong>';
                            if(errList[i].list[k].srcSet.length == 1)
                                warnString = warnString.slice(0,warnString.lastIndexOf(',')) + warnString.slice(warnString.lastIndexOf(',')+1);
                        }
                    }
                    warnString += '<span data-translate="_warning16-2"></span></span>';
                    warnString += '<strong><span>&nbsp;'+ errList[i].list[k].srcSet[0] + ':&nbsp;</strong></span>';
                    if(errList[i].list[k].phase == null){
                        warnString += '<span>' + errList[i].list[k].U + ' &nbsp;V</span>';
                    }
                    else{
                        warnString += '<span>' + errList[i].list[k].U + '&ang;'+ errList[i].list[k].phase+ ' V &nbsp;&nbsp;@&nbsp;'+ errList[i].list[k].freq+ '</span>';
                        
                    }
                    warnString += '</span></div></div>';   
                }
                
                warnString += '</div>';
                break;
        }
       
    }
    htmlstr += warnString;
    // Close button
    htmlstr += '<button type="button" class="close" data-dismiss="alert">&times;</button>'; 
    // Close panel
    htmlstr += '</div></div>' ;
    
    return htmlstr;
}

/**
 * Function to output the circuit fundamental variables
 * @param {number} R Branches
 * @param {number} N Nodes
 * @param {number} T Isolated Voltage Sources
 */
function outCircuitFundamentals(R, N, T){
    // Compute number of equations
    let E = N-1-T;   

    //Buttons  Variables
    let accIDs = ["accBranches", "accNodes", "accSources", "accEquations"];
    let btnStyle = ["btn-info", "btn-info", "btn-info", "btn-info"];
    let panStyle = ["bg-info", "bg-info", "bg-info", "bg-info"];
    let btncollapse = ["collapseR", "collapseN", "collapseT", "collapseE"];

    let btnType = ["R", "N", "T", "E"];
    let btnContent = new Array();
    // TeX Content
    let eqString = "\\small E = N - 1 - T \\Leftrightarrow \\\\ E = ";
    btnContent.push(katex.renderToString("\\small R = " + R, {throwOnError: false}));
    btnContent.push(katex.renderToString("\\small N = " + N, {throwOnError: false}));
    btnContent.push(katex.renderToString("\\small T = " + T, {throwOnError: false}));
    btnContent.push(katex.renderToString(eqString + E, {throwOnError: false}));

    let htmlstr = '<div class="row">';
    // Collapse Panels
    for(let i = 0; i<4; i++){
        htmlstr += '<div class="col-xl-3 col-lg-6 col-md-6 mb-2">'
        htmlstr += '<div class="accordion" id="'+accIDs[i]+'"><div class="card">';

        htmlstr += '<div class="container"><div class="row ' + panStyle[i] +'">';
        htmlstr += '<div class="btn-group btn-block" role="group">';
        htmlstr += '<button type="button" class="btn ' + btnStyle[i]+'" data-translate="_fundamentals_'+ btnType[i] + '" style="width:100%; pointer-events: none;"></button>';
        htmlstr += '<button class="btn ' + btnStyle[i]+' btn-outline-dark border-0" type="button" data-toggle="collapse" ';
        htmlstr += 'data-target="#' + btncollapse[i] + '" aria-expanded="false" aria-controls="'+btncollapse[i]+ '" style="height:100%;">';
        htmlstr += '<i class="fas fa-arrows-alt-v"></i> </button></div></div></div>'

       
        htmlstr += '<div id="' + btncollapse[i] + '" class="collapse multi-collapse bg-light text-center" style="max-height: 90px;"';
        htmlstr += 'aria-labelledby="headingOne" data-parent="#' + accIDs[i] + '">';
        htmlstr += '<div class="card-body"><p class="lead">'+ btnContent[i]+'</p>';
        htmlstr += '</div></div></div></div></div>';
        
    }

    htmlstr += '</div>';
    return htmlstr;
 
 
}

/**
 * Function to output the circuit information
 * @param {object} F Frequency
 * @param {number} Asources Current Sources
 * @param {number} Amps Ammeters
 * @param {number} totalCurrents Number of currents in the circuit
 */
function outCircuitInfo(F, Asources, Amps, totalCurrents){
    
    //Buttons  Variables
    let accIDs = ["accFreq", "accAsources", "accAmps", "accType"];
    let btnStyle = ["btn-warning", "btn-warning", "btn-warning", "btn-warning"];
    let btncollapse = ["collapseF", "collapseA", "collapseAmp", "collapseType"];
    let btnType = ["F", "S", "A", "T"];
    let panStyle = ["bg-warning", "bg-warning", "bg-warning", "bg-warning"];
    let btnContent = new Array();
    // TeX Content
    let fstring = '';
    if(F.value == 0)
        fstring = "\\small F = " + F.value.toString()+ "\\; Hz";
    else
    fstring = "\\small F = " + F.value.toString()+ "\\;" + F.mult;

    let ampstring = "\\small " + Amps.toString() + "\\;/\\;" + totalCurrents.toString();
    let typestring = '';
    if(F.value == 0) typestring = "DC"; else typestring = "AC";

    // Currents Sources ID
    let CSid = 'CS';
    if(document.getElementById("lang-sel-txt").innerText.toLowerCase() == "português")
        CSid = "FC"

    btnContent.push(katex.renderToString(fstring, {throwOnError: false}));
    btnContent.push(katex.renderToString('\\small ' + CSid + ' = ' + Asources, {throwOnError: false}));
    btnContent.push(katex.renderToString(ampstring, {throwOnError: false}));
    btnContent.push(katex.renderToString("\\small "+ typestring, {throwOnError: false}));

    let htmlstr = '<div class="row">';
    // Collapse Panels
    for(let i = 0; i<4; i++){

        htmlstr += '<div class="col-xl-3 col-lg-6 col-md-6 mb-2">'
        htmlstr += '<div class="accordion" id="'+accIDs[i]+'"><div class="card">';
        
        htmlstr += '<div class="container"><div class="row ' + panStyle[i] +'">';
        htmlstr += '<div class="btn-group btn-block" role="group">';
        htmlstr += '<button type="button" class="btn ' + btnStyle[i]+'" data-translate="_info_'+ btnType[i] + '" style="width:100%; pointer-events: none;"></button>';
        htmlstr += '<button class="btn ' + btnStyle[i]+' btn-outline-dark border-0" type="button" data-toggle="collapse" ';
        htmlstr += 'data-target="#' + btncollapse[i] + '" aria-expanded="false" aria-controls="'+btncollapse[i]+ '" style="height:100%;">';
        htmlstr += '<i class="fas fa-arrows-alt-v"></i> </button></div></div></div>'

       
        htmlstr += '<div id="' + btncollapse[i] + '" class="collapse multi-collapse bg-light text-center" style="max-height: 90px;"';
        htmlstr += 'aria-labelledby="headingOne" data-parent="#' + accIDs[i] + '">';
        htmlstr += '<div class="card-body"><p class="lead">'+ btnContent[i]+'</p>';
        htmlstr += '</div></div></div></div></div>';

    }

    htmlstr += '</div>';

    if(Amps < totalCurrents){

        let missing = totalCurrents-Amps;

        htmlstr += '<div id="AmmeterTip">';
        htmlstr += '<div class="alert alert-dismissible fade show" style="background-color: #D3FFBB; border-left: 6px solid #8CE85A;">';
        htmlstr += '<i class="fas fa-lightbulb mr-2 ml-1"></i>';
        htmlstr += '<strong><span class="mt-2 mb-2" style="display:inline-block" data-translate="_tip"></span>';
        htmlstr += '<span class="mt-2 mb-2" style="display:inline-block">&nbsp; - ' + missing + '&nbsp;';
        htmlstr += '<span data-translate="_tipAmm1"></span>&nbsp; ' + totalCurrents + '&nbsp;<span data-translate="_tipAmm2"></span>';
        htmlstr += '</span></strong>';
        htmlstr += '<button type="button" class="close" data-dismiss="alert">&times;</button></div>';
     

        htmlstr += '</div>';
    }

    


    return htmlstr;
}


/**
 * Function to output the supernode information
 * @param {object} supernodes supernodes object
 * @param {number} orderedEquations equations from supernodes
 * @returns {string} HTML string
 */
function outSupernodes(supernodes, orderedEquations, equationsV1){
    
    // HTML String
    let htmlstr = '';
    // TEX Variable
    let TeXData = "";
    // Add title panel
    if(supernodes.length > 0){
        htmlstr += '<div class="container mt-3"><div class="row bg-dark rounded text-light p-2">';
        htmlstr += '<h5 class="ml-3" data-translate="_snTitle"></h5></div></div>';
        htmlstr += '<div class="container"><div class="row" id="supernodesContent">';
    }
    let collapseArray = new Array();
    let collapsePanel = '';
    let snType = '';
 
	for(let i = 0; i < supernodes.length; i++){
        // Get Nodes
        let snNodes = supernodes[i].nodes.map(a => a.ref);
        // Get variable Node
        let unknown = '';
        for(let k = 0; k < snNodes.length; k++){
            if(orderedEquations[0].equation.includes(snNodes[k]))
                unknown = snNodes[k];
        }
        // Search nodes left in ordered Equations
        if(supernodes[i].type == 1 && supernodes[i].nodes.length > 2){
            for(let k = 0; k < snNodes.length; k++){
                // If the node is not found in the ordered equations, add the equation
                if(orderedEquations.filter(function(item) {return  item.node === snNodes[k];}).length == 0 && snNodes[k] != unknown){
                    for(let j = 0; j < equationsV1.length; j++){
                        if(equationsV1[j].includes(snNodes[k])){
                            // Separate terms
                            let str = equationsV1[j];
                            str = str.split('=');
                            //Check if the node is the first term;
                            if(str[0].includes(snNodes[k])){
                                let nodeObj = {
                                    node: snNodes[k],
                                    equation: '('+str[1]+')'
                                };
                                // Save equation
                                orderedEquations.push(nodeObj);
                                break;
                            }
                            else{
                                let nodeObj = {
                                    node: snNodes[k],
                                    equation: parseDirectEquation(equationsV1[j],snNodes[k])
                                }
                                // Save equation
                                orderedEquations.push(nodeObj);
                                break;
                            }
                        }
                    }
                }
            }
        }

        // Border Color
		let color = ' border-primary ';
		// Grounded colour
		if(supernodes[i].type == 0){
            color =' border-dark ';
            collapsePanel = "stepsSNG"+i;
            snType = '<span data-translate="_grounded"></span>';
            collapseArray.push(collapsePanel);
        }
        else{
            collapsePanel = "stepsSNF"+i;
            snType = '<span data-translate="_floating"></span>';
            collapseArray.push(collapsePanel);
        }
		// Add card
        htmlstr += '<div class="col-sm-12 col-lg-6 mt-3"><div class="card bg-light' + color + 'mb-3">';
        // Create Show Steps Collapse Panel
        let btnstr ='<button class="btn btn-primary btn-sm float-right" type="button" data-toggle="collapse" data-target="#' + collapsePanel;
        btnstr += '" aria-expanded="false" data-translate="_snStepsBtn"></button>';
        // Add Supernode ID
        htmlstr += '<div class="card-body text-secondary"><h5 class="card-title">' + supernodes[i].ref + ' (' + snType + ') ' + btnstr +'</h5>';    
        // Add nodes that belong to the supernode
        htmlstr += '<p class="card-text lead"><i class="fas fa-hand-point-right mr-2 ml-2"></i><span class="lead" data-translate="_snNodes"></span>';
        htmlstr += '{' + snNodes.join(',  ') + '}';
        //Add Equations
		htmlstr += '<p class="card-text lead"><i class="fas fa-hand-point-right mr-2 ml-2"></i><span class="lead" data-translate="_snEquat"></span>';
        let str = '';
        // Grounded Scenario
		if(supernodes[i].type == 0){
            // Get Values
            str = '\\begin{cases}';
			for(let k = 0; k<supernodes[i].nodes.length; k++){
				if(supernodes[i].nodes[k].ref != "gnd"){
                    str += "V_{" + supernodes[i].nodes[k].ref + "} = " + supernodes[i].nodes[k].voltage + '\\, V';
                    if(k<supernodes[i].nodes.length-1)
                        str+= '\\\\';
                }
            }
            str += '\\end{cases}';

            TeXData += "\\subsection{Grounded Supernode}\r\n\r\n\\subsubsection{"+supernodes[i].ref+"}\r\n\r\n\r\n";
            TeXData += "\\paragraph{} Formed by Nodes: {"+snNodes.join(',  ')+"}\r\n\\par\r\n\r\n\\paragraph{} Equations:\r\n\r\n";
            TeXData += "\\begin{gather*}\r\n"+str+"\r\n\\end{gather*}\r\n\\par\r\n\r\n";

		}	
        // Floating Scenario
        else{
            str = '\\begin{cases}';
            for(let k = 0; k<supernodes[i].nodes.length; k++){
                let index = orderedEquations.map(function(item) { return item.node; }).indexOf(supernodes[i].nodes[k].ref);
                if(index > -1){
                    let aux =  math.parse(orderedEquations[index].equation);
                    aux = math.simplify(aux,{}, {exactFractions: false}).toTex();
                    for(let f = 0; f < snNodes.length;f++){
                        if(aux.includes(snNodes[f]))
                           aux = aux.replace(snNodes[f],"V_{"+snNodes[f]+"}");
                    }
                    
                    str += "V_{" + supernodes[i].nodes[k].ref + "} = " + aux ;
                    str = fixEquation(str);
                    if(k<supernodes[i].nodes.length)
                        str += '\\\\';
                }
            }
            str += '\\end{cases}';

            TeXData += "\\subsection{Floating Supernode}\r\n\r\n\\subsubsection{"+supernodes[i].ref+"}\r\n\r\n\r\n";
            TeXData += "\\paragraph{} Formed by Nodes: {"+snNodes.join(',  ')+"}\r\n\\par\r\n\r\n\\paragraph{} Equations:\r\n\r\n";
            TeXData += "\\begin{gather*}\r\n"+str+"\r\n\\end{gather*}\r\n\\par\r\n\r\n";
        }
        // Render to TeX
        str = katex.renderToString(str, {throwOnError: false});
        htmlstr += '<span>'+ str + '</span></p></p>';
        // Grounded Supernodes Collapse Panel
        if(supernodes[i].type == 0){
            htmlstr += '<div class="collapse multi-collapse" id="'+collapsePanel+'">';
            htmlstr += '<div class="card card-body"><div class="text-center">';
            htmlstr += '<div class="scrollmenu mt-2 mb-2"><i class="fas fa-check mr-2"></i>';
            str = '\\begin{cases}';
            for(let k = 0; k< supernodes[i].SNGs.length; k++){
                if(supernodes[i].nodes.find(x => x.ref === supernodes[i].SNGs[k].node)){   
                    str += supernodes[i].SNGs[k].equation ;
                    if(k< supernodes[i].SNGs.length -1)
                        str += '\\\\[0.7em] ';
                
                }
            }
            str += '\\end{cases}';
            TeXData += "\\paragraph{} Steps:\r\n\r\n\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n\r\n";

            str = katex.renderToString(str, {throwOnError: false});
            htmlstr += str +'</div></div></div></div>';
            

        }
        // Floating Supernodes Collapse Panel
        else{
            htmlstr += '<div class="collapse multi-collapse" id="'+collapsePanel+'">';
            htmlstr += '<div class="card card-body"><div class="text-center">';
            htmlstr += '<div class="scrollmenu mt-2 mb-2"><i class="fas fa-check mr-2"></i>';
            str = '\\begin{cases}';
            for(let k = 0; k< supernodes[i].SNFs.length; k++){
                if(supernodes[i].nodes.find(x => x.ref === supernodes[i].SNFs[k].ref)){
                    for(let f = 0; f < snNodes.length;f++){
                        if(supernodes[i].SNFs[k].equation.includes('\mathrm{'+snNodes[f]+'}'))
                            supernodes[i].SNFs[k].equation = supernodes[i].SNFs[k].equation.replace('\mathrm{'+snNodes[f]+'}',"\mathrm{V_{"+snNodes[f]+"}}");
                        else
                            supernodes[i].SNFs[k].equation = supernodes[i].SNFs[k].equation.replace(snNodes[f],"V_{"+snNodes[f]+"}");
                    }
                    str += "V_{" + supernodes[i].SNFs[k].ref + "} = " + supernodes[i].SNFs[k].equation;
                    if(k< supernodes[i].SNFs.length-1)
                        str += '\\\\[0.7em] ';
                }
            }
            str += '\\end{cases}';
            TeXData += "\\paragraph{} Steps:\r\n\r\n\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n\r\n";
            str = katex.renderToString(str, {throwOnError: false});
            htmlstr += str +'</div></div></div></div>';
        }

        htmlstr +='</div></div></div>';
    }
    
    htmlstr += '</div></div>';
    
    let obj = {
        first: htmlstr,
        second: collapseArray,
        third: TeXData
    }
    return obj;
}


/**
 * Function to output the circuit currents information
 * @param {object} currents currents object
 * @returns {string} HTML string
 */
function outCurrentsInfo(currents, branches){
    // Create row div
    let htmlstr = '<div class="row mt-3">';
    // TEX Data
    let TeXData = '';
    // Add every current information
    for( let i = 0; i < currents.length; i++){
        htmlstr += '<div class="col-6 col-sm-6 col-md-6 col-lg-4">';
        htmlstr += '<div class="card text-white bg-secondary mb-3">';
        htmlstr += '<div class="card-body">'
        // Current ID
        htmlstr += '<h5 class="card-title text-left"> ID: '+ katex.renderToString(currents[i].ref, {throwOnError: false}) +'</h5>';
        // From Node
        htmlstr += '<h5 class="card-text text-left"> <span data-translate="_currFlow"></span>: '+ katex.renderToString(currents[i].noP, {throwOnError: false});
        // Arrow Icon
        htmlstr += '<i class="fas fa-arrow-right mr-2 ml-2"></i>';
        // To Node
        htmlstr += katex.renderToString(currents[i].noN, {throwOnError: false})+'</h5>';
        // Components
        htmlstr += ' <h5 class="card-text text-left"> <span data-translate="_currComponents"></span>: ';
        
        // Find id in branches
        let branchIndex = branches.findIndex(item => item.currentId == currents[i].id);

        // TeX information
        TeXData += currents[i].ref + " & " + currents[i].noP + " & " + currents[i].noN + " & ";

        // Add Components
        for(let k = 0; k < branches[branchIndex].acAmpPwSupplies.length; k++){
            htmlstr += katex.renderToString(branches[i].acAmpPwSupplies[k].ref, {throwOnError: false}) + ', ';
            TeXData += branches[i].acAmpPwSupplies[k].ref + ', ';
        }
        for(let k = 0; k < branches[branchIndex].acVoltPwSupplies.length; k++){
            htmlstr += katex.renderToString(branches[i].acVoltPwSupplies[k].ref, {throwOnError: false})  + ', ';
            TeXData += branches[i].acVoltPwSupplies[k].ref + ', ';
        }
        for(let k = 0; k < branches[branchIndex].dcAmpPwSupplies.length; k++){
            htmlstr += katex.renderToString(branches[i].dcAmpPwSupplies[k].ref, {throwOnError: false})  + ', ';
            TeXData += branches[i].dcAmpPwSupplies[k].ref + ', ';
        }
        for(let k = 0; k < branches[branchIndex].dcVoltPwSupplies.length; k++){
            htmlstr += katex.renderToString(branches[i].dcVoltPwSupplies[k].ref, {throwOnError: false})  + ', ';  
            TeXData += branches[i].dcVoltPwSupplies[k].ref+ ', ';
        }
        for(let k = 0; k < branches[branchIndex].capacitors.length; k++){
            htmlstr += katex.renderToString(branches[i].capacitors[k].ref, {throwOnError: false})  + ', ';
            TeXData += branches[i].capacitors[k].ref + ', ';
        }
        for(let k = 0; k < branches[branchIndex].coils.length; k++){
            htmlstr += katex.renderToString(branches[i].coils[k].ref, {throwOnError: false})  + ', '; 
            TeXData += branches[i].coils[k].ref + ', ';
        }
        for(let k = 0; k < branches[branchIndex].resistors.length; k++){
            htmlstr += katex.renderToString(branches[i].resistors[k].ref, {throwOnError: false})  + ', ';
            TeXData += branches[i].resistors[k].ref + ', ';
        }
        
        // Remove last comma
        if(htmlstr[htmlstr.length-2] == ','){
            htmlstr = htmlstr.slice(0,htmlstr.length-2);
            TeXData = TeXData.slice(0,TeXData.length-2);
        }

        TeXData += "\\\\\r\n";

        htmlstr += '</h5>';
        htmlstr += '</div></div></div>';
    }
    htmlstr += '</div>';

    let obj = {
        first: htmlstr,
        second: TeXData
    }
    return obj;
    
}


/**
 * Function to output the meshes information
 * @param {object} meshes currents object
 * @returns {string} HTML string
 */
 function outMeshes(meshes){
    // Create row div
    let htmlstr = '<div class="row mt-3">';
    // TEX Data
    let TeXData = '';
    // Add every current information
    for( let i = 2; i < meshes.data.order.length; i++){
        htmlstr += '<div class="col-6 col-sm-6 col-md-6 col-lg-4">';
        htmlstr += '<div class="card text-black bg-white mb-3">';
        htmlstr += '<div class="card-body">'
        htmlstr += '<h5 class="card-title text-left"> Malhas de ordem '+ i + ':';
        // Current Mesh
        for(let j=0; j<meshes.data.order[i].length; j++){
            for (let k=0; k<i;k++){
                if (k==0 || k==i-1){
                    if(k==0){
                        htmlstr += '<h5 class="card-title text-center"> {r_'+ katex.renderToString(meshes.data.order[i][j][k], {throwOnError: false}) +', r_'; 
                        }
                    else{
                        htmlstr += katex.renderToString(meshes.data.order[i][j][k], {throwOnError: false}) + '}</h5>'; 
                        }
                 }  
                else{
                    htmlstr += katex.renderToString(meshes.data.order[i][j][k], {throwOnError: false}) +', r_';
                }
            
        }
    }  
    
        htmlstr += '</h5>';
        htmlstr += '</div></div></div>';
    }
    htmlstr += '</div>';

   
    return htmlstr;
    
}
/**
 * Function to output the equivalent impedances and voltages
 * @param {object} Zequiv equivalent impedance extracted from branches
 * @param {object} Vequiv equivalent voltage extracted from branches
 * @param {object} Nodes  branch start/end nodes
 * @returns {string} HTML string
 */
function outEqImpedances(Zequiv, Vequiv, Nodes){

    let htmlstr = '';
    let TeXData = "\\subsection{Equivalent Impedances and Voltages}\r\n";
    let str = '';

    // Compute Equivalent Equations
    for(let i = 0; i < Zequiv.length; i++){
        if(Zequiv[i].impedanceElem.length > 1 || Vequiv[i].voltsElem.length > 1){
            // Add card
            htmlstr += '<div class="col-sm-12 col-lg-6 mt-3"><div class="card bg-light mb-3">';
            htmlstr += '<div class="card-header rounded text-dark bg-light d-flex align-items-center justify-content-center">';
            htmlstr += '<h5 class="lead"><span data-translate="_equivImp1"></span>&nbsp'+Nodes.startNodes[i] +'&nbsp';
            htmlstr += '<span data-translate="_equivImp2"></span>&nbsp'+ Nodes.endNodes[i]+ '</h5></div>'
            htmlstr += '<div class="card card-body text-secondary">';

            TeXData += "\\paragraph{}Branch from "+ Nodes.startNodes[i]+" to "+Nodes.endNodes[i]+"\r\n";

            // Add Impedance equations
            str = '\\begin{cases}';
            if(Zequiv[i].impedanceElem.length > 1){
                let eq = Zequiv[i].ref + " = ";
                for(let k = 0; k < Zequiv[i].impedanceElem.length; k++){
                    eq += Zequiv[i].impedanceElem[k].ref + " + ";
                }
                eq = eq.slice(0,eq.length-2);
                str += eq + " = " + Zequiv[i].value;
                if(Vequiv[i].voltsElem.length > 1)
                    str += ' \\\\[0.7em] ';
            }
            // Add Voltage equations
            if(Vequiv[i].voltsElem.length > 1){
                let eq = Vequiv[i].ref + " = ";
                for(let k = 0; k < Vequiv[i].voltsElem.length; k++){
                    if(k == 0 && Vequiv[i].voltsElem[k].signal == "+")
                        eq += Vequiv[i].voltsElem[k].ref ;
                    else
                        eq +=  " " + Vequiv[i].voltsElem[k].signal + " " + Vequiv[i].voltsElem[k].ref ;
                }

                str += eq + " = " + Vequiv[i].value + "\\; V "; 
            }
            str += '\\end{cases}';
            TeXData += "\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n\\par\r\n\r\n";
            str = katex.renderToString(str, {throwOnError: false});
            htmlstr += '<div class="scrollmenu mt-2 mb-2"><span>'+ str + '</span></div>';
            htmlstr += '</div></div></div>';
        }

    }  

    // Create panel
    if(htmlstr.length > 1){
        let row = '<div class="container mt-3"><div class="row bg-dark rounded text-light p-2">';
        row += '<h5 class="ml-3" data-translate="_equivImpTitle"></h5></div></div>';
        row += '<div class="container"><div class="row" id="equivContent">';
        htmlstr = row + htmlstr + '</div></div>';
    }
    else
        TeXData = '';

    let obj = {
        first: htmlstr,
        second: TeXData
    }
    return obj;
        
}

/**
 * Function to output the KNL Current Equations
 * @param {object} knlCurrEquations current equations object
 * @param {number} supernodes supernodes object
 * @returns {obj} first:HTML string second:Simplified equations obj
 */
function outCurrentsKNL(knlCurrEquations,supernodes){

    // Create string
    let htmlstr = '';

    let TeXData = "";


    if(knlCurrEquations.length > 0){
        htmlstr += '<div class="container mt-3"><div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_knlTitle"></h5></div></div>';
        htmlstr += '<div class="container mt-3"><div class="row row-tile" id="currentsKNL">';
    }

    // Simplify the objects and get the currents directions and IDs
    let KNLeqs = new Array();
    for(let i = 0; i< knlCurrEquations.length; i++){
        let obj = {
            node: knlCurrEquations[i].node,
            equation:'',
            orderedEq: knlCurrEquations[i].plainEquation,
            currents: new Array()
        };

        for(let k = 0; k< knlCurrEquations[i].eqObj.lhs.terms.length; k++ ){
            let curr = knlCurrEquations[i].eqObj.lhs.terms[k];
            let currObj = {
                id: curr.variables[0].variable,
                flow: '',
            };
            if(curr.coefficients[0].numer == 1)
                currObj.flow = 'in'
            else
                currObj.flow = 'out'
            obj.currents.push(currObj);
        }

        // Create Equation
        let strEq = ''
        for(let k=0; k<obj.currents.length; k++){
            if(obj.currents[k].flow == "in")
                strEq += obj.currents[k].id + "+";
        }
        if(obj.currents.filter(function(x){ return x.flow === "in"; }).length == 0)
            strEq += '0='
        else
            strEq += "=";
        
        strEq = strEq.replace('+=','=');
        for(let k=0; k<obj.currents.length; k++){
            if(obj.currents[k].flow == "out")
                strEq += obj.currents[k].id + "+";
        }
        if(obj.currents.filter(function(x){ return x.flow === "out"; }).length == 0)
            strEq += '0'
        else
            strEq += "=";
        strEq = strEq.replace('+=','');
        obj.equation = strEq;
        KNLeqs.push(obj);
    }

    // Change the node ID if it belongs to a supernode
    for(let i = 0; i<KNLeqs.length; i++){
        for(let k = 0; k< supernodes.length; k++){
            for(let j = 0; j< supernodes[k].nodes.length; j++){
                if( supernodes[k].nodes[j].ref == KNLeqs[i].node){
                    KNLeqs[i].node = supernodes[k].ref;
                    k = supernodes.length;
                    break;
                }
                    
            }
        }
  
    }
    let pagebreakCounter = 0;

    //Generate the cards and insert Node and Equation
    for(let i = 0; i< KNLeqs.length; i++){
        htmlstr +='<div class="col-sm-12 col-md-6 mt-3"><div class="card bg-light mb-3">'
        let canvasID = "currCanvas"+i;
        htmlstr += '<div class="card-body text-secondary">';
        htmlstr += '<h5 class="card-title ml-3 text-center border rounded-top"><span data-translate="_knlNode"></span> ';
        htmlstr += '<span class="font-weight-bold text-dark"> &nbsp;&nbsp;'+KNLeqs[i].node + '</span></h5>';
        htmlstr += '<div class="d-flex justify-content-center square mb-3" id="img'+i+'"><canvas width="225" height="225" id="'+canvasID+'"></canvas></div>';
        htmlstr += '<p class="text-center">';
        htmlstr += katex.renderToString(KNLeqs[i].equation, {throwOnError: false});
        htmlstr += '</p></div></div></div>';

        TeXData += "\\subsubsection{Node " + KNLeqs[i].node + "}\r\n\\begin{figure}[hbt]\r\n\\centering{\\includegraphics[height=4cm, keepaspectratio]{";
        TeXData += canvasID + "}}\r\n\\caption{Node " + KNLeqs[i].node + " currents.}\r\n\\label{" + KNLeqs[i].node + "currents}\r\n\\end{figure}\r\n";
        TeXData += "\\begin{equation}\r\n \\textrm{Equation}: \\quad "+ KNLeqs[i].equation +"\r\n\\end{equation}\r\n\r\n";
        pagebreakCounter++;
        if(pagebreakCounter == 2){
            pagebreakCounter = 0;
            TeXData += "\\pagebreak";
        }
    }


    htmlstr += '</div></div>';

    let obj = {
        first: htmlstr,
        second: KNLeqs,
        third: TeXData
    };
    return obj;
}

/**
 * Function to output currents directions canvas
 * @param {object} currentsData currents information object
 * @TODO Expand the canvas to allow more than 8 currents/angles
 */
function createCanvasCurrents(currentsData){
    
    // Arrows Array
    let arrows = new Array();
    // Ids Array
    let text = new Array();

    //Canvas dataURL Object array
    let canvasObjects = new Array();

    for(let i = 0; i<currentsData.length; i++){

        // Get Canvas HTML ID
        let canvasID = "currCanvas" + i;
        let canvas = document.getElementById(canvasID);
        let context = canvas.getContext('2d');
        let centerX = canvas.width / 2;
        let centerY = canvas.height / 2;
        let radius  = 5;
        let alignConfig = ["left","center","right","center","left","right","right","left"];

        // Generate Arrows in 8 angles (MAX 8 CURRENTS)
        arrows.push([centerX+radius+1, centerY, centerX+75, centerY]); // 0   Deg
        arrows.push([centerX, centerY-radius-1, centerX, centerY-75]); // 90  Deg
	    arrows.push([centerX-radius-1, centerY, centerX-75, centerY]); // 180 Deg
        arrows.push([centerX, centerY+radius+1, centerX, centerY+75]); // 270 Deg

        arrows.push([centerX+radius+1, centerY-radius-1, centerX+65, centerY-65]); // 45 Deg
        arrows.push([centerX-radius-1, centerY-radius-1, centerX-65, centerY-65]); // 135 Deg
        arrows.push([centerX-radius-1, centerY+radius+1, centerX-65, centerY+65]); // 225 Deg
        arrows.push([centerX+radius+1, centerY+radius+1, centerX+65, centerY+65]); // 315 Deg

        // Generate Text Coordinates for each angle
        text.push([centerX+75+6, centerY+3]);
        text.push([centerX, centerY-75-10]);
        text.push([centerX-75-6, centerY+3]);
        text.push([centerX, centerY+75+15]);

        text.push([centerX+65+3, centerY-65-3]);
        text.push([centerX-65-3, centerY-65-3]);
        text.push([centerX-65-3, centerY+65+10]);
        text.push([centerX+65+6, centerY+65+10]);

        // Cycle through currents if less than 8
        if(currentsData[i].currents.length <= 8){
            for(let k = 0; k < currentsData[i].currents.length; k++){
                // Draw the Arrow
                if(currentsData[i].currents[k].flow == "out")
                    drawArrow(arrows[k][0], arrows[k][1], arrows[k][2], arrows[k][3],"#941600",canvasID);
                else
                    drawArrow(arrows[k][2], arrows[k][3], arrows[k][0], arrows[k][1],"#1D6E07",canvasID);

                context.font='15px serif';
                context.fillStyle = "#656865";
                context.textAlign = alignConfig[k];
                // Draw the ID
                context.fillText(currentsData[i].currents[k].id, text[k][0],text[k][1]);
            }

            // Draw Node Circle
            context.beginPath();
            context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            context.fillStyle = '#656865';
            context.fill();
            context.lineWidth = 1;
            context.strokeStyle = '#b8b8b8';
            context.stroke();
        }

        // Convert to Data URL
        let canvasdataURL = {
            dataURL: canvas.toDataURL(),
            id: canvasID
        }

        canvasObjects.push(canvasdataURL);
    }

    return canvasObjects
}

/**
 * Function to output equation system STEP 1
 * @param {object} currents currents object
 * @returns {string} HTML string
 */
function outStep1(currents){
    // Create HTML string
    let htmlstr = '';
    let TeXData = "";
    // Generate the collapse panel
    htmlstr += '<div class="collapse multi-collapse col-xs-12" id="step1Panel">';
    // Generate equation system
    let str = '\\large \\begin{cases}';
    for(let k = 0; k<currents.length; k++){
        str += currents[k];
        if(k<currents.length-1)
            str += ' \\\\[0.7em] ';

    }
    str += '\\end{cases}';
    TeXData += "\\begin{small}\\textbf{\\textit{Step 1:}}\\end{small}  Reorder current equations\r\n";
    TeXData += "\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n\r\n";
    // Render it to LaTeX
    str = katex.renderToString(str, {throwOnError: false});
    // Place the equations inside a scroll menu
    htmlstr += '<div class="scrollmenu mt-2 mb-2"><span>'+ str + '</span></div></div>';

    let obj = {
        first: htmlstr,
        second: TeXData
    }
    return obj;
}

/**
 * Function to output equation system STEP 2
 * @param {object} currents currents object
 * @returns {string} HTML string
 */
function outStep2(currents){
    // Create HTML string
    let htmlstr = '';
    let TeXData = "";
    // Generate the collapse panel
    htmlstr += '<div class="collapse multi-collapse col-xs-12" id="step2Panel">';
    // Generate equation system
    let str = '\\large \\begin{cases}';
    for(let k = 0; k<currents.length; k++){
        str += currents[k] ;
        if(k<currents.length-1)
            str += ' \\\\[0.7em] ';
    }
    str += '\\end{cases}';
    TeXData += "\\begin{small}\\textbf{\\textit{Step 2:}}\\end{small}  Substitute the known currents\r\n";
    TeXData += "\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n\r\n"
    // Render it to LaTeX
    str = katex.renderToString(str, {throwOnError: false});
    // Place the equations inside a scroll menu
    htmlstr += '<div class="scrollmenu mt-2 mb-2"><span>'+ str + '</span></div></div>';

    let obj = {
        first: htmlstr,
        second: TeXData
    }
    return obj;

}

/**
 * Function to output equation system STEP 3
 * @param {object} allCurrents currents object
 * @param {object} varCurrents necessary currents object
 * @returns {string} HTML string
 */
function outStep3(allCurrents, varCurrents){
    // Create HTML String
    let htmlstr = '';
    let TeXData = "";
    let neededIDs = new Array();
    let ohmEquations = new Array();
    // Find the ID's of the necessary current equations
    for( let i = 0; i< varCurrents.length; i++){
        for(let k = 0; k< varCurrents[i].currents.length; k++){
            neededIDs.push(varCurrents[i].currents[k].id);
        }
    }
    // Remove duplicated IDs
    neededIDs = [...new Set(neededIDs)];

    // Cycle through IDs
    for(let i = 0; i<neededIDs.length; i++){
        // Find current index
        let index = allCurrents.findIndex(item => item.ref == neededIDs[i]);
        if(allCurrents[index].value == null){
            // Parse current equation to TeX
            let tex = math.parse(allCurrents[index].ohmEquation.plainEq).toTex();
            // Split by fraction
            eq = tex.split('}{');
            eq = eq[0];
            // Substitute node with node voltage 
            eq = eq.replace(allCurrents[index].noP,"V_{"+allCurrents[index].noP+"}");
            eq = eq.replace(allCurrents[index].noN,"V_{"+allCurrents[index].noN+"}");
            let eq2 = tex.split('}{');
            // Join the equation
            eq2 = neededIDs[i] + " = " + eq + "}{" + eq2[1];
            // Fix signals
            eq2 = fixEquation(eq2);
            let obj = {
                id: neededIDs[i],
                ohmEQ: eq2
            };
            // Add equation and Id object
            ohmEquations.push(obj);
        }
        else{
            // remove currents without an Ohm equation
            neededIDs.splice(i,1);
            i--;
        }
    }

    // Create collapse panel
    htmlstr += '<div class="collapse multi-collapse col-xs-12" id="step3Panel">';
    // Create equation system
    let str = '\\large \\begin{cases}';
    for(let k = 0; k<ohmEquations.length; k++){
        str += ohmEquations[k].ohmEQ ;
        if(k < ohmEquations.length-1)
            str += ' \\\\[0.7em] ';
    }
    str += '\\end{cases}';
    TeXData += "\\begin{small}\\textbf{\\textit{Step 3:}}\\end{small}  Compute the remaining currents using Ohm's Law\r\n";
    TeXData += "\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n\r\n";
    // Render it to TeX
    str = katex.renderToString(str, {throwOnError: false});
    // Place equations inside a scroll menu
    htmlstr += '<div class="scrollmenu mt-2 mb-2"><span>'+ str + '</span></div></div>';

    let obj = {
        first: htmlstr,
        second: TeXData
    }
    return obj;
}

/**
 * Function to output equation system STEP 4
 * @param {String Array} equations KNL Equations (without substitutions)
 * @param {object} realNodes circuit nodes
 * @returns {string} HTML string
 */
function outStep4(equations, realNodes){
    // Create HTML String
    let htmlstr = '';
    let TeXData = "";
    // Create collapse panel
    htmlstr += '<div class="collapse multi-collapse col-xs-12" id="step4Panel">';
    // Create equation system
    let str = '\\large \\begin{cases}';
    for(let k = 0; k<equations.length; k++){
        let eqStr = equations[k];
        // Split equation members
        eqStr = eqStr.split("=");
        eqStr = eqStr[0];
        // Parse first member
        eqStr = math.parse(eqStr).toTex();
        // Fix signals
        eqStr = fixEquation(eqStr);
        // Add second member again
        eqStr += " = 0";
        // Replace nodes with their voltages
        eqStr = nodesToVoltagesTex2(eqStr,realNodes);
        // Add equation to cases
        str += eqStr;
        if(k<equations.length-1)
            str += ' \\\\[0.7em] ';
    }
    str += '\\end{cases}';
    TeXData += "\\begin{small}\\textbf{\\textit{Step 4:}}\\end{small}  Substitute each current by its equation\r\n";
    TeXData += "\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n\r\n";
    // Render system to tex
    str = katex.renderToString(str, {throwOnError: false});
    // Place equations inside a scroll menu
    htmlstr += '<div class="scrollmenu mt-2 mb-2"><span>'+ str + '</span></div></div>';

    let obj = {
        first: htmlstr,
        second: TeXData
    }
    return obj;
}

/**
 * Function to output equation system STEP 5
 * @param {String Array} equations KNL Equations (with substitutions)
 * @param {object} realNodes circuit nodes
 * @returns {string} HTML string
 */
function outStep5(equations, realNodes){
    // Create HTML String
    let htmlstr = '';
    let TeXData = "";
    // Create collapse panel
    htmlstr += '<div class="collapse multi-collapse col-xs-12" id="step5Panel">';
    // Create equation system
    let str = '\\large \\begin{cases}';
    for(let k = 0; k<equations.length; k++){
        let eqStr = equations[k];
        // Split equation members
        eqStr = eqStr.split("=");
        eqStr = eqStr[0];
        // Parse first member
        eqStr = math.parse(eqStr);
        // Simplify first member
        eqStr = math.simplify(eqStr).toTex();
        // Fix signals
        eqStr = fixEquation(eqStr);
        // Add second member again
        eqStr += " = 0";
        // Replace nodes with their voltages
        for(let i = 0; i < realNodes.length; i++){        
            eqStr = eqStr.replace(new RegExp(realNodes[i], 'g'),"V_{"+realNodes[i]+'}');
        }
        // Add equation to cases
        str += eqStr;
        if(k<equations.length-1)
            str += ' \\\\[0.7em] ';
    }
    str += '\\end{cases}';
    TeXData += "\\begin{small}\\textbf{\\textit{Step 5:}}\\end{small}  Replace the constants with their value\r\n";
    TeXData += "\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n\r\n";
    // Render system to tex
    str = katex.renderToString(str, {throwOnError: false});
    // Place equations inside a scroll menu
    htmlstr += '<div class="scrollmenu mt-2 mb-2"><span>'+ str + '</span></div></div>';
    
    let obj = {
        first: htmlstr,
        second: TeXData
    }
    return obj;
}

/**
 * Function to output equation system STEP 6
 * @param {object} supernodes supernodes data object
 * @param {object} unknowns system unknowns
 * @returns {string} HTML string
 */
function outStep6(supernodes, unknowns){
    // Create HTML String
    let htmlstr = '';
    let TeXData = "";
    // Only add the panel if there exist floating supernodes
    if(supernodes.filter(function(item) {return  item.type === 1;}).length == 0){
        let obj = {
            first: "",
            second: ""
        }
        return obj;
    }
    
    let snRefandIds = new Array();

    // Cycle through the supernodes
    for(let i = 0; i < supernodes.length; i++){
        // Check if it is floating
        if(supernodes[i].type == 1){
            // Cycle through nodes
            for(let k = 0; k< supernodes[i].nodes.length; k++){
                // Search for the unknowns
                if(unknowns.includes(supernodes[i].nodes[k].ref)){
                    let obj = {
                        snID: supernodes[i].ref,
                        ref: supernodes[i].nodes[k].ref
                    }
                    snRefandIds.push(obj);
                    break;
                }
            }
        }
    }

    TeXData += "\\begin{small}\\textbf{\\textit{Step 6:}}\\end{small} Set a reference for each floating supernode\r\n\\newline\r\n";
    // Create collapse panel
    htmlstr = '<div class="collapse multi-collapse col-xs-12" id="step6Panel">';
    // Add supernode Reference and Chosen Unknown
    for(let i = 0; i< snRefandIds.length; i++){
        htmlstr += '<div class="col-xs-12 mt-2 mb-2"><i class="fas fa-hand-point-right mr-2 ml-2"></i>';
        htmlstr += '<span class="lead" style="white-space:nowrap" data-translate="_eqStep6.4"></span>';
        htmlstr += '<h5 class="text-dark ml-1 mr-1" style="display:inline-block"> ' + snRefandIds[i].snID + ' </h5>';
        htmlstr += '<span class="lead" style="white-space:nowrap" data-translate="_eqStep6.5"></span>';
        htmlstr += '<h5 class="text-dark ml-1 mr-1" style="display:inline-block"><strong> ' + snRefandIds[i].ref + ' </strong></h5>';
        htmlstr += '<span class="lead" style="white-space:nowrap" data-translate="_eqStep6.6"></span></div>';
        TeXData += "\\paragraph{} In supernode \\textbf{"+ snRefandIds[i].snID +"} the node \\textbf{" + snRefandIds[i].ref + "} was chosen as a reference. \\\\\r\n";
    }
    // Add extra user information
    htmlstr += '<div class="p-1" style="background-color: #ffffcc; border-left: 6px solid #ffeb3b;">';
    htmlstr += '<i class="fas fa-sticky-note mr-2 ml-1"></i><h5 class="mt-2 mb-2" style="display:inline-block" data-translate="_notes"><strong></h5>';
    htmlstr += '<p  class="mt-1 mb-1 ml-5"><i class="fas fa-eye mr-2"></i><strong>';
    htmlstr += '<span data-translate="_eqStep6.1"></span></p>';
    htmlstr += '<p  class="mt-1 mb-1 ml-5"><i class="fas fa-eye mr-2"></i><strong>';
    htmlstr += '<span data-translate="_eqStep6.2"></span></p>';
    htmlstr += '<p  class="mt-1 mb-1 ml-5"><i class="fas fa-eye mr-2"></i><strong>';
    htmlstr += '<span data-translate="_eqStep6.3"></span></p>';

    // Close Panel
    htmlstr += '</div></div>';

    TeXData += "\\newline\r\n\\begin{footnotesize}\r\n\\textbf{\\textit{Notes:}} \\\\\r\n \\begin{itemize}";
    TeXData += "\\item The voltage of each node from a floating supernode must be expressed as a function of the reference node. \\\\\r\n";
    TeXData += "\\item In the Supernodes section, you can confirm that node equations are already referenced to the chosen node. \\\\\r\n";
    TeXData += "\\item Use these expressions to perform the substitution in the equation system.\\end{itemize}\r\n\\end{footnotesize}\r\n\r\n\r\n";

    let obj = {
        first: htmlstr,
        second: TeXData
    }
    return obj;
}

    
/**
 * Function to output the Final Equation System and every step
 * @param {String Array} simpEquations simplified equation system
 * @param {string} strStep1 HTML String for step 1
 * @param {string} strStep2 HTML String for step 2
 * @param {string} strStep3 HTML String for step 3
 * @param {string} strStep4 HTML String for step 4
 * @param {string} strStep5 HTML String for step 5
 * @param {string} strStep6 HTML String for step 6
 * @returns {string} first: HTML String with results
 */
function outEquationSystem(simpEquations,strStep1, strStep2, strStep3, strStep4, strStep5, strStep6){

    // HTML String
    let htmlstr = '';
    let TeXData = "";
    if(simpEquations.length > 0){

        htmlstr += '<div class="container mt-3">';
        htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_eqSystemTitle"></h5></div></div>';
        htmlstr += '<div id="gndTip"></div>';
        htmlstr += '<div class="container mt-3"><div class="row" id="equationSystem">';

        // Add card
        htmlstr += '<div class="col-sm-12"><div class="card bg-light mb-3">';
        // Create Show Steps Collapse Button
        let btnstr ='<button class="btn btn-primary btn-md lead ml-3 mt-2 mb-1" type="button" data-toggle="collapse" data-target="#collapseEquations"';
        btnstr += ' aria-expanded="false" data-translate="_snStepsBtn"></button>';
        // Add card body
        htmlstr += '<div class="card-body text-secondary mt-2 mb-2">';
        // Create TeX equations
        str = '\\large \\begin{cases}';
        for(let k = 0; k<simpEquations.length; k++){
            str += simpEquations[k] + ' = 0';
            if(k < simpEquations.length-1)
                str += '\\\\[0.7em] ';

        }
        str += '\\end{cases}';
        TeXData += " Equations:\r\n\\begin{gather*}\r\n"+str+"\r\n\\end{gather*}\r\n\\par\r\n\r\n\\paragraph{} ";
        // Render to TeX
        str = katex.renderToString(str, {throwOnError: false});
        // Generate equation system
        htmlstr += '<div class="row">';
        htmlstr += '<div class="scrollmenu mt-2 mb-2"><span>'+ str + '</span></div></div>';
        // Add steps button
        htmlstr += '<div class="row mb-2"><div class="card-text text-center">' + btnstr +'</div></div>';


        /************** STEPS ****************/

        let plusIcon = '<i class="fas fa-plus ml-1"></i>';

        // Create collapse panel
        htmlstr += '<div class="collapse multi-collapse" id="collapseEquations">';
        
        // STEP #1 
        btnstr  = '<button class="btn collapsed border bg-warning btn-warning btn-sm float-right mt-1 mb-1 mr-1" ';
        btnstr += 'id="btn-1" data-toggle="collapse" data-target="#step1Panel';
        btnstr += '" aria-expanded="false"><span class="lead" data-translate="_ShowHowBtn"></span>'+ plusIcon + '</button>';
        // Add card
        htmlstr += '<div class="card card-header border-0 mb-2 bg-light">';
        htmlstr += '<div class="row bg-success rounded">';
        // Add step text
        htmlstr += '<div class="col-xs-9 d-flex align-items-center col-md"><h5 class="ml-2 text-light"><span data-translate="_step"></span> 1:';
        htmlstr += '&nbsp;&nbsp;<small class="text-light lead" data-translate="_eqStep1"></small></h5></div>';
        // Add button
        htmlstr += '<div class="col-xs-3 ml-auto">'+btnstr+'</div></div>';
        // Add Step results
        htmlstr += strStep1 +'</div>';

        // STEP #2
        btnstr  = '<button class="btn collapsed border bg-warning btn-warning btn-sm float-right mt-1 mb-1 mr-1" ';
        btnstr += 'id="btn-2" data-toggle="collapse" data-target="#step2Panel';
        btnstr += '" aria-expanded="false"><span class="lead" data-translate="_ShowHowBtn"></span>'+ plusIcon + '</button>';
        // Add card
        htmlstr += '<div class="card card-header border-0 mb-2 bg-light">';
        htmlstr += '<div class="row bg-success rounded">';
        // Add step text
        htmlstr += '<div class="col-xs-9 d-flex align-items-center col-md"><h5 class="ml-2 text-light"><span data-translate="_step"></span> 2:';
        htmlstr += '&nbsp;&nbsp;<small class="text-light lead" data-translate="_eqStep2"></small></h5></div>';
        // Add button
        htmlstr += '<div class="col-xs-3 ml-auto">'+btnstr+'</div></div>';
        // Add Step results
        htmlstr += strStep2 +'</div>';

        // STEP #3
        btnstr  = '<button class="btn collapsed border bg-warning btn-warning btn-sm float-right mt-1 mb-1 mr-1" ';
        btnstr += 'id="btn-3" data-toggle="collapse" data-target="#step3Panel';
        btnstr += '" aria-expanded="false"><span class="lead" data-translate="_ShowHowBtn"></span>'+ plusIcon + '</button>';
        // Add card
        htmlstr += '<div class="card card-header border-0 mb-2 bg-light">';
        htmlstr += '<div class="row bg-success rounded">';
        // Add step text
        htmlstr += '<div class="col-xs-9 d-flex align-items-center col-md"><h5 class="ml-2 text-light"><span data-translate="_step"></span> 3:';
        htmlstr += '&nbsp;&nbsp;<small class="text-light lead" data-translate="_eqStep3"></small></h5></div>';
        // Add button
        htmlstr += '<div class="col-xs-3 ml-auto">'+btnstr+'</div></div>';
        // Add Step results
        htmlstr += strStep3 +'</div>';

        // STEP #4
        btnstr  = '<button class="btn collapsed border bg-warning btn-warning btn-sm float-right mt-1 mb-1 mr-1" ';
        btnstr += 'id="btn-4" data-toggle="collapse" data-target="#step4Panel';
        btnstr += '" aria-expanded="false"><span class="lead" data-translate="_ShowHowBtn"></span>'+ plusIcon + '</button>';
        // Add card
        htmlstr += '<div class="card card-header border-0 mb-2 bg-light">';
        htmlstr += '<div class="row bg-success rounded">';
        // Add step text
        htmlstr += '<div class="col-xs-9 d-flex align-items-center col-md"><h5 class="ml-2 text-light"><span data-translate="_step"></span> 4:';
        htmlstr += '&nbsp;&nbsp;<small class="text-light lead" data-translate="_eqStep4"></small></h5></div>';
        // Add button
        htmlstr += '<div class="col-xs-3 ml-auto">'+btnstr+'</div></div>';
        // Add Step results
        htmlstr += strStep4 +'</div>';

        // STEP #5
        btnstr  = '<button class="btn collapsed border bg-warning btn-warning btn-sm float-right mt-1 mb-1 mr-1" ';
        btnstr += 'id="btn-5" data-toggle="collapse" data-target="#step5Panel';
        btnstr += '" aria-expanded="false"><span class="lead" data-translate="_ShowHowBtn"></span>'+ plusIcon + '</button>';
        // Add card
        htmlstr += '<div class="card card-header border-0 mb-2 bg-light">';
        htmlstr += '<div class="row bg-success rounded">';
        // Add step text
        htmlstr += '<div class="col-xs-9 d-flex align-items-center col-md"><h5 class="ml-2 text-light"><span data-translate="_step"></span> 5:';
        htmlstr += '&nbsp;&nbsp;<small class="text-light lead" data-translate="_eqStep5"></small></h5></div>';
        // Add button
        htmlstr += '<div class="col-xs-3 ml-auto">'+btnstr+'</div></div>';
        // Add Step results
        htmlstr += strStep5 +'</div>';

        // STEP #6
        if(strStep6.length > 1){

            btnstr  = '<button class="btn collapsed border bg-warning btn-warning btn-sm float-right mt-1 mb-1 mr-1" ';
            btnstr += 'id="btn-6" data-toggle="collapse" data-target="#step6Panel" ';
            btnstr += 'aria-expanded="false"><span class="lead" data-translate="_ShowHowBtn"></span>'+ plusIcon + '</button>';
            // Add card
            htmlstr += '<div class="card card-header border-0 mb-2 bg-light">';
            htmlstr += '<div class="row bg-success rounded">';
            // Add step text
            htmlstr += '<div class="col-xs-9 d-flex align-items-center col-md"><h5 class="ml-2 text-light"><span data-translate="_step"></span> 6:';
            htmlstr += '&nbsp;&nbsp;<small class="text-light lead" data-translate="_eqStep6.0"></small></h5></div>';
            // Add button
            htmlstr += '<div class="col-xs-3 ml-auto">'+btnstr+'</div></div>';
            // Add Step results
            htmlstr += strStep6 +'</div>';
        }

        // Close collapse panel
        htmlstr += "</div>";
    
        // Close card and card-body divs
        htmlstr += '</div></div></div></div>';
    }

    let obj = {
        first: htmlstr,
        second: TeXData
    }
    return obj;

}

/**
 * Function to output circuit results: node voltages and currents
 * @param {object} results node voltages data
 * @param {object} currents currents data
 * @returns {string} HTML string
 */
function outResults(results, currents){


    // Create HTML String
    let htmlstr = '';
    let TeXData = "";
    // Filter currents from Current Sources (without equation)
    let ACCurrents     = currents.filter(function(item) {return  item.fromAC === true;});
    // Filter currents by direct (with Ohm Eq.)
    let directCurrents =   currents.filter(function(item) {return  item.fromSN === false;});
    directCurrents = directCurrents.filter(function(item) {return  item.fromAC === false;});
    // Filter currents from supernodes (computed with KNL Eq.)
    let SNCurrents     = currents.filter(function(item) {return  item.fromSN === true;});

    // Create Container
    htmlstr += '<div class="container print-block"><div class="row print-block">';

    /*****************************************************************************************
     * ********************************* NODE VOLTAGES ***************************************
     * ***************************************************************************************/

    // Add card for node voltages
  
    htmlstr += '<div class="col-sm-12 col-lg-6 no-page-break"><div class="card bg-light mb-3">';
    htmlstr += '<div class="card-header rounded text-light bg-warning d-flex align-items-center justify-content-center" style="opacity:0.9">';
    htmlstr += '<h6 class="lead" data-translate="_nodeVoltages"></h6></div>';
    htmlstr += '<div class="card-body text-secondary mt-1 mb-1">';

    // Add Equation system
    let str = '\\large \\begin{cases}';
    for(let k = 0; k<results.length; k++){
        // Generate Equation
        if(results[k].value.includes('i')){
            let complex = math.complex(results[k].value);
            complex = complex.toPolar();
            complex.phi = complex.phi * (180/Math.PI);
            complex.phi = +complex.phi.toFixed(3);
            complex.r = +complex.r.toFixed(3);
            str += "V_{" + results[k].node + "} = " + complex.r + "\\angle " + complex.phi + "^{\\circ}" + "\\;" + results[k].unit;
        }
        else{
        str += "V_{" + results[k].node + "} = " + results[k].value + "\\;" + results[k].unit;
        }
        if(k<results.length-1)
            str += ' \\\\[0.7em] ';
    }
    str += '\\end{cases}';
    // Parse system to TeX
    TeXData += "\\subsection{Node Voltages}\r\n\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n\r\n";
    str = katex.renderToString(str, {throwOnError: false});
    // Place system inside scroll menu
    htmlstr += '<div class="scrollmenu mt-2 mb-2"><span>'+ str + '</span></div>';
    // Close Node Voltages Card
    htmlstr += '</div></div></div>';

    /*****************************************************************************************
     * ********************************* CIRCUIT CURRENTS ************************************
     * ***************************************************************************************/

    // Add card for currents
    htmlstr += '<div class="col-sm-12 col-lg-6 print-block"><div class="card bg-light mb-3">';
    htmlstr += '<div class="card-header rounded text-light bg-warning d-flex align-items-center justify-content-center no-page-break" style="opacity:0.9">';
    htmlstr += '<h6 class="lead" data-translate="_currents"></h6></div>';
    htmlstr += '<div class="card-body text-secondary mt-1 mb-1 print-block">';

    /******* Add first currents type (COMPUTED FROM SOURCES) *********/
    TeXData += "\\subsection{Branch Currents}\r\n";
    if(ACCurrents.length > 0){
        // Create expressions
        str = '\\large \\begin{cases}';
        for(let k = 0; k<ACCurrents.length; k++){
            str += ACCurrents[k].ref + " = " + ACCurrents[k].value + "\\;" + ACCurrents[k].unit
            if(k<ACCurrents.length-1)
                str += ' \\\\[0.7em] ';
        }
        str += '\\end{cases}';
        TeXData += "\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n";
        TeXData += "\\begin{footnotesize}\r\n\\textbf{\\textit{Note: }} ";
        TeXData += " These currents were obtained by an existing current source in their branch.\r\n\\end{footnotesize}\r\n\r\n";

        // Render System to TeX
        str = katex.renderToString(str, {throwOnError: false});
        // Add Notes
        htmlstr += '<div class="card p-1 mb-0 no-page-break" style="background-color: #ffffcc; border-left: 6px solid #ffeb3b;">';
        htmlstr += '<div class="container-fluid"><div class="d-flex flex-row">';
        htmlstr += '<div class="ml-1 mt-1"><i class="fas fa-sticky-note"></i></div>';
        htmlstr += '<div class="ml-1"><strong><p data-translate="_currResNotes1"></p></strong></div>';
        htmlstr += '</div></div></div>'
        // Add equations in a scroll menu
        htmlstr += '<div class="scrollmenu mt-2 mb-3 no-page-break"><span>'+ str + '</span></div>';

    }

    /******* Add second currents type (COMPUTED FROM OHM EQUATIONS) *********/
    if(directCurrents.length > 0){
        // Create Equations
        str = '\\large \\begin{cases}';
        for(let k = 0; k<directCurrents.length; k++){
            str += directCurrents[k].eq;
            if(k<directCurrents.length-1)
                str += ' \\\\[0.7em] ';
        }
        str += '\\end{cases}';
        str += ' \\Leftrightarrow';
        // Create Expressions
        str += '\\large \\begin{cases}';
        for(let k = 0; k<directCurrents.length; k++){
            // Convert to polar
            if(directCurrents[k].value.includes('i')){
                let complex = math.complex(directCurrents[k].value);
                complex = complex.toPolar();
                complex.phi = complex.phi * (180/Math.PI);
                complex.phi = +complex.phi.toFixed(3);
                complex.r = +complex.r.toFixed(3);
                str += directCurrents[k].ref + " = " + complex.r + "\\angle " + complex.phi + "^{\\circ}" + "\\;" + directCurrents[k].unit;
            }
            else{
                str += directCurrents[k].ref + " = " + directCurrents[k].value + "\\;" + directCurrents[k].unit;
            }
            if(k<directCurrents.length-1)
                str += ' \\\\[0.7em] ';
        }
        str += '\\end{cases}';

        TeXData += "\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n";
        TeXData += "\\begin{footnotesize}\r\n\\textbf{\\textit{Note: }} ";
        TeXData += " These currents were obtained by their Ohm's Law equation.\r\n\\end{footnotesize}\r\n\r\n"
        // Render System to TeX
        str = katex.renderToString(str, {throwOnError: false});
        // Add Notes
        htmlstr += '<div class="card p-1" style="background-color: #ffffcc; border-left: 6px solid #ffeb3b;">';
        htmlstr += '<div class="container-fluid"><div class="d-flex flex-row">';
        htmlstr += '<div class="ml-1 mt-1"><i class="fas fa-sticky-note"></i></div>';
        htmlstr += '<div class="ml-1"><strong><p data-translate="_currResNotes2"></p></strong></div>';
        htmlstr += '</div></div></div>'
        // Add equations in a scroll menu
        htmlstr += '<div class="scrollmenu mt-2 mb-3"><span>'+ str + '</span></div>';
    }

     /******* Add third currents type (COMPUTED FROM KNL EQUATIONS) *********/
     if(SNCurrents.length > 0){
        // Create Equations
        str = '\\large \\begin{cases}';
        for(let k = 0; k<SNCurrents.length; k++){
            str += SNCurrents[k].eq;
            if(k<SNCurrents.length-1)
                str += ' \\\\[0.7em] ';
        }
        str += '\\end{cases}';
        str += ' \\Leftrightarrow';
        // Create Expressions
        str += '\\large \\begin{cases}';
        for(let k = 0; k<SNCurrents.length; k++){
            if(SNCurrents[k].value.includes('i')){
                let complex = math.complex(SNCurrents[k].value);
                complex = complex.toPolar();
                complex.phi = complex.phi * (180/Math.PI);
                complex.phi = +complex.phi.toFixed(3);
                complex.r = +complex.r.toFixed(3);
                str += SNCurrents[k].ref + " = " + complex.r + "\\angle " + complex.phi + "^{\\circ}" + "\\;" + SNCurrents[k].unit;
            }
            else{
            str += SNCurrents[k].ref + " = " + SNCurrents[k].value + "\\;" + SNCurrents[k].unit;
            }
            if(k<SNCurrents.length-1)
                str += ' \\\\[0.7em] ';
        }
        str += '\\end{cases}';
        TeXData += "\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n";
        TeXData += "\\begin{footnotesize}\r\n\\textbf{\\textit{Note: }} ";
        TeXData += " These currents were obtained by their KNL equation, since they belong to branches with isolated voltage sources.\r\n\\end{footnotesize}\r\n\r\n";

        // Render System to TeX
        str = katex.renderToString(str, {throwOnError: false});
        // Add Notes
        htmlstr += '<div class="card p-1" style="background-color: #ffffcc; border-left: 6px solid #ffeb3b;">';
        htmlstr += '<div class="container-fluid"><div class="d-flex flex-row">';
        htmlstr += '<div class="ml-1 mt-1"><i class="fas fa-sticky-note"></i></div>';
        htmlstr += '<div class="ml-1"><strong><p data-translate="_currResNotes3"></p></strong></div>';
        htmlstr += '</div></div></div>'
        // Add equations in a scroll menu
        htmlstr += '<div class="scrollmenu mt-2 mb-3"><span>'+ str + '</span></div>';
    }

    // Close Currents Card
    htmlstr += '</div></div></div>';

    // Close results panel
    htmlstr += '</div></div>';
    
    let obj = {
        first: htmlstr,
        second: TeXData
    }

    return obj;
}

/**
 * Function to output a tip for the best ground position
 * @param {object} bestGndPos nodes for the best gnd position
 * @returns {string} HTML string
 */
function outGndTip(bestGndPos){
    let htmlstr = '';
    htmlstr += '<div class="container mt-2">';
    htmlstr += '<div class="alert alert-dismissible fade show" style="background-color: #D3FFBB; border-left: 6px solid #8CE85A;">';
    htmlstr += '<i class="fas fa-lightbulb mr-2 ml-1"></i>';
    htmlstr += '<strong><span class="mt-2 mb-2" style="display:inline-block" data-translate="_tipGnd"></span>';
    htmlstr += '<span class="mt-2 mb-2" style="display:inline-block">&nbsp;';
    
    for(let i = 0; i< bestGndPos.length; i++){
        htmlstr += bestGndPos[i].sNodesRef.join(', ') + ', ';
        if( i == bestGndPos.length-1)
            htmlstr = htmlstr.slice(0,htmlstr.lastIndexOf(','))+htmlstr.slice(htmlstr.lastIndexOf(',')+1);
    }
    htmlstr += '</span></strong>';
    htmlstr += '<button type="button" class="close" data-dismiss="alert">&times;</button></div></div>';
 
    return htmlstr;
}


/**
 * Function to draw an arrow in HTML canvas
 * @param {number} fromx Start X coordinate
 * @param {number} fromy Start Y coordinate
 * @param {number} tox   End   X coordinate
 * @param {number} toy   End   Y coordinate
 * @param {string} style HEX RGB Color
 * @param {string} elemID HTML DOM element ID
 
 */
function drawArrow(fromx, fromy, tox, toy, style, elemID){
    // Access element context in HTML DOM
    let c = document.getElementById(elemID);
    let ctx = c.getContext("2d");
    // Arrow Head config
    let headlen = 5;
    // Compute arrow angle
    let angle = Math.atan2(toy-fromy,tox-fromx);

    // Starting path of the arrow 
    ctx.beginPath();
    // Going from the start square to the end square
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    // Stroke parameters
    ctx.strokeStyle = style;
    ctx.lineWidth = 2;
    // Draw the stroke
    ctx.stroke();

    // Start new path for the arrow's head
    ctx.beginPath();
    ctx.moveTo(tox, toy);
    // Path to one of the sides of the point
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));

    // Path from the side point of the arrow, to the other side point
    ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),toy-headlen*Math.sin(angle+Math.PI/7));

    // Path from the side point back to the tip of the arrow, and then again to the opposite side point
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));

    // Draws the paths
    ctx.strokeStyle = style;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = style;
    // Fill the arrow
    ctx.fill();
}

/**
 * Function to replace the nodes with their voltages in TeX Format
 * Multiple Equations / Only Substitutes Variables inside /mathrm
 * @param {string Array} equations equation strings
 * @returns {string Array} new equations
 */
function nodesToVoltagesTex(equations, realNodes){

    for(let i = 0; i< equations.length; i++){
        let streg = '\mathrm';
        let indexes = [...equations[i].matchAll(new RegExp(streg, 'gi'))].map(a => a.index);
        for(let k = 0; k< indexes.length; k++){
            let node = equations[i][indexes[k]+7];
            indexes[k] += 8;
            while(equations[i][indexes[k]] != "}"){
                node+=equations[i][indexes[k]];
                indexes[k]++;
            }
            let str1 = "\mathrm{"+node+"}";
            let str2 = "\mathrm{V_{"+node+"}}";
            equations[i] = equations[i].replace(str1,str2);
            indexes = indexes.map(a => a+4);
        }
    }

    for(let i = 0; i<equations.length; i++){
        for(let j = 0; j< realNodes.length; j++){
            let streg = realNodes[j];
            let indexes = [...equations[i].matchAll(new RegExp(streg, 'g'))].map(a => a.index);
            for(let k = 0; k< indexes.length; k++){
                if(equations[i][indexes[k]-2]!='_' && equations[i][indexes[k]-3]!='V'){
                    let str = equations[i].slice(indexes[k],indexes[k]+realNodes[j].length);
                    if(str == str.toUpperCase() || str.length>1){
                        equations[i] = equations[i].slice(0,indexes[k]) + 'V_{'+realNodes[j]+'}'+ equations[i].slice(indexes[k]+realNodes[j].length);
                        indexes = indexes.map(a => a+4);
                    }
                }
            }
        }
    }

    // Replace any remaining Nodes
    // for(let i = 0; i<equations.length; i++){
    //    for(let k = 0; k<equations[i].length; k++){
    //        if(realNodes.includes(equations[i][k]) && 
    //        (equations[i][k-1]!='{' || equations[i][k-2]!='_' || equations[i][k+1]!='}')){
    //             equations[i] = equations[i].slice(0,k-1)+" V_{"+equations[i][k]+"}"+equations[i].slice(k+1);
    //             k=0;
    //        }
    //    }
    // }
    
    return equations;
}

/**
 * Function to replace the nodes with their voltages in TeX Format
 * Single Equation / Replaces all the real nodes
 * @param {string} equation equation strings
 * @param {string Array} realNodes circuit nodes
 * @returns {string} new equation
 * @note NODES CANT BE in Lower Case or will be replaced with TeX Elements
 */

function nodesToVoltagesTex2(equation, realNodes){

    let finalString = '';

    // Get Fractions beginnings
    let streg = 'frac';
    let begins = [...equation.matchAll(new RegExp(streg, 'gi'))].map(a => a.index);
    let ends = new Array();
    // Find fraction ends
    let fracStrings = new Array();
    for(let i = 0; i< begins.length; i++){
        let parenthesis = 0;
        let strIndex = begins[i];
        let startCnt = 0;
        let fraction = '';
        while(parenthesis >= 0){
            if(equation[strIndex] == "{" && startCnt == 0)
                startCnt = 1;
            else if(equation[strIndex] == "{" && startCnt == 1)
                parenthesis++;
            else if(equation[strIndex] == "}")
                parenthesis--;
        
            fraction += equation[strIndex];
            strIndex++;
        }
        ends.push(strIndex);    
        fracStrings.push(fraction);

    }

    // Do the changes in Nodes
    
    // Rebuild string
    finalString = equation.substring(0, begins[0]);
    for(let k = 0; k<fracStrings.length; k++){
        for(let i = 0; i< realNodes.length; i++){
            let instances = [...fracStrings[k].matchAll(new RegExp(realNodes[i], 'g'))].map(a => a.index);
            if(instances.length>1)
                console.log("ERROR: Could not substitute Node "+realNodes[i]+" by its its voltage");
            else if(instances.length>0){
                fracStrings[k] = fracStrings[k].replace(realNodes[i],"V_{"+realNodes[i]+"}"); 
            }
        }                
        if(k == fracStrings.length-1)
            finalString +=  fracStrings[k] + equation.substring(ends[k]);
        else{
            finalString +=  fracStrings[k] + equation.substring(ends[k],begins[k+1]);
        }   
    }
    return finalString;
}

/**
 * Function to fix the equation signals after the math parse
 * @param {string} string equation string
 * @returns {string} fixed equation
 */
function fixEquation(string){
    string = string.split('+ -').join(' - ');
    string = string.split('- -').join(' + ');
    string = string.split('--').join(' + ');
    string = string.split('+-').join(' - ');
    return string;
}

/**
 * Function to remove the large decimals
 * @param {string} equation equation string
 * @param {number} decPlaces decimal places to round
 * @returns {string} fixed equation
 */
function fixDecimals(equation, decPlaces){

    // Instanciate the regex
    var reg = /\./g;
    // Results array
    var indexes = new Array();
    // Find all occurrences
    while (reg.exec(equation)){
        indexes.push(reg.lastIndex-1);
    }

    for(let i = 0; i < indexes.length; i++){
        // Find Decimal
        let inc = 1;
        let cnt = 0;
        let nrOfDec = 0;
        // Avoid zeros
        while(equation[indexes[i]+inc] == '0')
            inc++;
        // Count decimal places
        while(!isNaN(parseInt(equation[indexes[i]+inc+cnt])))
            cnt++;
        // Fix decimal places to 3
        if(cnt > 3){
            inc += decPlaces;
            if(equation[indexes[i]+inc] >= 5)
                equation[indexes[i]+inc-1] = (parseInt(equation[indexes[i]+inc-1])+1).toString();
            while(!isNaN(parseInt(equation[indexes[i]+inc])))
                equation = equation.slice(0,indexes[i]+inc) + equation.slice(indexes[i]+inc+1); 
            // Update Indexes
            indexes = [];
            while (reg.exec(equation)){
                indexes.push(reg.lastIndex-1);
            }
        }
    }

    return equation;
}


/**
 * Function to create the output html sections
 * @returns {string} HTML string
 */
function outHTMLSections(){

    let htmlstr = '';

    // Warnings section
    htmlstr += '<div id="errors"></div><div id="warnings"></div><div id="circuitImage"></div>';
    htmlstr += '<div id= "contResults">';  
    htmlstr += '<div class="row"><div class="container"><div id="buttonShowAll"></div></div></div>';
    
    // Fundamental variables
    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_fundamentalsTitle"></h5></div></div>';
    htmlstr += '<div class="container mt-3" id="fundamentalVars"></div><div class="container mt-3">';

    // Circuit information
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_infoTitle"></h5></div></div>';
    htmlstr += '<div class="container mt-3" id="circuitInfo"></div>';

    // Supernodes
    htmlstr += '<div id="supernodes"></div>';

    // Currents data
    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_currents"></h5></div></div>';
    htmlstr += '<div class="container mt-3" id="currentsInfo"></div>';

    // Equivalent impedances
    htmlstr += '<div id="eqImpedances"></div>';

    // KNL equations
    htmlstr += '<div id="KNLEquations"></div>';

    // Equation System
    htmlstr += '<div id="eqSys"></div>';

    // Results
    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_res"></h5></div></div>';
    htmlstr += '<div class="container mt-3" id="resultsVoltages"></div></div>';
    
    return htmlstr;
}

/**
 * Function to create the output html sections in MSF
 * @returns {string} HTML string
 */
 function outHTMLSections_MSF(){

    let htmlstr = '';

    // Warnings section
    htmlstr += '<div id="errors"></div><div id="warnings"></div><div id="circuitImage"></div>';
    htmlstr += '<div id= "contResults">';  
    htmlstr += '<div class="row"><div class="container"><div id="buttonShowAll"></div></div></div>';
    
   
    // Output Meshes
    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="container mt-3" id="msf_finder"></div><div class="container mt-3">';

    return htmlstr;
}


function outShowAllBtn(supernodesCollapse){
    
    // Create Show All Collapse Button
    let showAllbtn = '<button class="btn btn-primary btn-md lead float-right" id="showALL" type="button" data-toggle="collapse" ';
    showAllbtn += 'data-target=".multi-collapse" aria-expanded="false" ';
    showAllbtn += 'aria-controls="collapseR collapseN collapseT collapseE collapseF collapseA collapseAmp collapseType ';
    for(let i = 0; i< supernodesCollapse.length; i++){
        showAllbtn += supernodesCollapse[i] + ' ';
    }

    showAllbtn += 'collapseEquations step1Panel step2Panel step3Panel step4Panel step5Panel step6Panel" ';
    showAllbtn += '><i class="fas fa-expand-arrows-alt mr-2"></i><span data-translate="_showAllBtn"></span></button>';

    return showAllbtn;

}


function getTexFileHeader(){
    let texHeader = '';
    texHeader = "\\documentclass[a4paper]{article}\r\n\\usepackage{graphicx}\r\n\\usepackage[latin1]{inputenc}\r\n\\usepackage{amsmath}\r\n\\usepackage{fancyhdr}\r\n\\pagestyle{fancy}\r\n\\lhead{\\textsc{URIsolve App}}\r\n\\rhead{\\textsc{Node Voltage Method (Supernode approach)}}\r\n\\cfoot{www.isep.ipp.pt}\r\n\\lfoot{DEE - ISEP}\r\n\\rfoot {\\thepage}\r\n\\renewcommand{\\headrulewidth}{0.4pt}\r\n\\renewcommand{\\footrulewidth}{0.4pt}\r\n\r\n\\title{\r\n\\raisebox{-.2\\height}{\\includegraphics[height=1cm, keepaspectratio]{logo}} URIsolve APP \\\\\r\n\\newline\r\n\\textsc{Node Voltage Method} \\\\\r\n\\textsc{(Supernode approach)} \\\\\r\nStep by Step Solution \\\\\r\n\\vspace*{1\\baselineskip}\r\n}\r\n\r\n\\author{\r\n\\begin{tabular}[t]{c@{\\extracolsep{8em}}c}\r\nLino Sousa           & M\u00E1rio Alves          \\\\\r\nsss@isep.ipp.pt  & mjf@isep.ipp.pt      \\\\\r\n\t\t\t\t\t &                      \\\\\r\nAndr\u00E9 Rocha          & Francisco Pereira    \\\\\r\nanr@isep.ipp.pt      & fdp@isep.ipp.pt      \\\\\r\n\\end{tabular}\r\n}\r\n\r\n\\date{}\r\n\r\n";

    texHeader += "\\begin{document}\r\n\r\n\\maketitle\r\n\\thispagestyle{empty}\r\n\r\n\\vspace{\\fill}\r\n\\begin{abstract}\r\n\\centering\r\nThis document provides a step by step solution for the submitted circuit, using the Node Voltage Method (NVM). If possible, it's implemented the Supernode approach to simplify the circuit analysis.\r\n\\end{abstract}\r\n\\vspace{\\fill}\r\n\r\n\\begin{center}\r\n\\today\r\n\\end{center}\r\n\r\n\\clearpage\r\n\\pagenumbering{arabic}\r\n\r\n\\newpage\r\n\r\n";
    return texHeader;
}

function resizeandgray(imgObj) {
    var canvas = document.createElement('canvas');
    var canvasContext = canvas.getContext('2d');
     
    var imgW = imgObj.width;
    var imgH = imgObj.height;
    var sizer=1;
    if(imgW > 1200 || imgH > 650)
        sizer = Math.min((1200/imgW),(650/imgH));

    canvas.width = imgW*sizer;
    canvas.height = imgH*sizer;

    canvasContext.drawImage(imgObj, 0, 0, canvas.width, canvas.height);
    var imgPixels = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
     
    for(var y = 0; y < imgPixels.height; y++){
        for(var x = 0; x < imgPixels.width; x++){
            var i = (y * 4) * imgPixels.width + x * 4;
            var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
            imgPixels.data[i] = avg; 
            imgPixels.data[i + 1] = avg; 
            imgPixels.data[i + 2] = avg;
        }
    }
    canvasContext.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
    return canvas.toDataURL();
}


//function to hide all sections but U=RIsolve Academy
function showAcademy() {
    document.getElementById("topct").style.display = "none";
    document.getElementById("instructions").style.display = "none";
    document.getElementById("examples").style.display = "none";
    const element = document.getElementById("academy");
    element.scrollIntoView();
  //  document.getElementById("topct").style.display = "none";
}

function showAll (sec){
    document.getElementById("topct").style.display = "block";
    document.getElementById("instructions").style.display = "block";
    document.getElementById("examples").style.display = "block";
    if(sec==1){
        const element = document.getElementById("instructions");
        element.scrollIntoView();}
    else if (sec==2){
        const element = document.getElementById("examples");
        element.scrollIntoView();}
    else{
        const element = document.getElementById("topct");
        element.scrollIntoView();}

}

