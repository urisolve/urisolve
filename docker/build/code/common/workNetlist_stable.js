/**
 * Function to validate input netlist file
 * @param {string} text Netlist text file to validate
 * @returns {object array} errorCode Error Code to implement actions
 * @returns {array} outFile String array with Netlist lines
 * @description error Code 0: Real nodes without ID detected -----------------------> CRITICAL
 * @description error Code 1: Virtual nodes mistakenly identified
 * @description error Code 2: Detected a badly named ground ------------------------> CRITICAL
 * @description error Code 3: Detected a badly named node (e.g V+"letter")
 * @description error Code 4: Element with invalid unit detected -------------------> CRITICAL
 * @description error Code 5: Element with invalid name detected (duplicated) ------> CRITICAL
 * @description error Code 6: Detected AC components in DC circuit -----------------> CRITICAL
 * @description error Code 7: Detected Multiple Current Sources in the same branch -> CRITICAL
 * @description error Code 8: Detected Multiple iProbes in the same Branch
 * @description error Code 9: Multiple Voltage Sources in the same Branch
 * @description error Code 10: Found different AC Frequencies
 * @description error Code 11: Detect duplicated nodes (short circuits)-------------> CRITICAL
 * @description error Code 12: Multiple Voltage probes in the same nodes
 * @description error Code 13: Duplicated Vprobes names
 * @description error Code 14: Ground Node was not found
 * @description error Code 15: Circuit with no real Nodes found --------------------> CRITICAL
 * @description error Code 16: Sets of in-series isolated Voltage Sources found
 * @description error Code 17: Non-critical invalid ID
 */

 
/*
 *  MTN Error Codes Table
    
    error 0 Return Object:
        * errorCode (integer): error Code
        * nodeNumber (integer): number of non-identified real nodes
        * substitutions (string array): list of virtual replacement IDs
    
    error 1 Return Object:
        * errorCode (integer): error Code
        * nodeNumber (integer): number of identified virtual nodes
        * IDs (string array): name mistakenly given to virtual nodes
    
    error 2 Return Object:
    * errorCode (integer): error Code
    * wrongNamesGND (string array): list of wrong ground IDs
    
    error 3 Return Object:
        * errorCode (integer): error Code     
        * badIDs (string array): list of given IDs
        * newIDs (string array): list of new replacement IDs
    
    error 4 Return Object:
        * errorCode (integer): error Code
        * elementNames (string array): list of elements with invalid units
        
    error 5 Return Object:
        * errorCode (integer): error Code
        * elementNames (string array): list of duplicated names
    
    error 6 Return Object:
        * errorCode (integer): error Code
        * cpList (string Array): Component list (names)
    
    error 7 Return Object:
        * errorCode (integer): error Code
        * MultipleSources (string array): list of Current sources in the same branches
    
    error 8 Return Object:
        * errorCode (integer): error Code
        * MultipleProbes (string array): list of iProbes in the same branches
        * ChosenProbes (string array): list of chosen iProbes for determining current direction
    
    error 9 Return Object:
        * errorCode (integer): error Code
        * VoltageSources (struct):
        *   {   VeqExpression (string): equivalent voltage expression of the branch
        *       VeqID (string): equivalent source name ex: "VeqAB"
        *       beginning (string): Branch initial node
        *       end (string): Branch final node
        *   }
    
    error 10 Return Object:
        * errorCode (integer): error Code
        * chosenFreq (integer): Chosen frequency
        * chosenFreqUnit (string): Unit of the chosen Frequency
        * controllers (object): list of controllers and frequencies
        * sources (object): list of sources and their frequencies
    
    error 11 Return Object:
        * errorCode (integer): error Code
        * nodes (string array): duplicated nodes detected
    
    error 12 Return Object:
        * errorCode (integer): error Code
        * removed (string array): IDs of the removed VProbes
        * netLines (string array): netlist lines of the removed VProbes
         
    error 13 Return Object:
        * errorCode (integer): error Code
        * name (string): VProbe ID
        
    error 14 Return Object:
        * errorCode (integer): error Code
*/

function validateNetlist(text) {

    var lines = text.split("\n");
    var pos;
    var outFile='';
    var tempRES = new Array();
    let alphabet = "abcdefghijklmnopqrstuwxyz";

    for(var line = 0; line < lines.length; line++){
        // Remove empty lines
        if(lines[line].length < 2) continue;
        // Remove header
        if(lines[line].substring(0,1) == '#') continue;
        // Add valid lines
        outFile += lines[line].replace(/[\/\\]/g, "")+'\n';
    }

    lines = outFile.split('\n');
    // Check for empty lines once again
    for(let i = 0; i< lines.length; i++){
        if(lines[i].length < 2)
            lines.splice(i,1);
    } 

    // Search and Remove Wire and Internal Resistances
    var outFile='';
    for(var line = 0; line < lines.length; line++){
        var virtualNode, subNode;
        const words = lines[line].split(' ');
        for(var word = 0; word < words.length; word++){
            //Search the resistance indicator
            pos = words[word].search('_TEMP_');
            // Check if it is a resistance or PSupply
            if(pos >= 0 && words[0].search('R:_R_') >= 0 && word > 0) {
                // Get the connection
                if(word == 1) {virtualNode = words[word+1];}
                if(word == 2) {virtualNode = words[word-1];}
                // Search the second node instance
                for(let i = 0; i < lines.length; i++){
                    const newWords = lines[i].split(' ');
                    let replaceIndex = newWords.indexOf(words[word]);
                    if(replaceIndex >= 0 && i != line){
                        // Replace the temp node with the virtual node
                        newWords[replaceIndex] = virtualNode;
                        // Get the connection
                        if(replaceIndex == 1) {subNode = newWords[replaceIndex+1];}
                        if(replaceIndex == 2) {subNode = newWords[replaceIndex-1];}
                        // Convert Array to Line
                        lines[i] = newWords.join(' ');
                        // Create and Add Resistor Info Object
                        let tempNodes = new Array();
                        tempNodes.push(virtualNode);
                        tempNodes.push(subNode);
                        let tempR = {
                            connections: tempNodes,
                            netLine: lines[line]
                        }
                        tempRES.push(tempR);
                        // Remove Temp Resistor Line
                        lines.splice(line,1);
                        break;
                    }
                }
            }
        }
    }

    var outLines = lines;
    
    var errorList = new Array();

    // Check Netlist for Errors
    //var outLines = text.split('\n');

    /* [#0] & [#1] errorCode verification */
    var Nodes = new Array();
    var voltmetersLines = new Array();
    var ammetersLines = new Array();
    for(var line = 0; line < outLines.length; line++){
        let params = outLines[line].split(' ');

        // Fix No Spaced Units
        if( params[0] != '#' && params.length > 3 && (params[3].split('"').length-1) > 1 && !params[0].includes(".AC:") && !params[0].includes(".DC:")){
            let unitString = params[3];
            unitString = unitString.split('"');
            let index = 0;
            let numberStr = unitString[1][index];
            while(!isNaN(numberStr) || numberStr == '.'){
                index++;
                numberStr += unitString[1][index];
            }

            numberStr = numberStr.slice(0, -1);

            params[3] = unitString[0] + '"' + numberStr;
            params.splice(4,0,unitString[1].substring(index)+'"');
            outLines[line] = params.join(' ');
        }

        //Save Amps Lines
        if(outLines[line].includes("IProbe:")){
            ammetersLines.push(outLines[line]);
        }

        // Check and exclude Voltmeters
        if(outLines[line].includes("VProbe:")){
            voltmetersLines.push(outLines[line]);
            outLines.splice(line,1);
            line--;
            
        }
        // Save valid nodes
        else if(params[0] != '#' && params.length >= 3 && !params[0].includes(".AC:") && !params[0].includes(".DC:")){
            Nodes.push(params[1]);
            Nodes.push(params[2]);
        }

    }
    ammetersLines = [... new Set(ammetersLines)];

    // Remove \n from nodes
    for(let i = 0; i < Nodes.length; i++){
        Nodes[i] = Nodes[i].replace(/(\r\n|\n|\r)/gm, "");
    }
    // Remove \n from ammeters Lines
    for(let i = 0; i < ammetersLines.length; i++){
        ammetersLines[i] = ammetersLines[i].replace(/(\r\n|\n|\r)/gm, "");
    }

    var cnt = 0;
    var IDnotSET = 0;
    var badID = 0;
    var analysedNodes = new Array();
    var badIDnames = new Array();
    let badIDsubs = new Array();
    var realNodes = new Array();

    // Find Real Nodes
    for(let element = 0; element < Nodes.length; element++){
        let auxVar = Nodes[element];
        for(let subelement = 0; subelement < Nodes.length; subelement++){
            if(auxVar == Nodes[subelement] && !realNodes.includes(auxVar))
                cnt++;

        }
        if(cnt >= 3)
            realNodes.push(auxVar);
        cnt = 0;
    }
    cnt = 0;

    if(realNodes.length == 0){
        let error = {
            errorCode: 15
        }
        errorList.push(error);

        return {
        first: errorList,
        second: outLines
        };
    }

    // Search for every Node Instances
    for(let element = 0; element < Nodes.length; element++){
        var value = Nodes[element];
        // Avoid repeated operation for the same node
        if(!analysedNodes.includes(value))
        {
            for(var line = 0; line < Nodes.length; line++){
                if(value == Nodes[line])
                    cnt++;
            }
            analysedNodes.push(value);
            // If -> node is real & "_net" exists = ID missing
            if(cnt >= 3 && value.search("_net") != -1 && value.search("gnd") == -1)
                IDnotSET++;
            // If -> node is virtual & "_net" does not exist = bad ID
            if(cnt < 3 && value.search("_net") == -1 && value.search("gnd") == -1){
                badIDnames.push(value);
                badID++;  
            }
            cnt = 0;
        }
    }

    // Assign a valid virtual ID to the node 
    let virtualIDindex = 0;
    for(let i = 0; i<badIDnames.length; i++){
        // Find an available netID
        let found = false;
        while(!found){
            if(!analysedNodes.includes("_net"+virtualIDindex.toString()))
                found = true;
            else
                virtualIDindex++;
        }
        // Create node ID
        let subs = "_net"+virtualIDindex.toString();
        Nodes = Nodes.map(e => e.replace(badIDnames[i],subs));
        analysedNodes[analysedNodes.indexOf(badIDnames[i])] = subs;
        badIDsubs.push(subs);
        // Make the substitution
        for(let k = 0; k< outLines.length; k++){
            let words = outLines[k].split(' ');
            if(words[1] == badIDnames[i])
                words[1] = subs;
            if(words[2] == badIDnames[i])
                words[2] = subs;
            outLines[k] = words.join(' ');
        }
    }

    if(IDnotSET > 0){
        let error = {
            errorCode: 0,
            nodeNumber: IDnotSET}; 
        errorList.push(error);
    }

    if(badID > 0){
        let error = {
            errorCode: 1,
            nodeNumber: badID,
            IDs: badIDnames,
            substitutions: badIDsubs}; 
        errorList.push(error);
    }

    /* [#2] errorCode verification */
    //Possible mistaken strings for ground node
    var gndStrings = ["GND", "GNd", "Gnd","GnD","gND","gnD","gNd","Ground","GROUND"];
    var wrongGnd= new Array();
    // Search prev strings in nodes
    for(let element = 0; element < analysedNodes.length; element++){
        for(let str = 0; str < gndStrings.length; str++){
            if(gndStrings[str] == analysedNodes[element])
            wrongGnd.push(gndStrings[str]);       
        }
    }
    if(wrongGnd.length > 0)
    {
        let error = {
            errorCode: 2,
            wrongNamesGND: wrongGnd}; 
        errorList.push(error);
    }

    /* [#3] errorCode verification */
    badIDnames= [];
    let IDreplacements = new Array();
    for(let element = 0; element < analysedNodes.length; element++){
        // Nodes should not be named V+"ID"
        if(analysedNodes[element].length == 2 && analysedNodes[element][0] == "V")
            badIDnames.push(analysedNodes[element]);        
    } 

    for(let element = 0; element < badIDnames.length; element++){
        // Replace node for the second character if possible
        if(!analysedNodes.includes(badIDnames[element][1])){
            for(let i = 0; i< outLines.length; i++){
                let words = outLines[i].split(" ");
                if(words[1] == badIDnames[element])
                    words[1] = badIDnames[element][1].toUpperCase();
                if(words[2] ==  badIDnames[element])
                    words[2] = badIDnames[element][1].toUpperCase();
                outLines[i] = words.join(" ");
            }
            IDreplacements.push(analysedNodes[element][1]);
        }
        // Otherwise find an available character
        else{
            alphabet = alphabet.toUpperCase();
            for(let k = 0; k<alphabet.length; k++){
                if(!analysedNodes.includes(alphabet[k])){
                    for(let i = 0; i< outLines.length; i++){
                        let words = outLines[i].split(" ");
                        if(words[1] == badIDnames[element])
                            words[1] = alphabet[k];
                        if(words[2] == badIDnames[element])
                            words[2] = alphabet[k];
                        outLines[i] = words.join(" ");
                    }  
                    IDreplacements.push(alphabet[k]);
                    break;
                }
            }   
        }
    }

    if(badIDnames.length > 0)
    {
        let error = {
            errorCode: 3,
            badIDs: badIDnames,
            newIDs: IDreplacements}; 
        errorList.push(error);
    }


    /* [#4] errorCode verification */
    
    value = 0;
    badIDnames= [];
    var badUnits = new Array();
    var Electrical = {
        References: new Array(),
        Components: new Array(),
        Units: new Array(),
        Values: new Array()
    };  
    
    for(var line = 0; line < outLines.length; line++){
        let params = outLines[line].split('"');
        // Only Search for Units in Valid Lines (Exclude Controller and Ammeters)
        if( outLines[line].length > 5 && 
           !outLines[line].includes(".DC:") &&
           !outLines[line].includes(".AC:") && 
           !outLines[line].includes("IProbe:")){
            
            value = params[1].split(' ');
            let auxVar = params[0].split(' ');
            auxVar = auxVar[0].split(':');
            Electrical.References.push(auxVar[1]);
            Electrical.Components.push(auxVar[0]);
        
            let begUnitCount = 0;
            let endUnitCount = 0;
            // Identify unit position to search
            switch (auxVar[0]) {
                case 'Iac':
                case 'Idc':
                    begUnitCount = 0;
                    endUnitCount = 7;
                    break;
                case 'C':
                    begUnitCount = 8;
                    endUnitCount = 15;
                    break;
                case 'L':
                    begUnitCount = 16;
                    endUnitCount = 23;
                    break;
                case 'Vac':
                case 'Vdc':
                    begUnitCount = 32;
                    endUnitCount = 39;
                    break;
                case 'R':
                    begUnitCount = 40;
                    endUnitCount = 47;
                    break;
            }

            // Check valid Units
            let unitChecked = 0;
            for (let unit = begUnitCount; unit < endUnitCount+1; unit++){
                if(multUnits[unit].name == value[1])
                    unitChecked = 1;
            }

            // Throws an error if the element does not have a valid unit
            if(isNaN(parseInt(value[0])) || value[1].length == 0 || unitChecked == 0)
            {
                params = params[0].split(' ');
                params = params[0].split(':');
                badIDnames.push(params[1]);
                badUnits.push(value[1]);
            } 
            else
            {
                Electrical.Values.push(value[0]);
                Electrical.Units.push(value[1]);
            }
        }

        if(outLines[line].includes("IProbe:")){
            // Get Ammeters name and reference
            let aux = outLines[line].split(' ');
            aux = aux[0].split(':');
            Electrical.References.push(aux[1]);
            Electrical.Components.push(aux[0]);
        }
    }
    
    if(badIDnames.length > 0 || badUnits.length > 0)
    {
        let error = {
            errorCode: 4,
            elementNames: badIDnames,
            wrongUnits: badUnits}; 
        errorList.push(error);
    }

    /* [#5] errorCode verification */
    cnt = 0;
    badIDnames = [];
    for(let element = 0; element < Electrical.References.length; element++){
        let auxVar = Electrical.References[element];
        for(let subelement = 0; subelement < Electrical.References.length; subelement++){
            if(auxVar == Electrical.References[subelement])
                cnt ++;
        }
        // If the name is duplicated add it to array
        if(cnt > 1 && !badIDnames.includes(auxVar))
            badIDnames.push(auxVar);
        cnt = 0;
    }
    
    if(badIDnames.length > 0)
    {
        let error = {
            errorCode: 5,
            elementNames: badIDnames}; 
        errorList.push(error);
    }

    /* [#6] errorCode verification */
    if((Electrical.Components.includes("L") || Electrical.Components.includes("C")) && 
        (!Electrical.Components.includes("Vac") && !Electrical.Components.includes("Iac")))
    {
        let list = new Array();
        for(let i = 0; i< Electrical.References.length;i++){
            if(Electrical.Components[i] == "L" || Electrical.Components[i] == "C")
                list.push(Electrical.References[i]);
        }
        let error = {
            errorCode: 6,
            cpList: list }; 
        errorList.push(error);
    }
    
    

    let Branches = new Array();
    let NewNodes = [];
    let analysedLines = [];

    while(Nodes.length) NewNodes.push(Nodes.splice(0,2));
    // Create Branches
    for(let i = 0; i < NewNodes.length; i++){
        for(let j = 0; j < NewNodes[i].length; j++){
            //Maybe move this inside verification
            var Branch = {
                beginning: "",
                end: "",
                elements: new Array(),
                type: new Array(),
                polarity: new Array()
            };
            // In case real node is found
            if(realNodes.includes(NewNodes[i][j]) && !analysedLines.includes(i))
            {
                // Save Line
                analysedLines.push(i);
                // Update Branch
                Branch.beginning = NewNodes[i][j];
                Branch.elements.push(Electrical.References[i]);
                Branch.type.push(Electrical.Components[i]);
                if(j==0 && (Electrical.Components[i] == "Vdc" || Electrical.Components[i] == "Vac"))
                    Branch.polarity.push("-");
                else if(j==1 && (Electrical.Components[i] == "Vdc" || Electrical.Components[i] == "Vac"))
                    Branch.polarity.push("+");
                else
                    Branch.polarity.push("");
                // Switch Line Index
                if(j == 0) j=1;
                else j=0;
                // If the following node is Real...
                if(realNodes.includes(NewNodes[i][j])){
                    // Finish the Branch
                    Branch.end = NewNodes[i][j];
                    Branches.push(Branch);
                    
                }
                else{
                    var aux = i;
                    while(!realNodes.includes(NewNodes[aux][j])){
                        for(var k= 0; k < NewNodes.length; k++){
                            // Find Virtual Node
                            if((NewNodes[k].indexOf(NewNodes[aux][j]) != -1) && (!analysedLines.includes(k))){
                                // Update Branch
                                Branch.elements.push(Electrical.References[k]);
                                Branch.type.push(Electrical.Components[k]);
                                // Add to Analysed Lines to avoid double verification
                                analysedLines.push(k);
                                j = NewNodes[k].indexOf(NewNodes[aux][j]);
                                // Determine Source Polarity
                                if(j==0 && (Electrical.Components[k] == "Vdc" || Electrical.Components[k] == "Vac"))
                                    Branch.polarity.push("-");
                                else if(j==1 && (Electrical.Components[k] == "Vdc" || Electrical.Components[k] == "Vac"))
                                    Branch.polarity.push("+");
                                else
                                    Branch.polarity.push("");
                                // Switch Line Index
                                if(j == 0) j=1;
                                else j=0;
                                //if(realNodes.includes(NewNodes[k][j])) break;
                                aux = k;
                                break;
                            }

                        }
                    }
                    // Finish the Branch
                    Branch.end = NewNodes[k][j];
                    Branches.push(Branch);
                    
                }
                
            }
        }
    }

    // Find Ammeters in parallel
    let parallelAmmeters = new Array();
    for(let i = 0; i<Branches.length; i++){
        if(Branches[i].type.every( (val) => val === "IProbe" )){
            parallelAmmeters.push(Branches[i].elements);
            Branches.splice(i,1);
            i--;
        }
    }
    //Remove them
    for(let i = 0; i<parallelAmmeters.length; i++){
        for(let j = 0; j<parallelAmmeters.length; j++){
            for(let line = 0; line < outLines.length; line++){
                // Check and exclude parallel Ammeters
                let params = outLines[line].split(' ');
                params = params[0].split(':');
                if(params[1] == parallelAmmeters[i][j]){
                    outLines.splice(line,1);
                    line--;
                }
            }
        }
    }

    analysedNodes = [];
    badIDnames = [];
    let NodesReg = [];

    for(let line = 0; line < outLines.length; line++){
        let params = outLines[line].split(' ');
        // Save valid nodes
        if(params[0] != '#' && params.length >= 3 && !params[0].includes(".AC:") && !params[0].includes(".DC:")){
            NodesReg.push(params[1]);
            NodesReg.push(params[2]);
        }
    }

    // Remove \n from nodesRegister
    for(let i = 0; i < NodesReg.length; i++){
        NodesReg[i] = NodesReg[i].replace(/(\r\n|\n|\r)/gm, "");
    }

    // Remove real nodes created by parallel ammeters
    for(let element = 0; element < NodesReg.length; element++){
        let value = NodesReg[element];
        // Avoid repeated operation for the same node
        if(!analysedNodes.includes(value))
        {
            for(let line = 0; line < NodesReg.length; line++){
                if(value == NodesReg[line])
                    cnt++;
            }
            analysedNodes.push(value);
            // If -> node is virtual & "_net" does not exist = bad ID
            if(cnt < 3 && value.search("_net") == -1 && value.search("gnd") == -1){
                badIDnames.push(value); 
            }
            cnt = 0;
        }
    }

    // Assign a valid virtual ID to the node 
    virtualIDindex = 0;
    for(let i = 0; i<badIDnames.length; i++){
        // Find an available netID
        let found = false;
        while(!found){
            if(!analysedNodes.includes("_net"+virtualIDindex.toString()))
                found = true;
            else
                virtualIDindex++;
        }
        // Create node ID
        let subs = "_net"+virtualIDindex.toString();
        NodesReg = NodesReg.map(e => e.replace(badIDnames[i],subs));
        analysedNodes[analysedNodes.indexOf(badIDnames[i])] = subs;
        badIDsubs.push(subs);
        // Make the substitution
        for(let k = 0; k< outLines.length; k++){
            let words = outLines[k].split(' ');
            if(words[1] == badIDnames[i])
                words[1] = subs;
            if(words[2] == badIDnames[i])
                words[2] = subs;
            outLines[k] = words.join(' ');
        }
    }


    
    // Find multiple Current Sources and Ammeters in Branch
    MultipleSources = new Array();
    CurrSourcesFound = new Array();
    MultipleProbes = new Array();
    iProbesFound = new Array();
    for(let branch = 0; branch < Branches.length; branch++){
    
        for(let element = 0; element < Branches[branch].type.length; element++){
            /* [#7] errorCode verification */
            if(Branches[branch].type[element] == "Idc" || 
               Branches[branch].type[element] == "Iac"){
                MultipleSources.push(Branches[branch].elements[element]);
               }
            /* [#8] errorCode verification */
            if(Branches[branch].type[element] == "IProbe"){
                MultipleProbes.push(Branches[branch].elements[element]);
            }
        }
        if(MultipleSources.length > 1)
            CurrSourcesFound.push(MultipleSources);
        MultipleSources = [];

        if(MultipleProbes.length > 1)
            iProbesFound.push(MultipleProbes);
        MultipleProbes = [];
    }

    if(CurrSourcesFound.length > 0)
    {
        let error = {
            errorCode: 7,
            MultipleSources: CurrSourcesFound}; 
        errorList.push(error);
    }

    if(iProbesFound.length > 0)
    {
        let chosenAmps = new Array();
        // Chose a Probe and remove the rest from netlist
        for(let i = 0; i< iProbesFound.length; i++){
            chosenAmps.push(iProbesFound[i][0]);
            for(let k = 1; k< iProbesFound[i].length; k++){
                // Find the Amperemeter
                for(let line = 0; line < outLines.length; line++){
                    let words = outLines[line].split(' ');
                    let name = words[0].split(':');
                    if(name[1] == iProbesFound[i][k]){
                        // Get Amperemeter nodes
                        let nodeToKeep = '';
                        let nodeToDelete = '';
                        if(realNodes.includes(words[1])){
                            nodeToKeep   = words[1];
                            nodeToDelete = words[2]; 
                        }
                        else{
                            nodeToKeep   = words[2];
                            nodeToDelete = words[1]; 
                        }

                        // Replace the nodes
                        for(let j = 0; j< outLines.length; j++){
                            let newWords = outLines[j].split(' ');
                            if(newWords[1] == nodeToDelete)
                                newWords[1] = nodeToKeep;
                            else if( newWords[2] == nodeToDelete)
                                newWords[2] = nodeToKeep;
                            outLines[j] = newWords.join(' ');
                        }

                        // Delete line
                        outLines.splice(line,1);
                        break;
                    }
                }
            }
        }

        let error = {
            errorCode: 8,
            MultipleProbes: iProbesFound,
            chosenProbes: chosenAmps}; 
        errorList.push(error);
    }

    /* [#9] errorCode verification */
    var VoltageSources = new Array();
    let isolatedSets = new Array();
    cnt = 0;
    var referenceIndex = 0;
    // Calculate Veq from multiple voltage sources in a Branch
    for(let branch = 0; branch < Branches.length; branch++){
        // Compute Number of Voltage Sources
        let nSources = Branches[branch].type.filter(function(x){ return x === "Vdc"; }).length +
                       Branches[branch].type.filter(function(x){ return x === "Vac"; }).length;
        if( nSources > 1)
        {
            var Vsources = {
                VeqExpression: "",
                beginning: "",
                end: "",
                VeqID:"",
                srcList: new Array(),
                isolated: false,
                ammeter: ""
            };
            // Fill the flowing direction
            Vsources.beginning = Branches[branch].beginning;
            Vsources.end = Branches[branch].end;
            Vsources.VeqID = "Veq"+Vsources.beginning+Vsources.end;
            //Compute Branch Equivalent Voltage
        
            for(let i = 0; i < Branches[branch].elements.length; i++){ 
                // This index allows to access Voltage Source Unit Value
                referenceIndex = Electrical.References.indexOf(Branches[branch].elements[i]);

                // DC Source with Negative Polarity
                if(Branches[branch].type[i] == "Vdc" && Branches[branch].polarity[i] == "-"){
                    Vsources.VeqExpression += "-" + Branches[branch].elements[i];
                    Vsources.srcList.push(Branches[branch].elements[i]);
                }
                
                // DC Source with Positive Polarity
                if(Branches[branch].type[i] == "Vdc" && Branches[branch].polarity[i] == "+"){
                    Vsources.VeqExpression += "+" + Branches[branch].elements[i];
                    Vsources.srcList.push(Branches[branch].elements[i]);
                }

                // AC Source with Negative Polarity
                if(Branches[branch].type[i] == "Vac" && Branches[branch].polarity[i] == "-"){
                    Vsources.VeqExpression += "-" + Branches[branch].elements[i];
                    Vsources.srcList.push(Branches[branch].elements[i]);
                }

                // AC Source with Positive Polarity
                if(Branches[branch].type[i] == "Vac" && Branches[branch].polarity[i] == "+"){
                    Vsources.VeqExpression += "+" + Branches[branch].elements[i];
                    Vsources.srcList.push(Branches[branch].elements[i]); 
                }    

            }
            
            // Check for ammeters
            let indexAmmeter = Branches[branch].type.findIndex(elem => elem == "IProbe");
            let ammFound = 0;
            if(indexAmmeter > -1){
                ammFound = 1;
                Vsources.ammeter = Branches[branch].elements[indexAmmeter];
            }
            if(Branches[branch].elements.length == Vsources.srcList.length+ammFound){
                Vsources.isolated = true;
                isolatedSets.push(Vsources);
            }

            VoltageSources.push(Vsources);
        }

    }
    
    if(VoltageSources.length > 0)
    {
        let error = {
            errorCode: 9,
            VSourcesData: VoltageSources}; 
        errorList.push(error);
    }

    /* [#10] errorCode verification */
    var acFrequencies = new Array();
    var srcNames = new Array();

    // Save and remove controllers from netlist
    var ACcontrollers = new Array();
    var DCcontrollers = new Array();
    for (let i = 0; i < outLines.length; i++){
        if(outLines[i].includes(".AC"))
        {
            ACcontrollers.push(outLines[i]);
            outLines.splice(i,1);
            i--;
        }
        else if(outLines[i].includes(".DC")){
            DCcontrollers.push(outLines[i]);
            outLines.splice(i,1);
            i--;
        }    
    }

    // Try to find a valid frequency in AC controller
    var ctrl = new Array();
    for( let i = 0; i < ACcontrollers.length; i++){
        let freqStr = "";
        let words = ACcontrollers[i].split(' ');
        // Get controller ID
        for (var j=words.length; j--;) {
            if (words[j].indexOf(".AC:")>=0) break;
        }  
        let name = words[j].split(':');

        if(ACcontrollers[i].includes('Type="const"')){
            let index = ACcontrollers[i].indexOf("Values=");
            index += 8;
            // Get Frequency String
            while(ACcontrollers[i][index]!='"'){
                freqStr += ACcontrollers[i][index];
                index++;
            }
            // Remove parenthesis
            freqStr = freqStr.substring(1,freqStr.length-1);
            // Check Multiple Frequencies in the controller
            if(freqStr.includes(',')){
                // Fill object
                let obj = {
                    ID: name[1],
                    isValid: false,
                    freq: freqStr
                }
                ctrl.push(obj);
            }
            // Parse Frequency and Check valid Unit
            else
            {
                let freqParams = freqStr.split(' ');
                // Check valid Units
                let unitChecked = 0;
                for (let unit = 0; unit < multUnits.length; unit++){
                    if(multUnits[unit].name == freqParams[1] && !isNaN(parseInt(freqParams[0])))
                        unitChecked = 1;
                }
                if(unitChecked==1){
                    let obj = {
                        ID: name[1],
                        isValid: true,
                        freq: parseInt(freqParams[0]),
                        unit: freqParams[1]
                    }
                    ctrl.push(obj);
                }
                else{
                    let obj = {
                        ID: name[1],
                        isValid: false,
                        freq: freqParams[0],
                        unit: freqParams[1]
                    }
                    ctrl.push(obj);
                }
                
            }
        }
        else{
            // Fill object
            let obj = {
                ID: name[1],
                isValid: false,
            }
            ctrl.push(obj);
        }
    }

    let checkCtrl = 0;
    for(var f = 0; f < ctrl.length; f++){
        if(ctrl[f].isValid == true){
            checkCtrl = 1;
            break;
        }
    }

    // Get AC sources Information
    for (let i = 0; i < outLines.length; i++)
    {
        if(outLines[i].includes("Vac:")){
            var lineContent = outLines[i].split('"');
            var name = outLines[i].split(' ');
            // Get Name
            name = name[0].split(":");
            name = name[1];
            srcNames.push(name);
            // Get Frequencies
            for(let j =0; j < lineContent.length; j++){
                if(lineContent[j].includes("Hz")){
                    acFrequencies.push(lineContent[j]);
                }
            }
        }
    }

    let srcInfo = {
        names: srcNames,
        frequencies: acFrequencies
    };

    // If a valid controller is found pick its frequency
    if(checkCtrl == 1){

        let error = {
            errorCode: 10,
            controllers: ctrl,
            chosenFreq: ctrl[f].freq,
            chosenFreqUnit: ctrl[f].unit,
            chosenControllerName: ctrl[f].ID,
            sources: srcInfo
        }
        errorList.push(error);
    }

    // Check for different frequencies in multiple sources
    if(acFrequencies.some( v => v !== acFrequencies[0] ))
    {
        // Choose 1 Frequency
        if(checkCtrl != 1){
            let freq = acFrequencies[0].split(" ");
            let unit = freq[1];
            freq = parseInt(freq[0]);
        
            let error = {
                errorCode: 10,
                controllers: ctrl,
                chosenFreq: freq,
                chosenFreqUnit: unit,
                sources: srcInfo}; 
            errorList.push(error);
        }
    }
        


    /* [#11] errorCode verification */
    // Duplicated Nodes Array
    var duplicated = new Array();
    // Check short circuit components
     for(let i = 0; i< NewNodes.length; i++){
        if(NewNodes[i][0] == NewNodes[i][1])
            duplicated.push(NewNodes[i][0]);
     }
     // Check short circuit branches
     for(let i = 0; i<Branches.length; i++){
        if(Branches[i].beginning == Branches[i].end)
            duplicated.push(Branches[i].beginning);
     }
     
     
     if(duplicated.length > 0){
        // Get unique node instances
        duplicated = [...new Set(duplicated)];
        let error = {
         errorCode: 11,
         nodes: duplicated
        }
        errorList.push(error);
     }
     
     

    // Remove empty lines
    for(let i = 0; i < outLines.length; i++){
        if(outLines[i].length < 1 || outLines[i] == " " || outLines[i] == "\n"){
            outLines.splice(i,1);
            i--;
        }
    }   

    /* [#12] errorCode verification */
    var probeNodes = new Array();
    var removedProbes = new Array();
    var probeNames = new Array();
    var removedNames = new Array();
    for(let i = 0; i < voltmetersLines.length; i++){
        // Get Nodes
        let auxStr = voltmetersLines[i].split(' ');
        probeNodes.push([auxStr[1],auxStr[2]]);
        auxStr = auxStr[0].split(':')
        probeNames.push(auxStr[1]);
    }

    for(let i = 0; i< probeNodes.length-1; i++){
        for(let j = i+1; j < probeNodes.length;j++){
            // Check for equal nodes
            if(probeNodes[j].includes(probeNodes[i][0]) && probeNodes[j].includes(probeNodes[i][1])){
                // Store probe info
                removedProbes.push(voltmetersLines[j]);
                removedNames.push(probeNames[j]);
                // Remove Probe
                voltmetersLines.splice(j,1);
                probeNodes.splice(j,1);
                probeNames.splice(j,1);
                j--;
            }
        } 
    }

    if(removedProbes.length > 0){
        let error = {
            errorCode: 12,
            removed: removedNames,
            netLines: removedProbes
        }
        errorList.push(error);
    }

    /* [#13] errorCode verification */
    cnt = 0;
    // Check duplicated VProbes
    var duplicatedProbes = new Array();
    var auxArray = new Array();
    for(let element = 0; element < voltmetersLines.length-1; element++){
        for(let subelement = element+1; subelement < voltmetersLines.length; subelement++){
            if(probeNames[element] == probeNames[subelement])
                cnt++;
        }

        if(cnt > 0)
          auxArray.push(probeNames[element]);
        cnt=0;
    }
    // Fill Duplicated Vprobe Names
    if(auxArray.length > 0){
        auxArray = [...new Set(auxArray)];
        for(let i = 0; i < auxArray.length; i++){
            duplicatedProbes.push(auxArray[i]);
        }
    }

    if(duplicatedProbes.length > 0){
        let error = {
            errorCode: 13,
            names: duplicatedProbes
        }
        errorList.push(error);
    }

    /* [#14] errorCode verification */

    if(!realNodes.includes("gnd")){
        let error = {
            errorCode: 14
        };
        errorList.push(error);
    }

    /* [#16] errorCode verification */
    let ammetersGlobal = new Array();
    if(isolatedSets.length>0){
        //Start by computing the Ammeters global Nodes
        for(let i = 0; i< ammetersLines.length; i++){
            let regNewNodes = new Array()
            regNewNodes = regNewNodes.concat(NewNodes);
            let ammObj = {
                label: ammetersLines[i].split(" ")[0].split(":")[1],
                noN: '',
                noP: '',
                virtualNode: ''
            }

            let nodeN = ammetersLines[i].split(" ")[1];
            let nodeP = ammetersLines[i].split(" ")[2];
            //Remove the Ammeter from register
            let indexReg = regNewNodes.findIndex(elem => elem[0] == nodeN && elem[1] == nodeP);
            regNewNodes.splice(indexReg,1);

            if(realNodes.includes(nodeN))
                ammObj.noN = nodeN;
            else{
                ammObj.virtualNode = nodeN;
                while(!realNodes.includes(nodeN)){
                    for(let j = 0; j< regNewNodes.length; j++){
                        let nodeIndex = regNewNodes[j].indexOf(nodeN);
                        if(nodeIndex > -1){
                            nodeN = regNewNodes[j][1-nodeIndex];
                            regNewNodes.splice(j,1);
                            j=regNewNodes.length;
                        }
                    }
                }
                ammObj.noN = nodeN;

            }

            if(realNodes.includes(nodeP))
                ammObj.noP = nodeP;
            else{
                ammObj.virtualNode = nodeP;
                while(!realNodes.includes(nodeP)){
                    for(let j = 0; j< regNewNodes.length; j++){
                        let nodeIndex = regNewNodes[j].indexOf(nodeP);
                        if(nodeIndex > -1){
                            nodeP = regNewNodes[j][1-nodeIndex];
                            regNewNodes.splice(j,1);
                            j=regNewNodes.length;
                        }
                    }
                }
                ammObj.noP = nodeP;
            }

            ammetersGlobal.push(ammObj);

        }

        let vSrcData = new Array();
        //Find Voltage Sources information
        
        for(let i= 0; i<outLines.length; i++){
            let words = outLines[i].split(' ');
            if(words[0].split(':')[0] == 'Vdc'){
                let obj = {
                    type: 'Vdc',
                    ref: words[0].split(':')[1],
                    U: words[3].split('"')[1],
                    unit: words[4].split('"')[0],
                    phase: 0
                }
                vSrcData.push(obj);
                //Remove from netlist
                outLines.splice(i,1);
                i--;
            }
            if(words[0].split(':')[0] == 'Vac'){
                let obj = {
                    type: 'Vac',
                    ref: words[0].split(':')[1],
                    U: words[3].split('"')[1],
                    unit: words[4].split('"')[0],
                    freq: words[5].split('"')[1],
                    freqUnit: words[6].split('"')[0],
                    phase: words[7].split('"')[1]
                }
                vSrcData.push(obj);
                outLines.splice(i,1);
                i--;
            }

        }
        

        //Insert in-series ammeters
        for(let i = 0; i< isolatedSets.length; i++){
            if(isolatedSets[i].ammeter.length>0){
                //Remove from netlist
                let netIndex = outLines.findIndex(id => id.split(" ")[0].split(":")[1] == isolatedSets[i].ammeter);
                outLines.splice(netIndex,1);
                //Find Ammeter in global register
                let globalAmm = ammetersGlobal.find(id => id.label == isolatedSets[i].ammeter);
                let removed = isolatedSets[i].beginning;
                isolatedSets[i].beginning = globalAmm.virtualNode;
                if(globalAmm.noP == removed)
                    globalAmm.noN = globalAmm.virtualNode;
                else    
                    globalAmm.noP = globalAmm.virtualNode;

                // Add ammeter to netlist
                let netLine = "IProbe:"+globalAmm.label+" " + globalAmm.noN + " " + globalAmm.noP;
                outLines.push(netLine);
            }
        }

        let arrayCode = new Array();
        for(let i = 0; i< isolatedSets.length; i++){
            //Compute equivalent expression
            let netlistLine = '';
            let equation = isolatedSets[i].VeqExpression;
            let srcfreq = '';
            for(let j = 0; j< vSrcData.length; j++){
                if(equation.includes(vSrcData[j].ref)){
                    srcfreq = vSrcData[j].freq + ' ' + vSrcData[j].freqUnit;
                    // Convert to Volts
                    let unitIndex = multUnits.findIndex(unit => unit.name == vSrcData[j].unit);
                    if(unitIndex < 0)
                        break
                    else{
                        let srcValue = parseFloat(vSrcData[j].U)*multUnits[unitIndex].value;
                        let phase = parseFloat(vSrcData[j].phase)*Math.PI/180;
                        let complex = math.complex({r:srcValue, phi:phase});
                        equation = equation.replace(vSrcData[j].ref, '('+complex.toString()+')');
                    }
                }
            }
            equation = math.parse(equation);
            equation = math.simplify(equation).toString();
            // Create netlist string
            if(!equation.includes('i')){
                netlistLine = 'Vdc:'+ isolatedSets[i].srcList[0] + " ";
                if(parseFloat(equation) < 0)
                    netlistLine += isolatedSets[i].beginning + " " + isolatedSets[i].end + " ";
                else
                    netlistLine += isolatedSets[i].end + " " + isolatedSets[i].beginning + " ";
                
                netlistLine += 'U="' + Math.abs(parseFloat(equation)).toString() + ' V"';
                outLines.push(netlistLine);
                let sourceInfo = {
                    srcSet: isolatedSets[i].srcList,
                    U: Math.abs(parseFloat(equation)).toString(),
                    phase: null,
                    freq: null
                };
                arrayCode.push(sourceInfo);

            }
            else{
                equation = math.evaluate(equation).toString();
                equation = equation.replace(/ /g,'');
                equation = equation.replace('*','');
                let complex = math.complex(equation);
                complex = complex.toPolar();
                complex.phi = complex.phi * (180/Math.PI);

                netlistLine = 'Vac:'+ isolatedSets[i].srcList[0] + " ";
                if(complex.phi < 0 && complex.phi > -180 ){
                    netlistLine += isolatedSets[i].beginning + " " + isolatedSets[i].end + " ";
                    complex.phi += 180
                }
                else if(complex.phi > 0 && complex.phi < 180 ){
                    netlistLine += isolatedSets[i].end + " " + isolatedSets[i].beginning + " ";
                }
                // Just because QUCS do it
                if(complex.phi < -180)
                    complex.phi += 360;
                else if(complex.phi > 180)
                    complex.phi -= 360;
                
                complex.phi = +complex.phi.toFixed(3);
                complex.r = +complex.r.toFixed(3);

                netlistLine += 'U="' + complex.r + ' V" ';
                netlistLine += 'f="' + srcfreq + '" Phase="' + complex.phi + '" Theta="0"';
                outLines.push(netlistLine);

                let sourceInfo = {
                    srcSet: isolatedSets[i].srcList,
                    U: complex.r,
                    phase: complex.phi,
                    freq: srcfreq
                };
                arrayCode.push(sourceInfo);
            }

        }
        if(arrayCode.length > 0)
            errorList.push({errorCode: 16, list: arrayCode});
    }

    /* [#17] errorCode verification */
    for(let i = 0; i < outLines.length; i++){
        let words = outLines[i].split(' ');
        let name = words[0].split(':');
        if(name[1].includes("_")){
            name[1] = name[1].replace("_","x");
            words[0] = name[0]+":"+name[1];
        }
        if(!isNaN(parseInt(name[1]))){
            let newName = name[0][0]+'x'+name[1];
            words[0] = name[0]+":"+newName;
        }
        outLines[i] = words.join(' ');
    }

    // Add voltmeters to the filtered netlist
    for(let i = 0; i < voltmetersLines.length; i++){
        outLines.push(voltmetersLines[i]);
    }

    // Remove the newline chars
    for(let i = 0; i< outLines.length; i++){
        outLines[i] = outLines[i].replace(/(\r\n|\n|\r)/gm, "");
    }

    // Upper case the nodes (temporary solution for TeX parsing to Potentials)
    for(let i = 0; i<outLines.length; i++){
        let line = outLines[i].split(' ');
        if(line[1].length == 1)
            line[1] = line[1].toUpperCase();
        if(line[2].length == 1)
            line[2] = line[2].toUpperCase();
        outLines[i] = line.join(' ');
    }

    return {
        first: errorList,
        second: outLines
        };

};



/**
 * Function to acquire components info from netlist line
 * @param {string} line Netlist text line
 * @param {int} cnt Variable Id Count
 * @returns {int} errorCode Error Code to implement actions
 * @returns {array} outFile String array with Netlist lines
 */
function acquireCpData(line, cnt) {

    var errorCode = 0;  // Error Code 0 means No Errors Found

    // Check Netlist line to acquire Components Data
    const words = line.split(' ');
    var cpWord = words[0].split(':');

    var cpKey = cpRefTest(cpWord[0]);

    // return nodes
    let netNodes = new Array();
    netNodes.push(words[1]);
    netNodes.push(words[2]);

    // Analyse component by type
    switch (cpKey) {
        case cpRefTest("Vdc"): {
            cnt.Vdc++;
            var cpId = cnt.Vdc;
            var cpRef= cpWord[1];
            var cpNoP = words[1];
            var cpNoN = words[2];

            var valWord = words[3].split('"');
            var cpVal = valWord[1];

            var valMulWord = words[4].split('"');
            var cpValMul = valMulWord[0];

            if(words.length > 6) {
                var riWord = words[5].split('"');
                var cpRiVal = riWord[1];

                var riMulWord = words[6].split('"');
                var cpRiMul = riMulWord[0];
            }
            else {
                var cpRiVal = 0;
                var cpRiMul = 0;
            }


            var cpObj = new genericCp(cpId, cpRef, cpNoP, cpNoN, cpKey, cpVal, cpValMul, cpRiVal, cpRiMul, null, null, null, null, null, null, null, null);

            return {
                first: errorCode,
                second: cpObj,
                third: netNodes
            };
        }
        case cpRefTest("Idc"): {
            cnt.Idc++;
            var cpId = cnt.Idc;
            var cpRef= cpWord[1];
            var cpNoP = words[1];
            var cpNoN = words[2];

            var valWord = words[3].split('"');
            var cpVal = valWord[1];

            var valMulWord = words[4].split('"');
            var cpValMul = valMulWord[0];

            if(words.length > 6) {
                var riWord = words[5].split('"');
                var cpRiVal = riWord[1];

                var riMulWord = words[6].split('"');
                var cpRiMul = riMulWord[0];
            }
            else {
                var cpRiVal = 0;
                var cpRiMul = 0;
            }

            var cpObj = new genericCp(cpId, cpRef, cpNoP, cpNoN, cpKey, cpVal, cpValMul, cpRiVal, cpRiMul, null, null, null, null, null, null, null, null);

            return {
                first: errorCode,
                second: cpObj,
                third: netNodes
            };
        }
        case cpRefTest("Vac"): {
            cnt.Vac++;
            var cpId = cnt.Vac;
            var cpRef= cpWord[1];
            var cpNoP = words[1];
            var cpNoN = words[2];

            var valWord = words[3].split('"');
            var cpVal = valWord[1];

            var valMulWord = words[4].split('"');
            var cpValMul = valMulWord[0];

            var freqWord = words[5].split('"');
            var cpFreq = freqWord[1];

            var freqMulWord = words[6].split('"');
            var cpFreqMul = freqMulWord[0];

            var phaseWord = words[7].split('"');
            var cpPhase = phaseWord[1];

            var thetaWord = words[8].split('"');
            var cpTheta = thetaWord[1];

            if(words.length > 10) {
                var riWord = words[9].split('"');
                var cpRiVal = riWord[1];

                var riMulWord = words[10].split('"');
                var cpRiMul = riMulWord[0];
            }
            else {
                var cpRiVal = 0;
                var cpRiMul = 0;
            }

            var cpObj = new genericCp(cpId, cpRef, cpNoP, cpNoN, cpKey, cpVal, cpValMul, cpRiVal, cpRiMul, cpFreq, cpFreqMul, cpPhase, cpTheta, null, null, null, null);

            return {
                first: errorCode,
                second: cpObj,
                third: netNodes
            };

        }
        case cpRefTest("Iac"): {
            cnt.Iac++;
            var cpId = cnt.Iac;
            var cpRef= cpWord[1];
            var cpNoP = words[1];
            var cpNoN = words[2];

            var valWord = words[3].split('"');
            var cpVal = valWord[1];

            var valMulWord = words[4].split('"');
            var cpValMul = valMulWord[0];

            var freqWord = words[5].split('"');
            var cpFreq = freqWord[1];

            var freqMulWord = words[6].split('"');
            var cpFreqMul = freqMulWord[0];

            var phaseWord = words[7].split('"');
            var cpPhase = phaseWord[1];

            var thetaWord = words[8].split('"');
            var cpTheta = thetaWord[1];

            if(words.length > 10) {
                var riWord = words[9].split('"');
                var cpRiVal = riWord[1];

                var riMulWord = words[10].split('"');
                var cpRiMul = riMulWord[0];
            }
            else {
                var cpRiVal = 0;
                var cpRiMul = 0;
            }

            var cpObj = new genericCp(cpId, cpRef, cpNoP, cpNoN, cpKey, cpVal, cpValMul, cpRiVal, cpRiMul, cpFreq, cpFreqMul, cpPhase, cpTheta, null, null, null, null);

            return {
                first: errorCode,
                second: cpObj,
                third: netNodes
            };
        }
        case cpRefTest("R"): {
            cnt.R++;
            var cpId = cnt.R;
            var cpRef= cpWord[1];
            var cpNoP = words[1];
            var cpNoN = words[2];

            var valWord = words[3].split('"');
            var cpVal = valWord[1];

            var valMulWord = words[4].split('"');
            var cpValMul = valMulWord[0];

            var valTemp = words[5].split('"');
            var cpTemp = valTemp[1];

            var cpObj = new genericCp(cpId, cpRef, cpNoP, cpNoN, cpKey, cpVal, cpValMul, null, null, null, null, null, null, cpTemp, null, null, null);

            return {
                first: errorCode,
                second: cpObj,
                third: netNodes
            };
        }
        case cpRefTest("L"): {
            cnt.L++;
            var cpId = cnt.L;
            var cpRef= cpWord[1];
            var cpNoP = words[1];
            var cpNoN = words[2];

            var valWord = words[3].split('"');
            var cpVal = valWord[1];

            var valMulWord = words[4].split('"');
            var cpValMul = valMulWord[0];

            var valInitVal = words[5].split('"');
            var cpInitVal = valInitVal[1];

            var cpObj = new genericCp(cpId, cpRef, cpNoP, cpNoN, cpKey, cpVal, cpValMul, null, null, null, null, null, null, null, cpInitVal, null, null);

            return {
                first: errorCode,
                second: cpObj,
                third: netNodes
            };
        }
        case cpRefTest("C"): {
            cnt.C++;
            var cpId = cnt.C;
            var cpRef= cpWord[1];
            var cpNoP = words[1];
            var cpNoN = words[2];

            var valWord = words[3].split('"');
            var cpVal = valWord[1];

            var valMulWord = words[4].split('"');
            var cpValMul = valMulWord[0];

            var valInitVal = words[5].split('"');
            var cpInitVal = valInitVal[1];

            var cpObj = new genericCp(cpId, cpRef, cpNoP, cpNoN, cpKey, cpVal, cpValMul, null, null, null, null, null, null, null, cpInitVal, null, null);

            return {
                first: errorCode,
                second: cpObj,
                third: netNodes
            };
        }
        case cpRefTest("VProbe"): {
            cnt.Vprob++;
            var cpId = cnt.Vprob;
            var cpRef= cpWord[1];
            var cpNoP = words[1];
            var cpNoN = words[2];

            try {
                var riWord = words[3].split('"');
                var cpRiVal = riWord[1];

                var riMulWord = words[4].split('"');
                var cpRiMul = riMulWord[0];

                var cpObj = new genericCp(cpId, cpRef, cpNoP, cpNoN, cpKey, null, null, cpRiVal, cpRiMul, null, null, null, null, null, null, null, null);
            } 
            
            catch (error) {
                var cpObj = new genericCp(cpId, cpRef, cpNoP, cpNoN, cpKey, null, null, null, null, null, null, null, null, null, null, null, null);
            }
            return {
                first: errorCode,
                second: cpObj
            };
        }
        
        case cpRefTest("IProbe"): {
            cnt.Iprob++;
            var cpId = cnt.Iprob;
            var cpRef= cpWord[1];
            var cpNoP = words[1];
            var cpNoN = words[2];
            try {
                var riWord = words[3].split('"');
                var cpRiVal = riWord[1];

                var riMulWord = words[4].split('"');
                var cpRiMul = riMulWord[0];

                var cpObj = new genericCp(cpId, cpRef, cpNoP, cpNoN, cpKey, null, null, cpRiVal, cpRiMul, null, null, null, null, null, null, null, null);
            } 
            
            catch (error) {
                var cpObj = new genericCp(cpId, cpRef, cpNoP, cpNoN, cpKey, null, null, null, null, null, null, null, null, null, null, null, null);
            }

            

            return {
                first: errorCode,
                second: cpObj,
                third: netNodes
            };
        }
        case cpRefTest(".AC"): {
            var cpType = cpType = words[1].split('"');
            cpType = cpType[1];
            
            if(cpType == 'const') {
                var fiWord = words[2].split('"');
                fiWord = fiWord[1].split('[');
                var cpFreqVal = fiWord[1];

                var fiMulWord = words[3].split('"');
                fiMulWord = fiMulWord[0].split(']');
                var cpFreqMul = fiMulWord[0];

                var cpObj = { type: 'acFreq', value: cpFreqVal, mult: cpFreqMul };
            }
            else var cpObj = { type: null, value: null, mult: null };

            return {
                first: errorCode,
                second: cpObj
            };
        }
        default: {
            var cpObj = new genericCp();

            return {
                first: errorCode,
                second: cpObj
            };
        }
    }
}


/**
 * Critical error detection function
 * @param {array} errorList Error codes list
 * @returns {boolean} True: Critical Errors Found
 *                    False: No Critical Errors Found 
 */
 function foundCriticalErr(errList) {
    
    // Critical Error Codes
    var critical = [0,2,4,5,6,7,11,15];
    for(let i = 0; i < errList.length; i++){
        // Find error code in the array
        if(critical.indexOf(errList[i].errorCode) >= 0)
            return true;
    }
    return false;
 }