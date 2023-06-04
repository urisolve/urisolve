/**
 * This function redraws the schematic's components and wires on the given div.
 * @param {Schematic} schematic The schematic object to be drawn
 * @param {jQuery} container The div where the schematic will be drawn
 * @param {boolean} interactive If true, the schematic will be drawn as an interactive widget
 *                              If false, the schematic will be drawn as a static image
 * @param {boolean} mutable If true, the schematic will be drawn with the ability to be edited
 *                          If false, the schematic will be drawn without the ability to be edited
 * @returns {Object} An object containing the error flag and the error reason codes
 */
function redrawSchematic(schematic, container, interactive = true, mutable = true){
    if(!(schematic instanceof Schematic)){
        return {
            errorFlag: true,
            errorReasonCodes: [1]
        };
    }

    if(!(container instanceof jQuery) || container.length === 0){
        return {
            errorFlag: true,
            errorReasonCodes: [2]
        };
    }

    if(typeof interactive !== 'boolean'){
        return {
            errorFlag: true,
            errorReasonCodes: [3],
            errorData: "interactive"
        };
    }

    if(typeof mutable !== 'boolean'){
        return {
            errorFlag: true,
            errorReasonCodes: [3],
            errorData: "mutable"
        };
    }

    // Clear the drawing area
    container.empty();
    // Change the scale to the stylesheet
    const scale = schematic.properties.view.scale;
    document.documentElement.style.setProperty('--scale', scale);

    // Get the drawing limits
    const xLeft = schematic.properties.view.x1;
    const xRight = schematic.properties.view.x2;
    const yTop = schematic.properties.view.y1;
    const yBottom = schematic.properties.view.y2;

    // Build the drawing area
    drawing = $(`<div class="drawing"></div>`);
    const drawingWidth = (xRight-xLeft)*scale;
    const drawingHeight = (yBottom-yTop)*scale;
    drawing.css({width: drawingWidth, height: drawingHeight});

    if(interactive){
        containerHeight = drawingHeight+35+2;
    }
    else{
        containerHeight = drawingHeight+2;
    }

    container.css({
        'height': `${containerHeight}px`,
        'width': `${drawingWidth+2}px`,
        'border': '1px solid black'
    });

    // Add toolbar if interactive
    if(interactive){
        toolbar = $(`<div class="drawing-toolbar"></div>`);
        toolbar.appendTo(container).width(drawingWidth);

        // Create the toolbar buttons
        gridButton = $(`<input type="button" class="grid-button toolbar-button"></div>`);
        gridButton.click(function(){
            $(this).toggleClass('active');
            schematic.properties.grid.active = schematic.properties.grid.active === "1" ? "0" : "1";
            // Update the grid
            drawing = container.find('.drawing');
            if(schematic.properties.grid.active === "1"){
                drawing.css({ 
                    'background-size': `${gridWidth}px ${gridHeight}px`,
                    'background-position': `${schematic.properties.grid.x-xLeft}px ${schematic.properties.grid.y-yTop}px`,
                });
            }
            else{
                drawing.css({ 
                    'background-size': '0px 0px',
                    'background-position': '0px 0px',
                });
            }
        });

        styleSwitchContainer = $('<div class="style-switch"></div>');
        styleSwitch = $('<label class="switch"></label>');
        styleCheck = $('<input type="checkbox">');
        styleSwitch.append(styleCheck)
            .append('<span class="slider"></span>');
        styleSwitchContainer.append(styleSwitch);

        styleCheck.on('click',function(e){
            container.find('.drawing').toggleClass('legacy');
            container.find(('.wire')).toggleClass('legacy');
            container.find(('.node')).toggleClass('legacy');
            container.find(('.hover-trigger')).toggleClass('legacy');
            container.find(('.connect-vertical')).toggleClass('legacy');
            container.find(('.connect-horizontal')).toggleClass('legacy');
            container.find(('.gnd')).toggleClass('legacy');
            container.find(('.wire-label')).toggleClass('legacy');
            container.find(('.wire-label-line')).toggleClass('legacy');
        });

        wireButton = $(`<input type="button" class="wire-button toolbar-button"></div>`);
        wireButton.click(function(){
            $(this).toggleClass('active');
            
            if($(this).hasClass('active')){
                wires = container.find($('.wire'));
                for (var i = 0; i < wires.length; i++) {
                    var w = $(wires[i]);
                    wire = w.attr('wire');
                    hue = 37 * Number(wire.substring(1));
                    randomSaturation = Math.floor(Math.random() * 50)+50; // 50-100%
                    lightness = Math.floor(Math.random() * 60)+10; // 10-70%

                    randomColor = 'hsl(' + hue + ', ' + randomSaturation + '%, ' + lightness + '%)';
                    container.find(`[wire = '${wire}']`).css({'background-color': '#' + randomColor});
                };

                /*
                schematic.connections.forEach(con => {
                    con.wires.forEach(w => { 
                        hue = 37 * Number(w.wire.substring(1));
                        randomSaturation = Math.floor(Math.random() * 50)+50; // 50-100%
                        lightness = Math.floor(Math.random() * 60)+10; // 10-70%
                        
                        randomColor = 'hsl(' + hue + ', ' + randomSaturation + '%, ' + lightness + '%)';
                        container.find($('.'+w.wire)).css({'background-color': '#' + randomColor});
                });});*/
            }
            else{
                container.find($('.wire')).css({'background-color': ''});
            }
        });
        

        toolbar.append(gridButton).append(wireButton).append(styleSwitchContainer);
    }

    drawing.appendTo(container);

    // Calculate the grid size
    if(schematic.properties.grid.x < 3){
        gridWidth = 10;
    }
    else if(schematic.properties.grid.x < 5){
        gridWidth = schematic.properties.grid.x*3;
    }
    else {
        gridWidth = schematic.properties.grid.x*2;
    }
    if(schematic.properties.grid.y < 3){
        gridHeight = 10;
    }
    else if(schematic.properties.grid.y < 5){
        gridHeight = schematic.properties.grid.y*3;
    }
    else {
        gridHeight = schematic.properties.grid.y*2;
    }

    // Draw the grid if it is active
    if(schematic.properties.grid.active === '1'){
        if(interactive)
            gridButton.addClass('active');

        drawing.css({ 
            'background-size': `${gridWidth}px ${gridHeight}px`,
            'background-position': `${schematic.properties.grid.x-xLeft}px ${schematic.properties.grid.y-yTop}px`,
          });
    }
    else{
        drawing.css({ 
            'background-size': '0px 0px',
            'background-position': '0px 0px',
          });
    }

    // Redraw the components
    schematic.components.forEach(function (cp) {
        if(cp.active === '1'){
        // The GND component is a special case
        if(cp.type === 'GND'){
            var newGND = $(`<div class="${cp.id} gnd"></div>`);

            if(cp.position.mirrorx === '1')
                newGND.addClass('mirror');

            drawing.append(newGND);

            switch(cp.position.angle){
                case '0':
                    newGND.addClass('rotated-0').position({
                        my: 'center top',
                        at: `left+${(cp.position.x-xLeft)*scale} top+${(cp.position.y-yTop)*scale}`,
                        of: drawing,
                        collision: 'none'
                    });
                    break;
                case '1':
                    newGND.addClass('rotated-270').position({
                        my: 'left center',
                        at: `left+${(cp.position.x-xLeft)*scale} top+${(cp.position.y-yTop)*scale}`,
                        of: drawing,
                        collision: 'none'
                    });
                    break;
                case '2':
                    newGND.addClass('rotated-180').position({
                        my: 'center bottom',
                        at: `left+${(cp.position.x-xLeft)*scale} top+${(cp.position.y-yTop)*scale}`,
                        of: drawing,
                        collision: 'none'
                    });
                    break;
                case '3':
                    newGND.addClass('rotated-90').position({
                        my: 'right center',
                        at: `left+${(cp.position.x-xLeft)*scale} top+${(cp.position.y-yTop)*scale}`,
                        of: drawing,
                        collision: 'none'
                    });
                    break;
            }

            return {
                errorFlag: false,
                errorReasonCodes: []    
            };
        }

        // All other components work with a similar structure
        var newCp = $(`<div class="${cp.id} cp-container"></div>`);

        switch(cp.type){
        case 'VProbe':
            var symbolCell = $('<div class="VProbe hover-trigger"></div>');
            var connectCell1 = $('<div></div>');
            var connectCell2 = $('<div></div>');

            if (cp.position.mirrorx === '1')
                symbolCell.addClass('mirror');
            
            switch(cp.position.angle){
                case '0':
                    symbolCell.addClass('rotated-0 probe-cell-up');
                    if (symbolCell.hasClass('mirror')) {
                        connectCell1.addClass('vprobe-port-up1 connect-vertical');
                        connectCell2.addClass('vprobe-port-up2 connect-vertical');
                        break;
                    }
                    connectCell1.addClass('vprobe-port-down1 connect-vertical');
                    connectCell2.addClass('vprobe-port-down2 connect-vertical');
                    break;
                case '1':
                    symbolCell.addClass('rotated-270 probe-cell-left');
                    if (symbolCell.hasClass('mirror')) {
                        connectCell1.addClass('vprobe-port-left1 connect-horizontal');
                        connectCell2.addClass('vprobe-port-left2 connect-horizontal');
                        break;
                    }
                    connectCell1.addClass('vprobe-port-right1 connect-horizontal');
                    connectCell2.addClass('vprobe-port-right2 connect-horizontal');
                    break;
                case '2':
                    symbolCell.addClass('rotated-180 probe-cell-down');
                    if (symbolCell.hasClass('mirror')) {
                        connectCell1.addClass('vprobe-port-down1 connect-vertical');
                        connectCell2.addClass('vprobe-port-down2 connect-vertical');
                        break;
                    }
                    connectCell1.addClass('vprobe-port-up1 connect-vertical');
                    connectCell2.addClass('vprobe-port-up2 connect-vertical');
                    break;
                case '3':
                    symbolCell.addClass('rotated-90 probe-cell-right');
                    if (symbolCell.hasClass('mirror')) {
                        connectCell1.addClass('vprobe-port-right1 connect-horizontal');
                        connectCell2.addClass('vprobe-port-right2 connect-horizontal');
                        break;
                    }
                    connectCell1.addClass('vprobe-port-left1 connect-horizontal');
                    connectCell2.addClass('vprobe-port-left2 connect-horizontal');
                    break;
            }
            
            symbolCell.appendTo(newCp);
            connectCell1.appendTo(newCp);
            connectCell2.appendTo(newCp);
            break;
        case 'IProbe':
            var symbolCell = $('<div class="IProbe hover-trigger"></div>');
            var connectCell1 = $('<div></div>');
            var connectCell2 = $('<div></div>');

            if (cp.position.mirrorx === '1')
                symbolCell.addClass('mirror');

            switch(cp.position.angle){
                case '0':
                    symbolCell.addClass('rotated-0 probe-cell-up');
                    connectCell1.addClass('iprobe-port-horizontal1 connect-horizontal');
                    connectCell2.addClass('iprobe-port-horizontal2 connect-horizontal');
                    break;
                case '1':
                    symbolCell.addClass('rotated-270 probe-cell-left');
                    connectCell1.addClass('iprobe-port-vertical1 connect-vertical');
                    connectCell2.addClass('iprobe-port-vertical2 connect-vertical');
                    break;
                case '2':
                    symbolCell.addClass('rotated-180 probe-cell-down');
                    connectCell1.addClass('iprobe-port-horizontal1 connect-horizontal');
                    connectCell2.addClass('iprobe-port-horizontal2 connect-horizontal');
                    break;
                case '3':
                    symbolCell.addClass('rotated-90 probe-cell-right');
                    connectCell1.addClass('iprobe-port-vertical1 connect-vertical');
                    connectCell2.addClass('iprobe-port-vertical2 connect-vertical');
                    break; 
            }
            symbolCell.appendTo(newCp);
            connectCell1.appendTo(newCp);
            connectCell2.appendTo(newCp);   
            break;
        default:
            var upConnect = $('<div class="cp-port-up connect-vertical"></div>');
            var leftConnect = $('<div class="cp-port-left connect-horizontal"></div>');
            var symbolCell = $('<div class="cp-symbol ' + cp.type + ' hover-trigger"></div>');
            var rightConnect = $('<div class="cp-port-right connect-horizontal"></div>');
            var downConnect = $('<div class="cp-port-down connect-vertical"></div>');

            // Add the correct symbol class if there are different ones
            if (cp.type === 'R' || cp.type === 'C')
                symbolCell.addClass(cp.symbol.reference);
            
            // Add the mirror class if the component is mirrored
            if(cp.position.mirrorx === '1'){
                symbolCell.addClass('mirror');
            }   

            symbolCell.appendTo(newCp);

            // Add the correct rotation classes to the cells
            switch(cp.position.angle){
                case '0':
                    symbolCell.addClass('rotated-0');
                    leftConnect.appendTo(newCp);
                    rightConnect.appendTo(newCp);
                    break;
                case '1':
                    symbolCell.addClass('rotated-270');
                    upConnect.appendTo(newCp);
                    downConnect.appendTo(newCp);
                    break;
                case '2':
                    symbolCell.addClass('rotated-180');
                    leftConnect.appendTo(newCp);
                    rightConnect.appendTo(newCp);
                    break;
                case '3':
                    symbolCell.addClass('rotated-90');
                    upConnect.appendTo(newCp);
                    downConnect.appendTo(newCp);
                    break;
            }
            break;
        }

        drawing.append(newCp);
        newCp.position({
            my: 'center',
            at: `left+${(cp.position.x-xLeft)*scale} top+${(cp.position.y-yTop)*scale}`,
            of: drawing,
            collision: 'none'
        });

        // Draw the label       
        label = $(`<div class="label-${cp.id} label"></div>`);
        label.appendTo(drawing.find(`.${cp.id}`));

        drawLabel(label, cp);

        label.position({
            my: 'left top',
            at: `left+${(cp.position.x+cp.name.position.x-xLeft)*scale} top+${(cp.position.y+cp.name.position.y-yTop)*scale}`,
            of: drawing,
            collision: 'none'
        })
        if(interactive)
            label.draggable({containment: drawing});

        snapToDrawing(label, drawing);

        if(interactive){
            // Show all properties on hover
            hlabel = $(`<div class="hlabel-${cp.id} h-label"></div>`);

            newCp.find('.hover-trigger').hover(function(){
                container.find($('.hlabel-'+cp.id)).fadeIn(300);
            },
            function(){
                container.find($('.hlabel-'+cp.id)).fadeOut(50);
            });

            // Populate hover label
            switch(cp.type){
                case 'R':
                    hlabel.append($(`<span>R=${cp.value.value} ${cp.value.unit}</span>`));
                    hlabel.append($(`<span>Temp=${cp.properties.temperature.value}</span>`));
                    hlabel.append($(`<span>Tc1=${cp.properties.tc1.value}</span>`));
                    hlabel.append($(`<span>Tc2=${cp.properties.tc2.value}</span>`));
                    hlabel.append($(`<span>Tnom=${cp.properties.tnom.value}</span>`));
                    hlabel.append($(`<span>Symbol=${cp.symbol.reference}</span>`));
                    break;
                case 'C':
                    hlabel.append($(`<span>C=${cp.value.value} ${cp.value.unit}</span>`));
                    hlabel.append($(`<span>V=${cp.properties.initialValue.value}</span>`));
                    hlabel.append($(`<span>Symbol=${cp.symbol.reference}</span>`));
                    break;
                case 'L':
                    hlabel.append($(`<span>L=${cp.value.value} ${cp.value.unit}</span>`));
                    hlabel.append($(`<span>I=${cp.properties.initialValue.value}</span>`));
                    break;
                case 'Vdc':
                    hlabel.append($(`<span>U=${cp.value.value} ${cp.value.unit}</span>`));
                    hlabel.append($(`<span>Ri=${cp.properties.impedance.value} ${cp.properties.impedance.unit}</span>`));
                    break;
                case 'Idc':
                    hlabel.append($(`<span>I=${cp.value.value} ${cp.value.unit}</span>`));
                    hlabel.append($(`<span>Ri=${cp.properties.impedance.value} ${cp.properties.impedance.unit}</span>`));
                    break;
                case 'Vac':
                    hlabel.append($(`<span>U=${cp.value.value} ${cp.value.unit}</span>`));
                    hlabel.append($(`<span>f=${cp.frequency.value} ${cp.frequency.unit}</span>`));
                    hlabel.append($(`<span>Phase=${cp.phase.value}</span>`));
                    hlabel.append($(`<span>Theta=${cp.properties.damping.value}</span>`));
                    hlabel.append($(`<span>Ri=${cp.properties.impedance.value} ${cp.properties.impedance.unit}</span>`));
                    break;
                case 'Iac':
                    hlabel.append($(`<span>I=${cp.value.value} ${cp.value.unit}</span>`));
                    hlabel.append($(`<span>f=${cp.frequency.value} ${cp.frequency.unit}</span>`));
                    hlabel.append($(`<span>Phase=${cp.phase.value}</span>`));
                    hlabel.append($(`<span>Theta=${cp.properties.damping.value}</span>`));
                    hlabel.append($(`<span>Ri=${cp.properties.impedance.value} ${cp.properties.impedance.unit}</span>`));
                    break;
                case 'VProbe':
                case 'IProbe':
                    hlabel.append($(`<span>Ri=${cp.properties.impedance.value} ${cp.properties.impedance.unit}</span>`));
                    break;
            }      

            newCp.append(hlabel);
            hlabel.position({
                my: 'left top',
                at: 'right top',
                of: newCp,
                collision: 'none'
            });

            hlabel.hide();

            // Add hammer.js touch events to the component so that it can trigger double tap on mobile
            //var myElement = container.find('.'+cp.id)[0];
            //var hammer = new Hammer(myElement);

            // Build the properties menu on double click
            //hammer.on("doubletap", function(event) {
            drawing.find($('.'+cp.id)).dblclick(function(){
                drawing = container.find('.drawing');
                drawing.find(drawing.find($('.menu'))).remove();
                // Build the menu elements
                menu = $(`<div class="menu"></div>`);

                // Build the menu header
                navbar = $(`<div class="menu-navbar col-12"></div>`)
                title = $(`<div class="menu-title">${cp.name.value}</div>`);
                closeButton = $(`<div class="menu-close "><i class="fas fa-times fa-sm"</div>`);
                closeButton.click(function(){
                    drawing.find($('.menu')).remove();
                });

                // Build the menu buttons
                buttons = $(`<div class="menu-buttons"></div>`);
                okButton = $(`<button class="menu-ok menu-button">OK</button>`);
                cancelButton = $(`<button class="menu-cancel menu-button">Cancel</button>`);
                cancelButton.click(function(){
                    drawing.find($('.menu')).remove();
                });

                // Build the menu content
                content = $(`<div class="menu-content pt-3"></div>`)
                // Populate the menu content and add the OK button event handler
                switch(cp.type){
                    case 'R':
                        line1 = $(`<div class="input-line-1 col-12"></div>`);
                        line1.append('<div class="col-4 d-flex text-start">R = </div>');
                        if(mutable) {
                            line1.append(`<input type="number" min="0" min="0" class="input1 col-3 bg-light border border-secondary" title="Ohmic resistance in Ohms" placeholder="${cp.value.value}">`);
                            select = $(`<select class="input2 col-3">`);
                            select.append($(`<option value="TOhm">T&#8486;</option>`));
                            select.append($(`<option value="GOhm">G&#8486;</option>`));
                            select.append($(`<option value="MOhm">M&#8486;</option>`));
                            select.append($(`<option value="kOhm">k&#8486;</option>`));
                            select.append($(`<option value="Ohm">&#8486;</option>`));
                            select.append($(`<option value="mOhm">m&#8486;</option>`));
                            select.append($(`<option value="uOhm">&#181;&#8486;</option>`));
                            select.append($(`<option value="nOhm">n&#8486;</option>`));
                            select.append($(`<option value="pOhm">p&#8486;</option>`));
                            
                            line1.append(select);
                            select.val(cp.value.unit);
                        }

                        box1 = $(`<input type="checkbox" class="box1 col-1 ms-auto">`);
                        box1.prop('checked', cp.value.visible == '1');
                        line1.append(box1);

                        line2 = $(`<div class="input-line-2 col-12"></div>`);
                        line2.append('<div class="col-4 d-flex text-start">Temp = </div>');
                        if(mutable)
                            line2.append(`<input type="number" min="0" min="0" class="input3 col-6 bg-light border border-secondary" title="Simulation temperature in degree Celsius" placeholder="${cp.properties.temperature.value}">`);
                        box2 = $(`<input type="checkbox" class="box2 col-1 ms-auto">`);
                        box2.prop('checked', cp.properties.temperature.visible == '1');
                        line2.append(box2);
                        
                        
                        line3 = $(`<div class="input-line-3 col-12"></div>`);
                        line3.append('<div class="col-4 d-flex text-start">Tc1 = </div>');
                        if(mutable)
                            line3.append(`<input type="number" min="0" min="0" class="input4 col-6 bg-light border border-secondary" title="First order temperature coefficient" placeholder="${cp.properties.tc1.value}">`);
                        box3 = $(`<input type="checkbox" class="box3 col-1 ms-auto">`);
                        box3.prop('checked', cp.properties.tc1.visible == '1');
                        line3.append(box3);
                        
                        line4 = $(`<div class="input-line-4 col-12"></div>`);
                        line4.append('<div class="col-4 d-flex text-start">Tc2 = </div>');
                        if(mutable)
                            line4.append(`<input type="number" min="0" class="input5 col-6 bg-light border border-secondary" title="Second order temperature coefficient" placeholder="${cp.properties.tc2.value}">`);
                        box4 = $(`<input type="checkbox" class="box4 col-1 ms-auto">`);
                        box4.prop('checked', cp.properties.tc2.visible == '1');
                        line4.append(box4);
                        
                        line5 = $(`<div class="input-line-5 col-12"></div>`);
                        line5.append('<div class="col-4 d-flex text-start">Tnom = </div>');
                        if(mutable)
                            line5.append(`<input type="number" min="0" class="input6 col-6 bg-light border border-secondary" title="Temperature at which parameters were extracted" placeholder="${cp.properties.tnom.value}">`);
                        box5 = $(`<input type="checkbox" class="box5 col-1 ms-auto">`);
                        box5.prop('checked', cp.properties.tnom.visible == '1');
                        line5.append(box5);
                        
                        line6 = $(`<div class="input-line-6 col-12"></div>`);
                        line6.append('<div class="col-4 d-flex text-start">Symbol = </div>');
                        if(mutable){
                            select = $(`<select class="input7 col-6">`);
                            select.append($(`<option value="US">US</option>`));
                            select.append($(`<option value="european">european</option>`));
                            line6.append(select);
                            select.val(cp.symbol.reference); 
                        }
                        box6 = $(`<input type="checkbox" class="box6 col-1 ms-auto">`);
                        box6.prop('checked', cp.symbol.visible == '1');
                        line6.append(box6);
                        
                        content.append(line1).append(line2).append(line3).append(line4).append(line5).append(line6).tooltip();

                        okButton.click(function(){
                            if(mutable){
                                if(drawing.find($('.input1')).val())
                                    cp.value.value = drawing.find($('.input1')).val();
                                if(drawing.find($('.input2')).val())   
                                    cp.value.unit = drawing.find($('.input2')).val();
                                if(drawing.find($('.input3')).val())
                                    cp.properties.temperature.value = drawing.find($('.input3')).val();
                                if(drawing.find($('.input4')).val())
                                    cp.properties.tc1.value = drawing.find($('.input4')).val();
                                if(drawing.find($('.input5')).val())
                                    cp.properties.tc2.value = drawing.find($('.input5')).val();
                                if(drawing.find($('.input6')).val())
                                    cp.properties.tnom.value = drawing.find($('.input6')).val();
                                if(drawing.find($('.input7')).val())
                                    cp.symbol.reference = drawing.find($('.input7')).val();
                            }

                            if(drawing.find($('.box1')).is(':checked'))
                                cp.value.visible = '1';
                            else cp.value.visible = '0';
                            if(drawing.find($('.box2')).is(':checked'))
                                cp.properties.temperature.visible = '1';
                            else cp.properties.temperature.visible = '0';
                            if(drawing.find($('.box3')).is(':checked'))
                                cp.properties.tc1.visible = '1';
                            else cp.properties.tc1.visible = '0';
                            if(drawing.find($('.box4')).is(':checked'))   
                                cp.properties.tc2.visible = '1';
                            else cp.properties.tc2.visible = '0';
                            if(drawing.find($('.box5')).is(':checked'))
                                cp.properties.tnom.visible = '1';
                            else cp.properties.tnom.visible = '0';
                            if(drawing.find($('.box6')).is(':checked'))   
                                cp.symbol.visible = '1';
                            else cp.symbol.visible = '0';
                            
                            drawLabel(drawing.find($('.label-'+cp.id)), cp);
                            drawing.find($('.menu')).remove();
                            
                            if(mutable){
                                if(cp.symbol.reference == 'US')
                                    drawing.find($('.'+cp.id+' > .cp-symbol')).removeClass('european').addClass('US');
                                else 
                                    drawing.find($('.'+cp.id+' > .cp-symbol')).removeClass('US').addClass('european');

                                try{updateOutput({data: {tree: JSON.stringify(schematic)}}, makeNetlist(schematic));}
                                catch(e){console.log(e);}
                            }
                            });
                        break;
                    case 'C':
                        line1 = $(`<div class="input-line-1 col-12"></div>`);
                        line1.append('<div class="col-4 d-flex text-start">C = </div>');
                        if(mutable){
                            line1.append(`<input type="number" min="0" class="input1 col-3 bg-light border border-secondary" title="Capacitance in Farad" placeholder="${cp.value.value}">`);

                            select = $(`<select class="input2 col-3">`);
                            select.append($(`<option value="TF">TF</option>`));
                            select.append($(`<option value="GF">GF</option>`));
                            select.append($(`<option value="MF">MF</option>`));
                            select.append($(`<option value="kF">kF</option>`));
                            select.append($(`<option value="F">F</option>`));
                            select.append($(`<option value="mF">mF</option>`));
                            select.append($(`<option value="uF">&#181;F</option>`));
                            select.append($(`<option value="nF">nF</option>`));
                            select.append($(`<option value="pF">pF</option>`));                    
                            
                            line1.append(select);
                            select.val(cp.value.unit);
                        }
                        
                        box1 = $(`<input type="checkbox" class="box1 col-1 ms-auto">`);
                        box1.prop('checked', cp.value.visible == '1');
                        line1.append(box1);

                        line2 = $(`<div class="input-line-2 col-12"></div>`);
                        line2.append('<div class="col-4 d-flex text-start">V = </div>');
                        if(mutable)
                            line2.append(`<input type="number" min="0" class="input3 col-6 bg-light border border-secondary" title="Initial voltage for transient simulation" placeholder="${cp.properties.initialValue.value}">`);
                        box2 = $(`<input type="checkbox" class="box2 col-1 ms-auto">`);
                        box2.prop('checked', cp.properties.initialValue.visible == '1');
                        line2.append(box2);

                        line3 = $(`<div class="input-line-3 col-12"></div>`);
                        line3.append('<div class="col-4 d-flex text-start">Symbol = </div>');
                        if(mutable){
                            select = $(`<select class="input4 col-6" placeholder="${cp.symbol.reference}">`);
                            select.append($(`<option value="neutral">neutral</option>`));
                            select.append($(`<option value="polar">polar</option>`));
                            line3.append(select);
                            select.val(cp.symbol.reference);
                        }
                        box3 = $(`<input type="checkbox" class="box3 col-1 ms-auto">`);
                        box3.prop('checked', cp.symbol.visible == '1');
                        line3.append(box3);
 
                        content.append(line1).append(line2).append(line3);

                        okButton.click(function(){
                            if(mutable){
                                if(drawing.find($('.input1')).val())
                                    cp.value.value = drawing.find($('.input1')).val();
                                if(drawing.find($('.input2')).val())
                                    cp.value.unit = drawing.find($('.input2')).val();
                                if(drawing.find($('.input3')).val())
                                    cp.properties.initialValue.value = drawing.find($('.input3')).val();
                                if(drawing.find($('.input4')).val())
                                    cp.symbol.reference = drawing.find($('.input4')).val();
                            }
                            if(drawing.find($('.box1')).is(':checked'))
                                cp.value.visible = '1';
                            else cp.value.visible = '0';
                            if(drawing.find($('.box2')).is(':checked'))
                                cp.properties.initialValue.visible = '1';
                            else cp.properties.initialValue.visible = '0';
                            if(drawing.find($('.box3')).is(':checked'))
                                cp.symbol.visible = '1';
                            else cp.symbol.visible = '0';
                            
                            drawLabel(drawing.find($('.label-'+cp.id)), cp);
                            drawing.find($('.menu')).remove();

                            if(mutable){
                                if(cp.symbol.reference == 'neutral')
                                    drawing.find($('.'+cp.id+' > .cp-symbol')).removeClass('polar').addClass('neutral');
                                else 
                                    drawing.find($('.'+cp.id+' > .cp-symbol')).removeClass('neutral').addClass('polar');

                                try{updateOutput({data: {tree: JSON.stringify(schematic)}}, makeNetlist(schematic));}
                                catch(e){console.log(e);}
                            }
                            });
                        break;
                    case 'L':
                        line1 = $(`<div class="input-line-1 col-12"></div>`);
                        line1.append('<div class="col-4 d-flex text-start">L = </div>');
                        if(mutable){
                            line1.append(`<input type="number" min="0" class="input1 col-3 bg-light border border-secondary" title="Inductance in Henry" placeholder="${cp.value.value}">`);
                        
                            select = $(`<select class="input2 col-3">`);
                            select.append($(`<option value="TH">TH</option>`));
                            select.append($(`<option value="GH">GH</option>`));
                            select.append($(`<option value="MH">MH</option>`));
                            select.append($(`<option value="kH">kH</option>`));
                            select.append($(`<option value="H">H</option>`));
                            select.append($(`<option value="mH">mH</option>`));
                            select.append($(`<option value="uH">&#181;H</option>`));
                            select.append($(`<option value="nH">nH</option>`));
                            select.append($(`<option value="pH">pH</option>`));
                            line1.append(select);
                            select.val(cp.value.unit);
                        }
                        
                        box1 = $(`<input type="checkbox" class="box1 col-1 ms-auto">`);
                        box1.prop('checked', cp.value.visible == '1');
                        line1.append(box1);

                        line2 = $(`<div class="input-line-2 col-12"></div>`);
                        line2.append('<div class="col-4 d-flex text-start">I = </div>');
                        if(mutable)
                            line2.append(`<input type="number" min="0" class="input3 col-6 bg-light border border-secondary" title="Initial current for transient simulation" placeholder="${cp.properties.initialValue.value}">`);
                        box2 = $(`<input type="checkbox" class="box2 col-1 ms-auto">`);
                        box2.prop('checked', cp.properties.initialValue.visible == '1');
                        line2.append(box2);
                        
                        content.append(line1).append(line2);

                        okButton.click(function(){
                            if(mutable){
                                if(drawing.find($('.input1')).val())
                                    cp.value.value = drawing.find($('.input1')).val();
                                if(drawing.find($('.input2')).val())
                                    cp.value.unit = drawing.find($('.input2')).val();
                                if(drawing.find($('.input3')).val())
                                    cp.properties.initialValue.value = drawing.find($('.input3')).val();
                            }
                            if(drawing.find($('.box1')).is(':checked'))
                                cp.value.visible = '1';
                            else cp.value.visible = '0';
                            if(drawing.find($('.box2')).is(':checked'))
                                cp.properties.initialValue.visible = '1';
                            else cp.properties.initialValue.visible = '0';
                            
                            drawLabel(drawing.find($('.label-'+cp.id)), cp);
                            drawing.find($('.menu')).remove();
                            if(mutable){
                                try{updateOutput({data: {tree: JSON.stringify(schematic)}}, makeNetlist(schematic));}
                                catch(e){console.log(e);}
                            }
                        });
                        break;
                    case 'Vdc':
                        line1 = $(`<div class="input-line-1 col-12"></div>`);
                        line1.append('<div class="col-4 d-flex text-start">U = </div>');
                        if(mutable){
                            line1.append(`<input type="number" min="0" class="input1 col-3 bg-light border border-secondary" title="Voltage in Volts" placeholder="${cp.value.value}">`);
                        
                            select = $(`<select class="input2 col-3">`);
                            select.append($(`<option value="TV">TV</option>`));
                            select.append($(`<option value="GV">GV</option>`));
                            select.append($(`<option value="MV">MV</option>`));
                            select.append($(`<option value="kV">kV</option>`));
                            select.append($(`<option value="V">V</option>`));
                            select.append($(`<option value="mV">mV</option>`));
                            select.append($(`<option value="uV">&#181;V</option>`));
                            select.append($(`<option value="nV">nV</option>`));
                            select.append($(`<option value="pV">pV</option>`));
                            line1.append(select);
                            select.val(cp.value.unit);
                        }

                        box1 = $(`<input type="checkbox" class="box1 col-1 ms-auto">`);
                        box1.prop('checked', cp.value.visible == '1');
                        line1.append(box1);

                        line2 = $(`<div class="input-line-2 col-12"></div>`);
                        line2.append('<div class="col-4 d-flex text-start">Ri = </div>');
                        if(mutable){
                            line2.append(`<input type="number" min="0" class="input3 col-3 bg-light border border-secondary" title="Internal Resistance" placeholder="${cp.properties.impedance.value}">`);
                        
                            select = $(`<select class="input4 col-3">`);
                            select.append($(`<option value="TOhm">T&#8486;</option>`));
                            select.append($(`<option value="GOhm">G&#8486;</option>`));
                            select.append($(`<option value="MOhm">M&#8486;</option>`));
                            select.append($(`<option value="kOhm">k&#8486;</option>`));
                            select.append($(`<option value="Ohm">&#8486;</option>`));
                            select.append($(`<option value="mOhm">m&#8486;</option>`));
                            select.append($(`<option value="uOhm">&#181;&#8486;</option>`));
                            select.append($(`<option value="nOhm">n&#8486;</option>`));
                            select.append($(`<option value="pOhm">p&#8486;</option>`));
                            line2.append(select);
                            select.val(cp.properties.impedance.unit);
                        }

                        box2 = $(`<input type="checkbox" class="box2 col-1 ms-auto">`);
                        box2.prop('checked', cp.properties.impedance.visible == '1');
                        line2.append(box2);
                        
                        content.append(line1).append(line2);

                        okButton.click(function(){
                            if(mutable){
                            if(drawing.find($('.input1')).val())
                                cp.value.value = drawing.find($('.input1')).val();
                            if(drawing.find($('.input2')).val())
                                cp.value.unit = drawing.find($('.input2')).val();
                            if(drawing.find($('.input3')).val())
                                cp.properties.impedance.value = drawing.find($('.input3')).val();
                            if(drawing.find($('.input4')).val())
                                cp.properties.impedance.unit = drawing.find($('.input4')).val();
                            }
                            if(drawing.find($('.box1')).is(':checked'))
                                cp.value.visible = '1';
                            else cp.value.visible = '0';
                            if(drawing.find($('.box2')).is(':checked'))
                                cp.properties.impedance.visible = '1';
                            else cp.properties.impedance.visible = '0';

                            drawLabel(drawing.find($('.label-'+cp.id)), cp);
                            drawing.find($('.menu')).remove();
                            if(mutable){
                                try{updateOutput({data: {tree: JSON.stringify(schematic)}}, makeNetlist(schematic));}
                                catch(e){console.log(e);}
                            }
                            });
                        break;
                    case 'Idc':
                        line1 = $(`<div class="input-line-1 col-12"></div>`);
                        line1.append('<div class="col-4 d-flex text-start">I = </div>');
                        if(mutable){
                            line1.append(`<input type="number" min="0" class="input1 col-3 bg-light border border-secondary" title="Current in Ampere" placeholder="${cp.value.value}">`);
                        
                            select = $(`<select class="input2 col-3">`);
                            select.append($(`<option value="TA">TA</option>`));
                            select.append($(`<option value="GA">GA</option>`));
                            select.append($(`<option value="MA">MA</option>`));
                            select.append($(`<option value="kA">kA</option>`));
                            select.append($(`<option value="A">A</option>`));
                            select.append($(`<option value="mA">mA</option>`));
                            select.append($(`<option value="uA">&#181;A</option>`));
                            select.append($(`<option value="nA">nA</option>`));
                            select.append($(`<option value="pA">pA</option>`));
                            line1.append(select);
                            select.val(cp.value.unit);
                        }
                        box1 = $(`<input type="checkbox" class="box1 col-1 ms-auto">`);
                        box1.prop('checked', cp.value.visible == '1');
                        line1.append(box1);

                        line2 = $(`<div class="input-line-2 col-12"></div>`);
                        line2.append('<div class="col-4 d-flex text-start">Ri = </div>');
                        if(mutable){
                            line2.append(`<input type="number" min="0" class="input3 col-3 bg-light border border-secondary" title="Internal Resistance" placeholder="${cp.properties.impedance.value}">`);
                            
                            select = $(`<select class="input4 col-3">`);
                            select.append($(`<option value="TOhm">T&#8486;</option>`));
                            select.append($(`<option value="GOhm">G&#8486;</option>`));
                            select.append($(`<option value="MOhm">M&#8486;</option>`));
                            select.append($(`<option value="kOhm">k&#8486;</option>`));
                            select.append($(`<option value="Ohm">&#8486;</option>`));
                            select.append($(`<option value="mOhm">m&#8486;</option>`));
                            select.append($(`<option value="uOhm">&#181;&#8486;</option>`));
                            select.append($(`<option value="nOhm">n&#8486;</option>`));
                            select.append($(`<option value="pOhm">p&#8486;</option>`));
                            line2.append(select);
                            select.val(cp.properties.impedance.unit);
                        }
                        box2 = $(`<input type="checkbox" class="box2 col-1 ms-auto">`);
                        box2.prop('checked', cp.properties.impedance.visible == '1');
                        line2.append(box2);

                        content.append(line1).append(line2);

                        okButton.click(function(){
                            if(mutable){
                                if(drawing.find($('.input1')).val())
                                    cp.value.value = drawing.find($('.input1')).val();
                                if(drawing.find($('.input2')).val())
                                    cp.value.unit = drawing.find($('.input2')).val();
                                if(drawing.find($('.input3')).val())  
                                    cp.properties.impedance.value = drawing.find($('.input3')).val();
                                if(drawing.find($('.input4')).val())  
                                    cp.properties.impedance.unit = drawing.find($('.input4')).val();
                            }
                            if(drawing.find($('.box1')).is(':checked'))
                                cp.value.visible = '1';
                            else cp.value.visible = '0';
                            if(drawing.find($('.box2')).is(':checked'))
                                cp.properties.impedance.visible = '1';
                            else cp.properties.impedance.visible = '0';

                            drawLabel(drawing.find($('.label-'+cp.id)), cp);
                            drawing.find($('.menu')).remove();
                            if(mutable){
                                try{updateOutput({data: {tree: JSON.stringify(schematic)}}, makeNetlist(schematic));}
                                catch(e){console.log(e);}
                            }
                            });
                        break;
                    case 'Vac':
                        line1 = $(`<div class="input-line-1 col-12"></div>`);
                        line1.append('<div class="col-4 d-flex text-start">U = </div>');
                        if(mutable){
                            line1.append(`<input type="number" min="0" class="input1 col-3 bg-light border border-secondary" title="Peak voltage in Volts" placeholder="${cp.value.value}">`);
                            
                            select = $(`<select class="input2 col-3">`);
                            select.append($(`<option value="TV">TV</option>`));
                            select.append($(`<option value="GV">GV</option>`));
                            select.append($(`<option value="MV">MV</option>`));
                            select.append($(`<option value="kV">kV</option>`));
                            select.append($(`<option value="V">V</option>`));
                            select.append($(`<option value="mV">mV</option>`));
                            select.append($(`<option value="uV">&#181;V</option>`));
                            select.append($(`<option value="nV">nV</option>`));
                            select.append($(`<option value="pV">pV</option>`));
                            line1.append(select);
                            select.val(cp.value.unit);
                        }
                        box1 = $(`<input type="checkbox" class="box1 col-1 ms-auto">`);
                        box1.prop('checked', cp.value.visible == '1');
                        line1.append(box1);

                        line2 = $(`<div class="input-line-2 col-12"></div>`);
                        line2.append('<div class="col-4 d-flex text-start">f = </div>');
                        if(mutable){
                            line2.append(`<input type="number" min="0" class="input3 col-3 bg-light border border-secondary" title="Frequency in Hertz" placeholder="${cp.frequency.value}">`);
                            
                            select = $(`<select class="input4 col-3">`);
                            select.append($(`<option value="THz">THz</option>`));
                            select.append($(`<option value="GHz">GHz</option>`));
                            select.append($(`<option value="MHz">MHz</option>`));
                            select.append($(`<option value="kHz">kHz</option>`));
                            select.append($(`<option value="Hz">Hz</option>`));
                            select.append($(`<option value="mHz">mHz</option>`));
                            select.append($(`<option value="uHz">&#181;Hz</option>`));
                            select.append($(`<option value="nHz">nHz</option>`));
                            select.append($(`<option value="pHz">pHz</option>`));
                            line2.append(select);
                            select.val(cp.frequency.unit);
                        }
                        
                        box2 = $(`<input type="checkbox" class="box2 col-1 ms-auto">`);
                        box2.prop('checked', cp.frequency.visible == '1');
                        line2.append(box2);

                        line3 = $(`<div class="input-line-3 col-12"></div>`);
                        line3.append('<div class="col-4 d-flex text-start">Phase = </div>');
                        if(mutable)
                            line3.append(`<input type="number" min="0" class="input5 col-6 bg-light border border-secondary" title="Initial phase in degrees" placeholder="${cp.phase.value}">`);
                        box3 = $(`<input type="checkbox" class="box3 col-1 ms-auto">`);
                        box3.prop('checked', cp.phase.visible == '1');
                        line3.append(box3);

                        line4 = $(`<div class="input-line-4 col-12"></div>`);
                        line4.append('<div class="col-4 d-flex text-start">Theta = </div>');
                        if(mutable)
                            line4.append(`<input type="number" min="0" class="input6 col-6 bg-light border border-secondary" title="Damping factor" placeholder="${cp.properties.damping.value}">`);
                        box4 = $(`<input type="checkbox" class="box4 col-1 ms-auto">`);
                        box4.prop('checked', cp.properties.damping.visible == '1');
                        line4.append(box4);

                        line5 = $(`<div class="input-line-5 col-12"></div>`);
                        line5.append('<div class="col-4 d-flex text-start">Ri = </div>');
                        if(mutable){
                            line5.append(`<input type="number" min="0" class="input7 col-3 bg-light border border-secondary" title="Internal Resistance" placeholder="${cp.properties.impedance.value}">`);
                            
                            select = $(`<select class="input8 col-3">`);
                            select.append($(`<option value="TOhm">T&#8486;</option>`));
                            select.append($(`<option value="GOhm">G&#8486;</option>`));
                            select.append($(`<option value="MOhm">M&#8486;</option>`));
                            select.append($(`<option value="kOhm">k&#8486;</option>`));
                            select.append($(`<option value="Ohm">&#8486;</option>`));
                            select.append($(`<option value="mOhm">m&#8486;</option>`));
                            select.append($(`<option value="uOhm">&#181;&#8486;</option>`));
                            select.append($(`<option value="nOhm">n&#8486;</option>`));
                            select.append($(`<option value="pOhm">p&#8486;</option>`));
                            line5.append(select);
                            select.val(cp.properties.impedance.unit);
                        }
                        box5 = $(`<input type="checkbox" class="box5 col-1 ms-auto">`);
                        box5.prop('checked', cp.properties.impedance.visible == '1');
                        line5.append(box5);

                        content.append(line1).append(line2).append(line3).append(line4).append(line5);
                    
                        okButton.click(function(){
                            if(mutable){
                                if(drawing.find($('.input1')).val())
                                    cp.value.value = drawing.find($('.input1')).val();
                                if(drawing.find($('.input2')).val())
                                    cp.value.unit = drawing.find($('.input2')).val();
                                if(drawing.find($('.input3')).val())
                                    cp.frequency.value = drawing.find($('.input3')).val();
                                if(drawing.find($('.input4')).val())
                                    cp.frequency.unit = drawing.find($('.input4')).val();
                                if(drawing.find($('.input5')).val())
                                    cp.phase.value = drawing.find($('.input5')).val();
                                if(drawing.find($('.input6')).val())
                                    cp.properties.damping.value = drawing.find($('.input6')).val();
                                if(drawing.find($('.input7')).val())
                                    cp.properties.impedance.value = drawing.find($('.input7')).val();
                                if(drawing.find($('.input8')).val())
                                    cp.properties.impedance.unit = drawing.find($('.input8')).val();
                            }
                            if(drawing.find($('.box1')).is(':checked'))
                                cp.value.visible = '1';
                            else cp.value.visible = '0';
                            if(drawing.find($('.box2')).is(':checked'))
                                cp.frequency.visible = '1';
                            else cp.frequency.visible = '0';
                            if(drawing.find($('.box3')).is(':checked'))   
                                cp.phase.visible = '1';
                            else cp.phase.visible = '0';
                            if(drawing.find($('.box4')).is(':checked'))
                                cp.properties.damping.visible = '1';
                            else cp.properties.damping.visible = '0';
                            if(drawing.find($('.box5')).is(':checked'))
                                cp.properties.impedance.visible = '1';
                            else cp.properties.impedance.visible = '0';
                            
                            drawLabel(drawing.find(drawing.find($('.label-'+cp.id))), cp);
                            drawing.find($('.menu')).remove();
                            if(mutable){
                                try{updateOutput({data: {tree: JSON.stringify(schematic)}}, makeNetlist(schematic));}
                                catch(e){console.log(e);}
                            }
                            });
                        break;
                    case 'Iac':
                        line1 = $(`<div class="input-line-1 col-12"></div>`);
                        line1.append('<div class="col-4 d-flex text-start">I = </div>');
                        if(mutable){
                            line1.append(`<input type="number" min="0" class="input1 col-3 bg-light border border-secondary" title="Peak current in Ampere" placeholder="${cp.value.value}">`);
                            
                            select = $(`<select class="input2 col-3">`);
                            select.append($(`<option value="TA">TA</option>`));
                            select.append($(`<option value="GA">GA</option>`));
                            select.append($(`<option value="MA">MA</option>`));
                            select.append($(`<option value="kA">kA</option>`));
                            select.append($(`<option value="A">A</option>`));
                            select.append($(`<option value="mA">mA</option>`));
                            select.append($(`<option value="uA">&#181;A</option>`));
                            select.append($(`<option value="nA">nA</option>`));
                            select.append($(`<option value="pA">pA</option>`));
                            line1.append(select);
                            select.val(cp.value.unit);
                        }

                        box1 = $(`<input type="checkbox" class="box1 col-1 ms-auto">`);
                        box1.prop('checked', cp.value.visible == '1');
                        line1.append(box1);

                        line2 = $(`<div class="input-line-2 col-12"></div>`);
                        line2.append('<div class="col-4 d-flex text-start">f = </div>');
                        if(mutable){
                            line2.append(`<input type="number" min="0" class="input3 col-3 bg-light border border-secondary" title="Frequency in Hertz" placeholder="${cp.frequency.value}">`);
                            
                            select = $(`<select class="input4 col-3">`);
                            select.append($('<option value="THz">THz</option>'));
                            select.append($('<option value="GHz">GHz</option>'));
                            select.append($('<option value="MHz">MHz</option>'));
                            select.append($('<option value="kHz">kHz</option>'));
                            select.append($('<option value="Hz">Hz</option>'));
                            select.append($('<option value="mHz">mHz</option>'));
                            select.append($('<option value="uHz">&#181;Hz</option>'));
                            select.append($('<option value="nHz">nHz</option>'));
                            select.append($('<option value="pHz">pHz</option>'));
                            line2.append(select);
                            select.val(cp.frequency.unit);
                        }
                        box2 = $(`<input type="checkbox" class="box2 col-1 ms-auto">`);
                        box2.prop('checked', cp.frequency.visible == '1');
                        line2.append(box2);

                        line3 = $(`<div class="input-line-3 col-12"></div>`);
                        line3.append('<div class="col-4 d-flex text-start">Phase = </div>');
                        if(mutable)
                            line3.append(`<input type="number" min="0" class="input5 col-6 bg-light border border-secondary" title="Initial phase in degrees" placeholder="${cp.phase.value}">`);
                        box3 = $(`<input type="checkbox" class="box3 col-1 ms-auto">`);
                        box3.prop('checked', cp.phase.visible == '1');
                        line3.append(box3);

                        line4 = $(`<div class="input-line-4 col-12"></div>`);
                        line4.append('<div class="col-4 d-flex text-start">Theta = </div>');
                        if(mutable)
                            line4.append(`<input type="number" min="0" class="input6 col-6 bg-light border border-secondary" title="Damping factor" placeholder="${cp.properties.damping.value}">`);
                        box4 = $(`<input type="checkbox" class="box4 col-1 ms-auto">`);
                        box4.prop('checked', cp.properties.damping.visible == '1');
                        line4.append(box4);

                        line5 = $(`<div class="input-line-5 col-12"></div>`);
                        line5.append('<div class="col-4 d-flex text-start">Ri = </div>');
                        if(mutable){
                            line5.append(`<input type="number" min="0" class="input7 col-3 bg-light border border-secondary" title="Internal Resistance" placeholder="${cp.properties.impedance.value}">`);
                        
                            select = $(`<select class="input8 col-3">`);
                            select.append($(`<option value="TOhm">T&#8486;</option>`));
                            select.append($(`<option value="GOhm">G&#8486;</option>`));
                            select.append($(`<option value="MOhm">M&#8486;</option>`));
                            select.append($(`<option value="kOhm">k&#8486;</option>`));
                            select.append($(`<option value="Ohm">&#8486;</option>`));
                            select.append($(`<option value="mOhm">m&#8486;</option>`));
                            select.append($(`<option value="uOhm">&#181;&#8486;</option>`));
                            select.append($(`<option value="nOhm">n&#8486;</option>`));
                            select.append($(`<option value="pOhm">p&#8486;</option>`));
                            line5.append(select);
                            select.val(cp.properties.impedance.unit);
                        }

                        box5 = $(`<input type="checkbox" class="box5 col-1 ms-auto">`);
                        box5.prop('checked', cp.properties.impedance.visible == '1');
                        line5.append(box5);

                        content.append(line1).append(line2).append(line3).append(line4).append(line5);
                    
                        okButton.click(function(){
                            if(mutable){
                                if(drawing.find($('.input1')).val())
                                    cp.value.value = drawing.find($('.input1')).val();
                                if(drawing.find($('.input2')).val())
                                    cp.value.unit = drawing.find($('.input2')).val();
                                if(drawing.find($('.input3')).val())
                                    cp.frequency.value = drawing.find($('.input3')).val();
                                if(drawing.find($('.input4')).val())
                                    cp.frequency.unit = drawing.find($('.input4')).val();
                                if(drawing.find($('.input5')).val())
                                    cp.phase.value = drawing.find($('.input5')).val();
                                if(drawing.find($('.input6')).val())
                                    cp.properties.damping.value = drawing.find($('.input6')).val();
                                if(drawing.find($('.input7')).val())
                                    cp.properties.impedance.value = drawing.find($('.input7')).val();
                                if(drawing.find($('.input8')).val())
                                    cp.properties.impedance.unit = drawing.find($('.input8')).val();
                            }
                            if(drawing.find(drawing.find($('.box1'))).is(':checked'))
                                cp.value.visible = '1';
                            else cp.value.visible = '0';
                            if(drawing.find($('.box2')).is(':checked'))
                                cp.frequency.visible = '1';
                            else cp.frequency.visible = '0';
                            if(drawing.find($('.box3')).is(':checked'))
                                cp.phase.visible = '1';
                            else cp.phase.visible = '0';
                            if(drawing.find($('.box4')).is(':checked'))
                                cp.properties.damping.visible = '1';
                            else cp.properties.damping.visible = '0';
                            if(drawing.find($('.box5')).is(':checked'))
                                cp.properties.impedance.visible = '1';
                            else cp.properties.impedance.visible = '0';

                            drawLabel(drawing.find($('.label-'+cp.id)), cp);
                            drawing.find($('.menu')).remove();
                            if(mutable){
                                try{updateOutput({data: {tree: JSON.stringify(schematic)}}, makeNetlist(schematic));}
                                catch(e){console.log(e);}
                            }
                            });
                        break;
                    case 'VProbe':
                    case 'IProbe':
                        line1 = $(`<div class="input-line-2 col-12"></div>`);
                        line1.append('<div class="col-4 d-flex text-start">Ri = </div>');
                        if(mutable){
                            line1.append(`<input type="number" min="0" class="input1 col-3 bg-light border border-secondary" title="Internal Resistance" placeholder="${cp.properties.impedance.value}">`);
                            
                            select = $(`<select class="input2 col-3">`);
                            select.append($('<option value="TOhm">T&#8486;</option>'));
                            select.append($('<option value="GOhm">G&#8486;</option>'));
                            select.append($('<option value="MOhm">M&#8486;</option>'));
                            select.append($('<option value="kOhm">k&#8486;</option>'));
                            select.append($('<option value="Ohm">&#8486;</option>'));
                            select.append($('<option value="mOhm">m&#8486;</option>'));
                            select.append($('<option value="uOhm">&#181;&#8486;</option>'));
                            select.append($('<option value="nOhm">n&#8486;</option>'));
                            select.append($(`<option value="pOhm">p&#8486;</option>`));
                            line1.append(select);
                            select.val(cp.properties.impedance.unit);
                        }

                        box1 = $(`<input type="checkbox" class="box1 col-1 ms-auto">`);
                        box1.prop('checked', cp.properties.impedance.visible == '1');
                        line1.append(box1);

                        content.append(line1);
                        okButton.click(function(){
                            if(mutable){
                                if(drawing.find($('.input1')).val())
                                    cp.properties.impedance.value = drawing.find($('.input1')).val();
                                if(drawing.find($('.input2')).val())
                                    cp.properties.impedance.unit = drawing.find($('.input2')).val();
                            }
                            if(drawing.find($('.box1')).is(':checked'))
                                cp.properties.impedance.visible = '1';
                            else cp.properties.impedance.visible = '0';
                                
                            drawLabel(drawing.find($('.label-'+cp.id)), cp);
                            drawing.find($('.menu')).remove();
                            if(mutable){
                                try{updateOutput({data: {tree: JSON.stringify(schematic)}}, makeNetlist(schematic));}
                                catch(e){console.log(e);}
                            }
                            });
                        break;
                }

                // Create the menu
                navbar.append(title).append(closeButton);
                buttons.append(okButton).append(cancelButton);

                menu.append(navbar).append(content).append(buttons);

                drawing.append(menu);
                drawing.find($('.menu')).position({
                    my: "center",
                    at: "center",
                    of: drawing,
                    collision: "fit",
                });
                closeButton.position({
                    my: "right top",
                    at: "right-1px top+1px",
                    of: menu
                });
                content.position({
                    my: "center top",
                    at: "center bottom",
                    of: navbar
                });
                buttons.position({
                    my: "center top",
                    at: "center bottom",
                    of: content
                });
            });
        }
    }});

    schematic.connections.forEach(function(connection){
    connection.wires.forEach(function(wire){
        w = $(`<div class="${wire.id} wire connection-${connection.id}" wire='${wire.wire}'></div>`);
        wireCenterX = (wire.begin.x + wire.end.x)/2;
        wireCenterY = (wire.begin.y + wire.end.y)/2;

        if (wire.begin.x === wire.end.x){
            w.css({
                'width': `${scale*2}px`,
                'height': `${Math.abs(wire.begin.y - wire.end.y)*scale + scale}px`,
            })
        }
        else if (wire.begin.y === wire.end.y){
            w.css({
                'width': `${Math.abs(wire.begin.x - wire.end.x)*scale + scale}px`,
                'height': `${scale*2}px`,
            })
        }
        else {
            return {
                errorFlag: true,
                errorReasonCodes: [5],
                errorData: {wire: wire.id}
            }
        }

        drawing.append(w);
        drawing.find(`.${wire.id}`).position({
            my: 'center',
            at: `left+${(wireCenterX-xLeft)*scale} top+${(wireCenterY-yTop)*scale}`,
            of: drawing,
            collision: 'none'
        });

        // Draw the wire labels
        if(wire.label.text){
            label = $(`<div class="label-${wire.id} wire-label">${wire.label.text}</div>`);
            label.appendTo(w).position({
                my: 'left top',
                at: `left+${(wire.label.position.x-wire.begin.x)*scale} top+${(wire.label.position.y-wire.begin.y)*scale}`,
                of: w,
                collision: 'none'
            })
            if(interactive)
                label.draggable({
                    containment: drawing,
                    drag: function(){
                        container.find($(".label-line-"+ wire.id)).remove();
                        labelPos = $(this).position();
                        wirePos = $(this).parent().position();
                        newX2 = labelPos.left + wirePos.left + xLeft;
                        newY2 = labelPos.top + wirePos.top + yTop +20;
                        drawWireLine(wire, newX2, newY2, xLeft, yTop, scale, container.find('.drawing'));
                    }
                });

            //Snap the label to the edge of the drawing if it is outside
            var labelOffset = label.offset();
            var labelWidth = label.outerWidth();
            var labelHeight = label.outerHeight();

            // Get the drawing's offset and dimensions
            var drawingOffset = drawing.offset();
            var drawingWidth = drawing.outerWidth();
            var drawingHeight = drawing.outerHeight();

            // Check if the label is outside the drawing
            var isOutside = labelOffset.left < drawingOffset.left || 
                            labelOffset.top < drawingOffset.top || 
                            labelOffset.left + labelWidth > drawingOffset.left + drawingWidth || 
                            labelOffset.top + labelHeight > drawingOffset.top + drawingHeight;

            if (isOutside) {
            // Snap the label back to the edge of the drawing
            var left = Math.max(drawingOffset.left, Math.min(labelOffset.left, drawingOffset.left + drawingWidth - labelWidth));
            var top = Math.max(drawingOffset.top, Math.min(labelOffset.top, drawingOffset.top + drawingHeight - labelHeight));
            label.offset({left: left, top: top});
            }
            labelPos = label.position();
            wirePos = label.parent().position();
            x2 = labelPos.left + wirePos.left + xLeft;
            y2 = labelPos.top + wirePos.top + yTop +20;
            drawWireLine(wire, x2, y2, xLeft, yTop, scale, drawing);
        }
    });
    
    });

    // Draw the nodes
    schematic.nodes.forEach(function(node){
        n = $(`<div class="${node.id} node"></div>`);
        drawing.append(n);
        n.position({
            my: 'center',
            at: `left+${(node.position.x-xLeft)*scale} top+${(node.position.y-yTop)*scale}`,
            of: drawing,
            collision: 'none'
        });
    });

    return {
        errorFlag: false,
        errorReasonCodes: []    
    }
}

/**
 * This function draws and populates the label for a component
 * @param {jQuery} label 
 * @param {Component} cp 
 */
function drawLabel(label, cp){
    label.empty();
    label.append($(`<span>${cp.name.value}</span>`));

    // Populate the label with the visible properties
    switch(cp.type){
        case 'R':
            if(cp.value.visible === '1')
                label.append($(`<span>R=${cp.value.value} ${cp.value.unit}</span>`));
            if(cp.properties.temperature.visible === '1')
                label.append($(`<span>Temp=${cp.properties.temperature.value}</span>`));
            if(cp.properties.tc1.visible === '1')
                label.append($(`<span>Tc1=${cp.properties.tc1.value}</span>`));
            if(cp.properties.tc2.visible === '1')
                label.append($(`<span>Tc2=${cp.properties.tc2.value}</span>`));
            if(cp.properties.tnom.visible === '1')
                label.append($(`<span>Tnom=${cp.properties.tnom.value}</span>`));
            if(cp.symbol.visible === '1')
                label.append($(`<span>Symbol=${cp.symbol.reference}</span>`));
            break;
        case 'C':
            if(cp.value.visible === '1')
                label.append($(`<span>C=${cp.value.value} ${cp.value.unit}</span>`));
            if(cp.properties.initialValue.visible === '1')
                label.append($(`<span>V=${cp.properties.initialValue.value}</span>`));
            if(cp.symbol.visible === '1')
                label.append($(`<span>Symbol=${cp.symbol.reference}</span>`));
            break;
        case 'L':
            if(cp.value.visible === '1')
                label.append($(`<span>L=${cp.value.value} ${cp.value.unit}</span>`));
            if(cp.properties.initialValue.visible === '1')
                label.append($(`<span>I=${cp.properties.initialValue.value}</span>`));
            break;
        case 'Vdc':
            if(cp.value.visible === '1')
                label.append($(`<span>U=${cp.value.value} ${cp.value.unit}</span>`));
            if(cp.properties.impedance.visible === '1')
                label.append($(`<span>Ri=${cp.properties.impedance.value} ${cp.properties.impedance.unit}</span>`));
            break;
        case 'Idc':
            if(cp.value.visible === '1')
                label.append($(`<span>I=${cp.value.value} ${cp.value.unit}</span>`));
            if(cp.properties.impedance.visible === '1')
                label.append($(`<span>Ri=${cp.properties.impedance.value} ${cp.properties.impedance.unit}</span>`));
            break;
        case 'Vac':
            if(cp.value.visible === '1')
                label.append($(`<span>U=${cp.value.value} ${cp.value.unit}</span>`));
            if(cp.frequency.visible === '1')
                label.append($(`<span>f=${cp.frequency.value} ${cp.frequency.unit}</span>`));
            if(cp.phase.visible === '1')
                label.append($(`<span>Phase=${cp.phase.value}</span>`));
            if(cp.properties.damping.visible === '1')
                label.append($(`<span>Theta=${cp.properties.damping.value}</span>`));
            if(cp.properties.impedance.visible === '1')
                label.append($(`<span>Ri=${cp.properties.impedance.value} ${cp.properties.impedance.unit}</span>`));
            break;
        case 'Iac':
            if(cp.value.visible === '1')
                label.append($(`<span>I=${cp.value.value} ${cp.value.unit}</span>`));
            if(cp.frequency.visible === '1')
                label.append($(`<span>f=${cp.frequency.value} ${cp.frequency.unit}</span>`));
            if(cp.phase.visible === '1')
                label.append($(`<span>Phase=${cp.phase.value}</span>`));
            if(cp.properties.damping.visible === '1')
                label.append($(`<span>Theta=${cp.properties.damping.value}</span>`));
            if(cp.properties.impedance.visible === '1')
                label.append($(`<span>Ri=${cp.properties.impedance.value} ${cp.properties.impedance.unit}</span>`));
            break;
        case 'VProbe':
        case 'IProbe':
            if(cp.properties.impedance.visible === '1')
                label.append($(`<span>Ri=${cp.properties.impedance.value} ${cp.properties.impedance.unit}</span>`));
            break;
    }

    snapToDrawing(label, label.parent().parent());
}

/**
 * This function snaps the element to the edge of the drawing if it is outside
 * @param {Jquery} element The element to be snapped
 * @param {Jquery} drawing The drawing div
 */
function snapToDrawing(element, drawing){
    //Snap the element to the edge of the drawing if it is outside
    var elementOffset = element.offset();
    var elementWidth = element.outerWidth();
    var elementHeight = element.outerHeight();

    // Get the drawing's offset and dimensions
    var drawingOffset = drawing.offset();
    var drawingWidth = drawing.outerWidth();
    var drawingHeight = drawing.outerHeight();

    // Check if the element is outside the drawing
    var isOutside = elementOffset.left < drawingOffset.left || 
                    elementOffset.top < drawingOffset.top || 
                    elementOffset.left + elementWidth > drawingOffset.left + drawingWidth || 
                    elementOffset.top + elementHeight > drawingOffset.top + drawingHeight;

    if (isOutside) {
    // Snap the element back to the edge of the drawing
    var left = Math.max(drawingOffset.left, Math.min(elementOffset.left, drawingOffset.left + drawingWidth - elementWidth));
    var top = Math.max(drawingOffset.top, Math.min(elementOffset.top, drawingOffset.top + drawingHeight - elementHeight));
    element.offset({left: left, top: top});
    }
}

/**
 * This function draws a line from the wire label to the wire
 * @param {Wire} wire The wire to which the label belongs to
 * @param {number} x2 The x coordinate of the label connection to the line
 * @param {number} y2 The y coordinate of the label connection to the line
 * @param {string} xLeft The x coordinate of the leftmost point of the drawing
 * @param {string} yTop The y coordinate of the topmost point of the drawing
 * @param {number} scale The scale of the drawing
 * @param {div} drawing The drawing div
 */
function drawWireLine(wire, x2, y2, xLeft, yTop, scale, drawing){
    if(wire.begin.x === wire.end.x){    // if Vertical wire
        x1 = wire.begin.x;
        if (wire.begin.y > wire.end.y){
            y1 = wire.begin.y + wire.label.distance;
        }
        else {
            y1 = wire.begin.y + wire.label.distance;
        }
    }
    else {  // if Horizontal wire
        y1 = wire.begin.y;
        if (wire.begin.x > wire.end.x){
            x1 = wire.begin.x + wire.label.distance;
        }
        else {
            x1 = wire.begin.x + wire.label.distance;
        }
    }
    // Calculate the length of the line
    length = Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2))*scale;
    // Calculate the mid point of the line
    midX = (x1+x2)/2;
    midY = (y1+y2)/2;
    // Calculate the angle of the line
    slopeDeg = Math.atan2(y2-y1,x2-x1)*180/Math.PI;
    // Draw the line
    line = $(`<div class="label-line-${wire.id} wire-label-line"></div>`);
    line.appendTo(drawing.find('.'+wire.id));
    line.css({'width': `${length}px`})
    .position({
        my: 'center',
        at: `left+${(midX-xLeft)*scale} top+${(midY-yTop)*scale}`,
        of: drawing,
        collision: 'none'
    }).css({'transform': `rotate(${slopeDeg}deg)`});

        if($('.style-switch input').is(':checked'))
            line.addClass('legacy');
}

/**
 * This function handles the errors returned by the redrawSchematic function
 * @param {Object} err The error object returned by the function
 * @returns {string} The error message to be displayed
 */
function redrawSchematic_handleError(err){
    let codes = err.errorReasonCodes;
    let data = err.errorData;

    let errorstr = '';

    codes.forEach(e => {
        switch(e){
            case 1:
                errorstr += '\tSchematic passed is not a valid schematic object.\n';
                break;
            case 2:
                errorstr += '\tContainer passed is not a valid HTML element.\n';
                break;
            case 3:
                errorstr += '\tValue of ' + data + ' must be a boolean value.\n';
                break;
            case 4:
                errorstr += '\tDrawing onto non-rendered container. Please be sure to call function only when container is rendered.\n';
                break;
            case 5:
                errorstr += '\tWire: ' + data.wire + ' is neither horizontal nor vertical.\n';
                break;
            default:
                errorstr += 'Unknown error.\n';
                break;
        }

    });

    return errorstr;
}