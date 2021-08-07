function cleanModalResults() {
    document.getElementById('results-board').innerHTML = '';
    $("#results").hide();
    $('#results-modal').modal('hide');
};

function outputModalResults(htmlcontent) {
    $("#loadpage").fadeOut(1000);
    $("#results").show();
    document.getElementById('results-board').innerHTML = htmlcontent;
    $('#results-modal').modal('show');
};

function loadingModalResults() {
    $("#loadpage").show();
};