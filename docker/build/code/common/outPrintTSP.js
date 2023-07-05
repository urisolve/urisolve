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
    //TeX += "\\section{" + lang._circuitImage + "}";
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

	TeX += " & & "+Amps+"\/"+totalCurrents+"\r\n\\end{tabular}\r\n\\end{table}\r\n\r\n\\pagebreak\r\n\r\n";


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
            TeX += '\\begin{footnotesize}\\textbf{\\textit{Note: }} ' + lang._tspNotesSumComplex + '\\end{footnotesize}';
        }
        else{
            TeX += '\\begin{footnotesize}\\textbf{\\textit{Note: }} ' + lang._tspNotesSum + '\\end{footnotesize}';
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
    texHeader += '\\author{\\begin{tabular}[t]{c@{\\extracolsep{8em}}c}&\\\\\\multicolumn{2}{c}{\\textbf{\\emph{' + lang._project_coor + '}}}  \\\\&\\\\André Rocha         & Mário Alves         \\\\anr@isep.ipp.pt     & mjf@isep.ipp.pt     \\\\&\\\\Lino Sousa          & Francisco Pereira   \\\\sss@isep.ipp.pt     & fdp@isep.ipp.pt     \\\\&\\\\&\\\\\\multicolumn{2}{c}{\\textbf{\\emph{' + lang._devel + '}}}  \\\\\\multicolumn{2}{c}{\\small{\\textbf{v1.0.0 - 06/2023}}}  \\\\\\multicolumn{2}{c}{Guilherme Zenha - 1201398@isep.ipp.pt}  \\\\\\end{tabular}}\r\n\r\n\\date{}\r\n\r\n';
    texHeader += '\\begin{document}\r\n\r\n\\maketitle\r\n\\thispagestyle{empty}\r\n\r\n\\vspace{\\fill}\r\n\\begin{abstract}\r\n\\centering\r\n' + lang._TSPabstract + '\r\n\\end{abstract}\r\n\\vspace{\\fill}\r\n\r\n\\begin{center}\r\n\\today\r\n\\end{center}\r\n\r\n\\clearpage\r\n\\pagenumbering{arabic}\r\n\r\n\\newpage\r\n\r\n';
    return texHeader;
}

function buildImTeXTSP(imagesTSP, files){
    let imageTex = '';

    let sampleimg = base64imgselect("logo");
    imageTex += '\\newcommand{\\logo}{' + sampleimg.replace('data:image/png;base64,', '') + '}\r\n';

    const substitutions = "abcdfghjklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVYXYZ";

    // Add circuit image
    var html = $('#circuitImage > .circuit-widget > .drawing');
    //var imgTex = circuitToSvg(html);
    //imageTex += imgTex;

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

async function circuitToSvg(circuit){
    // Get component symbols
    let rUsDivs = circuit.find('.R.US');
    let rEUDivs = circuit.find('.R.european');
    let cNeutralDivs = circuit.find('.C.neutral');
    let cPolarDivs = circuit.find('.C.polar');
    let lDivs = circuit.find('.L');
    let vacDivs = circuit.find('.Vac');
    let vdcDivs = circuit.find('.Vdc');
    let iacDivs = circuit.find('.Iac');
    let idcDivs = circuit.find('.Idc');
    let vprobeDivs = circuit.find('.VProbe');
    let iprobeDivs = circuit.find('.IProbe');
    let gndDivs = circuit.find('.gnd');
    let vertDivs = circuit.find('.connect-vertical');
    let horDivs = circuit.find('.connect-horizontal');
    let components = rUsDivs.add(rEUDivs).add(cNeutralDivs).add(cPolarDivs).add(lDivs).add(vacDivs).add(vdcDivs).add(iacDivs).add(idcDivs).add(vprobeDivs).add(iprobeDivs).add(gndDivs).add(vertDivs).add(horDivs);
    
    images = [];

    // Get component images
    components.each(function(){
        var backgroundImage = $(this).css('background-image');
        var backgroundImageURL = backgroundImage.replace('url(','').replace(')','').replace(/\"/gi, "");
        var backgroundSize = $(this).css('background-size');
        var x = $(this).offset().left - $(this).parent().parent().offset().left;
        var y = $(this).offset().top - $(this).parent().parent().offset().top;        
        var width = $(this).css('width');
        var height = $(this).css('height');

        if($(this).hasClass('rotated-0')){
            rotation = 0;
        }
        else if($(this).hasClass('rotated-90')){
            rotation = 90;
        }
        else if($(this).hasClass('rotated-180')){
            rotation = 180;
        }
        else if($(this).hasClass('rotated-270')){
            rotation = 270;
        }

        var image = {
            backgroundImage: backgroundImageURL,
            backgroundSize: backgroundSize,
            rotation: rotation,
            x: x,
            y: y,
            width: width,
            height: height
        };

        images.push(image);
    });

    preloadedImages = [];

    // Preload images
    images.forEach(function(image){
        var img = new Image();
        img.src = image.backgroundImage;
        preloadedImages.push(img);
    });

    return new Promise((resolve, reject) => {
        try {
          html2canvas(circuit[0]).then(canvas => {
            var context = canvas.getContext('2d');
    
            for (let i = 0; i < preloadedImages.length; i++) {
              var image = preloadedImages[i];
              var x = images[i].x;
              var y = images[i].y;
              var width = images[i].width;
              var height = images[i].height;
              var rotation = images[i].rotation;
    
              context.drawImage(image, x, y, width, height);
            }
    
            var img = new Image();
            img.src = canvas.toDataURL('image/png');
    
            img.onload = () => {
              const imageTex = '\\newcommand{\\circuit}{' + canvas.toDataURL('image/png').replace('data:image/png;base64,', '') + '}\r\n';
              resolve(imageTex);
            };
          });
        } catch (error) {
          reject(new Error('An error occurred during image capture: ' + error));
        }
    });
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