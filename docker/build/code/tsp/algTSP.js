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

function schematicToJsonFile(schematic) {
    // Schematic to Netlist
    netlist = makeNetlist(subcircuit.data.object);

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
 * @param {Array<Component, string>} order The resolution order
 */
function solveTSP(schematic, order) {
    tabs = $('#results-tabs');
    pages = $('#pages-content');
    subcircuits = new Array();
  
    order.forEach(o => {
        const cp = o[0];
        const method = o[1];

        subcircuit = makeSubcircuit(schematic, cp.id);

        if(subcircuit.errorFlag) {
            alert('Erro ao gerar o subcircuito.');
            return;
        }
    
        subcircuits.push({subcircuit: subcircuit.data.object, cp: cp.name.value});
    });

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
        }

        // Check if the method is the same
        if(page.attr('method') !== method) {
            generateSection = true;
        }
      }
  
      if (generateSection) {
        page.attr('method', method);

        jsonFile = schematicToJsonFile(subcircuits.find(s => s.cp == cp.name.value).subcircuit);

        // Initialize variables
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

        // Draw subcircuit on first time showing the tab
        tab.find('a').on('shown.bs.tab', function(e) {
            drawingContainer = page.find('.circuit-widget');
            if(drawingContainer.children().length === 0)
            {
                drawing = redrawSchematic(subcircuits.find(s => s.cp === cp.name.value).subcircuit, drawingContainer, true, false);
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

        // Change progress bar
        var progress = page.find('.progress-bar');
        percent = (order.indexOf(o) + 1) * 100 / order.length;
        progress.css('width', percent + '%');
        progress.attr('aria-valuenow', percent);
        if(percent == 100)
            progress.removeClass('progress-bar-animated').addClass('bg-success');
        else
            progress.addClass('progress-bar-animated').removeClass('bg-success');
    });
  }

function outputTSP(jsonFile, schematic){
    // Get sources and probes
    sourceTypes = ['Vdc', 'Vac', 'Idc', 'Iac'];
    vectSources = vectDcVoltPower.concat(vectAcVoltPower, vectDcCurrPower, vectAcCurrPower);
    vectProbes = vectVProbe.concat(vectIProbe);
    //methods = ['MTN', 'MCR', 'MCM'];
    methods = ['MCR', 'MCM'];
    //methods = ['MCM'];

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
                alert("Please select all sources");
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
        // Add resolution sections
        $('#results-tabs').append(outHTMLResolutionTabsTSP(resolutionOrder));
        $('#pages-content').append(outHTMLResolutionTabsContentTSP(resolutionOrder));
        $('#loadpage').fadeIn(1000);
        // Calculate
        solveTSP(schematic, resolutionOrder);
        // Update table


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
}

function loadFileAsTextTSP(data, schematic){
    jsonFile = JSON.parse(data);
    console.log(jsonFile);

    outputTSP(jsonFile, schematic);
}