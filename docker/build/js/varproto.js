// Variable Prototypes and Enums

var _DECPLACES = {
    CALC: 3,
    RESULT: 15
};

/*
 *  Component Types Table
    TypeNb 	TypeName
    1	Resistor
    2	Capacitor
    3	Coil
    4	dcVoltPower
    5	dcCurrPower
    6	acVoltPower
    7	acCurrPower
    8	gnd
*/
var cpTypeEnum = {
    gnd:            0,
    resistor:       1,
    capacitor:      2,
    coil:           3,
    dcVoltPower:    4,
    dcCurrPower:    5,
    acVoltPower:    6,
    acCurrPower:    7
};

/*
 *  MTN Error Codes Table
    ErrorNb 	ErrorDesc
    1	MTN Error 1: Identification of Virtual Nodes as Real Nodes
    2	MTN Error 2: Identification of Real Nodes as Virtual Nodes
    3	MTN Error 3: Real Nodes without Identification
    4	MTN Error 3: GND not detected
*/
var mtnErrorsEnum = {
    none:                0,
    virtualAsReal:       1,
    realAsVirtual:       2,
    noNodeIdentif:       3,
    noGndNode:           4
};

/*
 *  Netlist Components Reference
*/
var compNetlistRef = {
    1: 'Vdc',
    2: 'Idc',
    3: 'Vac',
    4: 'Iac',
    5: 'R',
    6: 'L',
    7: 'C',
    8: 'VProbe',
    9: 'IProbe',
    10: '.AC'
};

/**
 * Gets component type by Netlist reference
 * @param {String} val Substring containing reference provided by the Netlist
 * @returns {Int} Give the type of define or 0 - not found
 */
function cpRefTest(val){
    for (var key in compNetlistRef) {
      if(compNetlistRef.hasOwnProperty(key))
       if (compNetlistRef[key] == val) {
           return key;
       }
    }
    return 0;
};

function getComponentNumericValue(component){
    let errorCode = 0;
    // Prepare Value
    let cpVal = parseFloat(component.value);
    const getValUnits = multUnits.find(valUnit => valUnit.name === component.unitMult);
    if (typeof getValUnits == 'undefined') {
        errorCode = 1;  // Unit Convertion Error
        console.log("Error in getComponentNumericValue, Error Code: " + errorCode);
    }

    let cpMult = getValUnits.value;
    cpVal = math.multiply(cpVal, cpMult);

    return {
        errorCode: errorCode,
        value: cpVal
    }
};

function getEndNodes(fcBranch, fcNextNode, psRef, fcBranchStartNode, fcBranchEndNode) {
    let fcEnd = false;
    let fcNodeIndex;
    let fcEndVoltPsEndNodes;

    do {
        let pos = fcNextNode.search('_net');
        if(pos > -1 ) {
            fcNodeIndex = fcBranch.resistors.findIndex(item => item.noP == fcNextNode);
            if(fcNodeIndex > -1) {
                fcNextNode = fcBranch.resistors[fcNodeIndex].noN;
                fcBranch.resistors.splice(fcNodeIndex,1);
                continue;
            }
            fcNodeIndex = fcBranch.resistors.findIndex(item => item.noN == fcNextNode);
            if(fcNodeIndex > -1) {
                fcNextNode = fcBranch.resistors[fcNodeIndex].noP;
                fcBranch.resistors.splice(fcNodeIndex,1);
                continue;
            }
            fcNodeIndex = fcBranch.coils.findIndex(item => item.noP == fcNextNode);
            if(fcNodeIndex > -1) {
                fcNextNode = fcBranch.coils[fcNodeIndex].noN;
                fcBranch.coils.splice(fcNodeIndex,1);
                continue;
            }
            fcNodeIndex = fcBranch.coils.findIndex(item => item.noN == fcNextNode);
            if(fcNodeIndex > -1) {
                fcNextNode = fcBranch.coils[fcNodeIndex].noP;
                fcBranch.coils.splice(fcNodeIndex,1);
                continue;
            }
            fcNodeIndex = fcBranch.capacitors.findIndex(item => item.noP == fcNextNode);
            if(fcNodeIndex > -1) {
                fcNextNode = fcBranch.capacitors[fcNodeIndex].noN;
                fcBranch.capacitors.splice(fcNodeIndex,1);
                continue;
            }
            fcNodeIndex = fcBranch.capacitors.findIndex(item => item.noN == fcNextNode);
            if(fcNodeIndex > -1) {
                fcNextNode = fcBranch.capacitors[fcNodeIndex].noP;
                fcBranch.capacitors.splice(fcNodeIndex,1);
                continue;
            }
            fcNodeIndex = fcBranch.dcVoltPwSupplies.findIndex(item => item.noP == fcNextNode);
            if(fcNodeIndex > -1 && (fcBranch.dcVoltPwSupplies[fcNodeIndex].ref != psRef)) {
                fcNextNode = fcBranch.dcVoltPwSupplies[fcNodeIndex].noN;
                fcBranch.dcVoltPwSupplies.splice(fcNodeIndex,1);
                continue;
            }
            fcNodeIndex = fcBranch.dcVoltPwSupplies.findIndex(item => item.noN == fcNextNode);
            if(fcNodeIndex > -1 && (fcBranch.dcVoltPwSupplies[fcNodeIndex].ref != psRef)) {
                fcNextNode = fcBranch.dcVoltPwSupplies[fcNodeIndex].noP;
                fcBranch.dcVoltPwSupplies.splice(fcNodeIndex,1);
                continue;
            }
            fcNodeIndex = fcBranch.acVoltPwSupplies.findIndex(item => item.noP == fcNextNode);
            if(fcNodeIndex > -1 && (fcBranch.acVoltPwSupplies[fcNodeIndex].ref != psRef)) {
                fcNextNode = fcBranch.acVoltPwSupplies[fcNodeIndex].noN;
                fcBranch.acVoltPwSupplies.splice(fcNodeIndex,1);
                continue;
            }
            fcNodeIndex = fcBranch.acVoltPwSupplies.findIndex(item => item.noN == fcNextNode);
            if(fcNodeIndex > -1 && (fcBranch.acVoltPwSupplies[fcNodeIndex].ref != psRef)) {
                fcNextNode = fcBranch.acVoltPwSupplies[fcNodeIndex].noP;
                fcBranch.acVoltPwSupplies.splice(fcNodeIndex,1);
                continue;
            }
            fcNodeIndex = fcBranch.dcAmpPwSupplies.findIndex(item => item.noP == fcNextNode);
            if(fcNodeIndex > -1) {
                fcNextNode = fcBranch.dcAmpPwSupplies[fcNodeIndex].noN;
                fcBranch.dcAmpPwSupplies.splice(fcNodeIndex,1);
                continue;
            }
            fcNodeIndex = fcBranch.dcAmpPwSupplies.findIndex(item => item.noN == fcNextNode);
            if(fcNodeIndex > -1) {
                fcNextNode = fcBranch.dcAmpPwSupplies[fcNodeIndex].noP;
                fcBranch.dcAmpPwSupplies.splice(fcNodeIndex,1);
                continue;
            }
            fcNodeIndex = fcBranch.acAmpPwSupplies.findIndex(item => item.noP == fcNextNode);
            if(fcNodeIndex > -1) {
                fcNextNode = fcBranch.acAmpPwSupplies[fcNodeIndex].noN;
                fcBranch.acAmpPwSupplies.splice(fcNodeIndex,1);
                continue;
            }
            fcNodeIndex = fcBranch.acAmpPwSupplies.findIndex(item => item.noN == fcNextNode);
            if(fcNodeIndex > -1) {
                fcNextNode = fcBranch.acAmpPwSupplies[fcNodeIndex].noP;
                fcBranch.acAmpPwSupplies.splice(fcNodeIndex,1);
                continue;
            }
        }
        else {
            if(fcNextNode == fcBranch.endNode) {
                fcEndVoltPsEndNodes = { voltPsRef: psRef, startNode: fcBranchStartNode , endNode: fcNextNode};
            }
            if(fcNextNode == fcBranch.startNode) {
                fcEndVoltPsEndNodes = { voltPsRef: psRef, startNode: fcBranchEndNode, endNode: fcNextNode  };
            }
            fcEnd = true;
        }
    } while (!fcEnd);
    return fcEndVoltPsEndNodes;
};

/*
 * List of Unit multiples
*/
const multUnits = [
    {name: 'pA', value: 1e-12, teX: "10^{-12}"},
    {name: 'nA', value: 1e-9, teX: "10^{-9}"},
    {name: 'uA', value: 1e-6, teX: "10^{-6}"},
    {name: 'mA', value: 1e-3, teX: "10^{-3}"},
    {name: 'A', value: 1, teX: ""},
    {name: 'kA', value: 1e3, teX: "10^{3}"},
    {name: 'MA', value: 1e6, teX: "10^{6}"},
    {name: 'GA', value: 1e9, teX: "10^{9}"},
    {name: 'pF', value: 1e-12, teX: "10^{-12}"},
    {name: 'nF', value: 1e-9, teX: "10^{-9}"},
    {name: 'uF', value: 1e-6, teX: "10^{-6}"},
    {name: 'mF', value: 1e-3, teX: "10^{-3}"},
    {name: 'F', value: 1, teX: ""},
    {name: 'kF', value: 1e3, teX: "10^{3}"},
    {name: 'MF', value: 1e6, teX: "10^{6}"},
    {name: 'GF', value: 1e9, teX: "10^{9}"},
    {name: 'pH', value: 1e-12, teX: "10^{-12}"},
    {name: 'nH', value: 1e-9, teX: "10^{-9}"},
    {name: 'uH', value: 1e-6, teX: "10^{-6}"},
    {name: 'mH', value: 1e-3, teX: "10^{-3}"},
    {name: 'H', value: 1, teX: ""},
    {name: 'kH', value: 1e3, teX: "10^{3}"},
    {name: 'MH', value: 1e6, teX: "10^{6}"},
    {name: 'GH', value: 1e9, teX: "10^{9}"},
    {name: 'pHz', value: 1e-12, teX: "10^{-12}"},
    {name: 'nHz', value: 1e-9, teX: "10^{-9}"},
    {name: 'uHz', value: 1e-6, teX: "10^{-6}"},
    {name: 'mHz', value: 1e-3, teX: "10^{-3}"},
    {name: 'Hz', value: 1, teX: ""},
    {name: 'kHz', value: 1e3, teX: "10^{3}"},
    {name: 'MHz', value: 1e6, teX: "10^{6}"},
    {name: 'GHz', value: 1e9, teX: "10^{9}"},
    {name: 'pV', value: 1e-12, teX: "10^{-12}"},
    {name: 'nV', value: 1e-9, teX: "10^{-9}"},
    {name: 'uV', value: 1e-6, teX: "10^{-6}"},
    {name: 'mV', value: 1e-3, teX: "10^{-3}"},
    {name: 'V', value: 1, teX: ""},
    {name: 'kV', value: 1e3, teX: "10^{3}"},
    {name: 'MV', value: 1e6, teX: "10^{6}"},
    {name: 'GV', value: 1e9, teX: "10^{9}"},
    {name: 'pOhm', value: 1e-12, teX: "10^{-12}"},
    {name: 'nOhm', value: 1e-9, teX: "10^{-9}"},
    {name: 'uOhm', value: 1e-6, teX: "10^{-6}"},
    {name: 'mOhm', value: 1e-3, teX: "10^{-3}"},
    {name: 'Ohm', value: 1, teX: ""},
    {name: 'kOhm', value: 1e3, teX: "10^{3}"},
    {name: 'MOhm', value: 1e6, teX: "10^{6}"},
    {name: 'GOhm', value: 1e9, teX: "10^{9}"}
];

// Circuit Objects

/**
 * SuperNodes data
 * @param {Int} cpId Unique Id
 * @param {String} cpRef SuperNode Reference
 * @param {String} cpType Node Type (0 - Grounded; 1 - Floating)
 * @param {Array}  cpNodes Nodes Array
 * @param {Function} calcGroundedVoltage():  and return an array with Nodes Voltage
 */
class supernode {
    constructor(cpId, cpRef, cpType, cpNodes = []) {
        this.id = cpId,
        this.ref = cpRef,
        this.type = cpType,
        this.nodes = cpNodes,
        /**
         * Calculate Nodes Voltage
         */
        this.calcGroundedVoltage = function (isolatedPs) {
            if(this.type != 0) return;
            // Implement a function that calculates the Voltage in Every Node (if its grounded)
            let errorCode = 0;
            let nodeVolt;
            let isolPs = JSON.parse(JSON.stringify(isolatedPs));
            let nodeInfo = { previous: null, next: 'gnd', volts: 0, nextEqVolRef: null };
            let iVoltage = 0;
            let aVoltage = 0;
            let b;

            // Set gnd Node to 0V
            let nodeIndex = this.nodes.findIndex(item => item.ref == nodeInfo.next);
            if(nodeIndex > -1) {
                this.nodes[nodeIndex].voltage = iVoltage;
            }

            /*
                1 - Acquire next node to search (supernodes nodes array)
                    If already has both nodes voltage, go to next iteration
                2 - Search in isolatedPs Array and get Reference of isolated powersupply
                3 - Search in Branches for the branch with the isolated Ps
                4 - Calculate node voltage (using equivalent voltage between the nodes)
            */
            let mcState = 1;
            let end = false;

            let indexes = new Array();
            nodeIndex = -1;

            do {
                switch (mcState) {
                    case 1: {
                        nodeIndex++;
                        if(nodeIndex >= this.nodes.length) { end = true; break; }

                        if(this.nodes[nodeIndex].voltage != null && this.nodes[nodeIndex].ref != 'gnd') { break; }

                        mcState++;
                        break;
                    }
                    case 2: {
                        if(indexes.length == 0) {
                            for(let i=0; i<isolPs.length; i++) {
                                let nextINode;
                                let nextENode;
                                let lastIndexEndNode = '';

                                if(indexes.length > 0) { lastIndexEndNode = indexes[indexes.length-1].eNode; }
                                
                                if(isolPs[i].noP == this.nodes[nodeIndex].ref && this.nodes[this.nodes.findIndex(item => item.ref == isolPs[i].noN)].voltage != null) {

                                    if(this.nodes[nodeIndex].voltage == null && this.nodes[nodeIndex].ref != 'gnd') {
                                        if(lastIndexEndNode != '') {
                                            nextINode = lastIndexEndNode;
                                            if(isolPs[i].noN == nextINode) {
                                                nextENode = this.nodes[nodeIndex].ref;
                                            }
                                            else {
                                                nextENode = isolPs[i].noN;
                                            }
                                        }
                                        else {
                                            nextINode = isolPs[i].noN;
                                            nextENode = this.nodes[nodeIndex].ref;
                                        }
                                    }
                                    else {
                                        nextINode = this.nodes[nodeIndex].ref;
                                        nextENode = isolPs[i].noN;
                                    }
                                    
                                    indexes.push({ pos: i, iNode: nextINode, eNode: nextENode, isolVolt: isolPs[i].ref });
                                }
                                if(isolPs[i].noN == this.nodes[nodeIndex].ref && this.nodes[this.nodes.findIndex(item => item.ref == isolPs[i].noP)].voltage != null) {

                                    if(this.nodes[nodeIndex].voltage == null && this.nodes[nodeIndex].ref != 'gnd') {
                                        if(lastIndexEndNode != '') {
                                            nextINode = lastIndexEndNode;
                                            if(isolPs[i].noP == nextINode) {
                                                nextENode = this.nodes[nodeIndex].ref;
                                            }
                                            else {
                                                nextENode = isolPs[i].noP;
                                            }
                                        }
                                        else {
                                            nextINode = isolPs[i].noP;
                                            nextENode = this.nodes[nodeIndex].ref;
                                        }
                                    }
                                    else {
                                        nextINode = this.nodes[nodeIndex].ref;
                                        nextENode = isolPs[i].noP;
                                    }
                                    indexes.push({ pos: i, iNode: nextINode, eNode: nextENode, isolVolt: isolPs[i].ref });
                                }
                            }
                        }

                        if(indexes.length > 0) {

                            if(indexes.length > 1) {
                                let emptyGlass;
                                // Sort by existing node voltage
                                for(let i=0; i<indexes.length; i++) {
                                    let thisRef = indexes[i].iNode;
                                    let thisIndex = this.nodes.findIndex(item => item.ref == thisRef);
                                    let v = this.nodes[thisIndex].voltage;
                                    if(v != null) {
                                        emptyGlass = indexes[0];
                                        indexes[0] = indexes[i];
                                        indexes[i] = emptyGlass;
                                        indexes.splice(1);
                                        break;
                                    }
                                    thisRef = indexes[i].eNode;
                                    thisIndex = this.nodes.findIndex(item => item.ref == thisRef);
                                    v = this.nodes[thisIndex].voltage;
                                    if(v != null) {
                                        emptyGlass = indexes[0];
                                        indexes[0] = indexes[i];
                                        indexes[i] = emptyGlass;
                                        indexes.splice(1);
                                        break;
                                    }
                                }
                            }

                            let nextIndex = indexes.shift();
                            let previousNode = nextIndex.iNode;
                            let nodeInd = this.nodes.findIndex(item => item.ref == previousNode);
                            let previousVolts = this.nodes[nodeInd].voltage;
                            let nextNode = nextIndex.eNode;
                            let nextVoltPs = nextIndex.isolVolt;

                            nodeInfo = { previous: previousNode, next: nextNode, volts: previousVolts, nextEqVolRef: nextVoltPs};
                            mcState++;
                        }
                        else mcState--;
                        break;
                    }
                    case 3: {
                        for(let i=0; i<this.nodes[nodeIndex].branches.length; i++)
                        {
                            b = this.nodes[nodeIndex].branches[i];
                            if(b.equivVoltPs.voltsElem.length == 0) continue;
                            if( (b.equivVoltPs.voltsElem.findIndex(item => item.ref == nodeInfo.nextEqVolRef) ) > -1) { mcState++; break; }
                        }
                        break;
                    }
                    case 4: {
                        /* Calculate Voltage of the Next Node */
                        iVoltage = math.complex(nodeInfo.volts);

                        // Get Equivalent Voltage in the Node
                        aVoltage = math.complex(b.equivVoltPs.value);
                        let nodeInd  = this.nodes.findIndex(item => item.ref == nodeInfo.next);

                        if(b.startNode == nodeInfo.next) this.nodes[nodeInd].voltage = math.string(math.subtract(iVoltage, aVoltage));
                        else this.nodes[nodeInd].voltage = math.string(math.add(iVoltage, aVoltage));

                        // Save Voltage value to next iteration
                        iVoltage = this.nodes[nodeInd].voltage;
                        nodeInfo.volts = iVoltage;

                        // Select machine states stage
                        if(indexes.length == 0) { mcState = 1; }
                        else {
                            nodeInfo = { previous: null, next: 'gnd', volts: 0, nextEqVolRef: null };
                            mcState = 2;
                        }
                        break;
                    }
                    default: {

                        break;
                    }
                }
            } while (!end);
            return {
                first:   errorCode,
                second:  nodeVolt
            };
        };
        this.calcFloatingVoltage = function (isolatedPs) {
            if(this.type != 1) return;
            // Implement a function that calculates the Voltage in Every Node (if its grounded)
            let errorCode = 0;
            let nodeVolt;
            let isolPs = JSON.parse(JSON.stringify(isolatedPs));
            let nodeInfo = { previous: null, next: 'gnd', volts: 0, nextEqVolRef: null };
            let iVoltage = 0;
            let aVoltage = 0;
            let b;

            // Set gnd Node to 0V
            let nodeIndex = this.nodes.findIndex(item => item.ref == nodeInfo.next);
            if(nodeIndex > -1) {
                this.nodes[nodeIndex].voltage = iVoltage;
            }

            /*
                1 - Acquire next node to search (supernodes nodes array)
                    If already has both nodes voltage, go to next iteration
                2 - Search in isolatedPs Array and get Reference of isolated powersupply
                3 - Search in Branches for the branch with the isolated Ps
                4 - Calculate (Produce Equation for) node voltage (using equivalent voltage between the nodes)
            */
            let mcState = 1;
            let end = false;

            let indexes = new Array();
            nodeIndex = -1;

            do {
                switch (mcState) {
                    case 1: {
                        nodeIndex++;
                        if(nodeIndex >= this.nodes.length) { end = true; break; }

                        if(this.nodes[nodeIndex].voltage != null && this.nodes[nodeIndex].ref != 'gnd') { break; }

                        mcState++;
                        break;
                    }
                    case 2: {
                        if(indexes.length == 0) {
                            for(let i=0; i<isolPs.length; i++) {
                                let nextINode;
                                let nextENode;
                                if(isolPs[i].noP == this.nodes[nodeIndex].ref) {

                                    if(this.nodes[nodeIndex].voltage == null && this.nodes[nodeIndex].ref != 'gnd') {
                                        nextINode = isolPs[i].noN;
                                        nextENode = this.nodes[nodeIndex].ref;
                                    }
                                    else {
                                        nextINode = this.nodes[nodeIndex].ref;
                                        nextENode = isolPs[i].noN;
                                    }
                                    indexes.push({ pos: i, iNode: nextINode, eNode: nextENode, isolVolt: isolPs[i].ref });
                                }
                                if(isolPs[i].noN == this.nodes[nodeIndex].ref) {

                                    if(this.nodes[nodeIndex].voltage == null && this.nodes[nodeIndex].ref != 'gnd') {
                                        nextINode = isolPs[i].noP;
                                        nextENode = this.nodes[nodeIndex].ref;
                                    }
                                    else {
                                        nextINode = this.nodes[nodeIndex].ref;
                                        nextENode = isolPs[i].noP;
                                    }
                                    indexes.push({ pos: i, iNode: nextINode, eNode: nextENode, isolVolt: isolPs[i].ref });
                                }
                            }
                        }

                        if(indexes.length > 0) {

                            if(indexes.length > 1) {
                                let emptyGlass;
                                // Sort by existing node voltage
                                for(let i=0; i<indexes.length; i++) {
                                    let thisRef = indexes[i].iNode;
                                    let thisIndex = this.nodes.findIndex(item => item.ref == thisRef);
                                    if(this.nodes[thisIndex].Voltage != null) {
                                        emptyGlass = indexes[0];
                                        indexes[0] = indexes[i];
                                        indexes[i] = emptyGlass;
                                        break;
                                    }
                                    thisRef = indexes[i].eNode;
                                    thisIndex = this.nodes.findIndex(item => item.ref == thisRef);
                                    if(this.nodes[thisIndex].Voltage != null) {
                                        emptyGlass = indexes[0];
                                        indexes[0] = indexes[i];
                                        indexes[i] = emptyGlass;
                                        break;
                                    }
                                }
                            }

                            let nextIndex = indexes.shift();
                            let previousNode = nextIndex.iNode;
                            let nodeInd = this.nodes.findIndex(item => item.ref == previousNode);
                            let previousVolts = this.nodes[nodeInd].voltage;
                            let nextNode = nextIndex.eNode;
                            let nextVoltPs = nextIndex.isolVolt;

                            nodeInfo = { previous: previousNode, next: nextNode, volts: previousVolts, nextEqVolRef: nextVoltPs};
                            mcState++;
                        }
                        else mcState--;
                        break;
                    }
                    case 3: {
                        for(let i=0; i<this.nodes[nodeIndex].branches.length; i++)
                        {
                            b = this.nodes[nodeIndex].branches[i];
                            if( (b.equivVoltPs.voltsElem.findIndex(item => item.ref == nodeInfo.nextEqVolRef) ) > -1) { mcState++; break; }
                        }
                        break;
                    }
                    case 4: {
                        /* Calculate Voltage of the Next Node */
                        iVoltage = nodeInfo.previous;

                        // Get Equivalent Voltage in the Node
                        aVoltage = math.complex(b.equivVoltPs.value);
                        let nodeInd  = this.nodes.findIndex(item => item.ref == nodeInfo.next);

                        if(b.startNode == nodeInfo.next) this.nodes[nodeInd].voltage = { volteq: math.simplify(iVoltage + '-(' + math.complex(aVoltage).toString()+')').toString(), equivVoltPs: b.equivVoltPs};
                        else this.nodes[nodeInd].voltage = { volteq: math.simplify(iVoltage + '+' + aVoltage).toString(), equivVoltPs: b.equivVoltPs };

                        // Save Voltage value to next iteration
                        iVoltage = this.nodes[nodeInd].voltage;
                        nodeInfo.volts = iVoltage;

                        // Select machine states stage
                        if(indexes.length == 0) { mcState = 1; }
                        else {
                            nodeInfo = { previous: null, next: 'gnd', volts: 0, nextEqVolRef: null };
                            mcState = 2;
                        }
                        break;
                    }
                    default: {

                        break;
                    }
                }
            } while (!end);
            return {
                first:   errorCode,
                second:  nodeVolt
            };
        };
        this.insertNode = function () {
            alert("inserted");
        };
    }
}

/**
 * Node data
 * @param {Int} cpId Unique Id
 * @param {String} cpRef Node Reference
 * @param {String} cpType Node Type (0 - Virtual; 1 - Real)
 * @param {Array}  cpBranchesArr Branches Array
 * @param {String} cpVoltage Current Equivalent Voltage
 * @param {Function} getCurrents(): Returns Signed Currents Array
 */
class nnode {
    constructor(cpId, cpRef, cpBranchesArr = [], cpType, cpVoltage) {
        this.id = cpId,
        this.ref = cpRef,
        this.type = cpType,
        this.branches = cpBranchesArr,
        this.voltage = cpVoltage,
        this.getCurrents = function () {
            // Implement a function that returns an array of currents with direction sign (+/-)
            let errorCode = 0;
            let nodeCurr = new Array();
            let thisCurr;
            for(let i=0; i<this.branches.length; i++) {
                if(this.branches[i].currentData.noN == this.ref) thisCurr = { direction: 'in', currentObj: this.branches[i].currentData};
                if(this.branches[i].currentData.noP == this.ref) thisCurr = { direction: 'out', currentObj: this.branches[i].currentData};
                nodeCurr.push(thisCurr);
            }

            // Plain Current Equation Array
            let currsIn = new Array();
            let currsOut = new Array();
            for(let i=0; i<nodeCurr.length; i++) {
                if(nodeCurr[i].direction == 'in') currsIn.push(nodeCurr[i].currentObj.ref);
                if(nodeCurr[i].direction == 'out') currsOut.push(nodeCurr[i].currentObj.ref);
            }

            let currInSum = '0';
            let currOutSum = '0';
            if(currsIn.length) {
                currInSum = currsIn[0];
                for(let i=1; i<currsIn.length; i++) { currInSum += '+' + currsIn[i]; }
            }
            if(currsOut.length) {
                currOutSum = currsOut[0];
                for(let i=1; i<currsOut.length; i++) { currOutSum += '+' + currsOut[i]; }
            }

            let plainEquat = currInSum + '=' + currOutSum;

            return {
                first:   errorCode,
                second:   nodeCurr,
                third:   plainEquat
            };
        };
        this.getCurrentsInOrderTo = function (equalsToCurr) {
            // Implement a function that returns an array of currents with direction sign (+/-)
            let errorCode = 0;
            let nodeCurr = new Array();
            let thisCurr;
            let equationObj = { equalsToCurr: equalsToCurr, plusCurr: [], minusCurr: [] };

            for(let i=0; i<this.branches.length; i++) {
                if(this.branches[i].currentData.noN == this.ref) thisCurr = { direction: 'in', currentObj: this.branches[i].currentData};
                if(this.branches[i].currentData.noP == this.ref) thisCurr = { direction: 'out', currentObj: this.branches[i].currentData};
                nodeCurr.push(thisCurr);
            }

            // Plain Current Equation Array
            let currsIn = new Array();
            let currsOut = new Array();
            for(let i=0; i<nodeCurr.length; i++) {
                if(nodeCurr[i].direction == 'in') currsIn.push(nodeCurr[i].currentObj.ref);
                if(nodeCurr[i].direction == 'out') currsOut.push(nodeCurr[i].currentObj.ref);
            }

            let currInSum = '0';
            let currOutSum = '0';

            if(currsIn.length) {
                currInSum = currsIn[0];
                equationObj.minusCurr.push(currsIn[0]);
                for(let i=1; i<currsIn.length; i++) { currInSum += ' + ' + currsIn[i]; equationObj.minusCurr.push(currsIn[i]); }
            }
            if(currsOut.length) {
                currOutSum = currsOut[0];
                equationObj.plusCurr.push(currsOut[0]);
                for(let i=1; i<currsOut.length; i++) { currOutSum += ' + ' + currsOut[i]; equationObj.plusCurr.push(currsOut[i]); }
            }

            let ix = currInSum + ' = ' + currOutSum;

            // Math manipulations
            let Fraction = algebra.Fraction;
            let Expression = algebra.Expression;
            let Equation = algebra.Equation;

            ix = new algebra.parse(ix);
            let plainEquat = ix.solveFor(equalsToCurr).toString();
            let plainFullEquat = equalsToCurr + ' = ' + plainEquat;
            let a = math.parse(plainEquat);

            return {
                first:   errorCode,
                second:  nodeCurr,
                third:   plainFullEquat,
                fourth:  plainEquat,
                fifth:   equationObj,
                sixth:   a
            };
        };
    }
}

/**
 * Branch data
 * @param {Int} cpId Unique Id
 * @param {String} cpRef Branch Reference
 * @param {String} cpStartNode Current Start Node
 * @param {String} cpEndNode Current End Node
 * @param {String} cpCurrentId Current Id
 * @param {Array} cpDcVoltPs Array containing DC Volt PS of the Branch
 * @param {Array} cpAcVoltPs Array containing AC Volt PS of the Branch
 * @param {Array} cpDcAmpPs Array containing DC Current PS of the Branch
 * @param {Array} cpAcAmpPs Array containing AC Current PS of the Branch
 * @param {Array} cpResistors Array containing Resistors of the Branch
 * @param {Array} cpCoils Array containing Coils of the Branch
 * @param {Array} cpCapacitors Array containing Capacitors of the Branch
 */
class branch {
    constructor(cpId, cpRef, cpStartNode, cpEndNode, cpCurrentId, cpDcVoltPs = [], cpAcVoltPs = [], cpDcAmpPs = [], cpAcAmpPs = [], cpResistors = [], cpCoils = [], cpCapacitors = [], cpAmperemeter, cpEquivImpedance = {impedanceElem: [], ref: null, value: null}, cpEquivVoltPs = {voltsElem: [], ref: null, value: null}, cpEndVoltPsEndNodes = [], cpCurrentData){
        this.id = cpId,
        this.ref = cpRef,
        this.startNode = cpStartNode;
        this.endNode = cpEndNode;
        this.currentId = cpCurrentId,
        this.dcVoltPwSupplies = cpDcVoltPs,
        this.acVoltPwSupplies = cpAcVoltPs,
        this.dcAmpPwSupplies = cpDcAmpPs,
        this.acAmpPwSupplies = cpAcAmpPs,
        this.resistors = cpResistors,
        this.coils = cpCoils,
        this.capacitors = cpCapacitors,
        this.ammeter = cpAmperemeter,
        this.equivImpedance = cpEquivImpedance,
        this.equivVoltPs = cpEquivVoltPs,
        this.endVoltPsEndNodes = cpEndVoltPsEndNodes,
        this.currentData = cpCurrentData,
        this.meshCurr = [];
        this.meshCurrDir = [];
        this.components = [];
        this.reactance;
        this.setEquivImpedance = function (freqV, freqM) {
            let errorCode = 0;
            let tImpedance = 0;
            if(freqV>0) {
                // Function to calculate Equivalent Impedance
                for(let i=0; i<this.capacitors.length; i++) {
                    let cImp = this.capacitors[i].compImpedance(freqV, freqM).second;
                    tImpedance = math.add(tImpedance, cImp);
                    // Add this ref to array
                    this.equivImpedance.impedanceElem.push( { ref: this.capacitors[i].ref, type: 'capacitor', value: cImp.toString() } );
                }
                for(let i=0; i<this.coils.length; i++) {
                    let lImp = this.coils[i].compImpedance(freqV, freqM).second;
                    tImpedance = math.add(tImpedance, lImp);
                    // Add this ref to array
                    this.equivImpedance.impedanceElem.push( { ref: this.coils[i].ref, type: 'coil', value: lImp.toString() } );
                }
            }
            for(let i=0; i<this.resistors.length; i++) {
                let rImp = getComponentNumericValue(this.resistors[i]);
                tImpedance = math.add(tImpedance, rImp.value);
                // Add this ref to array
                this.equivImpedance.impedanceElem.push( { ref: this.resistors[i].ref, type: 'resistor', value: rImp.value.toString() } );
            }
            this.equivImpedance.ref = 'Zeq' + this.startNode + this.endNode;
            this.equivImpedance.value = math.string(math.round(tImpedance, _DECPLACES.CALC));
            return errorCode;
        };
        this.getReactance = function (freqV, freqM) {
            let errorCode = 0;
            let tImpedance = 0;
            if(freqV>0) {
                // Function to calculate Equivalent Impedance
                for(let i=0; i<this.capacitors.length; i++) {
                    let cImp = this.capacitors[i].compImpedance(freqV, freqM).second;
                    tImpedance = math.add(tImpedance, cImp);
                    // Add this ref to array
                    this.equivImpedance.impedanceElem.push( { ref: this.capacitors[i].ref, type: 'capacitor', value: cImp.toString() } );
                }
                for(let i=0; i<this.coils.length; i++) {
                    let lImp = this.coils[i].compImpedance(freqV, freqM).second;
                    tImpedance = math.add(tImpedance, lImp);
                    // Add this ref to array
                    this.equivImpedance.impedanceElem.push( { ref: this.coils[i].ref, type: 'coil', value: lImp.toString() } );
                }
            }
            this.reactance = math.string(math.round(tImpedance, _DECPLACES.CALC));
            return errorCode;
        };
        this.setEquivVoltPs = function () {
            let errorCode = 0;
            let dcTotVoltage = 0;
            let acTotVoltage = 0;
            let elemSignal = '';
            let retStartNode;
            let retEndNode;

                // Function to calculate Equivalent Voltage Power Supplies

                // DC
            for(let i=0; i<this.dcVoltPwSupplies.length; i++) {

                // Prepare Value
                let cpVal = parseFloat(this.dcVoltPwSupplies[i].value);
                const getValUnits = multUnits.find(valUnit => valUnit.name === this.dcVoltPwSupplies[i].unitMult);
                if (typeof getValUnits == 'undefined') {
                    errorCode = 1;  // Unit Convertion Error
                    console.log("Error in branch[ " + cpId + " ]: function setEquivVoltPs, Error Code: " + errorCode);
                    return errorCode;
                }

                let cpMult = getValUnits.value;
                cpVal = math.multiply(cpVal, cpMult);

                // Save Voltage in Component Data

                this.dcVoltPwSupplies[i].voltage = math.string(math.round(cpVal, _DECPLACES.CALC));

                // Verify Voltage Signal (related to Nodes)
                let cpVoltPsIndex = this.endVoltPsEndNodes.findIndex(item => item.voltPsRef == this.dcVoltPwSupplies[i].ref);
                let voltPsNoP = '';
                if(cpVoltPsIndex > -1) { voltPsNoP = this.endVoltPsEndNodes[cpVoltPsIndex].startNode;}
                if(voltPsNoP == this.startNode) { dcTotVoltage = math.add(dcTotVoltage, cpVal); elemSignal = '+'; retStartNode = this.endNode; retEndNode = this.startNode; }
                if(voltPsNoP == this.endNode) { dcTotVoltage = math.subtract(dcTotVoltage, cpVal); elemSignal = '-'; retStartNode = this.startNode; retEndNode = this.endNode; }
                dcTotVoltage = math.round(dcTotVoltage, _DECPLACES.CALC);

                // Add this ref to array
                this.equivVoltPs.voltsElem.push( { ref: this.dcVoltPwSupplies[i].ref, signal: elemSignal, startNode: retStartNode, endNode: retEndNode, value: cpVal.toString() } );
            }
            // AC
            for(let i=0; i<this.acVoltPwSupplies.length; i++) {

                // Prepare Value
                let cpVal = parseFloat(this.acVoltPwSupplies[i].value);
                const getValUnits = multUnits.find(valUnit => valUnit.name === this.acVoltPwSupplies[i].unitMult);
                if (typeof getValUnits == 'undefined') {
                    errorCode = 1;  // Unit Convertion Error
                    console.log("Error in branch[ " + cpId + " ]: function setEquivVoltPs, Error Code: " + errorCode);
                    return errorCode;
                }

                // Absolute Value
                let cpMult = getValUnits.value;
                cpVal = math.multiply(cpVal, cpMult);

                // Angle = Phase * (pi / 180)
                let cpValAngle = parseFloat(this.acVoltPwSupplies[i].phase);
                cpValAngle = math.chain(math.pi)
                    .divide(180)
                    .multiply(cpValAngle)
                    .done()

                // Turn into a complex number
                cpVal = math.complex({ r: cpVal, phi: cpValAngle });

                // Save Voltage in Component Data
                this.acVoltPwSupplies[i].voltage = math.string(math.round(cpVal, _DECPLACES.CALC));

                // Verify Voltage Signal (related to Nodes)
                let cpVoltPsIndex = this.endVoltPsEndNodes.findIndex(item => item.voltPsRef == this.acVoltPwSupplies[i].ref);
                let voltPsNoP = '';
                if(cpVoltPsIndex > -1) { voltPsNoP = this.endVoltPsEndNodes[cpVoltPsIndex].startNode; }
                if(voltPsNoP == this.startNode) { dcTotVoltage = math.add(dcTotVoltage, cpVal); elemSignal = '+'; retStartNode = this.endNode; retEndNode = this.startNode; }
                if(voltPsNoP == this.endNode) { dcTotVoltage = math.subtract(dcTotVoltage, cpVal); elemSignal = '-'; retStartNode = this.startNode; retEndNode = this.endNode; }
                dcTotVoltage = math.round(dcTotVoltage, _DECPLACES.CALC);

                // Add this ref to array
                this.equivVoltPs.voltsElem.push( { ref: this.acVoltPwSupplies[i].ref, signal: elemSignal, startNode: retStartNode, endNode: retEndNode , value: cpVal.toString() });
            }
            this.equivVoltPs.ref = 'Veq' + this.startNode + this.endNode;
            this.equivVoltPs.value = math.string(math.add(dcTotVoltage, acTotVoltage));

            return this.equivVoltPs;
        };
        this.setVoltPsEndNodes = function () {
            //DC
            for(let i=0; i<this.dcVoltPwSupplies.length; i++) {
                let psNoP = this.dcVoltPwSupplies[i].noP;
                let psNoN = this.dcVoltPwSupplies[i].noN;
                let psRef = this.dcVoltPwSupplies[i].ref;

                if(psNoN == this.startNode) {
                    this.endVoltPsEndNodes.push( { voltPsRef: psRef, startNode: this.startNode, endNode: this.endNode });
                    continue;
                }
                if(psNoN == this.endNode) {
                    this.endVoltPsEndNodes.push( { voltPsRef: psRef, startNode: this.endNode, endNode: this.startNode });
                    continue;
                }
                if(psNoP == this.startNode) {
                    this.endVoltPsEndNodes.push( { voltPsRef: psRef, startNode: this.endNode, endNode: this.startNode });
                    continue;
                }
                if(psNoP == this.endNode) {
                    this.endVoltPsEndNodes.push( { voltPsRef: psRef, startNode: this.startNode, endNode: this.endNode });
                    continue;
                }

                // Start by one of the noP or noN nodes, searching for the final Real Node

                let thisoBranch = JSON.parse(JSON.stringify(this));
                let nextNode = psNoP;
                this.endVoltPsEndNodes.push(getEndNodes(thisoBranch, nextNode, psRef, this.startNode, this.endNode));
            };
            //AC
            for(let i=0; i<this.acVoltPwSupplies.length; i++) {
                let psNoP = this.acVoltPwSupplies[i].noP;
                let psNoN = this.acVoltPwSupplies[i].noN;
                let psRef = this.acVoltPwSupplies[i].ref;

                if(psNoN == this.startNode) {
                    this.endVoltPsEndNodes.push( { voltPsRef: psRef, startNode: this.startNode, endNode: this.endNode });
                    continue;
                }
                if(psNoN == this.endNode) {
                    this.endVoltPsEndNodes.push( { voltPsRef: psRef, startNode: this.endNode, endNode: this.startNode });
                    continue;
                }
                if(psNoP == this.startNode) {
                    this.endVoltPsEndNodes.push( { voltPsRef: psRef, startNode: this.endNode, endNode: this.startNode });
                    continue;
                }
                if(psNoP == this.endNode) {
                    this.endVoltPsEndNodes.push( { voltPsRef: psRef, startNode: this.startNode, endNode: this.endNode });
                    continue;
                }

                // Start by one of the noP or noN nodes, searching for the final Real Node

                let thisoBranch = JSON.parse(JSON.stringify(this));
                let nextNode = psNoN;
                this.endVoltPsEndNodes.push(getEndNodes(thisoBranch, nextNode, psRef, this.startNode, this.endNode));
            };
        };
        this.setCurrentOhmsLaw = function () {
            let currentValue = 0;
            if(this.dcAmpPwSupplies.length) {
                currentValue = this.dcAmpPwSupplies[0].compCurrent();
                // Check the signal
                if(this.currentData.noP == this.dcAmpPwSupplies[0].globalNoP)
                    this.currentData.value = -currentValue;
                else
                    this.currentData.value = currentValue;
              
                if(this.ammeter){
                    if(this.ammeter.noP == this.dcAmpPwSupplies[0].globalNoP)
                        this.currentData.value = math.multiply(currentValue,-1);
                    else
                        this.currentData.value = currentValue;
                }

                // If current is fixed, it won't have any dependency from Veq or Zeq
                this.currentData.fixed = 1;
                return;
            }
            if(this.acAmpPwSupplies.length) {
                currentValue = this.acAmpPwSupplies[0].compCurrent();
                // Check the signal
                if(this.currentData.noP == this.acAmpPwSupplies[0].globalNoP)
                    this.currentData.value = -currentValue;
                else
                    this.currentData.value = currentValue;
              
                if(this.ammeter){
                    if(this.ammeter.noP == this.acAmpPwSupplies[0].globalNoP)
                        this.currentData.value = -currentValue;
                    else
                        this.currentData.value = currentValue;
                }
                this.currentData.fixed = 1;
                return;
            }
            // If there is no Current Power Supply, fill Current's equivalent impedance and voltage
            this.currentData.impedance = this.equivImpedance;
            this.currentData.voltage = this.equivVoltPs;

        };
    }
}

/**
 * Current data
 * @param {Int} cpId Unique Id
 * @param {String} cpRef Current Reference
 * @param {String} cpNoP Starts in this Node
 * @param {String} cpNoN Ends in this Node
 * @param {Boolean} cpType Current Type (0 - Real; 1 - Virtual)
 * @param {String} cpImpedance Current Equivalent Impedance
 * @param {String} cpVoltage Current Equivalent Voltage
 * @param {Boolean} cpFixed Branch has a Current Power Source
 */
class current {
    constructor(cpId, cpRef, cpNoP, cpNoN, cpType = 0, cpImpedance = null, cpVoltage = null, cpValue = null, cpEquation = null, cpFixed = 0, cpNodeEquations = []) {
        this.id = cpId,
        this.ref = cpRef,
        this.noP = cpNoP,
        this.noN = cpNoN,
        this.type = cpType,
        this.impedance = cpImpedance,
        this.voltage = cpVoltage,
        this.value = cpValue,
        this.ohmEquation = cpEquation,
        this.fixed = cpFixed,
        this.nodeEquations = cpNodeEquations,
        this.direction = function () {
            return {
                fromNode:   this.noP,
                toNode:     this.noN,
            };
        };
        this.pushNodeEquation = function (equation) {
            let errorCode = 0;
            this.nodeEquations.push(equation);
            return errorCode;
        };
        this.setEquation = function (equation) {

            if(this.impedance != null) {
                if(this.impedance.impedanceElem.length) {
                    // Set a function to fill current equation with Veq / Zeq
                    let num = '';
                    let numValue = '';
                    let denum = '';
                    let denValue = '';
                    let arrElem = new Array();
                    if(this.fixed == 0) {
                        if(this.noP != 'gnd') { num = this.noP; numValue = this.noP; }
                        else { num = 0; numValue = 0; }

                        this.voltage.voltsElem.forEach(function(arrElem){
                            num += arrElem.signal + arrElem.ref;
                            numValue += arrElem.signal + '('+ arrElem.value +')';
                        });
                        if(this.noN != 'gnd') { num += '-' + this.noN; numValue += '-' + this.noN; }

                        this.impedance.impedanceElem.forEach(function(arrElem){
                            let prefix = '';
                            switch (arrElem.type) {
                                case 'resistor': {
                                    prefix = '';
                                    break;
                                }
                                case 'coil': {
                                    prefix = 'X';
                                    break;
                                }
                                case 'capacitor': {
                                    prefix = 'X';
                                    break;
                                }
                                default:
                                    break;
                            }

                            if(denum == '') denum = prefix + arrElem.ref;
                            else denum += ' + ' + prefix + arrElem.ref;
                            denValue += ' + ' + math.parse(Algebrite.run("simplify(" + arrElem.value + ")")) ;
                        });
                    }
                    let eqTxt = '( ' + num + ' ) / ( ' + denum + ' )';
                    let eqValueTxt = '( ' + numValue + ' ) / ( ' + denValue + ' )';
                    let eqNum = math.parse(num);
                    let eqDenum = math.parse(denum);
                    eqTxt = math.simplify(eqTxt).toString();

                    this.ohmEquation = { plainEq: eqTxt, equatObj: {num: eqNum, denum: eqDenum}, plainEqVl: eqValueTxt };
                }
            }
        };
    }
}

// Component Objects
class voltmeter {
    constructor(cpId, cpRef, cpNoP, cpNoN, cpType, cpIntRes, cpIntResMult, cpPosX, cpPosY) {
        this.id = cpId,
        this.ref = cpRef,
        this.noP = cpNoP,
        this.noN = cpNoN,
        this.type = cpType,
        this.intRes = cpIntRes,
        this.intResMult = cpIntResMult,
        this.posX = cpPosX,
        this.posY = cpPosY,
        this.getNodes = function () {
            return {
                fromNode:   this.noP,
                toNode:     this.noN,
            };
        };
    }
}

class ammeter {
    constructor(cpId, cpRef, cpNoP, cpNoN, cpType, cpIntRes, cpIntResMult, cpPosX, cpPosY) {
        this.id = cpId,
        this.ref = cpRef,
        this.noP = cpNoP,
        this.noN = cpNoN,
        this.type = cpType,
        this.intRes = cpIntRes,
        this.intResMult = cpIntResMult,
        this.posX = cpPosX,
        this.posY = cpPosY,
        this.getNodes = function () {
            return {
                fromNode:   this.noP,
                toNode:     this.noN,
            };
        };
    }
}

class resistor {
    constructor(cpId, cpRef, cpNoP, cpNoN, cpType, cpValue, cpUnitMult, cpTemp, cpPosX, cpPosY) {
        this.id = cpId,
        this.ref = cpRef,
        this.noP = cpNoP,
        this.noN = cpNoN,
        this.type = cpType,
        this.value = cpValue,
        this.unitMult = cpUnitMult,
        this.temp = cpTemp,
        this.posX = cpPosX,
        this.posY = cpPosY,
        this.compValue = function () {
            return this.value + this.unitMult + "&#8486;";
        };
        this.getNodes = function () {
            return {
                fromNode:   this.noP,
                toNode:     this.noN,
            };
        };
    }
}

class capacitor {
    constructor(cpId, cpRef, cpNoP, cpNoN, cpType, cpValue, cpUnitMult, cpInitValue, cpImpedance, cpPosX, cpPosY) {
        this.id = cpId,
        this.ref = cpRef,
        this.noP = cpNoP,
        this.noN = cpNoN,
        this.type = cpType,
        this.value = cpValue,
        this.unitMult = cpUnitMult,
        this.initValue = cpInitValue,
        this.impedance = cpImpedance,
        this.posX = cpPosX,
        this.posY = cpPosY,
        this.compValue = function () {
            return this.value + this.unitMult + "F";
        };
        this.compImpedance = function (circFreqVal, circFreqMul) {
            let errorCode = 1;
            let cZc = 0;

            // Prepare Value
            let cpVal = parseFloat(this.value);
            const getValUnits = multUnits.find(valUnit => valUnit.name === this.unitMult);
            if (typeof getValUnits == 'undefined') {
                errorCode = 1;  // Unit Convertion Error
                return {
                    first: errorCode,
                    second: null
                };
            }
            let cpMult = getValUnits.value;
            cpVal = math.multiply(cpVal, cpMult);

            // Prepare Frequency
            let cFreqVal = parseFloat(circFreqVal);
            const getFreqUnits = multUnits.find(freqUnit => freqUnit.name === circFreqMul);
            if (typeof getFreqUnits == 'undefined') {
                errorCode = 1;  // Unit Convertion Error
                return {
                    first: errorCode,
                    second: null
                };
            }
            let cFreqMul = parseFloat(getFreqUnits.value);
            cFreqVal = math.multiply(cFreqVal, cFreqMul);

            if(cFreqVal) {
                errorCode = 0;  // AC circuit
                let numer = 1;
                // denom = 2 * pi * f * C
                let denom = math.chain(math.pi)
                .multiply(2)
                .multiply(cFreqVal)
                .multiply(cpVal)
                .done()

                // Calculate Component Impedance

                cZc = (-1*math.divide(numer, denom));

                this.impedance = String(math.round(cZc, _DECPLACES.RESULT))+'i';
            }

            return {
                first: errorCode,
                second: cZc
            };
        };
        this.getNodes = function () {
            return {
                fromNode:   this.noP,
                toNode:     this.noN,
            };
        };
    }
}

class coil {
    constructor(cpId, cpRef, cpNoP, cpNoN, cpType, cpValue, cpUnitMult, cpInitValue, cpImpedance, cpPosX, cpPosY) {
        this.id = cpId,
        this.ref = cpRef,
        this.noP = cpNoP,
        this.noN = cpNoN,
        this.type = cpType,
        this.value = cpValue,
        this.unitMult = cpUnitMult,
        this.initValue = cpInitValue,
        this.impedance = cpImpedance,
        this.posX = cpPosX,
        this.posY = cpPosY,
        this.compValue = function () {
            return this.value + this.unitMult + "H";
        };
        this.compImpedance = function (circFreqVal, circFreqMul) {
            let errorCode = 1;
            let cZc = 0;

            // Prepare Value
            let cpVal = parseFloat(this.value);
            const getValUnits = multUnits.find(valUnit => valUnit.name === this.unitMult);
            if (typeof getValUnits == 'undefined') {
                errorCode = 1;  // Unit Convertion Error
                return {
                    first: errorCode,
                    second: null
                };
            }
            let cpMult = getValUnits.value;
            cpVal = math.multiply(cpVal, cpMult);

            // Prepare Frequency
            let cFreqVal = parseFloat(circFreqVal);
            const getFreqUnits = multUnits.find(freqUnit => freqUnit.name === circFreqMul);
            if (typeof getFreqUnits == 'undefined') {
                errorCode = 1;  // Unit Convertion Error
                return {
                    first: errorCode,
                    second: null
                };
            }
            let cFreqMul = parseFloat(getFreqUnits.value);
            cFreqVal = math.multiply(cFreqVal, cFreqMul);

            if(cFreqVal) {
                errorCode = 0;  // AC circuit
                // num = 2 * pi * f * L
                let numer = math.chain(math.pi)
                .multiply(2)
                .multiply(cFreqVal)
                .multiply(cpVal)
                .done()

                // Calculate Component Impedance

                cZc = numer;

                this.impedance = String(math.round(cZc, _DECPLACES.RESULT))+'i';

            }

            return {
                first: errorCode,
                second: cZc
            };
        };
        this.getNodes = function () {
            return {
                fromNode:   this.noP,
                toNode:     this.noN,
            };
        };
    }
}

class dcVoltPower {
    constructor(cpId, cpRef, cpNoP, cpNoN, cpType, cpValue, cpUnitMult, cpIntRes, cpIntResMult, cpVoltage, cpPosX, cpPosY) {
        this.id = cpId,
        this.ref = cpRef,
        this.noP = cpNoP,
        this.noN = cpNoN,
        this.type = cpType,
        this.value = cpValue,
        this.unitMult = cpUnitMult,
        this.intRes = cpIntRes,
        this.intResMult = cpIntResMult,
        this.voltage = cpVoltage,
        this.posX = cpPosX,
        this.posY = cpPosY,
        this.compValue = function () {
            return this.value + this.unitMult + "V";
        };
        this.getNodes = function () {
            return {
                fromNode:   this.noP,
                toNode:     this.noN,
            };
        };
    }
}

class dcCurrPower {
    constructor(cpId, cpRef, cpNoP, cpNoN, cpType, cpValue, cpUnitMult, cpIntRes, cpIntResMult, cpCurrent, cpPosX, cpPosY, gNoP, gNoN) {
        this.id = cpId,
        this.ref = cpRef,
        this.noP = cpNoP,
        this.noN = cpNoN,
        this.type = cpType,
        this.value = cpValue,
        this.unitMult = cpUnitMult,
        this.intRes = cpIntRes,
        this.intResMult = cpIntResMult,
        this.current = cpCurrent,
        this.posX = cpPosX,
        this.posY = cpPosY,
        this.globalNoP = gNoP,
        this.globalNoN = gNoN
        this.compCurrent = function () {

            // Prepare Value
            let cpVal = parseFloat(this.value);
            const getValUnits = multUnits.find(valUnit => valUnit.name === this.unitMult);
            if (typeof getValUnits == 'undefined') {
                errorCode = 1;  // Unit Convertion Error
                console.log("Error in branch[ " + cpId + " ]: function compCurrent, Error Code: " + errorCode);
                return errorCode;
            }

            let cpMult = getValUnits.value;
            cpVal = math.multiply(cpVal, cpMult);

            // Save Voltage in Component Data

            this.current = math.string(math.round(cpVal, _DECPLACES.CALC));
            return this.current;
        };
        this.getNodes = function () {
            return {
                fromNode:   this.noP,
                toNode:     this.noN,
            };
        };
        /*
        this.getGlobalNodes = function () {
            return {
                fromNode:   this.globalNoP,
                toNode:     this.globalNoN,
            };
        };
        */
    }
}

class acVoltPower {
    constructor(cpId, cpRef, cpNoP, cpNoN, cpType, cpValue, cpUnitMult, cpIntRes, cpIntResMult, cpFreq, cpFreqMult, cpPhase, cpTheta, cpVoltage, cpPosX, cpPosY) {
        this.id = cpId,
        this.ref = cpRef,
        this.noP = cpNoP,
        this.noN = cpNoN,
        this.type = cpType,
        this.value = cpValue,
        this.unitMult = cpUnitMult,
        this.intRes = cpIntRes,
        this.intResMult = cpIntResMult,
        this.freq = cpFreq,
        this.freqMult = cpFreqMult,
        this.phase = cpPhase,
        this.theta = cpTheta,
        this.voltage = cpVoltage,
        this.posX = cpPosX,
        this.posY = cpPosY,
        this.compValue = function () {
            return this.value + this.unitMult + "V";
        };
        this.getNodes = function () {
            return {
                fromNode:   this.noP,
                toNode:     this.noN,
            };
        };
    }
}

class acCurrPower {
    constructor(cpId, cpRef, cpNoP, cpNoN, cpType, cpValue, cpUnitMult, cpIntRes, cpIntResMult, cpFreq, cpFreqMult, cpPhase, cpTheta, cpCurrent, cpPosX, cpPosY) {
        this.id = cpId,
        this.ref = cpRef,
        this.noP = cpNoP,
        this.noN = cpNoN,
        this.type = cpType,
        this.value = cpValue,
        this.unitMult = cpUnitMult,
        this.intRes = cpIntRes,
        this.intResMult = cpIntResMult,
        this.freq = cpFreq,
        this.freqMult = cpFreqMult,
        this.phase = cpPhase,
        this.theta =cpTheta;
        this.current = cpCurrent,
        this.posX = cpPosX,
        this.posY = cpPosY,
        this.compCurrent = function () {

            // Prepare Value
            let cpVal = parseFloat(this.value);
            const getValUnits = multUnits.find(valUnit => valUnit.name === this.unitMult);
            if (typeof getValUnits == 'undefined') {
                errorCode = 1;  // Unit Convertion Error
                console.log("Error in branch[ " + cpId + " ]: function compCurrent, Error Code: " + errorCode);
                return errorCode;
            }

            // Absolute Value
            let cpMult = getValUnits.value;
            cpVal = math.multiply(cpVal, cpMult);

            // Angle = Phase * (pi / 180)
            let cpValAngle = parseFloat(this.phase);
            cpValAngle = math.chain(math.pi)
                .divide(180)
                .multiply(cpValAngle)
                .done();

            // Turn into a complex number
            cpVal = math.complex({ r: cpVal, phi: cpValAngle });

            // Save Voltage in Component Data
            this.current = math.string(math.round(cpVal, _DECPLACES.CALC));
            return this.current;
        };
        this.getNodes = function () {
            return {
                fromNode:   this.noP,
                toNode:     this.noN,
            };
        };
        this.getGlobalNodes = function () {
            return {
                fromNode:   this.globalNoP,
                toNode:     this.globalNoN,
            };
        };
    }
}

class mesh {
    constructor(meshId, meshType, meshBranches, curBranch, curSrc, meshLetterId, DisplayId){
        this.id = meshId;
        this.type = meshType;
        this.branches = meshBranches;
        this.branchWithCurSrc = curBranch;
        this.currentSource = curSrc;
        this.letterId = meshLetterId;
        this.branchesDir = [];
        this.componentsLeft = [];
        this.componentsRight = [];
        this.equationData = [];
        this.incognitoEq = '';
        this.revealedCurrSrc = '';
        this.revealedEq = '';
        this.solverEq = '';
        this.currValue;
        this.currMult;
        this.displayId = DisplayId;
    }
}

// Generic CP
class genericCp {
    constructor(cpId, cpRef, cpNoP, cpNoN, cpType, cpValue, cpUnitMult, cpIntRes, cpIntResMult, cpFreq, cpFreqMult, cpPhase, cpTheta, cpTemp, cpInitValue, cpPosX, cpPosY) {
        this.id = cpId,
        this.ref = cpRef,
        this.noP = cpNoP,
        this.noN = cpNoN,
        this.type = cpType,
        this.value = cpValue,
        this.unitMult = cpUnitMult,
        this.intRes = cpIntRes,
        this.intResMult = cpIntResMult,
        this.freq = cpFreq,
        this.freqMult = cpFreqMult,
        this.phase = cpPhase,
        this.theta =cpTheta;
        this.temp = cpTemp;
        this.initValue = cpInitValue,
        this.posX = cpPosX,
        this.posY = cpPosY
    }
}

// Schematic Prototypes
class Schematic {
    /**
     * Creates the schematic object from the parsed data
     * @param {string} version Qucs version
     * @param {View} view View object
     * @param {Grid} grid Grid object
     */
    constructor(version, view, grid) {
        this.qucs_version = version;
        this.properties = {view: view, grid: grid};
        this.components = vectComponents;
        this.connections = vectConnections;
        this.nodes = vectNodes;
    }
}


class View {
    /**
     * Creates the view object
     * @param {string} x1 x coordenate of the top left corner of the schematic window
     * @param {string} y1 y coordenate of the top left corner of the schematic window
     * @param {string} x2 x coordenate of the bottom right corner of the schematic window
     * @param {string} y2 y coordenate of the bottom right corner of the schematic window
     * @param {string} scale current scale
     * @param {string} xpos x coordenate of top left corner the view window
     * @param {string} ypos y coordenate of top left corner the view window
     */
    constructor(x1,y1,x2,y2,scale,xpos,ypos) {
        this.x1 = Number(x1);
        this.y1 = Number(y1);
        this.x2 = Number(x2);
        this.y2 = Number(y2);
        this.scale = 1;
        this.xpos = Number(xpos);
        this.ypos = Number(ypos);
        }
  }

class Grid {
    /**
     * Creates the Grid object
     * @param {string} x distance between vertical grid lines
     * @param {string} y distance between horizontal grid lines
     * @param {string} on state of the grid (0 or 1)
     */
    constructor(x,y,on) {
        this.x = Number(x);
        this.y = Number(y);
        this.active = on;
        }
}

class Component {
    /**
     * Creates the component object and adds it to the components array
     * @param {Object} cp component properties passed from subclass 
     */
    constructor(cp){
        this.id = cp.id;
        this.type = cp.type;
        this.active = cp.active;
        this.name = {
            value: cp.nameValue,
            position: {x: Number(cp.namePositionX), y: Number(cp.namePositionY)},
        };
        this.value = {
            value: cp.valueValue,
            unit: cp.valueUnit,
            visible: cp.valueVisible
        }
        this.position = {
            x: cp.positionX,
            y: cp.positionY,
            angle: cp.positionAngle,
            mirrorx: cp.positionMirror
        };
        this.symbol = {reference: cp.symbol, visible: cp.symbolVisible};
        this.frequency = {
            value: cp.frequencyValue,
            unit: cp.frequencyUnit,
            visible: cp.frequencyVisible
        };
        this.phase = {
            value: cp.phaseValue,
            unit: cp.phaseUnit,
            visible: cp.phaseVisible
        };
        this.properties = {
            impedance: {value: cp.impedanceValue, unit: cp.impedanceUnit, visible: cp.impedanceVisible},
            temperature: {value: cp.temperature, visible: cp.temperatureVisible},
            tc1: {value: cp.tc1, visible: cp.tc1Visible},
            tc2: {value: cp.tc2, visible: cp.tc2Visible},
            tnom: {value: cp.tnom, visible: cp.tnomVisible},
            initialValue: {value: cp.initialValue, visible: cp.initialVisible},
            damping: {value: cp.dampingValue, visible: cp.dampingVisible},
        };
        this.port = cp.ports;

        vectComponents.push(this);
        }
}

class Resistor extends Component {
    /**
     * Creates the resistor object and adds it to the resistor array
     * @param {string} id component id
     * @param {string[]} caracteristics array with the component caracteristics
     */
    constructor(id, caracteristics, ports) {
        super({id: id, 
            type: caracteristics[0],
            nameValue: caracteristics[1],
            active: caracteristics[2],
            positionX: caracteristics[3],
            positionY: caracteristics[4],
            namePositionX: caracteristics[5],
            namePositionY: caracteristics[6],
            positionMirror: caracteristics[7],
            positionAngle: caracteristics[8],
            valueValue: caracteristics[9],
            valueUnit: caracteristics[10],
            valueVisible: caracteristics[11],
            temperature: caracteristics[12],
            temperatureVisible: caracteristics[13],
            tc1: caracteristics[14],
            tc1Visible: caracteristics[15],
            tc2: caracteristics[16],
            tc2Visible: caracteristics[17],
            tnom: caracteristics[18],
            tnomVisible: caracteristics[19],
            symbol: caracteristics[20],
            symbolVisible: caracteristics[21],
            ports: ports})
        
        vectResistor.push(this);
        }
}

class Capacitor extends Component {
    /**
     * Creates the capacitor object and adds it to the capacitor array
     * @param {string} id component id
     * @param {string[]} caracteristics array with the component caracteristics
     */
    constructor(id, caracteristics, ports) {
        super({id: id,
            type: caracteristics[0],
            nameValue: caracteristics[1], 
            active: caracteristics[2],  
            positionX: caracteristics[3],  
            positionY: caracteristics[4],
            namePositionX: caracteristics[5],
            namePositionY: caracteristics[6],  
            positionMirror: caracteristics[7],
            positionAngle: caracteristics[8],
            valueValue: caracteristics[9],
            valueUnit: caracteristics[10], 
            valueVisible: caracteristics[11],
            initialValue: caracteristics[12],
            initialVisible: caracteristics[13],
            symbol: caracteristics[14],
            symbolVisible: caracteristics[15],          
            ports: ports})
        vectCapacitor.push(this);
        }
}

class Inductor extends Component {
    /**
     * Creates the inductor object and adds it to the inductor array
     * @param {string} id component id
     * @param {string[]} caracteristics array with the component caracteristics
     */    
    constructor(id, caracteristics, ports) {
        super({id: id,
            type: caracteristics[0],
            nameValue: caracteristics[1],
            active: caracteristics[2],
            positionX: caracteristics[3],
            positionY: caracteristics[4],
            namePositionX: caracteristics[5],
            namePositionY: caracteristics[6],
            positionMirror: caracteristics[7],
            positionAngle: caracteristics[8],
            valueValue: caracteristics[9],
            valueUnit: caracteristics[10],
            valueVisible: caracteristics[11],           
            initialValue: caracteristics[12],
            initialVisible: caracteristics[13],
            ports: ports})    
        vectInductor.push(this);
        }
}

class DcVoltPower extends Component {
    /**
     * Creates the dc voltage source object and adds it to the dc voltage source array
     * @param {string} id component id
     * @param {string[]} caracteristics array with the component caracteristics
     */
    constructor(id, caracteristics, ports) {
        super({id: id,
            type: caracteristics[0],
            nameValue: caracteristics[1],
            active: caracteristics[2],
            positionX: caracteristics[3],
            positionY: caracteristics[4],
            namePositionX: caracteristics[5],
            namePositionY: caracteristics[6],
            positionMirror: caracteristics[7],
            positionAngle: caracteristics[8],
            valueValue: caracteristics[9],
            valueUnit: caracteristics[10],
            valueVisible: caracteristics[11],
            impedanceValue: caracteristics[12],
            impedanceUnit: caracteristics[13],   
            impedanceVisible: caracteristics[14],
            ports: ports})
        vectDcVoltPower.push(this);
        }
}   

class DcCurrPower extends Component {
    /**
     * Creates the dc current source object and adds it to the dc current source array
     * @param {string} id component id
     * @param {string[]} caracteristics array with the component caracteristics
     */
    constructor(id, caracteristics, ports) {
        super({id: id,
            type: caracteristics[0],
            nameValue: caracteristics[1],
            active: caracteristics[2],
            positionX: caracteristics[3],
            positionY: caracteristics[4],
            namePositionX: caracteristics[5],
            namePositionY: caracteristics[6],
            positionMirror: caracteristics[7],
            positionAngle: caracteristics[8],
            valueValue: caracteristics[9],
            valueUnit: caracteristics[10],
            valueVisible: caracteristics[11],
            impedanceValue: caracteristics[12],
            impedanceUnit: caracteristics[13],  
            impedanceVisible: caracteristics[14],
            ports: ports})
        vectDcCurrPower.push(this);
        }
}

class AcVoltPower extends Component {
    /**
     * Creates the ac voltage source object and adds it to the ac voltage source array 
     * @param {string} id component id
     * @param {string[]} caracteristics array with the component caracteristics
     */
    constructor(id, caracteristics, ports) {
        super({id: id,
            type: caracteristics[0],
            nameValue: caracteristics[1],
            active: caracteristics[2],
            positionX: caracteristics[3],
            positionY: caracteristics[4],
            namePositionX: caracteristics[5],
            namePositionY: caracteristics[6],
            positionMirror: caracteristics[7],
            positionAngle: caracteristics[8],
            valueValue: caracteristics[9],
            valueUnit: caracteristics[10],
            valueVisible: caracteristics[11],
            frequencyValue: caracteristics[12],
            frequencyUnit: caracteristics[13],
            frequencyVisible: caracteristics[14], 
            phaseValue: caracteristics[15],
            phaseVisible: caracteristics[16],
            dampingValue: caracteristics[17],
            dampingVisible: caracteristics[18],
            impedanceValue: caracteristics[19],
            impedanceUnit: caracteristics[20],  
            impedanceVisible: caracteristics[21],
            ports: ports})
        vectAcVoltPower.push(this);
        }
}

class AcCurrPower extends Component {
    /**
     * Creates the ac current source object and adds it to the ac current source array
     * @param {string} id component id
     * @param {string[]} caracteristics array with the component caracteristics
     */
    constructor(id, caracteristics, ports) {
        super({id: id,
            type: caracteristics[0],
            nameValue: caracteristics[1],
            active: caracteristics[2],
            positionX: caracteristics[3],
            positionY: caracteristics[4],
            namePositionX: caracteristics[5],
            namePositionY: caracteristics[6],
            positionMirror: caracteristics[7],
            positionAngle: caracteristics[8],
            valueValue: caracteristics[9],
            valueUnit: caracteristics[10],
            valueVisible: caracteristics[11],
            frequencyValue: caracteristics[12],
            frequencyUnit: caracteristics[13],
            frequencyVisible: caracteristics[14], 
            phaseValue: caracteristics[15],
            phaseVisible: caracteristics[16],
            dampingValue: caracteristics[17],
            dampingVisible: caracteristics[18],
            impedanceValue: caracteristics[19],
            impedanceUnit: caracteristics[20],  
            impedanceVisible: caracteristics[21],
            ports: ports})
        vectAcCurrPower.push(this);
        }
}

class GND extends Component {
    /**
     * Creates the ground object and adds it to the ground array
     * @param {string} id component id
     * @param {string[]} caracteristics array with the component caracteristics
     */
    constructor(id, caracteristics, ports) {
        super({id: id,
            type: caracteristics[0],
            active: caracteristics[2],
            nameValue: caracteristics[1],
            namePositionX: caracteristics[5],
            namePositionY: caracteristics[6],
            positionX: caracteristics[3],
            positionY: caracteristics[4],
            positionAngle: caracteristics[8],
            positionMirror: caracteristics[7],
            ports: ports})
        vectGND.push(this);
        }
}

class VProbe extends Component {
    /**
     * Creates the voltage probe object and adds it to the voltage probe array
     * @param {string} id component id
     * @param {string[]} caracteristics array with the component caracteristics
     */
    constructor(id, caracteristics, ports) {
        super({id: id,
            type: caracteristics[0],
            nameValue: caracteristics[1],
            active: caracteristics[2],
            positionX: caracteristics[3],
            positionY: caracteristics[4],
            namePositionX: caracteristics[5],
            namePositionY: caracteristics[6], 
            positionMirror: caracteristics[7],
            positionAngle: caracteristics[8],
            impedanceValue: caracteristics[9],
            impedanceUnit: caracteristics[10],
            impedanceVisible: caracteristics[11],
            ports: ports})
        vectVProbe.push(this);
        }
}

class IProbe extends Component {
    /**
     * Creates the current probe object and adds it to the current probe array
     * @param {string} id component id
     * @param {string[]} caracteristics array with the component caracteristics
     */
    constructor(id, caracteristics, ports) {
        super({id: id,
            type: caracteristics[0],
            nameValue: caracteristics[1],
            active: caracteristics[2],
            positionX: caracteristics[3],
            positionY: caracteristics[4],
            namePositionX: caracteristics[5],
            namePositionY: caracteristics[6], 
            positionMirror: caracteristics[7],
            positionAngle: caracteristics[8],
            impedanceValue: caracteristics[9],
            impedanceUnit: caracteristics[10],
            impedanceVisible: caracteristics[11],
            ports: ports})
        vectIProbe.push(this);
        }
}

class DCSim {
    constructor(caracteristics){
        this.type = caracteristics[0];
        this.name = {value: caracteristics[1], position: {x: caracteristics[5], y: caracteristics[6]}};
        this.active = caracteristics[2];
        this.position = {x: caracteristics[3], y: caracteristics[4], angle: caracteristics[8], mirrorx: caracteristics[7]};
        this.properties = {temperature: {value: caracteristics[9], visible: caracteristics[10]},
                           reltol: {value: caracteristics[11], visible: caracteristics[12]},
                           abstol: {value: caracteristics[13], unit: caracteristics[14], visible: caracteristics[15]},
                           vntol: {value: caracteristics[16], unit: caracteristics[17], visible: caracteristics[18]},
                           saveOps: {value: caracteristics[19], visible: caracteristics[20]},
                           maxIter: {value: caracteristics[21], visible: caracteristics[22]},
                           saveAll: {value: caracteristics[23], visible: caracteristics[24]},
                           convHelper: {value: caracteristics[25], visible: caracteristics[26]},
                           solver: {value: caracteristics[27], visible: caracteristics[28]}
        };
        vectSims.push(this);
    }
}


class ACSim {
    constructor(caracteristics) {
        console.log(caracteristics);
        this.type = caracteristics[0];
        this.name = {value: caracteristics[1], position: {x: caracteristics[5], y: caracteristics[6]}};
        this.active = caracteristics[2];
        this.position = {x: caracteristics[3], y: caracteristics[4], angle: caracteristics[8], mirrorx: caracteristics[7]};

        this.properties = {type: {value: caracteristics[9], visible: caracteristics[10]},
                           start: {value: caracteristics[11], unit: caracteristics[12] ,visible: caracteristics[13]},
                           stop: {value: caracteristics[14], unit: caracteristics[15], visible: caracteristics[16]}};
        //Get the list of frequencies [x Hz; y Hz; z Hz]
        if(caracteristics[9] == 'list' || caracteristics[9]  == 'const'){
            let i=0;
            let freqList = caracteristics[17] + ' ' + caracteristics[18];
            while(!caracteristics[18+i].endsWith(']')){
                freqList += ' ';
                i+=2;
                freqList += caracteristics[17+i] + ' ' + caracteristics[18+i];
            }
            this.properties.points = {value: freqList, visible: caracteristics[19+i]};
            this.properties.noise = {value: caracteristics[20+i], visible: caracteristics[21+i]};
        }
        else{
            this.properties.points = {value: caracteristics[17], visible: caracteristics[18]};
            this.properties.noise = {value: caracteristics[19], visible: caracteristics[20]};
        }
        
        vectSims.push(this);
    }
}

class Connection {
    /**
     * Creates the connection object and adds it to the connections array
     * @param {string} id connection id
     * @param {Wire[]} wires the list of wires that compose the connection
     * @param {Port[]} ports the list of the connected component ports
     */
    constructor(id, wires, ports) {
        this.id = id;
        this.wires = wires;
        this.ports = ports;
        vectConnections.push(this);
    }
}

class Wire {
    /**
     * Creates the wire object and adds it to the wire array
     * @param {string} id wire id
     * @param {string[]} caracteristics array with the wire caracteristics
     */
    constructor(id, caracteristics) {
    this.id = id;
    this.begin = {x: Number(caracteristics[0]), y: Number(caracteristics[1]), connectedWires: [], connectedPorts: []};
    this.end = {x: Number(caracteristics[2]), y: Number(caracteristics[3]), connectedWires: [], connectedPorts: []};
    this.label = {
        text: caracteristics[4],
        position: {x: Number(caracteristics[5]), y: Number(caracteristics[6])}, 
        distance: Number(caracteristics[7])};
    this.node_set = caracteristics[8];
    this.wire = "";

    vectWires.push(this);
    }
}

class CircuitNode {
    static index = 0;
    /**
     * This function creates a node object and adds it to the nodes array
     * @param {Number} x x coordinate of the node
     * @param {Number} y y coordinate of the node
     * @param {Object[]} connect all the ports and wires connected to the node
     * @param {string} net the net name of the node
     */
    constructor(x,y, connect, net){   
        this.position = {x: x, y: y};
        this.id = 'n' + CircuitNode.index;
        this.name = net;
        this.connection = connect;
        CircuitNode.index++;
        vectNodes.push(this);
    }
}