const filesystem = require('fs');
const MeshesFinder = require('../../../src/meshes-finderv2.js')

let vertices = ["A", "B", "C", "D"];
let edges = ["r1", "r2", "r3", "r4", "r5", "r6", "r7"];
let adjMatrix = [
  [0,1,1,0],
  [1,0,1,1],
  [1,1,0,1],
  [0,1,1,0]
];
let incMatrix = [
  [1,1,1,0,0,0,0],
  [0,0,1,1,1,1,0],
  [1,1,0,1,0,0,1],
  [0,0,0,0,1,1,1]
];

let circuit = new MeshesFinder();
circuit.initGraph(adjMatrix,incMatrix, vertices, edges);

let meshes = circuit.getMeshes();

if(meshes.error.state == false) {
  filesystem.writeFileSync('meshes.json', JSON.stringify(meshes.data));
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