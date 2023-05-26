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

    // DEBUG
    console.log(subSchematic);

    return {
        errorFlag: false,
        errorReasonCodes: [],
        data: {
            tree: JSON.stringify(subSchematic),
            object: subSchematic
        }
    }
}

function outputTSP(jsonFile, schematic){
    // Get sources and probes
    sourceTypes = ['Vdc', 'Vac', 'Idc', 'Iac'];
    vectSources = vectDcVoltPower.concat(vectAcVoltPower, vectDcCurrPower, vectAcCurrPower);
    vectProbes = vectVProbe.concat(vectIProbe);
    methods = ['MTN', 'MCR', 'MCM'];

    // Add navigation tabs
    $('#results-board').html(outHTMLResolutionNavTSP());

    // Add sections to main tab
	$('#main-tab').html(outHTMLSectionsTSP());

    // Populate warnings section (if any)

    // Add circuit drawing
    var mainCircuit = $('#circuitImage .circuit-widget');
    cropWindow(schematic);
    var mainDrawing = redrawSchematic(schematic, mainCircuit);

    // Populate selection section
    $('#selection-body').html(outHTMLSelectionTSP());


    // Turn the viz. on
	$("#contResults").show();
	$("#loadpage").fadeOut(1000);
    $("#results").show();
	$('#results-modal').modal('show');


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
                        card = $(`<li class="card"></li>`);
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
        $('.resolution-item').remove();
        $('.resolution-pages-content').remove();
        $('#results-tabs').append(outHTMLResolutionTabsTSP(resolutionOrder));
        $('#pages-content').append(outHTMLResolutionTabsContentTSP(resolutionOrder));
        // Calculate
        //calculateTSP(schematic, modal, resolutionOrder);
        // Update table

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