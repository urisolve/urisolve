const math = require('mathjs')
const fs = require('fs');
const { kldivergence, json, matrix } = require('mathjs');
const { Console } = require('console');
const MeshesFinder = require('../../src/meshes-finder.min')

// adjacency matrix
const nodes = ["A", "B", "C", "D", "G"];
const adjL1 = [0,1,0,1,1];
const adjL2 = [1,0,1,0,1];
const adjL3 = [0,1,0,1,1];
const adjL4 = [1,0,1,0,1];
const adjL5 = [1,1,1,1,0];

let adjacencyMatrix = math.matrix([adjL1, adjL2, adjL3, adjL4, adjL5]);

console.table(adjacencyMatrix._data);

const branches = ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8"];
const incL1 = [1,1,0,0,0,0,0,1];
const incL2 = [0,1,1,1,0,0,0,0];
const incL3 = [0,0,0,1,1,1,0,0];
const incL4 = [0,0,0,0,0,1,1,1];
const incL5 = [1,0,1,0,1,0,1,0];

let incidenceMatrix = math.matrix([incL1, incL2, incL3, incL4, incL5]);

console.table(incidenceMatrix._data);

// Instantiate new MeshesFinder Object
let meshesFinderObj = new MeshesFinder();
// Build the Graph (passing the necessary data for the desired circuit)
meshesFinderObj.initGraph(adjacencyMatrix, incidenceMatrix, nodes, branches);
// Get expanded Meshes data
meshes = meshesFinderObj.getLoops(1);
if(meshes.error.state == false) fs.writeFileSync('meshes.json', JSON.stringify(meshes.data));
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