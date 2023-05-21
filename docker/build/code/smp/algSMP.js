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
	let simplifiedJson = simplifyJson(jsonFile);

	let seriesSimplified = getSeries(simplifiedJson);
	console.log(seriesSimplified);

	const numberOfNodes = seriesSimplified.nodes.length;
	const numberOfBranches = seriesSimplified.branches.length;
	let realNodes = getRealNodes(seriesSimplified.nodes);
	let incidenceMatrix = getIncidenceMatrix(numberOfNodes, numberOfBranches, realNodes);
	printMatrix(incidenceMatrix);

	let parallelSimplified = findParallels(seriesSimplified, incidenceMatrix);
	console.log('parallel simplfied: \n')
	console.log(parallelSimplified);
}

function simplifyJson(data) {
	let simplifiedJson = { nodes: [], branches: [] };
	let nodes = data.nodes;
	let jsonBranches = data.branches;

	for (let i = 0; i < nodes.length; i++) {
		let branches = nodes[i].branches;
		if (nodes[i].ref.startsWith("_net")) {
			continue;
		} else {
			let simplifiedNode = {
				reference: nodes[i].ref,
				type: nodes[i].type,
				branches: branches.map(branch => ({
					id: branch.id,
					startNode: branch.startNode,
					endNode: branch.endNode,
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

	for (let i = 0; i < jsonBranches.length; i++) {
		let branch = jsonBranches[i];
		simplifiedJson.branches.push(branch.startNode + branch.endNode + branch.id);
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

			let newResistorName = branch.resistors
				.map(r => r.reference)
				.reduce((prev, next) => prev += next);
			// console.log('sum of resistors: ' + sumOfResistors);
			// console.log('summed resistors: ' + summedResistorReferences + '\n\n');

			simplifiedJson.nodes[i].branches[j].resistors = [{
				id: 1,
				reference: newResistorName,
				value: sumOfResistors,
				unit: "Ohm"
			}]
			// simplifiedJson.nodes[i].branches[j].resistorSum = sumOfResistors;
			simplifiedJson.nodes[i].branches[j].resistorSumOperations = summedResistorReferences;
		}
	}
	console.log('Simplified Json after Series');
	console.log(simplifiedJson);
	return simplifiedJson;
}

function circuitSimplify(circuit) {
	const numberOfNodes = circuit.nodes.length;
	const numberOfBranches = circuit.branches.length;
	let realNodes = getRealNodes(circuit.nodes);
	let incidenceMatrix = getIncidenceMatrix(numberOfNodes, numberOfBranches, realNodes, circuit.branches);

	let simplifications = [];
	let over = false;
	while (!over) {
		let parallels = findParallels(circuit, incidenceMatrix);
		for (let i = 0; i < parallels.length; i++) {
			let parallel = parallels[i];
			let branches = parallels[i].branches;
			for (let j = 0; j < branches.length; j++) {
				let series = findSeries(circuit);
				for (let k = 0; k < series.length; k++) {
					let simplification = simplifySeries(circuit, series);
					simplifications.push(simplification);
					circuit = updateCircuit(circuit);
				}
			}
			let simplification = simplifyParallel(circuit, parallel);
			simplifications.push(simplification);
			circuit = updateCircuit(circuit);
		}
		let stars = findStars(incidenceMatrix, max);
		if (stars.length == 0) {
			over = true;
		}
		for (let i = 0; i < stars.length; i++) {
			let star = getStarNodes(incidenceMatrix, star, circuit.nodes);
			let simplification = starToDelta(circuit, star);
			simplifications.push(simplification);
			circuit = updateCircuit(circuit);
		}
	}
}

function findSeries(circuit) {
	let branches = circuit.branches;
	let seriesComponents = [];
	for (let i = 0; i < branches.length; i++) {
		let branch = branches[i];
		let resistors = [];
		let inductors = [];
		let capacitors = [];
		for (let j = 0; j < branch.components.length; j++) {
			let component = branch.components[j];
			switch (component.type) {
				case 5: // resistor
					resistors.push(component);
					break;
				case 4: // inductor
					inductors.push(component);
					break;
				case 3: // capacitor
					capacitors.push(component);
					break;
			}
		}
		seriesComponents.push({
			resistors: resistors,
			inductors: inductors,
			capacitors: capacitors
		});
	}

	return seriesComponents;
}

// brief: Encontra a resistência dos ramos 
// args:
// json simplificado
// matrix de incidencia (IDS DOS BRANCHES)
// returns:
// Operações de simplificação
// Circuito simplificado
function findParallels(simplifiedjson, incidenceMatrix) {
	let parallels = [];
	let numberOfBranches = simplifiedjson.branches.length;
	for (let i = 0; i < incidenceMatrix.length - 1; i++) {
		let bitwiseResult = new Array(numberOfBranches);

		for (let j = 0; j <= incidenceMatrix[0].length; j++) {
			bitwiseResult[j] = incidenceMatrix[i][j] & incidenceMatrix[i + 1][j];
		}

		let parallelBranches = [];
		for (let x = 0; x < bitwiseResult.length; x++) {
			if (bitwiseResult[x] == 1) {
				parallelBranches.push(simplifiedjson.branches[x]);
			}
		}

		if (parallelBranches.length > 0) {
			let nodeOne = simplifiedjson.nodes[i].reference;
			let nodeTwo = simplifiedjson.nodes[i + 1].reference;
			parallels.push({
				nodes: [nodeOne, nodeTwo],
				branches: parallelBranches
			});
		}
	}
	return parallels;
}

function findStars(incidenceMatrix, max) {
	let stars = [];
	let starCount = 0;
	for (let i = 1; i < incidenceMatrix.length; i++) {
		let connectedBranches = [];
		for (let j = 1; j < incidenceMatrix[0].length; j++) {
			if (incidenceMatrix[i][j] == 1) {
				connectedBranches.push(j - 1);
			}
		}
		if (connectedBranches.length == 3) {
			let branches = [];
			for (let k = 0; k < connectedBranches.length; k++) {
				branches.push({
					ref: k,
					nodes: {
						start: i,
						end: null
					}
				});
			}
			let star = {
				centerNode: i,
				branches: connectedBranches
			}
			stars.push(star);
			starCount += 1;
			if (starCount >= max) {
				return stars;
			}
		}
	}

	return stars;
}

function getStarNodes(incidenceMatrix, star, nodes) {
	for (let i = 0; i < incidenceMatrix.length; i++) {
		for (let j = 0; j < incidenceMatrix[0].length; j++) {
			if (nodes[i] != star.centerNode && nodes[j] != star.centerNode) {
				continue;
			}
			for (let k = 0; k < star.branches; k++) {
				let bitwiseResult = incidenceMatrix[i][j] & incidenceMatrix[i + 1][j];
				if (bitwiseResult == 1) {
					if (nodes[i] == star.centerNode) {
						star.branches[k].nodes = [nodes[i], nodes[j]];
					} else {
						star.branches[k].nodes = [nodes[j], nodes[i]];
					}
					return star;
				}
			}
		}
	}
	return null;
}

function starToDelta(circuit, star) {

}

// function getParallels(simplifiedJson, incidenceMatrix) {
// 	for (let i = 0; i < incidenceMatrix.length - 1; i++) {
// 		for (let j = 0; j < incidenceMatrix[0].length - 1; j++) {

// 			if (incidenceMatrix[i][j] == 1 && incidenceMatrix[i + 1][j] == 1 && 
// 				incidenceMatrix[i][j + 1] == 1 && incidenceMatrix[i + 1][j + 1] == 1) {
// 				//onde calculo as resistencias equivalentes no smp json
// 				1/simplifiedJson.nodes[i].branches[j].resistorSum + 1/simplifiedJson.nodes[i + 1].branches[j].resistorSum
// 				simplifiedJson.nodes[i].branches[j].resistorSumOperations = summedResistorReferences;
// 				delete simplifiedJson.nodes[i].branches[j].resistors;
// 				//console.log("paralelo entre " + array2[i] + " " + array2[i + 1]);
// 			}
// 		}
// 	}
// }

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

function getRealNodes(nodes) {
	let realNodes = [];
	for (let i = 0; i < nodes.length; i++) {
		if (nodes[i].type == 0) {
			realNodes.push(nodes[i].reference);
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
