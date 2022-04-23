

/**
 * Count Nodes By Type (0 = Real, 1 - Virtual)
 * @param {Array} objArr Array of Nodes objects
 * @param {Int} type Desired type of node to return
 * @returns Number of Nodes
 */


//global variables


	// Math namespaces/prototypes
	var Fraction = algebra.Fraction;
	var Expression = algebra.Expression;
	var Equation = algebra.Equation;

	// Create arrays to store objects data
	var resistors = new Array();
	var coils = new Array();
	var capacitors = new Array();
	var dcVoltPs = new Array();
	var acVoltPs = new Array();
	var dcAmpsPs = new Array();
	var acAmpsPs = new Array();
	var ampsMeters = new Array();
	var voltMeters = new Array();

	var nodes = new Array();
	var branches = new Array();
	var currents = new Array();
	var connections = new Array();

	// Circuit analysis counters
	var circuitAnalCnt = {
		node: 		0,
		branch: 	0,
		current:	0
	};

	// Circuit analysis global data
	var circuitAnalData = {
		frequency:	{value: 0, mult: ''}
	};

	//Manage ampmeters
	var iProbeNodesLoc = new Array();
	var iProbeNodesArr = new Array();
	var iProbeLocVsAmpId = new Array();	// Store iProbe position related to Amperemeter Id

	var iProbNodesLocFilled;
	var iProbeNodesArrFilled;

/*
ERROR LIST

1 - Não foi inserida uma netlist
2 - Erro Netlist
3 - Erro a procurar malhas
3 - Erro a construir equações

*/
	
function countNodesByType(objArr, type) {
	let cnt = 0;
	for(let i=0; i<objArr.length; i++) { if(objArr[i].type == type) cnt++;}
	return cnt;
}


//Carrega o ficheiro, valida a netlist
function loadFile(){
	// Caso não tenha sido inserida uma Netlist
	if (!fileContents[1]) {
		return{
			first: true,
			second: 1,
			third: "Submit netlist first!!"
		};
	}

	// Print sections
	document.getElementById('results-board').innerHTML = outHTMLSections();

	// Validate submitted Netlist File
	var netlistTxt = validateNetlist(fileContents[1]);
	// Check for previous ground alteration
	if(fileContents[2])
		netlistTxt.first.push(fileContents[2]);
	// Deal With Netlist Error Codes
	let warningsText
	$('#errors').hide();
	$('#warnings').hide();
	if(netlistTxt.first.length > 0) {
		if(foundCriticalErr(netlistTxt.first)){
			$("#loadpage").fadeOut(1000);
			$("#results").show();
			$("#contResults").hide();
			$('#warnings').hide();
			$('#results-modal').modal('show');
			$('#errors').html(errorOutput(netlistTxt.first));
			$('#errors').show();
			let language = document.getElementById("lang-sel-txt").innerText.toLowerCase();
			if(language == "english")
				set_lang(dictionary.english);
			else	
				set_lang(dictionary.portuguese);
				return{
					first: true,
					second: 2,
					third: "Error"
				};	
		}
		else{
			warningsText = warningOutput(netlistTxt.first);
			if(warningsText != 0){
				$('#warnings').html(warningsText);
				$('#errors').hide();
				$('#warnings').show();
			}
		}
	}
	// Remove codigo de erro 14
	if(fileContents[2]) netlistTxt.first.splice(netlistTxt.first.length-1);
	return{
		first: false,
		second: 0,
		third: netlistTxt
	};
}
//Importa os dados do ficheiro para varáveis do script
function importData(netlistTxt){
	var netListLines = netlistTxt.second;

	var netListLineCnt = {
		Vdc: 	0,
		Idc: 	0,
		Vac: 	0,
		Iac:	0,
		R:		0,
		L:		0,
		C:		0,
		Vprob: 	0,
		Iprob:  0,
	};

	// Import data to local variables
    for(var line = 0; line < netListLines.length; line++){
		var cpData = acquireCpData(netListLines[line], netListLineCnt);

		if(cpData.third){
			connections.push(cpData.third);
		}

		if(!cpData.first) {
			switch (cpData.second.type) {
				case cpRefTest("Vdc"): {
					var newDcVoltPs = new dcVoltPower(cpData.second.id, cpData.second.ref, cpData.second.noP, cpData.second.noN, cpData.second.type, cpData.second.value, cpData.second.unitMult, cpData.second.intRes, cpData.second.intResMult, null, null, null);
					dcVoltPs.push(newDcVoltPs);
					break;
				}

				case cpRefTest("Idc"): {
					var newDcAmpsPs = new dcCurrPower(cpData.second.id, cpData.second.ref, cpData.second.noP, cpData.second.noN, cpData.second.type, cpData.second.value, cpData.second.unitMult, cpData.second.intRes, cpData.second.intResMult, null, null, null, null, null);
					dcAmpsPs.push(newDcAmpsPs);
					break;
				}

				case cpRefTest("Vac"): {
					circuitAnalData.frequency.value = cpData.second.freq;
					circuitAnalData.frequency.mult = cpData.second.freqMult;
					var newAcVoltPs = new acVoltPower(cpData.second.id, cpData.second.ref, cpData.second.noP, cpData.second.noN, cpData.second.type, cpData.second.value, cpData.second.unitMult, cpData.second.intRes, cpData.second.intResMult, cpData.second.freq, cpData.second.freqMult, cpData.second.phase, cpData.second.theta, null, null, null);
					acVoltPs.push(newAcVoltPs);
					break;
				}

				case cpRefTest("Iac"): {
					circuitAnalData.frequency.value = cpData.second.freq;
					circuitAnalData.frequency.mult = cpData.second.freqMult;
					var newAcAmpsPs = new acCurrPower(cpData.second.id, cpData.second.ref, cpData.second.noP, cpData.second.noN, cpData.second.type, cpData.second.value, cpData.second.unitMult, cpData.second.intRes, cpData.second.intResMult, cpData.second.freq, cpData.second.freqMult, cpData.second.phase, cpData.second.theta, null, null, null);
					acAmpsPs.push(newAcAmpsPs);
					break;
				}

				case cpRefTest("R"): {
					var newResistor = new resistor(cpData.second.id, cpData.second.ref, cpData.second.noP, cpData.second.noN, cpData.second.type, cpData.second.value, cpData.second.unitMult, cpData.second.temp, null, null);
					resistors.push(newResistor);
					break;
				}

				case cpRefTest("L"): {
					var newCoil = new coil(cpData.second.id, cpData.second.ref, cpData.second.noP, cpData.second.noN, cpData.second.type, cpData.second.value, cpData.second.unitMult, cpData.second.initValue, null, null, null);
					coils.push(newCoil);
					break;
				}

				case cpRefTest("C"): {
					var newCapacitor = new capacitor(cpData.second.id, cpData.second.ref, cpData.second.noP, cpData.second.noN, cpData.second.type, cpData.second.value, cpData.second.unitMult, cpData.second.initValue, null, null, null);
					capacitors.push(newCapacitor);
					break;
				}

				case cpRefTest("VProbe"): {
					var newVoltMeter = new voltmeter(cpData.second.id, cpData.second.ref, cpData.second.noP, cpData.second.noN, cpData.second.type, cpData.second.intRes, cpData.second.intResMult, null, null);
					voltMeters.push(newVoltMeter);
					break;
				}

				case cpRefTest("IProbe"): {
					var newAmpsMeter = new amperemeter(cpData.second.id, cpData.second.ref, cpData.second.noP, cpData.second.noN, cpData.second.type, cpData.second.intRes, cpData.second.intResMult, null, null);
					ampsMeters.push(newAmpsMeter);
					break;
				}

				default: {

					break;
				}
			}
		}
	}

	// Verify and set circuit frequency
	let errCodeIndex = netlistTxt.first.findIndex(item => item.errorCode == 10);
	if(errCodeIndex > -1){
		circuitAnalData.frequency.value = netlistTxt.first[errCodeIndex].chosenFreq;
		circuitAnalData.frequency.mult = netlistTxt.first[errCodeIndex].chosenFreqUnit;
	}
	else{
		for(var line = 0; line < netListLines.length; line++){
			var cpData = acquireCpData(netListLines[line], netListLineCnt);

			if(!cpData.first) {
				if(cpData.second.value != null && cpData.second.type === 'acFreq') {
					circuitAnalData.frequency.value = cpData.second.value;
					circuitAnalData.frequency.mult = cpData.second.mult;
				}
			}
		}
	}
}
//Guarda a posição do amperímetro e o componente em série com ele
function manageAmpmeters(){
	for(var i=0; i<ampsMeters.length; i++) {
		var newNodes = ampsMeters[i].getNodes();

		var found = iProbeNodesLoc.find(element => element == newNodes);
		if (typeof found == 'undefined') {
			iProbeNodesLoc.push(newNodes);
			// Save location of the amperemeter in the iProbeNodesLoc and next series connected component Reference
			iProbeLocVsAmpId.push({iProbLocPos: (iProbeNodesLoc.length-1), ampId: ampsMeters[i].id, ampRef: ampsMeters[i].ref, serieConCpRef: '', branchId: '', jointNodeP: '', jointNodeN: ''});
		}

		found = iProbeNodesArr.find(element => element == newNodes.fromNode);
		if (typeof found == 'undefined') iProbeNodesArr.push(newNodes.fromNode);

		found = iProbeNodesArr.find(element => element == newNodes.toNode);
		if (typeof found == 'undefined') iProbeNodesArr.push(newNodes.toNode);
	}

	// Get a copy of ammeters reference and location
	iProbNodesLocFilled = iProbeNodesLoc.slice();
	iProbeNodesArrFilled = iProbeNodesArr.slice();

}
//Encontra o nr e o tipo de nós (real ou virtual)
function findNodes(){

	//find nodes
	var foundNodes = new Array();

	for(var i=0; i<resistors.length; i++) {
		var newNodes = resistors[i].getNodes();
		var found = 0;

		var pos = newNodes.fromNode.search('_net');
        if(pos > -1 ) {
			// Verify Amperemeter Nodes
			found = iProbeNodesArr.find(element => element == newNodes.fromNode);
			// If was found in the general array, do the change
			if (typeof found != 'undefined') {
				var found2 = iProbeNodesLoc.find(element => element.fromNode == found);
				if (typeof found2 != 'undefined') {
					// First in the fromNode
					newNodes.fromNode = found2.toNode;
					if(resistors[i].noN == found) resistors[i].noN = found2.toNode;
					if(resistors[i].noP == found) resistors[i].noP = found2.toNode;

					// Save component Ref in iProbeLocVsAmpId
					var index = iProbNodesLocFilled.indexOf(found2);
					const locIndex = iProbeLocVsAmpId.findIndex(item => item.iProbLocPos == index);
					iProbeLocVsAmpId[locIndex].serieConCpRef = resistors[i].ref;

					// Clear pending amperemeter nodes
					index = iProbeNodesArr.indexOf(found);
					if (index > -1) { iProbeNodesArr.splice(index, 1); }

					// Clear pending amperemeter nodes location
					index = iProbeNodesLoc.indexOf(found2);
					if (index > -1) { iProbeNodesLoc.splice(index, 1); }
				}
				found2 = iProbeNodesLoc.find(element => element.toNode == found);
				if (typeof found2 != 'undefined') {
					// First in the fromNode
					newNodes.fromNode = found2.fromNode;
					if(resistors[i].noN == found) resistors[i].noN = found2.fromNode;
					if(resistors[i].noP == found) resistors[i].noP = found2.fromNode;

					// Save component Ref in iProbeLocVsAmpId
					var index = iProbNodesLocFilled.indexOf(found2);
					const locIndex = iProbeLocVsAmpId.findIndex(item => item.iProbLocPos == index);
					iProbeLocVsAmpId[locIndex].serieConCpRef = resistors[i].ref;

					// Clear pending amperemeter nodes
					index = iProbeNodesArr.indexOf(found);
					if (index > -1) { iProbeNodesArr.splice(index, 1); }

					// Clear pending amperemeter nodes location
					index = iProbeNodesLoc.indexOf(found2);
					if (index > -1) { iProbeNodesLoc.splice(index, 1); }
				}
			}
		}

		var pos = newNodes.toNode.search('_net');
        if(pos > -1 ) {
			found = iProbeNodesArr.find(element => element == newNodes.toNode);
			// If was found in the general array, do the change
			if (typeof found != 'undefined') {
				var found2 = iProbeNodesLoc.find(element => element.fromNode == found);
				if (typeof found2 != 'undefined') {
					// First in the fromNode
					newNodes.toNode = found2.toNode;
					if(resistors[i].noN == found) resistors[i].noN = found2.toNode;
					if(resistors[i].noP == found) resistors[i].noP = found2.toNode;

					// Save component Ref in iProbeLocVsAmpId
					var index = iProbNodesLocFilled.indexOf(found2);
					const locIndex = iProbeLocVsAmpId.findIndex(item => item.iProbLocPos == index);
					iProbeLocVsAmpId[locIndex].serieConCpRef = resistors[i].ref;

					// Clear pending amperemeter nodes
					index = iProbeNodesArr.indexOf(found);
					if (index > -1) { iProbeNodesArr.splice(index, 1); }

					// Clear pending amperemeter nodes location
					index = iProbeNodesLoc.indexOf(found2);
					if (index > -1) { iProbeNodesLoc.splice(index, 1); }
				}
				found2 = iProbeNodesLoc.find(element => element.toNode == found);
				if (typeof found2 != 'undefined') {
					// First in the fromNode
					newNodes.toNode = found2.fromNode;
					if(resistors[i].noN == found) resistors[i].noN = found2.fromNode;
					if(resistors[i].noP == found) resistors[i].noP = found2.fromNode;

					// Save component Ref in iProbeLocVsAmpId
					var index = iProbNodesLocFilled.indexOf(found2);
					const locIndex = iProbeLocVsAmpId.findIndex(item => item.iProbLocPos == index);
					iProbeLocVsAmpId[locIndex].serieConCpRef = resistors[i].ref;

					// Clear pending amperemeter nodes
					index = iProbeNodesArr.indexOf(found);
					if (index > -1) { iProbeNodesArr.splice(index, 1); }

					// Clear pending amperemeter nodes location
					index = iProbeNodesLoc.indexOf(found2);
					if (index > -1) { iProbeNodesLoc.splice(index, 1); }
				}
			}
		}

		found = foundNodes.find(element => element == newNodes.fromNode);
		if (typeof found == 'undefined') foundNodes.push(newNodes.fromNode);

		found = foundNodes.find(element => element == newNodes.toNode);
		if (typeof found == 'undefined') foundNodes.push(newNodes.toNode);
	}

	for(var i=0; i<coils.length; i++) {
		var newNodes = coils[i].getNodes();

		var pos = newNodes.fromNode.search('_net');
        if(pos > -1 ) {
			// Verify Amperemeter Nodes
			found = iProbeNodesArr.find(element => element == newNodes.fromNode);
			// If was found in the general array, do the change
			if (typeof found != 'undefined') {
				var found2 = iProbeNodesLoc.find(element => element.fromNode == found);
				if (typeof found2 != 'undefined') {
					// First in the fromNode
					newNodes.fromNode = found2.toNode;
					if(coils[i].noN == found) coils[i].noN = found2.toNode;
					if(coils[i].noP == found) coils[i].noP = found2.toNode;

					// Save component Ref in iProbeLocVsAmpId
					var index = iProbNodesLocFilled.indexOf(found2);
					const locIndex = iProbeLocVsAmpId.findIndex(item => item.iProbLocPos == index);
					iProbeLocVsAmpId[locIndex].serieConCpRef = coils[i].ref;

					// Clear pending amperemeter nodes
					index = iProbeNodesArr.indexOf(found);
					if (index > -1) { iProbeNodesArr.splice(index, 1); }

					// Clear pending amperemeter nodes location
					index = iProbeNodesLoc.indexOf(found2);
					if (index > -1) { iProbeNodesLoc.splice(index, 1); }
				}
				found2 = iProbeNodesLoc.find(element => element.toNode == found);
				if (typeof found2 != 'undefined') {
					// First in the fromNode
					newNodes.fromNode = found2.fromNode;
					if(coils[i].noN == found) coils[i].noN = found2.fromNode;
					if(coils[i].noP == found) coils[i].noP = found2.fromNode;

					// Save component Ref in iProbeLocVsAmpId
					var index = iProbNodesLocFilled.indexOf(found2);
					const locIndex = iProbeLocVsAmpId.findIndex(item => item.iProbLocPos == index);
					iProbeLocVsAmpId[locIndex].serieConCpRef = coils[i].ref;

					// Clear pending amperemeter nodes
					index = iProbeNodesArr.indexOf(found);
					if (index > -1) { iProbeNodesArr.splice(index, 1); }

					// Clear pending amperemeter nodes location
					index = iProbeNodesLoc.indexOf(found2);
					if (index > -1) { iProbeNodesLoc.splice(index, 1); }
				}
			}
		}

		var pos = newNodes.toNode.search('_net');
        if(pos > -1 ) {
			found = iProbeNodesArr.find(element => element == newNodes.toNode);
			// If was found in the general array, do the change
			if (typeof found != 'undefined') {
				var found2 = iProbeNodesLoc.find(element => element.fromNode == found);
				if (typeof found2 != 'undefined') {
					// First in the fromNode
					newNodes.toNode = found2.toNode;
					if(coils[i].noN == found) coils[i].noN = found2.toNode;
					if(coils[i].noP == found) coils[i].noP = found2.toNode;

					// Save component Ref in iProbeLocVsAmpId
					var index = iProbNodesLocFilled.indexOf(found2);
					const locIndex = iProbeLocVsAmpId.findIndex(item => item.iProbLocPos == index);
					iProbeLocVsAmpId[locIndex].serieConCpRef = coils[i].ref;

					// Clear pending amperemeter nodes
					index = iProbeNodesArr.indexOf(found);
					if (index > -1) { iProbeNodesArr.splice(index, 1); }

					// Clear pending amperemeter nodes location
					index = iProbeNodesLoc.indexOf(found2);
					if (index > -1) { iProbeNodesLoc.splice(index, 1); }
				}
				found2 = iProbeNodesLoc.find(element => element.toNode == found);
				if (typeof found2 != 'undefined') {
					// First in the fromNode
					newNodes.toNode = found2.fromNode;
					if(coils[i].noN == found) coils[i].noN = found2.fromNode;
					if(coils[i].noP == found) coils[i].noP = found2.fromNode;

					// Save component Ref in iProbeLocVsAmpId
					var index = iProbNodesLocFilled.indexOf(found2);
					const locIndex = iProbeLocVsAmpId.findIndex(item => item.iProbLocPos == index);
					iProbeLocVsAmpId[locIndex].serieConCpRef = coils[i].ref;

					// Clear pending amperemeter nodes
					index = iProbeNodesArr.indexOf(found);
					if (index > -1) { iProbeNodesArr.splice(index, 1); }

					// Clear pending amperemeter nodes location
					index = iProbeNodesLoc.indexOf(found2);
					if (index > -1) { iProbeNodesLoc.splice(index, 1); }
				}
			}
		}

		var found = foundNodes.find(element => element == newNodes.fromNode);
		if (typeof found == 'undefined') foundNodes.push(newNodes.fromNode);

		var found = foundNodes.find(element => element == newNodes.toNode);
		if (typeof found == 'undefined') foundNodes.push(newNodes.toNode);

	}

	for(var i=0; i<capacitors.length; i++) {
		var newNodes = capacitors[i].getNodes();

		var pos = newNodes.fromNode.search('_net');
        if(pos > -1 ) {
			// Verify Amperemeter Nodes
			found = iProbeNodesArr.find(element => element == newNodes.fromNode);
			// If was found in the general array, do the change
			if (typeof found != 'undefined') {
				var found2 = iProbeNodesLoc.find(element => element.fromNode == found);
				if (typeof found2 != 'undefined') {
					// First in the fromNode
					newNodes.fromNode = found2.toNode;
					if(capacitors[i].noN == found) capacitors[i].noN = found2.toNode;
					if(capacitors[i].noP == found) capacitors[i].noP = found2.toNode;

					// Save component Ref in iProbeLocVsAmpId
					var index = iProbNodesLocFilled.indexOf(found2);
					const locIndex = iProbeLocVsAmpId.findIndex(item => item.iProbLocPos == index);
					iProbeLocVsAmpId[locIndex].serieConCpRef = capacitors[i].ref;

					// Clear pending amperemeter nodes
					index = iProbeNodesArr.indexOf(found);
					if (index > -1) { iProbeNodesArr.splice(index, 1); }

					// Clear pending amperemeter nodes location
					index = iProbeNodesLoc.indexOf(found2);
					if (index > -1) { iProbeNodesLoc.splice(index, 1); }
				}
				found2 = iProbeNodesLoc.find(element => element.toNode == found);
				if (typeof found2 != 'undefined') {
					// First in the fromNode
					newNodes.fromNode = found2.fromNode;
					if(capacitors[i].noN == found) capacitors[i].noN = found2.fromNode;
					if(capacitors[i].noP == found) capacitors[i].noP = found2.fromNode;

					// Save component Ref in iProbeLocVsAmpId
					var index = iProbNodesLocFilled.indexOf(found2);
					const locIndex = iProbeLocVsAmpId.findIndex(item => item.iProbLocPos == index);
					iProbeLocVsAmpId[locIndex].serieConCpRef = capacitors[i].ref;

					// Clear pending amperemeter nodes
					index = iProbeNodesArr.indexOf(found);
					if (index > -1) { iProbeNodesArr.splice(index, 1); }

					// Clear pending amperemeter nodes location
					index = iProbeNodesLoc.indexOf(found2);
					if (index > -1) { iProbeNodesLoc.splice(index, 1); }
				}
			}
		}

		var pos = newNodes.toNode.search('_net');
        if(pos > -1 ) {
			found = iProbeNodesArr.find(element => element == newNodes.toNode);
			// If was found in the general array, do the change
			if (typeof found != 'undefined') {
				var found2 = iProbeNodesLoc.find(element => element.fromNode == found);
				if (typeof found2 != 'undefined') {
					// First in the fromNode
					newNodes.toNode = found2.toNode;
					if(capacitors[i].noN == found) capacitors[i].noN = found2.toNode;
					if(capacitors[i].noP == found) capacitors[i].noP = found2.toNode;

					// Save component Ref in iProbeLocVsAmpId
					var index = iProbNodesLocFilled.indexOf(found2);
					const locIndex = iProbeLocVsAmpId.findIndex(item => item.iProbLocPos == index);
					iProbeLocVsAmpId[locIndex].serieConCpRef = capacitors[i].ref;

					// Clear pending amperemeter nodes
					index = iProbeNodesArr.indexOf(found);
					if (index > -1) { iProbeNodesArr.splice(index, 1); }

					// Clear pending amperemeter nodes location
					index = iProbeNodesLoc.indexOf(found2);
					if (index > -1) { iProbeNodesLoc.splice(index, 1); }
				}
				found2 = iProbeNodesLoc.find(element => element.toNode == found);
				if (typeof found2 != 'undefined') {
					// First in the fromNode
					newNodes.toNode = found2.fromNode;
					if(capacitors[i].noN == found) capacitors[i].noN = found2.fromNode;
					if(capacitors[i].noP == found) capacitors[i].noP = found2.fromNode;

					// Save component Ref in iProbeLocVsAmpId
					var index = iProbNodesLocFilled.indexOf(found2);
					const locIndex = iProbeLocVsAmpId.findIndex(item => item.iProbLocPos == index);
					iProbeLocVsAmpId[locIndex].serieConCpRef = capacitors[i].ref;

					// Clear pending amperemeter nodes
					index = iProbeNodesArr.indexOf(found);
					if (index > -1) { iProbeNodesArr.splice(index, 1); }

					// Clear pending amperemeter nodes location
					index = iProbeNodesLoc.indexOf(found2);
					if (index > -1) { iProbeNodesLoc.splice(index, 1); }
				}
			}
		}

		var found = foundNodes.find(element => element == newNodes.fromNode);
		if (typeof found == 'undefined') foundNodes.push(newNodes.fromNode);

		var found = foundNodes.find(element => element == newNodes.toNode);
		if (typeof found == 'undefined') foundNodes.push(newNodes.toNode);

	}

	for(var i=0; i<dcVoltPs.length; i++) {
		var newNodes = dcVoltPs[i].getNodes();

		var pos = newNodes.fromNode.search('_net');
        if(pos > -1 ) {
			// Verify Amperemeter Nodes
			found = iProbeNodesArr.find(element => element == newNodes.fromNode);
			// If was found in the general array, do the change
			if (typeof found != 'undefined') {
				var found2 = iProbeNodesLoc.find(element => element.fromNode == found);
				if (typeof found2 != 'undefined') {
					// First in the fromNode
					newNodes.fromNode = found2.toNode;
					if(dcVoltPs[i].noN == found) dcVoltPs[i].noN = found2.toNode;
					if(dcVoltPs[i].noP == found) dcVoltPs[i].noP = found2.toNode;

					// Save component Ref in iProbeLocVsAmpId
					var index = iProbNodesLocFilled.indexOf(found2);
					const locIndex = iProbeLocVsAmpId.findIndex(item => item.iProbLocPos == index);
					iProbeLocVsAmpId[locIndex].serieConCpRef = dcVoltPs[i].ref;

					// Clear pending amperemeter nodes
					index = iProbeNodesArr.indexOf(found);
					if (index > -1) { iProbeNodesArr.splice(index, 1); }

					// Clear pending amperemeter nodes location
					index = iProbeNodesLoc.indexOf(found2);
					if (index > -1) { iProbeNodesLoc.splice(index, 1); }
				}
				found2 = iProbeNodesLoc.find(element => element.toNode == found);
				if (typeof found2 != 'undefined') {
					// First in the fromNode
					newNodes.fromNode = found2.fromNode;
					if(dcVoltPs[i].noN == found) dcVoltPs[i].noN = found2.fromNode;
					if(dcVoltPs[i].noP == found) dcVoltPs[i].noP = found2.fromNode;

					// Save component Ref in iProbeLocVsAmpId
					var index = iProbNodesLocFilled.indexOf(found2);
					const locIndex = iProbeLocVsAmpId.findIndex(item => item.iProbLocPos == index);
					iProbeLocVsAmpId[locIndex].serieConCpRef = dcVoltPs[i].ref;

					// Clear pending amperemeter nodes
					index = iProbeNodesArr.indexOf(found);
					if (index > -1) { iProbeNodesArr.splice(index, 1); }

					// Clear pending amperemeter nodes location
					index = iProbeNodesLoc.indexOf(found2);
					if (index > -1) { iProbeNodesLoc.splice(index, 1); }
				}
			}
		}

		var pos = newNodes.toNode.search('_net');
        if(pos > -1 ) {
			found = iProbeNodesArr.find(element => element == newNodes.toNode);
			// If was found in the general array, do the change
			if (typeof found != 'undefined') {
				var found2 = iProbeNodesLoc.find(element => element.fromNode == found);
				if (typeof found2 != 'undefined') {
					// First in the fromNode
					newNodes.toNode = found2.toNode;
					if(dcVoltPs[i].noN == found) dcVoltPs[i].noN = found2.toNode;
					if(dcVoltPs[i].noP == found) dcVoltPs[i].noP = found2.toNode;

					// Save component Ref in iProbeLocVsAmpId
					var index = iProbNodesLocFilled.indexOf(found2);
					const locIndex = iProbeLocVsAmpId.findIndex(item => item.iProbLocPos == index);
					iProbeLocVsAmpId[locIndex].serieConCpRef = dcVoltPs[i].ref;

					// Clear pending amperemeter nodes
					index = iProbeNodesArr.indexOf(found);
					if (index > -1) { iProbeNodesArr.splice(index, 1); }

					// Clear pending amperemeter nodes location
					index = iProbeNodesLoc.indexOf(found2);
					if (index > -1) { iProbeNodesLoc.splice(index, 1); }
				}
				found2 = iProbeNodesLoc.find(element => element.toNode == found);
				if (typeof found2 != 'undefined') {
					// First in the fromNode
					newNodes.toNode = found2.fromNode;
					if(dcVoltPs[i].noN == found) dcVoltPs[i].noN = found2.fromNode;
					if(dcVoltPs[i].noP == found) dcVoltPs[i].noP = found2.fromNode;

					// Save component Ref in iProbeLocVsAmpId
					var index = iProbNodesLocFilled.indexOf(found2);
					const locIndex = iProbeLocVsAmpId.findIndex(item => item.iProbLocPos == index);
					iProbeLocVsAmpId[locIndex].serieConCpRef = dcVoltPs[i].ref;

					// Clear pending amperemeter nodes
					index = iProbeNodesArr.indexOf(found);
					if (index > -1) { iProbeNodesArr.splice(index, 1); }

					// Clear pending amperemeter nodes location
					index = iProbeNodesLoc.indexOf(found2);
					if (index > -1) { iProbeNodesLoc.splice(index, 1); }
				}
			}
		}

		var found = foundNodes.find(element => element == newNodes.fromNode);
		if (typeof found == 'undefined') foundNodes.push(newNodes.fromNode);

		var found = foundNodes.find(element => element == newNodes.toNode);
		if (typeof found == 'undefined') foundNodes.push(newNodes.toNode);

	}

	for(var i=0; i<acVoltPs.length; i++) {
		var newNodes = acVoltPs[i].getNodes();

		var pos = newNodes.fromNode.search('_net');
        if(pos > -1 ) {
			// Verify Amperemeter Nodes
			found = iProbeNodesArr.find(element => element == newNodes.fromNode);
			// If was found in the general array, do the change
			if (typeof found != 'undefined') {
				var found2 = iProbeNodesLoc.find(element => element.fromNode == found);
				if (typeof found2 != 'undefined') {
					// First in the fromNode
					newNodes.fromNode = found2.toNode;
					if(acVoltPs[i].noN == found) acVoltPs[i].noN = found2.toNode;
					if(acVoltPs[i].noP == found) acVoltPs[i].noP = found2.toNode;

					// Save component Ref in iProbeLocVsAmpId
					var index = iProbNodesLocFilled.indexOf(found2);
					const locIndex = iProbeLocVsAmpId.findIndex(item => item.iProbLocPos == index);
					iProbeLocVsAmpId[locIndex].serieConCpRef = acVoltPs[i].ref;

					// Clear pending amperemeter nodes
					index = iProbeNodesArr.indexOf(found);
					if (index > -1) { iProbeNodesArr.splice(index, 1); }

					// Clear pending amperemeter nodes location
					index = iProbeNodesLoc.indexOf(found2);
					if (index > -1) { iProbeNodesLoc.splice(index, 1); }
				}
				found2 = iProbeNodesLoc.find(element => element.toNode == found);
				if (typeof found2 != 'undefined') {
					// First in the fromNode
					newNodes.fromNode = found2.fromNode;
					if(acVoltPs[i].noN == found) acVoltPs[i].noN = found2.fromNode;
					if(acVoltPs[i].noP == found) acVoltPs[i].noP = found2.fromNode;

					// Save component Ref in iProbeLocVsAmpId
					var index = iProbNodesLocFilled.indexOf(found2);
					const locIndex = iProbeLocVsAmpId.findIndex(item => item.iProbLocPos == index);
					iProbeLocVsAmpId[locIndex].serieConCpRef = acVoltPs[i].ref;

					// Clear pending amperemeter nodes
					index = iProbeNodesArr.indexOf(found);
					if (index > -1) { iProbeNodesArr.splice(index, 1); }

					// Clear pending amperemeter nodes location
					index = iProbeNodesLoc.indexOf(found2);
					if (index > -1) { iProbeNodesLoc.splice(index, 1); }
				}
			}
		}

		var pos = newNodes.toNode.search('_net');
        if(pos > -1 ) {
			found = iProbeNodesArr.find(element => element == newNodes.toNode);
			// If was found in the general array, do the change
			if (typeof found != 'undefined') {
				var found2 = iProbeNodesLoc.find(element => element.fromNode == found);
				if (typeof found2 != 'undefined') {
					// First in the fromNode
					newNodes.toNode = found2.toNode;
					if(acVoltPs[i].noN == found) acVoltPs[i].noN = found2.toNode;
					if(acVoltPs[i].noP == found) acVoltPs[i].noP = found2.toNode;

					// Save component Ref in iProbeLocVsAmpId
					var index = iProbNodesLocFilled.indexOf(found2);
					const locIndex = iProbeLocVsAmpId.findIndex(item => item.iProbLocPos == index);
					iProbeLocVsAmpId[locIndex].serieConCpRef = acVoltPs[i].ref;

					// Clear pending amperemeter nodes
					index = iProbeNodesArr.indexOf(found);
					if (index > -1) { iProbeNodesArr.splice(index, 1); }

					// Clear pending amperemeter nodes location
					index = iProbeNodesLoc.indexOf(found2);
					if (index > -1) { iProbeNodesLoc.splice(index, 1); }
				}
				found2 = iProbeNodesLoc.find(element => element.toNode == found);
				if (typeof found2 != 'undefined') {
					// First in the fromNode
					newNodes.toNode = found2.fromNode;
					if(acVoltPs[i].noN == found) acVoltPs[i].noN = found2.fromNode;
					if(acVoltPs[i].noP == found) acVoltPs[i].noP = found2.fromNode;

					// Save component Ref in iProbeLocVsAmpId
					var index = iProbNodesLocFilled.indexOf(found2);
					const locIndex = iProbeLocVsAmpId.findIndex(item => item.iProbLocPos == index);
					iProbeLocVsAmpId[locIndex].serieConCpRef = acVoltPs[i].ref;

					// Clear pending amperemeter nodes
					index = iProbeNodesArr.indexOf(found);
					if (index > -1) { iProbeNodesArr.splice(index, 1); }

					// Clear pending amperemeter nodes location
					index = iProbeNodesLoc.indexOf(found2);
					if (index > -1) { iProbeNodesLoc.splice(index, 1); }
				}
			}
		}

		var found = foundNodes.find(element => element == newNodes.fromNode);
		if (typeof found == 'undefined') foundNodes.push(newNodes.fromNode);

		var found = foundNodes.find(element => element == newNodes.toNode);
		if (typeof found == 'undefined') foundNodes.push(newNodes.toNode);

	}

	for(var i=0; i<dcAmpsPs.length; i++) {
		var newNodes = dcAmpsPs[i].getNodes();

		var pos = newNodes.fromNode.search('_net');
        if(pos > -1 ) {
			// Verify Amperemeter Nodes
			found = iProbeNodesArr.find(element => element == newNodes.fromNode);
			// If was found in the general array, do the change
			if (typeof found != 'undefined') {
				var found2 = iProbeNodesLoc.find(element => element.fromNode == found);
				if (typeof found2 != 'undefined') {
					// First in the fromNode
					newNodes.fromNode = found2.toNode;
					if(dcAmpsPs[i].noN == found) dcAmpsPs[i].noN = found2.toNode;
					if(dcAmpsPs[i].noP == found) dcAmpsPs[i].noP = found2.toNode;

					// Save component Ref in iProbeLocVsAmpId
					var index = iProbNodesLocFilled.indexOf(found2);
					const locIndex = iProbeLocVsAmpId.findIndex(item => item.iProbLocPos == index);
					iProbeLocVsAmpId[locIndex].serieConCpRef = dcAmpsPs[i].ref;

					// Clear pending amperemeter nodes
					index = iProbeNodesArr.indexOf(found);
					if (index > -1) { iProbeNodesArr.splice(index, 1); }

					// Clear pending amperemeter nodes location
					index = iProbeNodesLoc.indexOf(found2);
					if (index > -1) { iProbeNodesLoc.splice(index, 1); }
				}
				found2 = iProbeNodesLoc.find(element => element.toNode == found);
				if (typeof found2 != 'undefined') {
					// First in the fromNode
					newNodes.fromNode = found2.fromNode;
					if(dcAmpsPs[i].noN == found) dcAmpsPs[i].noN = found2.fromNode;
					if(dcAmpsPs[i].noP == found) dcAmpsPs[i].noP = found2.fromNode;

					// Save component Ref in iProbeLocVsAmpId
					var index = iProbNodesLocFilled.indexOf(found2);
					const locIndex = iProbeLocVsAmpId.findIndex(item => item.iProbLocPos == index);
					iProbeLocVsAmpId[locIndex].serieConCpRef = dcAmpsPs[i].ref;

					// Clear pending amperemeter nodes
					index = iProbeNodesArr.indexOf(found);
					if (index > -1) { iProbeNodesArr.splice(index, 1); }

					// Clear pending amperemeter nodes location
					index = iProbeNodesLoc.indexOf(found2);
					if (index > -1) { iProbeNodesLoc.splice(index, 1); }
				}
			}
		}

		var pos = newNodes.toNode.search('_net');
        if(pos > -1 ) {
			found = iProbeNodesArr.find(element => element == newNodes.toNode);
			// If was found in the general array, do the change
			if (typeof found != 'undefined') {
				var found2 = iProbeNodesLoc.find(element => element.fromNode == found);
				if (typeof found2 != 'undefined') {
					// First in the fromNode
					newNodes.toNode = found2.toNode;
					if(dcAmpsPs[i].noN == found) dcAmpsPs[i].noN = found2.toNode;
					if(dcAmpsPs[i].noP == found) dcAmpsPs[i].noP = found2.toNode;

					// Save component Ref in iProbeLocVsAmpId
					var index = iProbNodesLocFilled.indexOf(found2);
					const locIndex = iProbeLocVsAmpId.findIndex(item => item.iProbLocPos == index);
					iProbeLocVsAmpId[locIndex].serieConCpRef = dcAmpsPs[i].ref;

					// Clear pending amperemeter nodes
					index = iProbeNodesArr.indexOf(found);
					if (index > -1) { iProbeNodesArr.splice(index, 1); }

					// Clear pending amperemeter nodes location
					index = iProbeNodesLoc.indexOf(found2);
					if (index > -1) { iProbeNodesLoc.splice(index, 1); }
				}
				found2 = iProbeNodesLoc.find(element => element.toNode == found);
				if (typeof found2 != 'undefined') {
					// First in the fromNode
					newNodes.toNode = found2.fromNode;
					if(dcAmpsPs[i].noN == found) dcAmpsPs[i].noN = found2.fromNode;
					if(dcAmpsPs[i].noP == found) dcAmpsPs[i].noP = found2.fromNode;

					// Save component Ref in iProbeLocVsAmpId
					var index = iProbNodesLocFilled.indexOf(found2);
					const locIndex = iProbeLocVsAmpId.findIndex(item => item.iProbLocPos == index);
					iProbeLocVsAmpId[locIndex].serieConCpRef = dcAmpsPs[i].ref;

					// Clear pending amperemeter nodes
					index = iProbeNodesArr.indexOf(found);
					if (index > -1) { iProbeNodesArr.splice(index, 1); }

					// Clear pending amperemeter nodes location
					index = iProbeNodesLoc.indexOf(found2);
					if (index > -1) { iProbeNodesLoc.splice(index, 1); }
				}
			}
		}

		var found = foundNodes.find(element => element == newNodes.fromNode);
		if (typeof found == 'undefined') foundNodes.push(newNodes.fromNode);

		var found = foundNodes.find(element => element == newNodes.toNode);
		if (typeof found == 'undefined') foundNodes.push(newNodes.toNode);

	}

	for(var i=0; i<acAmpsPs.length; i++) {
		var newNodes = acAmpsPs[i].getNodes();

		var pos = newNodes.fromNode.search('_net');
        if(pos > -1 ) {
			// Verify Amperemeter Nodes
			found = iProbeNodesArr.find(element => element == newNodes.fromNode);
			// If was found in the general array, do the change
			if (typeof found != 'undefined') {
				var found2 = iProbeNodesLoc.find(element => element.fromNode == found);
				if (typeof found2 != 'undefined') {
					// First in the fromNode
					newNodes.fromNode = found2.toNode;
					if(acAmpsPs[i].noN == found) acAmpsPs[i].noN = found2.toNode;
					if(acAmpsPs[i].noP == found) acAmpsPs[i].noP = found2.toNode;

					// Save component Ref in iProbeLocVsAmpId
					var index = iProbNodesLocFilled.indexOf(found2);
					const locIndex = iProbeLocVsAmpId.findIndex(item => item.iProbLocPos == index);
					iProbeLocVsAmpId[locIndex].serieConCpRef = acAmpsPs[i].ref;

					// Clear pending amperemeter nodes
					index = iProbeNodesArr.indexOf(found);
					if (index > -1) { iProbeNodesArr.splice(index, 1); }

					// Clear pending amperemeter nodes location
					index = iProbeNodesLoc.indexOf(found2);
					if (index > -1) { iProbeNodesLoc.splice(index, 1); }
				}
				found2 = iProbeNodesLoc.find(element => element.toNode == found);
				if (typeof found2 != 'undefined') {
					// First in the fromNode
					newNodes.fromNode = found2.fromNode;
					if(acAmpsPs[i].noN == found) acAmpsPs[i].noN = found2.fromNode;
					if(acAmpsPs[i].noP == found) acAmpsPs[i].noP = found2.fromNode;

					// Save component Ref in iProbeLocVsAmpId
					var index = iProbNodesLocFilled.indexOf(found2);
					const locIndex = iProbeLocVsAmpId.findIndex(item => item.iProbLocPos == index);
					iProbeLocVsAmpId[locIndex].serieConCpRef = acAmpsPs[i].ref;

					// Clear pending amperemeter nodes
					index = iProbeNodesArr.indexOf(found);
					if (index > -1) { iProbeNodesArr.splice(index, 1); }

					// Clear pending amperemeter nodes location
					index = iProbeNodesLoc.indexOf(found2);
					if (index > -1) { iProbeNodesLoc.splice(index, 1); }
				}
			}
		}

		var pos = newNodes.toNode.search('_net');
        if(pos > -1 ) {
			found = iProbeNodesArr.find(element => element == newNodes.toNode);
			// If was found in the general array, do the change
			if (typeof found != 'undefined') {
				var found2 = iProbeNodesLoc.find(element => element.fromNode == found);
				if (typeof found2 != 'undefined') {
					// First in the fromNode
					newNodes.toNode = found2.toNode;
					if(acAmpsPs[i].noN == found) acAmpsPs[i].noN = found2.toNode;
					if(acAmpsPs[i].noP == found) acAmpsPs[i].noP = found2.toNode;

					// Save component Ref in iProbeLocVsAmpId
					var index = iProbNodesLocFilled.indexOf(found2);
					const locIndex = iProbeLocVsAmpId.findIndex(item => item.iProbLocPos == index);
					iProbeLocVsAmpId[locIndex].serieConCpRef = acAmpsPs[i].ref;

					// Clear pending amperemeter nodes
					index = iProbeNodesArr.indexOf(found);
					if (index > -1) { iProbeNodesArr.splice(index, 1); }

					// Clear pending amperemeter nodes location
					index = iProbeNodesLoc.indexOf(found2);
					if (index > -1) { iProbeNodesLoc.splice(index, 1); }
				}
				found2 = iProbeNodesLoc.find(element => element.toNode == found);
				if (typeof found2 != 'undefined') {
					// First in the fromNode
					newNodes.toNode = found2.fromNode;
					if(acAmpsPs[i].noN == found) acAmpsPs[i].noN = found2.fromNode;
					if(acAmpsPs[i].noP == found) acAmpsPs[i].noP = found2.fromNode;

					// Save component Ref in iProbeLocVsAmpId
					var index = iProbNodesLocFilled.indexOf(found2);
					const locIndex = iProbeLocVsAmpId.findIndex(item => item.iProbLocPos == index);
					iProbeLocVsAmpId[locIndex].serieConCpRef = acAmpsPs[i].ref;

					// Clear pending amperemeter nodes
					index = iProbeNodesArr.indexOf(found);
					if (index > -1) { iProbeNodesArr.splice(index, 1); }

					// Clear pending amperemeter nodes location
					index = iProbeNodesLoc.indexOf(found2);
					if (index > -1) { iProbeNodesLoc.splice(index, 1); }
				}
			}
		}

		var found = foundNodes.find(element => element == newNodes.fromNode);
		if (typeof found == 'undefined') foundNodes.push(newNodes.fromNode);

		var found = foundNodes.find(element => element == newNodes.toNode);
		if (typeof found == 'undefined') foundNodes.push(newNodes.toNode);

	}
	foundNodes.sort();
	let foundnodeInstances = [].concat(...connections);

	// Push nodes data to nodes array
	for(var i=0; i<foundNodes.length; i++) {
		var nodeId = ++circuitAnalCnt.node;
		var nodeType = 1;	// Real Node
		var pos = foundnodeInstances.filter(function(x){ return x === foundNodes[i]; }).length;
        if(pos > 2 ) nodeType = 0;	// Virtual Node
		var newNode = new node(nodeId, foundNodes[i], [], nodeType, null);
		nodes.push(newNode);
	}
	return{
		first: false,
		second: 0
	}
}
//Encontra o nr e a composição dos ramos do circuito
function makeBranches(){
	// Insert components into branches and Count Branches

	// Get a copy of components
	var resisTemp = resistors.slice();
	var coilsTemp = coils.slice();
	var capacTemp = capacitors.slice();
	var dcVPsTemp = dcVoltPs.slice();
	var dcAPsTemp = dcAmpsPs.slice();
	var acVPsTemp = acVoltPs.slice();
	var acAPsTemp = acAmpsPs.slice();

	// For each node, follow components until reach another Real Node, while creating Branches and set its data
	// This Operation is Successful if ends up with every array copy of components empty

	for(var i=0; i<nodes.length; i++) {
		// If it is a Real Node
		if(nodes[i].type == 0) {
			nodeRef = nodes[i].ref;

			// Count occurrences
			var foundCnt = 0;
			for(var j=0; j<resisTemp.length; j++) { if(resisTemp[j].noP == nodeRef || resisTemp[j].noN == nodeRef) foundCnt++; }
			for(var j=0; j<coilsTemp.length; j++) { if(coilsTemp[j].noP == nodeRef || coilsTemp[j].noN == nodeRef) foundCnt++; }
			for(var j=0; j<capacTemp.length; j++) { if(capacTemp[j].noP == nodeRef || capacTemp[j].noN == nodeRef) foundCnt++; }
			for(var j=0; j<dcVPsTemp.length; j++) { if(dcVPsTemp[j].noP == nodeRef || dcVPsTemp[j].noN == nodeRef) foundCnt++; }
			for(var j=0; j<dcAPsTemp.length; j++) { if(dcAPsTemp[j].noP == nodeRef || dcAPsTemp[j].noN == nodeRef) foundCnt++; }
			for(var j=0; j<acVPsTemp.length; j++) { if(acVPsTemp[j].noP == nodeRef || acVPsTemp[j].noN == nodeRef) foundCnt++; }
			for(var j=0; j<acAPsTemp.length; j++) { if(acAPsTemp[j].noP == nodeRef || acAPsTemp[j].noN == nodeRef) foundCnt++; }

			/*
				* CP Search States Machine (cpSearchSM):
					1 - Resistors;
					2 - Coils;
					3 - Capacitors;
					4 - DC Volt PS;
					5 - DC Amp PS;
					6 - AC Volt PS;
					7 - AC Amp PS.
			*/
			for(var j=0; j<foundCnt; j++) {
				var end = 0;
				var cpSearchSM = 1;
				var branchId = ++circuitAnalCnt.branch;
				var newBranch = new branch(branchId, null, nodeRef);
				do {
					switch (cpSearchSM) {
						case 1: {
							if(resisTemp.length == 0) cpSearchSM++;
							for(var k=0; k<resisTemp.length; k++) {
								if(resisTemp[k].noP == nodeRef) {
									var nextNode = resisTemp[k].noN;
									newBranch.resistors.push(resisTemp[k]);

									// remove entry from component array (copy)
									resisTemp.splice(k, 1);

									// If next node is Real, Branch is Complete
									var c1 = nextNode.search('_net');
									if(c1 < 0) {
										// Set final branch node
										newBranch.endNode = nextNode;
										// Save branch data into Branches Array
										branches.push(newBranch);
										// Reset node ref to search again
										nodeRef = nodes[i].ref;
										// End first foundCnt iteration
										end = 1;
										// Exit States Machine
										break;
									};
									nodeRef = nextNode;
									// Return to resistors in a new iteration
									cpSearchSM = 1;
									// Exit States Machine
									break;
								}
								if(resisTemp[k].noN == nodeRef) {
									var nextNode = resisTemp[k].noP;
									newBranch.resistors.push(resisTemp[k]);

									// remove entry from component array (copy)
									resisTemp.splice(k, 1);

									// If next node is Real, Branch is Complete
									var c1 = nextNode.search('_net');
									if(c1 < 0) {
										// Set final branch node
										newBranch.endNode = nextNode;
										// Save branch data into Branches Array
										branches.push(newBranch);
										// Reset node ref to search again
										nodeRef = nodes[i].ref;
										// End first foundCnt iteration
										end = 1;
										// Exit States Machine
										break;
									};
									nodeRef = nextNode;
									// Return to resistors in a new iteration
									cpSearchSM = 1;
									// Exit States Machine
									break;
								}
								if(k == (resisTemp.length-1)) cpSearchSM++;
							}
							break;
						}

						case 2: {
							if(coilsTemp.length == 0) cpSearchSM++;
							for(var k=0; k<coilsTemp.length; k++) {
								if(coilsTemp[k].noP == nodeRef) {
									var nextNode = coilsTemp[k].noN;
									newBranch.coils.push(coilsTemp[k]);

									// remove entry from component array (copy)
									coilsTemp.splice(k, 1);

									// If next node is Real, Branch is Complete
									var c1 = nextNode.search('_net');
									if(c1 < 0) {
										// Set final branch node
										newBranch.endNode = nextNode;
										// Save branch data into Branches Array
										branches.push(newBranch);
										// Reset node ref to search again
										nodeRef = nodes[i].ref;
										// End first foundCnt iteration
										end = 1;
										// Exit States Machine
										break;
									};
									nodeRef = nextNode;
									// Return to resistors in a new iteration
									cpSearchSM = 1;
									// Exit States Machine
									break;
								}
								if(coilsTemp[k].noN == nodeRef) {
									var nextNode = coilsTemp[k].noP;
									newBranch.coils.push(coilsTemp[k]);

									// remove entry from component array (copy)
									coilsTemp.splice(k, 1);

									// If next node is Real, Branch is Complete
									var c1 = nextNode.search('_net');
									if(c1 < 0) {
										// Set final branch node
										newBranch.endNode = nextNode;
										// Save branch data into Branches Array
										branches.push(newBranch);
										// Reset node ref to search again
										nodeRef = nodes[i].ref;
										// End first foundCnt iteration
										end = 1;
										// Exit States Machine
										break;
									};
									nodeRef = nextNode;
									// Return to resistors in a new iteration
									cpSearchSM = 1;
									// Exit States Machine
									break;
								}
								if(k == (coilsTemp.length-1)) cpSearchSM++;
							}
							break;
						}

						case 3: {
							if(capacTemp.length == 0) cpSearchSM++;
							for(var k=0; k<capacTemp.length; k++) {
								if(capacTemp[k].noP == nodeRef) {
									var nextNode = capacTemp[k].noN;
									newBranch.capacitors.push(capacTemp[k]);

									// remove entry from component array (copy)
									capacTemp.splice(k, 1);

									// If next node is Real, Branch is Complete
									var c1 = nextNode.search('_net');
									if(c1 < 0) {
										// Set final branch node
										newBranch.endNode = nextNode;
										// Save branch data into Branches Array
										branches.push(newBranch);
										// Reset node ref to search again
										nodeRef = nodes[i].ref;
										// End first foundCnt iteration
										end = 1;
										// Exit States Machine
										break;
									};
									nodeRef = nextNode;
									// Return to resistors in a new iteration
									cpSearchSM = 1;
									// Exit States Machine
									break;
								}
								if(capacTemp[k].noN == nodeRef) {
									var nextNode = capacTemp[k].noP;
									newBranch.capacitors.push(capacTemp[k]);

									// remove entry from component array (copy)
									capacTemp.splice(k, 1);

									// If next node is Real, Branch is Complete
									var c1 = nextNode.search('_net');
									if(c1 < 0) {
										// Set final branch node
										newBranch.endNode = nextNode;
										// Save branch data into Branches Array
										branches.push(newBranch);
										// Reset node ref to search again
										nodeRef = nodes[i].ref;
										// End first foundCnt iteration
										end = 1;
										// Exit States Machine
										break;
									};
									nodeRef = nextNode;
									// Return to resistors in a new iteration
									cpSearchSM = 1;
									// Exit States Machine
									break;
								}
								if(k == (capacTemp.length-1)) cpSearchSM++;
							}
							break;
						}

						case 4: {
							if(dcVPsTemp.length == 0) cpSearchSM++;
							for(var k=0; k<dcVPsTemp.length; k++) {
								if(dcVPsTemp[k].noP == nodeRef) {
									var nextNode = dcVPsTemp[k].noN;
									newBranch.dcVoltPwSupplies.push(dcVPsTemp[k]);

									// remove entry from component array (copy)
									dcVPsTemp.splice(k, 1);

									// If next node is Real, Branch is Complete
									var c1 = nextNode.search('_net');
									if(c1 < 0) {
										// Set final branch node
										newBranch.endNode = nextNode;
										// Save branch data into Branches Array
										branches.push(newBranch);
										// Reset node ref to search again
										nodeRef = nodes[i].ref;
										// End first foundCnt iteration
										end = 1;
										// Exit States Machine
										break;
									};
									nodeRef = nextNode;
									// Return to resistors in a new iteration
									cpSearchSM = 1;
									// Exit States Machine
									break;
								}
								if(dcVPsTemp[k].noN == nodeRef) {
									var nextNode = dcVPsTemp[k].noP;
									newBranch.dcVoltPwSupplies.push(dcVPsTemp[k]);

									// remove entry from component array (copy)
									dcVPsTemp.splice(k, 1);

									// If next node is Real, Branch is Complete
									var c1 = nextNode.search('_net');
									if(c1 < 0) {
										// Set final branch node
										newBranch.endNode = nextNode;
										// Save branch data into Branches Array
										branches.push(newBranch);
										// Reset node ref to search again
										nodeRef = nodes[i].ref;
										// End first foundCnt iteration
										end = 1;
										// Exit States Machine
										break;
									};
									nodeRef = nextNode;
									// Return to resistors in a new iteration
									cpSearchSM = 1;
									// Exit States Machine
									break;
								}
								if(k == (dcVPsTemp.length-1)) cpSearchSM++;
							}
							break;
						}

						case 5: {
							if(dcAPsTemp.length == 0) cpSearchSM++;
							for(var k=0; k<dcAPsTemp.length; k++) {
								if(dcAPsTemp[k].noP == nodeRef) {
									var nextNode = dcAPsTemp[k].noN;
									newBranch.dcAmpPwSupplies.push(dcAPsTemp[k]);

									// remove entry from component array (copy)
									dcAPsTemp.splice(k, 1);

									// If next node is Real, Branch is Complete
									var c1 = nextNode.search('_net');
									if(c1 < 0) {
										// Set final branch node
										newBranch.endNode = nextNode;
										// Save branch data into Branches Array
										branches.push(newBranch);
										// Reset node ref to search again
										nodeRef = nodes[i].ref;
										// End first foundCnt iteration
										end = 1;
										// Exit States Machine
										break;
									};
									nodeRef = nextNode;
									// Return to resistors in a new iteration
									cpSearchSM = 1;
									// Exit States Machine
									break;
								}
								if(dcAPsTemp[k].noN == nodeRef) {
									var nextNode = dcAPsTemp[k].noP;
									newBranch.dcAmpPwSupplies.push(dcAPsTemp[k]);

									// remove entry from component array (copy)
									dcAPsTemp.splice(k, 1);

									// If next node is Real, Branch is Complete
									var c1 = nextNode.search('_net');
									if(c1 < 0) {
										// Set final branch node
										newBranch.endNode = nextNode;
										// Save branch data into Branches Array
										branches.push(newBranch);
										// Reset node ref to search again
										nodeRef = nodes[i].ref;
										// End first foundCnt iteration
										end = 1;
										// Exit States Machine
										break;
									};
									nodeRef = nextNode;
									// Return to resistors in a new iteration
									cpSearchSM = 1;
									// Exit States Machine
									break;
								}
								if(k == (dcAPsTemp.length-1)) cpSearchSM++;
							}
							break;
						}

						case 6: {
							if(acVPsTemp.length == 0) cpSearchSM++;
							for(var k=0; k<acVPsTemp.length; k++) {
								if(acVPsTemp[k].noP == nodeRef) {
									var nextNode = acVPsTemp[k].noN;
									newBranch.acVoltPwSupplies.push(acVPsTemp[k]);

									// remove entry from component array (copy)
									acVPsTemp.splice(k, 1);

									// If next node is Real, Branch is Complete
									var c1 = nextNode.search('_net');
									if(c1 < 0) {
										// Set final branch node
										newBranch.endNode = nextNode;
										// Save branch data into Branches Array
										branches.push(newBranch);
										// Reset node ref to search again
										nodeRef = nodes[i].ref;
										// End first foundCnt iteration
										end = 1;
										// Exit States Machine
										break;
									};
									nodeRef = nextNode;
									// Return to resistors in a new iteration
									cpSearchSM = 1;
									// Exit States Machine
									break;
								}
								if(acVPsTemp[k].noN == nodeRef) {
									var nextNode = acVPsTemp[k].noP;
									newBranch.acVoltPwSupplies.push(acVPsTemp[k]);

									// remove entry from component array (copy)
									acVPsTemp.splice(k, 1);

									// If next node is Real, Branch is Complete
									var c1 = nextNode.search('_net');
									if(c1 < 0) {
										// Set final branch node
										newBranch.endNode = nextNode;
										// Save branch data into Branches Array
										branches.push(newBranch);
										// Reset node ref to search again
										nodeRef = nodes[i].ref;
										// End first foundCnt iteration
										end = 1;
										// Exit States Machine
										break;
									};
									nodeRef = nextNode;
									// Return to resistors in a new iteration
									cpSearchSM = 1;
									// Exit States Machine
									break;
								}
								if(k == (acVPsTemp.length-1)) cpSearchSM++;
							}
							break;
						}

						case 7: {
							if(acAPsTemp.length == 0) cpSearchSM++;
							for(var k=0; k<acAPsTemp.length; k++) {
								if(acAPsTemp[k].noP == nodeRef) {
									var nextNode = acAPsTemp[k].noN;
									newBranch.acAmpPwSupplies.push(acAPsTemp[k]);

									// remove entry from component array (copy)
									acAPsTemp.splice(k, 1);

									// If next node is Real, Branch is Complete
									var c1 = nextNode.search('_net');
									if(c1 < 0) {
										// Set final branch node
										newBranch.endNode = nextNode;
										// Save branch data into Branches Array
										branches.push(newBranch);
										// Reset node ref to search again
										nodeRef = nodes[i].ref;
										// End first foundCnt iteration
										end = 1;
										// Exit States Machine
										break;
									};
									nodeRef = nextNode;
									// Return to resistors in a new iteration
									cpSearchSM = 1;
									// Exit States Machine
									break;
								}
								if(acAPsTemp[k].noN == nodeRef) {
									var nextNode = acAPsTemp[k].noP;
									newBranch.acAmpPwSupplies.push(acAPsTemp[k]);

									// remove entry from component array (copy)
									acAPsTemp.splice(k, 1);

									// If next node is Real, Branch is Complete
									var c1 = nextNode.search('_net');
									if(c1 < 0) {
										// Set final branch node
										newBranch.endNode = nextNode;
										// Save branch data into Branches Array
										branches.push(newBranch);
										// Reset node ref to search again
										nodeRef = nodes[i].ref;
										// End first foundCnt iteration
										end = 1;
										// Exit States Machine
										break;
									};
									nodeRef = nextNode;
									// Return to resistors in a new iteration
									cpSearchSM = 1;
									// Exit States Machine
									break;
								}
								if(k == (acAPsTemp.length-1)) cpSearchSM++;
							}
							break;
						}

						default: {
							end = 1;
							continue;
						}
					}
				} while (end == 0);
			}
		}
	}
}
//Dá sentidos a correntes nos ramos (amperímetro ou não)
function branchCurrents(){

	// Analyse Branches vs Amperemeters (Currents Names)
	// Now its possible to analyse if it was provided One Amperemeter for the branch
	// If it is there, we can use its Reference to use in the Output (Current Reference)
	// If not, produce a Unique Id for each Current

	// Produce below a function to search for Amperemeter Nodes

	// Update branches information with Amperemeters Data and Next component
	for(var i=0; i<iProbeLocVsAmpId.length; i++) {
		let ampRef = iProbeLocVsAmpId[i].ampRef;
		let serieConCpRef = iProbeLocVsAmpId[i].serieConCpRef;

		for(var j=0; j<branches.length; j++) {
			if(branches[j].resistors.length > 0) {
				const refIndex = branches[j].resistors.findIndex(item => item.ref == serieConCpRef);
				if(refIndex > -1) {
					const ampIndex = ampsMeters.findIndex(item => item.ref == ampRef);
					if(ampIndex > -1) {
						// Save JointNode for Amperemeter
						if(ampsMeters[ampIndex].noP == branches[j].resistors[refIndex].noP) iProbeLocVsAmpId[i].jointNodeP = branches[j].resistors[refIndex].noP;
						if(ampsMeters[ampIndex].noP == branches[j].resistors[refIndex].noN) iProbeLocVsAmpId[i].jointNodeP = branches[j].resistors[refIndex].noN;
						if(ampsMeters[ampIndex].noN == branches[j].resistors[refIndex].noP) iProbeLocVsAmpId[i].jointNodeN = branches[j].resistors[refIndex].noP;
						if(ampsMeters[ampIndex].noN == branches[j].resistors[refIndex].noN) iProbeLocVsAmpId[i].jointNodeN = branches[j].resistors[refIndex].noN;
						// Save Amperemeter data to branch
						branches[j].amperemeter = ampsMeters[ampIndex];
					}
					break;
				}
			}

			if(branches[j].coils.length > 0) {
				refIndex = branches[j].coils.findIndex(item => item.ref == serieConCpRef);
				if(refIndex > -1) {
					const ampIndex = ampsMeters.findIndex(item => item.ref == ampRef);
					if(ampIndex > -1) {
						// Save JointNode for Amperemeter
						if(ampsMeters[ampIndex].noP == branches[j].coils[refIndex].noP) iProbeLocVsAmpId[i].jointNodeP = branches[j].coils[refIndex].noP;
						if(ampsMeters[ampIndex].noP == branches[j].coils[refIndex].noN) iProbeLocVsAmpId[i].jointNodeP = branches[j].coils[refIndex].noN;
						if(ampsMeters[ampIndex].noN == branches[j].coils[refIndex].noP) iProbeLocVsAmpId[i].jointNodeN = branches[j].coils[refIndex].noP;
						if(ampsMeters[ampIndex].noN == branches[j].coils[refIndex].noN) iProbeLocVsAmpId[i].jointNodeN = branches[j].coils[refIndex].noN;
						// Save Amperemeter data to branch
						branches[j].amperemeter = ampsMeters[ampIndex];
					}
					break;
				}
			}

			if(branches[j].capacitors.length > 0) {
				refIndex = branches[j].capacitors.findIndex(item => item.ref == serieConCpRef);
				if(refIndex > -1) {
					const ampIndex = ampsMeters.findIndex(item => item.ref == ampRef);
					if(ampIndex > -1) {
						// Save JointNode for Amperemeter
						if(ampsMeters[ampIndex].noP == branches[j].capacitors[refIndex].noP) iProbeLocVsAmpId[i].jointNodeP = branches[j].capacitors[refIndex].noP;
						if(ampsMeters[ampIndex].noP == branches[j].capacitors[refIndex].noN) iProbeLocVsAmpId[i].jointNodeP = branches[j].capacitors[refIndex].noN;
						if(ampsMeters[ampIndex].noN == branches[j].capacitors[refIndex].noP) iProbeLocVsAmpId[i].jointNodeN = branches[j].capacitors[refIndex].noP;
						if(ampsMeters[ampIndex].noN == branches[j].capacitors[refIndex].noN) iProbeLocVsAmpId[i].jointNodeN = branches[j].capacitors[refIndex].noN;
						// Save Amperemeter data to branch
						branches[j].amperemeter = ampsMeters[ampIndex];
					}
					break;
				}
			}

			if(branches[j].dcVoltPwSupplies.length > 0) {
				refIndex = branches[j].dcVoltPwSupplies.findIndex(item => item.ref == serieConCpRef);
				if(refIndex > -1) {
					const ampIndex = ampsMeters.findIndex(item => item.ref == ampRef);
					if(ampIndex > -1) {
						// Save JointNode for Amperemeter
						if(ampsMeters[ampIndex].noP == branches[j].dcVoltPwSupplies[refIndex].noP) iProbeLocVsAmpId[i].jointNodeP = branches[j].dcVoltPwSupplies[refIndex].noP;
						if(ampsMeters[ampIndex].noP == branches[j].dcVoltPwSupplies[refIndex].noN) iProbeLocVsAmpId[i].jointNodeP = branches[j].dcVoltPwSupplies[refIndex].noN;
						if(ampsMeters[ampIndex].noN == branches[j].dcVoltPwSupplies[refIndex].noP) iProbeLocVsAmpId[i].jointNodeN = branches[j].dcVoltPwSupplies[refIndex].noP;
						if(ampsMeters[ampIndex].noN == branches[j].dcVoltPwSupplies[refIndex].noN) iProbeLocVsAmpId[i].jointNodeN = branches[j].dcVoltPwSupplies[refIndex].noN;
						// Save Amperemeter data to branch
						branches[j].amperemeter = ampsMeters[ampIndex];
					}
					break;
				}
			}

			if(branches[j].acVoltPwSupplies.length > 0) {
				refIndex = branches[j].acVoltPwSupplies.findIndex(item => item.ref == serieConCpRef);
				if(refIndex > -1) {
					const ampIndex = ampsMeters.findIndex(item => item.ref == ampRef);
					if(ampIndex > -1) {
						// Save JointNode for Amperemeter
						if(ampsMeters[ampIndex].noP == branches[j].acVoltPwSupplies[refIndex].noP) iProbeLocVsAmpId[i].jointNodeP = branches[j].acVoltPwSupplies[refIndex].noP;
						if(ampsMeters[ampIndex].noP == branches[j].acVoltPwSupplies[refIndex].noN) iProbeLocVsAmpId[i].jointNodeP = branches[j].acVoltPwSupplies[refIndex].noN;
						if(ampsMeters[ampIndex].noN == branches[j].acVoltPwSupplies[refIndex].noP) iProbeLocVsAmpId[i].jointNodeN = branches[j].acVoltPwSupplies[refIndex].noP;
						if(ampsMeters[ampIndex].noN == branches[j].acVoltPwSupplies[refIndex].noN) iProbeLocVsAmpId[i].jointNodeN = branches[j].acVoltPwSupplies[refIndex].noN;
						// Save Amperemeter data to branch
						branches[j].amperemeter = ampsMeters[ampIndex];
					}
					break;
				}
			}

			if(branches[j].dcAmpPwSupplies.length > 0) {
				refIndex = branches[j].dcAmpPwSupplies.findIndex(item => item.ref == serieConCpRef);
				if(refIndex > -1) {
					const ampIndex = ampsMeters.findIndex(item => item.ref == ampRef);
					if(ampIndex > -1) {
						// Save JointNode for Amperemeter
						if(ampsMeters[ampIndex].noP == branches[j].dcAmpPwSupplies[refIndex].noP) iProbeLocVsAmpId[i].jointNodeP = branches[j].dcAmpPwSupplies[refIndex].noP;
						if(ampsMeters[ampIndex].noP == branches[j].dcAmpPwSupplies[refIndex].noN) iProbeLocVsAmpId[i].jointNodeP = branches[j].dcAmpPwSupplies[refIndex].noN;
						if(ampsMeters[ampIndex].noN == branches[j].dcAmpPwSupplies[refIndex].noP) iProbeLocVsAmpId[i].jointNodeN = branches[j].dcAmpPwSupplies[refIndex].noP;
						if(ampsMeters[ampIndex].noN == branches[j].dcAmpPwSupplies[refIndex].noN) iProbeLocVsAmpId[i].jointNodeN = branches[j].dcAmpPwSupplies[refIndex].noN;
						// Save Amperemeter data to branch
						branches[j].amperemeter = ampsMeters[ampIndex];
					}
					break;
				}
			}

			if(branches[j].acAmpPwSupplies.length > 0) {
				refIndex = branches[j].acAmpPwSupplies.findIndex(item => item.ref == serieConCpRef);
				if(refIndex > -1) {
					const ampIndex = ampsMeters.findIndex(item => item.ref == ampRef);
					if(ampIndex > -1) {
						// Save JointNode for Amperemeter
						if(ampsMeters[ampIndex].noP == branches[j].acAmpPwSupplies[refIndex].noP) iProbeLocVsAmpId[i].jointNodeP = branches[j].acAmpPwSupplies[refIndex].noP;
						if(ampsMeters[ampIndex].noP == branches[j].acAmpPwSupplies[refIndex].noN) iProbeLocVsAmpId[i].jointNodeP = branches[j].acAmpPwSupplies[refIndex].noN;
						if(ampsMeters[ampIndex].noN == branches[j].acAmpPwSupplies[refIndex].noP) iProbeLocVsAmpId[i].jointNodeN = branches[j].acAmpPwSupplies[refIndex].noP;
						if(ampsMeters[ampIndex].noN == branches[j].acAmpPwSupplies[refIndex].noN) iProbeLocVsAmpId[i].jointNodeN = branches[j].acAmpPwSupplies[refIndex].noN;
						// Save Amperemeter data to branch
						branches[j].amperemeter = ampsMeters[ampIndex];
					}
					break;
				}
			}
		}
	}

	for(let i=0; i<branches.length; i++) {
		if (typeof branches[i].amperemeter != 'undefined') {
			let ampNoP = branches[i].amperemeter.noP;
			let ampNoN = branches[i].amperemeter.noN;
			// Verify if the Amperemeter is already connected to a Real Node
			if(ampNoP == branches[i].startNode) {
				branches[i].amperemeter.noN = branches[i].endNode;
				continue;
			}
			if(ampNoP == branches[i].endNode) {
				branches[i].amperemeter.noN = branches[i].startNode;
				continue;
			}
			if(ampNoN == branches[i].startNode) {
				branches[i].amperemeter.noP = branches[i].endNode;
				continue;
			}
			if(ampNoN == branches[i].endNode) {
				branches[i].amperemeter.noP = branches[i].startNode;
				continue;
			}

			let nodeIndex = iProbeLocVsAmpId.findIndex(item => item.ampRef == branches[i].amperemeter.ref);
			let nextNode;
			let ampJoint;	// True - noP; False - noN;
			if(iProbeLocVsAmpId[nodeIndex].jointNodeP == ampNoP || iProbeLocVsAmpId[nodeIndex].jointNodeP == ampNoN) { nextNode = ampNoP; ampJoint = true; }
			if(iProbeLocVsAmpId[nodeIndex].jointNodeN == ampNoN || iProbeLocVsAmpId[nodeIndex].jointNodeN == ampNoP) { nextNode = ampNoN; ampJoint = false; }
			let thisBranch = JSON.parse(JSON.stringify(branches[i]));
			// If not, follow the branch, starting with the next component
			let end = false;
			do {
				let pos = nextNode.search('_net');
				if(pos > -1 ) {
					nodeIndex = thisBranch.resistors.findIndex(item => item.noP == nextNode);
					if(nodeIndex > -1) {
						nextNode = thisBranch.resistors[nodeIndex].noN;
						thisBranch.resistors.splice(nodeIndex,1);
						continue;
					}
					nodeIndex = thisBranch.resistors.findIndex(item => item.noN == nextNode);
					if(nodeIndex > -1) {
						nextNode = thisBranch.resistors[nodeIndex].noP;
						thisBranch.resistors.splice(nodeIndex,1);
						continue;
					}
					nodeIndex = thisBranch.coils.findIndex(item => item.noP == nextNode);
					if(nodeIndex > -1) {
						nextNode = thisBranch.coils[nodeIndex].noN;
						thisBranch.coils.splice(nodeIndex,1);
						continue;
					}
					nodeIndex = thisBranch.coils.findIndex(item => item.noN == nextNode);
					if(nodeIndex > -1) {
						nextNode = thisBranch.coils[nodeIndex].noP;
						thisBranch.coils.splice(nodeIndex,1);
						continue;
					}
					nodeIndex = thisBranch.capacitors.findIndex(item => item.noP == nextNode);
					if(nodeIndex > -1) {
						nextNode = thisBranch.capacitors[nodeIndex].noN;
						thisBranch.capacitors.splice(nodeIndex,1);
						continue;
					}
					nodeIndex = thisBranch.capacitors.findIndex(item => item.noN == nextNode);
					if(nodeIndex > -1) {
						nextNode = thisBranch.capacitors[nodeIndex].noP;
						thisBranch.capacitors.splice(nodeIndex,1);
						continue;
					}
					nodeIndex = thisBranch.dcVoltPwSupplies.findIndex(item => item.noP == nextNode);
					if(nodeIndex > -1) {
						nextNode = thisBranch.dcVoltPwSupplies[nodeIndex].noN;
						thisBranch.dcVoltPwSupplies.splice(nodeIndex,1);
						continue;
					}
					nodeIndex = thisBranch.dcVoltPwSupplies.findIndex(item => item.noN == nextNode);
					if(nodeIndex > -1) {
						nextNode = thisBranch.dcVoltPwSupplies[nodeIndex].noP;
						thisBranch.dcVoltPwSupplies.splice(nodeIndex,1);
						continue;
					}
					nodeIndex = thisBranch.acVoltPwSupplies.findIndex(item => item.noP == nextNode);
					if(nodeIndex > -1) {
						nextNode = thisBranch.acVoltPwSupplies[nodeIndex].noN;
						thisBranch.acVoltPwSupplies.splice(nodeIndex,1);
						continue;
					}
					nodeIndex = thisBranch.acVoltPwSupplies.findIndex(item => item.noN == nextNode);
					if(nodeIndex > -1) {
						nextNode = thisBranch.acVoltPwSupplies[nodeIndex].noP;
						thisBranch.acVoltPwSupplies.splice(nodeIndex,1);
						continue;
					}
					nodeIndex = thisBranch.dcAmpPwSupplies.findIndex(item => item.noP == nextNode);
					if(nodeIndex > -1) {
						nextNode = thisBranch.dcAmpPwSupplies[nodeIndex].noN;
						thisBranch.dcAmpPwSupplies.splice(nodeIndex,1);
						continue;
					}
					nodeIndex = thisBranch.dcAmpPwSupplies.findIndex(item => item.noN == nextNode);
					if(nodeIndex > -1) {
						nextNode = thisBranch.dcAmpPwSupplies[nodeIndex].noP;
						thisBranch.dcAmpPwSupplies.splice(nodeIndex,1);
						continue;
					}
					nodeIndex = thisBranch.acAmpPwSupplies.findIndex(item => item.noP == nextNode);
					if(nodeIndex > -1) {
						nextNode = thisBranch.acAmpPwSupplies[nodeIndex].noN;
						thisBranch.acAmpPwSupplies.splice(nodeIndex,1);
						continue;
					}
					nodeIndex = thisBranch.acAmpPwSupplies.findIndex(item => item.noN == nextNode);
					if(nodeIndex > -1) {
						nextNode = thisBranch.acAmpPwSupplies[nodeIndex].noP;
						thisBranch.acAmpPwSupplies.splice(nodeIndex,1);
						continue;
					}
				}
				else {
					if(nextNode == thisBranch.startNode) {
						if(!ampJoint) { branches[i].amperemeter.noN = branches[i].endNode; branches[i].amperemeter.noP = branches[i].startNode;}
						if(ampJoint) { branches[i].amperemeter.noN = branches[i].startNode; branches[i].amperemeter.noP = branches[i].endNode;}
					}
					if(nextNode == thisBranch.endNode) {
						if(!ampJoint) { branches[i].amperemeter.noN = branches[i].startNode; branches[i].amperemeter.noP = branches[i].endNode;}
						if(ampJoint) { branches[i].amperemeter.noN = branches[i].endNode; branches[i].amperemeter.noP = branches[i].startNode;}
					}
					end = true;
				}
			} while (!end);
		}
	}

	// If theres no Amperemeters, produce Ids for Currents
	// Except for branches containing a Current Power Supply
	// Amperimeter Reference will be mandatory, over Current PS Reference

	var ampMeterVsampCurr = new Array();

	// Get Currents Refs
	let ampsRefs = new Array();
	for(let i=0; i<dcAmpsPs.length; i++) { if(ampsRefs.indexOf(dcAmpsPs[i].ref) < 0) ampsRefs.push(dcAmpsPs[i].ref); }
	for(let i=0; i<acAmpsPs.length; i++) { if(ampsRefs.indexOf(acAmpsPs[i].ref) < 0) ampsRefs.push(acAmpsPs[i].ref); }
	for(let i=0; i<ampsMeters.length; i++) { if(ampsRefs.indexOf(ampsMeters[i].ref) < 0) ampsRefs.push(ampsMeters[i].ref); }

	for(let i=0; i<branches.length; i++) {
		// Increment Internal Auto Reference
		let currId = ++circuitAnalCnt.current;

		let currRef = '';
		let currNoP = branches[i].startNode;
		let currNoN = branches[i].endNode;

		if(!branches[i].amperemeter) {

			// Has Current Power Supplies?
			if(branches[i].dcAmpPwSupplies.length > 0) {
				currRef = branches[i].dcAmpPwSupplies[0].ref;
			}
			if(branches[i].acAmpPwSupplies.length > 0) {
				currRef = branches[i].acAmpPwSupplies[0].ref;
			}
		}
		else {
			// If this branch has an Amperemeter, assign its reference to the current
			// If this branch has a Current PS, save both in a separated array
			if (typeof branches[i].amperemeter != 'undefined') {

				// Has Current Power Supplies?
				if(branches[i].dcAmpPwSupplies.length > 0) ampMeterVsampCurr.push( { ampMeter: branches[i].amperemeter, currPs: branches[i].dcAmpPwSupplies[0]});
				if(branches[i].acAmpPwSupplies.length > 0) ampMeterVsampCurr.push( { ampMeter: branches[i].amperemeter, currPs: branches[i].acAmpPwSupplies[0]});

				currRef = branches[i].amperemeter.ref;
				currNoP = branches[i].amperemeter.noP;
				currNoN = branches[i].amperemeter.noN;
			}
		}
		// If there's no name, create a unique one
		if(currRef == '') {
			var alreadyExists = 0;
			var currNb = 1;
			do {
				currRef = 'I' + currNb;
				alreadyExists = ampsRefs.indexOf(currRef);
				if(alreadyExists > -1) currNb++;
			} while (alreadyExists > -1);
		}

		if(ampsRefs.indexOf(currRef) < 0) ampsRefs.push(currRef);
		let newCurr = new current(currId, currRef, currNoP, currNoN);
		currents.push(newCurr);

		// Update Branch Data
		branches[i].currentId = currId;
		branches[i].currentData = currents[currents.length - 1];
		// Update Branch Nodes (according to Current Direction)
		branches[i].startNode = currNoP;
		branches[i].endNode = currNoN;
	}

	let nodesArr = connections;
	// Compute dcAmps global nodes
	for(let i = 0; i < dcAmpsPs.length; i++){
		// Remove the index from the array
		for(let k = 0; k < nodesArr.length; k++){
			if(nodesArr[k][0] == dcAmpsPs[i].noP && nodesArr[k][1] == dcAmpsPs[i].noN ||
			nodesArr[k][0] == dcAmpsPs[i].noN && nodesArr[k][1] == dcAmpsPs[i].noP){
				nodesArr.splice(k,1);
				break;
			}
		}
		// Proccess positive Node
		if(!dcAmpsPs[i].noP.includes('_net'))
			dcAmpsPs[i].globalNoP = dcAmpsPs[i].noP;
		// If it isnt a real node find the end of the branch
		else{
			let finalNode = dcAmpsPs[i].noP;
			while(finalNode.includes('_net')){
				// Search for the virtual node
				for(let k = 0; k < nodesArr.length; k++){
					if(nodesArr[k].indexOf(finalNode) >= 0){
						if(nodesArr[k].indexOf(finalNode) == 0)
							finalNode = nodesArr[k][1];
						else
							finalNode = nodesArr[k][0];
						nodesArr.splice(k,1);
						break;
					}
				}
			}
			// Assign the globalPositiveNode
			dcAmpsPs[i].globalNoP = finalNode;
		}
		// Proccess negative Node
		if(!dcAmpsPs[i].noN.includes('_net'))
			dcAmpsPs[i].globalNoN = dcAmpsPs[i].noN;
		// If it isnt a real node find the end of the branch
		else{
			let finalNode = dcAmpsPs[i].noN;
			while(finalNode.includes('_net')){
				// Search for the virtual node
				for(let k = 0; k < nodesArr.length; k++){
					if(nodesArr[k].indexOf(finalNode) >= 0){
						if(nodesArr[k].indexOf(finalNode) == 0)
							finalNode = nodesArr[k][1];
						else
							finalNode = nodesArr[k][0];
						nodesArr.splice(k,1);
						break;
					}
				}
			}
			// Assign the globalNegativeNode
			dcAmpsPs[i].globalNoN = finalNode;
		}
	}

	// Compute acAmps global nodes
	for(let i = 0; i < acAmpsPs.length; i++){
		// Remove the index from the array
		for(let k = 0; k < nodesArr.length; k++){
			if(nodesArr[k][0] == acAmpsPs[i].noP && nodesArr[k][1] == acAmpsPs[i].noN ||
			nodesArr[k][0] == acAmpsPs[i].noN && nodesArr[k][1] == acAmpsPs[i].noP){
				nodesArr.splice(k,1);
				break;
			}
		}
		// Proccess positive Node
		if(!acAmpsPs[i].noP.includes('_net'))
		acAmpsPs[i].globalNoP = acAmpsPs[i].noP;
		// If it isnt a real node find the end of the branch
		else{
			let finalNode = acAmpsPs[i].noP;
			while(finalNode.includes('_net')){
				// Search for the virtual node
				for(let k = 0; k < nodesArr.length; k++){
					if(nodesArr[k].indexOf(finalNode) >= 0){
						if(nodesArr[k].indexOf(finalNode) == 0)
							finalNode = nodesArr[k][1];
						else
							finalNode = nodesArr[k][0];
						nodesArr.splice(k,1);
						break;
					}
				}
			}
			// Assign the globalPositiveNode
			acAmpsPs[i].globalNoP = finalNode;
		}
		// Proccess negative Node
		if(!acAmpsPs[i].noN.includes('_net'))
			acAmpsPs[i].globalNoN = acAmpsPs[i].noN;
		// If it isnt a real node find the end of the branch
		else{
			let finalNode = acAmpsPs[i].noN;
			while(finalNode.includes('_net')){
				// Search for the virtual node
				for(let k = 0; k < nodesArr.length; k++){
					if(nodesArr[k].indexOf(finalNode) >= 0){
						if(nodesArr[k].indexOf(finalNode) == 0)
							finalNode = nodesArr[k][1];
						else
							finalNode = nodesArr[k][0];
						nodesArr.splice(k,1);
						break;
					}
				}
			}
			// Assign the globalNegativeNode
			acAmpsPs[i].globalNoN = finalNode;
		}
	}

	// Update Branches start and end Nodes with Current Sources
	for(let i = 0; i<branches.length;i++){
		if(branches[i].dcAmpPwSupplies.length > 0){
			branches[i].startNode = branches[i].dcAmpPwSupplies[0].globalNoN;
			branches[i].endNode = branches[i].dcAmpPwSupplies[0].globalNoP;
			branches[i].currentData.noP = branches[i].dcAmpPwSupplies[0].globalNoN;
			branches[i].currentData.noN = branches[i].dcAmpPwSupplies[0].globalNoP;
		}
		else if(branches[i].acAmpPwSupplies.length > 0){
			branches[i].startNode = branches[i].acAmpPwSupplies[0].globalNoP;
			branches[i].endNode = branches[i].acAmpPwSupplies[0].globalNoN;
			branches[i].currentData.noP = branches[i].acAmpPwSupplies[0].globalNoN;
			branches[i].currentData.noN = branches[i].acAmpPwSupplies[0].globalNoP;
		}
	}


	// Update Nodes with Branches Objects
	for(let i=0; i<branches.length; i++) {
		let currNoP = branches[i].startNode;
		let currNoN = branches[i].endNode;
		let nodeIndex;
		nodeIndex = nodes.findIndex(item => item.ref == currNoP);
		if(nodeIndex > -1) { nodes[nodeIndex].branches.push(branches[i]); }

		nodeIndex = nodes.findIndex(item => item.ref == currNoN);
		if(nodeIndex > -1) { nodes[nodeIndex].branches.push(branches[i]); }
	}

}
//limpa as variáveis globais necessárias para correr o código múltiplas vezes
function cleanData(){
	resistors = [];
	coils = [];
	capacitors = [];
	dcVoltPs = [];
	acVoltPs = [];
	dcAmpsPs = [];
	acAmpsPs = [];
	ampsMeters = [];
	var voltMeters = [];

	nodes = [];
	branches = [];
	currents = [];
	supernodes = [];
	connections = [];

	//Manage ampmeters
	iProbeNodesLoc = [];
	iProbeNodesArr = [];
	iProbeLocVsAmpId = [];

	// Circuit analysis counters
	circuitAnalCnt = {
		node: 		0,
		branch: 	0,
		current:	0,
		fsupernode:	0,
		gsupernode:	0
	};

	// Circuit analysis global data
	circuitAnalData = {
		frequency:	{value: 0, mult: ''}
	};	

}
//junta fontes de tensão em série
function agregatePowerSupplies(){
	for(let i=0; i<branches.length; i++) {
		branches[i].setVoltPsEndNodes();
		branches[i].setEquivVoltPs();
		branches[i].setEquivImpedance(circuitAnalData.frequency.value, circuitAnalData.frequency.mult);
	}
}
//testa se dois nós são adjacentes
function adjNodes(real_nodes, a, b){
	for(let i = 0; i<branches.length; i++){
		if((real_nodes[a] == branches[i].startNode)&&(real_nodes[b] == branches[i].endNode) || (real_nodes[a] == branches[i].endNode)&&(real_nodes[b] == branches[i].startNode)) return true;
	}
	return false;
}
//testa se um ramo está ligado a um nó
function nodeBranchCon(real_nodes, a, b){
	if((branches[b].startNode == real_nodes[a]) || (branches[b].endNode == real_nodes[a])) return true;
	return false;
}
//função do meshes finder
function findMeshes(){

	const nr_nos = countNodesByType(nodes, 0);
	const nr_ramos = branches.length;
	let real_nodes = [];
	for(let i = 0; i<nodes.length; i++){
		if(nodes[i].type == 0) real_nodes.push(nodes[i].ref);
	}
	let branches_id = [];
	for(let i = 0; i<branches.length; i++){
		branches_id.push(branches[i].id);
	}
	//cria matriz de adjacencia
	let matriz_adj = [];
	for(let i = 0; i< nr_nos; i++){
		matriz_adj[i] = [];
	}
	for(let i = 0; i < nr_nos; i++){
		for(let j = 0; j < nr_nos; j++){
			if(adjNodes(real_nodes, i, j)){
				matriz_adj[i][j] = 1;
			}
			else{
				matriz_adj[i][j] = 0;
			}					
		}			
	}
	
	//cria matriz de incicendia
	let matriz_inc = [];
	for(let i = 0; i< nr_nos; i++){
		matriz_inc[i] = [];
	}
	for(let i = 0; i < nr_nos; i++){
		for(let j = 0; j < nr_ramos; j++){
			if(nodeBranchCon(real_nodes, i, j)){
				matriz_inc[i][j] = 1;
			}
			else{
				matriz_inc[i][j] = 0;
			}					
		}			
	}

	//Meshes finder

	let circuit = new MeshesFinder();
	circuit.initGraph(matriz_adj, matriz_inc, real_nodes, branches_id);
	let meshes = circuit.getMeshes();
	
	if(meshes.error.state == true) {
	  return{
		  first: true,
		  second: 3,
		  third: meshes.error.reason
	  };
	}
	
	return{
		first: false,
		second: 0,
		third: meshes.data
	}
}
//funcção que escolhe as malhas necessárias
function escolherMalhas(malhas, nr_malhas_principais){
	let malhas_flags = [];
	let ramos_fontecorrente_flags = [];
	let ramos_flags = [];
	for(let i = 0; i < malhas.length; i++){
		malhas_flags[i] = 0;
	}
	for(let i = 0; i < branches.length; i++){
		if(branches[i].dcAmpPwSupplies.length + branches[i].acAmpPwSupplies.length == 0){
			ramos_fontecorrente_flags[i] = 0;
		}
		else{
			ramos_fontecorrente_flags[i] = 1;
		}
	}
	for(let i = 0; i < branches.length; i++){
		ramos_flags[i] = 0;
	}

	let malhas_escolhidas = [];
	//inutilizar malhas com mais que uma fonte de corrente
	for(let i = 0; i < malhas.length; i++){
		let count = 0;
		for(let j = 0; j < malhas[i].length; j++){
			if(ramos_fontecorrente_flags[malhas[i][j]-1] == 1) count++;
		}
		if(count > 1) malhas_flags[i] = -1;
	}

	//Escolha de C malhas auxiliares
	for(let i = 0; i < ramos_fontecorrente_flags.length; i++){  //para cada fonte de corrente
		if(ramos_fontecorrente_flags[i] == 1){					//Se o ramo contém fonte de corrente
			let escolhido = false;
			while(!escolhido){
				for(let j = 0; j < malhas.length; j++){			//percorrer o array das malhas
					if(malhas_flags[j] == 0){					//se a malha estiver disponível
						for(let k = 0; k < malhas[j].length; k++){ //para cada ramo da malha
							if(malhas[j][k] == i+1){				//se tiver o ramo com a fonte de corrente em questão
								for(let m = 0; m < malhas[j].length; m++){
									ramos_flags[malhas[j][m]-1] = 1;
								}
								malhas_flags[j] = 1;
								let temp;
								if(branches[i].dcAmpPwSupplies.length != 0) temp = branches[i].dcAmpPwSupplies[0];
								else temp = branches[i].acAmpPwSupplies[0];
								malhas_escolhidas.push(new mesh(malhas_escolhidas.length+1, 0, malhas[j], i+1, temp));
								escolhido = true;
								break;
							}
						}
					}
					if(escolhido) break;
				}
			}			
		}
	}

	//inutilizar as restantes malhas com ramos com fontes de corrente
	for(let i = 0; i < malhas.length; i++){
		if(malhas_flags[i] == 0){
			for(let j = 0; j < malhas[i].length; j++){
				if(ramos_fontecorrente_flags[malhas[i][j]-1] == 1){
					malhas_flags[i] = -1;
					break;
				}
			}
		}
	}

	//Escolher o número de malhas principais
	let count = 0;
	let add = false;
	for(let i = 0; i < malhas.length; i++){
		if(malhas_flags[i] == 0){
			add = false;
			for(let j = 0; j < malhas[i].length; j++){
				if(ramos_flags[malhas[i][j]-1] == 0){ //contem ramo novo
					add = true;
				}
			}
			if(add){
				for(let j = 0; j < malhas[i].length; j++){
					ramos_flags[malhas[i][j]-1] = 1;
				}				
				malhas_flags[i] = 1;
				malhas_escolhidas.push(new mesh(malhas_escolhidas.length+1, 1, malhas[i], -1, []));
				count++;
			}
			else{
				malhas_flags[i] = 2;
			}
		}
		if(count == nr_malhas_principais) break; //caso tenha escolhido malhas suficientes
	}
	if(count < nr_malhas_principais){	//malhas em falta
		let count2 = 0;
		for(let c = 0; c < ramos_flags.length; c++){
			if(ramos_flags[c] == 1)	 count2++;
		}
		if(count2 == ramos_flags.length){ //ramos todos ocupados e malhas em falta
			let count3 = 0;
			for(let c = 0; c < malhas.length; c++){
				if(malhas_flags[c] == 2){
					malhas_escolhidas.push(new mesh(malhas_escolhidas.length+1, 1, malhas[c], -1, []));
					count3++;
				}
				if(count3 == nr_malhas_principais-count) break;
			}
		}
	}
	return{
		first: false,
		second: 0,
		third: malhas_escolhidas
	};
}
//função que determina se um componente está no mesmo sentido  que o ramo
/*function mesmoSentido(componente, ramo, componentesRamo){
	let aux = componente.noP;
	do{
		if(aux.search("_net") == -1){		//o nó é real
			if(aux == branches[ramo-1].endNode                    ){	//o sentido é o mesmo do ramo
				return true;
			}
			else{												//o sentido é contrário ao do ramo
				return false;
			}
		}
		else{												//o nó é virtual, procurar próximo componente
			for(let i = 0; i < componentesRamo.length; i++){
				if(componentesRamo[i].noP == aux){
					aux = componentesRamo[i].noN;
					break;
				}
				else{
					if(componentesRamo[i].noP == aux){
						aux = componentesRamo[i].noP;
						break;
					}
				}
			}
		}
	}while(true);
}*/
//função que determina a direção da malha e dos ramos
function direcaoMalha(malhas){
	malhas.forEach(malha => {
		let auxNode = branches[malha.branches[0]-1].endNode;		//começa-se por arbitrar um nó 
		if(auxNode != branches[malha.branches[1]-1].startNode && auxNode != branches[malha.branches[1]-1].endNode){  //se o primeiro ramo estiver invertido
			auxNode = branches[malha.branches[0]-1].startNode;		//atualizar auxNode
			malha.branchesDir.push(-1);								//marca-se a direção do nó com -1
		}
		else{
			malha.branchesDir.push(1);								//caso contrário, marca se com 1
		}
		for(let i = 0; i < malha.branches.length-1; i++){			//percorrer os ramos
			if(auxNode == branches[malha.branches[i+1]-1].startNode){	//caso o ramo tenha o sentido correto
				auxNode = branches[malha.branches[i+1]-1].endNode;
				malha.branchesDir.push(1);
			}
			else{
				if(auxNode == branches[malha.branches[i+1]-1].endNode){	//caso o nó tenha o sentido contrário
					auxNode = branches[malha.branches[i+1]-1].startNode;
					malha.branchesDir.push(-1);
				}
			}
		}
		//o resultado neste momento é um array malha.branchesDir, preenchido com 1 e -1, que indica se o ramo está ou não invertido, no decorrer da malha
		if(malha.type == 0){		//caso a malha em questão tenha fonte de corrente
			let trocar = false;

			let aux = branches[malha.branchWithCurSrc-1];
			let componentesRamo = [];
			componentesRamo = componentesRamo.concat(aux.dcVoltPwSupplies, aux.acVoltPwSupplies, aux.resistors, aux.coils, aux.capacitors);
			if(aux.amperemeter != undefined) componentesRamo = componentesRamo.concat(aux.amperemeter);

			if(aux.dcAmpPwSupplies != 0){ 										//fonte de corrente é dc
				if(aux.dcAmpPwSupplies[0].getGlobalNodes().fromNode == branches[malha.branchWithCurSrc-1].endNode){
					if(malha.branchesDir[malha.branches.indexOf(malha.branchWithCurSrc)] == -1) trocar = true;
				}
				else{
					if(malha.branchesDir[malha.branches.indexOf(malha.branchWithCurSrc)] == 1) trocar = true;	
				}
			}
			else{																//fonte de corrente é ac
				if(aux.acAmpPwSupplies[0].getGlobalNodes().fromNode == branches[malha.branchWithCurSrc-1].endNode){
					if(malha.branchesDir[malha.branches.indexOf(malha.branchWithCurSrc)] == -1) trocar = true;
				}
				else{
					if(malha.branchesDir[malha.branches.indexOf(malha.branchWithCurSrc)] == 1) trocar = true;	
				}
			}
			if(trocar){
				//trocar sentidos dos ramos
				for(let i = 0; i < malha.branchesDir.length; i++){
					malha.branchesDir[i] = malha.branchesDir[i] * -1;
				}
				//trocar ordem das malhas
				malha.branchesDir.reverse();
				malha.branches.reverse();
			}
		}
	});
	return{
		first: false,
		second: 0,
		third: malhas
	}
}
//função que encontra que correntes de malha atravessam cada ramo
function correntesMalhaRamos(malhas){
	branches.forEach(ramo => {
		malhas.forEach(malha => {
			for(let i = 0; i < malha.branches.length; i++){
				if(ramo.id == malha.branches[i]){
					ramo.meshCurr.push(malha.id);
					break;
				}
			}
		});
	});
}
//função que encontra os componentes da malha
function getComponents(malhas){
	malhas.forEach(malha => {		//para cada malha
		if(malha.type == 1){			//se a malha for principal
			malha.branches.forEach(ramo => {		//para cada ramo
				let aux = branches[ramo-1];
				let searchNode;
				if(malha.branchesDir[malha.branches.indexOf(ramo)] == -1){		//caso a direção do ramo for -1, contrária
					searchNode = aux.endNode;		//set do nó inicial a procurar
				}
				else{															//caso a direção do ramo seja 1, nao contrária
					searchNode = aux.startNode;		//set do nó inicial a procurar
				}
				let componentesRamo = [];
				componentesRamo = componentesRamo.concat(aux.dcAmpPwSupplies, aux.acAmpPwSupplies, aux.dcVoltPwSupplies, aux.acVoltPwSupplies, aux.resistors, aux.coils, aux.capacitors);
				if(aux.amperemeter != undefined) componentesRamo = componentesRamo.concat(aux.amperemeter);
				let cnt = componentesRamo.length;
				for(let j = 0; j < cnt; j++){		//ciclo que corre tantas vezes quantos componentes houver no ramo
					let add;
					let i;
					let ladoNegativo = false;
					for(i = 0; i < componentesRamo.length; i++){	//ciclo que procura qual o componente que tem o searchNode como uma das extermidades
						add = false;
						if(componentesRamo[i].noP == searchNode){	//caso extermidade positiva
							ladoNegativo = -1;
							searchNode = componentesRamo[i].noN;	//próximo searchNode é o nó negativo
							add = true;
							break;
						}
						else if(componentesRamo[i].noN == searchNode){	//caso extermidade negativa
							ladoNegativo = 1;
							searchNode = componentesRamo[i].noP;	//próximo searchNode é o nó positivo
							add = true;
							break;
						}						
					}
					if(add){	//caso seja para adicionar o componente
						if(aux.dcVoltPwSupplies.includes(componentesRamo[i]) || aux.acVoltPwSupplies.includes(componentesRamo[i])){ //caso o componente seja uma fonte se tensão
							malha.componentsLeft.push([componentesRamo[i], ladoNegativo]);		//adiciona ao lado esquerdo
						}
						else{																										//caso o componente não seja uma fonte de tensão
							malha.componentsRight.push([componentesRamo[i], ramo]);						//adiciona ao lado direito
						}
						componentesRamo.splice(i, 1);											//remove o componente do array de componentes do ramo
					}
				}
			});			
		}
	});
	return{
		first: false,
		second: 0,
		third: malhas
	}
}
//função que junta a informação das equações
function parseEqData(malhas){
	malhas.forEach(malha => {	//para cada malha
		if(malha.type == 1){	//se a malha é principal
			let ladoEsq = [];
			let ladoDir = [];
			if(malha.componentsLeft.length == 0) ladoEsq = 0;	//se nao há fontes o lado esquerdo é 0
			else{
				for(let i = 0; i < malha.componentsLeft.length; i++){		//para cada fonte
					ladoEsq.push([malha.componentsLeft[i][0].ref, malha.componentsLeft[i][0].value, malha.componentsLeft[i][0].unitMult, malha.componentsLeft[i][1]]); //adicionar componente ao lado esquerdo
				}	
			}
			if(malha.componentsRight.length == 0){		//caso nao hajam componentes do lado direito da equação
				return{									//erro
					first: true,
					second: 3,
					third: "Sem componentes no ramo"
				}
			}
			else{
				for(let i = 0; i < malha.componentsRight.length; i++){		//para cada componente guardar a sua info
					ladoDir.push([]);
					componente = malha.componentsRight[i];
					ladoDir[i][0] = componente[0].ref;
					ladoDir[i][1] = componente[0].value;
					ladoDir[i][2] = componente[0].unitMult;
					ladoDir[i][3] = branches[componente[1]-1].meshCurr;
					let sentidos = [];
					let self = malha.branchesDir[malha.branches.indexOf(componente[1])];
					ladoDir[i][3].forEach(curMalha => {
						sentidos.push(self * malhas[curMalha-1].branchesDir[malhas[curMalha-1].branches.indexOf(componente[1])]);
					});
					ladoDir[i][4] = sentidos;
				}					
			}
			malha.equationData = [ladoEsq, ladoDir];		//parse eq info
		}
	});
	return{
		first: false,
		second: 0,
		third: malhas
	}
}
//função que constrói equações
function buildEq(malhas){
	malhas.forEach(malha => {
		if(malha.type == 1){
			if(malha.equationData[0] == 0) malha.incognitoEq = malha.incognitoEq.concat('0');
			else{ 
				for(let i = 0; i < malha.equationData[0].length; i++){
					fonte = malha.equationData[0][i];
					if(fonte[3] == -1){
						malha.incognitoEq = malha.incognitoEq.concat('-');
					}
					else{
						if(i != 0){
							malha.incognitoEq = malha.incognitoEq.concat('+');
						}
					}
					malha.incognitoEq = malha.incognitoEq.concat(fonte[0]);
				}
			}			
			malha.incognitoEq = malha.incognitoEq.concat('=');
			for(let i = 0; i < malha.equationData[1].length; i++){
				componente = malha.equationData[1][i];
				if(i != 0) malha.incognitoEq = malha.incognitoEq.concat('+');
				malha.incognitoEq = malha.incognitoEq.concat(componente[0], '(');
				for(let j = 0; j < componente[4].length; j++){
					if(componente[4][j] == -1){
						malha.incognitoEq = malha.incognitoEq.concat('-');
					}
					else{
						if(j != 0){
							malha.incognitoEq = malha.incognitoEq.concat('+');
						}
					}
					malha.incognitoEq = malha.incognitoEq.concat('I', componente[3][j], componente[3][j]);
				}
				malha.incognitoEq = malha.incognitoEq.concat(')');
			}
		}
		


	});
	return{
		first: false,
		second: 0,
		third: malhas
	}
}
//função principal
function loadFileAsTextMCM() {

	let load = loadFile();
	if(load.first){
        alert(load.third);
		return;
	}
	cleanData();
	importData(load.third);
	manageAmpmeters();
	findNodes();
	makeBranches();
	branchCurrents();
    agregatePowerSupplies();
	
	// Identify MCM Equations
	var MEquaCnt = branches.length - countNodesByType(nodes, 0) + 1 - (dcAmpsPs.length + acAmpsPs.length);

	alert("São precisas " + MEquaCnt + " equações");

	//Meshes finder
	let circuito_malhas = findMeshes();
	if(circuito_malhas.first){
		let erro = '';
		circuito_malhas.third.forEach(e => {
			erro = erro + '\n' + e;
		});
		alert("Erro ao criar malhas!\nErros:\n" + erro);
		return;
	}
	let malhas_arr = [];
	circuito_malhas.third.order.forEach(ordem => {
		circuito_malhas.third.order[circuito_malhas.third.order.indexOf(ordem)].forEach(malha => {
			malhas_arr.push(malha);
		});
	});

	//Algoritmo de escolha de malhas	
	let malhas_escolhidas = escolherMalhas(malhas_arr, MEquaCnt);
	if(malhas_escolhidas.first){
		alert(malhas_escolhidas.third);
		return;
	}

	//atualizar direções de malha e ramos
	malhas_escolhidas = direcaoMalha(malhas_escolhidas.third);
	if(malhas_escolhidas.first){
		alert(malhas_escolhidas.third);
		return;
	}

	//correntes de malha que atravessam cada ramo
	correntesMalhaRamos(malhas_escolhidas.third);
	if(malhas_escolhidas.first){
		alert(malhas_escolhidas.third);
		return;
	}

	//encontrar componentes da malha
	malhas_escolhidas = getComponents(malhas_escolhidas.third);
	if(malhas_escolhidas.first){
		alert(malhas_escolhidas.third);
		return;
	}

	//construir equações
	malhas_escolhidas = parseEqData(malhas_escolhidas.third);
	if(malhas_escolhidas.first){
		alert(malhas_escolhidas.third);
		return;
	}

	malhas_escolhidas = buildEq(malhas_escolhidas.third);
	if(malhas_escolhidas.first){
		alert(malhas_escolhidas.third);
		return;
	}
	/** Rearrange equation system in order to the unkown variables
	 * 1 - Get the Unknown Variables
	 * 2 - Get the rest of the nodes
	 * 3 - Find the rest of the nodes in the KNL Equations
	 * 4 - Replace each node for its equivalent expression
	 * 	   until the unknown variable is reached
	 */

/*

    var results = new Array();
	var inOrderEquations = new Array();

	// Get nodes except system unknowns
	var otherNodes = new Array();
	for (let i = 0; i < knlEquationsReg.length; i++){
		if(!equationUnknowns.includes(knlEquationsReg[i].node))
			otherNodes.push(knlEquationsReg[i].node)
	}

	// Create the nodes substitutions to insert in the system equation solver
	// Nodes CANNOT have more than 2 letters in the equations
	var nodeSubstitutions = new Array();
	var currentNodes = knlEquationsReg.map(a => a.node);
	var doubleLetterNodes = new Array();
	for(let i = 0; i< currentNodes.length; i++){
		if(currentNodes[i].length > 1){
			doubleLetterNodes.push(currentNodes[i]);
			currentNodes.splice(i,1);
			i--;
		}
	}
	for(let i = 0; i< doubleLetterNodes.length; i++){
		let obj = {
				prevNode: doubleLetterNodes[i],
				subsNode: findNewNode(currentNodes)
			};
		nodeSubstitutions.push(obj);
		currentNodes.push(obj.subsNode);
	}


	// Find non-variable nodes in the KNL Equations
	var nonVarFound = new Array();
	for (let i = 0; i < knlEquaCnt; i++){
		for(let j = 0; j < otherNodes.length; j++){
			if(knlEquationsVl[i].includes(otherNodes[j]))
				nonVarFound.push(otherNodes[j]);
		}
	}

	// Fix the exponentials
	for(let i = 0; i < knlEquationsVl.length; i++){
		knlEquationsVl[i] = findSubstringIndexes(knlEquationsVl[i],'e');
	}

	// Get the known node voltages (grounded supernodes)
	if(nodesInGroundedSN.length > 0){
		// Get equation index
		let gSNindex = knlEquationsVl.length;
		for(let i = 0; i < nodesInGroundedSN.length; i++){
			for(let j = gSNindex; j< knlEquations.length; j++){
				if(knlEquations[j].includes(nodesInGroundedSN[i])){
					let eq = parsegroundedSN(knlEquations[j],nodesInGroundedSN[i]);
					let nodeObj = {
						node: nodesInGroundedSN[i],
						equation: eq
					};
					inOrderEquations.push(nodeObj);
					nodeObj = {
						node: nodesInGroundedSN[i],
						value: eq
					}
					results.push(nodeObj);
				}
			}
		}
	}


	// Get direct nodes equations
	if(nonVarFound.length>0){
		// Remove duplicated nodes
		nonVarFound = [... new Set(nonVarFound)];
		// Get the Supernodes equations
		var nodesEq = new Array();
		for(let i = knlEquaCnt; i <knlEquationsVl.length; i++){
			nodesEq.push(knlEquationsVl[i]);
		}

		// Go through non variable nodes
		let nodeInstances = new Array();
		// Find the direct relationships first
		for(let i = 0; i < nonVarFound.length; i++){
			// Clear array
			nodeInstances = [];
			// Search the node instances
			for(let j = 0; j < nodesEq.length; j++ ){
				if(nodesEq[j].includes(nonVarFound[i]))
					nodeInstances.push(nodesEq[j]);
			}

			// Try to get a direct relation
			for(let j = 0; j < nodeInstances.length; j++){
				for(let unk = 0; unk < equationUnknowns.length; unk++){
					// If the unknown is found create the equation
					if(nodeInstances[j].includes(equationUnknowns[unk])){
						// Separate terms
						let str = nodeInstances[j];
						str = str.split('=');
						//Check if the node is the first term;
						if(str[0].includes(nonVarFound[i])){
							let nodeObj = {
								node: nonVarFound[i],
								equation: '('+str[1]+')'
							};
							// Save equation
							inOrderEquations.push(nodeObj);
							// Break From cycles
							unk = equationUnknowns.length;
							j = nodeInstances.length;
						}
						else{
							let nodeObj = {
								node: nonVarFound[i],
								equation: parseDirectEquation(nodeInstances[j],nonVarFound[i])
							}
							// Save equation
							inOrderEquations.push(nodeObj);
							// Break From cycles
							unk = equationUnknowns.length;
							j = nodeInstances.length;
						}
					}
				}
			}
		}


		var nodesLeft = new Array();
		var nodesEqleft = new Array();
		// Get the indirect nodes left for substitution
		for(let i = 0; i < nonVarFound.length; i++ ){
			if(!inOrderEquations.some(el => el.node === nonVarFound[i]))
				nodesLeft.push(nonVarFound[i]);
		}
		// Get the indirect nodes equations
		for(let i = 0; i < nodesLeft.length; i++){
			for(let j = 0; j < nodesEq.length; j++ ){
				if(nodesEq[j].includes(nodesLeft[i]))
					nodesEqleft.push(nodesEq[j]);
			}
		}
		// Remove duplicated
		nodesEqleft = [... new Set(nodesEqleft)];

		while(nodesLeft.length > 0){
			// Cycle through nodes left
			for(let i = 0; i < nodesLeft.length; i++){
				let nodeEq = [];
				// Get the node Equations
				for(let j = 0; j < nodesEqleft.length; j++){
					if(nodesEqleft[j].includes(nodesLeft[i]))
						nodeEq.push(nodesEqleft[j]);
				}

				// Try to find an ordered node equation
				for(let j = 0; j < nodeEq.length; j++){
					for(let k = 0; k < inOrderEquations.length; k++){
						if(nodeEq[j].includes(inOrderEquations[k].node)){
							// Replace the node with its expression
							nodeEq[j] = nodeEq[j].replace(inOrderEquations[k].node, inOrderEquations[k].equation);
							let str = parseNonDirectEquation(nodeEq[j],nodesLeft[i]);
							// Add to the parsed List
							let nodeObj = {
								node: nodesLeft[i],
								equation: str
							}
							inOrderEquations.push(nodeObj);
							nodesLeft.splice(i,1);
							i--;
							// Break from cycles
							k = inOrderEquations.length;
							j = nodeEq.length;
						}
					}
				}
			}
		}
	}

	// Get the KNL equations
	var knlSubstitutions = new Array();
	for(let i=0; i < knlEquaCnt; i++){
		knlSubstitutions.push(knlEquationsVl[i]);
	}

	// Make the substitutions
	for(let i = 0; i < knlSubstitutions.length; i++){
		for(let j = 0; j < inOrderEquations.length; j++){
			if(knlSubstitutions[i].includes(inOrderEquations[j].node)){
				let reg = new RegExp(inOrderEquations[j].node, "g");
				knlSubstitutions[i] = knlSubstitutions[i].replace(reg, inOrderEquations[j].equation);
			}
		}
	}

	// Remove the " = 0" from the equations
	var equationArray = new Array();
	for(let i = 0; i < knlSubstitutions.length; i++){
		let aux = knlSubstitutions[i].split(" = ");
		equationArray.push(aux[0]);
	}

	/* Agregate Equation Systems
		Put together the equations with common variables
		Necessary for the math.js equation solver
	*/
/*
	var equationSystems = new Array();
	var eqSystem = new Array();

	for(let i = 0; i < equationArray.length; i++){
		// Check the existing Unknowns in the equation
		let eqVar = checkEquationUnk(equationArray[i],equationUnknowns);
		let nVars = eqVar.length;
		// An equation system has always more than one variable
		if(nVars > 1){
			eqSystem.push(equationArray[i]);
			equationArray.splice(i,1);
			i--;
			// Find the other equations
			for(let k = 0; k < equationArray.length; k++){
				// If the equation includes some of the variables
				if(eqVar.some(v => equationArray[k].includes(v))){
					// Add to the array
					eqSystem.push(equationArray[k]);
					// Remove it
					equationArray.splice(k,1);
					k--;
				}
			}
			equationSystems.push(eqSystem);
			eqSystem = [];
		}
	}
*/
	/** Results object:
	 * node (string)
	 * value (string)/number
	 */

    /*

	let realNodesobj = nodes.filter(function(item) {return  item.type === 0;})
	let realNodes = realNodesobj.map(item => item.ref); 
	let nodeCnt = realNodes.length;
	let realNodesReg = new Array()
	realNodesReg = realNodesReg.concat(realNodes);
	var eqSystem = new linearEqSystem();
	// Evaluate the single variable equations
	for(let i = 0; i < equationArray.length; i++){
		eqSystem = new linearEqSystem();
		equationArray[i] = fixDoubleNamedNodes(equationArray[i],nodeSubstitutions);
		eqSystem.addEquation(equationArray[i]);
		eqSystem.buildSystem();
		let res = solve(eqSystem.coefMatrix, eqSystem.consMatrix, eqSystem.varMatrix, 3);

		let index = nodeSubstitutions.findIndex(x => x.subsNode === res.variables._data[0][0]);
		if( index != -1)
			res.variables._data[0][0] = nodeSubstitutions[index].prevNode;

		let obj = {
			node: res.variables._data[0][0],
			value: parseComplex(res.result._data[0][0]),
			unit: "V"
		}
		results.push(obj);
	}

	// Solve the equation systems
	var subEqSystem = new linearEqSystem();
	for(let i = 0; i < equationSystems.length; i++){
		for(let k = 0; k < equationSystems[i].length; k++){
			equationSystems[i][k] = fixDoubleNamedNodes(equationSystems[i][k],nodeSubstitutions);
			subEqSystem.addEquation(equationSystems[i][k]);
		}
		subEqSystem.buildSystem();
		let res = solve(subEqSystem.coefMatrix, subEqSystem.consMatrix, subEqSystem.varMatrix, 3);
		for(let k = 0; k<res.variables._data.length; k++){
			let index = nodeSubstitutions.findIndex(x => x.subsNode === res.variables._data[k][0]);
			if( index != -1)
				res.variables._data[k][0] = nodeSubstitutions[index].prevNode;
			let obj = {
				node: res.variables._data[k][0],
				value: parseComplex(res.result._data[k][0]),
				unit: "V"
			}
			results.push(obj);
		}
	}

	// Get Supernodes remaining equations
	var remainingSN = knlEquationsVl.slice(knlEquaCnt);
	//Substitute the known node voltages
	while(remainingSN.length > 0){
		for(let i = 0; i < remainingSN.length; i++){
			for(let k = 0; k < results.length; k++){
				if(remainingSN[i].includes(results[k].node)){
					remainingSN[i] = remainingSN[i].replace(results[k].node,results[k].value);
					let varNode = getSNnode(remainingSN[i],realNodesReg);
					let auxStr = parseDirectEquation(remainingSN[i],varNode);
					let parser = math.parser();
					let obj = {
						node: varNode,
						value: parser.evaluate(auxStr).toString(),
						unit: "V"
					}
					results.push(obj);
					remainingSN.splice(i,1);
					i = remainingSN.length;
					k = results.length;
				}

			}
		}
	}

	// Get currents results (For currents outside isolated VS branches)
	let resultsCurr = new Array();
	let parseCurr = math.parser();
	for(let i = 0; i<currents.length; i++){
		
		let obj = {
			ref: currents[i].ref,
			value: 0,
			eq: '',
			unit: 'A',
			fromSN: false,
			fromAC: false
		}

		if(currents[i].value == null && currents[i].ohmEquation != null){
			let equation = math.parse(currents[i].ohmEquation.plainEqVl);
			let eq = math.simplify(equation).toTex();
			equation = math.simplify(equation).toString();
			eq = currents[i].ref + " = " + eq;
			// Get TeX Equation
			for(let k = 0; k < realNodes.length; k++){        
				eq = eq.replace(new RegExp(realNodes[k], 'g'),"V_{"+realNodes[k]+'}');
			}
			// Compute Value
			for(let k = 0; k< results.length; k++){
				if(equation.includes(results[k].node))
					equation = equation.replace(results[k].node,'('+results[k].value+')');
			}
			let currentRes = parseCurr.evaluate(equation).toString();
			obj.value = currentRes;
			obj.eq = eq;
		}
		else{
			obj.value = currents[i].value;
			obj.eq = currents[i].ref + " = " + currents[i].value;
			if(obj.value!= null)
				obj.fromAC = true;
		}
		resultsCurr.push(obj);
	}

	// Get the remaining currents (from SN branches)
	while(resultsCurr.filter(function(item) {return  item.value === null;}).length > 0){
		for(let i = 0; i< resultsCurr.length; i++){
			if(resultsCurr[i].value == null){
				//Find the current ID
				let index = currents.findIndex(curr => curr.ref == resultsCurr[i].ref);
				for(let k = 0; k< currents[index].nodeEquations.length; k++){
					let nodeEq = currents[index].nodeEquations[k];
					let isValid = true;
					let neededCurrents = new Array();
					let neededCurrValues = new Array();
					for(let j = 0; j< nodeEq.eqObj.minusCurr.length; j++){
						// Check if each current already has value
						let currIndex = resultsCurr.findIndex(curr => curr.ref == nodeEq.eqObj.minusCurr[j]);
						if(nodeEq.eqObj.minusCurr[j] != resultsCurr[i].ref){
							neededCurrents.push(nodeEq.eqObj.minusCurr[j]);
							neededCurrValues.push(resultsCurr[currIndex].value);
						}
						if(resultsCurr[currIndex].value == null && nodeEq.eqObj.minusCurr[j] != resultsCurr[i].ref){
							isValid = false;
							break;
						}
					}
					for(let j = 0; j< nodeEq.eqObj.plusCurr.length; j++){
						let currIndex = resultsCurr.findIndex(curr => curr.ref == nodeEq.eqObj.plusCurr[j]);
						if(nodeEq.eqObj.plusCurr[j] != resultsCurr[i].ref){
							neededCurrents.push(nodeEq.eqObj.plusCurr[j]);
							neededCurrValues.push(resultsCurr[currIndex].value);
						}
						if(resultsCurr[currIndex].value == null && nodeEq.eqObj.plusCurr[j] != resultsCurr[i].ref){
							isValid = false;
							break;
						}
					}

					// If the current is valid, assign the equation and compute value
					if(isValid == true){
						resultsCurr[i].eq = math.parse(nodeEq.fullPlainEq).toString();
						let equation = nodeEq.plainEq;
						let scope = {};
						for(let j = 0; j< neededCurrents.length; j++){
							// Create scope
							//scope[neededCurrents[j]] = neededCurrValues[j];
							equation = equation.replace(neededCurrents[j],'('+neededCurrValues[j]+')');
						}
						resultsCurr[i].value = math.evaluate(equation).toString();
						resultsCurr[i].fromSN = true;
						// Move to the last index
						resultsCurr.push(resultsCurr.splice(i, 1)[0]);
						break;
					}
				}
			}
		}
	}


	// Set up a scale for node voltages results
	let nodeVoltages = results.map(a => a.value);
	// Remove parenthesis
	for(let i = 0; i< nodeVoltages.length; i++){
		nodeVoltages[i] = nodeVoltages[i].replace(/[()]/g, '');
	}
	let nodeUnits = new Array();
	// Check the values magnitude
	for(let i = 0; i < nodeVoltages.length; i++){
		// Check number of zeros after comma
		let value = Math.abs(parseFloat(nodeVoltages[i]));
		let decimals = - Math.floor( Math.log(value) / Math.log(10) + 1);
		if(decimals < 2 || value >= 1 || value == 0)
			nodeUnits.push("V");
		else if(decimals < 4 && value < 1)
			nodeUnits.push("mV");
		else
			nodeUnits.push("uV");
	}

	// Get the most frequent unit in the results
	let unit = findMode(nodeUnits);

	// Do the conversion and round it to 3 decimal places
	for(let i = 0; i < nodeVoltages.length; i++){
		results[i].value = voltConversion(nodeVoltages[i],unit,3);
		results[i].unit = unit;
	}


	// Set up a scale for currents results
	nodeUnits = [];
	// Check the values magnitude
	for(let i = 0; i < resultsCurr.length; i++){
		// Check number of zeros after comma
		let value = Math.abs(parseFloat(resultsCurr[i].value));
		let decimals = - Math.floor( Math.log(value) / Math.log(10) + 1);
		if(decimals < 2 || value >= 1 || value == 0)
			nodeUnits.push("A");
		else if(decimals < 4 && value < 1)
			nodeUnits.push("mA");
		else
			nodeUnits.push("uA");
	}

	// Get the most frequent unit in the results
	unit = findMode(nodeUnits);

	// Do the conversion and round it to 3 decimal places
	for(let i = 0; i < resultsCurr.length; i++){
		resultsCurr[i].value = ampConversion(resultsCurr[i].value.toString(),unit,3);
		resultsCurr[i].unit = unit;
	}	
	
	// Prepare supernodes Equations for steps (Floating)
	let snEquations = knlEquations.splice(knlEquaCnt);
	let doneNodes = new Array();
	let SNFobjects = new Array();
	
	for(let i = 0; i< supernodes.length; i++){
		if(supernodes[i].type == 1){
			supernodes[i].SNFs = new Array();
			let nodesInSN = supernodes[i].nodes.map(item => item.ref);
			// Get the Unknown Node
			let unknown = nodesInSN.filter(element => equationUnknowns.includes(element));
			unknown = unknown[0];
			// Remove it from nodes
			realNodes = realNodes.filter(e => e !== unknown);
			while(doneNodes.length < supernodes[i].nodes.length-1){
				for(let k = 0; k < snEquations.length; k++){
					if(snEquations[k].includes(unknown)){
						// Find the other node to solveFor
						let node = realNodes[searchNode(snEquations[k],realNodes)];
						let expr = algebra.parse(snEquations[k]);
						let obj = {
							ref: node,
							equation: '('+expr.solveFor(node).toString()+')'
						};
						SNFobjects.push(obj);
						doneNodes.push(node);
						snEquations.splice(k,1);
						k--;
					}
					else if(searchNode(snEquations[k],doneNodes) > -1){
						let nodeindex = searchNode(snEquations[k],doneNodes);
						snEquations[k] = snEquations[k].replace(doneNodes[nodeindex], SNFobjects[nodeindex].equation)
					}
				}
			}

			for(let j = 0; j<SNFobjects.length; j++){
				let aux = math.parse(SNFobjects[j].equation);
				SNFobjects[j].equation = math.simplify(aux,{}, {exactFractions: false}).toTex();
				SNFobjects[j].equation = SNFobjects[j].equation.replace("+-","-");
				SNFobjects[j].equation = SNFobjects[j].equation.replace("--","+");
			}
			supernodes[i].SNFs = SNFobjects;
			SNFobjects = [];
			doneNodes = [];
		}
	}

	// Prepare supernodes Equations for steps (Grounded)
	let SNGobjects = new Array();
	let nodesToSearch = new Array();

	for(let i = 0; i< supernodes.length; i++){
		if(supernodes[i].type == 0){
			supernodes[i].SNGs = new Array();
			let foundNodes=new Array();
			// Get all nodes
			nodesToSearch = supernodes[i].nodes.map(item => item.ref);
			// Start off with ground
			let gndIndex = supernodes[i].nodes.findIndex(node => node.ref == "gnd");
			nodesToSearch.splice(nodesToSearch.indexOf("gnd"),1);
			let completeFlag = 0;
			for(let k = 0; k< supernodes[i].nodes[gndIndex].branches.length; k++){
				let branch = supernodes[i].nodes[gndIndex].branches[k];
				if(nodesToSearch.includes(branch.startNode)){
					foundNodes.push(branch.startNode);
					let equation = "V_{" + branch.startNode + "} = 0";
					for(let j = 0; j< branch.endVoltPsEndNodes.length; j++){
						if(branch.endVoltPsEndNodes[j].endNode == branch.startNode){
							equation += " + " + branch.endVoltPsEndNodes[j].voltPsRef;
							completeFlag = 1;
						}
						else{
							equation += " - " + branch.endVoltPsEndNodes[j].voltPsRef;
							completeFlag = 1;
						}

					}
					if(completeFlag == 1){
						let obj = {
							node: branch.startNode,
							equation: equation
						}
						SNGobjects.push(obj);
						completeFlag = 0;
					}
				}
				else if( nodesToSearch.includes(branch.endNode)){
					foundNodes.push(branch.endNode);
					let equation = "V_{" + branch.endNode + "} = 0";
					for(let j = 0; j<  branch.endVoltPsEndNodes.length; j++){
						if( branch.endVoltPsEndNodes[j].endNode == branch.endNode){
							equation += " + " +  branch.endVoltPsEndNodes[j].voltPsRef;
							completeFlag = 1;
						}
						else{
							equation += " - " +  branch.endVoltPsEndNodes[j].voltPsRef;
							completeFlag = 1;
						}
					}
					if(completeFlag == 1){
						let obj = {
							node: branch.endNode,
							equation: equation
						}
						SNGobjects.push(obj)
						completeFlag = 0;
					}
				}
			}

			// Remove the nodes with a equation already created
			for(let k = 0; k<foundNodes.length; k++){
				nodesToSearch.splice(nodesToSearch.indexOf(foundNodes[k]),1);
			}
			// Complete the grounded supernode remaining nodes
			for(let k = 0; k<nodesToSearch.length; k++){
				// Find node object
				let nodeIndex = supernodes[i].nodes.findIndex(node => node.ref == nodesToSearch[k]);
				for(let j = 0; j< supernodes[i].nodes[nodeIndex].branches.length; j++){
					let branch = supernodes[i].nodes[nodeIndex].branches[j];
					// Find a connection
					let findNext = SNGobjects.findIndex(n => n.node == branch.startNode);
					let foundisolPS = false;
					if(branch.dcVoltPwSupplies.length > 0){
						if(isolatedPsReg.findIndex(item => item.ref == branch.dcVoltPwSupplies[0].ref) > -1)
							foundisolPS = true;
					} 
					if(branch.acVoltPwSupplies.length > 0 && foundisolPS == false){
						if(isolatedPsReg.findIndex(item => item.ref == branch.acVoltPwSupplies[0].ref) > -1)
							foundisolPS = true;
					} 
					if(findNext > -1 && foundisolPS == true){
						let equation = "V_{" + nodesToSearch[k] + "} = V_{" + SNGobjects[findNext].node +"}";
						for(let f = 0; f<  branch.endVoltPsEndNodes.length; f++){
							if( branch.endVoltPsEndNodes[f].endNode == nodesToSearch[k])
								equation += " + " +  branch.endVoltPsEndNodes[f].voltPsRef;
							else
								equation += " - " +  branch.endVoltPsEndNodes[f].voltPsRef;
						}
						let obj = {
							node: nodesToSearch[k],
							equation: equation
						}
						SNGobjects.push(obj);
						break;
					}
					findNext = SNGobjects.findIndex(n => n.node == branch.endNode);
					if(findNext > -1 && foundisolPS == true){
						let equation = "V_{" + nodesToSearch[k] + "} = V_{" + SNGobjects[findNext].node +"}";
						for(let f = 0; f<  branch.endVoltPsEndNodes.length; f++){
							if( branch.endVoltPsEndNodes[f].endNode == nodesToSearch[k])
								equation += " + " +  branch.endVoltPsEndNodes[f].voltPsRef;
							else
								equation += " - " +  branch.endVoltPsEndNodes[f].voltPsRef;
						}
						let obj = {
							node: nodesToSearch[k],
							equation: equation
						}
						SNGobjects.push(obj);
						break;
					}
				}
			}
			supernodes[i].SNGs = SNGobjects;
			SNGobjects = [];
		}
	}

	// Compute any remaining equations
	let leftNodes = new Array();
	for(let i = 0; i< isolatedPsElemReg.length; i++){
		if((inOrderEquations.findIndex(x => x.node == isolatedPsElemReg[i]) < 0) && 
		   (!equationUnknowns.includes(isolatedPsElemReg[i])) && (isolatedPsElemReg[i]!="gnd"))
				leftNodes.push(isolatedPsElemReg[i])
	}

	for(let j = 0; j< leftNodes.length; j++){
		for(let i = 0; i< nodesEq.length; i++){
			if(nodesEq[i].includes(leftNodes[j])){
				for(let k = 0; k<inOrderEquations.length; k++){
					if(nodesEq[i].includes(inOrderEquations[k].node)){
						let strEquation = nodesEq[i];
						strEquation = strEquation.replace(inOrderEquations[k].node, inOrderEquations[k].equation);
						strEquation = algebra.parse(strEquation);
						strEquation = strEquation.solveFor(leftNodes[j]).toString();
						
						let obj = {
							node: leftNodes[j],
							equation: strEquation
						}
						inOrderEquations.push(obj);
						break;
					}
				}
			}
		}
	}

	// Get Knl Currents Data
	let knlCurrData = outCurrentsKNL(knlCurrEquations,supernodes);

	// Fix decimal places at substitutions
	for(let i = 0; i< knlSubstitutions.length; i++)
		knlSubstitutions[i] = fixDecimals(knlSubstitutions[i],3);
	for(let i = 0; i< knlEquationsVl.length; i++)
		knlEquationsVl[i] = fixDecimals(knlEquationsVl[i],3);
	for(let i = 0; i< resultsCurr.length; i++)
		resultsCurr[i].eq = fixDecimals(resultsCurr[i].eq,3);
	
	// Get equation system
	let knlSimplified = new Array();
	knlSimplified = knlSimplified.concat(knlSubstitutions);
	math.type.Fraction.REDUCE = false;
	for(let i = 0; i< knlSimplified.length; i++){
		// Remove = 0
		knlSimplified[i] = knlSimplified[i].replace(/\s+/g, '');
		knlSimplified[i] = knlSimplified[i].replace('=0', '');
		knlSimplified[i] = math.parse(knlSimplified[i]);
		knlSimplified[i] = math.simplify(knlSimplified[i]).toString();
		knlSimplified[i] = fixEquation(knlSimplified[i]);
		knlSimplified[i] = math.simplify(knlSimplified[i]).toTex();
		knlSimplified[i] = fixEquation(knlSimplified[i]);
		knlSimplified[i] = fixDecimals(knlSimplified[i],3);
	}

	// Substitute Node names with their Voltages
	knlSimplified = nodesToVoltagesTex(knlSimplified,realNodesReg);

	// Get Equivalent Impedances and Voltages
	let equivBranchesR = branches.map(branch => branch.equivImpedance);
	let equivBranchesV = branches.map(branch => branch.equivVoltPs);
	let equivEndNodes = {
		startNodes : branches.map(branch => branch.startNode),
		endNodes   : branches.map(branch => branch.endNode)
	};
	
	// Debug JSON Output
	var circuitFrequency = { value: circuitAnalData.frequency.value, mult: circuitAnalData.frequency.mult }
	var componentsObj = { resistors: resistors, coils: coils, capacitors: capacitors, dcVoltPs: dcVoltPs, dcAmpsPs: dcAmpsPs, acVoltPs: acVoltPs, acAmpsPs: acAmpsPs };
	var probesObj = { amperemeters: ampsMeters, voltmeters: voltMeters };
	var analysisObj = {
		_00_circuitFreq: circuitFrequency,
		_01_currents: currents,
		_02_isolatedPs: isolatedPsReg,
		_03_supernodes: {
			_01_data: supernodes,
			_02_floatingSnInfo: {
				_01_endPoints: superNodesEndPointsReg,
				_02_fullVoltRelat: superNodeFloatingVoltRelationReg,
				_03_filteredVoltRelat: superNodeFloatingVoltRelation
			}
		},
		_04_bestGndPos: bestSuperNodeGndPos,
		_05_knlEquations: {
			_01_equatCnt: {
					_01_nodesCnt: realNodesElem.length,
					_02_isolPsCnt: isolatedPsReg.length,
					_03_calc: 'knlEq = ' + realNodesElem.length + ' - 1 - ' + isolatedPsReg.length,
					_03_equatCnt: knlEquaCnt,
					_04_eqUnknowns: equationUnknowns
			},
			_02_origEquatElem: knlFilteredEquations,
			_03_allKnlEquations: knlEquationsReg,
			_04_substitutions: stepSubstitutionsReg,
			_05_workedEquationElem: knlCurrEquations,
			_06_workedOhmEqSubsElem: knlSystemEquationsReg,
			_07_fullKnlEquatSytem: knlEquations,
			_08_knlEquationsVl: knlEquationsVl,
			_09_substitutions: knlSubstitutions,

		},
		_06_resultsData: {
			_01_orderedCurrents: knlOrderedCurrents,
			_02_simplifiedEqSystem: knlSimplified,
			_03_nodeVoltages:results,
			_04_circuitCurrents: resultsCurr
		}

	};
	var outputJson = {
		_01_components: componentsObj,
		_02_probes: probesObj,
		_03_nodes: nodes,
		_04_branches: branches,
		_05_analysisObj: analysisObj
	};

	let jsonStr = JSON.stringify(outputJson);

    */
	
	/*var treeWrap = document.getElementById("results-json");
	treeWrap.innerHTML='';
	var tree = jsonTree.create({}, treeWrap);
	var temp;
	try {
		temp = JSON.parse(jsonStr);
	} catch(e) {
		alert(e);
	}
	tree.loadData(temp);*/

    /*

	// TeX Fundamental Vars
	let N = nodeCnt-1-isolatedPsReg.length;
	let I = acAmpsPs.length+dcAmpsPs.length;
	TeX += "\\section{Fundamental Variables}\r\n\r\n\\begin{table}[hbt!]\r\n\\centering\r\n\\begin{tabular}{clclclc}\r\n";
	TeX += "\\textbf{Branches {[}R{]}}&&\\textbf{Nodes {[}N{]}}&&\\textbf{Isolated Voltage Sources {[}T{]}}&&\\textbf{Equations {[}E{]}} \\\\\r\n";
	TeX += "R="+branches.length+"&&N="+nodeCnt+"&&T="+isolatedPsReg.length+"&&E=N-T-1="+N+"\r\n\\end{tabular}\r\n\\end{table}\r\n\r\n";

	// TeX Circuit Information
	TeX += "\\section{Circuit Information}\r\n\r\n\\begin{table}[h!]\r\n\\centering\r\n\\begin{tabular}{clclclc}\r\n";
	TeX += "\\textbf{Frequency {[}F{]}} &  & \\textbf{Current Sources {[}I{]}} &  & \\textbf{Ammeters {[}A{]}} &  & \\textbf{Simulation {[}AC\/DC{]}} \\\\\r\n";
	TeX += "F="+circuitAnalData.frequency.value+"\\;"+circuitAnalData.frequency.mult+" & & I="+I;
	TeX += " & & "+ampsMeters.length+"\/"+currents.length+" & &";
	if(circuitAnalData.frequency.value == 0)
	 	TeX += "DC\r\n\\end{tabular}\r\n\\end{table}\r\n\r\n\\pagebreak";
	else
		TeX += "AC\r\n\\end{tabular}\r\n\\end{table}\r\n\r\n\\pagebreak";
	
	let knlV1 = knlEquationsVl;
	// Get Equation System Steps
	let step1 = outStep1(knlOrderedCurrents.original);
	let step2 = outStep2(knlOrderedCurrents.subs);
	let step3 = outStep3(currents,knlCurrData.second);
	let step4 = outStep4(knlEquations,realNodesReg);
	let step5 = outStep5(knlV1.splice(0,knlEquations.length),realNodesReg);
	let step6 = outStep6(supernodes,equationUnknowns);
	
	// Print Output Data
	$('#fundamentalVars').html(outCircuitFundamentals(branches.length, nodeCnt, isolatedPsReg.length));
	$('#circuitInfo').html(outCircuitInfo(circuitAnalData.frequency,acAmpsPs.length+dcAmpsPs.length,ampsMeters.length,currents.length));
	let supernodesOutput = outSupernodes(supernodes, inOrderEquations, knlV1);
	$('#supernodes').html(supernodesOutput.first);
	$('#KNLEquations').html(knlCurrData.first);
	let canvasObjects = createCanvasCurrents(knlCurrData.second);
	let currentsInfoOutput = outCurrentsInfo(currents, branches);
	$('#currentsInfo').html(currentsInfoOutput.first);
	let equivImpOutput = outEqImpedances(equivBranchesR,equivBranchesV,equivEndNodes);
	$('#eqImpedances').html(equivImpOutput.first);
	let equationSystemOutput = outEquationSystem(knlSimplified, step1.first, step2.first, step3.first, step4.first, step5.first, step6.first);
	$('#eqSys').html(equationSystemOutput.first);
	let resultsOutput = outResults(results, resultsCurr)
	$('#resultsVoltages').html(resultsOutput.first);
	$('#buttonShowAll').html(outShowAllBtn(supernodesOutput.second));

	// TeX Data
	if(supernodes.length>0)
		TeX += "\\section{Supernodes}\r\n\r\n"+supernodesOutput.third+"\\pagebreak";
	TeX += "\\section{Circuit Currents}\r\n\r\n\\subsection{General information}\r\n\r\n";
	TeX += "\\begin{table}[ht]\r\n\\caption{List of the circuit currents and its properties\/components}\r\n\\centering\r\n\\begin{tabular}{cccc}\r\n";
	TeX += "\\textbf{Reference} & \\textbf{Start Node} & \\textbf{End Node} & \\textbf{Components} \\\\ \\hline\r\n";
	TeX += currentsInfoOutput.second + "\\end{tabular}\r\n\\end{table}\r\n\r\n";
	TeX += equivImpOutput.second + "\\pagebreak";
	TeX += "\\subsection{Equations}\r\nEquations using the Kirchhoff Nodes Law (KNL)\r\n\r\n" + knlCurrData.third;
	TeX += "\\pagebreak\\section{Equation System}\r\n\r\n\\paragraph{} " + equationSystemOutput.second;
	TeX += "Steps:\r\n\r\n" + step1.second + step2.second + step3.second + step4.second + step5.second + step6.second;
	TeX += "\\par\r\n\r\n\\pagebreak\r\n\r\n\\section{Results}\r\n\r\n" + resultsOutput.second;
	TeX += "\\end{document}\r\n";

	let copyTeX = TeX;

	// Turn the viz. on
	$("#contResults").show();
	$("#loadpage").fadeOut(1000);
    $("#results").show();
	$('#results-modal').modal('show');
	
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


	// Export JSON File
	$("#json").off().on('click', function() {
		const filename = 'urisolve_results.json';
		let element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
		element.setAttribute('download', filename);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	  });
	
	// Export TeX File
	$("#tex").off().on('click', function() {
		const filename = 'urisolve_results.tex';
		let element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(TeX));
		element.setAttribute('download', filename);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	  });


	// Export PDF File
	$("#pdfPrintButton").off().on('click', function() {
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
		TeX = copyTeX;
		//Print TeX (Temporary - Index 1264 - texfile cannot be change before it)
		if(studNumber.length>1 && studLastname.length > 1 && studNumber.length>1){
			let string = "\\vspace{0.5cm}\\centering{ \r\n Simulation performed by: \\textbf{ "+studName+" "+studLastname+" ("+studNumber+")}} "
			string += " at " + hourstr + "\r\n";
			TeX = TeX.slice(0,1264) + string + TeX.slice(1265);
		}
		// Instanciate printer object
        docToPrint = new latexprinter(null, 'printLnk', 'pdfPrintButton');
        // Add the desired Latex Source Code
        docToPrint.setTexFile(TeX);
		// Add Logo Image
		let sampleimg = base64imgselect("logo");
		docToPrint.addImgFile('logo.jpg', sampleimg);
		// Add Circuit Image
		if(fileContents[0]){
			let imageObj = new Image();
			imageObj.src = fileContents[0];
			sampleimg = resizeandgray(imageObj);
			docToPrint.addImgFile('circuit.jpg', sampleimg);
		}
		// Add Canvas Images
		for(let i = 0; i< canvasObjects.length; i++){
			docToPrint.addImgFile(canvasObjects[i].id+'.jpg',canvasObjects[i].dataURL)
		}
		docToPrint.print();
		
	});

	// Refresh fileContents
	document.getElementById("fileInput").value = "";
	
	// Update Dictionary Language
	let language = document.getElementById("lang-sel-txt").innerText.toLowerCase();
	if(language == "english")
		set_lang(dictionary.english);
	else	
		set_lang(dictionary.portuguese);
    */

}





