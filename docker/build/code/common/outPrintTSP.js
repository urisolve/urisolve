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
    htmlstr += '<div class="col-1 p-0 text-center"><a class="btn btn-primary m-1" data-bs-toggle="collapse" href="#tableContents-'+ cp.name.value +'" role="button" aria-expanded="false" aria-controls="collapseExample"><i class="fas fa-indent"></i></a></div>';
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
    htmlstr += '<div class="col-1 p-0 text-center"><a class="btn btn-primary m-1" data-bs-toggle="collapse" href="#tableContents-'+ cp.name.value +'" role="button" aria-expanded="false" aria-controls="collapseExample"><i class="fas fa-indent"></i></a></div>';
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