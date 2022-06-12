
//TODO delete when final version 
/**
 * Function to output the circuit nr of meshes
 * @param {number} file output json
 */
 function outVersion(file){
    let versionNumber = file.app.version;
    let details = file.app.details;

    let htmlstr = '';

    htmlstr += '<div class="container print-block"><div class="row print-block">';
    htmlstr += '<div class="col-sm-12 col-lg-6-40 no-page-break"><div class="card bg-light mb-3">';
    htmlstr += '<div class="card-body text-secondary mt-1 mb-1">';
    htmlstr += '<div class="text-center" mt-2 mb-2"><span >V'+ versionNumber + '</span></div>';
    htmlstr += '<div class="text-center" mt-2 mb-2"><span >'+ details + '</span></div>';
    htmlstr += '</div></div>';    

    return htmlstr;
}


//BUILD MODAL INFORMATION
/**
 * Function to output the circuit fundamental variables
 * @param {number} file output file
 */
 function outCircuitFundamentalsMCM(file){  

    let R = file.branches.length;
	let N = countNodesByType(file.nodes, 0);
	let C = file.components.acAmpsPs.length + file.components.dcAmpsPs.length;
	let T = file.components.isolatedVPS.length;

    //Buttons  Variables
    let accIDs = ["accBranches", "accNodes", "accSources", "accEquations"];
    let btnStyle = ["btn-info", "btn-info", "btn-info", "btn-info"];
    let panStyle = ["bg-info", "bg-info", "bg-info", "bg-info"];
    let btncollapse = ["collapseR", "collapseN", "collapseC", "collapseE"];

    let btnType = ["R", "N", "C", "T"];
    let btnContent = new Array();
    
    
    // TeX Content
    btnContent.push(katex.renderToString("\\small R = " + R, {throwOnError: false}));
    btnContent.push(katex.renderToString("\\small N = " + N, {throwOnError: false}));
    btnContent.push(katex.renderToString("\\small C = " + C, {throwOnError: false}));
    btnContent.push(katex.renderToString("\\small T = " + T, {throwOnError: false}));
    

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
 * @param {object} file output json
 */
 function outCircuitInfoMCM(file){

    let F = file.analysisObj.circuitFreq;
	let totalCurrents = file.analysisObj.currents.length;
	let Amps = file.probes.ammeters.length;
    
    //Buttons  Variables
    let accIDs = ["accType", "accFreq", "accVsources"];
    let btnStyle = ["btn-warning", "btn-warning", "btn-warning"];
    let btncollapse = ["collapseF", "collapseA", "collapseAmp"];
    let btnType = ["T", "F","A"];
    let panStyle = ["bg-warning", "bg-warning", "bg-warning"];
    let btnContent = new Array();
    // TeX Content
    let fstring = '';
    if(F.value == 0)
        fstring = "\\small -\\;";
    else
    fstring = "\\small F = " + F.value.toString()+ "\\;" + F.mult;

    let ampstring = "\\small " + Amps.toString() + "\\;/\\;" + totalCurrents.toString();
    let typestring = '';
    if(F.value == 0) typestring = "DC"; else typestring = "AC";
    
    btnContent.push(katex.renderToString("\\small "+ typestring, {throwOnError: false}));
    btnContent.push(katex.renderToString(fstring, {throwOnError: false}));
    btnContent.push(katex.renderToString(ampstring, {throwOnError: false}));
    

    let htmlstr = '<div class="row">';
    // Collapse Panels
    for(let i = 0; i<3; i++){

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
 * Function to output the circuit nr of meshes
 * @param {number} file output json
 */
function outEquationCalcMCM(file){

    let R = file.branches.length;
	let N = countNodesByType(file.nodes, 0);
	let C = file.components.acAmpsPs.length + file.components.dcAmpsPs.length;

    let E = R - (N - 1) - C;

    let htmlstr = '';

    htmlstr += '<div class="container print-block"><div class="row print-block">';
    htmlstr += '<div class="col-sm-12 col-lg-6-40 no-page-break"><div class="card bg-light mb-3">';
    htmlstr += '<div class="card-header rounded text-light bg-warning d-flex align-items-center justify-content-center" style="opacity:0.9">';
    htmlstr += '<h6 class="lead" data-translate="_equationsNrCalculus"></h6></div>';
    htmlstr += '<div class="card-body text-secondary mt-1 mb-1">';
    str = "M_{p} = R - (N - 1) - C \\Leftrightarrow \\\\ \\Leftrightarrow M_{p} = " + R + "- (" + N + " - 1) - " + C + "\\Leftrightarrow \\\\ \\Leftrightarrow M_{p} = " + E ;
    str = katex.renderToString(str, {throwOnError: false});
    htmlstr += '<div class="text-center" mt-2 mb-2"><span >'+ str + '</span></div>';
    htmlstr += '</div>';

    
    htmlstr += '<div class="card p-1" style="background-color: #ffffcc; border-left: 6px solid #ffeb3b;">';
    htmlstr += '<div class="container-fluid"><div class="d-flex flex-row">';
    htmlstr += '<div class="ml-1 mt-1"><i class="fas fa-sticky-note"></i></div>';
    htmlstr += '<div class="ml-1"><strong><p data-translate="_nrOfEquations"></p></strong></div>';
    htmlstr += '</div></div></div></div></div>'

    htmlstr += '<div class="container print-block"><div class="row print-block">';
    htmlstr += '<div class="col-sm-12 col-lg-6-40 no-page-break"><div class="card bg-light mb-3">';
    htmlstr += '<div class="card-header rounded text-light bg-warning d-flex align-items-center justify-content-center" style="opacity:0.9">';
    htmlstr += '<h6 class="lead" data-translate="_MCMEqAux"></h6></div>';
    htmlstr += '<div class="card-body text-secondary mt-1 mb-1">';
    str = "C = " + C + "\\implies  M_{a} = " + C;
    str = katex.renderToString(str, {throwOnError: false});
    htmlstr += '<div class="text-center" mt-2 mb-2"><span >'+ str + '</span></div>';
    htmlstr += '</div>';

    htmlstr += '<div class="card p-1" style="background-color: #ffffcc; border-left: 6px solid #ffeb3b;">';
    htmlstr += '<div class="container-fluid"><div class="d-flex flex-row">';
    htmlstr += '<div class="ml-1 mt-1"><i class="fas fa-sticky-note"></i></div>';
    htmlstr += '<div class="ml-1"><strong><p data-translate="_nrOfCurrSrc"></p></strong></div>';
    htmlstr += '</div></div></div></div></div>'
    

    return htmlstr;
}
/**
 * outputs the meshes
 * @param {Array} branchObjs branches
 * @param {Array} meshesObjs meshes
 */
function outMeshesMCM(branchObjs, meshesObjs){
    const Xspacing = 30;
    const Yspacing = 15;
    const width = 100;
    const height = 60;
    let originX = 0;
    let originY = 25;

    //define Window Width and Height
    let WindowHeight = meshesObjs.length*(height + Yspacing+originY);

    //Max spacing on bottom line
    let aux = Xspacing;
    if(aux > 20) aux = 20;
    
    let htmlstr = '';
    //Draw meshes
    for(let i = 0; i < meshesObjs.length; i++){
        let containerId = 'Mesh' + meshesObjs[i].id;
        let type;
        let color;
        if(meshesObjs[i].type == 0){
            type = 'A';
            color = "#629af5";
        }
        else{
            type = 'P';
            color = "#F73232";
        }

        htmlstr +='<div class="col-sm-12 mt-3" style = "margin: auto;"><div class="card bg-light mb-3">'
        htmlstr += '<div class="card-body text-secondary">';
        htmlstr += '<h5 class="card-title ml-3 text-center border rounded-top"><span data-translate="_kmlMesh"></span>';
        htmlstr += '<span class="font-weight-bold text-dark"> &nbsp;&nbsp;'+meshesObjs[i].id + '&nbsp;-&nbsp; </span><span style = "color: ' + color + '" data-translate="_type'+ type +'"></h5>';
        htmlstr += '<div class = "text-center scrollmenu">';
        htmlstr += '<div class = "text-center" id="'+containerId+'"></div>';

        htmlstr += '<p class="text-center" id="equation'+containerId+'">';
        if(meshesObjs[i].type == 1) htmlstr += katex.renderToString("I_{M"+meshesObjs[i].id+"}~:~"+meshesObjs[i].incognitoEq, {throwOnError: false});
        else{
            if(meshesObjs[i].currValue.complex){
                let resultMag = resultDecimals(Math.sqrt(Math.pow(meshesObjs[i].currValue.re, 2) + Math.pow(meshesObjs[i].currValue.im, 2)), 2, false);
                let resultAng = resultDecimals(Math.atan(meshesObjs[i].currValue.im/meshesObjs[i].currValue.re)*57.2957795, 2, true);
                htmlstr += katex.renderToString("I_{M"+meshesObjs[i].id+"}~:~"+ resultMag.value + '\\angle ' + resultAng.value + '^{\\circ}\\;' + resultMag.unit +'A', {throwOnError: false});  
            }
            else{
                let result = resultDecimals(meshesObjs[i].currValue.value, 2, false);
                htmlstr += katex.renderToString("I_{M"+meshesObjs[i].id+"}~:~"+result.value+result.unit+"A", {throwOnError: false});  
            }
        }

        htmlstr += '</p></div></div></div></div>';   
    }
    $('#Meshes').html(htmlstr);


	let lang = document.getElementById("lang-sel-txt").innerText.toLowerCase();

    for(let i = 0; i < meshesObjs.length; i++){
        let containerId = '#Mesh' + meshesObjs[i].id;
        let cnt = 0;
        meshesObjs[i].branches.forEach(branch => {
            cnt++;
        });
        let WindowWidth = cnt*width+(cnt+1)*Xspacing+2+10+originX;
        createMesh(meshesObjs[i], branchObjs, width, height, WindowWidth, WindowHeight, Xspacing, Yspacing, originX, originY, aux, containerId, lang);
    }
    

    let images = new Array;

    let svgStrings = document.querySelectorAll("svg"); 

    for(let i = 0; i < meshesObjs.length; i++){
        let data = "data:image/svg+xml;base64,";
        let svgString = new XMLSerializer().serializeToString(svgStrings[i]);
        let base64 = window.btoa(svgString);
        let dataURI = data + base64;

        let cnt = 0;
        meshesObjs[i].branches.forEach(branch => {
            cnt++;
        });
        let WindowWidth = cnt*width+(cnt+1)*Xspacing+2+10+originX;

        images.push({
            imageData: dataURI,
            id: meshesObjs[i].id,
            width: WindowWidth,
            height: height+aux+Yspacing+originY+2
        });

    }
    return images;
}
/**
 * Function to output equation system STEP 1
 * @param {object} currents currents object
 * @returns {string} HTML string
 */
 function outStep1MCM(currents){
    // Create HTML string
    let htmlstr = '';
    // Generate the collapse panel
    htmlstr += '<div class="collapse multi-collapse col-xs-12" id="step1Panel">';
    // Generate equation system
    let str = '\\large \\begin{cases}';
    for(let k = 0; k<currents.allVariableEq.length; k++){
        str += currents.allVariableEq[k];
        if(k<currents.allVariableEq.length-1)
            str += ' \\\\[0.7em] ';

    }
    str += '\\end{cases}';

    // Render it to LaTeX
    str = katex.renderToString(str, {throwOnError: false});
    // Place the equations inside a scroll menu
    htmlstr += '<div class="scrollmenu mt-2 mb-2"><span>'+ str + '</span></div></div>';

    return htmlstr;
}
/**
 * Function to output equation system STEP 2
 * @param {object} currents currents object
 * @returns {string} HTML string
 */
 function outStep2MCM(currents){
    // Create HTML string
    let htmlstr = '';
    // Generate the collapse panel
    htmlstr += '<div class="collapse multi-collapse col-xs-12" id="step2Panel">';
    // Generate equation system
    let str = '\\large \\begin{cases}';
    for(let k = 0; k<currents.meshCurrRevealedEq.length; k++){
        str += currents.meshCurrRevealedEq[k];
        if(k<currents.meshCurrRevealedEq.length-1)
            str += ' \\\\[0.7em] ';

    }
    str += '\\end{cases}';

    // Render it to LaTeX
    str = katex.renderToString(str, {throwOnError: false});
    // Place the equations inside a scroll menu
    htmlstr += '<div class="scrollmenu mt-2 mb-2"><span>'+ str + '</span></div></div>';

    return htmlstr

}
/**
 * Function to output equation system STEP 2
 * @param {object} currents currents object
 * @returns {string} HTML string
 */
 function outStep3MCM(currents){
    // Create HTML string
    let htmlstr = '';
    // Generate the collapse panel
    htmlstr += '<div class="collapse multi-collapse col-xs-12" id="step3Panel">';
    // Generate equation system
    let str = '\\large \\begin{cases}';
    for(let k = 0; k<currents.allRevealedEq.length; k++){
        str += currents.allRevealedEq[k];
        if(k<currents.allRevealedEq.length-1)
            str += ' \\\\[0.7em] ';

    }
    str += '\\end{cases}';

    // Render it to LaTeX
    str = katex.renderToString(str, {throwOnError: false});
    // Place the equations inside a scroll menu
    htmlstr += '<div class="scrollmenu mt-2 mb-2"><span>'+ str + '</span></div></div>';

    return htmlstr;

}
/**
 * Function to output the Final Equation System and every step
 * @param {String Array} simpEquations simplified equation system
 * @param {string} strStep1 HTML String for step 1
 * @param {string} strStep2 HTML String for step 2
 * @param {string} strStep3 HTML String for step 3
 * @returns {string} first: HTML String with results
 */
 function outEquationSystemMCM(simpEquations, strStep1, strStep2, strStep3){

    // HTML String
    let htmlstr = '';
    if(simpEquations.allVariableEq.length > 0){

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

        let str = '\\large \\begin{cases}';
        for(let k = 0; k<simpEquations.allRevealedEq.length; k++){
            str += simpEquations.allRevealedEq[k];
            if(k < simpEquations.allRevealedEq.length-1)
                str += '\\\\[0.7em] ';
    
        }
        str += '\\end{cases}';
        // Render to TeX
        str = katex.renderToString(str, {throwOnError: false});
        // Generate equation system
        htmlstr += '<div class="row">';
        htmlstr += '<div class="scrollmenu mt-2 mb-2"><span>'+ str + '</span></div></div>';
        // Add steps button
        htmlstr += '<div class="row mb-2"><div class="card-text text-center">' + btnstr +'</div></div>';


        //************** STEPS ****************

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
        htmlstr += '&nbsp;&nbsp;<small class="text-light lead" data-translate="_eqStep1MCM"></small></h5></div>';
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
        htmlstr += '&nbsp;&nbsp;<small class="text-light lead" data-translate="_eqStep2MCM"></small></h5></div>';
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
        htmlstr += '&nbsp;&nbsp;<small class="text-light lead" data-translate="_eqStep3MCM"></small></h5></div>';
        // Add button
        htmlstr += '<div class="col-xs-3 ml-auto">'+btnstr+'</div></div>';
        // Add Step results
        htmlstr += strStep3 +'</div>';

        // Close collapse panel
        htmlstr += "</div>";
    
        // Close card and card-body divs
        htmlstr += '</div></div></div></div>';
    }

    return htmlstr;

}
/**
 * Function to output circuit mesh currents
 * @param {object} file output json file
 * @returns {string} HTML string
 */
 function outResultsMeshesMCM(file){

    let meshes = file.analysisObj.chosenMeshes;

    // Create HTML String
    let htmlstr = '';

    // Create Container
    htmlstr += '<div class="container print-block"><div class="row print-block">';
    
    //********************************* MESH CURRENTS **************************************

    // Add card for Mesh Currents
  
    htmlstr += '<div class="col-sm-12 col-lg-6-40 no-page-break"><div class="card bg-light mb-3">';
    htmlstr += '<div class="card-header rounded text-light bg-warning d-flex align-items-center justify-content-center" style="opacity:0.9">';
    htmlstr += '<h6 class="lead" data-translate="_meshCurrents"></h6></div>';
    htmlstr += '<div class="card-body text-secondary mt-1 mb-1">';

    // Add Equation system
    let str = '\\large \\begin{cases}';
    for(let k = 0; k<meshes.length; k++){
        // Generate Equation
        if(meshes[k].currValue.complex){ //malha é complexa
            let resultAng = resultDecimals(meshes[k].currValue.angle, 2, true);
            let resultMag = resultDecimals(meshes[k].currValue.magnitude, 2, false);
            if(resultMag.value == 0){
                str += "I_{M" + meshes[k].id + "} = " + resultMag.value + resultMag.unit + '~A\\\\';
            }
            else{
                str += "I_{M" + meshes[k].id + "} = " + resultMag.value + '\\angle{} ' + resultAng.value + '^{\\circ{}}\\;' + resultMag.unit + 'A\\\\';
            }
        }
        else{ //malha é real
            let result = resultDecimals(meshes[k].currValue.value, 2, false);
            str += "I_{M" + meshes[k].id + "} = " + result.value + result.unit + 'A\\\\';
        }
        if(k<results.length-1)
            str += ' \\\\[0.7em] ';
    }
    str += '\\end{cases}';


    // Parse system to TeX
    str = katex.renderToString(str, {throwOnError: false});
    // Place system inside scroll menu
    htmlstr += '<div class="scrollmenu mt-2 mb-2"><span>'+ str + '</span></div>';
    // Close Node Voltages Card
    htmlstr += '</div></div></div>';

    return htmlstr;
}
/**
 * Creates branch block info
 * @param {object} number 
 * @param {object} targetDec number of desired decimal places
 * @param {boolean} isangle if number is an angle (should not compute units)
 * @returns object number: number, 
 */
function resultDecimals(number, targetDec, isangle){
    let negative = false;
    let char;
	let language = document.getElementById("lang-sel-txt").innerText.toLowerCase();
	if(language == "english")
		char = ".";
	else	
		char = ",";

    let str = String(number);

    if(str.charAt(0) == '-'){
        str = str.slice(1);
        negative = true;
    }

    let commaIndex = str.indexOf(".");
    if(commaIndex == -1){
        str += '.';
        commaIndex = str.indexOf(".");
    }

    str += '000000000000';

    str = str.replace('.', '');

    let copyStr = str;
    let zeroCount = 0;
    while(true){
        if(copyStr.charAt(0) != 0) break;
        if(copyStr.charAt(0) == ''){
            zeroCount = 0;
            break;
        }
        else{
            copyStr = copyStr.slice(1);
            zeroCount++;
        }
    }

    let mult = '';
    let index = 0;
    if(zeroCount > 0 && zeroCount <= 3){
        index = 3;
        mult = 'm';
    }
    else if(zeroCount > 3 && zeroCount <= 6){
        index = 6;
        mult = 'u';
    }
    else if(zeroCount > 6){
        index = 9;
        mult = 'p';
    }
    else if(zeroCount == 0){
        index = commaIndex-1;
        mult = '';
    }

    if(isangle){
        index = commaIndex-1;
    }
    str = String(Number(str.slice(0, index+1) + "." + str.slice(index+1)).toFixed(targetDec)).replace(".", char);

    if(negative){
        str = '-' + str;
    }
    
    while(true){
        if(str.charAt(str.length-1) != '0'){
            if(str.charAt(str.length-1) == '.' || str.charAt(str.length-1) == ',') str = str.slice(0, -1);
            break; 
        } 
        else{
            str = str.slice(0, -1);
        }
    }

    if(isangle) mult = '';

    return{
        value: str,
        unit: mult
    };


}
/**
 * Create Show All Collapse Button
 * @returns object number: number, 
 */
function outShowAllBtnMCM(){
    
    // Create Show All Collapse Button
    let showAllbtn = '<button class="btn btn-primary btn-md lead float-right" id="showALL" type="button" data-toggle="collapse" ';
    showAllbtn += 'data-target=".multi-collapse" aria-expanded="false" ';
    showAllbtn += 'aria-controls="collapseR collapseN collapseT collapseE collapseF collapseA collapseAmp collapseType ';

    showAllbtn += 'collapseEquations step1Panel step2Panel step3Panel step4Panel step5Panel step6Panel" ';
    showAllbtn += '><i class="fas fa-expand-arrows-alt mr-2"></i><span data-translate="_showAllBtn"></span></button>';

    return showAllbtn;

}
/**
 * Function to create the output html sections
 * @returns {string} HTML string
 */
 function outHTMLSectionsMCM(){

    let htmlstr = '';

    // Warnings section
    htmlstr += '<div id="errors"></div><div id="warnings"></div><div id="circuitImage"></div>';
    htmlstr += '<div id= "contResults">';  
    htmlstr += '<div class="row"><div class="container"><div id="buttonShowAll"></div></div></div>';
    
    //remove this block after testing
    //version
    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3">Debug - Version</h5></div></div>';
    htmlstr += '<div class="container mt-3" id="version"></div><div class="container mt-3">';
    
    // Fundamental variables
    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_fundamentalsTitle"></h5></div></div>';
    htmlstr += '<div class="container mt-3" id="fundamentalVars"></div><div class="container mt-3">';

    // Circuit information
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_infoTitle"></h5></div></div>';
    htmlstr += '<div class="container mt-3" id="circuitInfo"></div>';

    //Method Equations
    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_MeshNumberTitle"></h5></div></div>';
    htmlstr += '<div class="container mt-3" id="meshEquations"></div>';

    //Meshes
    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_MeshTitle"></h5></div></div>';
    htmlstr += '<div class="container mt-3" id="Meshes"></div>';

    // Equation System
    htmlstr += '<div id="eqSys"></div>';

    // Results Mesh currents
    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_resMesh"></h5></div></div>';
    htmlstr += '<div class="container mt-3" id="resultsCurrentsMesh"></div></div>';

    // Currents data
    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_currents"></h5></div></div>';
    htmlstr += '<div class="container mt-3" id="currentsInfo"></div>';

    // Results
    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_resBranch"></h5></div></div>';
    htmlstr += '<div class="container mt-3" id="resultsCurrentsBranch"></div></div>';
    
    return htmlstr;
}

//BUILD TEX FILE FOR RICH PDF
/**
 * Function to build the TeX header
 * @returns {string} TeX string
 */
 function getTexFileHeaderMCMRich(){
    let texHeader = '';
    texHeader = "\\documentclass[a4paper]{article}\r\n\\usepackage{graphicx}\r\n\\usepackage[latin1]{inputenc}\r\n\\usepackage{amsmath}\r\n\\usepackage{fancyhdr}\r\n\\pagestyle{fancy}\r\n\\lhead{\\textsc{URIsolve App}}\r\n\\rhead{\\textsc{Mesh Current Method}}\r\n\\cfoot{www.isep.ipp.pt}\r\n\\lfoot{DEE - ISEP}\r\n\\rfoot {\\thepage}\r\n\\renewcommand{\\headrulewidth}{0.4pt}\r\n\\renewcommand{\\footrulewidth}{0.4pt}\r\n\r\n\\title{\r\n\\raisebox{-.2\\height}{\\includegraphics[height=1cm, keepaspectratio]{logo}} URIsolve APP \\\\\r\n\\newline\r\n\\textsc{Mesh Current Method} \\\\\r\n \\\\\r\nStep by Step Solution \\\\\r\n\\vspace*{1\\baselineskip}\r\n}\r\n\r\n\\author{\r\n\\begin{tabular}[t]{c@{\\extracolsep{8em}}c}\r\nLino Sousa           & M\u00E1rio Alves          \\\\\r\nsss@isep.ipp.pt  & mjf@isep.ipp.pt      \\\\\r\n\t\t\t\t\t &                      \\\\\r\nAndr\u00E9 Rocha          & Francisco Pereira    \\\\\r\nanr@isep.ipp.pt      & fdp@isep.ipp.pt      \\\\\r\n\\end{tabular}\r\n}\r\n\r\n\\date{}\r\n\r\n";

    texHeader += "\\begin{document}\r\n\r\n\\maketitle\r\n\\thispagestyle{empty}\r\n\r\n\\vspace{\\fill}\r\n\\begin{abstract}\r\n\\centering\r\nThis document provides a step by step solution for the submitted circuit, using the Mesh Current Method (MCM).\r\n\\end{abstract}\r\n\\vspace{\\fill}\r\n\r\n\\begin{center}\r\n\\today\r\n\\end{center}\r\n\r\n\\clearpage\r\n\\pagenumbering{arabic}\r\n\r\n\\newpage\r\n\r\n";
    return texHeader;
}
/**
 * Function to create the output TeX
 * @param {object} file json output
 * @param {array} meshImages image information
 * @returns {string} TeX string
 */
function buildTeXRich(file, meshImages){

	let R = file.branches.length;
	let N = countNodesByType(file.nodes, 0);
	let C = file.components.acAmpsPs.length + file.components.dcAmpsPs.length;
	let T = file.components.isolatedVPS.length;
	let F = file.analysisObj.circuitFreq;
	let totalCurrents = file.analysisObj.currents.length;
	let Amps = file.probes.ammeters.length;
	let E = R - (N - 1) - C;
	let simpEquations =  file.analysisObj.equations;
	let meshes = file.analysisObj.chosenMeshes;

	let currents = file.analysisObj.currents;
	let branches =  file.branches;

	// Tex Variable
	let TeX = getTexFileHeaderMCMRich();

	if(fileContents[0]){
		// Add Image to Tex
		TeX += "\\section{Circuit Image}\r\n\r\n\\begin{figure}[hbt]\r\n\\centering{";
		TeX += "\\includegraphics[width=\\textwidth, keepaspectratio]{circuit}}\r\n\\caption{";
		TeX += "Circuit image}\r\n\\label{circuitimage}\r\n\\end{figure}\r\n\r\n";
	}

	// TeX Fundamental Vars
	TeX += "\\section{Fundamental Variables}\r\n\r\n\\begin{table}[hbt!]\r\n\\centering\r\n\\begin{tabular}{clclclc}\r\n";
	TeX += "\\textbf{Branches {[}R{]}}&&\\textbf{Nodes {[}N{]}}&&\\textbf{Current Sources {[}C{]}}&&\\textbf{Isolated Voltage Sources {[}T{]}} \\\\\r\n";
	TeX += "R="+R+"&&N="+N+"&&C="+C+"&&T="+T+"\r\n\\end{tabular}\r\n\\end{table}\r\n\r\n";

	// TeX Circuit Information
	TeX += "\\section{Circuit Information}\r\n\r\n\\begin{table}[h!]\r\n\\centering\r\n\\begin{tabular}{clclclc}\r\n";
	TeX += "\\textbf{Simulation {[}AC\/DC{]}} && \\textbf{Circuit Frequency {[}A{]}} && \\textbf{Ammeters {[}I{]}} \\\\\r\n";
	if(F.value == 0){
			TeX += "DC";
			aux = "&&N~/~A\\;";
	}
	else{
		TeX += "AC";
		aux = "&&F="+F.value+"\\;"+F.mult;
	}

	TeX += aux;

	TeX += " & & "+Amps+"\/"+totalCurrents+"\r\n\\end{tabular}\r\n\\end{table}\r\n";

	//meshes calculation
    TeX += "\\section{Number of Meshes}\r\n\r\n\\subsection{Main Meshes}\r\n\r\n";
    TeX += "\\begin{gather*}\r\nM_{p}=R-(N-1)-C ~ \\Leftrightarrow \\\\";
    TeX += "M_{p}="+R+"-("+N+"-1)-"+C+" ~ \\Leftrightarrow \\\\";
	TeX += "\\Leftrightarrow ~ M_{p}="+E+"\\end{gather*}\r\n\\par\r\n\r\n";
	TeX += "\\paragraph{} The number of Main meshes will be the number of needed equations\r\n";
    TeX += "\r\n\\subsection{Auxiliar Meshes}\r\n\r\n";
    TeX += "\\paragraph{} The number of Auxiliar Meshes it's the same as the number of Current Sources:\r\n";
    TeX += "\\begin{gather*}\r\nC = " + C + "\\implies  M_{a} = " + C+"\r\n\\end{gather*}\r\n\\pagebreak";

	//circuit mesh images
	let pagebreakCounter = 0;
	TeX += "\\section{Circuit Meshes}\r\n\r\n";
	meshImages.forEach(image => {
		let aux;
		if(meshes[image.id-1].type == 0) aux = "Auxiliar";
		else aux = "Main";
		TeX += "\\subsection{Mesh~" + image.id + "~-~" + aux + "}\r\n"
		TeX += "\\begin{figure}[hbt]\r\n\\centering{\\includegraphics[height=4cm, keepaspectratio]{"
		TeX += "meshImage" + image.id + "}}\r\n\r\n\\end{figure}\r\n";
        if(meshes[image.id-1].type == 1) TeX += "\\begin{equation}\r\n \\textrm{Equation}: \\quad I_{M"+ meshes[image.id-1].id+"}~:~" + meshes[image.id-1].incognitoEq +"&\r\n\\end{equation}\r\n\r\n";
        else{
            if(meshes[image.id-1].currValue.complex){
				let resultMag = resultDecimals(Math.sqrt(Math.pow(meshes[image.id-1].currValue.re, 2) + Math.pow(meshes[image.id-1].currValue.im, 2)), 2, false);
				let resultAng = resultDecimals(Math.atan(meshes[image.id-1].currValue.im/meshes[image.id-1].currValue.re)*57.2957795, 2, true);
                TeX += "\\begin{equation}\r\n \\textrm{Value}: \\quad I_{M"+meshes[image.id-1].id+"}~:~"+ resultMag.value + '\\angle ' + resultAng.value + '^{\\circ}\\;' + resultMag.unit + 'A&\r\n\\end{equation}\r\n\r\n';  
            }
            else{
				let result = resultDecimals(meshes[image.id-1].currValue.value)
                TeX += "\\begin{equation}\r\n \\textrm{Value}: \\quad I_{M" + meshes[image.id-1].id+"}~:~" + result.value + result.unit + "A&\r\n\\end{equation}\r\n\r\n";  
            }		
		}
		pagebreakCounter++;
        if(pagebreakCounter == 2){
            pagebreakCounter = 0;
            TeX += "\\pagebreak";
        }

	});


	//equation system
	TeX += "\\pagebreak\\section{Equation System}\r\n\r\n\\paragraph{} ";

	let str = '\\large \\begin{cases}';
	for(let k = 0; k<simpEquations.allRevealedEq.length; k++){
		str += simpEquations.allRevealedEq[k];
		if(k < simpEquations.allRevealedEq.length-1)
			str += '\\\\[0.7em] ';

	}
	str += '\\end{cases}';
	TeX += " Equations:\r\n\\begin{gather*}\r\n"+str+"\r\n\\end{gather*}\r\n\\par\r\n\r\n\\paragraph{} ";

	TeX += "Steps:\r\n\r\n";
	//step 1
	 str = '\\large \\begin{cases}';
    for(let k = 0; k<simpEquations.allVariableEq.length; k++){
        str += simpEquations.allVariableEq[k];
        if(k<simpEquations.allVariableEq.length-1)
            str += ' \\\\[0.7em] ';

    }
    str += '\\end{cases}';
    TeX += "\\begin{small}\\textbf{\\textit{Step 1:}}\\end{small}  Initial equation system\r\n";
    TeX += "\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n\r\n";
	//step 2
	str = '\\large \\begin{cases}';
    for(let k = 0; k<simpEquations.meshCurrRevealedEq.length; k++){
        str += simpEquations.meshCurrRevealedEq[k];
        if(k<simpEquations.meshCurrRevealedEq.length-1)
            str += ' \\\\[0.7em] ';

    }
    str += '\\end{cases}';
    TeX += "\\begin{small}\\textbf{\\textit{Step 2:}}\\end{small}  Substitute the mesh current values\r\n";
    TeX += "\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n\r\n"
	//step 3
	str = '\\large \\begin{cases}';
    for(let k = 0; k<simpEquations.allRevealedEq.length; k++){
        str += simpEquations.allRevealedEq[k];
        if(k<simpEquations.allRevealedEq.length-1)
            str += ' \\\\[0.7em] ';

    }
    str += '\\end{cases}';
    TeX += "\\begin{small}\\textbf{\\textit{Step 3:}}\\end{small}  Substitute the circuit component values\r\n";
    TeX += "\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n\r\n";

	// Add Equation system
	str = '\\large \\begin{cases}';
	for(let k = 0; k<meshes.length; k++){
		// Generate Equation
        if(meshes[k].currValue.complex){ //malha é complexa
            let resultMag = resultDecimals(Math.sqrt(Math.pow(meshes[k].currValue.re, 2) + Math.pow(meshes[k].currValue.im, 2)), 2, false);
            let resultAng = resultDecimals(Math.atan(meshes[k].currValue.im/meshes[k].currValue.re)*57.2957795, 2, true);
			if(resultMag.value == 0){
                str += "I_{" + meshes[k].id + meshes[k].id + "} = " + resultMag.value + resultMag.unit + '~A\\\\';
            }
            else{
                str += "I_{" + meshes[k].id + meshes[k].id + "} = " + resultMag.value + '\\angle{} ' + resultAng.value + '^{\\circ{}}\\;' + resultMag.unit + 'A\\\\';
            }
        }
        else{ //malha é real
            let result = resultDecimals(meshes[k].currValue.value, 2, false);
            str += "I_{" + meshes[k].id + meshes[k].id + "} = " + result.value + result.unit + 'A\\\\';
        }
		if(k<results.length-1)
			str += ' \\\\[0.7em] ';
	}
	str += '\\end{cases}';

	TeX += "\\par\r\n\r\n\\pagebreak\r\n\r\n\\section{Results}\r\n\r\n";
	TeX += "\\subsection{Mesh Currents}\r\n\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n\r\n";

	//mesh current results
	TeX += "\\section{Circuit Currents}\r\n\r\n\\subsection{General information}\r\n\r\n";
	TeX += "\\begin{table}[ht]\r\n\\caption{List of the circuit currents and its properties\/components}\r\n\\centering\r\n\\begin{tabular}{cccc}\r\n";
	TeX += "\\textbf{Reference} & \\textbf{Start Node} & \\textbf{End Node} & \\textbf{Components} \\\\ \\hline\r\n";

	for( let i = 0; i < currents.length; i++){
		let branchIndex = branches.findIndex(item => item.currentId == currents[i].id);

		TeX += currents[i].ref + " & " + currents[i].noP + " & " + currents[i].noN + " & ";

		// Add Components
		for(let k = 0; k < branches[branchIndex].acAmpPwSupplies.length; k++){
			TeX += branches[branchIndex].acAmpPwSupplies[k].ref + ', ';
		}
		for(let k = 0; k < branches[branchIndex].acVoltPwSupplies.length; k++){
			TeX += branches[branchIndex].acVoltPwSupplies[k].ref + ', ';
		}
		for(let k = 0; k < branches[branchIndex].dcAmpPwSupplies.length; k++){
			TeX += branches[branchIndex].dcAmpPwSupplies[k].ref + ', ';
		}
		for(let k = 0; k < branches[branchIndex].dcVoltPwSupplies.length; k++){
			TeX += branches[branchIndex].dcVoltPwSupplies[k].ref+ ', ';
		}
		for(let k = 0; k < branches[branchIndex].capacitors.length; k++){
			TeX += branches[branchIndex].capacitors[k].ref + ', ';
		}
		for(let k = 0; k < branches[branchIndex].coils.length; k++){
			TeX += branches[branchIndex].coils[k].ref + ', ';
		}
		for(let k = 0; k < branches[branchIndex].resistors.length; k++){
			TeX += branches[branchIndex].resistors[k].ref + ', ';
		}
		
		// Remove last comma
		if(TeX[TeX.length-2] == ','){
			TeX = TeX.slice(0,TeX.length-2);
		}

		TeX += "\\\\\r\n";
	}

	TeX += "\\end{tabular}\r\n\\end{table}\r\n\r\n";

	if(currents.length > 0){
        // Create Equations
        str = '\\large \\begin{cases}';
        for(let k = 0; k<currents.length; k++){
            str += currents[k].meshEquation;
            if(k<currents.length-1)
                str += ' \\\\[0.7em] ';
        }
        str += '\\end{cases}';

        str += ' \\Leftrightarrow';

        str += '\\large \\begin{cases}';

        for(let k = 0; k<currents.length; k++){

            if(currents[k].complex){
                let resultMag = resultDecimals(Math.sqrt(Math.pow(currents[k].valueRe, 2) + Math.pow(currents[k].valueIm, 2)), 2, false);
                let resultAng = resultDecimals(Math.atan(currents[k].valueIm/currents[k].valueRe)*57.2957795, 2, true);
				if(resultMag.value == 0){
					str += currents[k].ref + '=' + resultMag.value + resultMag.unit + 'A';
				}
				else{
					str += currents[k].ref + '=' + resultMag.value + '\\angle ' + resultAng.value + '^{\\circ}\\;' + resultMag.unit + 'A';
				}
			}
            else{
                let result = resultDecimals(currents[k].valueRe, 2, false);
                str += currents[k].ref + '=' + result.value + '\\;' + result.unit +'A';
            }

            if(k<currents.length-1)
                str += ' \\\\[0.7em] ';
        }

        str += '\\end{cases}';

        TeX += "\\par\r\n\r\n\\pagebreak\r\n\r\n\\section{Results}\r\n\r\n"

        TeX += "\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n";
        TeX += "\\begin{footnotesize}\r\n\\textbf{\\textit{Note: }} ";
        TeX += " The following currents were obtained by the mesh currents that exist in each branch.\r\n\\end{footnotesize}\r\n\r\n";
	}

	TeX += "\\end{document}\r\n";
	return TeX;
}

//BUILD TEX FILE FOR OVERLEAF
function buildImTeX(images){
    let imageTex = '';

    let sampleimg = base64imgselect("logo");
    imageTex += '\\newcommand{\\logo}{' + sampleimg.replace('data:image/png;base64,', '') + '}\r\n';

    if(fileContents[0]){
        imageTex += '\\newcommand{\\circuit}{' + fileContents[0].replace('data:image/png;base64,', '') + '}\r\n';

    }
    const substitutions = "abcdfghjklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVYXYZ";
    for(let i = 0; i < images.length; i++){
        var svg = document.getElementById("mesh#Mesh" + String(i+1));
        var img = new Image;
        svg.toDataURL("image/png", {
            callback: function(data) {
                img.setAttribute("src", data);
                imageTex += '\\newcommand{\\mesh' + substitutions[i] + '}{' + data.replace('data:image/png;base64,', '') + '}\r\n';
            }
        });
    }
    

    return imageTex;
}
/**
 * Function to build the TeX header
 * @returns {string} TeX string
 */
function getTexFileHeaderMCMOv(){

    let texHeader = '';
    texHeader = '\\documentclass[a4paper]{article}\r\n\\newcommand{\\inlineimages}[2]{\r\n\\newwrite\\tempfile\r\n\\immediate\\openout\\tempfile=#1.base64\r\n\\immediate\\write\\tempfile{#2}\r\n\\immediate\\closeout\\tempfile\r\n\\immediate\\write18{base64 -d #1.base64 > #1}\r\n\\includegraphics{#1}\r\n}\n\r';
    texHeader += '\\include{Untitled (1)}\r\n';
    texHeader += '\\usepackage{graphicx}\r\n\\usepackage[latin1]{inputenc}\r\n\\usepackage{amsmath}\r\n\\usepackage{fancyhdr}\r\n\\pagestyle{fancy}\r\n\\lhead{\\textsc{URIsolve App}}\r\n\\rhead{\\textsc{Mesh Current Method}}\r\n\\cfoot{www.isep.ipp.pt}\r\n\\lfoot{DEE - ISEP}\r\n\\rfoot {\\thepage}\r\n\\renewcommand{\\headrulewidth}{0.4pt}\r\n\\renewcommand{\\footrulewidth}{0.4pt}\r\n\r\n\\title{\r\n\\raisebox{-.2\\height}{\\scalebox{.30}{\\inlineimages{logo.png}{\\logo}}} URIsolve APP \\\\\r\n\r\n\\textsc{Mesh Current Method} \\\\\r\n\\\r\nStep by Step Solution \\\\\r\n\\vspace*{1\\baselineskip}\r\n}\r\n\r\n\\author{\r\n\\begin{tabular}[t]{c@{\\extracolsep{8em}}c}\r\nLino Sousa           & M\u00E1rio Alves          \\\\\r\nsss@isep.ipp.pt  & mjf@isep.ipp.pt      \\\\\r\n\t\t\t\t\t &                      \\\\\r\nAndr\u00E9 Rocha          & Francisco Pereira    \\\\\r\nanr@isep.ipp.pt      & fdp@isep.ipp.pt      \\\\\r\n\\end{tabular}\r\n}\r\n\r\n\\date{}\r\n\r\n';
    texHeader += '\\begin{document}\r\n\r\n\\maketitle\r\n\\thispagestyle{empty}\r\n\r\n\\vspace{\\fill}\r\n\\begin{abstract}\r\n\\centering\r\nThis document provides a step by step solution for the submitted circuit, using the Mesh Current Method (MCM).\r\n\\end{abstract}\r\n\\vspace{\\fill}\r\n\r\n\\begin{center}\r\n\\today\r\n\\end{center}\r\n\r\n\\clearpage\r\n\\pagenumbering{arabic}\r\n\r\n\\newpage\r\n\r\n';
    return texHeader;
}
/**
 * Function to create the output TeX
 * @param {object} file json output
 * @param {array} meshImages image information
 * @returns {string} TeX string
 */
function buildTeXOv(file, meshImages){

	let R = file.branches.length;
	let N = countNodesByType(file.nodes, 0);
	let C = file.components.acAmpsPs.length + file.components.dcAmpsPs.length;
	let T = file.components.isolatedVPS.length;
	let F = file.analysisObj.circuitFreq;
	let totalCurrents = file.analysisObj.currents.length;
	let Amps = file.probes.ammeters.length;
	let E = R - (N - 1) - C;
	let simpEquations =  file.analysisObj.equations;
	let meshes = file.analysisObj.chosenMeshes;

	let currents = file.analysisObj.currents;
	let branches =  file.branches;

	// Tex Variable
	let TeX = getTexFileHeaderMCMOv();

	if(fileContents[0]){
		// Add Image to Tex
        let imageObj = new Image();
        imageObj.setAttribute("src", fileContents[0]);
        let prop = 1;
        if(imageObj.width > 450){
            prop = 450/imageObj.width;
        }

		TeX += "\\section{Circuit Image}\r\n\r\n\\begin{figure}[hbt]\r\n\\centering{\\scalebox{" + prop + "}{";
		TeX += "\\inlineimages{circuit.png}{\\circuit}}}\r\n\\caption{";
		TeX += "Circuit image}\r\n\\label{circuitimage}\r\n\\end{figure}\r\n\r\n";
	}

	// TeX Fundamental Vars
	TeX += "\\section{Fundamental Variables}\r\n\r\n\\begin{table}[hbt!]\r\n\\centering\r\n\\begin{tabular}{clclclc}\r\n";
	TeX += "\\textbf{Branches {[}R{]}}&&\\textbf{Nodes {[}N{]}}&&\\textbf{Current Sources {[}C{]}}&&\\textbf{Isolated Voltage Sources {[}T{]}} \\\\\r\n";
	TeX += "R="+R+"&&N="+N+"&&C="+C+"&&T="+T+"\r\n\\end{tabular}\r\n\\end{table}\r\n\r\n";

	// TeX Circuit Information
	TeX += "\\section{Circuit Information}\r\n\r\n\\begin{table}[h!]\r\n\\centering\r\n\\begin{tabular}{clclclc}\r\n";
	TeX += "\\textbf{Simulation {[}AC\/DC{]}} && \\textbf{Circuit Frequency {[}A{]}} && \\textbf{Ammeters {[}I{]}} \\\\\r\n";
	if(F.value == 0){
			TeX += "DC";
			aux = "&&N~/~A\\;";
	}
	else{
		TeX += "AC";
		aux = "&&F="+F.value+"\\;"+F.mult;
	}

	TeX += aux;

	TeX += " & & "+Amps+"\/"+totalCurrents+"\r\n\\end{tabular}\r\n\\end{table}\r\n";

	//meshes calculation
    TeX += "\\section{Number of Meshes}\r\n\r\n\\subsection{Main Meshes}\r\n\r\n";
    TeX += "\\begin{gather*}\r\nM_{p}=R-(N-1)-C ~ \\Leftrightarrow \\\\";
    TeX += "M_{p}="+R+"-("+N+"-1)-"+C+" ~ \\Leftrightarrow \\\\";
	TeX += "\\Leftrightarrow ~ M_{p}="+E+"\\end{gather*}\r\n\\par\r\n\r\n";
	TeX += "\\paragraph{} The number of Main meshes will be the number of needed equations\r\n";
    TeX += "\r\n\\subsection{Auxiliar Meshes}\r\n\r\n";
    TeX += "\\paragraph{} The number of Auxiliar Meshes it's the same as the number of Current Sources:\r\n";
    TeX += "\\begin{gather*}\r\nC = " + C + "\\implies  M_{a} = " + C+"\r\n\\end{gather*}\r\n\\pagebreak";

	//circuit mesh images
    const substitutions = "abcdfghjklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVYXYZ";
	let pagebreakCounter = 0;
	TeX += "\\section{Circuit Meshes}\r\n\r\n";
	meshImages.forEach(image => {
		let aux;
		if(meshes[image.id-1].type == 0) aux = "Auxiliar";
		else aux = "Main";
        let prop = 1;
        if(image.width > 350){
            prop = 350/image.width;
        }
		TeX += "\\subsection{Mesh~" + image.id + "~-~" + aux + "}\r\n"
		TeX += "\\begin{figure}[hbt]\r\n\\centering{\\scalebox{" + prop +"}{\\inlineimages{"
		TeX += "mesh" + String(image.id) + ".png}{\\mesh" + substitutions[meshImages.indexOf(image)] + "}}}\r\n\r\n\\end{figure}\r\n";
        if(meshes[image.id-1].type == 1) TeX += "\\begin{equation}\r\n \\textrm{Equation}: \\quad I_{M"+ meshes[image.id-1].id+"}~:~" + meshes[image.id-1].incognitoEq +"\r\n\\end{equation}\r\n\r\n";
        else{
            if(meshes[image.id-1].currValue.complex){
				let resultMag = resultDecimals(Math.sqrt(Math.pow(meshes[image.id-1].currValue.re, 2) + Math.pow(meshes[image.id-1].currValue.im, 2)), 2, false);
				let resultAng = resultDecimals(Math.atan(meshes[image.id-1].currValue.im/meshes[image.id-1].currValue.re)*57.2957795, 2, true);
                TeX += "\\begin{equation}\r\n \\textrm{Value}: \\quad I_{M"+meshes[image.id-1].id+"}~:~"+ resultMag.value + '\\angle ' + resultAng.value + '^{\\circ}\\;' + resultMag.unit + 'A\r\n\\end{equation}\r\n\r\n';  
            }
            else{
				let result = resultDecimals(meshes[image.id-1].currValue.value)
                TeX += "\\begin{equation}\r\n \\textrm{Value}: \\quad I_{M" + meshes[image.id-1].id+"}~:~" + result.value + result.unit + "A\r\n\\end{equation}\r\n\r\n";  
            }		
		}
		pagebreakCounter++;
        if(pagebreakCounter == 2){
            pagebreakCounter = 0;
            TeX += "\\pagebreak";
        }

	});


	//equation system
	TeX += "\\pagebreak\\section{Equation System}\r\n\r\n\\paragraph{} ";

	let str = '\\large \\begin{cases}';
	for(let k = 0; k<simpEquations.allRevealedEq.length; k++){
		str += simpEquations.allRevealedEq[k];
		if(k < simpEquations.allRevealedEq.length-1)
			str += '\\\\[0.7em] ';

	}
	str += '\\end{cases}';
	TeX += " Equations:\r\n\\begin{gather*}\r\n"+str+"\r\n\\end{gather*}\r\n\\par\r\n\r\n\\paragraph{} ";

	TeX += "Steps:\r\n\r\n";
	//step 1
	 str = '\\large \\begin{cases}';
    for(let k = 0; k<simpEquations.allVariableEq.length; k++){
        str += simpEquations.allVariableEq[k];
        if(k<simpEquations.allVariableEq.length-1)
            str += ' \\\\[0.7em] ';

    }
    str += '\\end{cases}';
    TeX += "\\begin{small}\\textbf{\\textit{Step 1:}}\\end{small}  Initial equation system\r\n";
    TeX += "\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n\r\n";
	//step 2
	str = '\\large \\begin{cases}';
    for(let k = 0; k<simpEquations.meshCurrRevealedEq.length; k++){
        str += simpEquations.meshCurrRevealedEq[k];
        if(k<simpEquations.meshCurrRevealedEq.length-1)
            str += ' \\\\[0.7em] ';

    }
    str += '\\end{cases}';
    TeX += "\\begin{small}\\textbf{\\textit{Step 2:}}\\end{small}  Substitute the mesh current values\r\n";
    TeX += "\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n\r\n"
	//step 3
	str = '\\large \\begin{cases}';
    for(let k = 0; k<simpEquations.allRevealedEq.length; k++){
        str += simpEquations.allRevealedEq[k];
        if(k<simpEquations.allRevealedEq.length-1)
            str += ' \\\\[0.7em] ';

    }
    str += '\\end{cases}';
    TeX += "\\begin{small}\\textbf{\\textit{Step 3:}}\\end{small}  Substitute the circuit component values\r\n";
    TeX += "\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n\r\n";

	// Add Equation system
	str = '\\large \\begin{cases}';
	for(let k = 0; k<meshes.length; k++){
		// Generate Equation
        if(meshes[k].currValue.complex){ //malha é complexa
            let resultMag = resultDecimals(Math.sqrt(Math.pow(meshes[k].currValue.re, 2) + Math.pow(meshes[k].currValue.im, 2)), 2, false);
            let resultAng = resultDecimals(Math.atan(meshes[k].currValue.im/meshes[k].currValue.re)*57.2957795, 2, true);
			if(resultMag.value == 0){
                str += "I_{" + meshes[k].id + meshes[k].id + "} = " + resultMag.value + resultMag.unit + '~A\\\\';
            }
            else{
                str += "I_{" + meshes[k].id + meshes[k].id + "} = " + resultMag.value + '\\angle{} ' + resultAng.value + '^{\\circ{}}\\;' + resultMag.unit + 'A\\\\';
            }
        }
        else{ //malha é real
            let result = resultDecimals(meshes[k].currValue.value, 2, false);
            str += "I_{" + meshes[k].id + meshes[k].id + "} = " + result.value + result.unit + 'A\\\\';
        }
		if(k<results.length-1)
			str += ' \\\\[0.7em] ';
	}
	str += '\\end{cases}';

	TeX += "\\par\r\n\r\n\\pagebreak\r\n\r\n\\section{Results}\r\n\r\n";
	TeX += "\\subsection{Mesh Currents}\r\n\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n\r\n";

	//mesh current results
	TeX += "\\section{Circuit Currents}\r\n\r\n\\subsection{General information}\r\n\r\n";
	TeX += "\\begin{table}[ht]\r\n\\caption{List of the circuit currents and its properties\/components}\r\n\\centering\r\n\\begin{tabular}{cccc}\r\n";
	TeX += "\\textbf{Reference} & \\textbf{Start Node} & \\textbf{End Node} & \\textbf{Components} \\\\ \\hline\r\n";

	for( let i = 0; i < currents.length; i++){
		let branchIndex = branches.findIndex(item => item.currentId == currents[i].id);

		TeX += currents[i].ref + " & " + currents[i].noP + " & " + currents[i].noN + " & ";

		// Add Components
		for(let k = 0; k < branches[branchIndex].acAmpPwSupplies.length; k++){
			TeX += branches[branchIndex].acAmpPwSupplies[k].ref + ', ';
		}
		for(let k = 0; k < branches[branchIndex].acVoltPwSupplies.length; k++){
			TeX += branches[branchIndex].acVoltPwSupplies[k].ref + ', ';
		}
		for(let k = 0; k < branches[branchIndex].dcAmpPwSupplies.length; k++){
			TeX += branches[branchIndex].dcAmpPwSupplies[k].ref + ', ';
		}
		for(let k = 0; k < branches[branchIndex].dcVoltPwSupplies.length; k++){
			TeX += branches[branchIndex].dcVoltPwSupplies[k].ref+ ', ';
		}
		for(let k = 0; k < branches[branchIndex].capacitors.length; k++){
			TeX += branches[branchIndex].capacitors[k].ref + ', ';
		}
		for(let k = 0; k < branches[branchIndex].coils.length; k++){
			TeX += branches[branchIndex].coils[k].ref + ', ';
		}
		for(let k = 0; k < branches[branchIndex].resistors.length; k++){
			TeX += branches[branchIndex].resistors[k].ref + ', ';
		}
		
		// Remove last comma
		if(TeX[TeX.length-2] == ','){
			TeX = TeX.slice(0,TeX.length-2);
		}

		TeX += "\\\\\r\n";
	}

	TeX += "\\end{tabular}\r\n\\end{table}\r\n\r\n";

	if(currents.length > 0){
        // Create Equations
        str = '\\large \\begin{cases}';
        for(let k = 0; k<currents.length; k++){
            str += currents[k].meshEquation;
            if(k<currents.length-1)
                str += ' \\\\[0.7em] ';
        }
        str += '\\end{cases}';

        str += ' \\Leftrightarrow';

        str += '\\large \\begin{cases}';

        for(let k = 0; k<currents.length; k++){

            if(currents[k].complex){
                let resultMag = resultDecimals(Math.sqrt(Math.pow(currents[k].valueRe, 2) + Math.pow(currents[k].valueIm, 2)), 2, false);
                let resultAng = resultDecimals(Math.atan(currents[k].valueIm/currents[k].valueRe)*57.2957795, 2, true);
				if(resultMag.value == 0){
					str += currents[k].ref + '=' + resultMag.value + resultMag.unit + 'A';
				}
				else{
					str += currents[k].ref + '=' + resultMag.value + '\\angle ' + resultAng.value + '^{\\circ}\\;' + resultMag.unit + 'A';
				}
			}
            else{
                let result = resultDecimals(currents[k].valueRe, 2, false);
                str += currents[k].ref + '=' + result.value + '\\;' + result.unit +'A';
            }

            if(k<currents.length-1)
                str += ' \\\\[0.7em] ';
        }

        str += '\\end{cases}';

        TeX += "\\par\r\n\r\n\\pagebreak\r\n\r\n\\section{Results}\r\n\r\n"

        TeX += "\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n";
        TeX += "\\begin{footnotesize}\r\n\\textbf{\\textit{Note: }} ";
        TeX += " The following currents were obtained by the mesh currents that exist in each branch.\r\n\\end{footnotesize}\r\n\r\n";
	}

	TeX += "\\end{document}\r\n";
	return TeX;
}


//BUILD PDF FOR PRINT
/**
 * Main function to build the pdf for printing
 * @param {object} file output jsonFile
 * @param {array} meshImages array with the images information
 */
function buildPrintPDF(file, meshImages){
	window.jsPDF = window.jspdf.jsPDF;

    const marginSides = 0.2;
    const marginBottom = 0.1;
    const marginTop = 0.1;

    //letter size
    titleSize = 18;
    subtitleSize = 16;
    subsubtitleSize = 14;
    bigInfoSize = 12;
    smallInfoSize = 10;
    tinyInfoSize = 8;

    //init file
    let doc = new jsPDF({unit:'pt', format:'a4'});
    doc.setFont("docker/build/vendor/jsPDF-master/docs/fonts/cmunbsr/SourceSerifPro-Light-normal", "regular");
    doc.page = 1;
    const height = doc.internal.pageSize.height;


    //print head
    doc = printBuildHead(doc);

    doc.addPage();
    doc = printBuildFoot(doc, marginSides, marginBottom, marginTop);
    line = height*marginTop;

    //print information
    line = printCircuitImage(doc, line, marginSides, marginTop, marginBottom);
    line = printFundVars(doc, file, line+=10, marginSides, marginTop, marginBottom);
    line = printCircInfo(doc, file, line+=10, marginSides, marginTop, marginBottom);
    line = printMeshCalc(doc, file, line+=10, marginSides, marginTop, marginBottom);
    line = printCircuitMeshes(doc, file, meshImages, line, marginSides, marginBottom, marginTop);
    line = printEqSystem(doc, file, line, marginSides, marginTop, marginBottom);
    line = printMeshResults(doc, file, line, marginSides, marginTop, marginBottom);    
    line = printCurrentsInfo(doc, file, line, marginSides, marginTop, marginBottom);
    line = printBranchResults(doc, file, line, marginSides, marginTop, marginBottom);

	doc.autoPrint();
	doc.output("dataurlnewwindow");
}
/**
 * Function to build the print pdf head
 * @param {object} doc jsPDF document
 */
function printBuildHead(doc){
    let line = 170;
    const width = doc.internal.pageSize.width;

    doc.setFontSize(20);
    let sampleimg = base64imgselect("logo");
    doc.addImage(sampleimg, "JPG", width/2-70, line-20, 67/3.5, 82/3.5);
	doc.text('URIsolve APP', width/2+10, line-1, null, null, 'center');
    doc.text('Mesh Current Method', width/2, line+=20, null, null, 'center');

    doc.setFontSize(16);
    doc.text('Step by Step Solution', width/2, line+=16, null, null, 'center');

    doc.setFontSize(12);
    doc.text('Lino Sousa', width/3, line+=50, null, null, 'center');
    doc.text('Mário Alves', 2*width/3, line, null, null, 'center');
    doc.text('sss@isep.ipp.pt', width/3, line+=10, null, null, 'center');
    doc.text('mjf@isep.ipp.pt', 2*width/3, line, null, null, 'center');

    doc.text('André Rocha', width/3, line+=30, null, null, 'center');
    doc.text('Francisco Pereira', 2*width/3, line, null, null, 'center');
    doc.text('anr@isep.ipp.pt', width/3, line+=10, null, null, 'center');
    doc.text('fdp@isep.ipp.pt', 2*width/3, line, null, null, 'center');

    doc.setFontSize(10);
    doc.text('Abstract', width/2, line+=200, null, null, 'center');

    doc.setFontSize(8);
    doc.text('This document provides a step by step solution for the submitted', width/2, line+=10, null, null, 'center');
    doc.text('circuit, using the Mesh Current Method (MCM).', width/2, line+=10, null, null, 'center');


    doc.setFontSize(10);
    const d = new Date(); 
    doc.text(d.getDate()+" / "+d.getMonth()+" / "+d.getFullYear(), width/2, line+=150, null, null, 'center');

    return doc;
}
/**
 * Function to build the footer
 * @param {object} doc jsPDF document
 * @param {number} marginSides sides margin 0-1
 * @param {number} marginTop top margin 0-1
 * @param {number} marginBottom bottom margin 0-1
 */
function printBuildFoot(doc, marginSides, marginBottom, marginTop){
    width = doc.internal.pageSize.width;
    height = doc.internal.pageSize.height;

    ms = width*marginSides;
    mb = height-marginBottom*height;
    mt = marginTop*height;

    doc.setFontSize(10);
    doc.text('DEE - ISEP', ms, mb, null, null, 'left');
    doc.text('URIsolve APP', ms, mt, null, null, 'left');
    doc.text('Page ' + doc.page, width-ms, mb, null, null, 'right');
    doc.text('Mesh Current Method', width-ms, mt, null, null, 'right');
    doc.setFontSize(8);
    doc.text('www.isep.ipp.pt', width/2, mb, null, null, 'center');

    doc.line(ms, mb-10, width-ms, mb-10);
    doc.line(ms, mt+4, width-ms, mt+4);

    doc.page++;

    return doc;
}
/**
 * Function to write the circuit image
 * @param {object} doc jsPDF document
 * @param {nmber} line line vertical height
 * @param {number} marginSides sides margin 0-1
 * @param {number} marginTop top margin 0-1
 * @param {number} marginBottom bottom margin 0-1
 * @returns {number} line vertical height
 */
function printCircuitImage(doc, line, marginSides, marginBottom, marginTop){
    let width = doc.internal.pageSize.width;
    let height = doc.internal.pageSize.height;

    doc.setFontSize(subtitleSize);
    doc.text('1.  Circuit Image', marginSides*width, line+=35, null, null, 'left');

    if(fileContents[0]){
        let imageObj = new Image();
        imageObj.setAttribute("src", fileContents[0]);
        let prop = 1;
        if(imageObj.width > 370){
            prop = 370/imageObj.width;
        }
        doc.addImage(fileContents[0], "PNG", width*marginSides, line+=10, imageObj.width*prop, imageObj.height*prop);
        line += imageObj.height*prop;
    }
    else{
        doc.setFontSize(bigInfoSize);
        doc.text('No image', width/2, line+=20, null, null, 'center');
    }

    return line;
}
/**
 * Function to print the fundamental variables
 * @param {object} doc jsPDF document
 * @param {object} file output jsonFile
 * @param {nmber} line line vertical height
 * @param {number} marginSides sides margin 0-1
 * @returns {number} line vertical height
 */
function printFundVars(doc, file, line, marginSides, marginTop, marginBottom){
    
    let R = file.branches.length;
	let N = countNodesByType(file.nodes, 0);
	let C = file.components.acAmpsPs.length + file.components.dcAmpsPs.length;
	let T = file.components.isolatedVPS.length;

    let width = doc.internal.pageSize.width;
    let height = doc.internal.pageSize.height;
    let innerWidth = width - 2 * width * marginSides;

    if(line+25+20+20 > height-height*marginBottom-10){
        doc.addPage();
        doc = printBuildFoot(doc, marginSides, marginBottom, marginTop);
        line = height*marginTop;
    }
    

    doc.setFontSize(subtitleSize);
    doc.text('2.  Fundamental Variables', marginSides*width, line+=25, null, null, 'left');

    doc.setFontSize(smallInfoSize);
    doc.text('Branches   |', innerWidth/9 + width * marginSides, line+=20, null, null, 'center');
    doc.text('Nodes   |', 2.4*innerWidth/9 + width * marginSides, line, null, null, 'center');
    doc.text('Current Sources   |', 4.2*innerWidth/9 + width * marginSides, line, null, null, 'center');
    doc.text('Isolated Voltage Sources', 7.1*innerWidth/9 + width * marginSides, line, null, null, 'center');

    doc.setFontSize(smallInfoSize);
    doc.text('R = ' + R.toString(), innerWidth/9 + width * marginSides, line+=20, null, null, 'center');
    doc.text('N = ' + N.toString(), 2.4*innerWidth/9 + width * marginSides, line, null, null, 'center');
    doc.text('C = ' + C.toString(), 4.2*innerWidth/9 + width * marginSides, line, null, null, 'center');
    doc.text('T = ' + T.toString(), 7.1*innerWidth/9 + width * marginSides, line, null, null, 'center');

    return line;
}
/**
 * Function to output the circuit information
 * @param {object} doc jsPDF document
 * @param {object} file output jsonFile
 * @param {nmber} line line vertical height
 * @param {number} marginSides sides margin 0-1
 * @returns {number} line vertical height
 */
function printCircInfo(doc, file, line, marginSides, marginTop, marginBottom){
    
    let freq = file.analysisObj.circuitFreq;
	let totalCurrents = file.analysisObj.currents.length;
	let ammeters = file.probes.ammeters.length;

    let width = doc.internal.pageSize.width;
    let height = doc.internal.pageSize.height;
    let innerWidth = width - 2 * width * marginSides;

    if(line+25+20+20 > height-height*marginBottom-10){
        doc.addPage();
        doc = printBuildFoot(doc, marginSides, marginBottom, marginTop);
        line = height*marginTop;
    }

    doc.setFontSize(subtitleSize);
    doc.text('3.  Circuit Information', marginSides*width, line+=25, null, null, 'left');

    doc.setFontSize(smallInfoSize);
    doc.text('Simulation Type [AC/DC]', innerWidth/4 + width * marginSides, line+=20, null, null, 'center');
    doc.text('Frequency', 2.5*innerWidth/4 + width * marginSides, line, null, null, 'center');
    doc.text('Ammeters', 3.5*innerWidth/4 + width * marginSides, line, null, null, 'center');

    let aux;
    let aux1;
    if(freq.value == 0){
        aux = 'DC';
        aux1 = 'F = ' + freq.value + ' Hz';
    }
    else{
        aux = 'AC';
        aux1 = 'F = ' + freq.value + ' ' + freq.mult;
    }
    doc.setFontSize(smallInfoSize);
    doc.text(aux, innerWidth/4 + width * marginSides, line+=20, null, null, 'center');
    doc.text(aux1, 2.5*innerWidth/4 + width * marginSides, line, null, null, 'center');
    doc.text(ammeters + '/' + totalCurrents, 3.5*innerWidth/4 + width * marginSides, line, null, null, 'center');

    return line;
}
/**
 * Function to output the mesh calculations
 * @param {object} doc jsPDF document
 * @param {object} file output jsonFile
 * @param {number} line line vertical height
 * @param {number} marginSides sides margin 0-1
 * @returns {number} line vertical height
 */
function printMeshCalc(doc, file, line, marginSides, marginTop, marginBottom){
    let width = doc.internal.pageSize.width;
    let height = doc.internal.pageSize.height;

    let R = file.branches.length;
	let N = countNodesByType(file.nodes, 0);
	let C = file.components.acAmpsPs.length + file.components.dcAmpsPs.length;
	let E = R - (N - 1) - C;

    if(line+25+25+60+20 > height-height*marginBottom-10){
        doc.addPage();
        doc = printBuildFoot(doc, marginSides, marginBottom, marginTop);
        line = height*marginTop;
    }

    doc.setFontSize(subtitleSize);
    doc.text('4.  Number of Meshes', marginSides*width, line+=25, null, null, 'left');

    doc.setFontSize(subsubtitleSize);
    doc.text(' 4.1  Main Meshes', marginSides*width, line+=25, null, null, 'left');

    doc.setFontSize(smallInfoSize);
    doc.text("Mp = R - (N - 1) - C <=>", width/2, line+=20, null, null, 'center');
    doc.text("<=> Mp = "+ R +" - ("+ N +" - 1) - " + C + " <=> ", width/2, line+=20, null, null, 'center');
    doc.text("Mp = " + E, width/2, line+=20, null, null, 'center');

    doc.setFontSize(smallInfoSize);
    doc.text('     The number of Main meshes will be the number of needed equations', marginSides*width, line+=20, null, null, 'left');

    if(line+25+20+20 > height-height*marginBottom-10){
        doc.addPage();
        doc = printBuildFoot(doc, marginSides, marginBottom, marginTop);
        line = height*marginTop;
    }

    doc.setFontSize(subsubtitleSize);
    doc.text(' 4.2  Auxiliar Meshes', marginSides*width, line+=25, null, null, 'left');

    doc.setFontSize(smallInfoSize);
    doc.text('     The number of Auxiliar Meshes is the same as the number of Current Sources:', marginSides*width, line+=20, null, null, 'left');

    doc.setFontSize(smallInfoSize);
    doc.text("Ma = C <=> Mp = " + C, width/2, line+=20, null, null, 'center');
    return line;
}
/**
 * Function to print the meshes
 * @param {object} doc jsPDF document
 * @param {object} file output jsonFile
 * @param {array} images images data
 * @param {number} line line vertical height
 * @param {number} marginSides sides margin 0-1
 * @param {number} marginTop top margin 0-1
 * @param {number} marginBottom bottom margin 0-1
 * @returns {number} line vertical height
 */
function printCircuitMeshes(doc, file, images, line, marginSides, marginBottom, marginTop){
    let width = doc.internal.pageSize.width;
    let height = doc.internal.pageSize.height;
    let meshes = file.analysisObj.chosenMeshes;

    if(line+25 > height-height*marginBottom-10){
        doc.addPage();
        doc = printBuildFoot(doc, marginSides, marginBottom, marginTop);
        line = height*marginTop;
    } 

    doc.setFontSize(subtitleSize);
    doc.text('5.  Circuit Meshes', marginSides*width, line+=25, null, null, 'left');

    for(let i = 0; i < meshes.length; i++){
        let prop = 1;
        if(images[i].width > width-2*width*marginSides) prop = (width-2*width*marginSides)/images[i].width;
        if(line+10+images[i].height*prop+30 > height-height*marginBottom-10){
            doc.addPage();
            doc = printBuildFoot(doc, marginSides, marginBottom, marginTop);
            line = height*marginTop;
        }
        let aux = "Main";
        if(meshes[i].type == 0) aux = "Auxiliar";
        doc.setFontSize(subsubtitleSize);
        doc.text(' 5.' + String(i+1) + '  Mesh ' + String(i+1) + ' - ' + aux, marginSides*width, line+=22, null, null, 'left');


        var svg = document.getElementById("mesh#Mesh" + String(i+1));
        var img = new Image;
        svg.toDataURL("image/png", {
            callback: function(data) {
                img.setAttribute("src", data);
                let align = (width-prop*images[i].width)/2;
                doc.addImage(data, "PNG", align, line+=10, images[i].width*prop, images[i].height*prop);
                line+=images[i].height*prop;
            }
        })  

        if(meshes[i].type == 0){
            if(meshes[i].currValue.complex){
                let resultMag = resultDecimals(Math.sqrt(Math.pow(meshes[i].currValue.re, 2) + Math.pow(meshes[i].currValue.im, 2)), 2, false);
                let resultAng = resultDecimals(Math.atan(meshes[i].currValue.im/meshes[i].currValue.re)*57.2957795, 2, true);
                printEquation(doc, "I_{M"+meshes[i].id+"}:~"+ resultMag.value + '\\angle' + resultAng.value + '^{\\circ}' + resultMag.unit +'A', width/2, line+=5, 'center');  
            }
            else{
                let result = resultDecimals(meshes[i].currValue.value, 2, false);
                printEquation(doc, "I_{M"+meshes[i].id+"}:~"+result.value+result.unit+"A", width/2, line+=5, 'center');  
            }
        }
        else{
            printEquation(doc, "I_{M"+meshes[i].id+"}:~"+meshes[i].incognitoEq, width/2, line, 'center');  
        }
    }
    return line;
}
/**
 * Function to output circuit branch currents
 * @param {object} doc jsPDF document
 * @param {object} file output jsonFile
 * @param {number} line line vertical height
 * @param {number} marginSides sides margin 0-1
 * @param {number} marginTop top margin 0-1
 * @param {number} marginBottom bottom margin 0-1
 * @returns {number} line vertical height
 */
function printEqSystem(doc, file, line, marginSides, marginTop, marginBottom){
    let width = doc.internal.pageSize.width;
    let height = doc.internal.pageSize.height;
    let equations =  file.analysisObj.equations;

    //head + FINAL equation
    if(line+equations.allVariableEq.length*12+25+15 > height-height*marginBottom-10){
        doc.addPage();
        doc = printBuildFoot(doc, marginSides, marginBottom, marginTop);
        line = height*marginTop;
    }
    doc.setFontSize(subtitleSize);
    doc.text('6.  Equation System', marginSides*width, line+=25, null, null, 'left');

    doc.setFontSize(bigInfoSize);
    doc.text('Equations:', marginSides*width+10, line+=15, null, null, 'left');
    line+=5;
    doc.setLineWidth(1);
    doc.line(marginSides*width+13, line+5, marginSides*width+13, line+equations.allRevealedEq.length*13+5);
    for(let i = 0; i < equations.allRevealedEq.length; i++){
        printEquation(doc, equations.allRevealedEq[i], marginSides*width+15, line+=14, 'left');  
    }
    line+=5;

    //STEP 1
    if(line+equations.allVariableEq.length*12+25+15 > height-height*marginBottom-10){
        doc.addPage();
        doc = printBuildFoot(doc, marginSides, marginBottom, marginTop);
        line = height*marginTop;
    }
    doc.setFontSize(smallInfoSize);
    doc.text('Step 1 - Initial equation system:', marginSides*width+13, line+=15, null, null, 'left');
    line+=5;
    doc.setLineWidth(1);
    doc.line(marginSides*width+17, line+5, marginSides*width+17, line+equations.allVariableEq.length*13+5);
    for(let i = 0; i < equations.allVariableEq.length; i++){
        printEquation(doc, equations.allVariableEq[i], marginSides*width+18, line+=14, 'left');  
    }
    line+=5;

    //STEP 2
    if(line+equations.allVariableEq.length*12+25+15 > height-height*marginBottom-10){
        doc.addPage();
        doc = printBuildFoot(doc, marginSides, marginBottom, marginTop);
        line = height*marginTop;
    }
    doc.setFontSize(smallInfoSize);
    doc.text('Step 2 - Substitute the known mesh current values:', marginSides*width+13, line+=15, null, null, 'left');
    line+=5;
    doc.setLineWidth(1);
    doc.line(marginSides*width+17, line+5, marginSides*width+17, line+equations.meshCurrRevealedEq.length*13+5);
    for(let i = 0; i < equations.meshCurrRevealedEq.length; i++){
        printEquation(doc, equations.meshCurrRevealedEq[i], marginSides*width+18, line+=14, 'left');  
    }
    line+=5;

    //STEP 3
    if(line+equations.allVariableEq.length*12+25+15 > height-height*marginBottom-10){
        doc.addPage();
        doc = printBuildFoot(doc, marginSides, marginBottom, marginTop);
        line = height*marginTop;
    }
    doc.setFontSize(smallInfoSize);
    doc.text('Step 3 - Substitute the circuit component values:', marginSides*width+13, line+=15, null, null, 'left');
    line+=5;
    doc.setLineWidth(1);
    doc.line(marginSides*width+17, line+5, marginSides*width+17, line+equations.allRevealedEq.length*13+5);
    for(let i = 0; i < equations.allRevealedEq.length; i++){
        printEquation(doc, equations.allRevealedEq[i], marginSides*width+18, line+=14, 'left');  
    }
    line+=5;
    return line;
}
/**
 * Function to output circuit branch currents
 * @param {object} doc jsPDF document
 * @param {object} file output jsonFile
 * @param {nmber} line line vertical height
 * @param {number} marginSides sides margin 0-1
 * @param {number} marginTop top margin 0-1
 * @param {number} marginBottom bottom margin 0-1
 * @returns {number} line vertical height
 */
function printMeshResults(doc, file, line, marginSides, marginTop, marginBottom){

    let width = doc.internal.pageSize.width;
    let height = doc.internal.pageSize.height;
    let meshes = file.analysisObj.chosenMeshes;

    if(line+meshes.length*12+25+15 > height-height*marginBottom-10){
        doc.addPage();
        doc = printBuildFoot(doc, marginSides, marginBottom, marginTop);
        line = height*marginTop;
    }
    doc.setFontSize(subtitleSize);
    doc.text('7.  Mesh Current Results', marginSides*width, line+=25, null, null, 'left');

    line+=5;
    doc.setLineWidth(1);
    doc.line(width/2-0.1*width, line+5, width/2-0.1*width, line+meshes.length*13+5);
    for(let i = 0; i < meshes.length; i++){
        let str = '';
        if(meshes[i].currValue.complex){ //malha é complexa
            let resultAng = resultDecimals(meshes[i].currValue.angle, 2, true);
            let resultMag = resultDecimals(meshes[i].currValue.magnitude, 2, false);
            if(resultMag.value == 0){
                str += "I_{M" + meshes[i].id + "}~=~" + resultMag.value + '~' + resultMag.unit + 'A';
            }
            else{
                str += "I_{M" + meshes[i].id + "}~=~" + resultMag.value + '\\angle ' + resultAng.value + '^{\\circ}' + '~' + resultMag.unit + 'A';
            }
        }
        else{ //malha é real
            let result = resultDecimals(meshes[i].currValue.value, 2, false);
            str += "I_{M" + meshes[i].id + "}~=~" + result.value + '~' + result.unit + 'A';
        }
        printEquation(doc, str, width/2-0.1*width, line+=14, 'left');  
    }

    return line;
}
/**
 * Function to output circuit branch currents
 * @param {object} doc jsPDF document
 * @param {object} file output jsonFile
 * @param {number} line line vertical height
 * @param {number} marginSides sides margin 0-1
 * @param {number} marginTop top margin 0-1
 * @param {number} marginBottom bottom margin 0-1
 * @returns {number} line vertical height
 */
function printCurrentsInfo(doc, file, line, marginSides, marginTop, marginBottom){
    let width = doc.internal.pageSize.width;
    let innerWidth = width - 2 * width * marginSides;
    let currents = file.analysisObj.currents;


    if(line+25+25+20+currents.length*12 > height-height*marginBottom-10){
        doc.addPage();
        doc = printBuildFoot(doc, marginSides, marginBottom, marginTop);
        line = height*marginTop;
    }

    doc.setFontSize(subtitleSize);
    doc.text('8.  Circuit Currents', marginSides*width, line+=25, null, null, 'left');

    doc.setFontSize(subsubtitleSize);
    doc.text(' 8.1  General Information', marginSides*width, line+=25, null, null, 'left');

    doc.setFontSize(smallInfoSize);
    doc.text('Reference', innerWidth/5 + width * marginSides, line+=20, null, null, 'center');
    doc.text('Start Node', 2*innerWidth/5 + width * marginSides, line, null, null, 'center');
    doc.text('EndNode', 3*innerWidth/5 + width * marginSides, line, null, null, 'center');
    doc.text('Components', 4*innerWidth/5 + width * marginSides, line, null, null, 'center');

    line+=2;

    doc.setFontSize(smallInfoSize);
    for(let i = 0; i < currents.length; i++){
        let TeXData = '';
        let branchIndex = branches.findIndex(item => item.currentId == currents[i].id);
        for(let k = 0; k < branches[branchIndex].acAmpPwSupplies.length; k++){
            TeXData += branches[branchIndex].acAmpPwSupplies[k].ref + ', ';
        }
        for(let k = 0; k < branches[branchIndex].acVoltPwSupplies.length; k++){
            TeXData += branches[branchIndex].acVoltPwSupplies[k].ref + ', ';
        }
        for(let k = 0; k < branches[branchIndex].dcAmpPwSupplies.length; k++){
            TeXData += branches[branchIndex].dcAmpPwSupplies[k].ref + ', ';
        }
        for(let k = 0; k < branches[branchIndex].dcVoltPwSupplies.length; k++){
            TeXData += branches[branchIndex].dcVoltPwSupplies[k].ref+ ', ';
        }
        for(let k = 0; k < branches[branchIndex].capacitors.length; k++){
            TeXData += branches[branchIndex].capacitors[k].ref + ', ';
        }
        for(let k = 0; k < branches[branchIndex].coils.length; k++){
            TeXData += branches[branchIndex].coils[k].ref + ', ';
        }
        for(let k = 0; k < branches[branchIndex].resistors.length; k++){
            TeXData += branches[branchIndex].resistors[k].ref + ', ';
        }
        if(TeXData[TeXData.length-2] == ','){
            TeXData = TeXData.slice(0,TeXData.length-2);
        }

        doc.text(currents[i].ref, innerWidth/5 + width * marginSides, line+=12, null, null, 'center');
        doc.text(currents[i].noP, 2*innerWidth/5 + width * marginSides, line, null, null, 'center');
        doc.text(currents[i].noN, 3*innerWidth/5 + width * marginSides, line, null, null, 'center');
        doc.text(TeXData, 4*innerWidth/5 + width * marginSides, line, null, null, 'center');
    }
    return line;
}
/**
 * Function to output circuit branch currents
 * @param {object} doc jsPDF document
 * @param {object} file output jsonFile
 * @param {number} line line vertical height
 * @param {number} marginSides sides margin 0-1
 * @param {number} marginTop top margin 0-1
 * @param {number} marginBottom bottom margin 0-1
 * @returns {number} line vertical height
 */
function printBranchResults(doc, file, line, marginSides, marginTop, marginBottom){

    let width = doc.internal.pageSize.width;
    let height = doc.internal.pageSize.height;
    let currents = file.analysisObj.currents;

    if(line+currents.length*12+25+15 > height-height*marginBottom-10){
        doc.addPage();
        doc = printBuildFoot(doc, marginSides, marginBottom, marginTop);
        line = height*marginTop;
    }
    doc.setFontSize(subtitleSize);
    doc.text('9.  Circuit Current Results', marginSides*width, line+=25, null, null, 'left');

    line+=5;
    doc.setLineWidth(1);
    doc.line(2.6*width/4-0.1*width, line+5, 2.6*width/4-0.1*width, line+currents.length*13+5);
    doc.line(1.3*width/4-0.1*width, line+5, 1.3*width/4-0.1*width, line+currents.length*13+5);
    for(let i = 0; i < currents.length; i++){
        let str = '';
        if(currents[i].complex){
            let resultMag = resultDecimals(currents[i].magnitude, 2, false);
            let resultAng = resultDecimals(currents[i].angle, 2, true);
            if(resultMag.value == 0){
                str += currents[i].ref + '~=~' + resultMag.value + '~' + resultMag.unit + 'A';
            }
            else{
                str += currents[i].ref + '~=~' + resultMag.value + '\\angle ' + resultAng.value + '^{\\circ}' + '~' + resultMag.unit + 'A';
            }
        }
        else{
            let result = resultDecimals(currents[i].valueRe, 2, false);
            str += currents[i].ref + '~=~' + result.value + '~' + result.unit +'A';
        }
        printEquation(doc, currents[i].meshEquation, 1.3*width/4-0.1*width, line+=14, 'left');  
        printEquation(doc, str, 2.6*width/4-0.1*width, line, 'left');  
    }

    return line;
}




//UTIL FUNCTIONS
/**
 * Function to output circuit branch currents
 * @param {image} imgObj image object
 * @param {number} max max width (for resizing purposes)
 * @returns {string} base64 png
 */
function resizeandgrayMCM(imgObj, max) {
    var canvas = document.createElement('canvas');
    var canvasContext = canvas.getContext('2d');
     
    var imgW = imgObj.width;
    var imgH = imgObj.height;
    var sizer=1;
    if(imgW > max)
        sizer = max/imgW;

    canvas.width = imgW*sizer;
    canvas.height = imgH*sizer;

    console.log(canvas.width + "x" + canvas.height);

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
    return {
        data: canvas.toDataURL(),
        width: canvas.width,
        height: canvas.height
    };
}

//DRAW MESHES UTIL
/**
 * Function to output circuit branch currents
 * @param {object} currents currents data
 * @returns {string} HTML string
 */
 function outResultsCurrentsMCM(file){

    let currents = file.analysisObj.currents;

    let htmlstr = '';

    //********************************* CIRCUIT CURRENTS ************************************

    // Add card for currents
    htmlstr += '<div class="col-sm-12 col-lg-6-40 print-block"><div class="card bg-light mb-3">';
    htmlstr += '<div class="card-header rounded text-light bg-warning d-flex align-items-center justify-content-center no-page-break" style="opacity:0.9">';
    htmlstr += '<h6 class="lead" data-translate="_currents"></h6></div>';
    htmlstr += '<div class="card-body text-secondary mt-1 mb-1 print-block">';

    if(currents.length > 0){
        // Create Equations
        str = '\\large \\begin{cases}';
        for(let k = 0; k<currents.length; k++){
            str += currents[k].meshEquation;
            if(k<currents.length-1)
                str += ' \\\\[0.7em] ';
        }
        str += '\\end{cases}';

        str += ' \\Leftrightarrow';

        str += '\\large \\begin{cases}';

        for(let k = 0; k<currents.length; k++){

            if(currents[k].complex){
                let resultMag = resultDecimals(currents[k].magnitude, 2, false);
                let resultAng = resultDecimals(currents[k].angle, 2, true);
                if(resultMag.value == 0){
                    str += currents[k].ref + '=' + resultMag.value + resultMag.unit + '~A';
                }
                else{
                    str += currents[k].ref + '=' + resultMag.value + '\\angle ' + resultAng.value + '^{\\circ}\\;' + resultMag.unit + 'A';
                }
            }
            else{
                let result = resultDecimals(currents[k].valueRe, 2, false);
                str += currents[k].ref + '=' + result.value + '\\;' + result.unit +'A';
            }

            if(k<currents.length-1)
                str += ' \\\\[0.7em] ';
        }

        str += '\\end{cases}';

        // Render System to TeX
        str = katex.renderToString(str, {throwOnError: false});
        // Add Notes
        htmlstr += '<div class="card p-1" style="background-color: #ffffcc; border-left: 6px solid #ffeb3b;">';
        htmlstr += '<div class="container-fluid"><div class="d-flex flex-row">';
        htmlstr += '<div class="ml-1 mt-1"><i class="fas fa-sticky-note"></i></div>';
        htmlstr += '<div class="ml-1"><strong><p data-translate="_currResNotes1MCM"></p></strong></div>';
        htmlstr += '</div></div></div>'
        // Add equations in a scroll menu
        htmlstr += '<div class="scrollmenu mt-2 mb-3"><span>'+ str + '</span></div>';
    }
    // Close Currents Card
    htmlstr += '</div></div></div>';

    // Close results panel
    htmlstr += '</div></div>';

    return htmlstr;
}
/**
 * Creates line
 * @param {object} svg svg to construct 
 * @param {Array} branchObjs branches
 * @param {number} width width of each card
 * @param {number} height height of each card
 * @param {number} WindowWidth global card width
 * @param {number} WindowHeight global card height
 * @param {number} Xspacing horizontal space between each card
 * @param {number} Yspacing vertical space between each card
 * @param {number} originX left space
 * @param {number} originY top space
 * @param {number} aux max spacing on bottom line
 */
function createMesh(mesh, branchObjs, width, height, WindowWidth, WindowHeight, Xspacing, Yspacing, originX, originY, aux, containerId, lang){
    let id = "mesh"+containerId;
    let svg = d3.select(containerId) //create svg
        .append("svg")
        .attr("width", WindowWidth+2)
        .attr("height", height+aux+Yspacing+originY+2)
        .attr("id", id)

    let color;
    if(mesh.type == 1) color = "#F73232";
    else color = "#629af5";

    let knot;
    let labelInfo = [];
    for(let j = 0; j < mesh.branches.length; j++){  //add card for each branch
        createBranchBlock(svg, branchObjs[mesh.branches[j]-1], j*(width+Xspacing)+Xspacing+1+originX, 1+originY, width, height, lang);
        createArrow(svg, j*(width+Xspacing)+Xspacing+width+1+originX, height/2+originY, j*(width+Xspacing)+width+2*Xspacing+1+originX, height/2+originY, color)

        if(mesh.branchesDir[j] == 1) knot = branchObjs[mesh.branches[j]-1].endNode;
        else knot = branchObjs[mesh.branches[j]-1].startNode;

        if(j == mesh.branches.length-1){ //add lines
            createArrow(svg, j*(width+Xspacing)+width+2*Xspacing+1+originX, height/2+originY, j*(width+Xspacing)+width+2*Xspacing+1+originX, height+aux+1+originY, color)
            createArrow(svg, j*(width+Xspacing)+width+2*Xspacing+1+originX, height+aux+1+originY, 1+originX, height+aux+1+originY, color)
            createArrow(svg, 1+originX, height+aux+1+originY, 1+originX, height/2+1+originY, color)
            createArrow(svg, 1+originX, height/2+1+originY, 1+Xspacing+originX, height/2+1+originY, color)
            createArrow(svg, Xspacing-8+originX, height/2+1+8+originY, 1+Xspacing+originX, height/2+1+originY, color)
            createArrow(svg, Xspacing-8+originX, height/2+1-8+originY, 1+Xspacing+originX, height/2+1+originY, color)
            
        }

        labelInfo.push({fromX: j*(width+Xspacing)+1.5*Xspacing+width+1+originX, fromY: height/2+originY, labelX: j*(width+Xspacing)+1.5*Xspacing+width+1+originX, labelY: originY-25, labelText: knot});
    }
    for(let i = 0; i < labelInfo.length; i++){
        createKnotLabels(svg, labelInfo[i]); //add labels
    }
}
/**
 * Creates the know labels
 * @param {object} svg svg to construct 
 * @param {Array} labelInfo info about the label
 */
function createKnotLabels(svg, labelInfo){
    const labelWidth = 50;
    const labelHeight = 30;

    createArrow(svg, labelInfo.fromX, labelInfo.fromY, labelInfo.labelX, labelInfo.labelY, "#1e2b37");

    svg.append("rect")
        .attr("width", labelWidth+2)
        .attr("height", labelHeight+2)
        .attr("x", labelInfo.labelX-labelWidth/2)
        .attr("y", labelInfo.labelY)
        .attr("rx", 6)
        .attr("ry", 6)
        .attr('fill',  '#ced0ce')

    svg.append("rect")
        .attr("width", labelWidth)
        .attr("height", labelHeight)
        .attr("x", labelInfo.labelX-labelWidth/2)
        .attr("y", labelInfo.labelY)
        .attr("rx", 6)
        .attr("ry", 6)
        .attr('fill',  'white')

    svg.append("text")
        .text(labelInfo.labelText.toUpperCase())
            .attr("x", labelInfo.labelX)
            .attr("y", labelInfo.labelY+0.78*labelWidth/2)
            .style("text-anchor", "middle")
            .style('fill', '#6f7f8c')
            .attr("font-family", " inherit")
            .attr("font-weight", 500)
            .attr("font-size", 14)
            .attr("line-wight", 1.2)

    svg.append("circle")
        .attr("cx", labelInfo.fromX)
        .attr("cy", labelInfo.fromY)
        .attr("r", 5)
        .style('fill', '#1e2b37')
}
/**
 * Creates line
 * @param {object} svg svg to construct 
 * @param {number} x1 from x
 * @param {number} y1 from y
 * @param {number} x2 to x
 * @param {number} y2 to y
 * @param {number} totalCurrents Number of currents in the circuit
 */
function createArrow(svg, x1, y1, x2, y2, color){
    svg.append("line")
        .attr("x1", x1)  
        .attr("y1", y1)  
        .attr("x2", x2)  
        .attr("y2", y2)  
        .attr("stroke", color)  
        .attr("stroke-width", 2)
}
/**
 * Creates branch block info
 * @param {object} svg svg to construct
 * @param {object} branch 
 * @param {number} x at x
 * @param {number} y at y
 * @param {number} w block width
 * @param {number} h block height
 */
function createBranchBlock(svg, branch, x, y, w, h, lang){

    svg.append("rect")
        .attr("width", w+2)
        .attr("height", h+2)
        .attr("x", x-1)
        .attr("y", y-1)
        .attr("rx", 6)
        .attr("ry", 6)
        .attr('fill',  '#ced0ce')

    svg.append("rect")
        .attr("width", w)
        .attr("height", h)
        .attr("x", x)
        .attr("y", y)
        .attr("rx", 6)
        .attr("ry", 6)
        .attr('fill',  'white')

    svg.append("rect")
        .attr("width", w+2)
        .attr("height", h/2+2)
        .attr("x", x-1)
        .attr("y", y-1)
        .attr("rx", 6)
        .attr("ry", 6)
        .attr('fill',  '#6f969a')    

    svg.append("rect")
        .attr("width", w)
        .attr("height",h/2)
        .attr("x", x)
        .attr("y", y)
        .attr("rx", 6)
        .attr("ry", 6)
        .attr('fill',  '#7ba7ac')

    let word;

	if(lang == "english") word = "Branch";
    else word = "Ramo";

    svg.append("text")
        .text(word + ' ' + branch.id)
            .attr("x", w/2+x)
            .attr("y", 0.35*h+y)
            .style("text-anchor", "middle")
            .style('fill', 'white')
            .attr("font-family", " inherit")
            .attr("font-weight", 500)
            .attr("font-size", 16)
            .attr("line-wight", 1.2)

    let comp = '';
    for(let i = 0; i < branch.components.length; i++){
        comp +=branch.components[i].ref; 
        if(!(i == branch.components.length-1)) comp += " | ";
    }

    svg.append("text")
        .text(comp)
        .attr("x", w/2+x)
        .attr("y", 0.8*h+y)
        .style("text-anchor", "middle")
        .style('fill', '#6f7f8c')
        .attr("font-family", " inherit")
        .attr("font-weight", 500)
        .attr("font-size", 14)
        .attr("line-wight", 1.2)
}

//JSPDF PRINT EQUATION
/**
 * Function to print an equation formated in latex, in jsPDF
 * @param {object} doc jsPDF document
 * @param {string} latexString latex string
 * @param {number} x horizontal alignment
 * @param {number} y vertical alignment
 * @param {string} mode text alignment 'left', 'center' or 'right'
 * @returns {number} line vertical height
 */
 function printEquation(doc, latexString, x, y, mode){
    let side;
    if(mode == 'center') side = x-latexString.replaceAll("\\angle", "<").replaceAll("^{\\circ}", " ").replaceAll("{", "").replaceAll("}", "").replaceAll("_", "").replaceAll(" ", "").replaceAll("~", " ").length*6/2;
    else if(mode == 'left') side = x;
    else if(mode == 'right') side = x-latexString.replaceAll("\\angle", "  ").replaceAll("^{\\circ}", " ").replaceAll("{", "").replaceAll("}", "").replaceAll("_", "").replaceAll(" ", "").replaceAll("~", " ").length*6;

    latexString = latexString.replaceAll(" ", "");

    for(let i = 0; i < latexString.length; i++){
        if(latexString.charAt(i) == "\\"){
            let nextChar = latexString.substr(i+1, i+6);
            if(nextChar.includes('angle')){
                //imprimir o angulo
                doc.setFontSize(subsubtitleSize);
                doc.text('<', side+=8.5, y+4.5, null, 25, 'center');
                i+=6;
            }
        }
        if(latexString.charAt(i) == "_"){
            let sub = '';
            for(let j = i+2; j < latexString.length; j++){
                if(latexString.charAt(j) == '}') break;
                else sub+=latexString.charAt(j);
            }
            //imprimir em baixo
            doc.setFontSize(tinyInfoSize);
            doc.text(sub, side+7, y+3, null, null, 'center');
            i+=sub.length+3;
            side+=4.5*sub.length;
        }
        if(latexString.charAt(i) == "^"){
            let nextChar = latexString.substr(i+1, i+10);
            if(nextChar.includes('{\\circ}')){
                //imprimir o grau
                doc.setFontSize(tinyInfoSize);
                doc.text('o', side+=6, y-5, null, null, 'center');
                i+=7;
                side+=0.5;
            }
        }
        else if(latexString.charAt(i) == "~"){
            //imprimir um espaço
            doc.setFontSize(smallInfoSize);
            doc.text(' ', side+=6, y, null, null, 'center');
        }
        else if(latexString.charAt(i) == ","){
            //imprimir um espaço
            doc.setFontSize(smallInfoSize);
            doc.text(',', side+=4, y, null, null, 'center');
            side-=2;
        }
        else if(latexString.charAt(i) == "-" || latexString.charAt(i) == '+'){
            //imprimir um espaço
            doc.setFontSize(smallInfoSize);
            doc.text('-', side+=5, y, null, null, 'center');
            //side-=2;
        }
        else{
            //imprimir a letra
            doc.setFontSize(smallInfoSize);
            doc.text(latexString.charAt(i), side+=6, y, null, null, 'center');
        }
    }
}
