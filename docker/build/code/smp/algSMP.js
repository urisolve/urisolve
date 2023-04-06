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

let netlist_test = `
# Qucs 0.0.19  C:/Users/Filipe/.qucs/Circuito_base_prj/BASE.sch
Vdc:V1 _net0 _net1 U="15 V"
R:R5 A _net2 R="50 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"
.DC:DC1 Temp="26.85" reltol="0.001" abstol="1 pA" vntol="1 uV" saveOPs="no" MaxIter="150" saveAll="no" convHelper="none" Solver="CroutLU"
R:R1 _net0 _net3 R="10 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"
R:R3 _net3 A R="30 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"
R:R4 A _net2 R="40 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"
R:R2 A _net2 R="20 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"
R:R7 _net2 _net4 R="70 Ohm" Temp="26.85" Tc1="0.0" Tc2="0.0" Tnom="26.85"`
/*
/**
 * Count Nodes By Type (0 = Real, 1 - Virtual)
 * @param {Array} objArr Array of Nodes objects
 * @param {Int} type Desired type of node to return
 * @returns Number of Nodes
 */
function countNodesByType(objArr, type) {
	let cnt = 0;
	for(let i=0; i<objArr.length; i++) { if(objArr[i].type == type) cnt++;}
	return cnt;
}

/**
 * Encounters the number and type of knots (real or virtual)
 */
//function findNodes()

/**
 * Finds all circuit meshes
 * @returns first: error; second: errorCode; third: array with all the meshes
 /*
function findMeshes(){

	const nr_nos = countNodesByType(nodes, 0);
	const nr_ramos = branches.length;
	let real_nodes = [];


	for(let i = 0; i<nodes.length; i++){
		if(nodes[i].type == 0) real_nodes.push(nodes[i].ref);
	}


	let branches_id = [];
	for(let i = 0; i<branches.length; i++){
		branches_id.push(branches[i].id);
	}


	//cria matriz de adjacencia
	let matriz_adj = [];
	for(let i = 0; i< nr_nos; i++){
		matriz_adj[i] = [];
	}
	for(let i = 0; i < nr_nos; i++){
		for(let j = 0; j < nr_nos; j++){
			if(adjNodes(real_nodes, i, j)){
				matriz_adj[i][j] = 1;
			}
			else{
				matriz_adj[i][j] = 0;
			}					
		}			
	}
	
	//cria matriz de incicendia
	let matriz_inc = [];
	for(let i = 0; i< nr_nos; i++){
		matriz_inc[i] = [];
	}
	for(let i = 0; i < nr_nos; i++){
		for(let j = 0; j < nr_ramos; j++){
			if(nodeBranchCon(real_nodes, i, j)){
				matriz_inc[i][j] = 1;
			}
			else{
				matriz_inc[i][j] = 0;
			}					
		}			
	}

	//Meshes finder
	let circuit = new MeshesFinder();
	circuit.initGraph(matriz_adj, matriz_inc, real_nodes, branches_id);
	let meshes = circuit.getMeshes();
	
	if(meshes.error.state == true) {
	  return{
		  first: true,
		  second: 3,
		  third: meshes.error.reason
	  };
	}
	
	return{
		first: false,
		second: 0,
		third: meshes.data
	}
}
*/

function loadFileAsTextSMP(data) {

	//countNodesByType();
	let jsonFile = JSON.parse(data);

	branches = jsonFile.branches;
	nodes = jsonFile.nodes;
	components = jsonFile.components;
	simInfo = jsonFile.analysisObj;

	//1. Criar Array com Referência dos Nós (Vértices);
	//* Encounters the number and type of knots (real or virtual)
	//findNodes();

	//2. Criar Array com Referência dos Ramos (Arestas);

	//3. Matriz de Adjacência (fase de pesquisa);
	
	//4. Matriz de Incidência (estabelecimento de malhas - ramos).
	
}
