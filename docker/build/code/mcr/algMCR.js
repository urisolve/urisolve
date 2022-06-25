//include('code/common/outPrintMCM.js');
include('vendor/meshes-finder/meshes-finder.js');



/**
 * Main Function
 * @param {object} data initila jsonFile data
 */
function loadFileAsTextMCR(data) {

	let jsonFile = JSON.parse(data);
	
	branches = jsonFile.branches;
	nodes = jsonFile.nodes;
	components = jsonFile.components;
	simInfo = jsonFile.analysisObj;

	console.log("anr: funciona, certo?");
	alert("anr: funciona, certo?");

}