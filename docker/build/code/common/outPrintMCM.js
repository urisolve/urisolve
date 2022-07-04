
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
    htmlstr += '<h6 class="lead" data-translate="_MCMEqPri"></h6></div>';
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

        if(meshesObjs[i].type == 1){
            if(meshesObjs[i].currValue.complex){
                htmlstr += katex.renderToString("\\underline{I_{Mp"+meshesObjs[i].displayId+"}}~:~"+meshesObjs[i].incognitoEq, {throwOnError: false});
            }
            else{
                htmlstr += katex.renderToString("I_{Mp"+meshesObjs[i].displayId+"}~:~"+meshesObjs[i].incognitoEq, {throwOnError: false});
            }
        }
        else{
            if(meshesObjs[i].currValue.complex){
                let resultMag = resultDecimals(Math.sqrt(Math.pow(meshesObjs[i].currValue.re, 2) + Math.pow(meshesObjs[i].currValue.im, 2)), 2, false);
                let resultAng = resultDecimals(Math.atan(meshesObjs[i].currValue.im/meshesObjs[i].currValue.re)*57.2957795, 2, true);
                htmlstr += katex.renderToString("\\underline{I_{Ma"+meshesObjs[i].displayId+"}}~:~"+ resultMag.value + '\\angle ' + resultAng.value + '^{\\circ}\\;' + resultMag.unit +'A', {throwOnError: false});  
            }
            else{
                let result = resultDecimals(meshesObjs[i].currValue.value, 2, false);
                htmlstr += katex.renderToString("I_{Ma"+meshesObjs[i].displayId+"}~:~"+result.value+result.unit+"A", {throwOnError: false});  
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
        let aux = '';
        if(meshes[k].type == 0) aux = 'a';
        else  aux = 'p';
        aux += String(meshes[k].displayId);  
        // Generate Equation
        if(meshes[k].currValue.complex){ //malha é complexa
            let resultAng = resultDecimals(meshes[k].currValue.angle, 3, true);
            let resultMag = resultDecimals(meshes[k].currValue.magnitude, 2, false);
            if(resultMag.value == 0){
                str += "\\underline{I_{M" + aux + "}} = " + resultMag.value + resultMag.unit + '~A\\\\';
            }
            else{
                str += "\\underline{I_{M" + aux + "}} = " + resultMag.value + '\\angle{} ' + resultAng.value + '^{\\circ{}}\\;' + resultMag.unit + 'A\\\\';
            }
        }
        else{ //malha é real
            let result = resultDecimals(meshes[k].currValue.value, 2, false);
            str += "I_{M" + aux + "} = " + result.value + result.unit + 'A\\\\';
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
                let resultAng = resultDecimals(currents[k].angle, 3, true);
                if(resultMag.value == 0){
                    str += '\\underline{' + currents[k].ref + '}=' + resultMag.value + resultMag.unit + '~A';
                }
                else{
                    str += '\\underline{' + currents[k].ref + '}=' + resultMag.value + '\\angle ' + resultAng.value + '^{\\circ}\\;' + resultMag.unit + 'A';
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

    //remove this block after testing
    //version
    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3">Debug - Version</h5></div></div>';
    htmlstr += '<div class="container mt-3" id="version"></div><div class="container mt-3">';

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
 function getTexFileHeaderMCMRich(lang){
    let texHeader = '';
    texHeader += '\\documentclass[a4paper]{article}\r\n\\usepackage{graphicx}\r\n\\usepackage[latin1]{inputenc}\r\n\\usepackage{amsmath}\r\n\\usepackage{fancyhdr}\r\n\\pagestyle{fancy}\r\n\\lhead{\\textsc{URIsolve App}}\r\n\\rhead{\\textsc{' + lang._MCMmethod + '}}\r\n\\cfoot{www.isep.ipp.pt}\r\n\\lfoot{DEE - ISEP}\r\n\\rfoot {\\thepage}\r\n\\renewcommand{\\headrulewidth}{0.4pt}\r\n\\renewcommand{\\footrulewidth}{0.4pt}\r\n\r\n\\title{\r\n\\raisebox{-.2\\height}{\\includegraphics[height=1cm, keepaspectratio]{logo}} URIsolve APP \\\\\r\n\\newline\r\n\\textsc{' + lang._MCMmethod + '} \\\\\r\n \\\\\r\n' + lang._step_by_step + ' \\\\\r\n\\vspace*{1\\baselineskip}\r\n}\r\n\r\n';
    texHeader += '\\author{\\begin{tabular}[t]{c@{\\extracolsep{8em}}c}&\\\\\\multicolumn{2}{c}{\\textbf{\\emph{' + lang._project_coor + '}}}  \\\\&\\\\André Rocha         & Mário Alves         \\\\anr@isep.ipp.pt     & mjf@isep.ipp.pt     \\\\&\\\\Lino Sousa          & Francisco Pereira   \\\\sss@isep.ipp.pt     & fdp@isep.ipp.pt     \\\\&\\\\&\\\\\\multicolumn{2}{c}{\\textbf{\\emph{' + lang._devel + '}}}  \\\\&\\\\\\multicolumn{2}{c}{\\small{\\textbf{v2.0.0 - 07/2022}}}  \\\\\\multicolumn{2}{c}{Ângelo Pinheiro - 1190398@isep.ipp.pt}  \\\\\\multicolumn{2}{c}{\\small{\\textbf{v1.0.0 - 09/2019}}}  \\\\\\multicolumn{2}{c}{Miguel Duarte - 1131201@isep.ipp.pt}  \\\\\\end{tabular}}\r\n\r\n\\date{}\r\n\r\n';

    texHeader += "\\begin{document}\r\n\r\n\\maketitle\r\n\\thispagestyle{empty}\r\n\r\n\\vspace{\\fill}\r\n\\begin{abstract}\r\n\\centering\r\n" + lang._abstract + "\r\n\\end{abstract}\r\n\\vspace{\\fill}\r\n\r\n\\begin{center}\r\n\\today\r\n\\end{center}\r\n\r\n\\clearpage\r\n\\pagenumbering{arabic}\r\n\r\n\\newpage\r\n\r\n";
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

    let lang = document.getElementById("lang-sel-txt").innerText.toLowerCase();
    if(lang == 'english') lang = dictionary.english;
    else if(lang == 'português') lang = dictionary.portuguese;

	// Tex Variable
	let TeX = getTexFileHeaderMCMRich(lang);

	if(fileContents[0]){
		TeX += "\\section{" + lang._circuitImage + "}\r\n\r\n\\begin{figure}[hbt]\r\n\\centering{";
		TeX += "\\includegraphics[width=\\textwidth, keepaspectratio]{circuit}}\r\n\\caption{";
		TeX += lang._circuitImage + "}\r\n\\label{circuitimage}\r\n\\end{figure}\r\n\r\n";
	}

	// TeX Fundamental Vars
	TeX += "\\section{" + lang._fundamentalsTitle + "}\r\n\r\n\\begin{table}[hbt!]\r\n\\centering\r\n\\begin{tabular}{clclclc}\r\n";
	TeX += "\\textbf{" + lang._fundamentals_R + " {[}R{]}}&&\\textbf{" + lang._fundamentals_N + " {[}N{]}}&&\\textbf{" + lang._fundamentals_C + " {[}C{]}}&&\\textbf{" + lang._fundamentals_T + " {[}T{]}} \\\\\r\n";
	TeX += "R="+R+"&&N="+N+"&&C="+C+"&&T="+T+"\r\n\\end{tabular}\r\n\\end{table}\r\n\r\n";

	// TeX Circuit Information
	TeX += "\\section{" + lang._infoTitle + "}\r\n\r\n\\begin{table}[h!]\r\n\\centering\r\n\\begin{tabular}{clclclc}\r\n";
	TeX += "\\textbf{" + lang._info_T + " {[}AC\/DC{]}} && \\textbf{" + lang._info_F + " {[}A{]}} && \\textbf{" + lang._info_A + " {[}I{]}} \\\\\r\n";
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
    TeX += "\\section{" + lang._MeshNumberTitle + "}\r\n\r\n\\subsection{" + lang._MainMeshes + "}\r\n\r\n";
    TeX += "\\begin{gather*}\r\nM_{p}=R-(N-1)-C ~ \\Leftrightarrow \\\\";
    TeX += "M_{p}="+R+"-("+N+"-1)-"+C+" ~ \\Leftrightarrow \\\\";
	TeX += "\\Leftrightarrow ~ M_{p}="+E+"\\end{gather*}\r\n\\par\r\n\r\n";
	TeX += "\\paragraph{} " + lang._nrOfEquations + " \r\n";
    TeX += "\r\n\\subsection{" + lang._AuxMeshes + "}\r\n\r\n";
    TeX += "\\paragraph{} " + lang._nrOfCurrSrc + "\r\n";
    TeX += "\\begin{gather*}\r\nC = " + C + "\\implies  M_{a} = " + C+"\r\n\\end{gather*}\r\n\\pagebreak";

	//circuit mesh images
	let pagebreakCounter = 0;
	TeX += "\\section{" + lang._MeshTitle + "}\r\n\r\n";
	meshImages.forEach(image => {
		let aux;
		if(meshes[image.id-1].type == 0) aux = lang._typeA;
		else aux = lang._typeP;
		TeX += "\\subsection{" + lang._kmlMesh + "~" + image.id + "~-~" + aux + "}\r\n"
		TeX += "\\begin{figure}[hbt]\r\n\\centering{\\includegraphics[height=4cm, keepaspectratio]{"
		TeX += "meshImage" + image.id + "}}\r\n\r\n\\end{figure}\r\n";
        if(meshes[image.id-1].type == 1)
            if(meshes[image.id-1].currValue.complex){
                TeX += "\\begin{equation}\r\n \\textrm{Equation}: \\quad \\underlineI_{Mp"+ meshes[image.id-1].displayId+"}}~:~" + meshes[image.id-1].incognitoEq +"&\r\n\\end{equation}\r\n\r\n";
            }
            else{
                TeX += "\\begin{equation}\r\n \\textrm{Equation}: \\quad I_{Mp"+ meshes[image.id-1].displayId+"}~:~" + meshes[image.id-1].incognitoEq +"&\r\n\\end{equation}\r\n\r\n";
            }
        else{
            if(meshes[image.id-1].currValue.complex){
				let resultMag = resultDecimals(Math.sqrt(Math.pow(meshes[image.id-1].currValue.re, 2) + Math.pow(meshes[image.id-1].currValue.im, 2)), 2, false);
				let resultAng = resultDecimals(Math.atan(meshes[image.id-1].currValue.im/meshes[image.id-1].currValue.re)*57.2957795, 3, true);
                TeX += "\\begin{equation}\r\n \\textrm{Value}: \\quad \\underline{I_{Ma"+meshes[image.id-1].displayId+"}}~:~"+ resultMag.value + '\\angle ' + resultAng.value + '^{\\circ}\\;' + resultMag.unit + 'A&\r\n\\end{equation}\r\n\r\n';  
            }
            else{
				let result = resultDecimals(meshes[image.id-1].currValue.value)
                TeX += "\\begin{equation}\r\n \\textrm{Value}: \\quad I_{Ma" + meshes[image.id-1].displayId+"}~:~" + result.value + result.unit + "A&\r\n\\end{equation}\r\n\r\n";  
            }		
		}
		pagebreakCounter++;
        if(pagebreakCounter == 2){
            pagebreakCounter = 0;
            TeX += "\\pagebreak";
        }

	});


	//equation system
	TeX += "\\pagebreak\\section{" + lang._eqSystemTitle + "}\r\n\r\n\\paragraph{} ";

    if(simpEquations.allRevealedEq.length > 0){
        let str = '\\large \\begin{cases}';
        for(let k = 0; k<simpEquations.allRevealedEq.length; k++){
            str += simpEquations.allRevealedEq[k];
            if(k < simpEquations.allRevealedEq.length-1)
                str += '\\\\[0.7em] ';

        }
        str += '\\end{cases}';
        TeX += lang._snEquat + "\r\n\\begin{gather*}\r\n"+str+"\r\n\\end{gather*}\r\n\\par\r\n\r\n\\paragraph{} ";

        TeX += lang._Steps + ":\r\n\r\n";
        //step 1
        str = '\\large \\begin{cases}';
        for(let k = 0; k<simpEquations.allVariableEq.length; k++){
            str += simpEquations.allVariableEq[k];
            if(k<simpEquations.allVariableEq.length-1)
                str += ' \\\\[0.7em] ';

        }
        str += '\\end{cases}';
        TeX += "\\begin{small}\\textbf{\\textit{" + lang._step + " 1:}}\\end{small}  " + lang._eqStep1MCM + "\r\n";
        TeX += "\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n\r\n";
        //step 2
        str = '\\large \\begin{cases}';
        for(let k = 0; k<simpEquations.meshCurrRevealedEq.length; k++){
            str += simpEquations.meshCurrRevealedEq[k];
            if(k<simpEquations.meshCurrRevealedEq.length-1)
                str += ' \\\\[0.7em] ';

        }
        str += '\\end{cases}';
        TeX += "\\begin{small}\\textbf{\\textit{" + lang._step + " 2:}}\\end{small}  " + lang._eqStep2MCM + "\r\n";
        TeX += "\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n\r\n"
        //step 3
        str = '\\large \\begin{cases}';
        for(let k = 0; k<simpEquations.allRevealedEq.length; k++){
            str += simpEquations.allRevealedEq[k];
            if(k<simpEquations.allRevealedEq.length-1)
                str += ' \\\\[0.7em] ';

        }
        str += '\\end{cases}';
        TeX += "\\begin{small}\\textbf{\\textit{" + lang._step + " 3:}}\\end{small}  " + lang._eqStep3MCM + "\r\n";
        TeX += "\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n\r\n";        
    }
    else{
        TeX += lang._noSystem;
    }

	// Add Equation system
	str = '\\large \\begin{cases}';
	for(let k = 0; k<meshes.length; k++){
        let aux = '';
        if(meshes[k].type == 0) aux = 'a';
        else  aux = 'p';
        aux += String(meshes[k].displayId);
        
		// Generate Equation
        if(meshes[k].currValue.complex){ //malha é complexa
            let resultMag = resultDecimals(Math.sqrt(Math.pow(meshes[k].currValue.re, 2) + Math.pow(meshes[k].currValue.im, 2)), 2, false);
            let resultAng = resultDecimals(Math.atan(meshes[k].currValue.im/meshes[k].currValue.re)*57.2957795, 3, true);
			if(resultMag.value == 0){
                str += "\\underline{I_{M" + aux + "}} = " + resultMag.value + resultMag.unit + '~A\\\\';
            }
            else{
                str += "\\underline{I_{M" + aux + "}} = " + resultMag.value + '\\angle{} ' + resultAng.value + '^{\\circ{}}\\;' + resultMag.unit + 'A\\\\';
            }
        }
        else{ //malha é real
            let result = resultDecimals(meshes[k].currValue.value, 2, false);
            str += "I_{M" + aux + "} = " + result.value + result.unit + 'A\\\\';
        }
		if(k<results.length-1)
			str += ' \\\\[0.7em] ';
	}
	str += '\\end{cases}';

	TeX += "\\par\r\n\r\n\\pagebreak\r\n\r\n\\section{" + lang._resMesh + "}\r\n\r\n";
	TeX += "\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n\r\n";

	//mesh current results
	TeX += "\\section{" + lang._branchIden + "}\n\r\n\r\\subsection{" + lang._currents + "}\n\r\n\r";
	TeX += "\\begin{table}[ht]\r\n\\caption{" + lang._currentsTableCap + "}\r\n\\centering\r\n\\begin{tabular}{cccc}\r\n";
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
                let resultAng = resultDecimals(Math.atan(currents[k].valueIm/currents[k].valueRe)*57.2957795, 3, true);
				if(resultMag.value == 0){
					str += '\\underline{' + currents[k].ref + '}=' + resultMag.value + resultMag.unit + 'A';
				}
				else{
					str += '\\underline{' + currents[k].ref + '}=' + resultMag.value + '\\angle ' + resultAng.value + '^{\\circ}\\;' + resultMag.unit + 'A';
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

        TeX += "\\par\r\n\r\n\\pagebreak\r\n\r\n\\subsection{" + lang._resBranch + "}\r\n\r\n"

        TeX += "\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n";
        TeX += "\\begin{footnotesize}\r\n\\textbf{\\textit{Note: }} ";
        TeX += lang._currResNotes1MCM.slice(6) + "\r\n\\end{footnotesize}\r\n\r\n";
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
function getTexFileHeaderMCMOv(lang){

    let texHeader = '';
    texHeader = '\\documentclass[a4paper]{article}\r\n\\newcommand{\\inlineimages}[2]{\r\n\\newwrite\\tempfile\r\n\\immediate\\openout\\tempfile=#1.base64\r\n\\immediate\\write\\tempfile{#2}\r\n\\immediate\\closeout\\tempfile\r\n\\immediate\\write18{base64 -d #1.base64 > #1}\r\n\\includegraphics{#1}\r\n}\n\r';
    texHeader += '\\include{images}\r\n';
    texHeader += '\\usepackage{graphicx}\r\n\\usepackage[latin1]{inputenc}\r\n\\usepackage{amsmath}\r\n\\usepackage{fancyhdr}\r\n\\pagestyle{fancy}\r\n\\lhead{\\textsc{URIsolve App}}\r\n\\rhead{\\textsc{' + lang._MCMmethod + '}}\r\n\\cfoot{www.isep.ipp.pt}\r\n\\lfoot{DEE - ISEP}\r\n\\rfoot {\\thepage}\r\n\\renewcommand{\\headrulewidth}{0.4pt}\r\n\\renewcommand{\\footrulewidth}{0.4pt}\r\n\r\n\\title{\r\n\\raisebox{-.2\\height}{\\scalebox{.30}{\\inlineimages{logo.png}{\\logo}}} URIsolve APP \\\\\r\n\r\n\\textsc{' + lang._MCMmethod + '} \\\\\r\n\\\r\n' + lang._step_by_step + ' \\\\\r\n\\vspace*{1\\baselineskip}\r\n}\r\n\r\n';
    texHeader += '\\author{\\begin{tabular}[t]{c@{\\extracolsep{8em}}c}&\\\\\\multicolumn{2}{c}{\\textbf{\\emph{' + lang._project_coor + '}}}  \\\\&\\\\André Rocha         & Mário Alves         \\\\anr@isep.ipp.pt     & mjf@isep.ipp.pt     \\\\&\\\\Lino Sousa          & Francisco Pereira   \\\\sss@isep.ipp.pt     & fdp@isep.ipp.pt     \\\\&\\\\&\\\\\\multicolumn{2}{c}{\\textbf{\\emph{' + lang._devel + '}}}  \\\\&\\\\\\multicolumn{2}{c}{\\small{\\textbf{v2.0.0 - 07/2022}}}  \\\\\\multicolumn{2}{c}{Ângelo Pinheiro - 1190398@isep.ipp.pt}  \\\\\\multicolumn{2}{c}{\\small{\\textbf{v1.0.0 - 09/2019}}}  \\\\\\multicolumn{2}{c}{Miguel Duarte - 1131201@isep.ipp.pt}  \\\\\\end{tabular}}\r\n\r\n\\date{}\r\n\r\n';
    texHeader += '\\begin{document}\r\n\r\n\\maketitle\r\n\\thispagestyle{empty}\r\n\r\n\\vspace{\\fill}\r\n\\begin{abstract}\r\n\\centering\r\n' + lang._abstract + '\r\n\\end{abstract}\r\n\\vspace{\\fill}\r\n\r\n\\begin{center}\r\n\\today\r\n\\end{center}\r\n\r\n\\clearpage\r\n\\pagenumbering{arabic}\r\n\r\n\\newpage\r\n\r\n';
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

    let lang = document.getElementById("lang-sel-txt").innerText.toLowerCase();
    if(lang == 'english') lang = dictionary.english;
    else if(lang == 'português') lang = dictionary.portuguese;

	// Tex Variable
	let TeX = getTexFileHeaderMCMOv(lang);

	if(fileContents[0]){
		TeX += "\\section{" + lang._circuitImage + "}\r\n\r\n\\begin{figure}[hbt]\r\n\\centering{\\resizebox{12cm}{!}{";
		TeX += "\\inlineimages{circuit.png}{\\circuit}}}\r\n\\caption{";
		TeX += "" + lang._circuitImage + "}\r\n\\label{circuitimage}\r\n\\end{figure}\r\n\r\n";
	}

	// TeX Fundamental Vars
	TeX += "\\section{" + lang._fundamentalsTitle + "}\r\n\r\n\\begin{table}[hbt!]\r\n\\centering\r\n\\begin{tabular}{clclclc}\r\n";
	TeX += "\\textbf{" + lang._fundamentals_R + " {[}R{]}}&&\\textbf{" + lang._fundamentals_N + " {[}N{]}}&&\\textbf{" + lang._fundamentals_C + " {[}C{]}}&&\\textbf{" + lang._fundamentals_T + " {[}T{]}} \\\\\r\n";
	TeX += "R="+R+"&&N="+N+"&&C="+C+"&&T="+T+"\r\n\\end{tabular}\r\n\\end{table}\r\n\r\n";

	// TeX Circuit Information
	TeX += "\\section{" + lang._infoTitle + "}\r\n\r\n\\begin{table}[h!]\r\n\\centering\r\n\\begin{tabular}{clclclc}\r\n";
	TeX += "\\textbf{" + lang._info_T + " {[}AC\/DC{]}} && \\textbf{" + lang._info_F + " {[}A{]}} && \\textbf{" + lang._info_A + " {[}I{]}} \\\\\r\n";
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
    TeX += "\\section{" + lang._MeshNumberTitle + "}\r\n\r\n\\subsection{" + lang._MainMeshes + "}\r\n\r\n";
    TeX += "\\begin{gather*}\r\nM_{p}=R-(N-1)-C ~ \\Leftrightarrow \\\\";
    TeX += "M_{p}="+R+"-("+N+"-1)-"+C+" ~ \\Leftrightarrow \\\\";
	TeX += "\\Leftrightarrow ~ M_{p}="+E+"\\end{gather*}\r\n\\par\r\n\r\n";
	TeX += "\\paragraph{} " + lang._nrOfEquations + "\r\n";
    TeX += "\r\n\\subsection{" + lang._AuxMeshes + "}\r\n\r\n";
    TeX += "\\paragraph{} " + lang._nrOfCurrSrc + "\r\n";
    TeX += "\\begin{gather*}\r\nC = " + C + "\\implies  M_{a} = " + C+"\r\n\\end{gather*}\r\n\\pagebreak";

	//circuit mesh images
    const substitutions = "abcdfghjklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVYXYZ";
	let pagebreakCounter = 0;
	TeX += "\\section{" + lang._MeshTitle + "}\r\n\r\n";
	meshImages.forEach(image => {
		let aux;
		if(meshes[image.id-1].type == 0) aux = lang._typeA;
		else aux = lang._typeP;
        let prop = 1;
        if(image.width > 350){
            prop = 350/image.width;
        }
		TeX += "\\subsection{" + lang._kmlMesh + "~" + image.id + "~-~" + aux + "}\r\n"
		TeX += "\\begin{figure}[hbt]\r\n\\centering{\\resizebox{" + (image.width*prop).toFixed(0) + "pt}{!}{\\inlineimages{"
		TeX += "mesh" + String(image.id) + ".png}{\\mesh" + substitutions[meshImages.indexOf(image)] + "}}}\r\n\r\n\\end{figure}\r\n";
        if(meshes[image.id-1].type == 1){
            if(meshes[image.id-1].currValue.complex){
                TeX += "\\begin{equation}\r\n \\textrm{Equation}: \\quad \\underline{I_{Mp"+ meshes[image.id-1].displayId+"}}~:~" + meshes[image.id-1].incognitoEq +"\r\n\\end{equation}\r\n\r\n";
            }
            else{
                TeX += "\\begin{equation}\r\n \\textrm{Equation}: \\quad I_{Mp"+ meshes[image.id-1].displayId+"}~:~" + meshes[image.id-1].incognitoEq +"\r\n\\end{equation}\r\n\r\n";
            }
        }
        else{
            if(meshes[image.id-1].currValue.complex){
				let resultMag = resultDecimals(Math.sqrt(Math.pow(meshes[image.id-1].currValue.re, 2) + Math.pow(meshes[image.id-1].currValue.im, 2)), 2, false);
				let resultAng = resultDecimals(Math.atan(meshes[image.id-1].currValue.im/meshes[image.id-1].currValue.re)*57.2957795, 3, true);
                TeX += "\\begin{equation}\r\n \\textrm{Value}: \\quad \\underline{I_{Ma"+meshes[image.id-1].displayId+"}}~:~"+ resultMag.value + '\\angle ' + resultAng.value + '^{\\circ}\\;' + resultMag.unit + 'A\r\n\\end{equation}\r\n\r\n';  
            }
            else{
				let result = resultDecimals(meshes[image.id-1].currValue.value)
                TeX += "\\begin{equation}\r\n \\textrm{Value}: \\quad I_{Ma" + meshes[image.id-1].displayId+"}~:~" + result.value + result.unit + "A\r\n\\end{equation}\r\n\r\n";  
            }		
		}
		pagebreakCounter++;
        if(pagebreakCounter == 2){
            pagebreakCounter = 0;
            TeX += "\\pagebreak";
        }

	});


	//equation system
	TeX += "\\pagebreak\\section{" + lang._eqSystemTitle + "}\r\n\r\n\\paragraph{} ";

    if(simpEquations.allRevealedEq.length > 0){
        let str = '\\large \\begin{cases}';
        for(let k = 0; k<simpEquations.allRevealedEq.length; k++){
            str += simpEquations.allRevealedEq[k];
            if(k < simpEquations.allRevealedEq.length-1)
                str += '\\\\[0.7em] ';

        }
        str += '\\end{cases}';
        TeX += lang._snEquat + "\r\n\\begin{gather*}\r\n"+str+"\r\n\\end{gather*}\r\n\\par\r\n\r\n\\paragraph{} ";

        TeX += lang._Steps + ":\r\n\r\n";
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
    }
    else{
        TeX +=  lang._noSystem;
    }



	// Add Equation system
	str = '\\large \\begin{cases}';
	for(let k = 0; k<meshes.length; k++){
        let aux = '';
        if(meshes[k].type == 0) aux = 'a';
        else  aux = 'p';
        aux += String(meshes[k].displayId); 

		// Generate Equation
        if(meshes[k].currValue.complex){ //malha é complexa
            let resultMag = resultDecimals(Math.sqrt(Math.pow(meshes[k].currValue.re, 2) + Math.pow(meshes[k].currValue.im, 2)), 2, false);
            let resultAng = resultDecimals(Math.atan(meshes[k].currValue.im/meshes[k].currValue.re)*57.2957795, 3, true);
			if(resultMag.value == 0){
                str += "\\underline{I_{M" + aux + "}} = " + resultMag.value + resultMag.unit + '~A\\\\';
            }
            else{
                str += "\\underline{I_{M" + aux + "}} = " + resultMag.value + '\\angle{} ' + resultAng.value + '^{\\circ{}}\\;' + resultMag.unit + 'A\\\\';
            }
        }
        else{ //malha é real
            let result = resultDecimals(meshes[k].currValue.value, 2, false);
            str += "I_{M" + aux + "} = " + result.value + result.unit + 'A\\\\';
        }
		if(k<results.length-1)
			str += ' \\\\[0.7em] ';
	}
	str += '\\end{cases}';

	TeX += "\\par\r\n\r\n\\pagebreak\r\n\r\n\\section{" + lang._resMesh + "}\r\n\r\n";
	TeX += "\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n\r\n";

	//mesh current results
	TeX += "\\section{" + lang._branchIden + "}\r\n\r\n\\subsection{" + lang._currents + "}\n\r\n\r";
	TeX += "\\begin{table}[ht]\r\n\\caption{" + lang._currentsTableCap + "}\r\n\\centering\r\n\\begin{tabular}{cccc}\r\n";
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
                let resultAng = resultDecimals(Math.atan(currents[k].valueIm/currents[k].valueRe)*57.2957795, 3, true);
				if(resultMag.value == 0){
					str += '\\underline{' + currents[k].ref + '}=' + resultMag.value + resultMag.unit + 'A';
				}
				else{
					str += '\\underline{' + currents[k].ref + '}=' + resultMag.value + '\\angle ' + resultAng.value + '^{\\circ}\\;' + resultMag.unit + 'A';
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

        TeX += "\\par\r\n\r\n\\pagebreak\r\n\r\n\\subsection{" + lang._resBranch + "}\r\n\r\n"

        TeX += "\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n";
        TeX += "\\begin{footnotesize}\r\n\\textbf{\\textit{Note: }} ";
        TeX += lang._currResNotes1MCM.slice(6) + "\r\n\\end{footnotesize}\r\n\r\n";
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

    let lang = document.getElementById("lang-sel-txt").innerText.toLowerCase();
    if(lang == 'english') lang = dictionary.english;
    else if(lang == 'português') lang = dictionary.portuguese;

    //init file
    let doc = new jsPDF({unit:'pt', format:'a4'});
    doc.setFont("../../vendor/jsPDF-master/docs/fonts/cmunbsr/SourceSerifPro-Light-normal", "regular");
    doc.page = 1;
    const height = doc.internal.pageSize.height;


    //print head
    doc = printBuildHead(doc, lang);

    doc.addPage();
    doc = printBuildFoot(doc, marginSides, marginBottom, marginTop, lang);
    line = height*marginTop;

    //print information
    line = printCircuitImage(doc, line, marginSides, marginTop, marginBottom, lang);
    line = printFundVars(doc, file, line+=10, marginSides, marginTop, marginBottom, lang);
    line = printCircInfo(doc, file, line+=10, marginSides, marginTop, marginBottom, lang);
    line = printMeshCalc(doc, file, line+=10, marginSides, marginTop, marginBottom, lang);
    line = printCircuitMeshes(doc, file, meshImages, line, marginSides, marginBottom, marginTop, lang);
    line = printEqSystem(doc, file, line, marginSides, marginTop, marginBottom, lang);
    line = printMeshResults(doc, file, line, marginSides, marginTop, marginBottom, lang);
    line = printCurrentsInfo(doc, file, line, marginSides, marginTop, marginBottom, lang);
    line = printBranchResults(doc, file, line, marginSides, marginTop, marginBottom, lang);

	doc.autoPrint();

    const d = new Date();
    let name = "U=Risolve_Results_D_" + d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate() + "_T_" + d.getHours() + ":" + d.getMinutes() + ":" + d.getMilliseconds() + ".pdf";
    doc.setProperties({ title: name });
	doc.output("dataurlnewwindow", {filename: "Results"});
}
/**
 * Function to build the print pdf head
 * @param {object} doc jsPDF document
 */
function printBuildHead(doc, lang){
    let line = 170;
    const width = doc.internal.pageSize.width;

    doc.setFontSize(20);
    let sampleimg = base64imgselect("logo");
    doc.addImage(sampleimg, "JPG", width/2-70, line-20, 67/3.5, 82/3.5);
	doc.text('U=RIsolve APP', width/2+10, line-1, null, null, 'center');
    doc.text(lang._MCMmethod, width/2, line+=20, null, null, 'center');

    doc.setFontSize(16);
    doc.text(lang._step_by_step, width/2, line+=16, null, null, 'center');

    doc.setFontSize(13);
    doc.text(lang._project_coor, width/2, line+=50, null, null, 'center');


    doc.setFontSize(12);
    doc.text('André Rocha', width/3, line+=40, null, null, 'center');
    doc.text('Mário Alves', 2*width/3, line, null, null, 'center');
    doc.text('anr@isep.ipp.pt', width/3, line+=10, null, null, 'center');
    doc.text('mjf@isep.ipp.pt', 2*width/3, line, null, null, 'center');

    doc.text('Lino Sousa', width/3, line+=30, null, null, 'center');
    doc.text('Francisco Pereira', 2*width/3, line, null, null, 'center');
    doc.text('sss@isep.ipp.pt', width/3, line+=10, null, null, 'center');
    doc.text('fdp@isep.ipp.pt', 2*width/3, line, null, null, 'center');

    doc.setFontSize(13);
    doc.text(lang._devel, width/2, line+=40, null, null, 'center');

    doc.setFontSize(12);
    doc.text('v2.0.0 - 07/2022', width/2, line+=40, null, null, 'center');
    doc.text('Ângelo Pinheiro - 1190398@isep.ipp.pt', width/2, line+=15, null, null, 'center');

    doc.text('v1.0.0 - 09/2019', width/2, line+=30, null, null, 'center');
    doc.text('Miguel Duarte - 1131201@isep.ipp.pt', width/2, line+=15, null, null, 'center');
    

    doc.setFontSize(10);
    doc.text('Abstract', width/2, line+=100, null, null, 'center');

    doc.setFontSize(8);
    doc.text(lang._abstract.slice(0, 64), width/2, line+=10, null, null, 'center');
    doc.text(lang._abstract.slice(64), width/2, line+=10, null, null, 'center');


    doc.setFontSize(10);
    const d = new Date(); 
    doc.text(d.getDate()+" / "+(d.getMonth()+1)+" / "+d.getFullYear(), width/2, line+=150, null, null, 'center');

    return doc;
}
/**
 * Function to build the footer
 * @param {object} doc jsPDF document
 * @param {number} marginSides sides margin 0-1
 * @param {number} marginTop top margin 0-1
 * @param {number} marginBottom bottom margin 0-1
 */
function printBuildFoot(doc, marginSides, marginBottom, marginTop, lang){
    width = doc.internal.pageSize.width;
    height = doc.internal.pageSize.height;

    ms = width*marginSides;
    mb = height-marginBottom*height;
    mt = marginTop*height;

    doc.setFontSize(10);
    doc.text('DEE - ISEP', ms, mb, null, null, 'left');
    doc.text('U=RIsolve APP', ms, mt, null, null, 'left');
    doc.text(lang._page + doc.page, width-ms, mb, null, null, 'right');
    doc.text(lang._MCMmethod, width-ms, mt, null, null, 'right');
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
function printCircuitImage(doc, line, marginSides, marginBottom, marginTop, lang){
    let width = doc.internal.pageSize.width;
    let height = doc.internal.pageSize.height;

    doc.setFontSize(subtitleSize);
    doc.text('1.  ' + lang._circuitImage , marginSides*width, line+=35, null, null, 'left');

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
        doc.text(lang._noImage, width/2, line+=20, null, null, 'center');
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
function printFundVars(doc, file, line, marginSides, marginTop, marginBottom, lang){
    
    let R = file.branches.length;
	let N = countNodesByType(file.nodes, 0);
	let C = file.components.acAmpsPs.length + file.components.dcAmpsPs.length;
	let T = file.components.isolatedVPS.length;

    let width = doc.internal.pageSize.width;
    let height = doc.internal.pageSize.height;
    let innerWidth = width - 2 * width * marginSides;

    if(line+25+20+20 > height-height*marginBottom-10){
        doc.addPage();
        doc = printBuildFoot(doc, marginSides, marginBottom, marginTop, lang);
        line = height*marginTop;
    }
    

    doc.setFontSize(subtitleSize);
    doc.text('2.  ' + lang._fundamentalsTitle, marginSides*width, line+=25, null, null, 'left');

    doc.setFontSize(smallInfoSize);
    doc.text(lang._fundamentals_R + '   |', innerWidth/9 + width * marginSides, line+=20, null, null, 'center');
    doc.text(lang._fundamentals_N + '   |', 2.4*innerWidth/9 + width * marginSides, line, null, null, 'center');
    doc.text(lang._fundamentals_C + '   |', 4.2*innerWidth/9 + width * marginSides, line, null, null, 'center');
    doc.text(lang._fundamentals_T, 7.1*innerWidth/9 + width * marginSides, line, null, null, 'center');

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
function printCircInfo(doc, file, line, marginSides, marginTop, marginBottom, lang){
    
    let freq = file.analysisObj.circuitFreq;
	let totalCurrents = file.analysisObj.currents.length;
	let ammeters = file.probes.ammeters.length;

    let width = doc.internal.pageSize.width;
    let height = doc.internal.pageSize.height;
    let innerWidth = width - 2 * width * marginSides;

    if(line+25+20+20 > height-height*marginBottom-10){
        doc.addPage();
        doc = printBuildFoot(doc, marginSides, marginBottom, marginTop, lang);
        line = height*marginTop;
    }

    doc.setFontSize(subtitleSize);
    doc.text('3.  ' + lang._infoTitle, marginSides*width, line+=25, null, null, 'left');

    doc.setFontSize(smallInfoSize);
    doc.text(lang._info_T + ' [AC/DC]', innerWidth/4 + width * marginSides, line+=20, null, null, 'center');
    doc.text(lang._info_F, 2.5*innerWidth/4 + width * marginSides, line, null, null, 'center');
    doc.text(lang._info_A, 3.5*innerWidth/4 + width * marginSides, line, null, null, 'center');

    let aux;
    let aux1;
    if(freq.value == 0){
        aux = 'DC';
        aux1 = 'N / A';
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
function printMeshCalc(doc, file, line, marginSides, marginTop, marginBottom, lang){
    let width = doc.internal.pageSize.width;
    let height = doc.internal.pageSize.height;

    let R = file.branches.length;
	let N = countNodesByType(file.nodes, 0);
	let C = file.components.acAmpsPs.length + file.components.dcAmpsPs.length;
	let E = R - (N - 1) - C;

    if(line+25+25+60+20+10+10 > height-height*marginBottom-10){
        doc.addPage();
        doc = printBuildFoot(doc, marginSides, marginBottom, marginTop, lang);
        line = height*marginTop;
    }

    doc.setFontSize(subtitleSize);
    doc.text('4.  ' + lang._MeshNumberTitle, marginSides*width, line+=25, null, null, 'left');

    doc.setFontSize(subsubtitleSize);
    doc.text(' 4.1  ' + lang._MainMeshes, marginSides*width, line+=25, null, null, 'left');

    doc.setFontSize(smallInfoSize);
    doc.text("Mp = R - (N - 1) - C <=>", width/2, line+=20, null, null, 'center');
    doc.text("<=> Mp = "+ R +" - ("+ N +" - 1) - " + C + " <=> ", width/2, line+=20, null, null, 'center');
    doc.text("Mp = " + E, width/2, line+=20, null, null, 'center');

    if(lang == dictionary.portuguese){
        var slice1 = 85;
        var slice2 = 176;
        var slice3 = 87;
        var slice4 = 178;
        var slice5 = 269;
    }
    else if(lang == dictionary.english){
        var slice1 = 82;
        var slice2 = 171;
        var slice3 = 88;
        var slice4 = 173;
        var slice5 = 271;
    }

    doc.setFontSize(smallInfoSize);
    doc.text(lang._nrOfEquations.slice(0, slice1), marginSides*width, line+=20, null, null, 'left');
    doc.text(lang._nrOfEquations.slice(slice1, slice2), marginSides*width, line+=10, null, null, 'left');
    doc.text(lang._nrOfEquations.slice(slice2), marginSides*width, line+=10, null, null, 'left');

    if(line+25+70 > height-height*marginBottom-10){
        doc.addPage();
        doc = printBuildFoot(doc, marginSides, marginBottom, marginTop, lang);
        line = height*marginTop;
    }

    doc.setFontSize(subsubtitleSize);
    doc.text(' 4.2  ' + lang._AuxMeshes, marginSides*width, line+=25, null, null, 'left');

    doc.setFontSize(smallInfoSize);
    doc.text(lang._nrOfCurrSrc.slice(0, slice3), marginSides*width, line+=20, null, null, 'left');
    doc.text(lang._nrOfCurrSrc.slice(slice3, slice4), marginSides*width, line+=10, null, null, 'left');
    doc.text(lang._nrOfCurrSrc.slice(slice4, slice5), marginSides*width, line+=10, null, null, 'left');
    doc.text(lang._nrOfCurrSrc.slice(slice5), marginSides*width, line+=10, null, null, 'left');

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
function printCircuitMeshes(doc, file, images, line, marginSides, marginBottom, marginTop, lang){
    let width = doc.internal.pageSize.width;
    let height = doc.internal.pageSize.height;
    let meshes = file.analysisObj.chosenMeshes;

    if(line+25 > height-height*marginBottom-10){
        doc.addPage();
        doc = printBuildFoot(doc, marginSides, marginBottom, marginTop, lang);
        line = height*marginTop;
    } 

    if(lang == dictionary.portuguese){
        var slice1 = 48;
    }
    else if(lang == dictionary.english){
        var slice1 = 45;
    }

    doc.setFontSize(subtitleSize);
    doc.text('5.  ' + lang._MeshTitle.slice(0, slice1), marginSides*width, line+=25, null, null, 'left');
    doc.text(lang._MeshTitle.slice(slice1), marginSides*width, line+=15, null, null, 'left');

    for(let i = 0; i < meshes.length; i++){
        let prop = 1;
        if(images[i].width > width-2*width*marginSides) prop = (width-2*width*marginSides)/images[i].width;
        if(line+10+images[i].height*prop+30 > height-height*marginBottom-10){
            doc.addPage();
            doc = printBuildFoot(doc, marginSides, marginBottom, marginTop, lang);
            line = height*marginTop;
        }
        let aux = lang._typeP;
        if(meshes[i].type == 0) aux = lang._typeA;
        doc.setFontSize(subsubtitleSize);
        doc.text(' 5.' + String(i+1) + '  ' +  lang._kmlMesh + ' ' + String(i+1) + ' - ' + aux, marginSides*width, line+=22, null, null, 'left');


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
                printEquation(doc, "\\underline{I_{Ma"+meshes[i].displayId+"}}:~"+ resultMag.value + '\\angle' + resultAng.value + '^{\\circ}' + resultMag.unit +'A', width/2, line+=5, 'center');  
            }
            else{
                let result = resultDecimals(meshes[i].currValue.value, 2, false);
                printEquation(doc, "I_{Ma"+meshes[i].displayId+"}:~"+result.value+result.unit+"A", width/2, line+=5, 'center');  
            }
        }
        else{
            if(meshes[i].currValue.complex){
                printEquation(doc, "\\underline{I_{Mp"+meshes[i].displayId+"}}:~"+meshes[i].incognitoEq, width/2, line, 'center');  
            }
            else{
                printEquation(doc, "I_{Mp"+meshes[i].displayId+"}:~"+meshes[i].incognitoEq, width/2, line, 'center');  
            }
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
function printEqSystem(doc, file, line, marginSides, marginTop, marginBottom, lang){
    let width = doc.internal.pageSize.width;
    let height = doc.internal.pageSize.height;
    let equations =  file.analysisObj.equations;

    if(equations.allVariableEq.length > 0){
        //head + FINAL equation
        if(line+equations.allVariableEq.length*18+25+15 > height-height*marginBottom-10){
            doc.addPage();
            doc = printBuildFoot(doc, marginSides, marginBottom, marginTop, lang);
            line = height*marginTop;
        }
        doc.setFontSize(subtitleSize);
        doc.text('6.  ' + lang._eqSystemTitle, marginSides*width, line+=25, null, null, 'left');

        doc.setFontSize(bigInfoSize);
        doc.text(lang._snEquat, marginSides*width+10, line+=15, null, null, 'left');
        line+=5;
        doc.setLineWidth(1);
        doc.line(marginSides*width+13, line+5, marginSides*width+13, line+equations.allRevealedEq.length*18);
        for(let i = 0; i < equations.allRevealedEq.length; i++){
            printEquation(doc, equations.allRevealedEq[i], marginSides*width+15, line+=18, 'left');  
        }
        line+=5;

        //STEP 1
        if(line+equations.allVariableEq.length*18+25+15 > height-height*marginBottom-10){
            doc.addPage();
            doc = printBuildFoot(doc, marginSides, marginBottom, marginTop, lang);
            line = height*marginTop;
        }
        doc.setFontSize(smallInfoSize);
        doc.text(lang._step + ' 1 - ' + lang._eqStep1MCM, marginSides*width+13, line+=15, null, null, 'left');
        line+=5;
        doc.setLineWidth(1);
        doc.line(marginSides*width+17, line+5, marginSides*width+17, line+equations.allVariableEq.length*18);
        for(let i = 0; i < equations.allVariableEq.length; i++){
            printEquation(doc, equations.allVariableEq[i], marginSides*width+18, line+=18, 'left');  
        }
        line+=5;

        //STEP 2
        if(line+equations.allVariableEq.length*18+25+15 > height-height*marginBottom-10){
            doc.addPage();
            doc = printBuildFoot(doc, marginSides, marginBottom, marginTop, lang);
            line = height*marginTop;
        }
        doc.setFontSize(smallInfoSize);
        doc.text(lang._step + ' 2 - ' + lang._eqStep2MCM, marginSides*width+13, line+=15, null, null, 'left');
        line+=5;
        doc.setLineWidth(1);
        doc.line(marginSides*width+17, line+5, marginSides*width+17, line+equations.meshCurrRevealedEq.length*18);
        for(let i = 0; i < equations.meshCurrRevealedEq.length; i++){
            printEquation(doc, equations.meshCurrRevealedEq[i], marginSides*width+18, line+=18, 'left');  
        }
        line+=5;

        //STEP 3
        if(line+equations.allVariableEq.length*18+25+15 > height-height*marginBottom-10){
            doc.addPage();
            doc = printBuildFoot(doc, marginSides, marginBottom, marginTop, lang);
            line = height*marginTop;
        }
        doc.setFontSize(smallInfoSize);
        doc.text(lang._step + ' 3 - ' + lang._eqStep3MCM, marginSides*width+13, line+=15, null, null, 'left');
        line+=5;
        doc.setLineWidth(1);
        doc.line(marginSides*width+17, line+5, marginSides*width+17, line+equations.allRevealedEq.length*18);
        for(let i = 0; i < equations.allRevealedEq.length; i++){
            printEquation(doc, equations.allRevealedEq[i], marginSides*width+18, line+=18, 'left');  
        }
        line+=5;
        return line;        
    }
    else{
        //head + FINAL equation
        if(line+25+15 > height-height*marginBottom-10){
            doc.addPage();
            doc = printBuildFoot(doc, marginSides, marginBottom, marginTop);
            line = height*marginTop;
        }
        doc.setFontSize(subtitleSize);
        doc.text('6.  ' + lang._eqSystemTitle, marginSides*width, line+=25, null, null, 'left');

        doc.setFontSize(smallInfoSize);
        doc.text(lang._noSystem, marginSides*width+10, line+=15, null, null, 'left');
        return line;
    }


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
function printMeshResults(doc, file, line, marginSides, marginTop, marginBottom, lang){

    let width = doc.internal.pageSize.width;
    let height = doc.internal.pageSize.height;
    let meshes = file.analysisObj.chosenMeshes;

    if(line+meshes.length*12+25+15 > height-height*marginBottom-10){
        doc.addPage();
        doc = printBuildFoot(doc, marginSides, marginBottom, marginTop, lang);
        line = height*marginTop;
    }
    doc.setFontSize(subtitleSize);
    doc.text('7.  ' + lang._resMesh, marginSides*width, line+=25, null, null, 'left');

    line+=5;
    doc.setLineWidth(1);
    doc.line(width/2-0.1*width, line+5, width/2-0.1*width, line+meshes.length*13+5);
    for(let i = 0; i < meshes.length; i++){
        let aux = '';
        if(meshes[i].type == 0) aux = 'a';
        else  aux = 'p';
        aux += String(meshes[i].displayId); 
        let str = '';
        if(meshes[i].currValue.complex){ //malha é complexa
            let resultAng = resultDecimals(meshes[i].currValue.angle, 3, true);
            let resultMag = resultDecimals(meshes[i].currValue.magnitude, 2, false);
            if(resultMag.value == 0){
                str += "\\underline{I_{M" + aux + "}}~=~" + resultMag.value + '~' + resultMag.unit + 'A';
            }
            else{
                str += "\\underline{I_{M" + aux + "}}~=~" + resultMag.value + '\\angle ' + resultAng.value + '^{\\circ}' + '~' + resultMag.unit + 'A';
            }
        }
        else{ //malha é real
            let result = resultDecimals(meshes[i].currValue.value, 2, false);
            str += "I_{M" + aux + "}~=~" + result.value + '~' + result.unit + 'A';
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
function printCurrentsInfo(doc, file, line, marginSides, marginTop, marginBottom, lang){
    let width = doc.internal.pageSize.width;
    let innerWidth = width - 2 * width * marginSides;
    let currents = file.analysisObj.currents;


    if(line+25+25+30+currents.length*12 > height-height*marginBottom-10){
        doc.addPage();
        doc = printBuildFoot(doc, marginSides, marginBottom, marginTop, lang);
        line = height*marginTop;
    }

    doc.setFontSize(subtitleSize);
    doc.text('8.  ' + lang._branchIden, marginSides*width, line+=25, null, null, 'left');

    doc.setFontSize(subsubtitleSize);
    doc.text(' 8.1  ' + lang._currents, marginSides*width, line+=25, null, null, 'left');

    if(lang == dictionary.portuguese){
        var table = 'Tabela 1 - ';
    }
    else{
        var table = 'Table 1 - ';
    }

    doc.setFontSize(smallInfoSize);
    doc.text(table + lang._currentsTableCap, width/2, line+=20, null, null, 'center');

    doc.text('Reference', innerWidth/5 + width * marginSides, line+=10, null, null, 'center');
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
function printBranchResults(doc, file, line, marginSides, marginTop, marginBottom, lang){

    let width = doc.internal.pageSize.width;
    let height = doc.internal.pageSize.height;
    let currents = file.analysisObj.currents;

    if(line+currents.length*14+25+15+15 > height-height*marginBottom-10){
        doc.addPage();
        doc = printBuildFoot(doc, marginSides, marginBottom, marginTop, lang);
        line = height*marginTop;
    }
    doc.setFontSize(subsubtitleSize);
    doc.text('8.2  ' + lang._resBranch, marginSides*width, line+=25, null, null, 'left');

    line+=5;
    doc.setLineWidth(1);
    doc.line(2.6*width/4-0.1*width, line+5, 2.6*width/4-0.1*width, line+currents.length*14);
    doc.line(1.3*width/4-0.1*width, line+5, 1.3*width/4-0.1*width, line+currents.length*14);
    for(let i = 0; i < currents.length; i++){
        let str = '';
        if(currents[i].complex){
            let resultMag = resultDecimals(currents[i].magnitude, 2, false);
            let resultAng = resultDecimals(currents[i].angle, 3, true);
            if(resultMag.value == 0){
                str += '\\underline{' + currents[i].ref + '}~=~' + resultMag.value + '~' + resultMag.unit + 'A';
            }
            else{
                str += '\\underline{' + currents[i].ref + '}~=~' + resultMag.value + '\\angle ' + resultAng.value + '^{\\circ}' + '~' + resultMag.unit + 'A';
            }
        }
        else{
            let result = resultDecimals(currents[i].valueRe, 2, false);
            str += currents[i].ref + '~=~' + result.value + '~' + result.unit +'A';
        }
        printEquation(doc, currents[i].meshEquation, 1.3*width/4-0.1*width, line+=14, 'left');  
        printEquation(doc, str, 2.6*width/4-0.1*width, line, 'left');  
    }

    if(lang == dictionary.portuguese){
        var note = 'Nota: ';
        var slice1 = 76;
    }
    else{
        var note = 'Note: ';
        var slice1 = 79;
    }
    
    doc.setFontSize(smallInfoSize);
    doc.text(note + lang._currResNotes1MCM.slice(6).slice(0, slice1), width*marginSides, line+=15, null, null, 'left');
    doc.text(lang._currResNotes1MCM.slice(6).slice(slice1), width*marginSides, line+=10, null, null, 'left');

    return line;
}




//UTIL FUNCTIONS
/**
 * Function to output circuit branch currents
 * @param {image} imgObj image object
 * @param {number} max max width (for resizing purposes)
 * @returns {string} base64 png
 */
function resizeMCM(imgObj, max) {
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

    return {
        data: canvas.toDataURL(),
        width: canvas.width,
        height: canvas.height
    };
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

    /*
    if(str.includes('e')){
        let slide;
        if(str[str.indexOf('e')+1] == '-'){
            slide = str[str.indexOf('e')+2];
        }
        else{
            slide = str[str.indexOf('e')+1];
            if()
        }
    }
    */

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
    let TeXmult = '';
    let index = 0;
    if(zeroCount > 0 && zeroCount <= 3){
        index = 3;
        mult = 'm';
        TeXmult = '*10^{-3}';
    }
    else if(zeroCount > 3 && zeroCount <= 6){
        index = 6;
        mult = 'u';
        TeXmult = '*10^{-6}';
    }
    else if(zeroCount > 6){
        index = 9;
        mult = 'p';
        TeXmult = '*10^{-9}';
    }
    else if(zeroCount == 0){
        if(commaIndex <= 2){
            index = commaIndex-1;
        }
        else if(commaIndex <= 5){
            index = commaIndex-4;
            mult = 'k';
            TeXmult = '*10^{3}';
        }
        else if(commaIndex <= 8){
            index = commaIndex-7;
            mult = 'M';
            TeXmult = '*10^{6}';
        }
        else if(commaIndex <= 11){
            index = commaIndex-10;
            mult = 'G';
            TeXmult = '*10^{9}';
        }
    }

    if(isangle){
        index = commaIndex-1;
        mult = '';
        TeXmult = '';
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
        unit: mult,
        TeXUnit: TeXmult
    };


}

//DRAW MESHES UTIL
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
    if(mode == 'center') side = x-latexString.replaceAll("\\angle", "<").replaceAll("^{\\circ}", " ").replaceAll("\\cdot", " ").replaceAll("\\underline", "").replaceAll("{", "").replaceAll("}", "").replaceAll("_", "").replaceAll(" ", "").replaceAll("~", " ").length*6/2;
    else if(mode == 'left') side = x;
    else if(mode == 'right') side = x-latexString.replaceAll("\\angle", "  ").replaceAll("^{\\circ}", " ").replaceAll("\\cdot", " ").replaceAll("\\underline", "").replaceAll("{", "").replaceAll("}", "").replaceAll("_", "").replaceAll(" ", "").replaceAll("~", " ").length*6;

    latexString = latexString.replaceAll(" ", "");

    for(let i = 0; i < latexString.length; i++){
        if(latexString.charAt(i) == "\\"){
            let nextChar = latexString.slice(i+1, i+6);
            if(nextChar.includes('angle')){
                //imprimir o angulo
                doc.setFontSize(subsubtitleSize);
                doc.text('<', side+=8.5, y+4.5, null, 25, 'center');
                i+=5;
            }
            else if(nextChar.includes('cdot')){
                //imprimir o angulo
                doc.setFontSize(subsubtitleSize);
                doc.text('.', side+=8, y-2, null, null, 'center');
                i+=4;
            }
            else if(latexString.charAt(i+1) == '_'){
                //imprimir um espaço
                doc.setFontSize(smallInfoSize);
                doc.text('_', side+=4.5, y, null, null, 'center');
                i++;
            }
            else{
                let nextChar = latexString.slice(i+1, i+10);
                if(nextChar.includes('underline')){
                    let inner = '';
                    for(let j = i+11; j < latexString.length; j++){
                        if(latexString.charAt(j) == '}') break;
                        else inner+=latexString.charAt(j);
                    } 
                    if(!inner.includes('_')){
                        //desenhar linha 
                        doc.setFontSize(smallInfoSize);
                        doc.text(inner, side+=6, y, null, null, 'center');                        
                        doc.line((side-4.7*inner.length/2), y+2, (side+4.7*inner.length/2), y+2);
                        i+=9+2+inner.length;
                        side+=4.7*inner.length;
                    }
                    else{
                        inner += '}';
                        let sub = '';
                        for(let j = 2; j < inner.length; j++){
                            if(inner.charAt(j) == '}') break;
                            else sub+=inner.charAt(j);
                        }
                        printEquation(doc, inner, side, y, 'left');
                        inner = inner.replaceAll("{", "").replaceAll("}", "").replaceAll("_", "");
                        doc.line((side+2*inner.length/2), y+6, (side+11*inner.length/2), y+6);
                        i+=9+sub.length+5;
                        side+=4.7*sub.length;
                    }               

                }                
            }
        }
        else if(latexString.charAt(i) == "_"){
            let sub = '';
            for(let j = i+2; j < latexString.length; j++){
                if(latexString.charAt(j) == '}') break;
                else sub+=latexString.charAt(j);
            }
            //imprimir em baixo
            doc.setFontSize(tinyInfoSize);
            doc.text(sub, side+8.5, y+3, null, null, 'center');
            i+=sub.length+2;
            side+=4.9*sub.length;
        }
        else if(latexString.charAt(i) == "^"){
            let nextChar = latexString.slice(i+1, i+10);
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
            doc.text(latexString.charAt(i), side+=6, y, null, null, 'center');
        }
        else{
            //imprimir a letra
            doc.setFontSize(smallInfoSize);
            doc.text(latexString.charAt(i), side+=6, y, null, null, 'center');
        }
    }
}
