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

	// console.log('\n\n Simplified: \n');
	// console.log(simplifiedBranches);

	console.log('\n**** Equivalent resistance: ****\n')
	console.log(simplifiedBranches);

	// const numberOfNodes = countNodesByType(nodes, 0);
	// const numberOfBranches = branches.length;

	// let realNodes = getRealNodes(nodes);
	// let adjacencyMatrix = getAdjacencyMatrix(numberOfNodes, realNodes);
	// let incidenceMatrix = getIncidenceMatrix(numberOfNodes, numberOfBranches, realNodes);

	// console.log('\n ******* Adjacency Matrix: ******* \n');
	// printMatrix(adjacencyMatrix);

	// console.log('\n ******* Incidence Matrix: ******* \n');
	// printMatrix(incidenceMatrix);
}
