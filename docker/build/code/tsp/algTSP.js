include('code/common/outPrintTSP.js'); // To generate modal sections
include('code/common/makeNetlist.js'); // To generate the netlists to send to the methods
include('code/common/redraw.js'); // To add circuit drawings to the modal sections

/**
 * This function generates the schematic object containing only the passed power source
 * @param {Schematic} schematic The schematic object of the main circuit
 * @param {String} source The id of the power source whose contribuition is to be calculated
 * @returns {Object} The sub-schematic object or the error data
 */
function makeSubcircuit(schematic, source){
    let index = 0;
    let changes = [];
    // Remove voltage power sources
    vectDcVoltPower.concat(vectAcVoltPower, vectDcCurrPower, vectAcCurrPower).forEach(cp => {
        if(cp.id !== source)
        {
            // Remove the component from the vector
                vectComponents = vectComponents.filter(c => c.id != cp.id);

            // If the component has impedance, switch for the internal resistance
            if(cp.properties.impedance.value !== '0')
            {
                let id = 'Ri'+index;
                index++;

                let caracteristics = [                      //Caracteristics:
                    'R',                                //Type
                    'Ri_'+cp.name.value,                //NameValue
                    '1',                                //Active
                    cp.position.x,                      //PositionX
                    cp.position.y,                      //PositionY
                    cp.name.position.x,                 //NamePositionX
                    cp.name.position.y,                 //NamePositionY
                    cp.position.mirrorx,                //MirrorX
                    cp.position.angle,                  //Angle
                    cp.properties.impedance.value,      //ValueValue
                    cp.properties.impedance.unit,       //ValueUnit
                    cp.properties.impedance.visible,    //ValueVisible
                    26.85,                              //TemperatureValue
                    0,                                  //TemperatureVisible
                    0,                                  //Tc1Value
                    0,                                  //Tc1Visible
                    0,                                  //Tc2Value
                    0,                                  //Tc2Visible
                    0,                                  //TnomValue
                    0,                                  //TnomVisible
                    'US',                               //SymbolReference
                    0,                                  //SymbolVisible
                ];

                changes.push({source: cp.name.value, changeCode: '1'});

                let ports = getPorts(caracteristics);

                new Resistor(id, caracteristics, ports);
            }
            // If the impedance is 0, and it's a voltage source, switch for a short circuit
            else if (['Vac', 'Vdc'].includes(cp.type))
            {
                let id = 'CC'+index;
                index++;
                let caracteristics = [                      //Caracteristics:
                    cp.port[0].position.x,              //BeginPositionX
                    cp.port[0].position.y,              //BeginPositionY
                    cp.port[1].position.x,              //EndPositionX
                    cp.port[1].position.y,              //EndPositionY
                    "",                                 //LabelText
                    0,                                  //LabelPositionX
                    0,                                  //LabelPositionY
                    0,                                  //LabelDistance
                    "",                                 //node_set
                ];

                changes.push({source: cp.name.value, changeCode: '2'});

                new Wire(id, caracteristics);
            }
            else {
            // If the impedance is 0, and it's a current source, switch for an open circuit
            // It has already been removed
                changes.push({source: cp.name.value, changeCode: '3'});
            }
        }
    });
    // Reset all connections and nodes
    vectConnections.forEach(c => {
        c.wires.forEach(w => {
            w.wire = "";
            w.begin.connectedWires = [];
            w.end.connectedWires = [];
            w.begin.connectedPorts = [];
            w.end.connectedPorts = [];
            vectWires.push(w); 
        });   
    });
    vectConnections = [];
    vectNodes = [];
    
    // Reset all port connections
    vectComponents.forEach(c => {
        c.port.forEach(p => {
            p.connections = [];
            p.net = "";
        });
    });
    treatSchematic();

    // Create new schematic
    let subSchematic = new Schematic(schematic.qucs_version, schematic.properties.view, schematic.properties.grid);
    
    cropWindow(subSchematic);

    // Reset the vectors
    vectComponents = schematic.components;
    vectConnections = schematic.connections;
    vectNodes = schematic.nodes;

    return {
        errorFlag: false,
        errorReasonCodes: [],
        data: {
            tree: JSON.stringify(subSchematic),
            object: subSchematic,
            changes: changes,
        }
    }
}

/**
 * This function converts the schematic object to a netlist and then to a JSON file
 * @param {Schematic} circuit The circuit to be converted to JSON
 * @returns {Object} The JSON file or the error data
 */
function schematicToJsonFile(circuit) {
    // Schematic to Netlist
    netlist = makeNetlist(circuit);

    if(netlist.errorFlag) {
        alert('Erro ao gerar o netlist.');
        return;
    }

    // Netlist to JSON //

    resistors = new Array();
	coils = new Array();
	capacitors = new Array();
	dcVoltPs = new Array();
	acVoltPs = new Array();
	dcAmpsPs = new Array();
	acAmpsPs = new Array();
	ampsMeters = new Array();
	voltMeters = new Array();
	connections = new Array();
	// Circuit analysis global data
	circuitAnalData = {
		frequency:	{value: 0, mult: ''}
	};
	nodes = new Array();
	branches = new Array();
	currents = new Array();
	// Circuit analysis counters
	circuitAnalCnt = {
		node: 		0,
		branch: 	0,
		current:	0
	};
	//Manage ampmeters
	iProbeNodesLoc = new Array();
	iProbeNodesArr = new Array();
	iProbeLocVsAmpId = new Array();

    // Validate the netlist
	var netlistTxt = validateNetlist(netlist.data);
    // Check for previous ground alteration
	if(fileContents[2])
        netlistTxt.first.push(fileContents[2]);
    cleanData();
    importData(netlistTxt);
    manageAmpmeters();
    findNodes();
    makeBranches();
    branchCurrents();
    agregatePowerSupplies();
    return {
        first: false,
        second: 0,
        third: buildJson(netlistTxt),
    }
}

/**
 * This function calculates the contribuition of each power source to the total power
 * @param {Schematic} schematic The schematic object of the main circuit
 * @param {Object} mainJsonFile The JSON file of the main circuit
 * @param {Array<Component, string>} order The resolution order
 */
function solveTSP(schematic, mainJsonFile, order) {
    let subcircuits = new Array(length = order.length);
  
    order.forEach(o => {
      const cp = o[0];
      let method = o[1];
      let generateSection = false;
  
      const tabs = $('.resolution-item');
      const page = $('#resolution-' + cp.name.value);
      const tab = tabs.find($('a[href="#resolution-' + cp.name.value + '"]')).parent();
  
      // Check if the page was already generated
      if (!tab.hasClass('solved')) {
        generateSection = true;
      } else {
        // If the tab is on the wrong position, move it
        if (tab.index() -1 !== order.indexOf(o)) {
            tab.insertAfter($('.resolution-item').eq(order.indexOf(o)));

            // Reset the scroll event listener
            modal = $('#results-modal');
            modal.off('scroll');
        }

        // Check if the method is the same
        if(page.attr('method') !== method) {
            generateSection = true;
        }
      }
  
      if (generateSection) {
        page.attr('method', method);

        let subcircuit = makeSubcircuit(schematic, cp.id);

        if(subcircuit.errorFlag) {
            alert('Erro ao gerar o subcircuito.');
            return;
        }

        subcircuits[order.indexOf(o)] = ({schematic: subcircuit.data.object, name: cp.name.value, method: method});
        let jsonFile = schematicToJsonFile(subcircuits[order.indexOf(o)].schematic);
        let parsedJson = JSON.parse(jsonFile.third);

        if(parsedJson.analysisObj.warnings.length > 0){
            if(parsedJson.analysisObj.warnings.some(w => w.errorCode === 15)){
                method = 'LKM'; 
                parsedJson.analysisObj.currents = JSON.parse(JSON.stringify(mainJsonFile.analysisObj.currents));
                parsedJson.branches = JSON.parse(JSON.stringify(mainJsonFile.branches));
            }
        }

        // Initialize variables
        let warningsText = "";
        switch (method) {
            case 'MTN':
                //page.html(outHTMLTSPResolutionMTN(cp, subcircuit.data.object));
                break;
            case 'MCM':
                // Solve with MCM
                jsonFile = loadFileAsTextMCM(jsonFile.third, false);
            
                // Add sections
                page.html(outHTMLSectionsMCM_TSP(cp, order.length));
                
                warningsText = warningOutput(jsonFile.analysisObj.warnings);
                if(warningsText != 0){
                    $('#warnings').html(warningsText);
                    $('#errors').hide();
                    $('#warnings').show();
                }

                // Output data Generation
                $('#buttonShowAll').html(outShowAllBtnMCM());

                //circuit fundamental variables
                $('#fundamentalVars').html(outCircuitFundamentalsMCM(jsonFile));

                //circuit info MCM
                $('#circuitInfo').html(outCircuitInfoMCM(jsonFile));

                //circuit equations info
                $('#meshEquations').html(outEquationCalcMCM(jsonFile));

                // Custom function needed to have multiple pages
                canvasObjects = outMeshesMCM(jsonFile.branches, jsonFile.analysisObj.chosenMeshes);

                step1 = outStep1MCM(jsonFile.analysisObj.equations);
                step2 = outStep2MCM(jsonFile.analysisObj.equations);
                step3 = outStep3MCM(jsonFile.analysisObj.equations);
                equationSystemOutput = outEquationSystemMCM(jsonFile.analysisObj.equations, step1, step2, step3);
                $('#eqSys').html(equationSystemOutput);
                $('#resultsCurrentsMesh').html(outResultsMeshesMCM(jsonFile));
                $('#currentsInfo').html(outCurrentsInfo(jsonFile.analysisObj.currents, jsonFile.branches).first);
                $('#resultsCurrentsBranch').html(outResultsCurrentsMCM(jsonFile));

                // Push the solved JSON to the array
                solvedJSON[cp.name.value] = {file: jsonFile, method: 'MCM', canvas: canvasObjects};
                break;
            case 'MCR':
                // Solve with MCR
                jsonFile = loadFileAsTextMCR(jsonFile.third, false);

                // Add sections
                page.html(outHTMLSectionsMCR_TSP(cp, order.length));

                warningsText = warningOutput(jsonFile.analysisObj.warnings);
                if(warningsText != 0){
                    $('#warnings').html(warningsText);
                    $('#errors').hide();
                    $('#warnings').show();
                }

                // Output data Generation
                $('#buttonShowAll').html(outShowAllBtnMCR());

                //debug version
                $('#version').html(outVersionMCR(jsonFile));

                //circuit fundamental variables
                $('#fundamentalVars').html(outCircuitFundamentalsMCR(jsonFile));

                //circuit info MCM
                $('#circuitInfo').html(outCircuitInfoMCR(jsonFile));

                //circuit equations info
                $('#meshEquations').html(outEquationCalcMCR(jsonFile));
                

                //eq nos
                knlCurrData = outCurrentsKNLMCR(jsonFile.analysisObj.equations.nodeEquationsReal);
                $('#KNLEquations').html(knlCurrData.first);
                canvasObjectss = createCanvasCurrentsMCR(knlCurrData.second);

                canvasObjects = outMeshesMCR(jsonFile.branches, jsonFile.analysisObj.chosenMeshes, jsonFile.analysisObj.result);

                step1 = outStep1MCR(jsonFile.analysisObj.equations);
                step2 = outStep2MCR(jsonFile.analysisObj.equations);
                //let step3 = outStep3MCM(jsonFile.analysisObj.equations);
                equationSystemOutput = outEquationSystemMCR(jsonFile.analysisObj.equations, step1, step2);
                $('#eqSys').html(equationSystemOutput);
                //$('#resultsCurrentsMesh').html(outResultsMeshesMCM(jsonFile));
                $('#currentsInfo').html(outCurrentsInfoMCR(jsonFile.analysisObj.currents, jsonFile.branches).first);
                $('#resultsCurrentsBranch').html(outResultsCurrentsMCR(jsonFile));

                // Push the solved JSON to the array
                solvedJSON[cp.name.value] = {file: jsonFile, method: 'MCR', canvas: canvasObjects, canvasCurr: canvasObjectss};
                break;
            case 'LKM':
                // Solve with LKM
                jsonFile = loadFileAsTextLKM(parsedJson, subcircuit.data.object);

                // Add sections
                page.html(outHTMLSectionsLKM_TSP(cp, order.length));

                warningsText = warningOutput(jsonFile.analysisObj.warnings);
                    if(warningsText != 0){
                        $('#warnings').html(warningsText);
                        $('#errors').hide();
                        $('#warnings').show();
                    }

                // Output data Generation
                $('#buttonShowAll').html(outShowAllBtnMCR());

                // Circuit info 
                $('#circuitInfo').html(outCircuitInfoMCM(jsonFile));

                // Current info
                $('#currentsInfo').html(outCurrentsInfo(jsonFile.analysisObj.currents, jsonFile.branches).first);

                // Equations
                step1 = '';
                step2 = '';
                if (cp.type == 'Vac' || cp.type == 'Vdc') {
                    step1 = outStep1LKM_TSP(jsonFile.analysisObj.equations);
                    step2 = outStep2LKM_TSP(jsonFile.analysisObj.equations);
                }
                equationSystemOutput = outEquationSystemLKM_TSP(jsonFile.analysisObj, step1, step2);
                $('#eqSys').html(equationSystemOutput);

                // Results
                $('#resultsCurrentsBranch').html(outHTMLResultsLKM(jsonFile));

                // Push the solved JSON to the array
                solvedJSON[cp.name.value] = {file: jsonFile, method: 'LKM'};
                break;
            default:
                alert('Método de resolução não reconhecido.');
                break;
        }

        // Add notes to the modal
        let note = '<div class="d-flex d-flex-row"><p>';
        subcircuit.data.changes.forEach(change => {
            note += '<i class="fas fa-chevron-right"></i>';
            note += '<strong> ' + change.source + '</strong>';
            switch(change.changeCode){
                case '1':
                    note +='<span data-translate="_tspNotesRi"></span><br>';
                    break;
                case '2':
                    note += '<span data-translate="_tspNotesIdeal"></span>';
                    note += '<span data-translate="_tspNotesCC"></span><br>';
                    break;
                case '3':
                    note += '<span data-translate="_tspNotesIdeal"></span>';
                    note += '<span data-translate="_tspNotesCA"></span><br>';
                    break;
            }
        });
        note += '</p></div>';
        note = $(note);
        noteContainer = $('#subcircuit-note .container-fluid').find('.ml-1')[1];
        note.appendTo(noteContainer);

        // Toggle plus minus icon on show hide of collapse element
        for(let i = 0; i<7; i++){
            $( "#btn-"+i ).click(function() {
                $(this).find("i").toggleClass("fas fa-plus fas fa-minus");
            });
        }

        $( "#showALL").click(function() {
            for(let i = 0; i<7; i++){
                $("#btn-"+i).children('.fa-minus, .fa-plus').toggleClass("fas fa-minus fas fa-plus");

            }
        });

        // Update the IDs and targets of the elements to be specific to the tab
        // This is needed to avoid conflicts with other tabs
        page.find('*').each(function() {
            var $element = $(this);
            var currentID = $element.attr('id');
            var currentTarget = $element.attr('data-bs-target');
            if (currentID) {
              var newID = currentID + "-" + cp.name.value;
              $element.attr('id', newID);
            }
            if (currentTarget && currentTarget != '.multi-collapse') {
                var newTarget = currentTarget + "-" + cp.name.value;
                $element.attr('data-bs-target', newTarget);
            }
        });

        // Ajust table of contents offset
        page.find('#tableContents-'+ cp.name.value+ ' a').each(function() {
            if ($(this).attr('href')) {
                $(this).click(function() {
                    $('.modal').animate({
                        scrollTop: $($(this).attr('href')).position().top - 100 - $(this).parent().height(),
                    }, 500);
                    page.find('#tableContents-'+ cp.name.value).removeClass('show');
                });
            }
        });

        // Draw subcircuit on first time showing the tab
        tab.find('a').on('shown.bs.tab', function(e) {
            tabIndex = $(e.target).parent().index() - 1;
            
            drawingContainer = page.find('.circuit-widget');
            if (drawingContainer.children().length === 0) {
                // Get component
                let componentName = $(this).find('h5').text();
                let drawing = redrawSchematic(subcircuits.find(s => s.name == componentName).schematic, drawingContainer, true, false);
                if(drawing.errorFlag){
                    alert('Error on circuit drawing:\n' + redrawSchematic_handleError(drawing));
                    return;
                }
            }

            // Change progress bar
            var progressBars = page.find('.progress-bar');
            for(let i = 0; i<tabs.length; i++){
                let progress = progressBars.eq(i);
                if(tabIndex == i) {
                    modal = $('#results-modal');
                    var winScroll = modal.scrollTop();
                    var height = modal[0].scrollHeight - modal.outerHeight();
                    var percent = (winScroll / height) * 100;

                    // Update progress bar on scroll
                    modal.scroll(function() {
                        var winScroll = modal.scrollTop();
                        var height = modal[0].scrollHeight - modal.outerHeight();
                        var percent = (winScroll / height) * 100;
                        progress.css('width', percent + '%');
                        progress.attr('aria-valuenow', percent);

                        if(percent == 100)
                            progress.removeClass('progress-bar-animated').addClass('bg-success');
                        else
                            progress.removeClass('bg-success').addClass('progress-bar-animated');
                    });
                }
                else if(tabIndex > i){
                    percent = 100;
                }
                else if(tabIndex < i){
                    percent = 0;
                }
                    
                progress.css('width', percent + '%');
                progress.attr('aria-valuenow', percent);
                if(percent == 100)
                    progress.removeClass('progress-bar-animated').addClass('bg-success');
                else
                    progress.removeClass('bg-success').addClass('progress-bar-animated');
            }
        });

        // Update Dictionary Language
        let language = document.getElementById("lang-sel-txt").innerText.toLowerCase();
        if(language == "english")
            set_lang(dictionary.english);
        else	
            set_lang(dictionary.portuguese);

        // Add the solved class after solving the page
        tab.addClass('solved');
      }
    });

    console.log(solvedJSON);
    contributions = {};
    for (json in solvedJSON){
        // Get current values
        contributions[json] = {};
        
        switch(solvedJSON[json].method) {
            case 'MCR':
                ref = '';
                solvedJSON[json].file.analysisObj.result.cuurentResult.forEach(curr => {
                    if(solvedJSON[json].file.analysisObj.circuitFreq.value == '0'){
                        const regex = /^(\w+)\s*=\s*(-?[\d.,]+)~(\w+)$/;
                        const match = curr.match(regex);
                        if (match){
                            const obj = {
                                value: parseFloat(match[2].replace(',', '.')),
                                unit: match[3],
                                };
                                contributions[json][match[1]] = obj;
                        }
                        ref = match[1];
                    }
                    else {
                        const regex = /^([A-Za-z0-9]+)\s*=\s*([\d.,-]+)\\angle\{(.+?)\}\s*([A-Za-z]+)/;
                        const match = curr.match(regex);
                        if (match){
                            const obj = {
                                complex: true,
                                magnitude: parseFloat(match[2].replace(',', '.')),
                                angle: parseFloat(match[3].replace(',', '.').replace('^{\\circ}', '')),
                                unit: match[4],
                            };
                            obj.valueRe = obj.magnitude * Math.cos(obj.angle * Math.PI / 180);
                            obj.valueIm = obj.magnitude * Math.sin(obj.angle * Math.PI / 180);

                            // Round total to 3 decimal places magnitude
                            obj.magnitude = Math.round(obj.magnitude * 100) / 100;
                            // Round total to 3 decimal places angle
                            obj.angle = Math.round(obj.angle * 1000) / 1000;
                            // Round total to 3 decimal places valueRe
                            obj.valueRe = Math.round(obj.valueRe * 1000) / 1000;
                            // Round total to 3 decimal places valueIm
                            obj.valueIm = Math.round(obj.valueIm * 1000) / 1000;

                            contributions[json][match[1]] = obj;
                        }
                        ref = match[1];
                    }

                    // Find component in the branch
                    solvedJSON[json].file.branches.forEach(branch => {
                        if(branch.currentData.ref === ref){
                            components = branch.components.map(cp => cp.ref);
                            contributions[json][ref].components = components;
                            contributions[json][ref].start = branch.currentData.noP;
                            contributions[json][ref].end = branch.currentData.noN;
                        }
                    });
                });

            break;
            case 'MCM':
                solvedJSON[json].file.analysisObj.currents.forEach(curr => {
                    let obj = {};
                    if(!curr.complex){
                        value = curr.magnitude;
                        if(curr.angle == 180)
                            value *= -1;  
                        
                        obj = {
                            complex: curr.complex,
                            start: curr.noP,
                            end: curr.noN,
                            value: value,
                        };

                        // Get the appropriate unit
                        valueAbs = Math.abs(curr.valueRe);
                        if (valueAbs >= 1000000){
                            obj.unit = 'MA';
                            obj.value /= 1000000;
                        }
                        else if (valueAbs >= 1000){
                            obj.unit = 'kA';
                            obj.value /= 1000;
                        }
                        else if (valueAbs >= 1){
                            obj.unit = 'A';
                        }
                        else if (valueAbs >= 0.001){
                            obj.unit = 'mA';
                            obj.value *= 1000;
                        }
                        else if (valueAbs >= 0.000001){
                            obj.unit = 'uA';
                            obj.value *= 1000000;
                        }
                        else {
                            obj.unit = 'A';
                            obj.value = 0;
                        }

                        // Round total to 3 decimal places
                        obj.value = Math.round(obj.value * 1000) / 1000;
                    }
                    else {
                        magnitude =  curr.magnitude;
                        angle =  curr.angle;
                        valueRe = curr.valueRe;
                        valueIm =  curr.valueIm;

                        obj = {
                            complex: curr.complex,
                            start: curr.noP,
                            end: curr.noN,
                            magnitude: magnitude,
                            angle: angle,
                            valueRe: valueRe,
                            valueIm: valueIm,
                        };

                        // Get the appropriate unit for the magnitude
                        valueAbs = Math.abs(curr.magnitude);
                        if (valueAbs >= 1000000){
                            obj.unit = 'MA';
                            obj.magnitude /= 1000000;
                            obj.valueRe /= 1000000;
                            obj.valueIm /= 1000000;
                        }
                        else if (valueAbs >= 1000){
                            obj.unit = 'kA';
                            obj.magnitude /= 1000;
                            obj.valueRe /= 1000;
                            obj.valueIm /= 1000;
                        }
                        else if (valueAbs >= 1){
                            obj.unit = 'A';
                        }
                        else if (valueAbs >= 0.001){
                            obj.unit = 'mA';
                            obj.magnitude *= 1000;
                            obj.valueRe *= 1000;
                            obj.valueIm *= 1000;
                        }
                        else if (valueAbs >= 0.000001){
                            obj.unit = 'uA';
                            obj.magnitude *= 1000000;
                            obj.valueRe *= 1000000;
                            obj.valueIm *= 1000000;
                        }
                        else {
                            obj.unit = 'A';
                            obj.magnitude = 0;
                            obj.valueRe = 0;
                            obj.valueIm = 0;
                        }

                        

                        // Round total to 3 decimal places magnitude
                        obj.magnitude = Math.round(obj.magnitude * 100) / 100;
                        // Round total to 3 decimal places angle
                        obj.angle = Math.round(obj.angle * 1000) / 1000;
                        // Round total to 3 decimal places valueRe
                        obj.valueRe = Math.round(obj.valueRe * 1000) / 1000;
                        // Round total to 3 decimal places valueIm
                        obj.valueIm = Math.round(obj.valueIm * 1000) / 1000;

                    }

                    contributions[json][curr.ref] = obj;

                    // Find component in the branch
                    solvedJSON[json].file.branches.forEach(branch => {
                        if(branch.currentData.ref === curr.ref){
                            components = branch.components.map(cp => cp.ref);
                            contributions[json][curr.ref].components = components;
                        }
                    });
                });
            break;
            case 'LKM':
                solvedJSON[json].file.analysisObj.currents.forEach(curr => {
                    let obj = {};

                    if(!curr.complex){
                        obj = {
                            complex: curr.complex,
                            start: curr.noP,
                            end: curr.noN,
                            value: curr.value,
                            components: curr.components,
                            unit: curr.unit,
                        };
                    }
                    else {
                        obj = {
                            complex: curr.complex,
                            start: curr.noP,
                            end: curr.noN,
                            magnitude: curr.magnitude,
                            angle: curr.angle,
                            valueRe: curr.valueRe,
                            valueIm: curr.valueIm,
                            components: curr.components,
                            unit: curr.unit,
                        };
                    }

                    contributions[json][curr.ref] = obj;
                });
            break;

        }
    }
    mainJsonFile.analysisObj.contributions = contributions;

    // Match contributions to the currents
    mainJsonFile.branches.forEach(branch => {
        branch.components = branch.acAmpPwSupplies.concat(branch.acVoltPwSupplies, branch.capacitors, branch.coils, branch.dcAmpPwSupplies
, branch.dcVoltPwSupplies, branch.resistors);
        components = branch.components.map(cp => cp.ref);
        curr = branch.currentData.ref;
        currentObj = mainJsonFile.analysisObj.currents.find(c => c.ref === curr);
        currentObj.contributions = {};
        
        // Find the current in the contributions
        for (json in contributions){
            for (curr in mainJsonFile.analysisObj.contributions[json]){
                c = mainJsonFile.analysisObj.contributions[json][curr];

                let sortedComponents = components.slice().sort();
                let sortedCComponents = c.components.slice().sort().map(cp => {if(cp.startsWith("Ri\\_")){return cp.substring(4);} return cp;}); 
                if (sortedComponents.some(value => sortedCComponents.includes(value))){
                    currentObj.contributions[json] = c;
                }
            };
        }
    });

    // Calculate total values
    mainJsonFile.analysisObj.results = [];
    mainJsonFile.analysisObj.currents.forEach(curr => {
        let totalre = 0;
        let totalim = 0;
        let equation = curr.ref + ' = ';
        let first = true;
        for (json in curr.contributions){
            contribution = curr.contributions[json];
            if(contribution.value !== 0){
                switch(contribution.unit){
                    case 'MA':
                        unitMultiplier = 1000000;
                        break;
                    case 'kA':
                        unitMultiplier = 1000;
                        break;
                    case 'A':
                        unitMultiplier = 1;
                        break;
                    case 'mA':
                        unitMultiplier = 0.001;
                        break;
                    case 'uA':
                        unitMultiplier = 0.000001;
                        break;
                    default:
                        unitMultiplier = 1;
                        break;
                }

                if(!contribution.complex){
                    let value = contribution.value * unitMultiplier;
                    if (curr.noP == contribution.start || curr.noN == contribution.end){
                        totalre += value;
                        if (value < 0 && !first)
                            equation += ' (' + contribution.value + ' ' + contribution.unit + ') + ';
                        else
                            equation += contribution.value + ' ' + contribution.unit + ' + ';
                        first = false;
                    }
                    else if (curr.noP == contribution.end || curr.noN == contribution.start){
                        totalre -= value;
                        if (value < 0 && !first)
                            equation += ' (' + contribution.value*-1 + ' ' + contribution.unit + ') + ';
                        else
                            equation += contribution.value*-1 + ' ' + contribution.unit + ' + ';
                        first = false;
                    }
                } else {
                    let valuere = contribution.valueRe * unitMultiplier;
                    let valueim = contribution.valueIm * unitMultiplier;
                    if (curr.noP == contribution.start || curr.noN == contribution.end){
                        totalre += valuere;
                        totalim += valueim;
                        equation += contribution.magnitude + '\\angle' + contribution.angle + '^{\\circ}' + ' ' + contribution.unit + ' + ';
                        first = false;
                    }
                    else if (curr.noP == contribution.end || curr.noN == contribution.start){
                        totalre -= valuere;
                        totalim -= valueim;
                        if(!first)
                            equation += ' (' + contribution.magnitude*-1 + '\\angle' + contribution.angle + '^{\\circ}' + ' ' + contribution.unit + ') + ';
                        else
                            equation += contribution.magnitude*-1 + '\\angle' + contribution.angle + '^{\\circ}' + ' ' + contribution.unit + ' + ';
                        first = false;
                    }
                }
            }
        }

        if(totalim){
            // Calculate magnitude and angle
            totalmag = Math.sqrt(totalre**2 + totalim**2);
            totalang = Math.atan2(totalim,totalre) * 180 / Math.PI;
            // Get the appropriate unit for the magnitude
            let totalAbs = Math.abs(totalmag);
            if (totalAbs >= 1000000){
                unit = 'MA';
                totalmag /= 1000000;
            }
            else if (totalAbs >= 1000){
                unit = 'kA';
                totalmag /= 1000;
            }
            else if (totalAbs >= 1){
                unit = 'A';
            }
            else if (totalAbs >= 0.001){
                unit = 'mA';
                totalmag *= 1000;
            }
            else if (totalAbs >= 0.000001){
                unit = 'uA';
                totalmag *= 1000000;
            }
            else{
                unit = 'A';
                totalmag = 0;
            }
            
            totalre = Math.round(totalre * 1000) / 1000;
            totalim = Math.round(totalim * 1000) / 1000;
            totalang = Math.round(totalang * 1000) / 1000;
            totalmag = Math.round(totalmag * 1000) / 1000;
            mainJsonFile.analysisObj.results.push({ref: curr.ref, complex: true, value: {valuere: totalre, valueim: totalim, magnitude: totalmag, angle: totalang}, unit: unit, equation: equation.slice(0, -3)});
        }
        else {
            totalre = Math.round(totalre * 1000) / 1000;

            // Get the appropriate unit
            let totalAbs = Math.abs(totalre);
            if (totalAbs >= 1000000){
                unit = 'MA';
                totalre /= 1000000;
            }
            else if (totalAbs >= 1000){
                unit = 'kA';
                totalre /= 1000;
            }
            else if (totalAbs >= 1){
                unit = 'A';
            }
            else if (totalAbs >= 0.001){
                unit = 'mA';
                totalre *= 1000;
            }
            else if (totalAbs >= 0.000001){
                unit = 'uA';
                totalre *= 1000000;
            }
            else{
                unit = 'A';
                totalre = 0;
            }

            mainJsonFile.analysisObj.results.push({ref: curr.ref, complex: false, value: totalre, unit: unit, equation: equation.slice(0, -3)});
        }
    });

    console.log(mainJsonFile);

    return {
        errorFlag: false,
        errorReasonCodes: [],
        data: { solvedJSON: mainJsonFile,
                subcircuits: solvedJSON,}
    }
  }

/**
 * Outputs information to the modal
 * @param {object} jsonFile 
 * @param {Schematic} schematic 
 * 
 * @description Error codes:
 * @description 1 - There's less than 2 power sources in the schematic
 */
function outputTSP(jsonFile, schematic){
    // Get sources and probes
    sourceTypes = ['Vdc', 'Vac', 'Idc', 'Iac'];
    vectSources = vectDcVoltPower.concat(vectAcVoltPower, vectDcCurrPower, vectAcCurrPower);
    vectProbes = vectVProbe.concat(vectIProbe);
    //methods = ['MTN', 'MCR', 'MCM'];
    methods = ['MCR', 'MCM'];
    //methods = ['MCM'];

    if(vectSources.length < 2){
        return{
            errorFlag: true,
            errorReasonCodes: [1],
        }
    }

    // Add navigation tabs
    $('#results-board').html(outHTMLResolutionNavTSP());

    // Add sections to main tab
	$('#main-tab').html(outHTMLSectionsTSP());

    // Populate warnings section (if any)

    // Add circuit drawing
    var mainCircuit = $('#circuitImage .circuit-widget');
    cropWindow(schematic);

    // Populate selection section
    $('#selection-body').html(outHTMLSelectionTSP());


    // Turn the viz. on
	$("#contResults").show();
    // Disable output buttons until the circuit is solved
    $('#buttons-div .btn-secondary').addClass('disabled');
	$("#loadpage").fadeOut(1000);
    $("#results").show();
	$('#results-modal').modal('show');

    // Add circuit drawings
    $('#results-modal').on('shown.bs.modal', function() {
        var mainDrawing = redrawSchematic(schematic, mainCircuit);
        if(mainDrawing.errorFlag){
            alert('Error on circuit drawing:\n' + redrawSchematic_handleError(mainDrawing));
            return;
        }
    });

    // Add cards to the selection section
    $('#selection-body > ul').find('a[data-bs-toggle="pill"]').click(function() {
        if($(this).attr('href') == '#interactive') {
            // Interactive mode
            $('.selection-cards').empty();

            vectSources.forEach(cp => {
                cpDiv = $('#circuitImage .drawing').find('.'+cp.id);
                cpDiv.addClass('order-selectable').click(function() {
                    if($(this).hasClass('order-selected')) {
                        $('.selection-cards .card').each(function() {
                            if($(this).find('.card-title').text() == cp.name.value) {
                                $(this).remove(); 
                            }
                        });
                    } else {
                        card = $(`<li class="card bg-info text-center p-2 mx-1"></li>`);
                        card.append(`<div class="card-title">${cp.name.value}</div>`);
                        card.append(`<select></select>`);
                        methods.forEach(m => card.find('select').append(`<option>${m}</option>`));
                        $('#interactive').find('.selection-cards').append(card);
                    }
                    $(this).toggleClass('order-selected');
                    $(this).toggleClass('order-selectable');
                    selected = $('.order-selected').length;
                    $('#source-counter > div').text(selected+' / ' +vectSources.length);
                });
            });

            // Add source counter
            selected = $('.order-selected').length;
            $('#circuitImage').append('<div id="source-counter" class="mx-auto mt-2 p-1 border border-dark col-2 text-center"><span data-translate="_numsources"></span><div>'+selected+' / ' +vectSources.length+'</div></div>');

            // Update Dictionary Language
            let language = document.getElementById("lang-sel-txt").innerText.toLowerCase();
            if(language == "english")
                set_lang(dictionary.english);
            else	
                set_lang(dictionary.portuguese);
        } else {
            // Passive mode
            vectSources.forEach(cp => {
                cpDiv = $('#circuitImage .drawing').find('.'+cp.id);
                cpDiv.removeClass('order-selectable');
                cpDiv.removeClass('order-selected');
                cpDiv.off('click');
            });

            // Remove source counter
            $('#source-counter').remove();
        }
    });

    // Make selection cards sortable
    $('#selection').sortable({
        connectWith: ".selection-cards",
        items: ".card",
        helper: "clone",
        tolerance: "touch",
        handle: '.card-title',
        cancelable: true,
    });
    $("#selection").disableSelection();

    // Handle calc button
    $('#calc-btn').click(function() {
        if($('#passive').hasClass('active')) {
            // Passive mode
            resolutionOrder = vectSources.map(s => [s, methods[0]]);
        } else {
            if ($('.selection-cards').find('.card').length != vectSources.length){
                outToast({type: 'error', title: 'Error', body: 'You must select all power sources.'});
                return;
            }
            // Interactive mode
            resolutionOrder = [];
            // Get order
            $('.selection-cards .card').each(function() {
                source = $(this).find('.card-title').text();
                method = $(this).find('select').val();
                source = vectSources.find(s => s.name.value == source);
                resolutionOrder.push([source, method]);
            });
        }

        $('#loadpage').fadeIn(1000);

        // Add resolution sections
        $('#results-tabs').append(outHTMLResolutionTabsTSP(resolutionOrder));
        $('#pages-content').append(outHTMLResolutionTabsContentTSP(resolutionOrder));

        // Calculate
        let solved = solveTSP(schematic, jsonFile, resolutionOrder);
        if(solved.errorFlag) {
            alert('Erro ao resolver o circuito.');
            return;
        }
        
        // Add results section
        $('#results-tab').html(outHTMLResultsSectionsTSP());

        // Populate table
        $('#results-table').html(outHTMLResultsTableTSP(solved.data.solvedJSON));

        // Populate info section
        $('#currentsInfo-results').html(outCurrentsInfo(jsonFile.analysisObj.currents, jsonFile.branches).first);

        // Populate results section
        $('#resolution-results').html(outHTMLResultsTSP(jsonFile));


        // Export JSON file
        $("#json").off().on('click', function() {
            const filename = 'urisolve_results_TSP.json';
            let element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(jsonFile)));
            element.setAttribute('download', filename);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        });

        // Export TeX File
        $("#tex").off().on('click', function() {
            const filename = 'urisolve_results_TSP.tex';
            const imagesFilename = 'urisolve_images_TSP.tex';
                    
            //Get User info
            let studName = document.getElementById('output-name').value;
            let studLastname = document.getElementById('output-lastname').value;
            let studNumber = document.getElementById('output-number').value

            // Get Simulation Time
            let hourstr = new Date().getHours();
            let minstr = new Date().getMinutes();
            if(hourstr.toString().length < 2)
                hourstr = "0" + hourstr;
            if(minstr.toString().length < 2)
                minstr = "0" + minstr;
            hourstr = hourstr + ":" + minstr;

            let TeX = buildTeXOvTSP(jsonFile, solved.data.subcircuits);
            let ImagesTeX = buildImTeXTSP(undefined, solved.data.subcircuits);

            //Print TeX (Temporary - Index 1432 - texfile cannot be change before it)
            if(studNumber.length>1 && studLastname.length > 1 && studNumber.length>1){
                let string = "\\vspace{0.5cm}\\centering{ \r\n Simulation performed by: \\textbf{ "+studName+" "+studLastname+" ("+studNumber+")}} "
                string += " at " + hourstr + "\r\n";
                TeX = TeX.slice(0,1660) + string + TeX.slice(1661);
            }

            // Create download link for TeX file
            let element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(TeX));
            element.setAttribute('download', filename);
            element.style.display = 'none';
            // Create download link for Images TeX file
            let element2 = document.createElement('a');
            element2.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(ImagesTeX));
            element2.setAttribute('download', imagesFilename);
            element2.style.display = 'none';

            // Download files
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
            document.body.appendChild(element2);
            element2.click();
            document.body.removeChild(element2);
        });

        // Open in overleaf
        $("#overleaf").off().on('click', function() {
            let TeX = buildTeXOvTSP(jsonFile, solved.data.subcircuits);
            let ImagesTeX = buildImTeXTSP(undefined, solved.data.subcircuits);
            //Get User info
            let studName = document.getElementById('output-name').value;
            let studLastname = document.getElementById('output-lastname').value;
            let studNumber = document.getElementById('output-number').value
            // Get Simulation Time
            let hourstr = new Date().getHours();
            let minstr = new Date().getMinutes();
            if(hourstr.toString().length < 2)
                hourstr = "0" + hourstr;
            if(minstr.toString().length < 2)
                minstr = "0" + minstr;
            hourstr = hourstr + ":" + minstr;
            //Print TeX (Temporary - Index 1432 - texfile cannot be change before it)
            if(studNumber.length>1 && studLastname.length > 1 && studNumber.length>1){
                let string = "\\vspace{0.5cm}\\centering{ \r\n Simulation performed by: \\textbf{ "+studName+" "+studLastname+" ("+studNumber+")}} "
                string += " at " + hourstr + "\r\n";
                TeX = TeX.slice(0,1660) + string + TeX.slice(1661);
            }
            TeX = TeX.replaceAll("[latin1]", "");
            document.getElementById('main').value = encodeURIComponent(TeX);
            document.getElementById('images').value = encodeURIComponent(ImagesTeX);
            document.getElementById('overleaf').submit();
        });

        // Export PDF File
        $("#print").off().on('click', function() {
            // Not implemented yet
            //buildPrintPDF(jsonFile, canvasObjects);
        });

        // Enable output buttons
        $('#buttons-div .btn-secondary').removeClass('disabled');

        // On modal close remove all exports
        $('#results-modal').on('hidden.bs.modal', function() {
            $("#json").off();
            $("#tex").off();
            $("#overleaf").off();
            $("#print").off();
        });

        $('#loadpage').fadeOut(1000);

        // Update Dictionary Language
	    let language = document.getElementById("lang-sel-txt").innerText.toLowerCase();
	    if(language == "english")
		    set_lang(dictionary.english);   
	    else	
	    	set_lang(dictionary.portuguese);
    });

    
    // Update Dictionary Language
	let language = document.getElementById("lang-sel-txt").innerText.toLowerCase();
	if(language == "english")
		set_lang(dictionary.english);
	else	
		set_lang(dictionary.portuguese);

    return {
        errorFlag: false,
        errorReasonCodes: []
    }
}

/**
 * Main function of the TSP module
 * @param {object} data Initial jsonFile data
 * @param {Schematic} schematic Schematic object of the main circuit
 */
function loadFileAsTextTSP(data, schematic){
    console.log(schematic);
    jsonFile = JSON.parse(data);
    console.log(jsonFile);
    solvedJSON = {};
    output = outputTSP(jsonFile, schematic);
    if(output.errorFlag){
        throw output;
    }
    outToast({type: 'success', title: 'Success', body: 'Schematic is valid.'});

}

/**
 * This function handles the errors of the TSP module and returns a string with the error message
 * @param {object} err Error data
 * @returns 
 */
function TSP_handleError(err){
    codes = err.errorReasonCodes;
    data = err.errorData;

    errorstr = "";
    if(Array.isArray(codes))
        codes.forEach(code => {
            switch(code){
                case 1:
                    errorstr += 'There must be at least 2 power sources.';
                    break;
                default:
                    errorstr += 'Unknown error.';
                    break;
            }
        });

    return errorstr;
}

function loadFileAsTextLKM(jsonfile, schematic){
    let branches = Object.values(jsonfile.branches);
    let currents = Object.values(jsonfile.analysisObj.currents);
    let currentRefs = [];
    let originalNodes = [];
    currents.forEach(curr => {
        currentRefs.push(curr.ref);
        if(!originalNodes.includes(curr.noN))
            originalNodes.push(curr.noN);
        if(!originalNodes.includes(curr.noP))
            originalNodes.push(curr.noP);
    });
    connections = JSON.parse(JSON.stringify(schematic.connections));

    // Find source
    let source = schematic.components.find(cp => cp.type == 'Vdc' || cp.type == 'Vac' || cp.type == 'Idc' || cp.type == 'Iac');
    // Find source port 1
    let connection = connections.find(c => c.ports.find(p => p.port == 1 && p.component == source.id));
    // Find end of pseudo-branch
    let port1 = connection.ports.find(p => p.port == 1 && p.component == source.id);
    let port2 = connection.ports.find(p => p.component != source.id);

    let pbranch = [source.name.value];
    let curr = undefined;
    // Follow the pseudo-branch until it reaches the end
    while (!originalNodes.includes(connection.id)){
        connection = connections.find(c => c.ports.find(p => p.component == port2.component && p.port != port2.port));
        if(connection){
            port1 = connection.ports.find(p => p.component == port2.component && p.port != port2.port);
            port2 = connection.ports.find(p => p.component != port2.component);
            component = schematic.components.find(cp => cp.id == port1.component);
            component2 = schematic.components.find(cp => cp.id == port2.component);
            if(component2.type == "GND"){
                port2 = connection.ports.find(p => p.component != port2.component && p.component != component.id);
            }
            if (component.type == 'IProbe'){
                if(currentRefs.includes(component.name.value)){
                    curr = currents.find(c => c.ref == component.name.value);
                    if(port1.port == 1){
                        curr.equation = component.name.value + " = I";
                        curr.valueRe = 0;
                        curr.valueIm = 0;
                        curr.magnitude = 0;
                        curr.angle = 0;
                        curr.unit = "A";
                        curr.complex = false;
                        curr.direction = "+"
                    } else {
                        curr.equation = component.name.value + " = -I";
                        curr.valueRe = 0;
                        curr.valueIm = 0;
                        curr.magnitude = 0;
                        curr.angle = 0;
                        curr.unit = "A";
                        curr.complex = false;
                        curr.direction = "-"
                    }
                }
            }
            else{
                pbranch.push(component.name.value);
            }
        }
    }
    let end = connection.id;
    
    // Follow to the other end of the pseudo-branch
    connection = connections.find(c => c.ports.find(p => p.component == source.id && p.port == 0));
    port1 = connection.ports.find(p => p.component == source.id && p.port == 0);
    port2 = connection.ports.find(p => p.component != source.id);
    while (!originalNodes.includes(connection.id)){
        connection = connections.find(c => c.ports.find(p => p.component == port2.component && p.port != port2.port));
        if(connection){
            port1 = connection.ports.find(p => p.component == port2.component && p.port != port2.port);
            port2 = connection.ports.find(p => p.component != port2.component);
            component = schematic.components.find(cp => cp.id == port1.component);
            component2 = schematic.components.find(cp => cp.id == port2.component);
            if(component2.type == "GND"){
                port2 = connection.ports.find(p => p.component != port2.component && p.component != component.id);
            }
            if (component.type == 'IProbe'){
                if(currentRefs.includes(component.name.value)){
                    curr = currents.find(c => c.ref == component.name.value);
                    if(port1.port == 0){
                        curr.equation = component.name.value + " = I";
                        curr.valueRe = 0;
                        curr.valueIm = 0;
                        curr.magnitude = 0;
                        curr.angle = 0;
                        curr.unit = "A";
                        curr.complex = false;
                        curr.direction = "+"
                    } else {
                        curr.equation = component.name.value + " = -I";
                        curr.valueRe = 0;
                        curr.valueIm = 0;
                        curr.magnitude = 0;
                        curr.angle = 0;
                        curr.unit = "A";
                        curr.complex = false;
                        curr.direction = "-"
                    }
                }
            }
            else{
                pbranch.unshift(component.name.value);
            }
        }
    }
    let start = connection.id;

    if(curr != undefined){
        curr.components = pbranch;
    }
    else{
        // Find matching branch
        branches.forEach(branch => {
            let components = branch.acAmpPwSupplies.concat(branch.acVoltPwSupplies, branch.capacitors, branch.coils, branch.dcAmpPwSupplies
                , branch.dcVoltPwSupplies, branch.resistors);
            components = components.map(cp => cp.ref);
            if (components.some(value => pbranch.includes(value))){
                curr = branch.currentData.ref;
                curr = currents.find(c => c.ref == curr);
                if(curr.noP == start || curr.noN == end){
                    curr.equation = curr.ref + " = I";
                    curr.direction = "+"
                }
                else{
                    curr.equation = curr.ref + " = -I";
                    curr.direction = "-"
                }
                curr.valueRe = 0;
                curr.valueIm = 0;
                curr.magnitude = 0;
                curr.angle = 0;
                curr.unit = "A";
                curr.complex = false;
                curr.components = pbranch;
            }
        });
    }
    curr = undefined;


    // Find other pseudo-branche
    startpoint = connections.find(c => c.id == end);
    port1 = startpoint.ports.find(p => !pbranch.includes(p.component));
    component = schematic.components.find(cp => cp.id == port1.component);
    pbranch = [];
    connection = {};
    while(connection.id != start){
        connection = connections.find(c => c.ports.find(p => p.component == port1.component && p.port != port1.port));
        if(connection){
            port2 = connection.ports.find(p => p.component != port1.component);
            component2 = schematic.components.find(cp => cp.id == port2.component);
            if(component2.type == "GND"){
                port2 = connection.ports.find(p => p.component != port2.component && p.component != component.id);
            }
            if (component.type == 'IProbe'){
                if(currentRefs.includes(component.name.value)){
                    curr = currents.find(c => c.ref == component.name.value);
                    if(port1.port == 1){
                        curr.equation = component.name.value + " = I";
                        curr.valueRe = 0;
                        curr.valueIm = 0;
                        curr.magnitude = 0;
                        curr.angle = 0;
                        curr.unit = "A";
                        curr.complex = false;
                        curr.direction = "+"
                    } else {
                        curr.equation = component.name.value + " = -I";
                        curr.valueRe = 0;
                        curr.valueIm = 0;
                        curr.magnitude = 0;
                        curr.angle = 0;
                        curr.unit = "A";
                        curr.complex = false;
                        curr.direction = "-"
                    }
                }
            }
            else{
                pbranch.push(component.name.value);
            }
            connections = connections.filter(c => c != connection);
        }
        else
            connection = {};
    }
    if(curr != undefined){
        curr.components = pbranch;
    }
    else{
        // Find matching branch
        branches.forEach(branch => {
            let components = branch.acAmpPwSupplies.concat(branch.acVoltPwSupplies, branch.capacitors, branch.coils, branch.dcAmpPwSupplies
                , branch.dcVoltPwSupplies, branch.resistors);
            components = components.map(cp => cp.ref);
            if (components.some(value => pbranch.includes(value))){
                curr = branch.currentData.ref;
                curr = currents.find(c => c.ref == curr);
                if(curr.noP == startpoint.id || curr.noN == start){
                    curr.equation = curr.ref + " = I";
                    curr.direction = "+"
                }
                else{
                    curr.equation = curr.ref + " = -I";
                    curr.direction = "-"
                }
                curr.valueRe = 0;
                curr.valueIm = 0;
                curr.magnitude = 0;
                curr.angle = 0;
                curr.unit = "A";
                curr.complex = false;
                curr.components = pbranch;
            }
        });
    }
    currents = currents.filter(c => c.equation!=undefined);


    // Calculate current I
    let equations = {
        EqI: [],
        EqIresult: [],
        Req: [],
        Leq: [],
        Ceq: [],
        Xleq: [],
        Xceq: [],
        Zeq: [],
        thetaZ: [],
        thetaI: [],
    }
    switch(source.type){
        case 'Idc':
            // I = Source value
            valueRe = source.value.value;
            valueIm = 0;
            magnitude = source.value.value;
            angle = 0;
            unit = source.value.unit;
            complex = false;

            // Add current to jsonfile
            equations.EqIresult = ['I = ' + source.name.value];

            currents.forEach(curr => {
                if(curr.direction == "+"){
                    curr.valueRe = valueRe;
                    curr.valueIm = valueIm;
                    curr.magnitude = magnitude;
                    curr.angle = angle;
                    curr.value = magnitude;
                    curr.unit = unit;
                    curr.complex = false;
                } else {
                    curr.valueRe = -valueRe;
                    curr.valueIm = -valueIm;
                    curr.magnitude = magnitude;
                    curr.angle = angle +180;
                    curr.value = magnitude*-1;
                    curr.unit = unit;
                    curr.complex = false;
                }
            });
            break;
        case 'Iac':
            // I = Source value 
            magnitude = source.value.value;
            angle = source.phase.value;
            unit = source.value.unit;
            complex = true;
            valuere = magnitude*Math.cos(angle*Math.PI/180);
            valueim = magnitude*Math.sin(angle*Math.PI/180);
            
            // Add current to jsonfile
            equations.EqIresult = ['I = ' + source.name.value];

            currents.forEach(curr => {
                if(curr.direction == "+"){
                    curr.valueRe = valuere;
                    curr.valueIm = valueim;
                    curr.magnitude = magnitude;
                    curr.angle = angle;
                    curr.value = magnitude;
                    curr.unit = unit;
                    curr.complex = true;
                } else {
                    curr.valueRe = -valueRe;
                    curr.valueIm = -valueIm;
                    curr.magnitude = magnitude;
                    curr.angle = angle +180;
                    curr.value = magnitude*-1;
                    curr.unit = unit;
                    curr.complex = true;
                }
            });

            break;
        case 'Vdc':
            // Calculate impedance Zeq = Req
            impedance = 0;
            resistors = schematic.components.filter(cp => cp.type == 'R');
            equations.Req[0] = 'R_{eq} = ';
            resistors.forEach(resistor => {
                switch (resistor.value.unit){
                    case 'MOhm':
                        multiplier = 1000000;
                        break;
                    case 'kOhm':
                        multiplier = 1000;
                        break;
                    case 'Ohm':
                        multiplier = 1;
                        break;
                    case 'mOhm':
                        multiplier = 0.001;
                        break;
                    case 'uOhm':
                        multiplier = 0.000001;
                        break;
                    default:
                        multiplier = 1;
                        break;
                }
                impedance += resistor.value.value*multiplier;

                equations.Req[0] += resistor.name.value;
                if(resistor != resistors[resistors.length-1])
                    equations.Req[0] += ' + ';
                else
                    equations.Req[0] += ' = ' + impedance + '\\:Ohm';
            });
            equations.Zeq = ['Z_{eq} = R_{eq} = ' + impedance + '\\:Ohm'];
            // I = V/Z
            valueRe = source.value.value/impedance;
            valueIm = 0;
            magnitude = source.value.value/impedance;
            angle = 0;
            unit = 'A';

            // Set the appropriate unit
            valueAbs = Math.abs(magnitude);
            if (valueAbs >= 1000000){
                unit = 'MA';
                magnitude /= 1000000;
            }
            else if (valueAbs >= 1000){
                unit = 'kA';
                magnitude /= 1000;
            }
            else if (valueAbs >= 1){
                unit = 'A';
            }
            else if (valueAbs >= 0.001){
                unit = 'mA';
                magnitude *= 1000;
            }
            else if (valueAbs >= 0.000001){
                unit = 'uA';
                magnitude *= 1000000;
            }
            else{
                unit = 'A';
                magnitude = 0;
            }

            // Round total to 3 decimal places
            valueRe = Math.round(valueRe * 1000) / 1000;
            valueIm = Math.round(valueIm * 1000) / 1000;
            magnitude = Math.round(magnitude * 1000) / 1000;
            angle = Math.round(angle * 1000) / 1000;

            // Add current to jsonfile
            equations.EqIresult = ['I = \\frac{' + source.name.value + '}{Zeq}' + ' = ' + magnitude + '\\:' + unit];
            equations.EqI = ['I = \\frac{' + source.name.value + '}{Zeq}' + ' = \\frac{' + source.value.value + '}{' + impedance + '} = ' + magnitude + '\\:' + unit];

            currents.forEach(curr => {
                if(curr.direction == "+"){
                    curr.valueRe = valueRe;
                    curr.valueIm = valueIm;
                    curr.magnitude = magnitude;
                    curr.angle = angle;
                    curr.value = magnitude;
                    curr.unit = unit;
                    curr.complex = false;
                } else {
                    curr.valueRe = -valueRe;
                    curr.valueIm = -valueIm;
                    curr.magnitude = magnitude;
                    curr.angle = angle +180;
                    curr.value = magnitude*-1;
                    curr.unit = unit;
                    curr.complex = false;
                }
            });
            break;
        case 'Vac':
            // Calculate impedance
            let req = 0;
            let leq = 0;
            let ceq = 0;
            let xl = 0;
            let xc = 0;
            
            switch (source.frequency.unit){
                case 'GHz':
                    multiplier = 1000000000;
                    break;
                case 'MHz':
                    multiplier = 1000000;
                    break;
                case 'kHz':
                    multiplier = 1000;
                    break;
                case 'Hz':
                    multiplier = 1;
                    break;
                case 'mHz':
                    multiplier = 0.001;
                    break;
                case 'uHz':
                    multiplier = 0.000001;
                    break;
                case 'nHz':
                    multiplier = 0.000000001;
                    break;
                default:
                    multiplier = 1;
                    break;
            }
            let w = 2*Math.PI*source.frequency.value*multiplier;

            resistors = schematic.components.filter(cp => cp.type == 'R');
            if(resistors.length > 0){
                equations.Req[0] = 'R_{eq} = ';
                resistors.forEach(resistor => {
                    switch (resistor.value.unit){
                        case 'MOhm':
                            multiplier = 1000000;
                            break;
                        case 'kOhm':
                            multiplier = 1000;
                            break;
                        case 'Ohm':
                            multiplier = 1;
                            break;
                        case 'mOhm':
                            multiplier = 0.001;
                            break;
                        case 'uOhm':
                            multiplier = 0.000001;
                            break;
                        default:
                            multiplier = 1;
                            break;
                    }
                    req += resistor.value.value*multiplier;

                    equations.Req[0] += resistor.name.value;
                    if(resistor != resistors[resistors.length-1])
                        equations.Req[0] += ' + ';
                    else{
                        // Round total to 3 decimal places
                        req = Math.round(req * 1000) / 1000;
                        equations.Req[0] += ' = ' + req + '\\:Ohm';
                    }
                });
            }

            capacitors = schematic.components.filter(cp => cp.type == 'C');
            if(capacitors.length > 0){
                equations.Ceq[0] = 'C_{eq} = 1/(';
                capacitors.forEach(capacitor => {
                    switch (capacitor.value.unit){
                        case 'MF':
                            multiplier = 1000000;
                            break;
                        case 'kF':
                            multiplier = 1000;
                            break;
                        case 'F':
                            multiplier = 1;
                            break;
                        case 'mF':
                            multiplier = 0.001;
                            break;
                        case 'uF':
                            multiplier = 0.000001;
                            break;
                        case 'nF':
                            multiplier = 0.000000001;
                            break;
                        case 'pF':
                            multiplier = 0.000000000001;
                            break;
                        default:
                            multiplier = 1;
                            break;
                    }

                    ceq += 1/(capacitor.value.value*multiplier);
            
                    equations.Ceq[0] += '\\frac{1}{' + capacitor.name.value + '}';
                    if(capacitor != capacitors[capacitors.length-1])
                        equations.Ceq[0] += ' + ';
                    else {
                        ceq = 1/ceq;
                        equations.Ceq[0] += ') = ' + ceq + '\\:F';
                    }
                });
                xc = 1/(w*ceq);
                // Set the appropriate unit
                let xcAbs = Math.abs(xc);
                multiplier = 1;
                if (xcAbs >= 1000000){
                    unit = 'MOhm';
                    multiplier /= 1000000;
                }
                else if (xcAbs >= 1000){
                    unit = 'kOhm';
                    multiplier /= 1000;
                }
                else if (xcAbs >= 1){
                    unit = 'Ohm';
                }
                else if (xcAbs >= 0.001){
                    unit = 'mOhm';
                    multiplier *= 1000;
                }
                else if (xcAbs >= 0.000001){
                    unit = 'uOhm';
                    multiplier *= 1000000;
                }
                else{
                    unit = 'Ohm';
                }

                // Round total to 3 decimal places
                xc = Math.round(xc * 1000) / 1000;

                equations.Xceq = ['X_{C} = \\frac{1}{\\omega C_{eq}} = ' + xc*multiplier + '\\:' + unit];
            }
            coils = schematic.components.filter(cp => cp.type == 'L');
            if(coils.length > 0){
                equations.Leq[0] = 'L_{eq} = ';
                coils.forEach(coil => {
                    switch (coil.value.unit){
                        case 'MH':
                            multiplier = 1000000;
                            break;
                        case 'kH':
                            multiplier = 1000;
                            break;
                        case 'H':
                            multiplier = 1;
                            break;
                        case 'mH':
                            multiplier = 0.001;
                            break;
                        case 'uH':
                            multiplier = 0.000001;
                            break;
                        case 'nH':
                            multiplier = 0.000000001;
                            break;
                        case 'pH':
                            multiplier = 0.000000000001;
                            break;
                        default:
                            multiplier = 1;
                            break;
                    }
                    leq += coil.value.value*multiplier;

                    equations.Leq[0] += coil.name.value;
                    if(coil != coils[coils.length-1])
                        equations.Leq[0] += ' + ';
                    else{
                        equations.Leq[0] += ' = ' + leq + '\\:H';
                    }
                });
                xl = w*leq;
                // Set the appropriate unit
                let xlAbs = Math.abs(xl);
                multiplier = 1;
                if (xlAbs >= 1000000){
                    unit = 'MOhm';
                    multiplier /= 1000000;
                }
                else if (xlAbs >= 1000){
                    unit = 'kOhm';
                    multiplier /= 1000;
                }
                else if (xlAbs >= 1){
                    unit = 'Ohm';
                }
                else if (xlAbs >= 0.001){
                    unit = 'mOhm';
                    multiplier *= 1000;
                }
                else if (xlAbs >= 0.000001){
                    unit = 'uOhm';
                    multiplier *= 1000000;
                }
                else{
                    unit = 'Ohm';
                }

                // Round total to 3 decimal places
                xl = Math.round(xl * 1000) / 1000;
                equations.Xleq = ['X_{L} = \\omega L_{eq} = ' + xl*multiplier + '\\:'+ unit];
            }
            zeq = Math.sqrt(Math.pow(req, 2) + Math.pow(xl - xc, 2));
            // Set the appropriate unit
            let zeqAbs = Math.abs(zeq);
            multiplier = 1;
            if (zeqAbs >= 1000000){
                unit = 'MOhm';
                multiplier /= 1000000;
            }
            else if (zeqAbs >= 1000){
                unit = 'kOhm';
                multiplier /= 1000;
            }
            else if (zeqAbs >= 1){
                unit = 'Ohm';
            }
            else if (zeqAbs >= 0.001){
                unit = 'mOhm';
                multiplier *= 1000;
            }
            else if (zeqAbs >= 0.000001){
                unit = 'uOhm';
                multiplier *= 1000000;
            }
            else{
                unit = 'Ohm';
            }

            // Round total to 3 decimal places
            zeq = Math.round(zeq * 1000) / 1000;

            equations.Zeq = ['Z_{eq} = \\sqrt{R_{eq}^2 + (X_{L} - X_{C})^2} = ' + zeq*multiplier + '\\:' + unit];
            thetaZ = Math.atan2((xl - xc),req)*180/Math.PI;
            // Round total to 3 decimal places
            thetaZ = Math.round(thetaZ * 1000) / 1000;
            equations.thetaZ = ['\\theta_{Z} = \\arctan{\\frac{X_{L} - X_{C}}{R_{eq}}} = ' + thetaZ + '\\:rad'];

            // I = V/Z
            magnitude = source.value.value/zeq;
            angle = Math.atan2(xl - xc,req)*180/Math.PI;
            if(xl - xc < 0)
                angle *= -1;
            valueRe = magnitude*Math.cos(angle*Math.PI/180);
            valueIm = magnitude*Math.sin(angle*Math.PI/180);

            // Set the appropriate unit
            valueAbs = Math.abs(magnitude);
            if(valueAbs >= 1000000){
                unit = 'MA';
                magnitude /= 1000000;
                valueRe /= 1000000;
                valueIm /= 1000000;
            } else if (valueAbs >= 1000){
                unit = 'kA';
                magnitude /= 1000;
                valueRe /= 1000;
                valueIm /= 1000;
            } else if (valueAbs >= 1){
                unit = 'A';
            } else if (valueAbs >= 0.001){
                unit = 'mA';
                magnitude *= 1000;
                valueRe *= 1000;
                valueIm *= 1000;
            } else if (valueAbs >= 0.000001){
                unit = 'uA';
                magnitude *= 1000000;
                valueRe *= 1000000;
                valueIm *= 1000000;
            } else{
                unit = 'A';
                magnitude = 0;
                valueRe = 0;
                valueIm = 0;
            }

            // Set the appropriate unit
            let reAbs = Math.abs(valueRe);

            // Round total to 3 decimal places
            valueRe = Math.round(valueRe * 1000) / 1000;
            valueIm = Math.round(valueIm * 1000) / 1000;
            magnitude = Math.round(magnitude * 1000) / 1000;
            angle = Math.round(angle * 1000) / 1000;

            // Add current to jsonfile
            equations.EqI = ['I = \\frac{' + source.name.value + '}{Z_{eq}}' + ' = \\frac{' + source.value.value + '}{' + zeq + '} = ' + magnitude + '\\:' + unit];
            equations.EqIresult = ['I = \\frac{' + source.name.value + '}{Z_{eq}}' + ' = ' + magnitude + '\\angle' + angle + '^{\\circ}\\:' + unit];
            equations.thetaI = ['\\theta_{I} = \\arctan{\\frac{X_{L} - X_{C}}{R_{eq}}} = ' + angle + '^{\\circ}'];

            currents.forEach(curr => {
                if(curr.direction == "+"){
                    curr.valueRe = valueRe;
                    curr.valueIm = valueIm;
                    curr.magnitude = magnitude;
                    curr.angle = angle;
                    curr.value = magnitude;
                    curr.unit = unit;
                    curr.complex = true;
                } else {
                    curr.valueRe = -valueRe;
                    curr.valueIm = -valueIm;
                    curr.magnitude = magnitude;
                    curr.angle = angle +180;
                    curr.value = magnitude*-1;
                    curr.unit = unit;
                    curr.complex = true;
                }
            });

            break;
    }
    // Add currents to jsonfile
    currents.forEach(curr => {
        delete curr.direction;
    });
    jsonfile.analysisObj.currents = currents;
    
    // Add equations to jsonfile
    jsonfile.analysisObj.equations = equations;
    return jsonfile;
}