/**
 * This function populates it with the results of the analysis.
 * @param {Schematic} schematic The schematic to be analyzed
 * @param {jQuery} modal The container where to be populated
 */
function populateModal(schematic, modal) {
    // Get sources and probes
    sourceTypes = ['Vdc', 'Vac', 'Idc', 'Iac'];
    vectSources = vectDcVoltPower.concat(vectAcVoltPower, vectDcCurrPower, vectAcCurrPower);
    vectProbes = vectVProbe.concat(vectIProbe);
    methods = ['MTN', 'MCR', 'MCM'];

    // Create the modal
    var dialog = modal.find('.modal-dialog');
    var content = modal.find('.modal-content');

    content.empty();

    // Add toast stack
    var toastStack = $('<div class="toast-container top-0 start-50 translate-middle-x"></div>');

    // Create header
    var header = $('<div class="modal-header"></div>');
    header.append('<h5 class="modal-title">URIsolve Analysis Results</h5>');
    var close = $('<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"><span aria-hidden="true"></span></button>');

    header.append(close);

    // Create body
    var body = $('<div class="modal-body p-0"></div>');

    // Section #1 - Sticky composed of main circuit drawing and contributions table
    mcHeader = $('<div class="section-header">Imagem do circuito</div>');
    mainCircuit = $('<div id="main-circuit" class="drawing-container"></div>');
    ctHeader = $('<div class="section-header">Tabela de resultados</div>');
    table = $('<table class="contributions-table"></table>');
    colapseBtn = $('<button id="main-colapse" class="colapse-btn w-100 d-flex align-items-center" data-bs-toggle="collapse" data-bs-target=".main-section" aria-expanded="true">Dados do circuito</button>');
    colapseBtn.append('<i class="fa-solid fa-chevron-down ms-auto"></i>').click(() => colapseBtn.find('i').toggleClass('fa-chevron-down fa-chevron-up'));

    main = $('<div class="main-section section"></div>');
    main.append(mcHeader).append(mainCircuit).append(ctHeader).append(table);

    // When the collapsible section is shown (i.e. expanded), set aria-expanded to "true"
    main.on('shown.bs.collapse', function () {
        $('button.colapse-btn').attr('aria-expanded', 'false');
    });
  
    // When the collapsible section is hidden (i.e. collapsed), set aria-expanded to "false"
    main.on('hidden.bs.collapse', function () {
        $('button.colapse-btn').attr('aria-expanded', 'true');
    });

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

    //Make sticky
    sticky = $(`<div class="modal-sticky sticky-sm-top colapsable"></div>`);
    sticky.append(main).append(colapseBtn).append(progress);

    // Section #2 - Selection
    selection = $('<div class="modal-section selection-section"></div>');
    selection.append(`<div class="section-header">Sele&ccedil;&atilde;o do m&eacute;todo de resolu&ccedil;&atilde;o</div>`);

    // Add mode selection navbar
    navbar = $('<ul class="nav nav-pills nav-justified"></ul>');
    navbar.append('<li class="nav-item"><a class="nav-link active" data-bs-toggle="pill" href="#passive">Passivo</a></li>');
    navbar.append('<li class="nav-item"><a class="nav-link" data-bs-toggle="pill" href="#interactive">Interativo</a></li>');

    // Add mode selection content
    selContent = $('<div class="tab-content"></div>');
    passive = $('<div id="passive" class="container tab-pane fade in show active"></div>');
    interactive = $('<div id="interactive" class="container tab-pane fade in"></div>');

    // Add passive mode content
    passive.append('<div class="info-howto"><p class="m-0">O modo passivo permite resolver circuitos didaticamente, sem a possibilidade de selecionar a ordem ou m&eacute;todo de resolu&ccedil;&atilde;o dos subcircuitos.</p><p class="m-0">Para utilizar este modo, basta clicar no bot&atilde;o "Calcular", circuito ser&aacute; resolvido automaticamente utilizando o M&eacute;todo da Tens&atilde;o nos N&oacute;s. Este modo &eacute; ideal para quem procura uma solu&ccedil;&atilde;o r&aacute;pida, sem precisar de ajustar par&acirc;metros de resolu&ccedil;&atilde;o.</p></div>');
    
    // Add interactive mode content
    interactive.append('<div class="info-howto"><p class="m-0">O modo interativo permite selecionar a ordem e m&eacute;todo de resolu&ccedil;&atilde;o para cada fonte do circuito.</p><p class="m-0">Para utilizar este modo:</p><ol>  <li>Selecione as fontes na imagem do circuito, presente nos dados do circuito, para as adicionar/remover &agrave; ordem de resolu&ccedil;&atilde;o que estar&aacute; presente abaixo</li>  <li>Posteriormente &eacute; poss&iacute;vel arrastar elementos na ordem para mais facilmente alterar a ordem</li>  <li>Selecione o m&eacute;todo de resolu&ccedil;&atilde;o de cada sub-circuito individualmente atrav&eacute;s do respectivo menu suspenso.</li>  <li>Quando estiver satisfeito com a ordem e os m&eacute;todos selecionados, pressione o bot&atilde;o "Calcular" para obter os resultados.</li></ol><p class="m-0">O modo interativo permite uma maior personaliza&ccedil;&atilde;o na resolu&ccedil;&atilde;o do circuito, permitindo a sele&ccedil;&atilde;o da ordem e m&eacute;todo de resolu&ccedil;&atilde;o mais adequados para cada fonte.</p></div>');
    selectionCards = $('<ul class="selection-cards"></ul>');
    interactive.append(selectionCards);
    selection.sortable({
        connectWith: ".selection-cards",
        items: ".card",
        helper: "clone",
        tolerance: "touch",
        handle: '.card-title',
        cancelable: true,
      });

    // Add content to navbar
    selContent.append(passive).append(interactive);

    // Add calculate button
    calcBtn = $('<button class="btn btn-primary calc-btn">Calcular</button>');
    calcBtn.click(function() {
        if($('#passive').hasClass('active')) {
            // Passive mode
            resolutionOrder = vectSources.map(s => [s, methods[0]]);
        } else {
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
            // interactive mode
            resolutionOrder = [];

            // Get order
            $('.selection-cards .card').each(function() {
                source = $(this).find('.card-title').text();
                method = $(this).find('select').val();
                source = vectSources.find(s => s.name.value == source);
                resolutionOrder.push([source, method]);
            });

        }
        // Calculate
        calculateTSP(schematic, modal, resolutionOrder);
        // Update table
    });

    calcBtnContainer = $('<div class="calc-btn-container text-center"></div>');
    calcBtnContainer.append(calcBtn);

    // Add navbar and content to selection section
    selection.append(navbar).append(selContent).append(calcBtnContainer);

    body.append(sticky).append(selection);

    // Create footer
    var footer = $('<div class="modal-footer"></div>');

    // Create close button
    var backBtn = $('<button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><< Voltar</button>');

    // Add close button to footer
    footer.append(backBtn);

    // Build modal
    content.append(header).append(body).append(footer);
    dialog.append(content);
    // Add modal to page
    modal.append(dialog).append(toastStack);

    // Add main circuit drawing
    redrawSchematic(schematic, mainCircuit);

    // Add source selection cards
    navbar.find('a[data-bs-toggle="pill"]').click(function() {
        if($(this).attr('href') == '#interactive') {
            // Interactive mode
            $('.selection-cards').empty();

            vectSources.forEach(cp => {
                cpDiv = $('#main-circuit').find('.'+cp.id);
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
                        interactive.find('.selection-cards').append(card);
                    }
                    $(this).toggleClass('order-selected');
                    $(this).toggleClass('order-selectable');
                });
            });
        } else {
            // Passive mode
            vectSources.forEach(cp => {
                cpDiv = $('#main-circuit').find('.'+cp.id);
                cpDiv.removeClass('order-selectable');
                cpDiv.removeClass('order-selected');
                cpDiv.off('click');
            });
        }
    });

    // Collapse the main section (must be done after adding the main circuit drawing)
    main.addClass('collapse');

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