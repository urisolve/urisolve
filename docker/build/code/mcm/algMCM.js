
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
	const substitutions = "abcdfghjklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVYXYZ"
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
								malhas_escolhidas.push(new mesh(malhas_escolhidas.length+1, 0, malhas[j], i+1, temp, null));
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
	let index = 0;
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
				malhas_escolhidas.push(new mesh(malhas_escolhidas.length+1, 1, malhas[i], -1, null, substitutions.charAt(index)));
				index++;
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
					malhas_escolhidas.push(new mesh(malhas_escolhidas.length+1, 1, malhas[c], -1, [], substitutions.charAt(index)));
					index++;
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

/**
 * Determines if a component is in the same way of his branch
 * @param {Array} componente component to determine
 * @param {Int} ramo branch
 * @param {Array} componentesRamo list of components in that branch
 * @returns boolean, true if adjacent
 */
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

/**
 * Determines the direction of the branches and the global direction the meshes should go (according to the current source)
 * @param {Array} malhas meshes
 * @returns {Array} the same meshes array updated
 */
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
				if(aux.dcAmpPwSupplies[0].globalNoP == branches[malha.branchWithCurSrc-1].endNode){
					if(malha.branchesDir[malha.branches.indexOf(malha.branchWithCurSrc)] == -1) trocar = true;
				}
				else{
					if(malha.branchesDir[malha.branches.indexOf(malha.branchWithCurSrc)] == 1) trocar = true;	
				}
			}
			else{																//fonte de corrente é ac
				if(aux.acAmpPwSupplies[0].globalNoP == branches[malha.branchWithCurSrc-1].endNode){
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

/**
 * Determines which mesh currents pass through each branch
 * @param {Array} malhas meshes
 * @returns {Array} the same meshes array updated
 */
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

/**
 * Encounters all the mesh components, in order
 * @param {Array} malhas meshes
 * @returns {Array} the same meshes array updated
 */
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
							if(!(aux.amperemeter === componentesRamo[i])) add = true;
							break;
						}
						else if(componentesRamo[i].noN == searchNode){	//caso extermidade negativa
							ladoNegativo = 1;
							searchNode = componentesRamo[i].noP;	//próximo searchNode é o nó positivo
							if(!(aux.amperemeter === componentesRamo[i])) add = true;
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

/**
 * Builds the Equation Data
 * @param {Array} malhas meshes
 * @returns {Array} the same meshes array updated
 */
function parseEqData(malhas){
	malhas.forEach(malha => {	//para cada malha
		if(malha.type == 1){	//se a malha é principal
			let ladoEsq = [];
			let ladoDir = [];
			if(malha.componentsLeft.length == 0) ladoEsq = 0;	//se nao há fontes o lado esquerdo é 0
			else{
				for(let i = 0; i < malha.componentsLeft.length; i++){		//para cada fonte
					ladoEsq.push({ref: malha.componentsLeft[i][0].ref, value: malha.componentsLeft[i][0].value, uni: malha.componentsLeft[i][0].unitMult, sig: malha.componentsLeft[i][1]}); //adicionar componente ao lado esquerdo
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
					ladoDir[i].ref = componente[0].ref;
					ladoDir[i].value = componente[0].value;
					ladoDir[i].uni = componente[0].unitMult;
					ladoDir[i].meshCurrents = branches[componente[1]-1].meshCurr;
					let sentidos = [];
					let self = malha.branchesDir[malha.branches.indexOf(componente[1])];
					ladoDir[i].meshCurrents.forEach(curMalha => {
						sentidos.push(self * malhas[curMalha-1].branchesDir[malhas[curMalha-1].branches.indexOf(componente[1])]);
					});
					ladoDir[i].meshCurrentSig = sentidos;
				}					
			}
			malha.equationData = {left: ladoEsq, right: ladoDir};		//parse eq info
		}
	});
	return{
		first: false,
		second: 0,
		third: malhas
	}
}

/**
 * Builds the equations
 * @param {Array} malhas meshes
 * @returns {Array} the same meshes array updated
 */
function buildEq(malhas){
	malhas.forEach(malha => {												//para cada malha
		if(malha.type == 1){												//se a malha é principal
			if(malha.equationData.left == 0){									//se nao houverem fontes de tensão
				malha.incognitoEq = malha.incognitoEq.concat('0');
				malha.revealedCurrSrc = malha.revealedCurrSrc.concat('0');
				malha.revealedEq = malha.revealedEq.concat('0');
			}
			else{ 															//se houverem fontes de tensão
				for(let i = 0; i < malha.equationData.left.length; i++){		//percorrer as fontes de tensão
					let fonte = malha.equationData.left[i];					//fonte
					if(fonte.sig == -1){										
						malha.incognitoEq = malha.incognitoEq.concat('-');
						malha.revealedCurrSrc = malha.revealedCurrSrc.concat('-');
						malha.revealedEq = malha.revealedEq.concat('-');
						if(i != 0){
							malha.solverEq = malha.solverEq.concat("+");
						}
					}
					else{
						malha.solverEq = malha.solverEq.concat("-");
						if(i != 0){
							malha.incognitoEq = malha.incognitoEq.concat('+');
							malha.revealedCurrSrc = malha.revealedCurrSrc.concat('+');
							malha.revealedEq = malha.revealedEq.concat('+');
						}
					}
					malha.incognitoEq = malha.incognitoEq.concat(fonte.ref);
					malha.revealedCurrSrc = malha.revealedCurrSrc.concat(fonte.ref);
					malha.revealedEq = malha.revealedEq.concat(fonte.value);
					malha.solverEq = malha.solverEq.concat(fonte.value);
					if(fonte.uni != "V"){
						let unit;
						switch(fonte.unit){
							case "mV":
								unit = 0.001;
								break;
						}
					}
				}
			}			
			malha.incognitoEq = malha.incognitoEq.concat('=');						//igualdade
			malha.revealedCurrSrc = malha.revealedCurrSrc.concat('=');
			malha.revealedEq = malha.revealedEq.concat('=');
			for(let i = 0; i < malha.equationData.right.length; i++){				//lado direito equação
				if(malha.solverEq != "") malha.solverEq = malha.solverEq.concat("+");
				componente = malha.equationData.right[i];
				if(i != 0){
					malha.incognitoEq = malha.incognitoEq.concat('+');
					malha.revealedCurrSrc = malha.revealedCurrSrc.concat('+');
					malha.revealedEq = malha.revealedEq.concat('+');
				}
				malha.incognitoEq = malha.incognitoEq.concat(componente.ref, '*(');
				malha.revealedCurrSrc = malha.revealedCurrSrc.concat(componente.ref, '*(');
				malha.revealedEq = malha.revealedEq.concat(componente.value);
				malha.solverEq = malha.solverEq.concat(componente.value);
				
				if(!(componente.uni.search("m") == -1) && (componente.uni != "Ohm")){
					malha.revealedEq = malha.revealedEq.concat("*0.001");
					malha.solverEq = malha.solverEq.concat("*0.001");
				} 
				else if(!(componente.uni.search("u") == -1)){
					malha.revealedEq = malha.revealedEq.concat("*0.000001");
					malha.solverEq = malha.solverEq.concat("*0.000001");	
				}
				else if(!(componente.uni.search("k") == -1)){
					malha.revealedEq = malha.revealedEq.concat("*1000");
					malha.solverEq = malha.solverEq.concat("*1000");	
				} 
				else if(!(componente.uni.search("M") == -1)){
					malha.revealedEq = malha.revealedEq.concat("*1000000");	
					malha.solverEq = malha.solverEq.concat("*1000000");
				} 

				malha.revealedEq = malha.revealedEq.concat('*(');
				malha.solverEq = malha.solverEq.concat('*(');

				for(let j = 0; j < componente.meshCurrentSig.length; j++){
					if(componente.meshCurrentSig[j] == -1){
						malha.incognitoEq = malha.incognitoEq.concat('-');
						malha.revealedCurrSrc = malha.revealedCurrSrc.concat('-');
						malha.revealedEq = malha.revealedEq.concat('-');
						malha.solverEq = malha.solverEq.concat('-');
					}
					else{
						if(j != 0){
							malha.incognitoEq = malha.incognitoEq.concat('+');
							malha.revealedCurrSrc = malha.revealedCurrSrc.concat('+');
							malha.revealedEq = malha.revealedEq.concat('+');
							malha.solverEq = malha.solverEq.concat('+');
						}
					}
					if(malhas[componente.meshCurrents[j]-1].type == 0){
						malha.revealedCurrSrc = malha.revealedCurrSrc.concat(malhas[componente.meshCurrents[j]-1].currentSource.value);
						malha.revealedEq = malha.revealedEq.concat(malhas[componente.meshCurrents[j]-1].currentSource.value);
						malha.solverEq = malha.solverEq.concat(malhas[componente.meshCurrents[j]-1].currentSource.value);
						switch(malhas[componente.meshCurrents[j]-1].currentSource.unitMult){
							case "A":
								break;
							case "mA":
								malha.revealedEq = malha.revealedEq.concat("*0.001");
								malha.solverEq = malha.solverEq.concat("*0.001");
								break;
							case "uA":
								malha.revealedEq = malha.revealedEq.concat("*0.000001");
								malha.solverEq = malha.solverEq.concat("*0.000001");
								break;
							default:
								break;

						}
					}
					else{
						malha.revealedCurrSrc = malha.revealedCurrSrc.concat('I', componente.meshCurrents[j], componente.meshCurrents[j]);	
						malha.revealedEq = malha.revealedEq.concat('I', componente.meshCurrents[j], componente.meshCurrents[j]);
						malha.solverEq = malha.solverEq.concat(malhas[componente.meshCurrents[j]-1].letterId);
					}
					malha.incognitoEq = malha.incognitoEq.concat('I', componente.meshCurrents[j], componente.meshCurrents[j]);
				}
				malha.incognitoEq = malha.incognitoEq.concat(')');
				malha.revealedCurrSrc = malha.revealedCurrSrc.concat(')');
				malha.revealedEq = malha.revealedEq.concat(')');
				malha.solverEq = malha.solverEq.concat(')');
			}
		}
	});
	return{
		first: false,
		second: 0,
		third: malhas
	}
}

/**
 * Solves the equations
 * @param {Array} malhas meshes
 * @returns {Array} the same meshes array updated
 */
function solver(malhas){;
	
	let system = new linearEqSystem();
	malhas.forEach(malha => {
		if(malha.type == 1) system.addEquation(malha.solverEq);		//build equations
	});
	system.buildSystem();
	let results = solve(system.coefMatrix, system.consMatrix, system.varMatrix, 5);	//solve system

	let temp = [];
	results.variables._data.forEach(variable => {
		temp.push(variable[0]);
	});

	malhas.forEach(malha => {
		if(malha.type == 0){ 	//malha é auxiliar
			malha.currValue = malha.currentSource.value;
			malha.currMult = malha.currentSource.unitMult;
		}
		else{					//malha é principal
			malha.currValue = results.result._data[temp.indexOf(malha.letterId)][0].re;
			malha.currMult = 'A';

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
	currents = jsonFile.currents;

	// Identify MCM Equations
	var MEquaCnt = branches.length - countNodesByType(nodes, 0) + 1 - (components.dcAmpsPs.length + components.acAmpsPs.length);

	console.log("São precisas " + MEquaCnt + " equações");

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

	//organiza informação das malhas em cada objeto malha
	malhas_escolhidas = parseEqData(malhas_escolhidas.third);
	if(malhas_escolhidas.first){
		alert(malhas_escolhidas.third);
		return;
	}

	//constrói três equações: com incógnitas, com as fontes de corrente reveladas, e com tudo revelado
	malhas_escolhidas = buildEq(malhas_escolhidas.third);
	if(malhas_escolhidas.first){
		alert(malhas_escolhidas.third);
		return;
	}

	//resolve as equações
	malhas_escolhidas = solver(malhas_escolhidas.third);
	if(malhas_escolhidas.first){
		alert(malhas_escolhidas.third);
		return;
	}

	/*

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





