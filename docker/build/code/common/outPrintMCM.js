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
        fstring = "\\small F = " + F.value.toString()+ "\\; Hz";
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
    htmlstr += '<h6 class="lead" data-translate="_MCMEqFormula"></h6></div>';
    htmlstr += '<div class="card-body text-secondary mt-1 mb-1">';
    str = "M_{p} = R - (N - 1) - C";
    str = katex.renderToString(str, {throwOnError: false});
    htmlstr += '<div class="text-center" mt-2 mb-2"><span >'+ str + '</span></div>';
    htmlstr += '</div></div></div>';

    htmlstr += '<div class="container print-block"><div class="row print-block">';
    htmlstr += '<div class="col-sm-12 col-lg-6-40 no-page-break"><div class="card bg-light mb-3">';
    htmlstr += '<div class="card-header rounded text-light bg-warning d-flex align-items-center justify-content-center" style="opacity:0.9">';
    htmlstr += '<h6 class="lead" data-translate="_equationsNrCalculus"></h6></div>';
    htmlstr += '<div class="card-body text-secondary mt-1 mb-1">';
    str = "M_{p} = " + R + "- (" + N + " - 1) - " + C + "\\Leftrightarrow \\\\ \\Leftrightarrow E = " + E ;
    str = katex.renderToString(str, {throwOnError: false});
    htmlstr += '<div class="text-center" mt-2 mb-2"><span >'+ str + '</span></div>';
    htmlstr += '</div></div></div>';

    htmlstr += '<div class="container print-block"><div class="row print-block">';
    htmlstr += '<div class="col-sm-12 col-lg-6-40 no-page-break"><div class="card bg-light mb-3">';
    htmlstr += '<div class="card-header rounded text-light bg-warning d-flex align-items-center justify-content-center" style="opacity:0.9">';
    htmlstr += '<h6 class="lead" data-translate="_MCMEqAux"></h6></div>';
    htmlstr += '<div class="card-body text-secondary mt-1 mb-1">';
    str = "C = " + C + "\\implies  M_{a} = " + C;
    str = katex.renderToString(str, {throwOnError: false});
    htmlstr += '<div class="text-center" mt-2 mb-2"><span >'+ str + '</span></div>';
    htmlstr += '</div></div></div>';

    htmlstr += '<div class="card p-1" style="background-color: #ffffcc; border-left: 6px solid #ffeb3b;">';
    htmlstr += '<div class="container-fluid"><div class="d-flex flex-row">';
    htmlstr += '<div class="ml-1 mt-1"><i class="fas fa-sticky-note"></i></div>';
    htmlstr += '<div class="ml-1"><strong><p data-translate="_nrOfEquations"></p></strong></div>';
    htmlstr += '</div></div></div>'

    return htmlstr;
}

/**
 * outputs the meshes
 * @param {Array} branchObjs branches
 * @param {Array} meshesObjs meshes
 */
function outMeshesMCM(branchObjs, meshesObjs, lang){
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

        htmlstr += '<p class="text-center">';
        if(meshesObjs[i].type == 1) htmlstr += katex.renderToString("I_{"+meshesObjs[i].id+meshesObjs[i].id+"}~:~"+meshesObjs[i].incognitoEq, {throwOnError: false});
        else{
            if(meshesObjs[i].currValue.string == 'complex'){
                htmlstr += katex.renderToString("I_{"+meshesObjs[i].id+meshesObjs[i].id+"}~:~"+( Math.sqrt(Math.pow(meshesObjs[i].currValue.re, 2) + Math.pow(meshesObjs[i].currValue.im, 2)).toFixed(3) + '\\angle ' + (Math.atan(meshesObjs[i].currValue.im/meshesObjs[i].currValue.re)*57.2957795).toFixed(3) + '^{\\circ}\\;' + 'A'), {throwOnError: false});  
            }
            else{
                htmlstr += katex.renderToString("I_{"+meshesObjs[i].id+meshesObjs[i].id+"}~:~"+meshesObjs[i].currValue+"A", {throwOnError: false});  
            }
        }

        htmlstr += '</p></div></div></div></div>';   
    }
    $('#Meshes').html(htmlstr);
    for(let i = 0; i < meshesObjs.length; i++){
        let containerId = '#Mesh' + meshesObjs[i].id;
        let cnt = 0;
        meshesObjs[i].branches.forEach(branch => {
            cnt++;
        });
        let WindowWidth = cnt*width+(cnt+1)*Xspacing+2+10+originX;
        createMesh(meshesObjs[i], branchObjs, width, height, WindowWidth, WindowHeight, Xspacing, Yspacing, originX, originY, aux, containerId, lang);
    }
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

    let meshes = file.analysisObj.choosenMeshes;

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
        const getValUnits = multUnits.find(valUnit => valUnit.value === meshes[k].currMult);

        if(String(meshes[k].currValue.string).includes('angle')){
            str += "I_{" + meshes[k].id + meshes[k].id + "} = " + meshes[k].currValue.string + getValUnits.name + "\\\\";
        }
        else if(meshes[k].currValue.string == 'complex'){
            str += "I_{" + meshes[k].id + meshes[k].id + "} = " +  Math.sqrt(Math.pow(meshes[k].currValue.re, 2) + Math.pow(meshes[k].currValue.im, 2)).toFixed(3) + '\\angle{} ' + (Math.atan(meshes[k].currValue.im/meshes[k].currValue.re)*57.2957795).toFixed(3) + '^{\\circ{}}\\;' + 'A' + '\\\\';
        }
        else{
            str += "I_{" + meshes[k].id + meshes[k].id + "} = " + meshes[k].currValue + getValUnits.name + "\\\\";
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

            if(currents[k].complex == true){
                str += currents[k].ref + '=' +  Math.sqrt(Math.pow(currents[k].valueRe, 2) + Math.pow(currents[k].valueIm, 2)).toFixed(3) + '\\angle ' + (Math.atan(currents[k].valueIm/currents[k].valueRe)*57.2957795).toFixed(3) + '^{\\circ}\\;' + 'A';
            }
            else{
                str += currents[k].ref + '=' + currents[k].valueRe + '\\;' + 'A';
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
    let svg = d3.select(containerId) //create svg
        .append("svg")
        .attr("width", WindowWidth+2)
        .attr("height", height+aux+Yspacing+originY+2)

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
    // Update Dictionary Language
	let language = document.getElementById("lang-sel-txt").innerText.toLowerCase();
	if(language == "english") word = "Branch";
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

function getTexFileHeaderMCM(){
    let texHeader = '';
    texHeader = "\\documentclass[a4paper]{article}\r\n\\usepackage{graphicx}\r\n\\usepackage[latin1]{inputenc}\r\n\\usepackage{amsmath}\r\n\\usepackage{fancyhdr}\r\n\\pagestyle{fancy}\r\n\\lhead{\\textsc{URIsolve App}}\r\n\\rhead{\\textsc{Mesh Current Method}}\r\n\\cfoot{www.isep.ipp.pt}\r\n\\lfoot{DEE - ISEP}\r\n\\rfoot {\\thepage}\r\n\\renewcommand{\\headrulewidth}{0.4pt}\r\n\\renewcommand{\\footrulewidth}{0.4pt}\r\n\r\n\\title{\r\n\\raisebox{-.2\\height}{\\includegraphics[height=1cm, keepaspectratio]{logo}} URIsolve APP \\\\\r\n\\newline\r\n\\textsc{Mesh Current Method} \\\\\r\n\\\r\nStep by Step Solution \\\\\r\n\\vspace*{1\\baselineskip}\r\n}\r\n\r\n\\author{\r\n\\begin{tabular}[t]{c@{\\extracolsep{8em}}c}\r\nLino Sousa           & M\u00E1rio Alves          \\\\\r\nsss@isep.ipp.pt  & mjf@isep.ipp.pt      \\\\\r\n\t\t\t\t\t &                      \\\\\r\nAndr\u00E9 Rocha          & Francisco Pereira    \\\\\r\nanr@isep.ipp.pt      & fdp@isep.ipp.pt      \\\\\r\n\\end{tabular}\r\n}\r\n\r\n\\date{}\r\n\r\n";

    texHeader += "\\begin{document}\r\n\r\n\\maketitle\r\n\\thispagestyle{empty}\r\n\r\n\\vspace{\\fill}\r\n\\begin{abstract}\r\n\\centering\r\nThis document provides a step by step solution for the submitted circuit, using the Mesh Current Method (MCM).\r\n\\end{abstract}\r\n\\vspace{\\fill}\r\n\r\n\\begin{center}\r\n\\today\r\n\\end{center}\r\n\r\n\\clearpage\r\n\\pagenumbering{arabic}\r\n\r\n\\newpage\r\n\r\n";
    return texHeader;
}