
/*
ERROR LIST

1 - Não foi inserida uma netlist
2 - Erro Netlist
3 - Erro a procurar malhas
3 - Erro a construir equações
*/
	
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
 * Test if nodes are adjacent to each other
 * @param {Array} real_nodes Array of Real Nodes objects
 * @param {Int} a Desired index of the first knot
 * @param {Int} b Desired index of the second knot
 * @param {Array} branches Braches array
 * @returns boolean, true if adjacent
 */
function adjNodes(real_nodes, a, b){
	for(let i = 0; i<branches.length; i++){
		if((real_nodes[a] == branches[i].startNode)&&(real_nodes[b] == branches[i].endNode) || (real_nodes[a] == branches[i].endNode)&&(real_nodes[b] == branches[i].startNode)) return true;
	}
	return false;
}

/**
 * Test if a node is connected to a branch
 * @param {Array} real_nodes Array of Real Nodes objects
 * @param {Int} a Desired index of the knot
 * @param {Int} b Desired index of the branch
 * @param {Array} branches Braches array
 * @returns boolean, true if adjacent
 */
function nodeBranchCon(real_nodes, a, b){
	if((branches[b].startNode == real_nodes[a]) || (branches[b].endNode == real_nodes[a])) return true;
	return false;
}

/**
 * Finds all circuit meshes
 * @returns first: error; second: errorCode; third: array with all the meshes
 */
function findMeshes(nodes, branches){

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

/**
 * Chooses all meshes to use in the MCM method
 * @param {Array} malhas Array of all circuit meshes
 * @param {Int} nr_malhas_principais Number of main meshes needed
 * @returns boolean, true if adjacent
 */
function escolherMalhas(malhas, nr_malhas_principais){
	let malhas_flags = [];
	let ramos_fontecorrente_flags = [];
	let ramos_flags = [];
	for(let i = 0; i < malhas.length; i++){
		malhas_flags[i] = 0;
	}
	for(let i = 0; i < branches.length; i++){
		if(branches[i].dcAmpPwSupplies.length + branches[i].acAmpPwSupplies.length == 0){
			ramos_fontecorrente_flags[i] = 0;
		}
		else{
			ramos_fontecorrente_flags[i] = 1;
		}
	}
	for(let i = 0; i < branches.length; i++){
		ramos_flags[i] = 0;
	}

	let malhas_escolhidas = [];
	//inutilizar malhas com mais que uma fonte de corrente
	for(let i = 0; i < malhas.length; i++){
		let count = 0;
		for(let j = 0; j < malhas[i].length; j++){
			if(ramos_fontecorrente_flags[malhas[i][j]-1] == 1) count++;
		}
		if(count > 1) malhas_flags[i] = -1;
	}

	//Escolha de C malhas auxiliares
	for(let i = 0; i < ramos_fontecorrente_flags.length; i++){  //para cada fonte de corrente
		if(ramos_fontecorrente_flags[i] == 1){					//Se o ramo contém fonte de corrente
			let escolhido = false;
			while(!escolhido){
				for(let j = 0; j < malhas.length; j++){			//percorrer o array das malhas
					if(malhas_flags[j] == 0){					//se a malha estiver disponível
						for(let k = 0; k < malhas[j].length; k++){ //para cada ramo da malha
							if(malhas[j][k] == i+1){				//se tiver o ramo com a fonte de corrente em questão
								for(let m = 0; m < malhas[j].length; m++){
									ramos_flags[malhas[j][m]-1] = 1;
								}
								malhas_flags[j] = 1;
								let temp;
								if(branches[i].dcAmpPwSupplies.length != 0) temp = branches[i].dcAmpPwSupplies[0];
								else temp = branches[i].acAmpPwSupplies[0];
								malhas_escolhidas.push(new mesh(malhas_escolhidas.length+1, 0, malhas[j], i+1, temp));
								escolhido = true;
								break;
							}
						}
					}
					if(escolhido) break;
				}
			}			
		}
	}

	//inutilizar as restantes malhas com ramos com fontes de corrente
	for(let i = 0; i < malhas.length; i++){
		if(malhas_flags[i] == 0){
			for(let j = 0; j < malhas[i].length; j++){
				if(ramos_fontecorrente_flags[malhas[i][j]-1] == 1){
					malhas_flags[i] = -1;
					break;
				}
			}
		}
	}

	//Escolher o número de malhas principais
	let count = 0;
	let add = false;
	for(let i = 0; i < malhas.length; i++){
		if(malhas_flags[i] == 0){
			add = false;
			for(let j = 0; j < malhas[i].length; j++){
				if(ramos_flags[malhas[i][j]-1] == 0){ //contem ramo novo
					add = true;
				}
			}
			if(add){
				for(let j = 0; j < malhas[i].length; j++){
					ramos_flags[malhas[i][j]-1] = 1;
				}				
				malhas_flags[i] = 1;
				malhas_escolhidas.push(new mesh(malhas_escolhidas.length+1, 1, malhas[i], -1, []));
				count++;
			}
			else{
				malhas_flags[i] = 2;
			}
		}
		if(count == nr_malhas_principais) break; //caso tenha escolhido malhas suficientes
	}
	if(count < nr_malhas_principais){	//malhas em falta
		let count2 = 0;
		for(let c = 0; c < ramos_flags.length; c++){
			if(ramos_flags[c] == 1)	 count2++;
		}
		if(count2 == ramos_flags.length){ //ramos todos ocupados e malhas em falta
			let count3 = 0;
			for(let c = 0; c < malhas.length; c++){
				if(malhas_flags[c] == 2){
					malhas_escolhidas.push(new mesh(malhas_escolhidas.length+1, 1, malhas[c], -1, []));
					count3++;
				}
				if(count3 == nr_malhas_principais-count) break;
			}
		}
	}
	return{
		first: false,
		second: 0,
		third: malhas_escolhidas
	};
}


//função que determina se um componente está no mesmo sentido  que o ramo
function mesmoSentido(componente, ramo, componentesRamo){
	let aux = componente.noP;
	do{
		if(aux.search("_net") == -1){		//o nó é real
			if(aux == branches[ramo-1].endNode                    ){	//o sentido é o mesmo do ramo
				return true;
			}
			else{												//o sentido é contrário ao do ramo
				return false;
			}
		}
		else{												//o nó é virtual, procurar próximo componente
			for(let i = 0; i < componentesRamo.length; i++){
				if(componentesRamo[i].noP == aux){
					aux = componentesRamo[i].noN;
					break;
				}
				else{
					if(componentesRamo[i].noP == aux){
						aux = componentesRamo[i].noP;
						break;
					}
				}
			}
		}
	}while(true);
}
//função que determina a direção da malha e dos ramos
function direcaoMalha(malhas){
	malhas.forEach(malha => {
		let auxNode = branches[malha.branches[0]-1].endNode;		//começa-se por arbitrar um nó 
		if(auxNode != branches[malha.branches[1]-1].startNode && auxNode != branches[malha.branches[1]-1].endNode){  //se o primeiro ramo estiver invertido
			auxNode = branches[malha.branches[0]-1].startNode;		//atualizar auxNode
			malha.branchesDir.push(-1);								//marca-se a direção do nó com -1
		}
		else{
			malha.branchesDir.push(1);								//caso contrário, marca se com 1
		}
		for(let i = 0; i < malha.branches.length-1; i++){			//percorrer os ramos
			if(auxNode == branches[malha.branches[i+1]-1].startNode){	//caso o ramo tenha o sentido correto
				auxNode = branches[malha.branches[i+1]-1].endNode;
				malha.branchesDir.push(1);
			}
			else{
				if(auxNode == branches[malha.branches[i+1]-1].endNode){	//caso o nó tenha o sentido contrário
					auxNode = branches[malha.branches[i+1]-1].startNode;
					malha.branchesDir.push(-1);
				}
			}
		}
		//o resultado neste momento é um array malha.branchesDir, preenchido com 1 e -1, que indica se o ramo está ou não invertido, no decorrer da malha
		if(malha.type == 0){		//caso a malha em questão tenha fonte de corrente
			let trocar = false;

			let aux = branches[malha.branchWithCurSrc-1];
			let componentesRamo = [];
			componentesRamo = componentesRamo.concat(aux.dcVoltPwSupplies, aux.acVoltPwSupplies, aux.resistors, aux.coils, aux.capacitors);
			if(aux.amperemeter != undefined) componentesRamo = componentesRamo.concat(aux.amperemeter);

			if(aux.dcAmpPwSupplies != 0){ 										//fonte de corrente é dc
				if(aux.dcAmpPwSupplies[0].getGlobalNodes().fromNode == branches[malha.branchWithCurSrc-1].endNode){
					if(malha.branchesDir[malha.branches.indexOf(malha.branchWithCurSrc)] == -1) trocar = true;
				}
				else{
					if(malha.branchesDir[malha.branches.indexOf(malha.branchWithCurSrc)] == 1) trocar = true;	
				}
			}
			else{																//fonte de corrente é ac
				if(aux.acAmpPwSupplies[0].getGlobalNodes().fromNode == branches[malha.branchWithCurSrc-1].endNode){
					if(malha.branchesDir[malha.branches.indexOf(malha.branchWithCurSrc)] == -1) trocar = true;
				}
				else{
					if(malha.branchesDir[malha.branches.indexOf(malha.branchWithCurSrc)] == 1) trocar = true;	
				}
			}
			if(trocar){
				//trocar sentidos dos ramos
				for(let i = 0; i < malha.branchesDir.length; i++){
					malha.branchesDir[i] = malha.branchesDir[i] * -1;
				}
				//trocar ordem das malhas
				malha.branchesDir.reverse();
				malha.branches.reverse();
			}
		}
	});
	return{
		first: false,
		second: 0,
		third: malhas
	}
}
//função que encontra que correntes de malha atravessam cada ramo
function correntesMalhaRamos(malhas){
	branches.forEach(ramo => {
		malhas.forEach(malha => {
			for(let i = 0; i < malha.branches.length; i++){
				if(ramo.id == malha.branches[i]){
					ramo.meshCurr.push(malha.id);
					break;
				}
			}
		});
	});
}
//função que encontra os componentes da malha
function getComponents(malhas){
	malhas.forEach(malha => {		//para cada malha
		if(malha.type == 1){			//se a malha for principal
			malha.branches.forEach(ramo => {		//para cada ramo
				let aux = branches[ramo-1];
				let searchNode;
				if(malha.branchesDir[malha.branches.indexOf(ramo)] == -1){		//caso a direção do ramo for -1, contrária
					searchNode = aux.endNode;		//set do nó inicial a procurar
				}
				else{															//caso a direção do ramo seja 1, nao contrária
					searchNode = aux.startNode;		//set do nó inicial a procurar
				}
				let componentesRamo = [];
				componentesRamo = componentesRamo.concat(aux.dcAmpPwSupplies, aux.acAmpPwSupplies, aux.dcVoltPwSupplies, aux.acVoltPwSupplies, aux.resistors, aux.coils, aux.capacitors);
				if(aux.amperemeter != undefined) componentesRamo = componentesRamo.concat(aux.amperemeter);
				let cnt = componentesRamo.length;
				for(let j = 0; j < cnt; j++){		//ciclo que corre tantas vezes quantos componentes houver no ramo
					let add;
					let i;
					let ladoNegativo = false;
					for(i = 0; i < componentesRamo.length; i++){	//ciclo que procura qual o componente que tem o searchNode como uma das extermidades
						add = false;
						if(componentesRamo[i].noP == searchNode){	//caso extermidade positiva
							ladoNegativo = -1;
							searchNode = componentesRamo[i].noN;	//próximo searchNode é o nó negativo
							add = true;
							break;
						}
						else if(componentesRamo[i].noN == searchNode){	//caso extermidade negativa
							ladoNegativo = 1;
							searchNode = componentesRamo[i].noP;	//próximo searchNode é o nó positivo
							add = true;
							break;
						}						
					}
					if(add){	//caso seja para adicionar o componente
						if(aux.dcVoltPwSupplies.includes(componentesRamo[i]) || aux.acVoltPwSupplies.includes(componentesRamo[i])){ //caso o componente seja uma fonte se tensão
							malha.componentsLeft.push([componentesRamo[i], ladoNegativo]);		//adiciona ao lado esquerdo
						}
						else{																										//caso o componente não seja uma fonte de tensão
							malha.componentsRight.push([componentesRamo[i], ramo]);						//adiciona ao lado direito
						}
						componentesRamo.splice(i, 1);											//remove o componente do array de componentes do ramo
					}
				}
			});			
		}
	});
	return{
		first: false,
		second: 0,
		third: malhas
	}
}
//função que junta a informação das equações
function parseEqData(malhas){
	malhas.forEach(malha => {	//para cada malha
		if(malha.type == 1){	//se a malha é principal
			let ladoEsq = [];
			let ladoDir = [];
			if(malha.componentsLeft.length == 0) ladoEsq = 0;	//se nao há fontes o lado esquerdo é 0
			else{
				for(let i = 0; i < malha.componentsLeft.length; i++){		//para cada fonte
					ladoEsq.push([malha.componentsLeft[i][0].ref, malha.componentsLeft[i][0].value, malha.componentsLeft[i][0].unitMult, malha.componentsLeft[i][1]]); //adicionar componente ao lado esquerdo
				}	
			}
			if(malha.componentsRight.length == 0){		//caso nao hajam componentes do lado direito da equação
				return{									//erro
					first: true,
					second: 3,
					third: "Sem componentes no ramo"
				}
			}
			else{
				for(let i = 0; i < malha.componentsRight.length; i++){		//para cada componente guardar a sua info
					ladoDir.push([]);
					componente = malha.componentsRight[i];
					ladoDir[i][0] = componente[0].ref;
					ladoDir[i][1] = componente[0].value;
					ladoDir[i][2] = componente[0].unitMult;
					ladoDir[i][3] = branches[componente[1]-1].meshCurr;
					let sentidos = [];
					let self = malha.branchesDir[malha.branches.indexOf(componente[1])];
					ladoDir[i][3].forEach(curMalha => {
						sentidos.push(self * malhas[curMalha-1].branchesDir[malhas[curMalha-1].branches.indexOf(componente[1])]);
					});
					ladoDir[i][4] = sentidos;
				}					
			}
			malha.equationData = [ladoEsq, ladoDir];		//parse eq info
		}
	});
	return{
		first: false,
		second: 0,
		third: malhas
	}
}
//função que constrói equações
function buildEq(malhas){
	malhas.forEach(malha => {
		if(malha.type == 1){
			if(malha.equationData[0] == 0){
				malha.incognitoEq = malha.incognitoEq.concat('0');
				malha.revealedCurrSrc = malha.revealedCurrSrc.concat('0');
				malha.revealedEq = malha.revealedEq.concat('0');
			}
			else{ 
				for(let i = 0; i < malha.equationData[0].length; i++){
					fonte = malha.equationData[0][i];
					if(fonte[3] == -1){
						malha.incognitoEq = malha.incognitoEq.concat('-');
						malha.revealedCurrSrc = malha.revealedCurrSrc.concat('-');
						malha.revealedEq = malha.revealedEq.concat('-');
					}
					else{
						if(i != 0){
							malha.incognitoEq = malha.incognitoEq.concat('+');
							malha.revealedCurrSrc = malha.revealedCurrSrc.concat('+');
							malha.revealedEq = malha.revealedEq.concat('+');
						}
					}
					malha.incognitoEq = malha.incognitoEq.concat(fonte[0]);
					malha.revealedCurrSrc = malha.revealedCurrSrc.concat(fonte[0]);
					malha.revealedEq = malha.revealedEq.concat(fonte[1]);
				}
			}			
			malha.incognitoEq = malha.incognitoEq.concat('=');
			malha.revealedCurrSrc = malha.revealedCurrSrc.concat('=');
			malha.revealedEq = malha.revealedEq.concat('=');
			for(let i = 0; i < malha.equationData[1].length; i++){
				componente = malha.equationData[1][i];
				if(i != 0){
					malha.incognitoEq = malha.incognitoEq.concat('+');
					malha.revealedCurrSrc = malha.revealedCurrSrc.concat('+');
					malha.revealedEq = malha.revealedEq.concat('+');
				}
				malha.incognitoEq = malha.incognitoEq.concat(componente[0], '(');
				malha.revealedCurrSrc = malha.revealedCurrSrc.concat(componente[0], '(');
				malha.revealedEq = malha.revealedEq.concat(componente[1], '(');
				for(let j = 0; j < componente[4].length; j++){
					if(componente[4][j] == -1){
						malha.incognitoEq = malha.incognitoEq.concat('-');
						malha.revealedCurrSrc = malha.revealedCurrSrc.concat('-');
						malha.revealedEq = malha.revealedEq.concat('-');
					}
					else{
						if(j != 0){
							malha.incognitoEq = malha.incognitoEq.concat('+');
							malha.revealedCurrSrc = malha.revealedCurrSrc.concat('+');
							malha.revealedEq = malha.revealedEq.concat('+');
						}
					}
					if(malhas[componente[3][j]-1].type == 0){
						malha.revealedCurrSrc = malha.revealedCurrSrc.concat(malhas[componente[3][j]-1].currentSource.value);
						malha.revealedEq = malha.revealedEq.concat(malhas[componente[3][j]-1].currentSource.value);
					}
					else{
						malha.revealedCurrSrc = malha.revealedCurrSrc.concat('I', componente[3][j], componente[3][j]);	
						malha.revealedEq = malha.revealedEq.concat('I', componente[3][j], componente[3][j]);
					}
					malha.incognitoEq = malha.incognitoEq.concat('I', componente[3][j], componente[3][j]);
				}
				malha.incognitoEq = malha.incognitoEq.concat(')');
				malha.revealedCurrSrc = malha.revealedCurrSrc.concat(')');
				malha.revealedEq = malha.revealedEq.concat(')');
			}
		}
		


	});
	return{
		first: false,
		second: 0,
		third: malhas
	}
}

//função principal
function loadFileAsTextMCM(data) {

	let jsonFile = JSON.parse(data);
	
	branches = jsonFile.branches;
	nodes = jsonFile.nodes;
	components = jsonFile.components;

	// Identify MCM Equations
	var MEquaCnt = branches.length - countNodesByType(nodes, 0) + 1 - (components.dcAmpsPs.length + components.acAmpsPs.length);

	alert("São precisas " + MEquaCnt + " equações");

	//Meshes finder
	let circuito_malhas = findMeshes(nodes, branches);
	if(circuito_malhas.first){
		let erro = '';
		circuito_malhas.third.forEach(e => {
			erro = erro + '\n' + e;
		});
		alert("Erro ao criar malhas!\nErros:\n" + erro);
		return;
	}
	let malhas_arr = [];
	circuito_malhas.third.order.forEach(ordem => {
		circuito_malhas.third.order[circuito_malhas.third.order.indexOf(ordem)].forEach(malha => {
			malhas_arr.push(malha);
		});
	});

	//Algoritmo de escolha de malhas	
	let malhas_escolhidas = escolherMalhas(malhas_arr, MEquaCnt);
	if(malhas_escolhidas.first){
		alert(malhas_escolhidas.third);
		return;
	}

	//atualizar direções de malha e ramos
	malhas_escolhidas = direcaoMalha(malhas_escolhidas.third);
	if(malhas_escolhidas.first){
		alert(malhas_escolhidas.third);
		return;
	}

	//correntes de malha que atravessam cada ramo
	correntesMalhaRamos(malhas_escolhidas.third);
	if(malhas_escolhidas.first){
		alert(malhas_escolhidas.third);
		return;
	}

	//encontrar componentes da malha
	malhas_escolhidas = getComponents(malhas_escolhidas.third);
	if(malhas_escolhidas.first){
		alert(malhas_escolhidas.third);
		return;
	}

	//construir equações
	malhas_escolhidas = parseEqData(malhas_escolhidas.third);
	if(malhas_escolhidas.first){
		alert(malhas_escolhidas.third);
		return;
	}

	malhas_escolhidas = buildEq(malhas_escolhidas.third);
	if(malhas_escolhidas.first){
		alert(malhas_escolhidas.third);
		return;
	}
	/** Rearrange equation system in order to the unkown variables
	 * 1 - Get the Unknown Variables
	 * 2 - Get the rest of the nodes
	 * 3 - Find the rest of the nodes in the KNL Equations
	 * 4 - Replace each node for its equivalent expression
	 * 	   until the unknown variable is reached
	 */

/*

    var results = new Array();
	var inOrderEquations = new Array();

	// Get nodes except system unknowns
	var otherNodes = new Array();
	for (let i = 0; i < knlEquationsReg.length; i++){
		if(!equationUnknowns.includes(knlEquationsReg[i].node))
			otherNodes.push(knlEquationsReg[i].node)
	}

	// Create the nodes substitutions to insert in the system equation solver
	// Nodes CANNOT have more than 2 letters in the equations
	var nodeSubstitutions = new Array();
	var currentNodes = knlEquationsReg.map(a => a.node);
	var doubleLetterNodes = new Array();
	for(let i = 0; i< currentNodes.length; i++){
		if(currentNodes[i].length > 1){
			doubleLetterNodes.push(currentNodes[i]);
			currentNodes.splice(i,1);
			i--;
		}
	}
	for(let i = 0; i< doubleLetterNodes.length; i++){
		let obj = {
				prevNode: doubleLetterNodes[i],
				subsNode: findNewNode(currentNodes)
			};
		nodeSubstitutions.push(obj);
		currentNodes.push(obj.subsNode);
	}


	// Find non-variable nodes in the KNL Equations
	var nonVarFound = new Array();
	for (let i = 0; i < knlEquaCnt; i++){
		for(let j = 0; j < otherNodes.length; j++){
			if(knlEquationsVl[i].includes(otherNodes[j]))
				nonVarFound.push(otherNodes[j]);
		}
	}

	// Fix the exponentials
	for(let i = 0; i < knlEquationsVl.length; i++){
		knlEquationsVl[i] = findSubstringIndexes(knlEquationsVl[i],'e');
	}

	// Get the known node voltages (grounded supernodes)
	if(nodesInGroundedSN.length > 0){
		// Get equation index
		let gSNindex = knlEquationsVl.length;
		for(let i = 0; i < nodesInGroundedSN.length; i++){
			for(let j = gSNindex; j< knlEquations.length; j++){
				if(knlEquations[j].includes(nodesInGroundedSN[i])){
					let eq = parsegroundedSN(knlEquations[j],nodesInGroundedSN[i]);
					let nodeObj = {
						node: nodesInGroundedSN[i],
						equation: eq
					};
					inOrderEquations.push(nodeObj);
					nodeObj = {
						node: nodesInGroundedSN[i],
						value: eq
					}
					results.push(nodeObj);
				}
			}
		}
	}


	// Get direct nodes equations
	if(nonVarFound.length>0){
		// Remove duplicated nodes
		nonVarFound = [... new Set(nonVarFound)];
		// Get the Supernodes equations
		var nodesEq = new Array();
		for(let i = knlEquaCnt; i <knlEquationsVl.length; i++){
			nodesEq.push(knlEquationsVl[i]);
		}

		// Go through non variable nodes
		let nodeInstances = new Array();
		// Find the direct relationships first
		for(let i = 0; i < nonVarFound.length; i++){
			// Clear array
			nodeInstances = [];
			// Search the node instances
			for(let j = 0; j < nodesEq.length; j++ ){
				if(nodesEq[j].includes(nonVarFound[i]))
					nodeInstances.push(nodesEq[j]);
			}

			// Try to get a direct relation
			for(let j = 0; j < nodeInstances.length; j++){
				for(let unk = 0; unk < equationUnknowns.length; unk++){
					// If the unknown is found create the equation
					if(nodeInstances[j].includes(equationUnknowns[unk])){
						// Separate terms
						let str = nodeInstances[j];
						str = str.split('=');
						//Check if the node is the first term;
						if(str[0].includes(nonVarFound[i])){
							let nodeObj = {
								node: nonVarFound[i],
								equation: '('+str[1]+')'
							};
							// Save equation
							inOrderEquations.push(nodeObj);
							// Break From cycles
							unk = equationUnknowns.length;
							j = nodeInstances.length;
						}
						else{
							let nodeObj = {
								node: nonVarFound[i],
								equation: parseDirectEquation(nodeInstances[j],nonVarFound[i])
							}
							// Save equation
							inOrderEquations.push(nodeObj);
							// Break From cycles
							unk = equationUnknowns.length;
							j = nodeInstances.length;
						}
					}
				}
			}
		}


		var nodesLeft = new Array();
		var nodesEqleft = new Array();
		// Get the indirect nodes left for substitution
		for(let i = 0; i < nonVarFound.length; i++ ){
			if(!inOrderEquations.some(el => el.node === nonVarFound[i]))
				nodesLeft.push(nonVarFound[i]);
		}
		// Get the indirect nodes equations
		for(let i = 0; i < nodesLeft.length; i++){
			for(let j = 0; j < nodesEq.length; j++ ){
				if(nodesEq[j].includes(nodesLeft[i]))
					nodesEqleft.push(nodesEq[j]);
			}
		}
		// Remove duplicated
		nodesEqleft = [... new Set(nodesEqleft)];

		while(nodesLeft.length > 0){
			// Cycle through nodes left
			for(let i = 0; i < nodesLeft.length; i++){
				let nodeEq = [];
				// Get the node Equations
				for(let j = 0; j < nodesEqleft.length; j++){
					if(nodesEqleft[j].includes(nodesLeft[i]))
						nodeEq.push(nodesEqleft[j]);
				}

				// Try to find an ordered node equation
				for(let j = 0; j < nodeEq.length; j++){
					for(let k = 0; k < inOrderEquations.length; k++){
						if(nodeEq[j].includes(inOrderEquations[k].node)){
							// Replace the node with its expression
							nodeEq[j] = nodeEq[j].replace(inOrderEquations[k].node, inOrderEquations[k].equation);
							let str = parseNonDirectEquation(nodeEq[j],nodesLeft[i]);
							// Add to the parsed List
							let nodeObj = {
								node: nodesLeft[i],
								equation: str
							}
							inOrderEquations.push(nodeObj);
							nodesLeft.splice(i,1);
							i--;
							// Break from cycles
							k = inOrderEquations.length;
							j = nodeEq.length;
						}
					}
				}
			}
		}
	}

	// Get the KNL equations
	var knlSubstitutions = new Array();
	for(let i=0; i < knlEquaCnt; i++){
		knlSubstitutions.push(knlEquationsVl[i]);
	}

	// Make the substitutions
	for(let i = 0; i < knlSubstitutions.length; i++){
		for(let j = 0; j < inOrderEquations.length; j++){
			if(knlSubstitutions[i].includes(inOrderEquations[j].node)){
				let reg = new RegExp(inOrderEquations[j].node, "g");
				knlSubstitutions[i] = knlSubstitutions[i].replace(reg, inOrderEquations[j].equation);
			}
		}
	}

	// Remove the " = 0" from the equations
	var equationArray = new Array();
	for(let i = 0; i < knlSubstitutions.length; i++){
		let aux = knlSubstitutions[i].split(" = ");
		equationArray.push(aux[0]);
	}

	/* Agregate Equation Systems
		Put together the equations with common variables
		Necessary for the math.js equation solver
	*/
/*
	var equationSystems = new Array();
	var eqSystem = new Array();

	for(let i = 0; i < equationArray.length; i++){
		// Check the existing Unknowns in the equation
		let eqVar = checkEquationUnk(equationArray[i],equationUnknowns);
		let nVars = eqVar.length;
		// An equation system has always more than one variable
		if(nVars > 1){
			eqSystem.push(equationArray[i]);
			equationArray.splice(i,1);
			i--;
			// Find the other equations
			for(let k = 0; k < equationArray.length; k++){
				// If the equation includes some of the variables
				if(eqVar.some(v => equationArray[k].includes(v))){
					// Add to the array
					eqSystem.push(equationArray[k]);
					// Remove it
					equationArray.splice(k,1);
					k--;
				}
			}
			equationSystems.push(eqSystem);
			eqSystem = [];
		}
	}
*/
	/** Results object:
	 * node (string)
	 * value (string)/number
	 */

    /*

	let realNodesobj = nodes.filter(function(item) {return  item.type === 0;})
	let realNodes = realNodesobj.map(item => item.ref); 
	let nodeCnt = realNodes.length;
	let realNodesReg = new Array()
	realNodesReg = realNodesReg.concat(realNodes);
	var eqSystem = new linearEqSystem();
	// Evaluate the single variable equations
	for(let i = 0; i < equationArray.length; i++){
		eqSystem = new linearEqSystem();
		equationArray[i] = fixDoubleNamedNodes(equationArray[i],nodeSubstitutions);
		eqSystem.addEquation(equationArray[i]);
		eqSystem.buildSystem();
		let res = solve(eqSystem.coefMatrix, eqSystem.consMatrix, eqSystem.varMatrix, 3);

		let index = nodeSubstitutions.findIndex(x => x.subsNode === res.variables._data[0][0]);
		if( index != -1)
			res.variables._data[0][0] = nodeSubstitutions[index].prevNode;

		let obj = {
			node: res.variables._data[0][0],
			value: parseComplex(res.result._data[0][0]),
			unit: "V"
		}
		results.push(obj);
	}

	// Solve the equation systems
	var subEqSystem = new linearEqSystem();
	for(let i = 0; i < equationSystems.length; i++){
		for(let k = 0; k < equationSystems[i].length; k++){
			equationSystems[i][k] = fixDoubleNamedNodes(equationSystems[i][k],nodeSubstitutions);
			subEqSystem.addEquation(equationSystems[i][k]);
		}
		subEqSystem.buildSystem();
		let res = solve(subEqSystem.coefMatrix, subEqSystem.consMatrix, subEqSystem.varMatrix, 3);
		for(let k = 0; k<res.variables._data.length; k++){
			let index = nodeSubstitutions.findIndex(x => x.subsNode === res.variables._data[k][0]);
			if( index != -1)
				res.variables._data[k][0] = nodeSubstitutions[index].prevNode;
			let obj = {
				node: res.variables._data[k][0],
				value: parseComplex(res.result._data[k][0]),
				unit: "V"
			}
			results.push(obj);
		}
	}

	// Get Supernodes remaining equations
	var remainingSN = knlEquationsVl.slice(knlEquaCnt);
	//Substitute the known node voltages
	while(remainingSN.length > 0){
		for(let i = 0; i < remainingSN.length; i++){
			for(let k = 0; k < results.length; k++){
				if(remainingSN[i].includes(results[k].node)){
					remainingSN[i] = remainingSN[i].replace(results[k].node,results[k].value);
					let varNode = getSNnode(remainingSN[i],realNodesReg);
					let auxStr = parseDirectEquation(remainingSN[i],varNode);
					let parser = math.parser();
					let obj = {
						node: varNode,
						value: parser.evaluate(auxStr).toString(),
						unit: "V"
					}
					results.push(obj);
					remainingSN.splice(i,1);
					i = remainingSN.length;
					k = results.length;
				}

			}
		}
	}

	// Get currents results (For currents outside isolated VS branches)
	let resultsCurr = new Array();
	let parseCurr = math.parser();
	for(let i = 0; i<currents.length; i++){
		
		let obj = {
			ref: currents[i].ref,
			value: 0,
			eq: '',
			unit: 'A',
			fromSN: false,
			fromAC: false
		}

		if(currents[i].value == null && currents[i].ohmEquation != null){
			let equation = math.parse(currents[i].ohmEquation.plainEqVl);
			let eq = math.simplify(equation).toTex();
			equation = math.simplify(equation).toString();
			eq = currents[i].ref + " = " + eq;
			// Get TeX Equation
			for(let k = 0; k < realNodes.length; k++){        
				eq = eq.replace(new RegExp(realNodes[k], 'g'),"V_{"+realNodes[k]+'}');
			}
			// Compute Value
			for(let k = 0; k< results.length; k++){
				if(equation.includes(results[k].node))
					equation = equation.replace(results[k].node,'('+results[k].value+')');
			}
			let currentRes = parseCurr.evaluate(equation).toString();
			obj.value = currentRes;
			obj.eq = eq;
		}
		else{
			obj.value = currents[i].value;
			obj.eq = currents[i].ref + " = " + currents[i].value;
			if(obj.value!= null)
				obj.fromAC = true;
		}
		resultsCurr.push(obj);
	}

	// Get the remaining currents (from SN branches)
	while(resultsCurr.filter(function(item) {return  item.value === null;}).length > 0){
		for(let i = 0; i< resultsCurr.length; i++){
			if(resultsCurr[i].value == null){
				//Find the current ID
				let index = currents.findIndex(curr => curr.ref == resultsCurr[i].ref);
				for(let k = 0; k< currents[index].nodeEquations.length; k++){
					let nodeEq = currents[index].nodeEquations[k];
					let isValid = true;
					let neededCurrents = new Array();
					let neededCurrValues = new Array();
					for(let j = 0; j< nodeEq.eqObj.minusCurr.length; j++){
						// Check if each current already has value
						let currIndex = resultsCurr.findIndex(curr => curr.ref == nodeEq.eqObj.minusCurr[j]);
						if(nodeEq.eqObj.minusCurr[j] != resultsCurr[i].ref){
							neededCurrents.push(nodeEq.eqObj.minusCurr[j]);
							neededCurrValues.push(resultsCurr[currIndex].value);
						}
						if(resultsCurr[currIndex].value == null && nodeEq.eqObj.minusCurr[j] != resultsCurr[i].ref){
							isValid = false;
							break;
						}
					}
					for(let j = 0; j< nodeEq.eqObj.plusCurr.length; j++){
						let currIndex = resultsCurr.findIndex(curr => curr.ref == nodeEq.eqObj.plusCurr[j]);
						if(nodeEq.eqObj.plusCurr[j] != resultsCurr[i].ref){
							neededCurrents.push(nodeEq.eqObj.plusCurr[j]);
							neededCurrValues.push(resultsCurr[currIndex].value);
						}
						if(resultsCurr[currIndex].value == null && nodeEq.eqObj.plusCurr[j] != resultsCurr[i].ref){
							isValid = false;
							break;
						}
					}

					// If the current is valid, assign the equation and compute value
					if(isValid == true){
						resultsCurr[i].eq = math.parse(nodeEq.fullPlainEq).toString();
						let equation = nodeEq.plainEq;
						let scope = {};
						for(let j = 0; j< neededCurrents.length; j++){
							// Create scope
							//scope[neededCurrents[j]] = neededCurrValues[j];
							equation = equation.replace(neededCurrents[j],'('+neededCurrValues[j]+')');
						}
						resultsCurr[i].value = math.evaluate(equation).toString();
						resultsCurr[i].fromSN = true;
						// Move to the last index
						resultsCurr.push(resultsCurr.splice(i, 1)[0]);
						break;
					}
				}
			}
		}
	}


	// Set up a scale for node voltages results
	let nodeVoltages = results.map(a => a.value);
	// Remove parenthesis
	for(let i = 0; i< nodeVoltages.length; i++){
		nodeVoltages[i] = nodeVoltages[i].replace(/[()]/g, '');
	}
	let nodeUnits = new Array();
	// Check the values magnitude
	for(let i = 0; i < nodeVoltages.length; i++){
		// Check number of zeros after comma
		let value = Math.abs(parseFloat(nodeVoltages[i]));
		let decimals = - Math.floor( Math.log(value) / Math.log(10) + 1);
		if(decimals < 2 || value >= 1 || value == 0)
			nodeUnits.push("V");
		else if(decimals < 4 && value < 1)
			nodeUnits.push("mV");
		else
			nodeUnits.push("uV");
	}

	// Get the most frequent unit in the results
	let unit = findMode(nodeUnits);

	// Do the conversion and round it to 3 decimal places
	for(let i = 0; i < nodeVoltages.length; i++){
		results[i].value = voltConversion(nodeVoltages[i],unit,3);
		results[i].unit = unit;
	}


	// Set up a scale for currents results
	nodeUnits = [];
	// Check the values magnitude
	for(let i = 0; i < resultsCurr.length; i++){
		// Check number of zeros after comma
		let value = Math.abs(parseFloat(resultsCurr[i].value));
		let decimals = - Math.floor( Math.log(value) / Math.log(10) + 1);
		if(decimals < 2 || value >= 1 || value == 0)
			nodeUnits.push("A");
		else if(decimals < 4 && value < 1)
			nodeUnits.push("mA");
		else
			nodeUnits.push("uA");
	}

	// Get the most frequent unit in the results
	unit = findMode(nodeUnits);

	// Do the conversion and round it to 3 decimal places
	for(let i = 0; i < resultsCurr.length; i++){
		resultsCurr[i].value = ampConversion(resultsCurr[i].value.toString(),unit,3);
		resultsCurr[i].unit = unit;
	}	
	
	// Prepare supernodes Equations for steps (Floating)
	let snEquations = knlEquations.splice(knlEquaCnt);
	let doneNodes = new Array();
	let SNFobjects = new Array();
	
	for(let i = 0; i< supernodes.length; i++){
		if(supernodes[i].type == 1){
			supernodes[i].SNFs = new Array();
			let nodesInSN = supernodes[i].nodes.map(item => item.ref);
			// Get the Unknown Node
			let unknown = nodesInSN.filter(element => equationUnknowns.includes(element));
			unknown = unknown[0];
			// Remove it from nodes
			realNodes = realNodes.filter(e => e !== unknown);
			while(doneNodes.length < supernodes[i].nodes.length-1){
				for(let k = 0; k < snEquations.length; k++){
					if(snEquations[k].includes(unknown)){
						// Find the other node to solveFor
						let node = realNodes[searchNode(snEquations[k],realNodes)];
						let expr = algebra.parse(snEquations[k]);
						let obj = {
							ref: node,
							equation: '('+expr.solveFor(node).toString()+')'
						};
						SNFobjects.push(obj);
						doneNodes.push(node);
						snEquations.splice(k,1);
						k--;
					}
					else if(searchNode(snEquations[k],doneNodes) > -1){
						let nodeindex = searchNode(snEquations[k],doneNodes);
						snEquations[k] = snEquations[k].replace(doneNodes[nodeindex], SNFobjects[nodeindex].equation)
					}
				}
			}

			for(let j = 0; j<SNFobjects.length; j++){
				let aux = math.parse(SNFobjects[j].equation);
				SNFobjects[j].equation = math.simplify(aux,{}, {exactFractions: false}).toTex();
				SNFobjects[j].equation = SNFobjects[j].equation.replace("+-","-");
				SNFobjects[j].equation = SNFobjects[j].equation.replace("--","+");
			}
			supernodes[i].SNFs = SNFobjects;
			SNFobjects = [];
			doneNodes = [];
		}
	}

	// Prepare supernodes Equations for steps (Grounded)
	let SNGobjects = new Array();
	let nodesToSearch = new Array();

	for(let i = 0; i< supernodes.length; i++){
		if(supernodes[i].type == 0){
			supernodes[i].SNGs = new Array();
			let foundNodes=new Array();
			// Get all nodes
			nodesToSearch = supernodes[i].nodes.map(item => item.ref);
			// Start off with ground
			let gndIndex = supernodes[i].nodes.findIndex(node => node.ref == "gnd");
			nodesToSearch.splice(nodesToSearch.indexOf("gnd"),1);
			let completeFlag = 0;
			for(let k = 0; k< supernodes[i].nodes[gndIndex].branches.length; k++){
				let branch = supernodes[i].nodes[gndIndex].branches[k];
				if(nodesToSearch.includes(branch.startNode)){
					foundNodes.push(branch.startNode);
					let equation = "V_{" + branch.startNode + "} = 0";
					for(let j = 0; j< branch.endVoltPsEndNodes.length; j++){
						if(branch.endVoltPsEndNodes[j].endNode == branch.startNode){
							equation += " + " + branch.endVoltPsEndNodes[j].voltPsRef;
							completeFlag = 1;
						}
						else{
							equation += " - " + branch.endVoltPsEndNodes[j].voltPsRef;
							completeFlag = 1;
						}

					}
					if(completeFlag == 1){
						let obj = {
							node: branch.startNode,
							equation: equation
						}
						SNGobjects.push(obj);
						completeFlag = 0;
					}
				}
				else if( nodesToSearch.includes(branch.endNode)){
					foundNodes.push(branch.endNode);
					let equation = "V_{" + branch.endNode + "} = 0";
					for(let j = 0; j<  branch.endVoltPsEndNodes.length; j++){
						if( branch.endVoltPsEndNodes[j].endNode == branch.endNode){
							equation += " + " +  branch.endVoltPsEndNodes[j].voltPsRef;
							completeFlag = 1;
						}
						else{
							equation += " - " +  branch.endVoltPsEndNodes[j].voltPsRef;
							completeFlag = 1;
						}
					}
					if(completeFlag == 1){
						let obj = {
							node: branch.endNode,
							equation: equation
						}
						SNGobjects.push(obj)
						completeFlag = 0;
					}
				}
			}

			// Remove the nodes with a equation already created
			for(let k = 0; k<foundNodes.length; k++){
				nodesToSearch.splice(nodesToSearch.indexOf(foundNodes[k]),1);
			}
			// Complete the grounded supernode remaining nodes
			for(let k = 0; k<nodesToSearch.length; k++){
				// Find node object
				let nodeIndex = supernodes[i].nodes.findIndex(node => node.ref == nodesToSearch[k]);
				for(let j = 0; j< supernodes[i].nodes[nodeIndex].branches.length; j++){
					let branch = supernodes[i].nodes[nodeIndex].branches[j];
					// Find a connection
					let findNext = SNGobjects.findIndex(n => n.node == branch.startNode);
					let foundisolPS = false;
					if(branch.dcVoltPwSupplies.length > 0){
						if(isolatedPsReg.findIndex(item => item.ref == branch.dcVoltPwSupplies[0].ref) > -1)
							foundisolPS = true;
					} 
					if(branch.acVoltPwSupplies.length > 0 && foundisolPS == false){
						if(isolatedPsReg.findIndex(item => item.ref == branch.acVoltPwSupplies[0].ref) > -1)
							foundisolPS = true;
					} 
					if(findNext > -1 && foundisolPS == true){
						let equation = "V_{" + nodesToSearch[k] + "} = V_{" + SNGobjects[findNext].node +"}";
						for(let f = 0; f<  branch.endVoltPsEndNodes.length; f++){
							if( branch.endVoltPsEndNodes[f].endNode == nodesToSearch[k])
								equation += " + " +  branch.endVoltPsEndNodes[f].voltPsRef;
							else
								equation += " - " +  branch.endVoltPsEndNodes[f].voltPsRef;
						}
						let obj = {
							node: nodesToSearch[k],
							equation: equation
						}
						SNGobjects.push(obj);
						break;
					}
					findNext = SNGobjects.findIndex(n => n.node == branch.endNode);
					if(findNext > -1 && foundisolPS == true){
						let equation = "V_{" + nodesToSearch[k] + "} = V_{" + SNGobjects[findNext].node +"}";
						for(let f = 0; f<  branch.endVoltPsEndNodes.length; f++){
							if( branch.endVoltPsEndNodes[f].endNode == nodesToSearch[k])
								equation += " + " +  branch.endVoltPsEndNodes[f].voltPsRef;
							else
								equation += " - " +  branch.endVoltPsEndNodes[f].voltPsRef;
						}
						let obj = {
							node: nodesToSearch[k],
							equation: equation
						}
						SNGobjects.push(obj);
						break;
					}
				}
			}
			supernodes[i].SNGs = SNGobjects;
			SNGobjects = [];
		}
	}

	// Compute any remaining equations
	let leftNodes = new Array();
	for(let i = 0; i< isolatedPsElemReg.length; i++){
		if((inOrderEquations.findIndex(x => x.node == isolatedPsElemReg[i]) < 0) && 
		   (!equationUnknowns.includes(isolatedPsElemReg[i])) && (isolatedPsElemReg[i]!="gnd"))
				leftNodes.push(isolatedPsElemReg[i])
	}

	for(let j = 0; j< leftNodes.length; j++){
		for(let i = 0; i< nodesEq.length; i++){
			if(nodesEq[i].includes(leftNodes[j])){
				for(let k = 0; k<inOrderEquations.length; k++){
					if(nodesEq[i].includes(inOrderEquations[k].node)){
						let strEquation = nodesEq[i];
						strEquation = strEquation.replace(inOrderEquations[k].node, inOrderEquations[k].equation);
						strEquation = algebra.parse(strEquation);
						strEquation = strEquation.solveFor(leftNodes[j]).toString();
						
						let obj = {
							node: leftNodes[j],
							equation: strEquation
						}
						inOrderEquations.push(obj);
						break;
					}
				}
			}
		}
	}

	// Get Knl Currents Data
	let knlCurrData = outCurrentsKNL(knlCurrEquations,supernodes);

	// Fix decimal places at substitutions
	for(let i = 0; i< knlSubstitutions.length; i++)
		knlSubstitutions[i] = fixDecimals(knlSubstitutions[i],3);
	for(let i = 0; i< knlEquationsVl.length; i++)
		knlEquationsVl[i] = fixDecimals(knlEquationsVl[i],3);
	for(let i = 0; i< resultsCurr.length; i++)
		resultsCurr[i].eq = fixDecimals(resultsCurr[i].eq,3);
	
	// Get equation system
	let knlSimplified = new Array();
	knlSimplified = knlSimplified.concat(knlSubstitutions);
	math.type.Fraction.REDUCE = false;
	for(let i = 0; i< knlSimplified.length; i++){
		// Remove = 0
		knlSimplified[i] = knlSimplified[i].replace(/\s+/g, '');
		knlSimplified[i] = knlSimplified[i].replace('=0', '');
		knlSimplified[i] = math.parse(knlSimplified[i]);
		knlSimplified[i] = math.simplify(knlSimplified[i]).toString();
		knlSimplified[i] = fixEquation(knlSimplified[i]);
		knlSimplified[i] = math.simplify(knlSimplified[i]).toTex();
		knlSimplified[i] = fixEquation(knlSimplified[i]);
		knlSimplified[i] = fixDecimals(knlSimplified[i],3);
	}

	// Substitute Node names with their Voltages
	knlSimplified = nodesToVoltagesTex(knlSimplified,realNodesReg);

	// Get Equivalent Impedances and Voltages
	let equivBranchesR = branches.map(branch => branch.equivImpedance);
	let equivBranchesV = branches.map(branch => branch.equivVoltPs);
	let equivEndNodes = {
		startNodes : branches.map(branch => branch.startNode),
		endNodes   : branches.map(branch => branch.endNode)
	};
	
	// Debug JSON Output
	var circuitFrequency = { value: circuitAnalData.frequency.value, mult: circuitAnalData.frequency.mult }
	var componentsObj = { resistors: resistors, coils: coils, capacitors: capacitors, dcVoltPs: dcVoltPs, dcAmpsPs: dcAmpsPs, acVoltPs: acVoltPs, acAmpsPs: acAmpsPs };
	var probesObj = { amperemeters: ampsMeters, voltmeters: voltMeters };
	var analysisObj = {
		_00_circuitFreq: circuitFrequency,
		_01_currents: currents,
		_02_isolatedPs: isolatedPsReg,
		_03_supernodes: {
			_01_data: supernodes,
			_02_floatingSnInfo: {
				_01_endPoints: superNodesEndPointsReg,
				_02_fullVoltRelat: superNodeFloatingVoltRelationReg,
				_03_filteredVoltRelat: superNodeFloatingVoltRelation
			}
		},
		_04_bestGndPos: bestSuperNodeGndPos,
		_05_knlEquations: {
			_01_equatCnt: {
					_01_nodesCnt: realNodesElem.length,
					_02_isolPsCnt: isolatedPsReg.length,
					_03_calc: 'knlEq = ' + realNodesElem.length + ' - 1 - ' + isolatedPsReg.length,
					_03_equatCnt: knlEquaCnt,
					_04_eqUnknowns: equationUnknowns
			},
			_02_origEquatElem: knlFilteredEquations,
			_03_allKnlEquations: knlEquationsReg,
			_04_substitutions: stepSubstitutionsReg,
			_05_workedEquationElem: knlCurrEquations,
			_06_workedOhmEqSubsElem: knlSystemEquationsReg,
			_07_fullKnlEquatSytem: knlEquations,
			_08_knlEquationsVl: knlEquationsVl,
			_09_substitutions: knlSubstitutions,

		},
		_06_resultsData: {
			_01_orderedCurrents: knlOrderedCurrents,
			_02_simplifiedEqSystem: knlSimplified,
			_03_nodeVoltages:results,
			_04_circuitCurrents: resultsCurr
		}

	};
	var outputJson = {
		_01_components: componentsObj,
		_02_probes: probesObj,
		_03_nodes: nodes,
		_04_branches: branches,
		_05_analysisObj: analysisObj
	};

	let jsonStr = JSON.stringify(outputJson);

    */
	
	/*var treeWrap = document.getElementById("results-json");
	treeWrap.innerHTML='';
	var tree = jsonTree.create({}, treeWrap);
	var temp;
	try {
		temp = JSON.parse(jsonStr);
	} catch(e) {
		alert(e);
	}
	tree.loadData(temp);*/

    /*

	// TeX Fundamental Vars
	let N = nodeCnt-1-isolatedPsReg.length;
	let I = acAmpsPs.length+dcAmpsPs.length;
	TeX += "\\section{Fundamental Variables}\r\n\r\n\\begin{table}[hbt!]\r\n\\centering\r\n\\begin{tabular}{clclclc}\r\n";
	TeX += "\\textbf{Branches {[}R{]}}&&\\textbf{Nodes {[}N{]}}&&\\textbf{Isolated Voltage Sources {[}T{]}}&&\\textbf{Equations {[}E{]}} \\\\\r\n";
	TeX += "R="+branches.length+"&&N="+nodeCnt+"&&T="+isolatedPsReg.length+"&&E=N-T-1="+N+"\r\n\\end{tabular}\r\n\\end{table}\r\n\r\n";

	// TeX Circuit Information
	TeX += "\\section{Circuit Information}\r\n\r\n\\begin{table}[h!]\r\n\\centering\r\n\\begin{tabular}{clclclc}\r\n";
	TeX += "\\textbf{Frequency {[}F{]}} &  & \\textbf{Current Sources {[}I{]}} &  & \\textbf{Ammeters {[}A{]}} &  & \\textbf{Simulation {[}AC\/DC{]}} \\\\\r\n";
	TeX += "F="+circuitAnalData.frequency.value+"\\;"+circuitAnalData.frequency.mult+" & & I="+I;
	TeX += " & & "+ampsMeters.length+"\/"+currents.length+" & &";
	if(circuitAnalData.frequency.value == 0)
	 	TeX += "DC\r\n\\end{tabular}\r\n\\end{table}\r\n\r\n\\pagebreak";
	else
		TeX += "AC\r\n\\end{tabular}\r\n\\end{table}\r\n\r\n\\pagebreak";
	
	let knlV1 = knlEquationsVl;
	// Get Equation System Steps
	let step1 = outStep1(knlOrderedCurrents.original);
	let step2 = outStep2(knlOrderedCurrents.subs);
	let step3 = outStep3(currents,knlCurrData.second);
	let step4 = outStep4(knlEquations,realNodesReg);
	let step5 = outStep5(knlV1.splice(0,knlEquations.length),realNodesReg);
	let step6 = outStep6(supernodes,equationUnknowns);
	
	// Print Output Data
	$('#fundamentalVars').html(outCircuitFundamentals(branches.length, nodeCnt, isolatedPsReg.length));
	$('#circuitInfo').html(outCircuitInfo(circuitAnalData.frequency,acAmpsPs.length+dcAmpsPs.length,ampsMeters.length,currents.length));
	let supernodesOutput = outSupernodes(supernodes, inOrderEquations, knlV1);
	$('#supernodes').html(supernodesOutput.first);
	$('#KNLEquations').html(knlCurrData.first);
	let canvasObjects = createCanvasCurrents(knlCurrData.second);
	let currentsInfoOutput = outCurrentsInfo(currents, branches);
	$('#currentsInfo').html(currentsInfoOutput.first);
	let equivImpOutput = outEqImpedances(equivBranchesR,equivBranchesV,equivEndNodes);
	$('#eqImpedances').html(equivImpOutput.first);
	let equationSystemOutput = outEquationSystem(knlSimplified, step1.first, step2.first, step3.first, step4.first, step5.first, step6.first);
	$('#eqSys').html(equationSystemOutput.first);
	let resultsOutput = outResults(results, resultsCurr)
	$('#resultsVoltages').html(resultsOutput.first);
	$('#buttonShowAll').html(outShowAllBtn(supernodesOutput.second));

	// TeX Data
	if(supernodes.length>0)
		TeX += "\\section{Supernodes}\r\n\r\n"+supernodesOutput.third+"\\pagebreak";
	TeX += "\\section{Circuit Currents}\r\n\r\n\\subsection{General information}\r\n\r\n";
	TeX += "\\begin{table}[ht]\r\n\\caption{List of the circuit currents and its properties\/components}\r\n\\centering\r\n\\begin{tabular}{cccc}\r\n";
	TeX += "\\textbf{Reference} & \\textbf{Start Node} & \\textbf{End Node} & \\textbf{Components} \\\\ \\hline\r\n";
	TeX += currentsInfoOutput.second + "\\end{tabular}\r\n\\end{table}\r\n\r\n";
	TeX += equivImpOutput.second + "\\pagebreak";
	TeX += "\\subsection{Equations}\r\nEquations using the Kirchhoff Nodes Law (KNL)\r\n\r\n" + knlCurrData.third;
	TeX += "\\pagebreak\\section{Equation System}\r\n\r\n\\paragraph{} " + equationSystemOutput.second;
	TeX += "Steps:\r\n\r\n" + step1.second + step2.second + step3.second + step4.second + step5.second + step6.second;
	TeX += "\\par\r\n\r\n\\pagebreak\r\n\r\n\\section{Results}\r\n\r\n" + resultsOutput.second;
	TeX += "\\end{document}\r\n";

	let copyTeX = TeX;

	// Turn the viz. on
	$("#contResults").show();
	$("#loadpage").fadeOut(1000);
    $("#results").show();
	$('#results-modal').modal('show');
	
	// Toggle plus minus icon on show hide of collapse element
	for(let i = 0; i<7; i++){
		$( "#btn-"+i ).click(function() {
			$(this).find("i").toggleClass("fas fa-plus fas fa-minus");
		});
	}

	$( "#showALL").click(function() {
		for(let i = 0; i<7; i++){
			$("#btn-"+i).children('.fa-minus, .fa-plus').toggleClass("fas fa-minus fas fa-plus");

		}
	});


	// Export JSON File
	$("#json").off().on('click', function() {
		const filename = 'urisolve_results.json';
		let element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
		element.setAttribute('download', filename);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	  });
	
	// Export TeX File
	$("#tex").off().on('click', function() {
		const filename = 'urisolve_results.tex';
		let element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(TeX));
		element.setAttribute('download', filename);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	  });


	// Export PDF File
	$("#pdfPrintButton").off().on('click', function() {
		//Get User info
		let studName = document.getElementById('output-name').value;
		let studLastname = document.getElementById('output-lastname').value;
		let studNumber = document.getElementById('output-number').value
		// Get Simulation Time
		let hourstr = new Date().getHours();
		let minstr = new Date().getMinutes();
		if(hourstr.toString().length < 2)
			hourstr = "0" + hourstr;
		if(minstr.toString().length < 2)
			minstr = "0" + minstr;
		hourstr = hourstr + ":" + minstr;
		TeX = copyTeX;
		//Print TeX (Temporary - Index 1264 - texfile cannot be change before it)
		if(studNumber.length>1 && studLastname.length > 1 && studNumber.length>1){
			let string = "\\vspace{0.5cm}\\centering{ \r\n Simulation performed by: \\textbf{ "+studName+" "+studLastname+" ("+studNumber+")}} "
			string += " at " + hourstr + "\r\n";
			TeX = TeX.slice(0,1264) + string + TeX.slice(1265);
		}
		// Instanciate printer object
        docToPrint = new latexprinter(null, 'printLnk', 'pdfPrintButton');
        // Add the desired Latex Source Code
        docToPrint.setTexFile(TeX);
		// Add Logo Image
		let sampleimg = base64imgselect("logo");
		docToPrint.addImgFile('logo.jpg', sampleimg);
		// Add Circuit Image
		if(fileContents[0]){
			let imageObj = new Image();
			imageObj.src = fileContents[0];
			sampleimg = resizeandgray(imageObj);
			docToPrint.addImgFile('circuit.jpg', sampleimg);
		}
		// Add Canvas Images
		for(let i = 0; i< canvasObjects.length; i++){
			docToPrint.addImgFile(canvasObjects[i].id+'.jpg',canvasObjects[i].dataURL)
		}
		docToPrint.print();
		
	});

	// Refresh fileContents
	document.getElementById("fileInput").value = "";
	
	// Update Dictionary Language
	let language = document.getElementById("lang-sel-txt").innerText.toLowerCase();
	if(language == "english")
		set_lang(dictionary.english);
	else	
		set_lang(dictionary.portuguese);
    */

}





