const math = require('mathjs')
const fs = require('fs');
const { kldivergence, json, matrix } = require('mathjs');
const { Console } = require('console');
const MeshesFinder = require('../../src/meshes-finder.min');

// adjacency matrix
const nodes = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
const adjLa = [0,1,1,0,0,0,1,0,0];
const adjLb = [1,0,0,1,1,0,1,0,0];
const adjLd = [1,0,0,0,1,0,0,1,0];
const adjLe = [0,1,0,0,0,1,1,0,0];
const adjLh = [0,1,1,0,0,1,0,1,0];
const adjLj = [0,0,0,1,1,0,0,0,1];
const adjLm = [1,1,0,1,0,0,0,0,0];
const adjLt = [0,0,1,0,1,0,0,0,1];
const adjLg = [0,0,0,0,0,1,0,1,0];

let adjacencyMatrix = math.matrix([adjLa, adjLb, adjLd, adjLe, adjLh, adjLj, adjLm, adjLt, adjLg]);

console.table(adjacencyMatrix._data);

const branches = ["r0", "r1", "r2", "r3", "r4", "r5", "r6", "r7","r8","r9","r10","r11","r12","r13","r14"];
const incLa = [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0];
const incLb = [0,0,1,0,0,0,0,0,0,1,1,0,0,0,1];
const incLd = [1,0,0,1,0,0,0,0,0,0,0,0,1,0,0];
const incLe = [0,0,0,0,0,0,0,1,0,1,0,1,0,0,0];
const incLh = [0,0,0,0,1,0,0,0,1,0,0,0,1,0,1];
const incLj = [0,0,0,0,0,0,0,1,1,0,0,0,0,1,0];
const incLm = [0,1,0,0,0,0,0,0,0,0,1,1,0,0,0];
const incLt = [0,0,0,1,1,1,1,0,0,0,0,0,0,0,0];
const incLg = [0,0,0,0,0,1,1,0,0,0,0,0,0,1,0];

let incidenceMatrix = math.matrix([incLa, incLb, incLd, incLe, incLh, incLj, incLm, incLt, incLg]);

console.table(incidenceMatrix._data);

// Instantiate new MeshesFinder Object
let meshesFinderObj = new MeshesFinder();
// Build the Graph (passing the necessary data for the desired circuit)
meshesFinderObj.initGraph(adjacencyMatrix, incidenceMatrix, nodes, branches);
// Get expanded Meshes data
meshes = meshesFinderObj.getLoops(1);
if(meshes.error.state == false) {
	fs.writeFileSync('./meshes.json', JSON.stringify(meshes.data));
	if (typeof meshes.data.info != "undefined") console.log(meshes.data.info);
  }
else{
	console.log("Impossible to continue with the Meshes Search. Error List: ");
	meshes.error.reason.forEach(e => {
		console.log(e);
	});
}

console.log('Press any key to exit');
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', process.exit.bind(process, 0));