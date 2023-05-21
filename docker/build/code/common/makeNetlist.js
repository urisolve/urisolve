/**
 * This function generates a netlist from the schematic data
 * @param {Schematic} schematic 
 * @returns The netlist as a string or an error object
 */
function makeNetlist(schematic){
    netlist = `# Qucs ${schematic.qucs_version}\n`;

    // Add the component definitions
    schematic.components.forEach(cp => {
        // Skip ground
        if(cp.type == 'GND'){
            return;
        }
        // All component definitions start with type:name
        componentEntry = `\n${cp.type}:${cp.name.value} `;
        // Add the component properties
        switch(cp.type){
            case 'R':
                componentEntry += `${cp.port[0].net} ${cp.port[1].net} `
                                    +`R="${cp.value.value} ${cp.value.unit}" `
                                    +`Temp="${cp.properties.temperature.value}" `
                                    +`Tc1="${cp.properties.tc1.value}" `
                                    +`Tc2="${cp.properties.tc2.value}" `
                                    +`Tnom="${cp.properties.tnom.value}"`;
                break;
            case 'C':
                componentEntry += `${cp.port[0].net} ${cp.port[1].net} `
                                    +`C="${cp.value.value} ${cp.value.unit}" `
                                    +`V="${cp.properties.initialValue.value}"`;
                break;
            case 'L':
                componentEntry += `${cp.port[0].net} ${cp.port[1].net} `
                                    +`L="${cp.value.value} ${cp.value.unit}" `
                                    +`I="${cp.properties.initialValue.value}"`;
                break;
            case 'VProbe':
                componentEntry += `${cp.port[0].net} ${cp.port[1].net} `
                                    +`Ri="${cp.properties.impedance.value} ${cp.properties.impedance.unit}"`;
                break;
            case 'Vdc':
                componentEntry += `${cp.port[1].net}_TEMP_${cp.name.value} ${cp.port[0].net} `
                                     +`U="${cp.value.value} ${cp.value.unit}" `
                                     +`Ri="${cp.properties.impedance.value} ${cp.properties.impedance.unit}"\n`;
                componentEntry += `R:_R_${cp.port[1].net}_TEMP_${cp.name.value} `
                                     +`${cp.port[1].net}_TEMP_${cp.name.value} ${cp.port[1].net} `
                                     +`R="${cp.properties.impedance.value} ${cp.properties.impedance.unit}" `
                                     +`Temp = "26.85" Tc1 = "0.0" Tc2 = "0.0" Tnom = "26.85"`;
                break;
            case 'Vac':
                componentEntry += `${cp.port[1].net}_TEMP_${cp.name.value} ${cp.port[0].net} `
                                         +`U="${cp.value.value} ${cp.value.unit}" `
                                         +`f="${cp.frequency.value} ${cp.frequency.unit}" `
                                         +`Phase="${cp.phase.value}" `
                                         +`Theta="${cp.properties.damping.value}" `
                                         +`Ri="${cp.properties.impedance.value} ${cp.properties.impedance.unit}"\n`;
                componentEntry += `R:_R_${cp.port[1].net}_TEMP_${cp.name.value} `
                                         +`${cp.port[1].net}_TEMP_${cp.name.value} ${cp.port[1].net} `
                                         +`R="${cp.properties.impedance.value} ${cp.properties.impedance.unit}" `
                                         +`Temp = "26.85" Tc1 = "0.0" Tc2 = "0.0" Tnom = "26.85"`;
                break;
            case 'Idc':
                componentEntry += `${cp.port[1].net} ${cp.port[0].net} `
                                    +`I="${cp.value.value} ${cp.value.unit}" `
                                    +`Ri="${cp.properties.impedance.value} ${cp.properties.impedance.unit}"`;
                break;
            case 'Iac':
                componentEntry += `${cp.port[1].net} ${cp.port[0].net} `
                                    +`I="${cp.value.value} ${cp.value.unit}" `
                                    +`f="${cp.frequency.value} ${cp.frequency.unit}" `
                                    +`Phase="${cp.phase.value}" `
                                    +`Theta="${cp.properties.damping.value}" `
                                    +`Ri="${cp.properties.impedance.value} ${cp.properties.impedance.unit}"`;
                break;
            case 'IProbe':
                componentEntry += `${cp.port[0].net} ${cp.port[1].net}_TEMP_${cp.name.value} `
                                     +`Ri="${cp.properties.impedance.value} ${cp.properties.impedance.unit}"\n`;
                componentEntry += `R:_R_${cp.port[1].net}_TEMP_${cp.name.value} `
                                     +`${cp.port[1].net}_TEMP_${cp.name.value} ${cp.port[1].net} `
                                     +`R="${cp.properties.impedance.value} ${cp.properties.impedance.unit}" `
                                     +`Temp = "26.85" Tc1 = "0.0" Tc2 = "0.0" Tnom = "26.85"`;
                break;
            }
        // Add the component to the netlist
        netlist += componentEntry + '\n';
    });

    return {
        errorFlag: false,
        errorReasonCodes: [],
        data: netlist
    }
}