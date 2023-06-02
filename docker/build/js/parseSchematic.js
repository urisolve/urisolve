/**
 * This function parses the schematic text
 * and creates the schematic object
 * @param {string} text The schematic text
 * @returns {object} The schematic object or an error object
 */
function parseSchematic(text){
    // Regex pattern for each section
    const versionPattern = /<Qucs Schematic ([\d.]+)>/;
    const propertiesPattern = /<Properties>([\s\S]*?)<\/Properties>/;
    //const symbolPattern = /<Symbol>([\s\S]*?)<\/Symbol>/;
    const componentsPattern = /<Components>([\s\S]*?)<\/Components>/;
    const wiresPattern = /<Wires>([\s\S]*?)<\/Wires>/;
    //const diagramsPattern = /<Diagrams>([\s\S]*?)<\/Diagrams>/;
    //const paintingsPattern = /<Paintings>([\s\S]*?)<\/Paintings>/;
    
    let tempReg;

    // Get the version number
    const version = text.match(versionPattern)[1];
    if(!version)
        version = '0.0.0';
    // Get the properties section
    tempReg = text.match(propertiesPattern);
    if(!tempReg)
        return {
            errorFlag: true,
            errorReasonCodes: ['1'],
            errorData: {missingData: ['Properties']},
        }
    const propertiesString = tempReg[1];
    // Get the symbol section
    //const symbol = text.match(symbolPattern)[1];
    // Get the components section
    tempReg = text.match(componentsPattern);
    if(!tempReg)
        return {
            errorFlag: true,
            errorReasonCodes: ['1'],
            errorData: {missingData: ['Components']},
        }
    const components = tempReg[1];
    // Get the wires section
    tempReg = text.match(wiresPattern);
    if(!tempReg)
        return {
            errorFlag: true,
            errorReasonCodes: ['1'],
            errorData: {missingData: ['Wires']},
        }
    const wires = tempReg[1];
    // Get the diagrams section
    //const diagrams = text.match(diagramsPattern)[1];
    // Get the paintings section
    //const paintings = text.match(paintingsPattern)[1];

    const viewPattern = /<View=(.*?)>/;
    const gridPattern = /<Grid=(.*?)>/;
    
    //Get the view propertie object
    const viewMatch = propertiesString.match(viewPattern);
    if(!viewMatch)
        return {
            errorFlag: true,
            errorReasonCodes: ['1'],
            errorData: {missingData: ['View']},
        }
    const viewValues = viewMatch[1].split(',');
    if(viewValues.length < 7) {
        return {
            errorFlag: true,
            errorReasonCodes: ['2'],
            errorData: [{invalidData: ['View'], error: 'has missing values'}],
        }
    }
    else if(viewValues.length > 7){
        return {
            errorFlag: true,
            errorReasonCodes: ['2'],
            errorData: [{invalidData: ['View'], error: 'has too many values'}],
        }
    }
    const view = new View(...viewValues);

    //Get the grid propertie object
    const gridMatch = propertiesString.match(gridPattern);
    if(!gridMatch)
        return {
            errorFlag: true,
            errorReasonCodes: ['1'],
            errorData: {missingData: ['Grid']},
        }
    const gridValues = gridMatch[1].split(',');
    if(gridValues.length < 3) {
        return {
            errorFlag: true,
            errorReasonCodes: ['2'],
            errorData: {invalidData: ['Grid'], error: 'has missing values'},
        }
    }
    else if(gridValues.length > 3){
        return {
            errorFlag: true,
            errorReasonCodes: ['2'],
            errorData: {invalidData: ['Grid'], error: 'has too many values'},
        }
    }
    const grid = new Grid(...gridValues);

    // Regex pattern for each component
    const componentPattern = /<(.*?)>/g;

    // Get all the component strings
    const componentsArray = components.match(componentPattern);
    if(!componentsArray)
        return {
            errorFlag: true,
            errorReasonCodes: ['3'],
        }

    componentIndex=1;
    let errorFlag = false;
    let errorData = [];
    // Parse each component
    componentsArray.forEach(component => {
        // Remove the < and > from the component
        const componentString = component.substring(1, component.length - 1);
        // Split the component into an array of properties (removing the quotes)
        const cpProperties = componentString.replace(/"/g,'').split(' ');
        cpProperties[3] = parseInt(cpProperties[3]);
        cpProperties[4] = parseInt(cpProperties[4]);
        // Calculate the position of the component's ports
        const ports = getPorts(cpProperties);

        // Create a new component object depending on type
        switch(cpProperties[0]){
            case 'R':
                if(cpProperties.length < 22){
                    errorFlag = true;
                    errorData.push({invalidData: ['Resistor '+ cpProperties[1]], error: 'has missing values'});
                }
                else if(cpProperties.length > 22){
                    errorFlag = true;
                    errorData.push({invalidData: ['Resistor '+ cpProperties[1]], error: 'has too many values'});
                }
                cp = new Resistor("cp" + componentIndex, cpProperties, ports);
                break;
            case 'C':
                if(cpProperties.length < 16){
                    errorFlag = true;
                    errorData.push({invalidData: ['Capacitor '+ cpProperties[1]], error: 'has missing values'});
                }
                else if(cpProperties.length > 16){
                    errorFlag = true;
                    errorData.push({invalidData: ['Capacitor '+ cpProperties[1]], error: 'has too many values'});
                }
                cp = new Capacitor("cp" + componentIndex, cpProperties, ports);
                break;
            case 'L':
                if(cpProperties.length < 14){
                    errorFlag = true;
                    errorData.push({invalidData: ['Inductor '+ cpProperties[1]], error: 'has missing values'});
                }
                else if(cpProperties.length > 14){
                    errorFlag = true;
                    errorData.push({invalidData: ['Inductor '+ cpProperties[1]], error: 'has too many values'});
                }
                cp = new Inductor("cp" + componentIndex, cpProperties, ports);
                break;
            case 'Vdc':
                if(cpProperties.length < 15){
                    errorFlag = true;
                    errorData.push({invalidData: ['Dc Voltage Source '+ cpProperties[1]], error: 'has missing values'});
                }
                else if(cpProperties.length > 15){
                    errorFlag = true;
                    errorData.push({invalidData: ['Dc Voltage Source '+ cpProperties[1]], error: 'has too many values'});
                }
                cp = new DcVoltPower("cp" + componentIndex, cpProperties, ports);
                break;
            case 'Idc':
                if(cpProperties.length < 15){
                    errorFlag = true;
                    errorData.push({invalidData: ['Dc Current Source '+ cpProperties[1]], error: 'has missing values'});
                }
                else if(cpProperties.length > 15){
                    errorFlag = true;
                    errorData.push({invalidData: ['Dc Current Source '+ cpProperties[1]], error: 'has too many values'});
                }
                cp = new DcCurrPower("cp" + componentIndex, cpProperties, ports);
                break;
            case 'Vac':
                if(cpProperties.length < 22){
                    errorFlag = true;
                    errorData.push({invalidData: ['Ac Voltage Source '+ cpProperties[1]], error: 'has missing values'});
                }
                else if(cpProperties.length > 22){
                    errorFlag = true;
                    errorData.push({invalidData: ['Ac Voltage Source '+ cpProperties[1]], error: 'has too many values'});
                }
                cp = new AcVoltPower("cp" + componentIndex, cpProperties, ports);
                break;
            case 'Iac':
                if(cpProperties.length < 22){
                    errorFlag = true;
                    errorData.push({invalidData: ['Ac Current Source '+ cpProperties[1]], error: 'has missing values'});
                }
                else if(cpProperties.length > 22){
                    errorFlag = true;
                    errorData.push({invalidData: ['Ac Current Source '+ cpProperties[1]], error: 'has too many values'});
                }
                cp = new AcCurrPower("cp" + componentIndex, cpProperties, ports);
                break;
            case 'GND':
                if(cpProperties.length < 9){
                    errorFlag = true;
                    errorData.push({invalidData: ['Ground '], error: 'has missing values'});
                }
                else if(cpProperties.length > 9){
                    errorFlag = true;
                    errorData.push({invalidData: ['Ground '], error: 'has too many values'});
                }
                cp = new GND("cp" + componentIndex, cpProperties, ports);
                break;
            case 'VProbe':
                if(cpProperties.length < 12){
                    errorFlag = true;
                    errorData.push({invalidData: ['Voltage Probe '+ cpProperties[1]], error: 'has missing values'});
                }
                else if(cpProperties.length > 12){
                    errorFlag = true;
                    errorData.push({invalidData: ['Voltage Probe '+ cpProperties[1]], error: 'has too many values'});
                }
                cp = new VProbe("cp" + componentIndex, cpProperties, ports);
                break;
            case 'IProbe':
                if(cpProperties.length < 12){
                    errorFlag = true;
                    errorData.push({invalidData: ['Current Probe '+ cpProperties[1]], error: 'has missing values'});
                }
                else if(cpProperties.length > 12){
                    errorFlag = true;
                    errorData.push({invalidData: ['Current Probe '+ cpProperties[1]], error: 'has too many values'});
                }
                cp = new IProbe("cp" + componentIndex, cpProperties, ports);
                break;
            default:
                console.log("cp" + componentIndex + ':' +component + " not found");
                break;
        };   
        componentIndex++;
    });

    // Regex pattern for each wire
    const wirePattern = /<(.*?)>/g;

    // Get all the wire strings
    const wireArray = wires.match(wirePattern);
    if(!wireArray)
        return {
            errorFlag: true,
            errorReasonCodes: ['4'],
        }

    wireIndex=1;

    // Parse each wire
    wireArray.forEach(wire => {
        // Remove the < and > from the wire
        const wireString = wire.substring(1, wire.length - 1);
        // Split the wire into an array of properties (removing the quotes)
        const wireProperties = wireString.replace(/"/g,'').split(' ');
        if(wireProperties.length < 9) {
            errorFlag = true;
            errorData.push({invalidData: ['Wire '+ wireIndex], error: 'has missing values'});
        }
        else if(wireProperties.length > 9){
            errorFlag = true;
            errorData.push({invalidData: ['Wire '+ wireIndex], error: 'has too many values'});
        }
        // Create a new wire object
        const w = new Wire("s" + wireIndex, wireProperties);

        wireIndex++;
    });

    if(errorFlag){
        return {
            errorFlag: true,
            errorReasonCodes: ['2'],
            errorData: errorData,
        }
    }
    
    treatSchematic();

    // Create the schematic object
    const schematic = new Schematic(version, view,grid);

    return {
        errorFlag: false,
        errorReasonCodes: [],
        data: {
            tree: JSON.stringify(schematic),
            object: schematic
        }
    }
}

/**
 * This function calculates the position of the ports of a component
 * @param {string[]} caracteristics 
 * @returns {object[]} The ports of the component
 */
function getPorts(caracteristics){
    const ports = [];

    switch(caracteristics[0]){
    case 'GND':
        // If the component is a GND, the component position is the port position
        var port = {position: {x: caracteristics[3], y: caracteristics[4]}, net: "", connections: []};
        ports.push(port);
        return ports;
    case 'VProbe':
        // If the component is a VProbe, the are not to the sides of the component
        switch(caracteristics[8]){
            case '0':
                var port1 = {position:{
                    x: caracteristics[3] -10, 
                    y: caracteristics[4] +20}};
                var port2 = {position:{
                    x: caracteristics[3] +10, 
                    y: caracteristics[4] +20}};
                break;
            case '1':
                var port1 = {position:{
                    x: caracteristics[3] +20, 
                    y: caracteristics[4] +10}};
                var port2 = {position:{
                    x: caracteristics[3] +20, 
                    y: caracteristics[4] -10}};
                break;
            case '2':
                var port1 = {position:{
                    x: caracteristics[3] +10, 
                    y: caracteristics[4] -20}};
                var port2 = {position:{
                    x: caracteristics[3] -10, 
                    y: caracteristics[4] -20}};
                break;
            case '3':
                var port1 = {position:{
                    x: caracteristics[3] -20, 
                    y: caracteristics[4] -10}};
                var port2 = {position:{
                    x: caracteristics[3] -20, 
                    y: caracteristics[4] +10}};
                break;
            }
        port1 = Object.assign(port1, {net: "", connections: []});
        port2 = Object.assign(port2, {net: "", connections: []});
        ports.push(port1);
        ports.push(port2);
        return ports;
    default:
        // Else calculate the position of the ports, 
        switch(caracteristics[8]){
        case '0':
            var port1 = {position:{
                x: caracteristics[3] -30, 
                y: caracteristics[4]}};
            var port2 = {position:{
                x: caracteristics[3] +30, 
                y: caracteristics[4]}};
            break;
        case '1':
            var port1 = {position:{
                x: caracteristics[3], 
                y: caracteristics[4] +30}};
            var port2 = {position:{
                x: caracteristics[3], 
                y: caracteristics[4] -30}};
            break;
        case '2':
            var port1 = {position:{
                x: caracteristics[3] +30, 
                y: caracteristics[4]}};
            var port2 = {position:{
                x: (caracteristics[3] -30), 
                y: caracteristics[4]}};
            break;
        case '3':
            var port1 = {position:{
                x: caracteristics[3], 
                y: caracteristics[4] -30}};
            var port2 = {position:{
                x: caracteristics[3], 
                y: caracteristics[4] +30}};
            break;
        }
        port1 = Object.assign(port1, {net: "", connections: []});
        port2 = Object.assign(port2, {net: "", connections: []});
        ports.push(port1);
        ports.push(port2);
        return ports;
    }
}

/**
 * This function resolves all connections and finds all the wires and nodes
 */
function treatSchematic(){
    // Make a list of all the ports of the components
    vectPorts = [];
    vectComponents.forEach(c => {
        c.port.forEach(p => {
            vectPorts.push({
                position: p.position,
                component: c.id,
                port: c.port.indexOf(p),
                connections: []
            });
        });
    });

    // Get the wires
    netIndex = 0;
    vectWires.forEach(wire => {
        if (vectWires.includes(wire)){
        // List of segments of the wire
        segments = [wire];
        ports = [];
        begin = connectWires(wire.begin, {wire: wire.id, point: 'begin'});
        end = connectWires(wire.end, {wire: wire.id, point: 'end'});
        
        // Remove the wire from the wires list
        vectWires = vectWires.filter(w => w.id !== wire.id);

        // If the wire is not connected to anything, remove it and itself from all connections lists
        if(!begin.connected || !end.connected){
            if(begin.connected){
                // Remove the wire from the connected ports
                wire.begin.connectedPorts.forEach(p => {
                    port = vectComponents.find(c => c.id === p.component).port[p.port];
                    port.connections = port.connections.filter(conn => conn.wire !== wire.id);
                });
                // Remove the wire from other wire's connections
                begin.segments.forEach(s => {
                    s.begin.connectedWires = s.begin.connectedWires.filter(w => w.wire !== wire.id);
                    s.end.connectedWires = s.end.connectedWires.filter(w => w.wire !== wire.id);
                });
            }
            if(end.connected){
                // Remove the wire from the connected ports
                wire.end.connectedPorts.forEach(p => {
                    port = vectComponents.find(c => c.id === p.component).port[p.port];
                    port.connections = port.connections.filter(conn => conn.wire !== wire.id);
                });
                // Remove the wire from other wire's connections
                end.segments.forEach(s => {
                    s.begin.connectedWires = s.begin.connectedWires.filter(w => w.wire !== wire.id);
                    s.end.connectedWires = s.end.connectedWires.filter(w => w.wire !== wire.id);
                });
            }

            // Remove the wire from the nodes
            node = vectNodes.find(n => n.connection.some(p => p.wire === wire.id))
            if(node){
                node.connection = node.connection.filter(p => p.wire !== wire.id);
                if(node.connection.length < 3){
                    vectNodes = vectNodes.filter(n => n.position.x !== node.position.x || n.position.y !== node.position.y);
                }
            }
            // Remove the wire from this connection
            segments = segments.filter(s => s.id !== wire.id);
        }

        if(begin.segments.length + begin.ports.length + end.segments.length + end.ports.length !== 0){
            segments.push(...begin.segments);
            segments.push(...end.segments);
            ports.push(...begin.ports);
            ports.push(...end.ports);
            
            // Get all the components to which all the ports belong to
            const components = ports.map(p => ({...p, component: vectComponents.find(cp => cp.id === p.component),}));
            // Check for a component type 'gnd'
            const hasGND = components.find(c => c.component.type === 'GND');
        
            if(hasGND){
                netId = 'gnd';
            }
            else {
                labeledWire = segments.find(seg => seg.label.hasOwnProperty('text') && seg.label.text != '');
        
                if(labeledWire){
                    netId = labeledWire.label.text;
                }
                else {
                    netId = '_net'+netIndex;
                    netIndex++;
                }
            }

            // Add the net to the ports
            components.forEach(c => {
                c.component.port[c.port].net = netId;
            })

            // Add the reference to the nodes in the connection
            vectNodes.filter(n => n.name === undefined).forEach(node => {
                if(node.connection.some(conn => {return segments.some(seg => seg.id === conn.wire);})){
                    node.name = netId;
                }
            });

            // Eliminate duplicates
            uniqueSegments = segments.filter((s, index, self) => {
                return index === self.findIndex(s2 => s2.id === s.id);
            });
            uniquePorts = ports.filter((p, index, self) => {
                return index === self.findIndex(p2 => p2.position.x === p.position.x && p2.position.y === p.position.y && p2.component === p.component);
            });

            net = new Connection(netId, uniqueSegments, uniquePorts);
            }
        }
    });

    // Check for wireless nodes
    vectPorts.forEach(p => {
        if (vectPorts.includes(p)){
            vectPorts = vectPorts.filter(port => port !== p);
            connections = 0;
            connectedPorts = [{...p}];
            
            p.net = '_net'+netIndex
            const component = vectComponents.find(cp => cp.id === p.component);
            component.port[p.port].net = p.net;
            netIndex++;

            vectPorts.forEach(other => {
                if (other.position.x == p.position.x && other.position.y == p.position.y){
                    otherComponent = vectComponents.find(cp => cp.id === other.component);
                    otherComponent.port[other.port].net = p.net;
                    vectPorts = vectPorts.filter(port => port !== other);
                    connectedPorts.push({...other});
                    connections++;
                }
            });
            if (connections >= 2){
                connectedPorts = connectedPorts.map(conn => {delete conn.position; return conn;});
                node = new CircuitNode(p.position.x, p.position.y, connectedPorts, p.net);
            }
            // Get the port and add its connections
            component.port[p.port].connections = connectedPorts.filter(conn => conn !== p);
            component.port[p.port].connections.forEach(conn => {
                cp = vectComponents.find(c => c.id === conn.component);
                cp.port[conn.port].connections = connectedPorts.filter(c => c !== conn);
            });
        }
    });

    // Remove unconnected components
    vectComponents.forEach(cp => {
        if(vectComponents.includes(cp)){
            if(cp.port.some(p => p.connections.length === 0)){
                vectComponents = vectComponents.filter(c => c !== cp);
                // Remove its ports from connections list
                relevantConnections = vectConnections.filter(conn => conn.ports.some(p => p.component === cp.id));
                relevantConnections.forEach(conn => {
                    conn.ports = conn.ports.filter(p => p.component !== cp.id);
                });

                // Remove any resultant unconneted wires or ports
                removeUnconnected(cp);
            }
        }
    });

    // Remove any remaining unconnected wires (shouldn't be any)
    vectConnections.forEach(con => {
        con.wires.forEach(wire => {
            if(wire.begin.connectedWires.length + wire.begin.connectedPorts.length === 0 || wire.end.connectedWires.length + wire.end.connectedPorts.length === 0){
                con.wires = con.wires.filter(w => w !== wire);
                removeUnconnected(wire);
            }
        });
    });    

    // Remove empty connections
    vectConnections.forEach(con => {
        if(con.wires.length + con.ports.length === 0){
            vectConnections = vectConnections.filter(c => c !== con);
        }
    });

    // Classify segments into wires, starting from the ports
    wireIndex = {value: -1};
    vectComponents.forEach(cp => {
        cp.port.forEach(p => {
            p.connections.forEach(conn => {
                if(conn.hasOwnProperty('wire')){
                    // Get the wire
                    con = vectConnections.find(c => c.wires.some(w => w.id === conn.wire));
                    wire = con.wires.find(w => w.id === conn.wire);
                    if(!wire.wire){
                        wireIndex.value++;
                        wire.wire = 'w'+wireIndex.value;
                        getRealWires(wire, wireIndex, con);
                    }
                }
            });
        });
    });
}

/**
 * This function finds all the connections of a point (a wire end)
 * @param {Object} point A point with x and y coordinates
 * @param {Object} pointInfo The point information, to be added to its connections' connections
 * @returns a list of segments and ports connected to the point or 
 */
function connectWires(point, pointInfo, checkedWires = []){
    let segments = [];
    let ports = [];

    let wireConnections = [];
    let portConnections = [];
    let labelWires = [];
    checkedWires.push(pointInfo.wire);
    // Check if the point is connected to a wire
    vectWires.filter(w => w.id !== pointInfo.wire).forEach(w => {
        if(point.x === w.begin.x && point.y === w.begin.y){
            // If the wire is connected, add it to the segments list
            segments.push(w);
            // If the wire has size 0, it is a label
            if(w.end.x !== w.begin.x || w.end.y !== w.begin.y){
                wireConnections.push({wire: w.id, point: "begin"});
                if(!checkedWires.includes(w.id)){
                    // And check for connections at the other end of the wire
                    next = connectWires(w.end, {wire: w.id, point: "end"}, checkedWires);
                    checkedWires.push(w.id);
                    if(!next.connected){
                        wireConnections = wireConnections.filter(wc => wc.wire !== w.id);
                        segments = segments.filter(s => s.id !== w.id);
                    }
                    else {
                        segments.push(...next.segments);
                        ports.push(...next.ports);
                    }
                }
            }
            else {
                w.wire = 'label-wire';
                labelWires.push(w);
            }

            // Remove the wire from the wires list
            vectWires = vectWires.filter(w2 => w2.id !== w.id);
        }
        else if(point.x === w.end.x && point.y === w.end.y){
            // If the wire is connected, add it to the segments list
            segments.push(w);
            // If the wire has size 0, it is a label
            if(w.end.x !== w.begin.x || w.end.y !== w.begin.y){
                wireConnections.push({wire: w.id, point: "end"});
                if(!checkedWires.includes(w.id)){
                    // And check for connections at the other end of the wire
                    next = connectWires(w.begin, {wire: w.id, point: "begin"}, checkedWires);
                    checkedWires.push(w.id);
                    if(!next.connected){
                        wireConnections = wireConnections.filter(wc => wc.wire !== w.id);
                        segments = segments.filter(s => s.id !== w.id);
                    }
                    else {
                        segments.push(...next.segments);
                        ports.push(...next.ports);
                    }
                }
            }
            else {
                w.wire = 'label-wire';
                labelWires.push(w);
            }

            // Remove the wire from the wires list
            vectWires = vectWires.filter(w2 => w2.id !== w.id);
        }
    });
    // Check for connections to a component
    vectPorts.forEach(p => {
        if(vectPorts.includes(p)){
            if(point.x === p.position.x && point.y === p.position.y){
                vectPorts = vectPorts.filter(p2 => p2.position.x !== p.position.x || p2.position.y !== p.position.y || p2.component !== p.component);
                ports.push(p);
                portConnections.push(p);
            }
        }
    });

    // Save the connections to the point object
    point.connectedWires.push(...wireConnections);
    point.connectedPorts.push(...portConnections.map(p => {np = {...p}; delete np.position; delete np.connections; return np;}));

    // Save the connections to the wire's connections
    wireConnections.forEach(c => {
        wire = segments.find(s => s.id === c.wire);
        wire[c.point].connectedWires = wireConnections.filter(c2 => c2.wire !== wire.id);
        wire[c.point].connectedWires.push(pointInfo);
        wire[c.point].connectedPorts = point.connectedPorts;
    });

    // Save connections to zero length wires
    labelWires.forEach(wire => {
        wire.begin.connectedWires = wireConnections;
        wire.begin.connectedWires.push(pointInfo);
        wire.begin.connectedPorts = point.connectedPorts;
        wire.end.connectedWires = wireConnections;
        wire.end.connectedWires.push(pointInfo);
        wire.end.connectedPorts = point.connectedPorts;
    });

    portConnections.forEach(p => {
        // Get the port object
        port = vectComponents.find(c => c.id === p.component).port[p.port];
        // Save the connections to the port's connections if it is not already there
        point.connectedWires.concat(pointInfo).forEach(c => {
            if(!port.connections.some(c2 => c2.wire === c.wire && c2.point === c.point)){
                port.connections.push(c);
            }
        });
        point.connectedPorts.filter(p2 => p2.component !== p.component).forEach(p2 => {
            if(!port.connections.some(c2 => c2.component === p2.component && c2.port === p2.port)){
                port.connections.push(p2);
            }
        });
    });

    // If it is not connected to anything, return false so it can be removed
    if (point.connectedWires.length + point.connectedPorts.length === 0){
        return {connected: false, segments: segments, ports: ports};  
    }
    // If it is connected to more than 2 things, it is a node
    if(point.connectedWires.length + point.connectedPorts.length >= 2 &&
        !vectNodes.some(n => n.position.x === point.x && n.position.y === point.y)){
        node = new CircuitNode(point.x, point.y, wireConnections.concat(portConnections).concat(pointInfo));
    }
    return {connected: true, segments: segments, ports: ports};
}

/**
 * This function attributes a wire name to all the wires in the circuit
 * @param {Wire} wire The wire segment to be named
 * @param {Object} index The index of the wire name
 * @param {Connection} connection The connection to the wire
 */
function getRealWires(wire, index, connection){
    if(wire.begin.connectedWires.length === 1
        && wire.begin.connectedPorts.length === 0){
            next = connection.wires.find(w => w.id === wire.begin.connectedWires[0].wire);
            if(next.wire == ""){
                next.wire = wire.wire;
                getRealWires(next, index, connection);
            }
    }
    else if(wire.begin.connectedWires.length > 0 ||
        (wire.begin.connectedWires.length === 1 && wire.begin.connectedPorts.length > 0)) {
            wire.begin.connectedWires.forEach(s => {
                next = connection.wires.find(w => w.id === s.wire);
                if(next.wire == ""){
                    index.value++;
                    next.wire = 'w' + index.value;
                    getRealWires(next, index, connection);
                }
            });
    }
    if(wire.end.connectedWires.length === 1
        && wire.end.connectedPorts.length === 0){
            next = connection.wires.find(w => w.id === wire.end.connectedWires[0].wire);
            if(next.wire == ""){
                next.wire = wire.wire;
                getRealWires(next, index, connection);
            }
    }
    else if(wire.end.connectedWires.length > 0 ||
        (wire.end.connectedWires.length === 1 && wire.end.connectedPorts.length > 0)){
            wire.end.connectedWires.forEach(s => {
                next = connection.wires.find(w => w.id === s.wire);
                if(next.wire == ""){
                    index.value++;
                    next.wire = 'w' + index.value;
                    getRealWires(next, index, connection);
                }
            });
    }
}

/**
 * This function removes all component and wires left unconnected after removing a component or wire
 * @param {Componente or Wire} e the element that was removed from the schematic 
 */
function removeUnconnected(e){
    if(e instanceof Wire){
        // If wire was removed because there's no connections on the begin point
        if(e.begin.connectedPorts.length + e.begin.connectedWires.length === 0){
            //Check if there's more than one connection on the other end, if not remove that connection
            if(e.end.connectedPorts.length + e.end.connectedWires.length < 2){
                if(e.end.connectedPorts[0]){
                    component = vectComponents.find(c => c.id === e.end.connectedPorts[0].component);
                    vectComponents = vectComponents.filter(c => c.id !== component.id);
                    port = component.port.find(p => p.connections.some(c => c.wire == e.id));
                    port.connections = port.connections.filter(c => c.wire !== e.id);

                    // Remove its ports from connections list
                    relevantConnections = vectConnections.filter(conn => conn.ports.some(p => p.component === component.id));
                    relevantConnections.forEach(conn => {
                        conn.ports = conn.ports.filter(p => p.component !== component.id);
                    });

                    removeUnconnected(component);
                }
                else if(e.end.connectedWires[0]){
                    connection = vectConnections.find(c => c.wires.some(w => w.id === e.end.connectedWires[0].wire));
                    wire = connection.wires.find(w => w.id == e.end.connectedWires[0].wire);
                    connection.wires = connection.wires.filter(w => w.id !== wire.id);
                    wire[e.end.connectedWires[0].point].connectedWires = wire[e.end.connectedWires[0].point].connectedWires.filter(c => c.wire !== e.id);
                    removeUnconnected(wire);
                }
            }
            else{
                e.end.connectedPorts.forEach(c => {
                    component = vectComponents.find(cp => cp.id == c.component);
                    component.port[c.port].connections = component.port[c.port].connections.filter(con => con.wire !== e.id);
                });
                e.end.connectedWires.forEach(c => {
                    connection = vectConnections.find(con => con.wires.some(w => w.id === c.wire));
                    wire = connection.wires.find(w => w.id == c.wire);
                    wire[c.point].connectedWires = wire[c.point].connectedWires.filter(cp => cp.wire !== e.id);
                });
                if(e.end.connectedPorts.length + e.end.connectedWires.length == 2){
                vectNodes = vectNodes.filter(n => !n.connection.some(conn => conn.wire == e.id));
                }

            }
        }
        // If wire was removed because there's no connections on the end point
        else if(e.end.connectedPorts.length + e.end.connectedWires.length === 0){
            //Check if there's more than one connection on the other end, if not remove that connection
            if(e.begin.connectedPorts.length + e.begin.connectedWires.length < 2){
                if(e.begin.connectedPorts[0]){
                    component = vectComponents.find(c => c.id === e.begin.connectedPorts[0].component);
                    vectComponents = vectComponents.filter(c => c.id !== component.id);
                    port = component.port.find(p => p.connections.some(c => c.wire == e.id));
                    port.connections = port.connections.filter(c => c.wire !== e.id);

                    // Remove its ports from connections list
                    relevantConnections = vectConnections.filter(conn => conn.ports.some(p => p.component === component.id));
                    relevantConnections.forEach(conn => {
                        conn.ports = conn.ports.filter(p => p.component !== component.id);
                    });
                    removeUnconnected(component);
                }
                else if(e.begin.connectedWires[0]){
                    connection = vectConnections.find(c => c.wires.some(w => w.id === e.begin.connectedWires[0].wire));
                    wire = connection.wires.find(w => w.id == e.begin.connectedWires[0].wire);
                    connection.wires = connection.wires.filter(w => w.id !== wire.id);
                    wire[e.begin.connectedWires[0].point].connectedWires = wire[e.begin.connectedWires[0].point].connectedWires.filter(c => c.wire !== e.id);
                    removeUnconnected(wire);
                }
            }
            else{
                e.begin.connectedPorts.forEach(c => {
                    component = vectComponents.find(cp => cp.id == c.component);
                    component.port[c.port].connections = component.port[c.port].connections.filter(con => con.wire !== e.id);
                });
                e.begin.connectedWires.forEach(c => {
                    connection = vectConnections.find(con => con.wires.some(w => w.id === c.wire));
                    wire = connection.wires.find(w => w.id == c.wire);
                    wire[c.point].connectedWires = wire[c.point].connectedWires.filter(cp => cp.wire !== e.id);
                });
                if(e.begin.connectedPorts.length + e.begin.connectedWires.length == 2){
                vectNodes = vectNodes.filter(n => !n.connection.some(conn => conn.wire == e.id));
                }
            }
        }
    }
    else if(e instanceof Component){
        // If the component was removed because it was not connected at port 0
        if(e.port[0].connections.length == 0){
            //Check if there's more than one connection on the other one, if not remove that connection as well
            if(e.port[1].connections.length < 2 && e.port[1].connections[0]){
                if(e.port[1].connections[0].hasOwnProperty('component')){
                    component = vectComponents.find(c => c.id == e.port[1].connections[0].component);
                    vectComponents = vectComponents.filter(c => c.id !== component.id);
                    port = component.port.find(p => p.connections.some(c => c.component == e.id));
                    port.connections = port.connections.filter(c => c.component !== e.id);
                    removeUnconnected(component);
                }
                else if(e.port[1].connections[0].hasOwnProperty('wire') && e.port[1].connections[0].hasOwnProperty('point')){
                    connection = vectConnections.find(c => c.wires.some(w => w.id === e.port[1].connections[0].wire));
                    wire = connection.wires.find(w => w.id == e.port[1].connections[0].wire);
                    connection.wires = connection.wires.filter(w => w.id !== wire.id);
                    point = [wire.begin, wire.end].find(p => p.connectedPorts.some(c => c.component == e.id));
                    point.connectedPorts = point.connectedPorts.filter(c => c.component !== e.id);
                    removeUnconnected(wire);
                }
            }
            else{
                e.port[1].connections.forEach(c => {
                    if(c.hasOwnProperty('component')){
                        component = vectComponents.find(cp => cp.id == c.component);
                        component.port[c.port].connections = component.port[c.port].connections.filter(con => con.component !== e.id);
                    }
                    else{
                        connection = vectConnections.find(con => con.wires.some(w => w.id === c.wire));
                        wire = connection.wires.find(w => w.id == c.wire);
                        wire[c.point].connectedPorts = wire[c.point].connectedPorts.filter(cp => cp.component !== e.id);
                    }
                });
                if(e.port[1].connections.length == 2){
                vectNodes = vectNodes.filter(n => !n.connection.some(conn => conn.component == e.id));
                }
            }
        }
        // If the component was removed because it was not connected at port 1
        else if(e.port[1].connections.length == 0){
            //Check if there's more than one connection on the other one, if not remove that connection as well
            if(e.port[0].connections.length < 2){
                if(e.port[0].connections[0].hasOwnProperty('component') && e.port[0].connections[0].hasOwnProperty('port')){
                    component = vectComponents.filter(c => c.id == e.port[0].connections[0].component);
                    vectComponents = vectComponents.filter(c => c.id !== component[0].id);
                    port = component[0].port.find(p => p.connections.some(c => c.component == e.id));
                    port.connections = port.connections.filter(c => c.component !== e.id);
                    removeUnconnected(component[0]);
                }
                else if(e.port[0].connections[0].hasOwnProperty('wire') && e.port[0].connections[0].hasOwnProperty('point')){
                    connection = vectConnections.find(c => c.wires.some(w => w.id === e.port[0].connections[0].wire));
                    wire = connection.wires.find(w => w.id == e.port[0].connections[0].wire);
                    connection.wires = connection.wires.filter(w => w.id !== wire.id);
                    point = [wire.begin, wire.end].find(p => p.connectedPorts.some(c => c.component == e.id));
                    point.connectedPorts = point.connectedPorts.filter(c => c.component !== e.id);
                    removeUnconnected(wire);
                }
            }
            else{
                e.port[0].connections.forEach(c => {
                    if(c.hasOwnProperty('component')){
                        component = vectComponents.filter(cp => cp.id == c.component);
                        component[0].port[c.port].connections = component[0].port[c.port].connections.filter(con => con.component !== e.id);
                    }
                    else{
                        connection = vectConnections.find(con => con.wires.some(w => w.id === c.wire));
                        wire = connection.wires.find(w => w.id == c.wire);
                        wire[c.point].connectedPorts = wire[c.point].connectedPorts.filter(cp => cp.component !== e.id);
                    }
                });
                if(e.port[0].connections.length == 2){
                vectNodes = vectNodes.filter(n => !n.connection.some(conn => conn.component == e.id));
                }
            }
        }
    }
}

/**
 * This function crops the schematic to the smallest possible view window
 * @param {Schematic} schematic The schematic object
 * @returns The cropped schematic object
 */
function cropWindow(schematic){
    let minX = 0;
    let maxX = 0;
    let minY = 0;
    let maxY = 0;

    // Make list with all element's coordinates
    let coordinates = {x: [], y: []};
    coordinates.x.push(...schematic.components.map(c => c.position.x));
    coordinates.y.push(...schematic.components.map(c => c.position.y));
    //coordinates.x.push(...schematic.components.map(c => c.position.x + c.name.position.x));
    //coordinates.y.push(...schematic.components.map(c => c.position.y + c.name.position.y));
    coordinates.x.push(...schematic.connections.flatMap(con =>con.wires.map(s => s.begin.x)));
    coordinates.y.push(...schematic.connections.flatMap(con =>con.wires.map(s => s.begin.y)));
    coordinates.x.push(...schematic.connections.flatMap(con =>con.wires.map(s => s.end.x)));
    coordinates.y.push(...schematic.connections.flatMap(con =>con.wires.map(s => s.end.y)));
    coordinates.x.push(...schematic.connections.flatMap(con =>con.wires.map(s => s.label.text == ""? undefined : s.label.position.x)));
    coordinates.y.push(...schematic.connections.flatMap(con =>con.wires.map(s => s.label.text == ""? undefined : s.label.position.y)));
    coordinates.x.push(...schematic.nodes.map(n => n.position.x));
    coordinates.y.push(...schematic.nodes.map(n => n.position.y));

    // Find the minimum and maximum x and y coordinates, filter out undefined values
    minX = Math.min(...coordinates.x.filter(x => x != undefined));
    maxX = Math.max(...coordinates.x.filter(x => x != undefined));
    minY = Math.min(...coordinates.y.filter(y => y != undefined));
    maxY = Math.max(...coordinates.y.filter(y => y != undefined));

    // Crop the window
    schematic.properties.view.x1 = minX - 30 - schematic.properties.grid.x*2;
    schematic.properties.view.y1 = minY - 30 - schematic.properties.grid.y*2;
    schematic.properties.view.x2 = maxX + 30 + schematic.properties.grid.x*2;
    schematic.properties.view.y2 = maxY + 30 + schematic.properties.grid.y*2;

    return schematic;
}

function parseSchematic_handleError (err) {
    let codes = err.errorReasonCodes;
    let data = err.errorData;
    
    let errorstr = '';

    codes.forEach(e => {
        switch(e){
            case '1':
                errorstr += '\tMissing data: ';
                data.missingData.forEach(err =>{
                    errorstr += err + ', ';
                });
                break;
            case '2':
                errorstr += '\tInvalid elements: ';
                data.forEach(err =>{
                    errorstr += err.invalidData + ' ' + err.error + ', ';
                });
                break;
            case '3':
                errorstr += '\tCircuit has no components';
                break;
            case '4':
                errorstr += '\tCircuit has no wires';
                break;
            default:
                errorstr += 'Error ' + e + ':' + data + '\n';
                break;
        }
    });
    return errorstr;
}