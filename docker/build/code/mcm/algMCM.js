include('code/common/outPrintMCM.js');

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
function chooseMeshes(malhas, nr_malhas_principais){
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

	let auxCnt = 0;

	//Escolha de C malhas auxiliares
	for(let i = 0; i < ramos_fontecorrente_flags.length; i++){  //para cada fonte de corrente
		if(ramos_fontecorrente_flags[i] == 1){					//Se o ramo contém fonte de corrente
			let escolhido = false;
			while(!escolhido){
				for(let j = 0; j < malhas.length; j++){			//percorrer o array das malhas
					if(malhas_flags[j] == 0){					//se a malha estiver disponível
						for(let k = 0; k < malhas[j].length; k++){ //para cada ramo da malha
							if(malhas[j][k] == i+1){				//se tiver o ramo com a fonte de corrente em questão
								/*
								for(let m = 0; m < malhas[j].length; m++){
									ramos_flags[malhas[j][m]-1] = 1;
								}
								*/
								ramos_flags[malhas[j][i+1]-1] = 1;

								malhas_flags[j] = 1;
								let temp;
								if(branches[i].dcAmpPwSupplies.length != 0) temp = branches[i].dcAmpPwSupplies[0];
								else temp = branches[i].acAmpPwSupplies[0];
								auxCnt++;
								malhas_escolhidas.push(new mesh(malhas_escolhidas.length+1, 0, malhas[j], i+1, temp, null, auxCnt));
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

	let mainCnt = 0;

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
				mainCnt++;
				malhas_escolhidas.push(new mesh(malhas_escolhidas.length+1, 1, malhas[i], -1, null, substitutions.charAt(index), mainCnt));
				index++;
				count++;
			}
			else{
				malhas_flags[i] = 2;
			}
		}
		if(count == nr_malhas_principais) break; //caso tenha escolhido malhas suficientes
	}
	/*
	
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
	
	*/
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
function sameDirection(componente, ramo, componentesRamo){
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
function meshDirection(malhas){
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
			if(aux.ammeter != undefined) componentesRamo = componentesRamo.concat(aux.ammeter);

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
function meshCurrInBranches(malhas){
	branches.forEach(ramo => {
		malhas.forEach(malha => {
			for(let i = 0; i < malha.branches.length; i++){
				if(ramo.id == malha.branches[i]){
					ramo.meshCurr.push(malha.id);
					ramo.meshCurrDir.push(malha.branchesDir[i]);
					break;
				}
			}
		});
	});
}

/**
 * Encounters all the branch components
 */
function getBranchComponents(){
	branches.forEach(ramo => {
		ramo.components = ramo.components.concat(ramo.dcAmpPwSupplies, ramo.acAmpPwSupplies, ramo.dcVoltPwSupplies, ramo.acVoltPwSupplies, ramo.resistors, ramo.coils, ramo.capacitors);
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
				componentesRamo = componentesRamo.concat(aux.components);
				if(aux.ammeter != undefined) componentesRamo = componentesRamo.concat(aux.ammeter);
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
							if(!(aux.ammeter === componentesRamo[i])) add = true;
							break;
						}
						else if(componentesRamo[i].noN == searchNode){	//caso extermidade negativa
							ladoNegativo = 1;
							searchNode = componentesRamo[i].noP;	//próximo searchNode é o nó positivo
							if(!(aux.ammeter === componentesRamo[i])) add = true;
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
					let flag = false;
					for(let j = 0; j < components.acVoltPs.length; j++) {
						if (components.acVoltPs[j].ref == malha.componentsLeft[i][0].ref) {
							flag = true;
							break;
						}
					}
					ladoEsq.push({ref: malha.componentsLeft[i][0].ref, value: malha.componentsLeft[i][0].value, uni: malha.componentsLeft[i][0].unitMult, sig: malha.componentsLeft[i][1], valueRect: malha.componentsLeft[i][0].voltage, angle: malha.componentsLeft[i][0].phase, complex: flag}); //adicionar componente ao lado esquerdo
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

					let type;
					let impedance;
					for(let i = 0; i < components.resistors.length; i++) {
						if (components.resistors[i].ref == componente[0].ref) {
							type = 'R';
							break;
						}
					}
					for(let i = 0; i < components.capacitors.length; i++) {
						if (components.capacitors[i].ref == componente[0].ref) {
							type = 'C';
							impedance = componente[0].impedance;
							break;
						}
					}
					for(let i = 0; i < components.coils.length; i++) {
						if (components.coils[i].ref == componente[0].ref) {
							type = 'L';
							impedance = componente[0].impedance;
							break;
						}
					}

					ladoDir[i].type = type;
					ladoDir[i].imp = impedance;
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
	let line = false;
	if(simInfo.circuitFreq.value != 0) line = true;
	malhas.forEach(malha => {												//para cada malha
		if(malha.type == 1){												//se a malha é principal
			if(malha.equationData.left == 0){									//se nao houverem fontes de tensão
				malha.incognitoEq += '0';
				malha.revealedCurrSrc += '0';
				malha.revealedEq += '0';
			}
			else{ 															//se houverem fontes de tensão
				for(let i = 0; i < malha.equationData.left.length; i++){		//percorrer as fontes de tensão
					let fonte = malha.equationData.left[i];					//fonte
					if(fonte.sig == -1){										
						malha.incognitoEq += '-';
						malha.revealedCurrSrc += '-';
						malha.revealedEq += '-';
						if(i != 0){
							malha.solverEq += '+';
						}
					}
					else{
						malha.solverEq += '-';
						if(i != 0){
							malha.incognitoEq += '+';
							malha.revealedCurrSrc += '+';
							malha.revealedEq += '+';
						}
					}
					if(line){
						malha.incognitoEq +='\\underline{';
						malha.revealedCurrSrc += '\\underline{';						
					}

					malha.incognitoEq += fonte.ref;
					malha.revealedCurrSrc += fonte.ref;

					if(line){
						malha.incognitoEq +='}';
						malha.revealedCurrSrc += '}';						
					}	
					if(fonte.complex){
						malha.revealedEq += ('(' + fonte.value + '\\angle' + fonte.angle + '^{\\circ})');
						malha.solverEq += ('(' + fonte.valueRect.split('i').join('*i') + ')');						
					}
					else{
						malha.revealedEq += fonte.value;
						malha.solverEq += fonte.value;						
					}

					if(fonte.uni != 'V'){
						const getValUnits = multUnits.find(valUnit => valUnit.name === fonte.unit);
						malha.revealedEq += getValUnits.teX;
						malha.solverEq += getValUnits.value;
					}
				}
			}			
			malha.incognitoEq += '=';						//igualdade
			malha.revealedCurrSrc +='=';
			malha.revealedEq += '=';
			for(let i = 0; i < malha.equationData.right.length; i++){				//lado direito equação
				if(malha.solverEq != "") malha.solverEq += "+";
				componente = malha.equationData.right[i];
				if(i != 0){
					malha.incognitoEq += '+';
					malha.revealedCurrSrc += '+';
					malha.revealedEq += '+';
				}

				if(componente.type == 'R'){
					malha.incognitoEq += (componente.ref);
					malha.revealedCurrSrc += (componente.ref);					
				}
				else{
					malha.incognitoEq += ('\\underline{Z_{' + (componente.ref) + '}}');
					malha.revealedCurrSrc += ('\\underline{Z_{' + (componente.ref) + '}}');
				}

				const getValUnits = multUnits.find(valUnit => valUnit.name === componente.uni);

				let equivalentValue;

				if(componente.type == 'R'){
					equivalentValue = componente.value;
					equivalentValueDisplay = componente.value;
				}
				else if(componente.type == 'C' || componente.type == "L"){
					value = resultDecimals(componente.imp.replace("i", ""), 2, false);
					equivalentValueDisplay = String(value.value)+value.TeXUnit+"i";
					equivalentValue = componente.imp;
				}
				malha.revealedEq += equivalentValueDisplay;
				malha.solverEq += equivalentValue;

				if(componente.type == 'R' && getValUnits.value != 1){
					malha.revealedEq += String('*'+getValUnits.teX);
					malha.solverEq += String('*' + getValUnits.value);

				}
				 
				malha.incognitoEq += '\\cdot(';
				malha.revealedCurrSrc += '\\cdot(';
				malha.revealedEq += '\\cdot(';
				if(!(componente.type == 'R')) malha.solverEq += '*';
				malha.solverEq += '(';

				for(let j = 0; j < componente.meshCurrentSig.length; j++){
					if(componente.meshCurrentSig[j] == -1){
						malha.incognitoEq += '-';
						malha.revealedCurrSrc += '-';
						malha.revealedEq += '-';
						malha.solverEq += '-';
					}
					else{
						if(j != 0){
							malha.incognitoEq += '+';
							malha.revealedCurrSrc += '+';
							malha.revealedEq += '+';
							malha.solverEq += '+';
						}
					}
					let aux = '';

					let ac = false;
					if(simInfo.circuitFreq.value != 0){
						ac = true;
					}

					if(malhas[componente.meshCurrents[j]-1].type == 0){
						aux = 'a';
						aux += String(malhas[componente.meshCurrents[j]-1].displayId); 
						if(simInfo.circuitFreq.value != 0){
							malha.revealedCurrSrc += ('(' + malhas[componente.meshCurrents[j]-1].currentSource.value + '\\angle' +malhas[componente.meshCurrents[j]-1].currentSource.phase + '^{\\circ})');
							malha.revealedEq += ('(' + malhas[componente.meshCurrents[j]-1].currentSource.value + '\\angle' +malhas[componente.meshCurrents[j]-1].currentSource.phase + '^{\\circ})');
							malha.solverEq += ('(' + malhas[componente.meshCurrents[j]-1].currentSource.value*Math.cos(malhas[componente.meshCurrents[j]-1].currentSource.phase * (Math.PI / 180.0)));
							if(malhas[componente.meshCurrents[j]-1].currentSource.value*Math.sin(malhas[componente.meshCurrents[j]-1].currentSource.phase * (Math.PI / 180.0)) != 0) malha.solverEq += ('+' + malhas[componente.meshCurrents[j]-1].currentSource.value*Math.sin(malhas[componente.meshCurrents[j]-1].currentSource.phase * (Math.PI / 180.0)) + '*i)');
							else malha.solverEq += ')';
						}
						else{
							malha.revealedCurrSrc += malhas[componente.meshCurrents[j]-1].currentSource.value;
							malha.revealedEq += malhas[componente.meshCurrents[j]-1].currentSource.value;
							malha.solverEq += malhas[componente.meshCurrents[j]-1].currentSource.value;
						}

						const getValUnits = multUnits.find(valUnit => valUnit.name === malhas[componente.meshCurrents[j]-1].currentSource.unitMult);
						if(getValUnits.value != 1){
							malha.revealedEq += '\\cdot' + getValUnits.teX;
							malha.revealedCurrSrc += '\\cdot' + getValUnits.teX;
							malha.solverEq += '*' + getValUnits.value;						
						}

					}
					else{
						aux = 'p';
						aux += String(malhas[componente.meshCurrents[j]-1].displayId); 
						if(ac){
							malha.revealedCurrSrc  += ('\\underline{');	
							malha.revealedEq += ('\\underline{');
						}
						malha.revealedCurrSrc  += ('I_{M' + aux + "}");	
						malha.revealedEq += ('I_{M' + aux + "}");
						if(ac){
							malha.revealedCurrSrc  += ('}');	
							malha.revealedEq += ('}');
						}
						malha.solverEq += malhas[componente.meshCurrents[j]-1].letterId;
					}
					if(ac){
						malha.incognitoEq  += ('\\underline{');	
					}
					malha.incognitoEq += ('I_{M' + aux + "}");
					if(ac){
						malha.incognitoEq  += ('}');	
					}
				}
				malha.incognitoEq += ')';
				malha.revealedCurrSrc += ')';
				malha.revealedEq += ')';
				malha.solverEq += ')';

			}
			malha.solverEq = malha.solverEq.replace("+-", "-");
			malha.revealedEq = malha.revealedEq.replace("+-", "-");
			malha.revealedCurrSrc = malha.revealedCurrSrc.replace("+-", "-");
			malha.incognitoEq = malha.incognitoEq.replace("+-", "-");

			malha.solverEq = malha.solverEq.replace("-+", "-");
			malha.revealedEq = malha.revealedEq.replace("-+", "-");
			malha.revealedCurrSrc = malha.revealedCurrSrc.replace("-+", "-");
			malha.incognitoEq = malha.incognitoEq.replace("-+", "-");

			malha.solverEq = malha.solverEq.replace("--", "+");
			malha.revealedEq = malha.revealedEq.replace("--", "+");
			malha.revealedCurrSrc = malha.revealedCurrSrc.replace("--", "+");
			malha.incognitoEq = malha.incognitoEq.replace("--", "+");

			malha.solverEq = malha.solverEq.replace("++", "+");
			malha.revealedEq = malha.revealedEq.replace("++", "+");
			malha.revealedCurrSrc = malha.revealedCurrSrc.replace("++", "+");
			malha.incognitoEq = malha.incognitoEq.replace("++", "+");

			let char;
			let language = document.getElementById("lang-sel-txt").innerText.toLowerCase();
			if(language == "english")
				char = '.';
			else	
				char = ',';

			malha.revealedEq = malha.revealedEq.replace(".", char);
			malha.revealedCurrSrc = malha.revealedCurrSrc.replace(".", char);
			malha.incognitoEq = malha.incognitoEq.replace(".", char);
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
	let cnt = 0;
	for(let i = 0; i < malhas.length; i++){
		if(malhas[i].type == 1) cnt++;
	}

	if(cnt > 0){
		let system = new linearEqSystem();
		malhas.forEach(malha => {
			if(malha.type == 1) system.addEquation(malha.solverEq);		//build equations
		});
		system.buildSystem();
		var results = solve(system.coefMatrix, system.consMatrix, system.varMatrix, 12);	//solve system

		var temp = [];
		results.variables._data.forEach(variable => {
			temp.push(variable[0]);
		});		
	}

	malhas.forEach(malha => {
		let obj = new Object;
		if(malha.type == 0){ 	//malha é auxiliar
			if(simInfo.circuitFreq.value != 0){ //malha é complexa
				obj.re =malha.currentSource.value*Math.cos(malha.currentSource.phase*(Math.PI/180.0))*multUnits.find(valUnit => valUnit.name === malha.currentSource.unitMult).value;;
				obj.im =malha.currentSource.value*Math.sin(malha.currentSource.phase*(Math.PI/180.0))*multUnits.find(valUnit => valUnit.name === malha.currentSource.unitMult).value;;
				obj.magnitude = Math.sqrt(Math.pow(obj.re, 2) + Math.pow(obj.im, 2));
				obj.angle = Math.atan(obj.im/obj.re)*57.2957795;
				if(obj.re < 0){
					if(obj.im < 0){
						obj.angle -= 180;
					}
					else{
						obj.angle += 180;
					}				
	
				} 
				obj.complex = true;
				malha.currValue = obj;			
			}
			else{ //malha é real
				obj.complex = false;
				obj.value = malha.currentSource.value*multUnits.find(valUnit => valUnit.name === malha.currentSource.unitMult).value;
				malha.currValue = obj;
			}
		}
		else{					//malha é principal
			if(simInfo.circuitFreq.value != 0){ //malha é complexa
				obj.re = results.result._data[temp.indexOf(malha.letterId)][0].re;
				obj.im = results.result._data[temp.indexOf(malha.letterId)][0].im;
				obj.magnitude = Math.sqrt(Math.pow(obj.re, 2) + Math.pow(obj.im, 2));
				obj.angle = Math.atan(obj.im/obj.re)*57.2957795; 
				if(obj.re < 0){
					if(obj.im < 0){
						obj.angle -= 180;
					}
					else{
						obj.angle += 180;
					}				
	
				} 
				obj.complex = true;
				malha.currValue = obj;
			}
			else{ //malha é real
				obj.value = results.result._data[temp.indexOf(malha.letterId)][0].re;
				obj.complex = false;
				malha.currValue = obj;
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
 * Solves for the branch currents
 * @param {Array} ramos branches array
 * @param {array} malhas meshes array
 * @returns {Array} currents equations and values
 */
function getBranchCurrents(ramos, malhas){
	let equations = [];
	ramos.forEach(ramo => {												//para cada ramo
		let valueRe = 0;
		let valueIm = 0;
		if(!(ramo.startNode == ramo.currentData.noP)){					//se o ramo e a corrente têm sentidos difetentes
			for(let i = 0; i < ramo.meshCurrDir.length; i++){			//trocar sentidos
				ramo.meshCurrDir[i] = ramo.meshCurrDir[i] * -1;
			}
		}
		let equation = "";
		if(simInfo.circuitFreq.value != 0) equation += '\\underline{';
		equation += ramo.currentData.ref;
		if(simInfo.circuitFreq.value != 0) equation += '}';
		equation += "=";			//lado esquerdo
		let string;
		for(let i = 0; i < ramo.meshCurr.length; i++){					//lado direito
			if(ramo.meshCurrDir[i] == -1){
				equation += "-";
			}
			else{
				if(i != 0){
					equation += "+";
				}
			}

			let aux = '';
			if(malhas[ramo.meshCurr[i]-1].type == 0) aux = 'a';
			else  aux = 'p';
			aux += String(malhas[ramo.meshCurr[i]-1].displayId); 

			if(simInfo.circuitFreq.value != 0) equation += '\\underline{';
			equation += "I_{M" + aux + "}";
			if(simInfo.circuitFreq.value != 0) equation += '}';
			if(simInfo.circuitFreq.value != 0){
				valueRe = valueRe + ramo.meshCurrDir[i]*malhas[ramo.meshCurr[i]-1].currValue.re;  //calcula o valor real
				valueIm = valueIm + ramo.meshCurrDir[i]*malhas[ramo.meshCurr[i]-1].currValue.im;  //calcula o valor imaginario	
			}
			else{
				valueRe = valueRe + ramo.meshCurrDir[i]*malhas[ramo.meshCurr[i]-1].currValue.value;  //calcula o valor real
			}


			string = false;
			if(simInfo.circuitFreq.value != 0) string = true;
		}

		let magnitude = Math.sqrt(Math.pow(valueRe, 2) + Math.pow(valueIm, 2));
		let angle = Math.atan(valueIm/valueRe)*57.2957795;

		if(valueRe < 0){
				if(valueIm < 0){
					angle -= 180;
				}
				else{
					angle += 180;
				}				

		}

		equations.push({branchId: ramo.id, currRef: ramo.currentData.ref, eq: equation, valRe: valueRe, valIm: valueIm, string: string, magnitude: magnitude, angle: angle});		//guarda corrente
	});

	return{
		first: false,
		second: 0,
		third: equations
	}
}

/**
 * Gets the number os isolated voltage power suplies
 * @returns {number} number of isolated voltage supply
 */
function getIsolatedVoltPS(){
	// For each Volt PS, if has in its terminals 2 Real Nodes, it is Isolated
	var isolatedPS = new Array();
	// DC PS
	for(let i=0; i<dcVoltPs.length; i++) {
		let nodeNoP = dcVoltPs[i].noP.search('_net');
		let nodeNoN = dcVoltPs[i].noN.search('_net');
        if( (nodeNoP < 0) && (nodeNoN < 0) ) {
			isolatedPS.push( { id: dcVoltPs[i].id, ref: dcVoltPs[i].ref, noP: dcVoltPs[i].noP, noN: dcVoltPs[i].noN } );
		}
	}
	// AC PS
	for(let i=0; i<acVoltPs.length; i++) {
		let nodeNoP = acVoltPs[i].noP.search('_net');
		let nodeNoN = acVoltPs[i].noN.search('_net');
        if( (nodeNoP < 0) && (nodeNoN < 0) ) {
			isolatedPS.push( { id: acVoltPs[i].id, ref: acVoltPs[i].ref, noP: acVoltPs[i].noP, noN: acVoltPs[i].noN } );
		}
	}
	var isolatedPS = JSON.parse(JSON.stringify(isolatedPS));
	return isolatedPS;
}

/**
 * Solves for the branch currents
 * @param {array} totalMeshes total circuit meshes
 * @param {Array} meshes chosen mesh
 * @param {array} branchCurr branch currents array
 * @param file json file to be updated
 * @returns updates json file
 */
function saveToJson(totalMeshes, meshes, branchCurr, isolatedPowerScr, file){

	file.analysisObj.totalMeshes = totalMeshes;
	file.analysisObj.chosenMeshes = meshes;
	file.branches = branches;
	file.components.isolatedVPS = isolatedPowerScr;

	for(let i = 0; i < branchCurr.third.length; i++){
		file.analysisObj.currents[i].valueRe = branchCurr.third[i].valRe;
		file.analysisObj.currents[i].valueIm = branchCurr.third[i].valIm;
		file.analysisObj.currents[i].magnitude = branchCurr.third[i].magnitude;
		file.analysisObj.currents[i].angle = branchCurr.third[i].angle;
		file.analysisObj.currents[i].meshEquation = branchCurr.third[i].eq;
		file.analysisObj.currents[i].complex = branchCurr.third[i].string;
	}

	file.analysisObj.currents.sort(function(a, b){return Number(a.ref.replace("I", "")) - Number(b.ref.replace("I", ""))});

	let incogEq = [];
	let currentRevEq = [];
	let allRevEq = [];
	for(let i = 0; i < meshes.length; i++){
		if(meshes[i].type == 1){
			incogEq.push(meshes[i].incognitoEq);
			currentRevEq.push(meshes[i].revealedCurrSrc);
			allRevEq.push(meshes[i].revealedEq);			
		}

	}

	file.analysisObj.equations = {
		allVariableEq: incogEq,
		meshCurrRevealedEq: currentRevEq,
		allRevealedEq: allRevEq
	}

    return file;
}

/**
 * Outputs the information to the modal
 * @param {object} jsonFile result json File
 */
function Output(jsonFile){

	// Print sections
	document.getElementById('results-board').innerHTML = outHTMLSectionsMCM();

	let warningsText = warningOutput(jsonFile.analysisObj.warnings);
	if(warningsText != 0){
		$('#warnings').html(warningsText);
		$('#errors').hide();
		$('#warnings').show();
	}

	// Insert circuit image if available
	if (fileContents[0]) { 
		let htmlstring = '<div class="container mt-3"><div class="row bg-dark rounded text-light  p-2">';
		htmlstring += '<h5 class="ml-3" data-translate="_circuitImage"></h5></div></div>';
		htmlstring += '<div class="container mt-2 mb-2 text-center"><img id = "circuitImage" style="max-width: 700px;width:100%;" src='+fileContents[0]+'></div>';
		$('#circuitImage').html(htmlstring);
		$('#circuitImage').show();	
	}
	else
		$('#circuitImage').hide();


	// Output data Generation
	$('#buttonShowAll').html(outShowAllBtnMCM());

	//debug version
	$('#version').html(outVersion(jsonFile));

	//circuit fundamental variables
	$('#fundamentalVars').html(outCircuitFundamentalsMCM(jsonFile));

	//circuit info MCM
	$('#circuitInfo').html(outCircuitInfoMCM(jsonFile));

	//circuit equations info
	$('#meshEquations').html(outEquationCalcMCM(jsonFile));


	let canvasObjects = outMeshesMCM(jsonFile.branches, jsonFile.analysisObj.chosenMeshes);

	let step1 = outStep1MCM(jsonFile.analysisObj.equations);
	let step2 = outStep2MCM(jsonFile.analysisObj.equations);
	let step3 = outStep3MCM(jsonFile.analysisObj.equations);
	let equationSystemOutput = outEquationSystemMCM(jsonFile.analysisObj.equations, step1, step2, step3);
	$('#eqSys').html(equationSystemOutput);
	$('#resultsCurrentsMesh').html(outResultsMeshesMCM(jsonFile));
	$('#currentsInfo').html(outCurrentsInfo(jsonFile.analysisObj.currents, jsonFile.branches).first);
	$('#resultsCurrentsBranch').html(outResultsCurrentsMCM(jsonFile));

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
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(jsonFile)));
		element.setAttribute('download', filename);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	  });

	// Export TeX File
	$("#tex").off().on('click', function() {
		const filename = 'urisolve_results.tex';
		const imagesFilename = 'urisolve_images.tex';
				
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

		let TeX = buildTeXOv(jsonFile, canvasObjects);
		let ImagesTeX = buildImTeX(canvasObjects);

		//Print TeX (Temporary - Index 1432 - texfile cannot be change before it)
		if(studNumber.length>1 && studLastname.length > 1 && studNumber.length>1){
			let string = "\\vspace{0.5cm}\\centering{ \r\n Simulation performed by: \\textbf{ "+studName+" "+studLastname+" ("+studNumber+")}} "
			string += " at " + hourstr + "\r\n";
			TeX = TeX.slice(0,1660) + string + TeX.slice(1661);
		}

		let element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(TeX));
		element.setAttribute('download', filename);
		let element2 = document.createElement('a');
		element2.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(ImagesTeX));
		element2.setAttribute('download', imagesFilename);
		element.style.display = 'none';
		element2.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
		document.body.appendChild(element2);
		element2.click();
		document.body.removeChild(element2);
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
		let TeX = buildTeXRich(jsonFile, canvasObjects);
		//Print TeX (Temporary - Index 1432 - texfile cannot be change before it)
		if(studNumber.length>1 && studLastname.length > 1 && studNumber.length>1){
			let string = "\\vspace{0.5cm}\\centering{ \r\n Simulation performed by: \\textbf{ "+studName+" "+studLastname+" ("+studNumber+")}} "
			string += " at " + hourstr + "\r\n";
			TeX = TeX.slice(0,1432) + string + TeX.slice(1433);
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
			sampleimg = resize(imageObj);
			docToPrint.addImgFile('circuit.jpg', sampleimg);
		}
		// Add Canvas Images
		for(let i = 0; i< canvasObjects.length; i++){
			let canvas = document.createElement('canvas');
			canvas.width = canvasObjects[i].width;
			canvas.height = canvasObjects[i].height;
			let context = canvas.getContext('2d');
			let image = new Image();
			image.onload = function(){
				let resizedImage = new Image();
				resizedImage.onload = function(){
					context.drawImage(resizedImage, 0, 0, resizedImage.width, resizedImage.height);
					let finalImage = canvas.toDataURL();
					docToPrint.addImgFile("meshImage"+canvasObjects[i].id+'.jpg', finalImage);
				}
				resizedImage.src = resizeMCM(image, 400).data;
			}
			image.src = canvasObjects[i].imageData;
		}
		docToPrint.print();
		
	});	

	// Open in overleaf
	$("#overleaf").off().on('click', function() {
		let TeX = buildTeXOv(jsonFile, canvasObjects);
		let ImagesTeX = buildImTeX(canvasObjects);
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
		//Print TeX (Temporary - Index 1432 - texfile cannot be change before it)
		if(studNumber.length>1 && studLastname.length > 1 && studNumber.length>1){
			let string = "\\vspace{0.5cm}\\centering{ \r\n Simulation performed by: \\textbf{ "+studName+" "+studLastname+" ("+studNumber+")}} "
			string += " at " + hourstr + "\r\n";
			TeX = TeX.slice(0,1660) + string + TeX.slice(1661);
		}
		TeX = TeX.replaceAll("[latin1]", "");
		document.getElementById('main').value = encodeURIComponent(TeX);
		document.getElementById('images').value = encodeURIComponent(ImagesTeX);
		document.getElementById('overleaf').submit();
	});

	// Print
	$("#print").off().on('click', function() {
		buildPrintPDF(jsonFile, canvasObjects);
	});


	// Update Dictionary Language
	let language = document.getElementById("lang-sel-txt").innerText.toLowerCase();
	if(language == "english")
		set_lang(dictionary.english);
	else	
		set_lang(dictionary.portuguese);
	
}


/**
 * Main Function
 * @param {object} data initila jsonFile data
 */
function loadFileAsTextMCM(data) {

	let jsonFile = JSON.parse(data);
	
	branches = jsonFile.branches;
	nodes = jsonFile.nodes;
	components = jsonFile.components;
	simInfo = jsonFile.analysisObj;


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
	let malhas_escolhidas = chooseMeshes(malhas_arr, MEquaCnt);
	if(malhas_escolhidas.first){
		alert(malhas_escolhidas.third);
		return;
	}

	//atualizar direções de malha e ramos
	malhas_escolhidas = meshDirection(malhas_escolhidas.third);
	if(malhas_escolhidas.first){
		alert(malhas_escolhidas.third);
		return;
	}

	//correntes de malha que atravessam cada ramo
	meshCurrInBranches(malhas_escolhidas.third);
	if(malhas_escolhidas.first){
		alert(malhas_escolhidas.third);
		return;
	}

	getBranchComponents();

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

	//constrói quatro equações: com incógnitas, com as fontes de corrente reveladas, com tudo revelado, e uma para resolução
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


	//computa as equações das correntes dos ramos
	let branchCurrentEq = getBranchCurrents(branches, malhas_escolhidas.third);
	if(branchCurrentEq.first){
		alert(branchCurrentEq.third);
		return;
	}

	let isolatedVPS = getIsolatedVoltPS();

	jsonFile =  saveToJson(malhas_arr, malhas_escolhidas.third, branchCurrentEq, isolatedVPS, jsonFile);

	Output(jsonFile);
	
}
