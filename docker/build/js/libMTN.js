/**
 * Function to parse a direct equation in order to the input
 * @param {string} equation Equation to parse
 * @param {string} nodeVariable Variable
 * @returns {string} Parsed equation string
 */
function parseDirectEquation(equation, nodeVariable){
    // Remove spaces
    equation = equation.replace(/\s+/g, '');
    // Split into members
    let str = equation.split('=');
    //Create Equation
    let parsed = str[0];
    if(parsed.includes(nodeVariable))
        return '('+str[1]+')';
    // Remove unnecessary info from the equation
    equation = equation.replace(str[0],"");
    equation = equation.replace(nodeVariable,"");
    equation = equation.replace("=","");
    // Check signal
    if(equation.includes("+")){
        parsed += " - ";
        equation = equation.replace("+","");
    }
    else{
        parsed += " + ";
        equation = equation.replace("-","");
    }
    // Add the value
    parsed += "(" + equation + ')';

    //Add parenthesis
    parsed = "(" + parsed + ")";
    return parsed;
}

/**
 * Function to parse a non-direct equation in order to the input
 * @param {string} equation Equation to parse
 * @param {string} nodeVariable Variable
 * @returns {string} Parsed equation string
 */
function parseNonDirectEquation(equation, nodeVariable){
    // example1: A = E - 1 + 5;
    // example2: E - 1 + 5 = D + 4;
    // example2: E - 2 - 4 = D - 2 + 5 - 19
    let finEq = equation;
    // Remove spaces
    equation = equation.replace(/\s+/g, '');
    // Split into members
    let str = equation.split('=');
    // Check the variable's member
    // Suppose the equation has only 1 variable in the 1st member
    // Suppose each node consists in only one letter
    // If it is in the second member procceed to parse the equation
    if(!str[0].includes(nodeVariable)){
        let parsed = str[0];
        //Parse the second member
        for(let i = 0; i<str[1].length; i++){
            if(str[1][i] == "+"){
                parsed += "-";
                str[1] = str[1].substring(0,i) + str[1].substring(i+1,str[1].length);
                if(str[1][i]!=nodeVariable){
                    while(!isNaN(parseInt(str[1][i])) && i < str[1].length){
                        parsed += str[1][i];
                        str[1] = str[1].substring(0,i) + str[1].substring(i+1,str[1].length);
                    }
                    i--;
                }               
            }
            else if(str[1][i] == "-"){
                parsed += "+";
                str[1] = str[1].substring(0,i) + str[1].substring(i+1,str[1].length);
                if(str[1][i]!=nodeVariable){
                    while(!isNaN(parseInt(str[1][i])) && i < str[1].length){
                        parsed += str[1][i];
                        str[1] = str[1].substring(0,i) + str[1].substring(i+1,str[1].length);
                    }
                    i--
                }                
            }
        }

        // Check the second member signal
        if(str[1].length > 1){
            if(str[1].includes("+"))
                str[1] = str[1].replace("+","");
            else if(str[1].includes("-")){
                str[1] = str[1].replace("-","");
                // Change the first member signals
                for(let i = 0; i < parsed.length;i++){
                    if(parsed[i] == '+')
                        parsed[i] = '-';
                    else if(parsed[i] == '-')
                    parsed[i] = '+';
                }

            }
        }

        // Add spaces
        parsed = parsed.replace(/\+/g,' + ');
        parsed = parsed.replace(/\-/g,' - ');
        // Add Parenthesis
        parsed = "(" + parsed + ")";
        return parsed;
    }

    else{
        finEq = finEq.split(" = ");
        finEq[1] = finEq[1].replace(/\s+/g, '');
        finEq[1] = finEq[1].replace(/\+/g, ' + ');
        finEq[1] = finEq[1].replace(/\-/g, ' - ');
        //Add parenthesis
        finEq[1] = "(" + finEq[1] + ")";
        return finEq[1];
    }
}

/**
 * Function to parse a grounded supernode equation
 * @param {string} equation Equation to parse
 * @param {string} nodeVariable Variable
 * @returns {string} Parsed equation string
 */
function parsegroundedSN(equation, nodeVariable){
    // Remove spaces
    equation = equation.replace(/\s+/g, '');
    // Remove equal
    equation = equation.replace("=","");
    // Remove node
    equation = equation.replace(nodeVariable,"");
    // Return the value
    return  "(" + equation + ")";
}

/**
 * Function to check the variables in the equation
 * @param {string} equation Equation to parse
 * @param {string Array} unknowns Variable array
 * @returns {string Array} Variables in the equation
 */
function checkEquationUnk(equation, variables){
    
    var unknownArray = new Array();
    for(let i = 0; i < variables.length; i++){
        if(equation.includes(variables[i]))
            unknownArray.push(variables[i]);
    }

    return unknownArray;
}

/**
 * Function parse a complex number
 * @param {complex} number complex to parse
 * @returns {string} complex string 
 */
function parseComplex(number){

    var str = '';

    if(number.re != 0)
        str = number.re.toString();
        
    if(number.im === 0){
        if(number.re === 0)
            str = '0';
        return str
    }
        
        
    else if(number.im.toString().includes('-'))
        str += number.im.toString() + "i";
    else
        str += "+"+number.im.toString() + "i";

    return str;
}

/**
 * Function find the node of a SN equation
 * @param {string} equation supernode equation
 * @returns {string} node
 */
function getSNnode(equation, realnodes){
    
    for(let i = 0; i< realnodes.length; i++){
        let streg = realnodes[i];
        let index = [...equation.matchAll(new RegExp(streg, 'gi'))].map(a => a.index);
        if(index.length > 0)
            return realnodes[i];
    }
    return false;
}

/**
 * Function to find the mode of an array
 * @param {Array} arr array of values
 * @returns {string} most frequent value in the array
 */
function findMode(arr){
    return arr.sort((a,b) =>
          arr.filter(v => v===a).length
        - arr.filter(v => v===b).length
    ).pop();
}

/**
 * Function to convert the voltage units from V to mV/uV
 * and round the numbers/complex to any decimal places
 * @param {string} voltage node voltage
 * @param {string} unit desired unit
 * @param {number} places desired decimal places
 * @returns {string} most frequent value in the array
 */
function voltConversion(voltage, unit, places){
    
    let value = parseFloat(voltage);
    if(!voltage.includes('i')){
        if(unit == "V")
            value = math.round(value,places);
        else if(unit == "mV"){
            value = math.round(math.multiply(value,1000),places);
        }
        else if(unit == "uV"){
            value = math.round(math.multiply(value,1000000),places);
        }

        value = value.toString();
    }

    else{

        let c = math.complex(voltage);
        if(unit == "V"){
            value = parseComplex(math.round(c,places));
        }  
        else if(unit == "mV"){
            value = parseComplex(math.round(math.multiply(c,1000),places));
        }
        else if(unit == "uV"){
            value = parseComplex(math.round(math.multiply(c,1000000),places));
        }
    }

    return value;
}

/**
 * Function to convert the current units from A to mA/uA
 * and round the numbers/complex to any decimal places
 * @param {string} current current value
 * @param {string} unit desired unit
 * @param {number} places desired decimal places
 * @returns {string} most frequent value in the array
 */
function ampConversion(current, unit, places){
    
    let value = parseFloat(current);
    if(!current.includes('i')){
        if(unit == "A")
            value = math.round(value,places);
        else if(unit == "mA"){
            value = math.round(math.multiply(value,1000),places);
        }
        else if(unit == "uA"){
            value = math.round(math.multiply(value,1000000),places);
        }

        value = value.toString();
    }

    else{

        let c = math.complex(current);
        if(unit == "A"){
            value = parseComplex(math.round(c,places));
        }  
        else if(unit == "mA"){
            value = parseComplex(math.round(math.multiply(c,1000),places));
        }
        else if(unit == "uA"){
            value = parseComplex(math.round(math.multiply(c,1000000),places));
        }
    }

    return value;
}

/**
 * Function to replace the exponential symbol with power of 10
 * @param {string} string equation string
 * @param {string} subs "e"
 * @returns {string} equation after the substitution
 */
function findSubstringIndexes(string, subs){
    
    // Instanciate the regex
    var reg = new RegExp(subs,'g');
    // Results array
    var indexes = new Array();
    // Find all occurrences
    while (reg.exec(string)){
        indexes.push(reg.lastIndex-1);
    }

    for(let k = 0; k < indexes.length; k++){
        let inc = 4;
        string = string.substr(0,indexes[k]) + '*10^' + string.substr(indexes[k]+1);
        if(string[indexes[k]+inc] == "-"){
            string = string.substr(0,indexes[k]+inc) + '(' + string.substr(indexes[k]+inc+1);
            inc++;
            string = string.slice(0,indexes[k]+inc)+'-'+string.slice(indexes[k]+inc);
            inc++;
            let parse = parseInt(string[indexes[k]+inc]);
            while(!isNaN(parse)){
                inc++;
                parse = parseInt(string[indexes[k]+inc]);
            }
        }
        else{
            string = string.substr(0,indexes[k]+inc) + '(' + string.substr(indexes[k]+inc+1);
            inc++;
            let parse = parseInt(string[indexes[k]+inc]);
            while(!isNaN(parse)){
                inc++;
                parse = parseInt(string[indexes[k]+inc]);
            }
        }
        // Insert the parenthesis
        string = string.slice(0,indexes[k]+inc)+')'+string.slice(indexes[k]+inc);

        // Update indexes
        indexes = [];
        while (reg.exec(string)){
            indexes.push(reg.lastIndex-1);
        }
        k--;
    }

    // Remove double multiply symbols inserted
    if(string.includes('**'))
        string = string.replace('**','*');

    return string;

}

/**
 * Function to find a new ID for a node with a invalid one
 * @param {Array} nodesArr array with the nodes' strings
 * @returns {string} new ID for the node
 */
function findNewNode(nodesArr){

    let alphabet = "abcdefghijklmnopqrstuvwxyz";
    alphabet = alphabet.toUpperCase();
    for(let i = 0; i < alphabet.length; i++){
        if(!nodesArr.includes(alphabet[i]))
            return alphabet[i];
    }
    alphabet = alphabet.toLowerCase();
    for(let i = 0; i < alphabet.length; i++){
        if(!nodesArr.includes(alphabet[i]))
            return alphabet[i];
    }
}

/**
 * Function to replace a node with its new ID
 * @param {string} equation equation string
 * @param {Object} nodesObj object with the substitution info
 * @returns {string} equation after the substitution
 */
function fixDoubleNamedNodes(equation, nodesObj){

    for(let i = 0; i< nodesObj.length; i++){
        if(equation.includes(nodesObj[i].prevNode)){
            let reg = new RegExp(nodesObj[i].prevNode, "g");
            equation = equation.replace(reg, nodesObj[i].subsNode);
        }
    }
    return equation;
}



function replaceNetNode(netLines, src, dest){

    for(let i = 0; i< netLines.length; i++){
        let words = netLines[i].split(" ");
        if(words[1] == src)
            words[1] = dest;
        if(words[2] ==  src)
            words[2] = dest;
        netLines[i] = words.join(" ");
    }

    return netLines.join('\n');
}

function searchNode(equation, nodes){

    for(let i = 0; i<nodes.length; i++){
        if(equation.includes(nodes[i]))
            return i;
    }

    return -1;
}