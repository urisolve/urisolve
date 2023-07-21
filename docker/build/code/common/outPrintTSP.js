include('code/common/outPrintMCM.js');
include('code/common/outPrintMCR.js');

/**
 * This function creates the HTML code for the navigation tabs and the tab content
 * @returns {String} HTML code
 */
function outHTMLResolutionNavTSP(){
    var htmlstr = "";

    // Add nav tabs
    htmlstr += '<div class="container mt-3 sticky-top" style="background-color: #fff;">'
    htmlstr += '<ul id="results-tabs" class="nav nav-pills nav-justified border border-secondary rounded-top">';
    htmlstr += '<li class="nav-item"><a class="nav-link active" data-bs-toggle="pill" href="#main-tab">'
    htmlstr += '<h5 data-translate="_mainTab"></h5></a></li>';
    htmlstr += '</ul></div>';

    // Add tab content
    htmlstr += '<div id="pages-content" class="tab-content">';
    // Add main tab content
    htmlstr += '<div id="main-tab" class="container tab-pane fade in show active"></div>';

    return htmlstr;
}

/**
 * This function generates the HTML for the resolution tabs
 * @param {Array<Component, String>} order The order of the resolution tabs and the method used
 * @returns {string} HTML code
 */
function outHTMLResolutionTabsTSP(order){
    var htmlstr = "";

    // Add nav tabs
    order.forEach(o => {
        source = o[0];
        method = o[1];

        // Add resolution tab if not already present
        if($('#results-tabs').find('.resolution-item > a[href="#resolution-'+source.name.value+'"]').length === 0){
            htmlstr += `<li class="nav-item resolution-item"><a class="nav-link" data-bs-toggle="pill" href="#resolution-${source.name.value}">`;
            htmlstr += `<h5>${source.name.value}</h5></a></li>`;
        }
    });

    // Add results tab if not already present
    if($('#results-tabs').find('.resolution-item > a[href="#results-tab"]').length === 0){
        htmlstr += '<li class="nav-item resolution-item"><a class="nav-link" data-bs-toggle="pill" href="#results-tab">'
        htmlstr += '<h5 data-translate="_resultsTab"></h5></a></li>';
    }

    return htmlstr;
}

/**
 * This function generates the HTML for the resolution tabs content
 * @param {Array<Component, String>} order The order of the resolution tabs and the method used
 * @returns {String} HTML code
 */
function outHTMLResolutionTabsContentTSP(order){
    var htmlstr = "";

    order.forEach(o => {
        source = o[0];
        method = o[1];

        // Add resolution tab content if not already present
        if($('#pages-content').find('#resolution-'+source.name.value).length === 0){
            htmlstr += `<div id="resolution-${source.name.value}" class="container tab-pane fade in resolution-pages-content"></div>`;
        }
    });

    // Add results tab content if not already present
    if($('#pages-content').find('#results-tab').length === 0){
        htmlstr += '<div id="results-tab" class="container tab-pane fade in resolution-pages-content"></div>';
    }

    return htmlstr;
}

/**
 * This function generates the HTML for section of the main tab
 * @returns {String} HTML code
 */
function outHTMLSectionsTSP(){
    var htmlstr = "";
    
    // errors section
    htmlstr += '<div id="errors-main"></div>'
    // warnings section
    htmlstr += '<div id="warnings-main"></div>'
    // circuit image
    htmlstr += '<div id="circuitImage">';
    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_circuitImage"></h5></div></div>';
    htmlstr += '<div class="circuit-widget container mt-3 text-center p-0"></div></div>';
    // selection section
    htmlstr += '<div id="selection">';
    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_selectionTitle"></h5></div></div>';
    htmlstr += '<div id="selection-body" class="container mt-3"></div></div>';

    return htmlstr;
}

/**
 * This function generates the HTML to populate the selection section of the main tab
 * @returns {String} HTML code
 */
function outHTMLSelectionTSP(){
    var htmlstr = "";

    // Add nav tabs
    htmlstr += '<ul class="nav nav-pills nav-justified">';
    htmlstr += '<li class="nav-item"><a class="nav-link active" data-bs-toggle="pill" href="#passive" data-translate="_passiveTab"></a></li>';
    htmlstr += '<li class="nav-item"><a class="nav-link" data-bs-toggle="pill" href="#interactive" data-translate="_interactiveTab"></a></li></ul>';
    // Add tab content
    htmlstr += '<div class="tab-content">';
    // Add passive tab
    htmlstr += '<div id="passive" class="container tab-pane fade in show active">';
    htmlstr += '<div class="info-howto mt-3">';
    htmlstr += '<p class="m-0" data-translate="_passiveInfo1" style="text-indent: 10px;"></p>';
    htmlstr += '<p class="m-0" data-translate="_passiveInfo2" style="text-indent: 10px;"></p></div></div>';
    // Add interactive tab
    htmlstr += '<div id="interactive" class="container tab-pane fade in">';
    htmlstr += '<div class="info-howto mt-3">';
    htmlstr += '<p class="m-0" data-translate="_interactiveInfo1" style="text-indent: 10px;"></p>';
    htmlstr += '<p class="m-0" data-translate="_interactiveInfo2" style="text-indent: 10px;"></p>';
    htmlstr += '<ul class="m-0"> <li data-translate="_interactiveStep1" style="text-indent: 20px;"></li>';
    htmlstr += '<li data-translate="_interactiveStep2" style="text-indent: 20px;"></li>';
    htmlstr += '<li data-translate="_interactiveStep3" style="text-indent: 20px;"></li>';
    htmlstr += '<li data-translate="_interactiveStep4" style="text-indent: 20px;"></li></ul>';
    htmlstr += '<p class="m-0" data-translate="_interactiveInfo3" style="text-indent: 10px;"></p></div>';
    htmlstr += '<ul class="selection-cards d-flex"></ul></div></div>';
    htmlstr += '<div class="container mt-3 text-center">';
    htmlstr += '<button id="calc-btn" class="btn btn-primary"><p class="m-0" data-translate="_btn_calcTSP"></button></div>';

    return htmlstr;
}

/**
 * This function generates the HTML for the section of tab resolution using the MCM method
 * @param {Component} cp The component to be analyzed
 * @param {Number} length The total number of tabs
 * @returns {String} HTML code
 */    
function outHTMLSectionsMCM_TSP(cp, length) {
    htmlstr = '';
    // Add navbar
    htmlstr += '<div class="p-0 sticky-top text-start bg-light border border-top-0 border-secondary rounded-bottom" style="top:50px;">'
    htmlstr += '<nav id="navbar" class="navbar p-0">';
    htmlstr += '<div class="col-1 p-0 text-center"><a class="btn btn-primary m-1" data-bs-toggle="collapse" href="#tableContents-'+ cp.name.value +'" role="button" aria-expanded="false" aria-controls="collapseExample"><i class="fas fa-bars"></i></a></div>';
    htmlstr += '<div class="progress-container d-flex align-items-center my-1 col-11">';
    for(let i = 0; i < length; i++){
        htmlstr += '<div class="progress my-auto mx-1" style="width: '+ 100/length + '%"><div class="progress-bar rounded-pill mx-0" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div>';
    }
    htmlstr += '</div></nav>';

    // Add table of contents
    htmlstr += '<nav id="tableContents" class="navbar navbar-light bg-light flex-column align-items-stretch px-3 collapse border-top border-secondary">';
    htmlstr += '<a class="navbar-brand" data-translate="_tableContTitle"></a>';
    htmlstr += '<nav class="nav nav-pills flex-column">';

    // Nav to circuit image
    htmlstr += '<a class="nav-link" href="#circuitImage-'+ cp.name.value + '" data-translate="_circuitImage"></a>';
    // Nav to fundamental variables
    htmlstr += '<a class="nav-link" href="#fundamentalVars-'+ cp.name.value + '" data-translate="_fundamentalsTitle"></a>';
    // Nav to circuit information
    htmlstr += '<a class="nav-link" href="#circuitInfo-'+ cp.name.value + '" data-translate="_infoTitle"></a>';
    // Nav to method equations
    htmlstr += '<a class="nav-link" href="#meshEquations-'+ cp.name.value + '" data-translate="_MeshNumberTitle"></a>';
    // Nav to meshes
    htmlstr += '<a class="nav-link" href="#Meshes-'+ cp.name.value + '" data-translate="_MeshTitle"></a>';
    // Nav to results mesh currents
    htmlstr += '<a class="nav-link" href="#resultsCurrentsMesh-'+ cp.name.value + '" data-translate="_resMesh"></a>';
    // Nav to currents data
    htmlstr += '<a class="nav-link" href="#currentsInfo-'+ cp.name.value + '" data-translate="_currents"></a>';
    // Nav to results
    htmlstr += '<a class="nav-link" href="#resultsCurrentsBranch-'+ cp.name.value + '" data-translate="_resBranch"></a></nav></nav>';

    htmlstr += '</div>';

    // Errors & Warnings section
    htmlstr += '<div id="errors"></div><div id="warnings"></div>';

    // Add circuit image
    htmlstr += `<div id="circuitImage" class="mb-3">`;
    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_circuitImage"></h5></div></div>';
    htmlstr += '<div class="circuit-widget container mt-3 text-center p-0"></div></div>';

    // Add subcircuit note
    htmlstr += '<div id="subcircuit-note" class="my-2">';
    htmlstr += '<div class="card p-1" style="background-color: #ffffcc; border-left: 6px solid #ffeb3b;">';
    htmlstr += '<div class="container-fluid"><div class="d-flex flex-row">';
    htmlstr += '<div class="ml-1 mt-1"><i class="fas fa-sticky-note"></i></div>';
    htmlstr += '<div class="ml-1"><strong><p data-translate="_tspNotes1"></p></strong></div>';
    htmlstr += '</div></div></div></div>';

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

/**
 * This function generates the HTML for the section of tab resolution using the MCR method
 * @param {Component} cp The component to be analyzed
 * @param {Number} length The total number of tabs
 * @returns {String} HTML code
 */
function outHTMLSectionsMCR_TSP(cp, length){
    let htmlstr = '';

    // Add navbar
    htmlstr += '<div class="p-0 sticky-top text-start bg-light border border-top-0 border-secondary rounded-bottom" style="top:50px;">'
    htmlstr += '<nav id="navbar" class="navbar p-0">';
    htmlstr += '<div class="col-1 p-0 text-center"><a class="btn btn-primary m-1" data-bs-toggle="collapse" href="#tableContents-'+ cp.name.value +'" role="button" aria-expanded="false" aria-controls="collapseExample"><i class="fas fa-bars"></i></a></div>';
    htmlstr += '<div class="progress-container d-flex align-items-center my-1 col-11">';
    for(let i = 0; i < length; i++){
        htmlstr += '<div class="progress my-auto mx-1" style="width: '+ 100/length + '%"><div class="progress-bar rounded-pill mx-0" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div>';
    }
    htmlstr += '</div></nav>';

    // Add table of contents
    htmlstr += '<nav id="tableContents" class="navbar navbar-light bg-light flex-column align-items-stretch px-3 collapse border-top border-secondary">';
    htmlstr += '<a class="navbar-brand" data-translate="_tableContTitle"></a>';
    htmlstr += '<nav class="nav nav-pills flex-column">';

    // Nav to circuit image
    htmlstr += '<a class="nav-link" href="#circuitImage-'+ cp.name.value + '" data-translate="_circuitImage"></a>';
    // Nav to fundamental variables
    htmlstr += '<a class="nav-link" href="#fundamentalVars-'+ cp.name.value + '" data-translate="_fundamentalsTitle"></a>';
    // Nav to circuit information
    htmlstr += '<a class="nav-link" href="#circuitInfo-'+ cp.name.value + '" data-translate="_infoTitle"></a>';
    // Nav to currents data
    htmlstr += '<a class="nav-link" href="#currentsInfo-'+ cp.name.value + '" data-translate="_currents"></a>';
    // Nav to KNL equations
    htmlstr += '<a class="nav-link" href="#KNLEquations-'+ cp.name.value + '" data-translate="_knlTitle"></a>';
    // Nav to method equations
    htmlstr += '<a class="nav-link" href="#meshEquations-'+ cp.name.value + '" data-translate="_MeshNumberTitleMcr"></a>';
    // Nav to meshes
    htmlstr += '<a class="nav-link" href="#Meshes-'+ cp.name.value + '" data-translate="_MeshTitleMCR"></a>';
    // Nav to results
    htmlstr += '<a class="nav-link" href="#resultsCurrentsBranch-'+ cp.name.value + '" data-translate="_resultsMCR"></a></nav></nav>';

    htmlstr += '</div>';

    // Warnings & Errors section
    htmlstr += '<div id="errors"></div><div id="warnings"></div>';

    // Add circuit image
    htmlstr += `<div id="circuitImage">`;
    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_circuitImage"></h5></div></div>';
    htmlstr += '<div class="circuit-widget container mt-3 text-center p-0"></div></div>';

    // Add subcircuit note
    htmlstr += '<div id="subcircuit-note" class="my-2">';
    htmlstr += '<div class="card p-1" style="background-color: #ffffcc; border-left: 6px solid #ffeb3b;">';
    htmlstr += '<div class="container-fluid"><div class="d-flex flex-row">';
    htmlstr += '<div class="ml-1 mt-1"><i class="fas fa-sticky-note"></i></div>';
    htmlstr += '<div class="ml-1"><strong><p data-translate="_tspNotes1"></p></strong></div>';
    htmlstr += '</div></div></div></div>';
    

    htmlstr += '<div id= "contResults">';  
    htmlstr += '<div class="row"><div class="container"><div id="buttonShowAll"></div></div></div>';
    
    // Fundamental variables
    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_fundamentalsTitle"></h5></div></div>';
    htmlstr += '<div class="container mt-3" id="fundamentalVars"></div><div class="container mt-3">';

    // Circuit information
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_infoTitle"></h5></div></div>';
    htmlstr += '<div class="container mt-3" id="circuitInfo"></div>';

    // Currents data
    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_currents"></h5></div></div>';
    htmlstr += '<div class="container mt-3" id="currentsInfo"></div>';

    // Nodes information
    //htmlstr += '<div class="container mt-3"><div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_knlTitle"></h5></div></div>';
    //htmlstr += '<div class="container mt-3"><div class="row row-tile" id="currentsKNL">';

    // KNL equations
    htmlstr += '<div id="KNLEquations"></div>';

    //Method Equations
    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_MeshNumberTitleMcr"></h5></div></div>';
    htmlstr += '<div class="container mt-3" id="meshEquations"></div>';

    //Meshes
    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_MeshTitleMCR"></h5></div></div>';
    htmlstr += '<div class="container mt-3" id="Meshes"></div>';

    // Equation System
    htmlstr += '<div id="eqSys"></div>';

    // Results Mesh currents
    //htmlstr += '<div class="container mt-3">';
    //htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_resMesh"></h5></div></div>';
    //htmlstr += '<div class="container mt-3" id="resultsCurrentsMesh"></div></div>';

    // Results
    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_resultsMCR"></h5></div></div>';
    htmlstr += '<div class="container mt-3" id="resultsCurrentsBranch"></div></div>';
    
    return htmlstr;

}

function outHTMLSectionsRLC_TSP(cp, length){
    let htmlstr = '';

    // Add navbar
    htmlstr += '<div class="p-0 sticky-top text-start bg-light border border-top-0 border-secondary rounded-bottom" style="top:50px;">'
    htmlstr += '<nav id="navbar" class="navbar p-0">';
    htmlstr += '<div class="col-1 p-0 text-center"><a class="btn btn-primary m-1" data-bs-toggle="collapse" href="#tableContents-'+ cp.name.value +'" role="button" aria-expanded="false" aria-controls="collapseExample"><i class="fas fa-bars"></i></a></div>';
    htmlstr += '<div class="progress-container d-flex align-items-center my-1 col-11">';
    for(let i = 0; i < length; i++){
        htmlstr += '<div class="progress my-auto mx-1" style="width: '+ 100/length + '%"><div class="progress-bar rounded-pill mx-0" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div>';
    }
    htmlstr += '</div></nav>';

    // Add table of contents
    htmlstr += '<nav id="tableContents" class="navbar navbar-light bg-light flex-column align-items-stretch px-3 collapse border-top border-secondary">';
    htmlstr += '<a class="navbar-brand" data-translate="_tableContTitle"></a>';
    htmlstr += '<nav class="nav nav-pills flex-column">';

    // Nav to circuit image
    htmlstr += '<a class="nav-link" href="#circuitImage-'+ cp.name.value + '" data-translate="_circuitImage"></a>';
    // Nav to circuit information
    htmlstr += '<a class="nav-link" href="#circuitInfo-'+ cp.name.value + '" data-translate="_infoTitle"></a>';
    // Nav to currents data
    htmlstr += '<a class="nav-link" href="#currentsInfo-'+ cp.name.value + '" data-translate="_currents"></a>';
    // Nav to equation system
    htmlstr += '<a class="nav-link" href="#eqSys-'+ cp.name.value + '" data-translate="_eqSystemTitle"></a>';
    // Nav to results
    htmlstr += '<a class="nav-link" href="#resultsCurrentsBranch-'+ cp.name.value + '" data-translate="_resultsMCR"></a></nav></nav>';

    htmlstr += '</div>';

    // Warnings & Errors section
    htmlstr += '<div id="errors"></div><div id="warnings"></div>';

    // Add circuit image
    htmlstr += `<div id="circuitImage">`;
    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_circuitImage"></h5></div></div>';
    htmlstr += '<div class="circuit-widget container mt-3 text-center p-0"></div></div>';

    // Add subcircuit note
    htmlstr += '<div id="subcircuit-note" class="my-2">';
    htmlstr += '<div class="card p-1" style="background-color: #ffffcc; border-left: 6px solid #ffeb3b;">';
    htmlstr += '<div class="container-fluid"><div class="d-flex flex-row">';
    htmlstr += '<div class="ml-1 mt-1"><i class="fas fa-sticky-note"></i></div>';
    htmlstr += '<div class="ml-1"><strong><p data-translate="_tspNotes1"></p></strong></div>';
    htmlstr += '</div></div></div></div>';

    htmlstr += '<div id= "contResults">';  
    htmlstr += '<div class="row"><div class="container"><div id="buttonShowAll"></div></div></div>';

    // Circuit information
    htmlstr += '<div class="container mt-3"><div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_infoTitle"></h5></div></div>';
    htmlstr += '<div class="container mt-3" id="circuitInfo"></div>';

    // Currents data
    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_currents"></h5></div></div>';
    htmlstr += '<div class="container mt-3" id="currentsInfo"></div>';

    // Equation System
    htmlstr += '<div id="eqSys"></div>';

    // Results
    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_resultsMCR"></h5></div></div>';
    htmlstr += '<div class="container mt-3" id="resultsCurrentsBranch"></div></div>';

    return htmlstr;
}

function outStep1RLC_TSP(equations){
    let htmlstr = '';

    // Generate the collapse panel
    htmlstr += '<div class="collapse multi-collapse col-xs-12" id="step1Panel">';
    // Generate equation system
    let str = '\\large \\begin{cases}';

    eqs = equations.Req.concat(equations.Leq,equations.Ceq , equations.Xleq, equations.Xceq, equations.Zeq, equations.thetaZ);
    eqs.forEach(eq => {
        str += eq;
        if(eqs.indexOf(eq) < eqs.length-1)
            str += ' \\\\[0.7em] ';
    });
    str += '\\end{cases}';

    // Render it to LaTeX
    str = katex.renderToString(str, {throwOnError: false});
    // Place the equations inside a scroll menu
    htmlstr += '<div class="scrollmenu mt-2 mb-2"><span>'+ str + '</span></div></div>';

    return htmlstr;
}

function outStep2RLC_TSP(equations){
    let htmlstr = '';

    // Generate the collapse panel
    htmlstr += '<div class="collapse multi-collapse col-xs-12" id="step2Panel">';
    // Generate equation system
    let str = '\\large \\begin{cases}';

    eqs = equations.EqI.concat(equations.thetaI);
    eqs.forEach(eq => {
        str += eq;
        if(eqs.indexOf(eq) < eqs.length-1)
            str += ' \\\\[0.7em] ';
    });
    str += '\\end{cases}';

    // Render it to LaTeX
    str = katex.renderToString(str, {throwOnError: false});
    // Place the equations inside a scroll menu
    htmlstr += '<div class="scrollmenu mt-2 mb-2"><span>'+ str + '</span></div></div>';

    return htmlstr;
}

function outEquationSystemRLC_TSP(analysisObj, step1 = '', step2 = ''){
    let htmlstr = '';

    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_eqSystemTitle"></h5></div></div>';
    htmlstr += '<div class="container mt-3"><div class="row" id="equationSystem">';

    // Add card
    htmlstr += '<div class="col-sm-12"><div class="card bg-light mb-3">';
    // Create Show Steps Collapse Button
    let btnstr ='<button class="btn btn-primary btn-md lead ml-3 mt-2 mb-1" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEquations"';
    btnstr += ' aria-expanded="false" data-translate="_snStepsBtn"></button>';
    // Add card body
    htmlstr += '<div class="card-body text-secondary mt-2 mb-2">';
    let str = '';
    // Add equation system
    if(step1 !== ''){
        str = '\\large \\begin{cases}';
        str += analysisObj.equations.EqIresult;
        str += '\\\\[0.7em]';
        str += analysisObj.equations.Zeq;
        str += '\\end{cases}';
    }
    else{
        str = '\\begin{cases} \\large ';
        str += analysisObj.equations.EqIresult;
        str += '\\end{cases}';
    }
    
    // Render it to LaTeX
    str = katex.renderToString(str, {throwOnError: false});
    // Generate equation system
    htmlstr += '<div class="row">';
    htmlstr += '<div class="scrollmenu mt-2 mb-2"><span>'+ str + '</span></div></div>';
    
    if(step1 !== ''){
        // Add steps button
        htmlstr += '<div class="row mb-2"><div class="card-text text-center">' + btnstr +'</div></div>';
        
        // Add steps
        let plusIcon = '<i class="fas fa-plus"></i>';

        // Create collapse panel
        htmlstr += '<div class="collapse multi-collapse" id="collapseEquations">';
        
        // STEP #1 - Calculate Zeq
        btnstr  = '<button class="btn collapsed border bg-warning btn-warning btn-sm float-right mt-1 mb-1 mr-1" ';
        btnstr += 'id="btn-1" data-bs-toggle="collapse" data-bs-target="#step1Panel';
        btnstr += '" aria-expanded="false"><span class="lead" data-translate="_ShowHowBtn"></span>'+ plusIcon + '</button>';
        // Add card
        htmlstr += '<div class="card card-header border-0 mb-2 bg-light">';
        htmlstr += '<div class="row bg-success rounded">';
        // Add step text
        htmlstr += '<div class="col-xs-9 d-flex align-items-center col-md"><h5 class="ml-2 text-light"><span data-translate="_step"></span> 1:';
        htmlstr += '&nbsp;&nbsp;<small class="text-light lead" data-translate="_eqStep1RLC"></small></h5></div>';
        // Add button
        htmlstr += '<div class="col-xs-3 ml-auto">'+btnstr+'</div></div>';
        // Add Step results
        htmlstr += step1 +'</div>';

        // STEP #2 - Calculate I
        btnstr  = '<button class="btn collapsed border bg-warning btn-warning btn-sm float-right mt-1 mb-1 mr-1" ';
        btnstr += 'id="btn-2" data-bs-toggle="collapse" data-bs-target="#step2Panel';
        btnstr += '" aria-expanded="false"><span class="lead" data-translate="_ShowHowBtn"></span>'+ plusIcon + '</button>';
        // Add card
        htmlstr += '<div class="card card-header border-0 mb-2 bg-light">';
        htmlstr += '<div class="row bg-success rounded">';
        // Add step text
        htmlstr += '<div class="col-xs-9 d-flex align-items-center col-md"><h5 class="ml-2 text-light"><span data-translate="_step"></span> 2:';
        htmlstr += '&nbsp;&nbsp;<small class="text-light lead" data-translate="_eqStep2RLC"></small></h5></div>';
        // Add button
        htmlstr += '<div class="col-xs-3 ml-auto">'+btnstr+'</div></div>';
        // Add Step results
        htmlstr += step2 +'</div>';

        // Close collapse panel
        htmlstr += '</div>';

        // Close card and card-body divs
        htmlstr += '</div></div></div></div>';
    }
    

    return htmlstr;
}

function outHTMLResultsRLC(jsonFile){
    let currents = jsonFile.analysisObj.currents;

    let htmlstr = '';

    htmlstr += '<div class="col-sm-12 col-lg-6-40 print-block"><div class="card bg-light mb-3">';
    htmlstr += '<div class="card-body text-secondary mt-1 mb-1 print-block">';

    if(currents.length > 0){
        str = '\\large \\begin{cases}';
        for(let k = 0; k< currents.length; k++){
            str += currents[k].equation;
            if(k < currents.length-1)
                str += ' \\\\[0.7em] ';
        }
        str += '\\end{cases}  \\Leftrightarrow \\large \\begin{cases}';

        for(let k = 0; k< currents.length; k++){
            if(currents[k].complex){
                str += currents[k].ref + ' = ' + currents[k].magnitude + '\\angle' + currents[k].angle + '^{\\circ}' + currents[k].unit;
            }
            else{
              str += currents[k].ref + ' = ' + currents[k].value + ' ' + currents[k].unit;  
            }

            if(k < currents.length-1)
                str += ' \\\\[0.7em] ';
        }
        str += '\\end{cases}';

        // Render it to LaTeX
        str = katex.renderToString(str, {throwOnError: false});
        // Add equations in a scroll menu
        htmlstr += '<div class="scrollmenu mt-2 mb-3"><span>'+ str + '</span></div>';
    }
    
    // Close Currents card
    htmlstr += '</div></div></div>';

    // Close results panel
    htmlstr += '</div></div>';

    return htmlstr;
}

function outHTMLResultsSectionsTSP(){
    var htmlstr = "";

    // Add table section
    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_ResultsTable"></h5></div></div>';
    htmlstr += '<div class="container mt-3" id="results-table"></div>';

    // Add current info section
    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_infoTitle"></h5></div></div>';
    htmlstr += '<div class="container mt-3" id="currentsInfo-results"></div>';

    // Add resolution section
    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_resolutionTitle"></h5></div></div>';
    htmlstr += '<div class="container mt-3" id="resolution-results"></div>';

    return htmlstr;
}

function outHTMLResultsTableTSP(jsonFile) {
    var htmlstr = "";

    // Add table
    htmlstr += '<table class="table table-bordered table-sm text-center">';
    // Add table header
    htmlstr += '<thead class="table-dark"><tr><th scope="col" colspan="2" data-translate="_ResultsTableCell1"></th>';

    for (let json in jsonFile.analysisObj.contributions) {
        htmlstr += '<th scope="col">' + json + '</th>';
    };

    htmlstr += '</tr></thead><tbody>';


    // Add table body
    jsonFile.analysisObj.currents.forEach(current => {
        htmlstr += '<tr><th class="align-middle" scope="row" rowspan="2">' + current.ref + '</th>';
        htmlstr += '<th scope="row" data-translate="_ResultsTableCell2"></th>';
        for (let json in jsonFile.analysisObj.contributions) {
            contribution = current.contributions[json];
            if(contribution !== undefined) {
                htmlstr += '<td><span>' + contribution.start + '</span>';
                htmlstr += '<i class="fas fa-arrow-right mr-2 ml-2"></i>';
                htmlstr += '<span>' + contribution.end + '</span></td>';
            } else {
                htmlstr += '<td>-</td>';
            }
        };
        htmlstr += '</tr><tr><th scope="row" data-translate="_ResultsTableCell3"></th>';
        for (let json in jsonFile.analysisObj.contributions) {
            contribution = current.contributions[json];
            if(contribution === undefined) contribution = {value: '0', unit: 'A'};
            else if(contribution.complex){
                htmlstr += '<td>' + contribution.magnitude + '&angle;' + contribution.angle + '&deg; ' + contribution.unit + '</td>';
                continue;
            }
            htmlstr += '<td>' + contribution.value + ' '+ contribution.unit + '</td>';
        };
        htmlstr += '</tr>';
    });

    htmlstr += '</tbody></table>';


    return htmlstr;
}

function outHTMLResultsTSP(jsonFile) {
    results = jsonFile.analysisObj.results;

    var htmlstr = "";

    // Add note
    htmlstr += '<div id="resolution-note" class="my-2">';
    htmlstr += '<div class="card p-1" style="background-color: #ffffcc; border-left: 6px solid #ffeb3b;">';
    htmlstr += '<div class="container-fluid"><div class="d-flex flex-row">';
    htmlstr += '<div class="ml-1 mt-1"><i class="fas fa-sticky-note"></i></div>';
    if(!results.map(r => r.complex).includes(true))
        htmlstr += '<div class="ml-1"><strong><p data-translate="_tspNotesSum"></p></strong></div>';
    else
        htmlstr += '<div class="ml-1"><strong><p data-translate="_tspNotesSumComplex"></p></strong></div>';
    htmlstr += '</div></div></div></div>';

    htmlstr += '<div class="col-sm-12 col-lg-6-40 print-block"><div class="card bg-light mb-3">';
    htmlstr += '<div class="card-body text-secondary mt-1 mb-1 print-block">';

    if(results.length > 0){
        str = '\\large \\begin{cases}';
        for(let k = 0; k<results.length; k++){
            str += results[k].equation;
            if(k<results.length-1)
                str += ' \\\\[0.7em] ';
        }

        str += '\\end{cases}';

        str += ' \\Leftrightarrow';

        str += '\\large \\begin{cases}';

        for(let k = 0; k<results.length; k++){
            if(results[k].complex){
                str += results[k].ref + '=' + results[k].value.magnitude + '\\angle' + results[k].value.angle + '^{\\circ} ' + results[k].unit;
            }
            else {
                str += results[k].ref + '=' + results[k].value + '\\; ' + results[k].unit;
            }

            if(k<results.length-1)
                str += ' \\\\[0.7em] ';
    }

        str += '\\end{cases}';

        // Render System to TeX
        str = katex.renderToString(str, {throwOnError: false});
    /*
        // Add Notes
        htmlstr += '<div class="card p-1" style="background-color: #ffffcc; border-left: 6px solid #ffeb3b;">';
        htmlstr += '<div class="container-fluid"><div class="d-flex flex-row">';
        htmlstr += '<div class="ml-1 mt-1"><i class="fas fa-sticky-note"></i></div>';
        htmlstr += '<div class="ml-1"><strong><p data-translate="_currResNotes1MCM"></p></strong></div>';
        htmlstr += '</div></div></div>'
    */
        // Add equations in a scroll menu
        htmlstr += '<div class="scrollmenu mt-2 mb-3"><span>'+ str + '</span></div>';
    }
    // Close Currents Card
    htmlstr += '</div></div></div>';

    // Close results panel
    htmlstr += '</div></div>';

    return htmlstr;
}

function buildTeXOvTSP(file, subfiles) {
    console.log('Building tex', file);
    // Get circuit information
    let R = file.branches.length;
	let N = countNodesByType(file.nodes, 0);
	let C = file.components.acAmpsPs.length + file.components.dcAmpsPs.length;
	let F = file.analysisObj.circuitFreq;
    let T = file.components.acVoltPs.length + file.components.dcVoltPs.length;
    let currentsResults = file.analysisObj.results;
    let currents = file.analysisObj.currents;
	let totalCurrents = currents.length;
	let Amps = file.probes.ammeters.length;
	let E = R - (N - 1) - C;
    let subcircuits = file.analysisObj.contributions;


    let lang = document.getElementById("lang-sel-txt").innerText.toLowerCase();
    if(lang == 'english') lang = dictionary.english;
    else if(lang == 'português') lang = dictionary.portuguese;

    // Add cover page
	let TeX = getTexFileHeaderTSPOv(lang);

    // Add main circuit image
    TeX += "\\section{" + lang._circuitImage + "}";
    TeX += "\r\n\r\n\\begin{figure}[hbt]\r\n\\centering{\\resizebox{12cm}{!}{";
    TeX += "\\inlineimages{maincircuit.png}{\\maincircuit}}}";
    TeX += "\r\n\\caption{" + lang._circuitImage + "}\r\n\\label{circuitimage}\r\n\\end{figure}\r\n\r\n";

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

	TeX += " & & "+Amps+"\/"+totalCurrents+"\r\n\\end{tabular}\r\n\\end{table}\r\n\r\n\\pagebreak\r\n\r\n";


    // Add Subcircuit info
    TeX += "\\section{" + lang._calcContrib + "}\r\n\r\n";

    for (let contribution in subcircuits) {
        TeX += "\\subsection{" + lang._source + ' ' + contribution + "}\r\n\r\n";
        //TeX += "\\subsubsection{" + lang._circuitImage + "}\r\n\r\n";
        
        //mesh current results
        TeX += "\\subsubsection{" + lang._branchIden + "}\n\r\n\r\\paragraph{" + lang._currents + "}\\phantom{}\n\r\n\r";
        TeX += "\\begin{table}[ht]\r\n\\caption{" + lang._currentsTableCap + "}\r\n\\centering\r\n\\begin{tabular}{cccc}\r\n";
        TeX += "\\textbf{Reference} & \\textbf{Start Node} & \\textbf{End Node} & \\textbf{Components} \\\\ \\hline\r\n";

        for (let curr in subcircuits[contribution]){
            let current = subcircuits[contribution][curr];
            TeX += curr + " & " + current.start + " & " + current.end + " & " + current.components.join(', ') + " \\\\ \r\n";
        }

        TeX += "\\end{tabular}\r\n\\end{table}\r\n\r\n";

        //mesh current results
        TeX += "\r\n\r\n\\paragraph{" + lang._resBranch + "}\\phantom{}\r\n\r\n";

        // Create system
        let str = '\\large \\begin{cases}';
        i = 0;
        for (let curr in subcircuits[contribution]){
            let current = subcircuits[contribution][curr];
            if(current.complex){
                if(current.angle == 0){
                    str += '\\underline{' + curr + '}=' + current.magnitude + ' ' + current.unit;
                }
                else{
                    str += '\\underline{' + curr + '}=' + current.magnitude + '\\angle ' + current.angle + '^{\\circ}\\; ' + current.unit;
                    }
                }
            else{
                str += curr + '=' + current.value + '\\; ' + current.unit;
            }
    
            if(i<Object.keys(subcircuits[contribution]).length-1)
                str += ' \\\\[0.7em] ';

            i++;
        }
    
            str += '\\end{cases}';
    
            // Render System to TeX
            TeX += "\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n\r\n\\pagebreak\r\n\r\n";
    }

    
    // Add Contributions table
    TeX += "\\section{" + lang._ResultsTable + "}\r\n\r\n";

    TeX += "\\begin{table}[hbt!]\r\n\\centering\r\n\\begin{tabular}{|c|c|";
    for (let k in subcircuits) {
        TeX += "c|";
    }
    TeX += "}\r\n\\hline\r\n";
    // Table header
    TeX += "\\multicolumn{2}{|l|}{\\textbf{" + lang._ResultsTableCell1.replace('\\', '\\textbackslash') + "}}";

    for (let contribution in subcircuits) {
        TeX += " & \\textbf{" + contribution + "}";

    }
    TeX += '\\\\\\hline\r\n';

    // Table body
    for (let i = 0; i < currents.length; i++) {
        TeX += "\\multirow{2}{*}{" + currents[i].ref + "} & " + lang._ResultsTableCell2;
        
        for(let contribution in subcircuits){
            let current = currents[i].contributions[contribution];
            if (current)
                TeX += " & " + current.start + " $\\rightarrow$ " + current.end;
            else
                TeX += " & -";
        }

        TeX += "\\\\\\cline{2-"+ (Object.keys(subcircuits).length + 2) + "}\r\n";

        TeX += "& " + lang._ResultsTableCell3;

        for(let contribution in subcircuits){
            let current = currents[i].contributions[contribution];
            if (!current){
                TeX += " & 0 A";
            }
            else{
                if(current.complex){
                    TeX += " & $" + current.magnitude + '\\angle' + current.angle + '^{\\circ} ' + current.unit + "$";
                }
                else{
                    TeX += " & " + current.value + ' ' + current.unit;
                }
            }
        }

        TeX += "\\\\\\hline\r\n";
    }

    TeX += "\r\n\\end{tabular}\r\n\\end{table}\r\n\r\n\\pagebreak\r\n\r\n";


    // Add Currents results
    TeX += "\\section{" + lang._branchIden + "}\n\r\n\r\\subsection{" + lang._currents + "}\n\r\n\r";
    TeX += "\\begin{table}[ht]\r\n\\caption{" + lang._currentsTableCap + "}\r\n\\centering\r\n\\begin{tabular}{cccc}\r\n";
    TeX += "\\textbf{Reference} & \\textbf{Start Node} & \\textbf{End Node} & \\textbf{Components} \\\\ \\hline\r\n";

    currents.forEach(current => {
        let branch = file.branches.find(branch => branch.currentId == current.id);
        let components = branch.components.map(component => component.ref);

        TeX += current.ref + " & " + current.noP + " & " + current.noN + " & " + components.join(', ') + " \\\\ \r\n";
    });

    TeX += "\\end{tabular}\r\n\\end{table}\r\n\r\n";


    //results
    TeX += "\r\n\r\n\\subsection{" + lang._resBranch + "}\r\n\r\n";

    // Create system
    if(currentsResults.length > 0){
        // Create Equations
        str = '\\large \\begin{cases}';
        for(let k = 0; k<currentsResults.length; k++){
            str += currentsResults[k].equation;
            if(k<currentsResults.length-1)
                str += ' \\\\[0.7em] ';
        }
        str += '\\end{cases}';

        str += '\\\\\\Leftrightarrow';

        str += '\\large \\begin{cases}';

        for(let k = 0; k<currentsResults.length; k++){
            if(currentsResults[k].complex){
                if(currentsResults[k].value.angle == 0){
                    str += '\\underline{' + currentsResults[k].ref + '}=' + currentsResults[k].value.magnitude + ' ' + currentsResults[k].unit;
                }
                else{
                    str += '\\underline{' + currentsResults[k].ref + '}=' + currentsResults[k].value.magnitude + '\\angle ' + currentsResults[k].value.angle + '^{\\circ}\\; ' + currentsResults[k].unit;
                }
            }
            else{
                str += currentsResults[k].ref + '=' + currentsResults[k].value + '\\; ' + currentsResults[k].unit;
            }

            if(k<currents.length-1)
                str += ' \\\\[0.7em] ';
        }

        str += '\\end{cases}';

        // Render System to TeX
        TeX += "\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n\r\n";
        
        if(currentsResults.map(r => r.complex).includes(true)){
            TeX += '\\begin{footnotesize} ' + lang._tspNotesSumComplex + '\\end{footnotesize}';
        }
        else{
            TeX += '\\begin{footnotesize} ' + lang._tspNotesSum + '\\end{footnotesize}';
        }
        TeX += "\\pagebreak\r\n\r\n";
    }

    // Add appendix
    TeX += "\\section{" + lang._appendices + "}\r\n\r\n";
    const substitutions = "abcdfghjklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVYXYZ";
    let k = 0;
    const patternMesh = /\.png}\{\\mesh([a-zA-Z])/g;
    const patternNode = /\.png}\{\\node([a-zA-Z])/g;
    for (let subfile in subfiles) {
        jsonFile = subfiles[subfile].file;
        canvasObjects = subfiles[subfile].canvas;
        canvasObjectss = subfiles[subfile].canvasCurr;
        TeX += "\\section{" + lang._tableContTitle + ' ' + subfile + "}\r\n\r\n";

        switch(subfiles[subfile].method){
            case 'MCR':
                TeXOv = buildTeXOv2(jsonFile, canvasObjects, canvasObjectss, false);
                TeXOv = TeXOv.replaceAll('\\subsubsection', '\\paragraph').replaceAll('\\subsection', '\\subsubsection').replaceAll('\\section', '\\subsection');
                
                TeXOv = TeXOv.replaceAll(patternMesh, (match, letter) => {
                    const suffix = substitutions[k];
                    return `.png}{\\mesh${letter}${suffix}`;
                });
                TeXOv = TeXOv.replaceAll(patternNode, (match, letter) => {
                    const suffix = substitutions[k];
                    return `.png}{\\node${letter}${suffix}`;
                });

                TeX += TeXOv;
                break;
            case 'MCM':
                TeXOv = buildTeXOv(jsonFile, canvasObjects, false);
                TeXOv = TeXOv.replaceAll('\\subsubsection', '\\paragraph').replaceAll('\\subsection', '\\subsubsection').replaceAll('\\section', '\\subsection');

                TeXOv = TeXOv.replaceAll(patternMesh, (match, letter) => {
                    const suffix = substitutions[k];
                    return `.png}{\\mesh${letter}${suffix}`;
                });
                TeX += TeXOv;

                break;
            case 'MTN':

             break;
            case 'RLC':
                TeXOv = buildTeXOvRLC(jsonFile, canvasObjects, canvasObjectss);

                TeX += TeXOv;
                break;
        }

        k++;
        TeX += "\r\n\r\n\\pagebreak\r\n\r\n";
    }

    TeX += "\\end{document}\r\n";
    return TeX;
}

function getTexFileHeaderTSPOv(lang){
    let texHeader = '';
    texHeader += '\\documentclass[a4paper]{article}\r\n\\newcommand{\\inlineimages}[2]{\r\n\\newwrite\\tempfile\r\n\\immediate\\openout\\tempfile=#1.base64\r\n\\immediate\\write\\tempfile{#2}\r\n\\immediate\\closeout\\tempfile\r\n\\immediate\\write18{base64 -d #1.base64 > #1}\r\n\\includegraphics{#1}\r\n}\n\r';
    texHeader += '\\include{images}\r\n';
    texHeader += '\\usepackage{graphicx}\r\n\\usepackage[latin1]{inputenc}\r\n\\usepackage{amsmath}\r\n\\usepackage{fancyhdr}\r\n\\usepackage{multirow}\r\n\\pagestyle{fancy}\r\n\\lhead{\\textsc{URIsolve App}}\r\n\\rhead{\\textsc{' + lang._TSPmethod + '}}\r\n\\cfoot{www.isep.ipp.pt}\r\n\\lfoot{DEE - ISEP}\r\n\\rfoot {\\thepage}\r\n\\renewcommand{\\headrulewidth}{0.4pt}\r\n\\renewcommand{\\footrulewidth}{0.4pt}\r\n\r\n\\title{\r\n\\raisebox{-.2\\height}{\\scalebox{.30}{\\inlineimages{logo.png}{\\logo}}} URIsolve APP \\\\\r\n\r\n\\textsc{' + lang._TSPmethod + '} \\\\\r\n\\\r\n' + lang._step_by_step + ' \\\\\r\n\\vspace*{1\\baselineskip}\r\n}\r\n\r\n';
    texHeader += '\\author{\\begin{tabular}[t]{c@{\\extracolsep{8em}}c}&\\\\\\multicolumn{2}{c}{\\textbf{\\emph{' + lang._project_coor + '}}}  \\\\&\\\\André Rocha         & Mário Alves         \\\\anr@isep.ipp.pt     & mjf@isep.ipp.pt     \\\\&\\\\Lino Sousa          & Francisco Pereira   \\\\sss@isep.ipp.pt     & fdp@isep.ipp.pt     \\\\&\\\\&\\\\\\multicolumn{2}{c}{\\textbf{\\emph{' + lang._devel + '}}}  \\\\\\multicolumn{2}{c}{\\small{\\textbf{v1.0.0 - 07/2023}}}  \\\\\\multicolumn{2}{c}{Guilherme Zenha - 1201398@isep.ipp.pt}  \\\\\\end{tabular}}\r\n\r\n\\date{}\r\n\r\n';
    texHeader += '\\begin{document}\r\n\r\n\\maketitle\r\n\\thispagestyle{empty}\r\n\r\n\\vspace{\\fill}\r\n\\begin{abstract}\r\n\\centering\r\n' + lang._TSPabstract + '\r\n\\end{abstract}\r\n\\vspace{\\fill}\r\n\r\n\\begin{center}\r\n\\today\r\n\\end{center}\r\n\r\n\\clearpage\r\n\\pagenumbering{arabic}\r\n\r\n\\newpage\r\n\r\n';
    return texHeader;
}

async function buildImTeXTSP(files){
    let imageTex = '';

    let sampleimg = base64imgselect("logo");
    imageTex += '\\newcommand{\\logo}{' + sampleimg.replace('data:image/png;base64,', '') + '}\r\n';

    const substitutions = "abcdfghjklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVYXYZ";

    // Get circuit image container
    let mainCircuit = $('#circuitImage > .circuit-widget');
    let temp = $('<div></div>');
    mainCircuit.append(temp);
    // Create a temporary div to store the circuit image
    canvas = await mainCircuit.CircuitToCanvas(temp)

    data = canvas.toDataURL();
    imageTex += '\\newcommand{\\maincircuit}{' + data.replace('data:image/png;base64,', '') + '}\r\n';

    temp.remove();

    // Add subcircuit images
    let k = 0;

    for (let file in files) {
        let images = files[file].canvas;
        let imagesNodes = files[file].canvasCurr;
        switch(files[file].method){
            case 'MCR':
            let subscnt = 0;
            for(let i = 0; i < images.length; i++){
                var svg = document.getElementById("mesh#Mesh" + String(i+1) + '-' +file);
                var img = new Image;
                svg.toDataURL("image/png", {
                    callback: function(data) {
                        img.setAttribute("src", data);
                        imageTex += '\\newcommand{\\mesh' + substitutions[i] + substitutions[k] + '}{' + data.replace('data:image/png;base64,', '') + '}\r\n';
                        subscnt=subscnt+1;
                    }
                });
            }

            for(let i = 0; i < imagesNodes.length; i++){
            
                imagesNodes[i].dataURL=imagesNodes[i].dataURL.replace('data:image/png;base64,', '')
                imageTex += '\\newcommand{\\node' + substitutions[i] + substitutions[k] + '}{' + imagesNodes[i].dataURL + '}\r\n';

            }

                break;
            case 'MCM':
                for(let i = 0; i < images.length; i++){
                    var svg = document.getElementById("mesh#Mesh" + String(i+1) + '-' +file);
                    var img = new Image;
                    svg.toDataURL("image/png", {
                        callback: function(data) {
                            img.setAttribute("src", data);
                            imageTex += '\\newcommand{\\mesh' + substitutions[i] + substitutions[k] +'}{' + data.replace('data:image/png;base64,', '') + '}\r\n';
                        }
                    });
                }
                break;
            case 'MTN':

                break;
        }
        k++;
    }
    
    return imageTex;
}

function buildTeXOvRLC(file, canvasObjects, canvasObjectss) {
    let currents = file.analysisObj.currents;
    let branches = file.branches;
    let F = file.analysisObj.circuitFreq;
    let Amps = file.probes.ammeters.length;
    let totalCurrents = currents.length;
    let equations = file.analysisObj.equations;
    

    let lang = document.getElementById("lang-sel-txt").innerText.toLowerCase();
    if(lang == 'english') lang = dictionary.english;
    else if(lang == 'português') lang = dictionary.portuguese;

    let TeX = "";

    // TeX Circuit Information
	TeX += "\\subsection{" + lang._infoTitle + "}\r\n\r\n\\begin{table}[h!]\r\n\\centering\r\n\\begin{tabular}{clclclc}\r\n";
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

	TeX += " & & "+Amps+"\/"+totalCurrents+"\r\n\\end{tabular}\r\n\\end{table}\r\n\r\n";

    // Add Currents results
    TeX += "\\subsection{" + lang._branchIden + "}\n\r\n\r\\subsubsection{" + lang._currents + "}\n\r\n\r";
    TeX += "\\begin{table}[ht]\r\n\\caption{" + lang._currentsTableCap + "}\r\n\\centering\r\n\\begin{tabular}{cccc}\r\n";
    TeX += "\\textbf{Reference} & \\textbf{Start Node} & \\textbf{End Node} & \\textbf{Components} \\\\ \\hline\r\n";

    currents.forEach(current => {
        let branch = file.branches.find(branch => branch.currentId == current.id);
        components = branch.components.map(component => component);

        TeX += current.ref + " & " + current.noP + " & " + current.noN + " & " + components.join(', ') + " \\\\ \r\n";
    });

    TeX += "\\end{tabular}\r\n\\end{table}\r\n\r\n\\pagebreak\r\n\r\n";

    // Equation system
    TeX += "\\subsection{" + lang._resBranch + "}\r\n\r\n";

    let str = '\\large \\begin{cases}';
    str += equations.EqIresult;
    if(equations.Zeq.length > 0){
        str += '\\\\[0.7em]';
        str += equations.Zeq;
    }
    str += '\\end{cases}';

    TeX += lang._snEquat + "\r\n\\begin{gather*}\r\n"+str+"\r\n\\end{gather*}\r\n\\par\r\n\r\n\\paragraph{} ";
    if (equations.Zeq.length > 0){
        TeX += lang._Steps + ":\r\n\r\n";
        // Step 1
        str = '\\large \\begin{cases}';
        eqs = equations.Req.concat(equations.Leq,equations.Ceq , equations.Xleq, equations.Xceq, equations.Zeq, equations.thetaZ);
        eqs.forEach(eq => {
            str += eq;
            if(eqs.indexOf(eq) < eqs.length-1)
                str += '\\\\[0.7em]';
        });
        str += '\\end{cases}';

        TeX += '\\textbf{Step 1:}' +  lang._eqStep1RLC + "\r\n\\begin{gather*}\r\n"+str+"\r\n\\end{gather*}\r\n\\par\r\n\r\n\\paragraph{} ";

        // Step 2
        str = '\\large \\begin{cases}';
        eqs = equations.EqI.concat(equations.thetaI);
        eqs.forEach(eq => {
            str += eq;
            if(eqs.indexOf(eq) < eqs.length-1)
                str += '\\\\[0.7em]';
        });
        str += '\\end{cases}';

        TeX += '\\textbf{Step 2:}' + lang._eqStep2RLC + "\r\n\\begin{gather*}\r\n"+str+"\r\n\\end{gather*}\r\n\\par\r\n\r\n\\paragraph{} ";
    }
    TeX += '\r\n\\pagebreak\r\n\r\n';

    // Results
    TeX += '\\subsection{' + lang._resultsMCR + '}\r\n\r\n';
    str = '\\large \\begin{cases}';
    // Create system
    for(let k = 0; k< currents.length; k++){
        str += currents[k].equation;
        if(k < currents.length-1)
            str += ' \\\\[0.7em] ';
    }
    str += '\\end{cases}  \\Leftrightarrow \\large \\begin{cases}';

    for(let k = 0; k< currents.length; k++){
        if(currents[k].complex){
            str += currents[k].ref + ' = ' + currents[k].magnitude + '\\angle' + currents[k].angle + '^{\\circ}' + currents[k].unit;
        }
        else{
          str += currents[k].ref + ' = ' + currents[k].value + ' ' + currents[k].unit;  
        }

        if(k < currents.length-1)
            str += ' \\\\[0.7em] ';
    }
    str += '\\end{cases}';

    TeX += "\r\n\\begin{gather*}\r\n"+str+"\r\n\\end{gather*}\r\n\\par\r\n\r\n\\paragraph{} ";

    return TeX;
}

function buildTeXRichTSP(file) {
    console.log('Building tex', file);
    // Get circuit information
    let R = file.branches.length;
	let N = countNodesByType(file.nodes, 0);
	let C = file.components.acAmpsPs.length + file.components.dcAmpsPs.length;
	let F = file.analysisObj.circuitFreq;
    let currentsResults = file.analysisObj.results;
    let currents = file.analysisObj.currents;
	let totalCurrents = currents.length;
	let Amps = file.probes.ammeters.length;
	let E = R - (N - 1) - C;
    let subcircuits = file.analysisObj.contributions;


    let lang = document.getElementById("lang-sel-txt").innerText.toLowerCase();
    if(lang == 'english') lang = dictionary.english;
    else if(lang == 'português') lang = dictionary.portuguese;

    // Add cover page
	let TeX = getTexFileHeaderTSPRich(lang);

    // Add main circuit image
    TeX += "\\section{" + lang._circuitImage + "}";
    //TeX += "\r\n\r\n\\begin{figure}[hbt]\r\n\\centering{\\resizebox{12cm}{!}{";"
    //TeX += "\\inlineimages{circuit.png}{\\circuit}}}";
    //TeX += "\r\n\\caption{" + lang._circuitImage + "}\r\n\\label{circuitimage}\r\n\\end{figure}\r\n\r\n";

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


    // Add Subcircuit info
    TeX += "\\section{" + lang._calcContrib + "}\r\n\r\n";

    for (let contribution in subcircuits) {
        TeX += "\\subsection{" + lang._source + ' ' + contribution + "}\r\n\r\n";
        TeX += "\\subsubsection{" + lang._circuitImage + "}\r\n\r\n";
        
        //mesh current results
        TeX += "\\subsubsection{" + lang._branchIden + "}\n\r\n\r\\paragraph{" + lang._currents + "}\\phantom{}\n\r\n\r";
        TeX += "\\begin{table}[ht]\r\n\\caption{" + lang._currentsTableCap + "}\r\n\\centering\r\n\\begin{tabular}{cccc}\r\n";
        TeX += "\\textbf{Reference} & \\textbf{Start Node} & \\textbf{End Node} & \\textbf{Components} \\\\ \\hline\r\n";

        for (let curr in subcircuits[contribution]){
            let current = subcircuits[contribution][curr];
            TeX += curr + " & " + current.start + " & " + current.end + " & " + current.components.join(', ') + " \\\\ \r\n";
        }

        TeX += "\\end{tabular}\r\n\\end{table}\r\n\r\n";

        //mesh current results
        TeX += "\r\n\r\n\\paragraph{" + lang._resBranch + "}\\phantom{}\r\n\r\n";

        // Create system
        str = '\\large \\begin{cases}';
        i = 0;
        for (let curr in subcircuits[contribution]){
            let current = subcircuits[contribution][curr];
            if(current.complex){
                if(current.angle == 0){
                    str += '\\underline{' + curr + '}=' + current.magnitude + ' ' + current.unit;
                }
                else{
                    str += '\\underline{' + curr + '}=' + current.magnitude + '\\angle ' + current.angle + '^{\\circ}\\; ' + current.unit;
                    }
                }
            else{
                str += curr + '=' + current.value + '\\; ' + current.unit;
            }
    
            if(i<Object.keys(subcircuits[contribution]).length-1)
                str += ' \\\\[0.7em] ';

            i++;
        }
    
            str += '\\end{cases}';
    
            // Render System to TeX
            TeX += "\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n";
    }

    
    // Add Contributions table
    TeX += "\\section{" + lang._ResultsTable + "}\r\n\r\n";

    TeX += "\\begin{table}[hbt!]\r\n\\centering\r\n\\begin{tabular}{|c|c|";
    for (let k in subcircuits) {
        TeX += "c|";
    }
    TeX += "}\r\n\\hline\r\n";
    // Table header
    TeX += "\\multicolumn{2}{|l|}{\\textbf{" + lang._ResultsTableCell1.replace('\\', '\\textbackslash') + "}}";

    for (let contribution in subcircuits) {
        TeX += " & \\textbf{" + contribution + "}";

    }
    TeX += '\\\\\\hline\r\n';

    // Table body
    for (let i = 0; i < currents.length; i++) {
        TeX += "\\multirow{2}{*}{" + currents[i].ref + "} & " + lang._ResultsTableCell2;
        
        for(let contribution in subcircuits){
            let current = currents[i].contributions[contribution];
            if (current)
                TeX += " & " + current.start + " $\\rightarrow$ " + current.end;
            else
                TeX += " & -";
        }

        TeX += "\\\\\\cline{2-"+ (Object.keys(subcircuits).length + 2) + "}\r\n";

        TeX += "& " + lang._ResultsTableCell3;

        for(let contribution in subcircuits){
            let current = currents[i].contributions[contribution];
            if (!current){
                TeX += " & 0 A";
            }
            else{
                if(current.complex){
                    TeX += " & $" + current.magnitude + '\\angle' + current.angle + '^{\\circ} ' + current.unit + "$";
                }
                else{
                    TeX += " & " + current.value + ' ' + current.unit;
                }
            }
        }

        TeX += "\\\\\\hline\r\n";
    }

    TeX += "\r\n\\end{tabular}\r\n\\end{table}\r\n\r\n";


    // Add Currents results
    TeX += "\\section{" + lang._branchIden + "}\n\r\n\r\\subsection{" + lang._currents + "}\n\r\n\r";
    TeX += "\\begin{table}[ht]\r\n\\caption{" + lang._currentsTableCap + "}\r\n\\centering\r\n\\begin{tabular}{cccc}\r\n";
    TeX += "\\textbf{Reference} & \\textbf{Start Node} & \\textbf{End Node} & \\textbf{Components} \\\\ \\hline\r\n";

    currents.forEach(current => {
        branch = file.branches.find(branch => branch.currentId == current.id);
        components = branch.components.map(component => component.ref);

        TeX += current.ref + " & " + current.noP + " & " + current.noN + " & " + components.join(', ') + " \\\\ \r\n";
    });

    TeX += "\\end{tabular}\r\n\\end{table}\r\n\r\n";


    //results
    TeX += "\r\n\r\n\\subsection{" + lang._resBranch + "}\r\n\r\n";

    // Create system
    if(currentsResults.length > 0){
        // Create Equations
        str = '\\large \\begin{cases}';
        for(let k = 0; k<currentsResults.length; k++){
            str += currentsResults[k].equation;
            if(k<currentsResults.length-1)
                str += ' \\\\[0.7em] ';
        }
        str += '\\end{cases}';

        str += '\\\\\\Leftrightarrow';

        str += '\\large \\begin{cases}';

        for(let k = 0; k<currentsResults.length; k++){
            if(currentsResults[k].complex){
                if(currentsResults[k].value.angle == 0){
                    str += '\\underline{' + currentsResults[k].ref + '}=' + currentsResults[k].value.magnitude + ' ' + currentsResults[k].unit;
                }
                else{
                    str += '\\underline{' + currentsResults[k].ref + '}=' + currentsResults[k].value.magnitude + '\\angle ' + currentsResults[k].value.angle + '^{\\circ}\\; ' + currentsResults[k].unit;
                }
            }
            else{
                str += currentsResults[k].ref + '=' + currentsResults[k].value + '\\; ' + currentsResults[k].unit;
            }

            if(k<currents.length-1)
                str += ' \\\\[0.7em] ';
        }

        str += '\\end{cases}';

        // Render System to TeX
        TeX += "\\begin{gather*}\r\n" + str + "\r\n\\end{gather*}\r\n";
    }

    TeX += "\\end{document}\r\n";
    return TeX;
}

function getTexFileHeaderTSPRich(lang){
    let texHeader = '';
    texHeader += '\\documentclass[a4paper]{article}\r\n';
    texHeader += '\\usepackage{graphicx}\r\n\\usepackage[latin1]{inputenc}\r\n\\usepackage{amsmath}\r\n\\usepackage{fancyhdr}\r\n\\usepackage{multirow}\r\n\\pagestyle{fancy}\r\n\\lhead{\\textsc{URIsolve App}}\r\n\\rhead{\\textsc{' + lang._TSPmethod + '}}\r\n\\cfoot{www.isep.ipp.pt}\r\n\\lfoot{DEE - ISEP}\r\n\\rfoot {\\thepage}\r\n\\renewcommand{\\headrulewidth}{0.4pt}\r\n\\renewcommand{\\footrulewidth}{0.4pt}\r\n\r\n\\title{\r\n\\raisebox{-.2\\height}{\\includegraphics[height=1cm, keepaspectratio]{logo}} URIsolve APP \\\\\r\n\\newline\r\n\\textsc{' + lang._TSPmethod + '} \\\\\r\n\\\\\r\n' + lang._step_by_step + ' \\\\\r\n\\vspace*{1\\baselineskip}\r\n}\r\n\r\n';
    texHeader += '\\author{\\begin{tabular}[t]{c@{\\extracolsep{8em}}c}&\\\\\\multicolumn{2}{c}{\\textbf{\\emph{' + lang._project_coor + '}}}  \\\\&\\\\André Rocha         & Mário Alves         \\\\anr@isep.ipp.pt     & mjf@isep.ipp.pt     \\\\&\\\\Lino Sousa          & Francisco Pereira   \\\\sss@isep.ipp.pt     & fdp@isep.ipp.pt     \\\\&\\\\&\\\\\\multicolumn{2}{c}{\\textbf{\\emph{' + lang._devel + '}}}  \\\\\\multicolumn{2}{c}{\\small{\\textbf{v1.0.0 - 06/2023}}}  \\\\\\multicolumn{2}{c}{Guilherme Zenha - 1201398@isep.ipp.pt}  \\\\\\end{tabular}}\r\n\r\n\\date{}\r\n\r\n';
    texHeader += '\\begin{document}\r\n\r\n\\maketitle\r\n\\thispagestyle{empty}\r\n\r\n\\vspace{\\fill}\r\n\\begin{abstract}\r\n\\centering\r\n' + lang._TSPabstract + '\r\n\\end{abstract}\r\n\\vspace{\\fill}\r\n\r\n\\begin{center}\r\n\\today\r\n\\end{center}\r\n\r\n\\clearpage\r\n\\pagenumbering{arabic}\r\n\r\n\\newpage\r\n\r\n';
    return texHeader;
}

function buildPrintPDF_TSP(file){
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

    // Add cover page
    doc = addCoverPage_TSP(doc, lang);
    doc.addPage();
    doc = printBuildFoot_TSP(doc, marginSides, marginBottom, marginTop, lang);
    line = height*marginTop;

    // Add Fundamental Vars
    line = printFundVars_TSP(doc, file, line, marginSides, marginTop, marginBottom, lang);
    // Add Circuit Information
    line = printCircInfo_TSP(doc, file, line+=10, marginSides, marginTop, marginBottom, lang);
    doc.addPage();
    doc = printBuildFoot_TSP(doc, marginSides, marginBottom, marginTop, lang);
    line = height*marginTop;
    // Add Subcircuit info
    line = printContributions_TSP(doc, file, line+=10, marginSides, marginTop, marginBottom, lang);
    // Add Contributions table
    line = printContributionsTable_TSP(doc, file, line+=10, marginSides, marginTop, marginBottom, lang);
    doc.addPage();
    doc = printBuildFoot_TSP(doc, marginSides, marginBottom, marginTop, lang);
    line = height*marginTop;
    // Add Currents results
    line = printCurrResults_TSP(doc, file, line+=10, marginSides, marginTop, marginBottom, lang);

    // Output PDF
    doc.autoPrint();
	doc.output("dataurlnewwindow", {filename: "output.pdf"});
}

function addCoverPage_TSP(doc, lang){
    let line = 170;
    const width = doc.internal.pageSize.width;

    doc.setFontSize(20);
    let sampleimg = base64imgselect("logo");
    doc.addImage(sampleimg, "JPG", width/2-70, line-20, 67/3.5, 82/3.5);
	doc.text('URIsolve APP', width/2+10, line-1, null, null, 'center');
    doc.text(lang._TSPmethod, width/2, line+=20, null, null, 'center');

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
    doc.text('v1.0.0 - 07/2023', width/2, line+=30, null, null, 'center');
    doc.text('Guilherme Zenha - 1201398@isep.ipp.pt', width/2, line+=15, null, null, 'center');
    

    doc.setFontSize(10);
    doc.text('Abstract', width/2, line+=100, null, null, 'center');

    doc.setFontSize(8);
    doc.text(lang._TSPabstract.slice(0, 64), width/2, line+=10, null, null, 'center');
    doc.text(lang._TSPabstract.slice(64), width/2, line+=10, null, null, 'center');


    doc.setFontSize(10);
    const d = new Date(); 
    doc.text(d.getDate()+" / "+d.getMonth()+" / "+d.getFullYear(), width/2, line+=150, null, null, 'center');

    return doc;
}

function printBuildFoot_TSP(doc, marginSides, marginBottom, marginTop, lang){
    width = doc.internal.pageSize.width;
    height = doc.internal.pageSize.height;

    ms = width*marginSides;
    mb = height-marginBottom*height;
    mt = marginTop*height;

    doc.setFontSize(10);
    doc.text('DEE - ISEP', ms, mb, null, null, 'left');
    doc.text('URIsolve APP', ms, mt, null, null, 'left');
    doc.text(lang._page + doc.page, width-ms, mb, null, null, 'right');
    doc.text(lang._TSPmethod, width-ms, mt, null, null, 'right');
    doc.setFontSize(8);
    doc.text('www.isep.ipp.pt', width/2, mb, null, null, 'center');

    doc.line(ms, mb-10, width-ms, mb-10);
    doc.line(ms, mt+4, width-ms, mt+4);

    doc.page++;

    return doc;
}

function printFundVars_TSP(doc, file, line, marginSides, marginTop, marginBottom, lang){
        
    let R = file.branches.length;
	let N = countNodesByType(file.nodes, 0);
	let C = file.components.acAmpsPs.length + file.components.dcAmpsPs.length;
    let T = file.components.acVoltPs.length + file.components.dcVoltPs.length;

    let width = doc.internal.pageSize.width;
    let height = doc.internal.pageSize.height;
    let innerWidth = width - 2 * width * marginSides;

    if(line+25+20+20 > height-height*marginBottom-10){
        doc.addPage();
        doc = printBuildFoot_TSP(doc, marginSides, marginBottom, marginTop, lang);
        line = height*marginTop;
    }
    

    doc.setFontSize(subtitleSize);
    doc.text('1.  ' + lang._fundamentalsTitle, marginSides*width, line+=25, null, null, 'left');

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

function printCircInfo_TSP(doc, file, line, marginSides, marginTop, marginBottom, lang){
    
    let freq = file.analysisObj.circuitFreq;
	let totalCurrents = file.analysisObj.currents.length;
	let ammeters = file.probes.ammeters.length;

    let width = doc.internal.pageSize.width;
    let height = doc.internal.pageSize.height;
    let innerWidth = width - 2 * width * marginSides;

    if(line+25+20+20 > height-height*marginBottom-10){
        doc.addPage();
        doc = printBuildFoot_TSP(doc, marginSides, marginBottom, marginTop, lang);
        line = height*marginTop;
    }

    doc.setFontSize(subtitleSize);
    doc.text('2.  ' + lang._infoTitle, marginSides*width, line+=25, null, null, 'left');

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

function printContributions_TSP(doc, file, line, marginSides, marginTop, marginBottom, lang){

    let subcircuits = file.analysisObj.contributions;

    let width = doc.internal.pageSize.width;
    let height = doc.internal.pageSize.height;
    let innerWidth = width - 2 * width * marginSides;

    if(line+25+20+20 > height-height*marginBottom-10){
        doc.addPage();
        doc = printBuildFoot_TSP(doc, marginSides, marginBottom, marginTop, lang);
        line = height*marginTop;
    }

    doc.setFontSize(subtitleSize);
    doc.text('3.  ' + lang._calcContrib, marginSides*width, line+=25, null, null, 'left');

    let i = 0;
    for (let contribution in subcircuits) {
        i++;
        doc.setFontSize(subsubtitleSize);
        doc.text('3.' + (i) + '  ' + lang._source + ' ' + contribution, marginSides*width, line+=20, null, null, 'left');

        doc.setFontSize(smallInfoSize);
        doc.text('3.' + (i) + '.1  ' + lang._branchIden, marginSides*width, line+=20, null, null, 'left');
        doc.text(lang._currents, marginSides*width, line+=20, null, null, 'left');
        
        if(lang == dictionary.portuguese){
            var table = 'Tabela '+i+' - ';
        }
        else{
            var table = 'Table '+i+' - ';
        }
    
        doc.setFontSize(smallInfoSize);
        doc.text(table + lang._currentsTableCap, width/2, line+=20, null, null, 'center');
    
        doc.text('Reference', innerWidth/5 + width * marginSides, line+=10, null, null, 'center');
        doc.text('Start Node', 2*innerWidth/5 + width * marginSides, line, null, null, 'center');
        doc.text('End Node', 3*innerWidth/5 + width * marginSides, line, null, null, 'center');
        doc.text('Components', 4*innerWidth/5 + width * marginSides, line, null, null, 'center');
    
        line+=2;

        for (let curr in subcircuits[contribution]){
            let current = subcircuits[contribution][curr];
            
            doc.text(curr, innerWidth/5 + width * marginSides, line+=12, null, null, 'center');
            doc.text(current.start, 2*innerWidth/5 + width * marginSides, line, null, null, 'center');
            doc.text(current.end, 3*innerWidth/5 + width * marginSides, line, null, null, 'center');
            doc.text(current.components.join(', '), 4*innerWidth/5 + width * marginSides, line, null, null, 'center');
        }

        doc.text(lang._resBranch, marginSides*width, line+=20, null, null, 'left');

        line+=5;
        doc.setLineWidth(1);
        doc.line(1.3*width/4-0.1*width, line+5, 1.3*width/4-0.1*width, line+Object.keys(subcircuits[contribution]).length*14);

        for (let curr in subcircuits[contribution]){
            let current = subcircuits[contribution][curr];
            let str = '';
            if(current.complex){
                if(current.angle == 0){
                    str += '\\underline{' + curr + '}~=~' + current.magnitude + '~' + current.unit;
                }
                else{
                    str += '\\underline{' + curr + '}~=~' + current.magnitude + '\\angle ' + current.angle + '^{\\circ}\\' + '~' + current.unit;
                    }
                }
            else{
                str += curr + '~=~' + current.value + '~' + current.unit;
            }
            printEquation(doc, str, 1.3*width/4-0.1*width, line+=14, 'left');  
        }
        doc.addPage();
        doc = printBuildFoot_TSP(doc, marginSides, marginBottom, marginTop, lang);
        line = height*marginTop;
    }
    return line;
}

function printContributionsTable_TSP(doc, file, line, marginSides, marginTop, marginBottom, lang){
    
    let width = doc.internal.pageSize.width;
    let height = doc.internal.pageSize.height;
    let innerWidth = width - 2 * width * marginSides;

    if(line+25+20+20 > height-height*marginBottom-10){
        doc.addPage();
        doc = printBuildFoot_TSP(doc, marginSides, marginBottom, marginTop, lang);
        line = height*marginTop;
    }

    doc.setFontSize(subtitleSize);
    doc.text('4.  ' + lang._ResultsTable, marginSides*width, line+=25, null, null, 'left');

    let colnum = 2+Object.keys(file.analysisObj.contributions).length;
    let colwidth = innerWidth/colnum;
    let rownum = 1+2*file.analysisObj.currents.length;

    doc.setFontSize(smallInfoSize);
    // Add table header
    line+=10;   
    doc.text(lang._ResultsTableCell1, colwidth + width * marginSides, line+=10, null, null, 'center');
    for (let json in jsonFile.analysisObj.contributions) {
        doc.text(json, (2+Object.keys(jsonFile.analysisObj.contributions).indexOf(json))*colwidth + width * marginSides, line, null, null, 'center');
    }
    line+=2;
    // Add table body
    jsonFile.analysisObj.currents.forEach(current => {

        doc.text(current.ref, 0.75*colwidth + width * marginSides, line+24, null, null, 'center');
        doc.text(lang._ResultsTableCell2, 1.25*colwidth + width * marginSides, line+=12, null, null, 'center');
        for (let json in jsonFile.analysisObj.contributions) {
            contribution = current.contributions[json];
            if(contribution !== undefined) {
                doc.text(contribution.start + ' => ' + contribution.end, (2+Object.keys(jsonFile.analysisObj.contributions).indexOf(json))*colwidth + width * marginSides, line, null, null, 'center');
            } else {
                doc.text('-', (2+Object.keys(jsonFile.analysisObj.contributions).indexOf(json))*colwidth + width * marginSides, line, null, null, 'center');
            }
        }
        line+=12;
        doc.text(lang._ResultsTableCell3, 1.25*colwidth + width * marginSides, line+=12, null, null, 'center');
        for (let json in jsonFile.analysisObj.contributions) {
            contribution = current.contributions[json];
            if(contribution === undefined) contribution = {value: '0', unit: 'A'};
            else if(contribution.complex){
                doc.text(contribution.magnitude + '<' + contribution.angle + 'º ' + contribution.unit, (2+Object.keys(jsonFile.analysisObj.contributions).indexOf(json))*colwidth + width * marginSides, line, null, null, 'center');
                continue;
            }
            doc.text(contribution.value + ' '+ contribution.unit, (2+Object.keys(jsonFile.analysisObj.contributions).indexOf(json))*colwidth + width * marginSides, line, null, null, 'center');
        }
        line+=12;

    });

   return line;
}

function printCurrResults_TSP(doc, file, line, marginSides, marginTop, marginBottom, lang){

    let currents = file.analysisObj.currents;
    let subcircuits = file.analysisObj.contributions;
    let results = jsonFile.analysisObj.results;

    let width = doc.internal.pageSize.width;
    let height = doc.internal.pageSize.height;
    let innerWidth = width - 2 * width * marginSides;

    if(line+25+20+20 > height-height*marginBottom-10){
        doc.addPage();
        doc = printBuildFoot_TSP(doc, marginSides, marginBottom, marginTop, lang);
        line = height*marginTop;
    }

    doc.setFontSize(subtitleSize);
    doc.text('5.  ' + lang._branchIden, marginSides*width, line+=25, null, null, 'left');
    doc.setFontSize(subsubtitleSize);
    doc.text('5.1  ' + lang._currents, marginSides*width, line+=20, null, null, 'left');
    
    let tablen = Object.keys(subcircuits).length + 1;
    if(lang == dictionary.portuguese){
        var table = 'Tabela '+tablen+' - ';
    }
    else{
        var table = 'Table '+tablen+' - ';
    }

    doc.setFontSize(smallInfoSize);
    doc.text(table + lang._currentsTableCap, width/2, line+=20, null, null, 'center');

    doc.text('Reference', innerWidth/5 + width * marginSides, line+=10, null, null, 'center');
    doc.text('Start Node', 2*innerWidth/5 + width * marginSides, line, null, null, 'center');
    doc.text('End Node', 3*innerWidth/5 + width * marginSides, line, null, null, 'center');
    doc.text('Components', 4*innerWidth/5 + width * marginSides, line, null, null, 'center');

    line+=2;

    for (let curr in currents){
        let current = currents[curr];
        let branch = file.branches.find(branch => branch.currentId == current.id);
        let components = branch.components.map(component => component.ref);

        doc.text(current.ref, innerWidth/5 + width * marginSides, line+=12, null, null, 'center');
        doc.text(current.noP, 2*innerWidth/5 + width * marginSides, line, null, null, 'center');
        doc.text(current.noN, 3*innerWidth/5 + width * marginSides, line, null, null, 'center');
        doc.text(components.join(', '), 4*innerWidth/5 + width * marginSides, line, null, null, 'center');
    }

    doc.setFontSize(subsubtitleSize);
    doc.text('5.2  ' + lang._resBranch, marginSides*width, line+=20, null, null, 'left');

    line+=5;
    doc.setLineWidth(1);
    doc.line(1.3*width/4-0.1*width, line+5, 1.3*width/4-0.1*width, line+results.length*14);
    doc.line(1.3*width/4-0.1*width, line+results.length*14+14, 1.3*width/4-0.1*width, line+results.length*14*2+14);

    for (let k = 0; k<results.length; k++){
        printEquation(doc, results[k].equation, 1.3*width/4-0.1*width, line+=14, 'left');
    }
    line+=12;
    for (let k = 0; k<results.length; k++){
        let str = '';
        if(results[k].complex){
            if(results[k].value.angle == 0){
                str += '\\underline{' + results[k].ref + '}~=~' + results[k].value.magnitude + '~' + results[k].unit;
            }
            else{
                str += '\\underline{' + results[k].ref + '}~=~' + results[k].value.magnitude + '\\angle ' + results[k].value.angle + '^{\\circ}\\;' + '~' + results[k].unit;
            }
        }
        else{
            str += results[k].ref + '~=~' + results[k].value + '~' + results[k].unit;
        }
        printEquation(doc, str, 1.3*width/4-0.1*width, line+=14, 'left');
    }

    return line;
}

/**
 * This function generates a BS5 toast
 * @param {Object} message The object containing the message, title and type of the toast
 */
function outToast (message) {
    toastStack = $('#toast-stack');
    if(toastStack.length === 0){
        var toastStack = $('<div id="toast-stack" class="toast-container position-fixed" style="bottom: 5vh; right: 5vw; min-width: 20vw;"></div>');
        toastStack.appendTo('#results-modal');
    }

    var toast = $('<div class="toast w-100" role="alert" aria-live="assertive" aria-atomic="true"></div>');

    // Add toast header
    if(message.title){
        toastHeader = $('<div class="toast-header"></div>');

        // Add toast icon
        if(message.type === 'error'){
            toastHeader.append('<i class="fas fa-exclamation-triangle mr-2"></i>');
        }
        else if(message.type === 'warning'){
            toastHeader.append('<i class="fas fa-exclamation-circle mr-2"></i>');
        }
        else if(message.type === 'success'){
            toastHeader.append('<i class="fas fa-check-circle mr-2"></i>');
        }
        else if(message.type === 'info'){
            toastHeader.append('<i class="fas fa-info-circle mr-2"></i>');
        }

        // Add toast title
        if(message.title){
            toastHeader.append('<strong class="mr-auto">'+ message.title +'</strong>');
        }

        // Add toast close button
        toastHeader.append('<button type="button" class="close ml-auto" data-bs-dismiss="toast">&times;</button>');
        toast.append(toastHeader);
    }

    // Add toast body
    if(message.body){
        toastBody = $('<div class="toast-body">'+ message.body +'</div>');
        toast.append(toastBody);
    }

    toast.appendTo(toastStack);    
  
    // Check if maximum number of toasts is reached
    if (toastStack.find('.toast').length >= 5) {
        // Remove the oldest toast from the DOM and the activeToasts array
        var oldestToast = toastStack.find('.toast:first');
        oldestToast.remove();
    }

    var bsToast = new bootstrap.Toast(toast[0]);
    bsToast.show();
}