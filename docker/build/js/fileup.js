function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
};

function cleanFileHtmlOutput(){
    var imgThumb = $("#image-holder");
    var filesListOut = $("#list");
    var filesDetailsOut = $("#files-details");
    var filesDet = $("#files-img-det");
    imgThumb.empty();
    filesListOut.empty();
    filesDetailsOut.empty();
    filesDet.hide();
    while (fileContents.length > 0) {
        fileContents.pop();
    }
};

function handleFileSelect (e) {
    e.stopPropagation();
    e.preventDefault();
    cleanFileHtmlOutput();
    var image_holder = $("#image-holder");
    var files_det = $("#files-img-det");

    var files = e.target.files;
    var countFiles = $(this)[0].files.length;

    if(countFiles > 2) {
        alert("Please upload a maximum of 2 files.");
        $(this).val('');
        cleanFileHtmlOutput();
        return;
    }

    // Verify if a netlist file was submited
    var hasNetlist = 0;
    var hasImage = 0;

    for (var i = 0, f; f = files[i]; i++) {
        if (f.type.match('image.*')) {
            hasImage++;
        }
        if (f.type.match('text/plain')) {
            hasNetlist++;
        }
    }

    if(hasNetlist > 1) {
        alert("Only 1 Netlist file is allowed.");
        $(this).val('');
        cleanFileHtmlOutput();
        return;
    } else if (hasNetlist < 1) {
        alert("Please provide a Netlist file.");
        $(this).val('');
        cleanFileHtmlOutput();
        return;
    }
    files_det.show();
    document.getElementById('files-details').innerHTML = 'Uploaded Files:';

    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
        //output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ', f.size, ' bytes, last modified: ', f.lastModifiedDate.toLocaleDateString(), '</li>');
        var d = new Date();
        d = new Date(f.lastModified);
        output.push('<li><strong>', escape(f.name), '</strong> <small> (', f.type || 'n/a', ') Modified: ', d.toUTCString(), '</small></li>');
        //output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') </li>');
        document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';

        // Only process image files.
        if (f.type.match('image.*')) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $("<img />", {
                "src": e.target.result,
                "class": "img-thumbnail"
                }).appendTo(image_holder);
                fileContents[0] = e.target.result;
            }
            image_holder.show();
            reader.readAsDataURL($(this)[0].files[i]);
            hasImage = true;
        }

        if (f.type.match('text/plain')) {
            var reader = new FileReader();
            reader.onload = function(e) {
                //alert(e.target.result);
                fileContents[1] = e.target.result;
            };
            reader.readAsText(files[i]);
            hasNetlist++;
            //$("#input-form")[0].reset();
            
        }
    }
    console.log(fileContents);
};



function localHandleFileSelect (ID) {

    cleanFileHtmlOutput();
    var image_holder = $("#image-holder");
    var files_det = $("#files-img-det");
    var files = selectFileFromDB(ID)
    files_det.show();
    document.getElementById('files-details').innerHTML = 'Uploaded Files:';

    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
        var d = new Date();
        d = new Date(f.lastModified);
        output.push('<li><strong>', escape(f.name), '</strong> <small> (', f.type || 'n/a', ') Modified: ', d.toUTCString(), '</small></li>');
        document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';

        if (i==0) {
            var reader = new FileReader();
            $("<img />", {
            "src": f.data,
            "class": "img-thumbnail"
            }).appendTo(image_holder);
            fileContents[0] = f.data;
            image_holder.show();       
        }
        if (i==1) {
            fileContents[1] = f.data;
        }
    }
    console.log(fileContents);
};