function outHTMLResolutionNavTSP(){
    var htmlstr = "";

    // Add nav tabs
    htmlstr += '<div class="container mt-3 sticky-top" style="background-color: #fff;">'
    htmlstr += '<ul id="results-tabs" class="nav nav-pills nav-justified border border-secondary rounded">';
    htmlstr += '<li class="nav-item"><a class="nav-link active" data-bs-toggle="pill" href="#main-tab">'
    htmlstr += '<h5 data-translate="_mainTab"></h5></a></li>';
    htmlstr += '</ul></div>';

    // Add tab content
    htmlstr += '<div id="pages-content" class="tab-content">';
    // Add main tab content
    htmlstr += '<div id="main-tab" class="container tab-pane fade in show active"></div>';

    return htmlstr;
}

function outHTMLResolutionTabsTSP(order){
    var htmlstr = "";

    // Add nav tabs
    order.forEach(o => {
        source = o[0];
        method = o[1];
        htmlstr += `<li class="nav-item resolution-item"><a class="nav-link" data-bs-toggle="pill" href="#resolution-${source.name.value}">`;
        htmlstr += `<h5>${source.name.value}</h5></a></li>`;
    });
    // Add results tab
    htmlstr += '<li class="nav-item resolution-item"><a class="nav-link" data-bs-toggle="pill" href="#results-tab">'
    htmlstr += '<h5 data-translate="_resultsTab"></h5></a></li>';

    return htmlstr;
}

function outHTMLResolutionTabsContentTSP(order){
    var htmlstr = "";

    // Add results tab content
    order.forEach(o => {
        source = o[0];
        method = o[1];

        htmlstr += `<div id="resolution-${source.name.value}" class="container tab-pane fade in resolution-pages-content"></div>`;
    });

    htmlstr += '<div id="results-tab" class="container tab-pane fade in resolution-pages-content"></div>';

    return htmlstr;
}

function outHTMLSectionsTSP(){
    var htmlstr = "";
    
    // errors section
    htmlstr += '<div id="errors"></div>'
    // warnings section
    htmlstr += '<div id="warnings"></div>'
    // circuit image
    htmlstr += '<div id="circuitImage">';
    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_circuitImage"></h5></div></div>';
    htmlstr += '<div class="circuit-widget container mt-3 text-center p-0"></div></div>';
    // selection section
    htmlstr += '<div id="selection">';
    htmlstr += '<div class="container mt-3">';
    htmlstr += '<div class="row bg-dark rounded text-light p-2"><h5 class="ml-3" data-translate="_selectionTitle"></h5></div></div>';
    htmlstr += '<div id="selection-body" class="container mt-3"></div></div>';

    return htmlstr;
}

function outHTMLSelectionTSP(){
    var htmlstr = "";

    // Add nav tabs
    htmlstr += '<ul class="nav nav-pills nav-justified">';
    htmlstr += '<li class="nav-item"><a class="nav-link active" data-bs-toggle="pill" href="#passive" data-translate="_passiveTab"></a></li>';
    htmlstr += '<li class="nav-item"><a class="nav-link" data-bs-toggle="pill" href="#interactive" data-translate="_interactiveTab"></a></li></ul>';
    // Add tab content
    htmlstr += '<div class="tab-content">';
    // Add passive tab
    htmlstr += '<div id="passive" class="container tab-pane fade in show active">';
    htmlstr += '<div class="info-howto mt-3">';
    htmlstr += '<p class="m-0" data-translate="_passiveInfo1" style="text-indent: 10px;"></p>';
    htmlstr += '<p class="m-0" data-translate="_passiveInfo2" style="text-indent: 10px;"></p></div></div>';
    // Add interactive tab
    htmlstr += '<div id="interactive" class="container tab-pane fade in">';
    htmlstr += '<div class="info-howto mt-3">';
    htmlstr += '<p class="m-0" data-translate="_interactiveInfo1" style="text-indent: 10px;"></p>';
    htmlstr += '<p class="m-0" data-translate="_interactiveInfo2" style="text-indent: 10px;"></p>';
    htmlstr += '<ul class="m-0"> <li data-translate="_interactiveStep1" style="text-indent: 20px;"></li>';
    htmlstr += '<li data-translate="_interactiveStep2" style="text-indent: 20px;"></li>';
    htmlstr += '<li data-translate="_interactiveStep3" style="text-indent: 20px;"></li>';
    htmlstr += '<li data-translate="_interactiveStep4" style="text-indent: 20px;"></li></ul>';
    htmlstr += '<p class="m-0" data-translate="_interactiveInfo3" style="text-indent: 10px;"></p></div>';
    htmlstr += '<ul class="selection-cards"></ul></div></div>';
    htmlstr += '<div class="container mt-3 text-center">';
    htmlstr += '<button id="calc-btn" class="btn btn-primary"><p class="m-0" data-translate="_btn_calcTSP"></button></div>';

    return htmlstr;
}

    


/**
 * This function populates it with the results of the analysis.
 * @param {Schematic} schematic The schematic to be analyzed
 * @param {jQuery} modal The container where to be populated
 */
function populateModal(schematic, modal) {

    // Add toast stack
    var toastStack = $('<div class="toast-container top-0 start-50 translate-middle-x"></div>');


    // Section #1 - Sticky composed of main circuit drawing and contributions table

    ctHeader = $('<div class="section-header">Tabela de resultados</div>');
    table = $('<table class="contributions-table"></table>');

    // Build results table
    tableHeader = $('<thead><tr></tr></thead>');
    tableHeader.find('tr').append('<th colspan="2">Grandeza \\ Fonte</th>');

    // Add source columns
    vectSources.map(cp => tableHeader.find('tr').append(`<th>${cp.name.value}</th>`));

    tableBody = $('<tbody></tbody>');   
    // Add probe rows
    vectProbes.forEach(p => {
        row1 = $('<tr></tr>');
        row2 = $('<tr></tr>');
        row1.append(`<th rowspan='2'>${p.name.value}</th>`);
        row1.append(`<th>Sentido</th>`);
        row2.append(`<th>Valor</th>`);
        vectSources.map(cp => row1.append(`<td></td>`));
        vectSources.map(cp => row2.append(`<td></td>`));
        tableBody.append(row1).append(row2);
    });

    table.append(tableHeader).append(tableBody);

    // Add progress bar
    progress = $('<div class="progress my-2"></div>');
    progress.append('<div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>');

    // Update progress bar on each step
    progress.on('updateProgress', function (e, data) {
        var progress = $(this).find('.progress-bar');
        progress.css('width', data.progress + '%');
        progress.attr('aria-valuenow', data.progress);
        
        if (data.progress == 100) {
            progress.removeClass('progress-bar-animated').removeClass('progress-bar-striped').addClass('bg-success');
        }
    });

    // Put the progress at 0%
    progress.trigger('updateProgress', {progress: 0});


    // Add calculate button
    calcBtn.click(function() {

            if (selectionCards.find('.card').length != vectSources.length) {
                // Show toast
                var toast = $('<div class="toast" role="alert" aria-live="assertive" aria-atomic="true"></div>');
                var toastContent = $('<div class="d-flex"></div>');
                var toastBody = $('<div class="toast-body">Por favor, selecione todas as fontes.</div>');
                var toastClose = $('<button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>');
                
                toastContent.append(toastBody).append(toastClose).appendTo(toast);
                toastStack.append(toast);
              
                // Check if maximum number of toasts is reached
                if (toastStack.find('.toast').length >= 5) {
                    // Remove the oldest toast from the DOM and the activeToasts array
                    var oldestToast = toastStack.find('.toast:first');
                    oldestToast.remove();
                }

                var bsToast = new bootstrap.Toast(toast[0]);
                bsToast.show();
              
                return;
            }  


    });



    // Add scroll listener to modal
    modal.scroll(() => {
        var scrollBot = $(window).scrollTop() + modal.outerHeight();

        $('.resolution-section').each(function() {
            if($(this).find('.show').length) {
                footer = $(this).find($('.section-footer')).eq(0);
                var divTop = footer.offset().top;
                var divBottom = divTop + footer.height();

                if (divTop <= scrollBot && scrollBot < divBottom) {
                    // Get this source's cells on the results table
                    source = vectSources.find(s => s.name.value == $(this).find('.section-header').text().match(/de (.*)/)[1]);
                    tableBody.find('tr').each(function() {
                        cells = $(this).find('td');
                        // Populate with the source's name as a placeholder
                        cells.eq(vectSources.indexOf(source)).text(source.name.value);
                    });

                    $(this).addClass('solved');

                    // Update the progress bar
                    progress.trigger('updateProgress', {progress: ($(this).siblings('.solved').length + 1) / vectSources.length *100});
                }
            }
        });
    });
}

/**
 * This function handles the generation of the resolution order and the calculation of the results
 * @param {Schematic} schematic The main circuit schematic
 * @param {jQuery} modal The modal to be updated
 * @param {Array<Component, string>} order The tuple containing all sources and their respective resolution methods in the order they should be resolved
 */
function calculateTSP(schematic, modal, order){
    body = modal.find('.modal-body');

    order.forEach(o => {
        cp = o[0];
        method = o[1];
        generateSection = false;

        if(body.find(`#${cp.name.value}-section-body`).length == 0) {
            // There are no sections in the modal
            section = $(`<div class="modal-section resolution-section"></div>`);
            section.appendTo(body);
            generateSection = true;
        }
        else {
            // There are sections in the modal
            section = body.find(`#${cp.name.value}-section-body`).parent();
            // See if the section is at the same position and has the same method
            if(section.index() -2 != order.indexOf(o) ||
                section.find('.subsection-header').eq(1).text() != `Resolução por ${method}`) {
                // The section is not at the same position
                // Remove it and add it again at the correct position
                section.remove();
                section = $(`<div class="modal-section resolution-section"></div>`);
                section.insertAfter(body.find('.resolution-section').eq(order.indexOf(o)-1));
                generateSection = true;
            }
        }    

        if(generateSection) {
            // Colapse button/Section header
            sectionHeader = $(`<button class="section-header d-flex align-items-center" data-bs-toggle="collapse" data-bs-target="#${cp.name.value}-section-body" aria-expanded="false">Contribui&ccedil;&atilde;o de ${cp.name.value}</button>`)
            // Add colapse icon
            sectionHeader.append('<i class="fa-solid fa-plus ms-auto float-right"></i>');
            section.append(sectionHeader);
            
            // Section body - circuit image and resolution
            sectionBody = $(`<div id="${cp.name.value}-section-body" class="section-body"></div>`);
            sectionBody.append(`<div class="subsection-header">Imagem do subcircuito</div>`);
            drawingContainer = $(`<div class="drawing-container"></div>`);
            drawingContainer.appendTo(sectionBody);
            sectionBody.append(`<div class="subsection-header">Resolu&ccedil;&atilde;o por ${method}</div>`);

            // Section footer - results
            sectionFooter = $(`<div class="section-footer"></div>`);
            sectionFooter.append(`<div class="subsection-header">Resultados:</div>`);

            section.append(sectionBody).append(sectionFooter);

            // Update colapse icon
            sectionBody.on('shown.bs.collapse', function() {
                $(this).siblings('.section-header').find('i').removeClass('fa-plus').addClass('fa-minus');
            });
            
            sectionBody.on('hidden.bs.collapse', function() {
                $(this).siblings('.section-header').find('i').removeClass('fa-minus').addClass('fa-plus');
            });

            subcircuit = makeSubcircuit(schematic, cp.id).data.object;

            redrawSchematic(subcircuit, drawingContainer);

            // Calculate contribution
            // |PLACEHOLDER| Output the netlist in the place of the resolution for debugging
            netlist = makeNetlist(subcircuit)

            // Add the netlist to the download button
            var downloadButton = $('<a id="download" style="display: none; border: 1px solid black; margin: 3px; padding:2px">Click to Download<br></a>');

            downloadButton.click(function(){
                const blob = new Blob([netlist.data], {type: 'text/plain'});
                url = URL.createObjectURL(blob);
                downloadButton.attr('href', url);
                downloadButton.attr('download', 'netlist.txt');
            });

            downloadButton.show();

            sectionBody.append(downloadButton).append("<pre style='text-align:left'>" + netlist.data.replace(/\n/g, "<br />") + "</pre>");

            // Colapse the section
            sectionBody.addClass('collapse');
        }
    });
}