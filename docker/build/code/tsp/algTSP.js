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
    index = 0;
    // Remove voltage power sources
    vectDcVoltPower.concat(vectAcVoltPower, vectDcCurrPower, vectAcCurrPower).forEach(cp => {
        if(cp.id !== source)
        {
            // Remove the component from the vector
            vectComponents = vectComponents.filter(c => c.id != cp.id);

            // If the component has impedance, switch for the internal resistance
            if(cp.properties.impedance.value !== '0')
            {
                id = 'Ri'+index;
                index++;

                caracteristics = [                      //Caracteristics:
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

                ports = getPorts(caracteristics);

                new Resistor(id, caracteristics, ports);
            }
            // If the impedance is 0, and it's a voltage source, switch for a short circuit
            else if (['Vac', 'Vdc'].includes(cp.type))
            {
                id = 'CC'+index;
                index++;
                caracteristics = [                      //Caracteristics:
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

                new Wire(id, caracteristics);
            }
            // If the impedance is 0, and it's a current source, switch for an open circuit
            // It has already been removed
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
    var subSchematic = new Schematic(schematic.qucs_version, schematic.properties.view, schematic.properties.grid);
    
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
            object: subSchematic
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
        fourth: netlistTxt.fourth
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
      const method = o[1];
      let generateSection = false;
  
      const page = $('#resolution-' + cp.name.value);
      const tab = $('.resolution-item a[href="#resolution-' + cp.name.value + '"]').parent();
  
      // Check if the page was already generated
      if (!tab.hasClass('solved')) {
        generateSection = true;
      } else {
        // If the tab is on the wrong position, move it
        if (tab.index() -1 !== order.indexOf(o)) {
            tab.insertAfter($('.resolution-item').eq(order.indexOf(o)));

            // Change progress bar
            var progress = page.find('.progress-bar');
            percent = (order.indexOf(o) + 1) * 100 / order.length;
            progress.css('width', percent + '%');
            progress.attr('aria-valuenow', percent);
            if(percent == 100)
                progress.removeClass('progress-bar-animated').addClass('bg-success');
            else
                progress.removeClass('bg-success').addClass('progress-bar-animated');
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
                page.html(outHTMLSectionsMCM_TSP(cp));
                
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
                solvedJSON[cp.name.value] = {file: jsonFile, method: 'MCM'};
                break;
            case 'MCR':
                // Solve with MCR
                jsonFile = loadFileAsTextMCR(jsonFile.third, false);

                // Add sections
                page.html(outHTMLSectionsMCR_TSP(cp));

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
                solvedJSON[cp.name.value] = {file: jsonFile, method: 'MCR'};
                break;
            default:
                alert('Método de resolução não reconhecido.');
                break;
        }

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

        // Change progress bar
        var progress = page.find('.progress-bar');
        percent = (order.indexOf(o) + 1) * 100 / order.length;
        progress.css('width', percent + '%');
        progress.attr('aria-valuenow', percent);
        if(percent == 100)
            progress.removeClass('progress-bar-animated').addClass('bg-success');
        else
            progress.removeClass('bg-success').addClass('progress-bar-animated');

        // Draw subcircuit on first time showing the tab
        tab.find('a').on('shown.bs.tab', function(e, order, o) {
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
                        let valueAbs = Math.abs(curr.valueRe);
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
                        let valueAbs = Math.abs(curr.magnitude);
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

                        console.log(obj.valueRe + ' ' + obj.valueIm + 'j' + ' ' + obj.unit);
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
                            equation += ' (' + contribution.value + contribution.unit + ') + ';
                        else
                            equation += contribution.value + contribution.unit + ' + ';
                        first = false;
                    }
                    else if (curr.noP == contribution.end || curr.noN == contribution.start){
                        totalre -= value;
                        if (value < 0 && !first)
                            equation += ' (' + contribution.value*-1 + contribution.unit + ') + ';
                        else
                            equation += contribution.value*-1 + contribution.unit + ' + ';
                        first = false;
                    }
                } else {
                    let valuere = contribution.valueRe * unitMultiplier;
                    let valueim = contribution.valueIm * unitMultiplier;
                    if (curr.noP == contribution.start || curr.noN == contribution.end){
                        totalre += valuere;
                        totalim += valueim;
                        equation += contribution.magnitude + '\\angle' + contribution.angle + '^{\\circ}' + contribution.unit + ' + ';
                        first = false;
                    }
                    else if (curr.noP == contribution.end || curr.noN == contribution.start){
                        totalre -= valuere;
                        totalim -= valueim;
                        if(!first)
                            equation += ' (' + contribution.magnitude*-1 + '\\angle' + contribution.angle + '^{\\circ}' + contribution.unit + ') + ';
                        else
                            equation += contribution.magnitude*-1 + '\\angle' + contribution.angle + '^{\\circ}' + contribution.unit + ' + ';
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
        data: { solvedJSON: mainJsonFile}
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
                });
            });
        } else {
            // Passive mode
            vectSources.forEach(cp => {
                cpDiv = $('#circuitImage .drawing').find('.'+cp.id);
                cpDiv.removeClass('order-selectable');
                cpDiv.removeClass('order-selected');
                cpDiv.off('click');
            });
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