/*
Graus de um Vértice:
Número de arestas que se “unem” num dado Vértice;
O grau total de um Grafo é a soma dos Graus de todos os seus Vértices;
Num grafo a soma dos graus de todos os Vértices é o dobro do número de Arestas.
Matriz de adjacencia - relaciona os vertices
Matriz de Incidencia - relaciona os vertices e arestas (que vertices sao interligados por cada aresta)
Gera as matrizes de incidência e adjacência e depois, com base nestas é que forma os raciocínios para o algoritmo.

Criar as Matrizes que modelizam o circuito:
1. Criar Array com Referência dos Nós (Vértices);
2. Criar Array com Referência dos Ramos (Arestas);
3. Matriz de Adjacência (fase de pesquisa);
4. Matriz de Incidência (estabelecimento de malhas - ramos).
*/
// constructor() {
// 	this.simplifiedJson = { nodes: [] };
// 	this.adjacencyList = {};
// 	let adjMatrix = null;
// 	let incMatrix = null;
// 	let edges = null;
// 	let vertices = null;
// }

function simplifyCircuit(data) {

	let jsonFile = JSON.parse(data);

	let branches = jsonFile.branches;
	let nodes = jsonFile.nodes;

	const numberOfNodes = countNodesByType(nodes, 0);
	const numberOfBranches = branches.length;
	let realNodes = getRealNodes(nodes);
	let incidenceMatrix = getIncidenceMatrix(numberOfNodes, numberOfBranches, realNodes);
	printMatrix(incidenceMatrix);

	let simplifiedJson = simplifyJson(jsonFile);

	let seriesSimplified = getSeries(simplifiedJson);
	console.log(seriesSimplified);

	let parallelSimplified = getParallels(seriesSimplified, incidenceMatrix);

}

function simplifyJson(data) {
	let simplifiedJson = { nodes: [] };
	let nodes = data.nodes;
	for (let i = 0; i < nodes.length; i++) {
		let branches = nodes[i].branches;
		if (nodes[i].ref.startsWith("_net")) {
			continue;
		} else {
			let simplifiedNode = {
				reference: nodes[i].ref,
				branches: branches.map(branch => ({
					id: branch.id,
					resistors: branch.resistors.map(resistor => ({
						id: resistor.id,
						reference: resistor.ref,
						value: parseInt(resistor.value),
						unit: resistor.unitMult
					})),
					coils: branch.coils,
					capacitors: branch.capacitors
				}))
			};
			simplifiedJson.nodes.push(simplifiedNode);
		}
	}

	return simplifiedJson;
}

//Métodos:
// brief: Encontra a resistência dos ramos 
// args:
// json simplificado
// returns:
// Operações de simplificaçãos
// Circuito simplificado
function getSeries(simplifiedJson) {
	for (let i = 0; i < simplifiedJson.nodes.length; i++) {
		let node = simplifiedJson.nodes[i];
		for (let j = 0; j < node.branches.length; j++) {
			let branch = node.branches[j];
			let sumOfResistors = branch.resistors
				.map(r => r.value)
				.reduce((prev, next) => {
					return prev + next
				}, 0);
			let summedResistorReferences = branch.resistors
				.map(r => r.reference)
				.reduce((prev, next) => prev += (' + ' + next));
			// console.log('sum of resistors: ' + sumOfResistors);
			// console.log('summed resistors: ' + summedResistorReferences + '\n\n');

			delete simplifiedJson.nodes[i].branches[j].resistors;
			simplifiedJson.nodes[i].branches[j].resistorSum = sumOfResistors;
			simplifiedJson.nodes[i].branches[j].resistorSumOperations = summedResistorReferences;
		}
	}

	return simplifiedJson;
}

// brief: Encontra a resistência dos ramos 
// args:
// json simplificado
// matrix de incidencia (IDS DOS BRANCHES)
// returns:
// Operações de simplificação
// Circuito simplificado
function getParallels(simplifiedJson, incidenceMatrix) {
	if (incidenceMatrix.length >= 2) { // there are still two nodes
		let nodeOne = incidenceMatrix[0];
		let nodeTwo = incidenceMatrix[1];
		let simplifiedNode = new Array(nodeOne.length);
		for (let i = 0; i < nodeOne.length; i++) {
			if (nodeOne[i] & nodeTwo[i] == 1) {
				// iterate simplified json with same index and sum parallel
			}
			simplifiedNode[i] = nodeOne[i] & nodeTwo[i];
		}
		delete incidenceMatrix[0];
		incidenceMatrix[1] = simplifiedNode;
	}
	console.log(incidenceMatrix);
}

function getIncidenceMatrix(numberOfNodes, numberOfBranches, nodes) {
	let incidenceMatrix = [];
	for (let i = 0; i < numberOfNodes; i++) {
		incidenceMatrix[i] = [];
	}
	for (let i = 0; i < numberOfNodes; i++) {
		for (let j = 0; j < numberOfBranches; j++) {
			if (nodeBranchCon(nodes, i, j)) {
				incidenceMatrix[i][j] = 1;
			}
			else {
				incidenceMatrix[i][j] = 0;
			}
		}
	}

	return incidenceMatrix;
}

// brief: Encontra a resistência dos ramos 
// args:
// json simplificado
// returns:
// Operações de simplificação
// Circuito simplificado
//funcao que deteta triangulos:
//pela matrix de adjacencia vamos pesquisar todos o grafo:
//começando num nó
//transitamos para o no seguinte
//transitamos para o no seguinte
//verificamos se conseguimos chegar ao primeiro (excell)
getTriangleStar()

// brief: Encontra a resistência dos ramos 
// args:
// json simplificado
// returns:
// Operações de simplificação
// Circuito simplificado
//funcao que deteta estrelas:
//percorrer todos os nos 
//dentro do no percorrer todos os ramos
//a cada nova referencia/letra (no) enviar para o array
//no final, conta dentro do array o numero de letras iguais (3 LETRAS - 1 NÓ)
//EXEMPLO:
//	B A G A C A
//						B A B C B G
//						C A B C G C 
//						G A B G G C
getStarTriangle()


function countNodesByType(objArr, type) {
	let cnt = 0;
	for (let i = 0; i < objArr.length; i++) { if (objArr[i].type == type) cnt++; }
	return cnt;
}

function getAdjacencyMatrix(numberOfNodes, nodes) {
	let adjacencyMatrix = [];
	for (let i = 0; i < numberOfNodes; i++) {
		adjacencyMatrix[i] = [];
	}
	for (let i = 0; i < numberOfNodes; i++) {
		for (let j = 0; j < numberOfNodes; j++) {
			if (adjNodes(nodes, i, j)) {
				// console.log('node ' + nodes[i] + ' to ' + nodes[j] + ' = 1');
				adjacencyMatrix[i][j] = 1;
			}
			else {
				// console.log('node ' + nodes[i] + ' to ' + nodes[j] + ' = 0');
				adjacencyMatrix[i][j] = 0;
			}
		}
	}

	return adjacencyMatrix;
}



function getRealNodes(nodes) {
	let realNodes = [];
	for (let i = 0; i < nodes.length; i++) {
		if (nodes[i].type == 0) {
			realNodes.push(nodes[i].ref);
		}
	}

	return realNodes;
}

function printMatrix(matrix) {
	let arrText = '';
	for (var i = 0; i < matrix.length; i++) {
		for (var j = 0; j < matrix[i].length; j++) {
			arrText += matrix[i][j] + ' ';
		}
		console.log(arrText);
		arrText = '';
	}
}

function getBranchComponents(branch) {
	branch.components = branch.components.concat(branch.dcAmpPwSupplies,
		branch.acAmpPwSupplies, branch.dcVoltPwSupplies, branch.acVoltPwSupplies,
		branch.resistors, branch.coils, branch.capacitors);

	return branch.components;
}

function simplifySequentialResistance(startNode, endNode, resistors) {
	let totalSequentialResistance = 0;
	for (let i = 0; i < resistors.length; i++) {
		totalSequentialResistance += parseInt(resistors[i].value);
	}

	let simplifiedResistor = {
		startNode: startNode,
		endNode: endNode,
		resistors: [
			{ value: totalSequentialResistance }
		]
	};

	return simplifiedResistor;
}

function simplifyParallelResistance(startNode, endNode, resistors) {
	let totalParallelResistance = 0;
	for (let i = 0; i < resistors.length; i++) {
		totalParallelResistance += 1 / parseInt(resistors[i].value);
	}

	let simplifiedResistor = {
		startNode: startNode,
		endNode: endNode,
		resistors: [
			{ value: 1 / totalParallelResistance }
		]
	};

	return simplifiedResistor;
}

function processParallelBranches(simplifiedBranches) {
	let simplifiedParallelBranches = [];
	for (let i = 0; i < simplifiedBranches.length; i++) {
		let branch = simplifiedBranches[i];
		let parallelBranch = {
			resistors: new Array()
		};

		parallelBranch.resistors = branch.resistors;

		for (let j = 0; j < simplifiedBranches.length; j++) {
			if (i == j) {
				continue;
			}
			if (simplifiedBranches[j].startNode == branch.startNode
				&& simplifiedBranches[j].endNode == branch.endNode
				&& simplifiedBranches[j].resistors.length > 0) {
				parallelBranch.resistors = parallelBranch.resistors.concat(
					simplifiedBranches[j].resistors);
			}
		}

		let simplifiedParallelBranch = simplifyParallelResistance(branch.startNode,
			branch.endNode, parallelBranch.resistors);
		simplifiedParallelBranches.push(simplifiedParallelBranch);
	}

	let simplifiedBranchesWithoutDuplicates = simplifiedParallelBranches.filter((v, i, a) => a.findIndex(v2 => ['startNode',
		'endNode'].every(k => v2[k] === v[k])) === i);

	return simplifiedBranchesWithoutDuplicates;
}

function processSequentialBranches(simplifiedBranches) {
	for (let i = 0; i < simplifiedBranches.length; i++) {
		if (simplifiedBranches[i].resistors.length > 0) {
			let simplified = simplifySequentialResistance(
				simplifiedBranches[i].startNode,
				simplifiedBranches[i].endNode,
				simplifiedBranches[i].resistors);
			simplifiedBranches[i].resistors = new Array();
			simplifiedBranches[i].resistors.push(simplified);
		} else {
			simplifiedBranches[i].resistors = new Array();
		}
	}

	return simplifiedBranches;
}

function loadFileAsTextSMP(data) {

	let jsonFile = JSON.parse(data);

	branches = jsonFile.branches;
	nodes = jsonFile.nodes;
	components = jsonFile.components;

	let simplifiedBranches = new Array();
	for (let i = 0; i < branches.length; i++) {
		simplifiedBranches[i] = {
			startNode: branches[i].startNode,
			endNode: branches[i].endNode,
			resistors: branches[i].resistors
		};
	}

	while (simplifiedBranches.length > 1) {
		simplifiedBranches = processSequentialBranches(simplifiedBranches);
		if (simplifiedBranches.length == 1) {
			break;
		} else {
			simplifiedBranches = processParallelBranches(simplifiedBranches);
		}
	}

	console.log('\n\n Simplified: \n');
	console.log(simplifiedBranches);

	console.log('\n**** Equivalent resistance: ****\n')
	console.log(simplifiedBranches);

	const numberOfNodes = countNodesByType(nodes, 0);
	const numberOfBranches = branches.length;

	let realNodes = getRealNodes(nodes);
	let adjacencyMatrix = getAdjacencyMatrix(numberOfNodes, realNodes);
	let incidenceMatrix = getIncidenceMatrix(numberOfNodes, numberOfBranches, realNodes);

	console.log('\n ******* Adjacency Matrix: ******* \n');
	printMatrix(adjacencyMatrix);

	console.log('\n ******* Incidence Matrix: ******* \n');
	printMatrix(incidenceMatrix);

}
