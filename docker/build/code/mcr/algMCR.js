include('code/common/outPrintMCR.js');

function countNodesByType(objArr, type) {
	let cnt = 0;
	for(let i=0; i<objArr.length; i++) { if(objArr[i].type == type) cnt++;}
	return cnt;
					}
				
/**
 * Finds all circuit meshes
 * @returns first: error; second: errorCode; third: array with all the meshes
				*/
 function findMeshess(){

	//const nr_nos = countNodesByType(nodes, 0);
	//const nr_ramos = branches.length;
	var nodesn=[];
	for(let i=0;i<nodes.length;i++){
		if(nodes[i].type==0){nodesn[i]=nodes[i].ref}
		else{nodesn[i]=0;}
						}
	nodesn = nodesn.filter(function(item) {
    return item !== 0
	})
	var branches_id = [];
	for(let i = 0; i<branches.length; i++){
		branches_id.push(branches[i].id);
					}
	//cria matriz de adjacencia
	var adjMatrix=[];
	for(let i=0;i<nodesn.length;i++){
    adjMatrix[i]=[];
        for(let j=0;j<nodesn.length;j++){
            //if(i==j){adjMatrix[i][j]=0;}
				for(let k=0;k<branches.length;k++){
					if(((branches[k].startNode==nodesn[i])&&(branches[k].endNode==nodesn[j]))||((branches[k].startNode==nodesn[j])&&(branches[k].endNode==nodesn[i]))){
						adjMatrix[i][j]=1;
				}
					else{adjMatrix[i][j]=0;}
					if(adjMatrix[i][j]==1){break;}
			}
		}
	}

	//cria matriz de incicendia
	var incMatrix=[];
	for(let i=0;i<nodesn.length;i++){
    	incMatrix[i]=[];
        for(let j=0;j<branches.length;j++){
        	if((branches[j].startNode==nodesn[i])||(branches[j].endNode==nodesn[i])){
				incMatrix[i][j]=1;
			}
			else{incMatrix[i][j]=0;}
		}
	}

	//Meshes finder

	let circuit = new MeshesFinder();
	circuit.initGraph(adjMatrix, incMatrix, nodesn, branches_id);
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


/***
 * escolha de malhas
 * 
 * 
 */
 function escolherMalhas(Meshes, numMeshes){
	var meshid=1;
	var chosenMeshes=[];
	var chosenMeshes2=[];
	//testa se os ramos tem fontes de corrente ou não
	//se typebranches=0 não tem; se 1 tem
	var typebranches=[];
	for(i=0;i<branches.length;i++){
		if((branches[i].dcAmpPwSupplies.length<1)&&(branches[i].acAmpPwSupplies.length<1)){

			typebranches[i]=0;
	}
		if((branches[i].dcAmpPwSupplies.length>0)||(branches[i].acAmpPwSupplies.length>0)){
			typebranches[i]=1;

		}
	}
	//escolhe as malhas a ser usadas e coloca em "choosenMeshes"
	let meshestype0=0;
	let meshestype2=0;
	let meshestype1=0;
	for(let i=0;i<Meshes.length;i++){
		for(let j=0;j<Meshes[i].length;j++){

					for(let l=0;l<branches.length;l++){

					if((branches[l].id==Meshes[i][j])&&(typebranches[l]==1))
						{meshestype1=meshestype1+1;}

					if ((branches[l].id==Meshes[i][j])&&(typebranches[l]==0))
						{meshestype0=meshestype0+1}

					if ((branches[l].id==Meshes[i][j])&&(typebranches[l]==2))
						{meshestype2=meshestype2+1}

		}
	}
			if ((meshestype1==0)&&(meshestype0>0)&&(chosenMeshes.length<numMeshes))
			{


				/*let cMesh={
					"type": 1,
					"id": meshid,
					"branches": Meshes[i],
					}
				choosenMeshes2.push(cMesh);
				*/
				chosenMeshes2.push(new mesh(meshid, 1, Meshes[i], null, null, null, meshid));
				chosenMeshes.push(Meshes[i]);
				//let temp=0;
				//let auxCnt=0;
				//choosenMeshes2.push(new mesh(choosenMeshes.length+1, 0, Meshes[i], meshid, temp, null, auxCnt));
				meshid=meshid+1;
				meshestype2=0;
				meshestype0=0;
				for(let o=0;o<Meshes[i].length;o++){
					for(let p=0;p<branches.length;p++){
						if(branches[p].id==Meshes[i][o]){
							typebranches[p]=2;
				}
			}
		}
	}
			else{meshestype1=0;
				 meshestype2=0;
				 meshestype0=0;}





	}
	return{
		first: false,
		second: 0,
		third: chosenMeshes,
		forth: chosenMeshes2

	};

 }
/**
 * 
 * 
 * 
 */
 function meshDirection2(malhas){
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

function getBranchComponents2(){
	branches.forEach(ramo => {
		ramo.components = ramo.components.concat(ramo.dcAmpPwSupplies, ramo.acAmpPwSupplies, ramo.dcVoltPwSupplies, ramo.acVoltPwSupplies, ramo.resistors, ramo.coils, ramo.capacitors);
	});
}

/**
 * Encounters all the mesh components, in order
 * @param {Array} malhas meshes
 * @returns {Array} the same meshes array updated
 */
 function getComponents2(malhas){
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
 * 
 * 
 */
function getNodeEquations(){
 let nodeEquations={
	"equations": [],
	"equationReal":[],
	"equationsRevealed":[],
	};
var nodesn=[];
var branchesused=[];
var branchesusedflow=[];
for(let i=0;i<nodes.length;i++){
	if(nodes[i].type==0){nodesn[i]=nodes[i].ref}
	else{nodesn[i]=0;}
}
nodesn = nodesn.filter(function(item) {
 return item !== 0
})

var currin="";
var currout="";
var Nodeequations=[];
var sumDCAmp=0;
var sumDCAmpReal="";
var currinReal="";
var curroutReal="";
var radangulo;
var sumACAmp="";
var Complex;
var valuev;
var sumACAmpReal="";
for(let i=0;i<nodesn.length-1;i++){
	Nodeequations[i]=[];
	for(let j=0;j<branches.length;j++){
	if(branches[j].ammeters!=undefined){
		currents[j].noN=branches[j].ammeters.noN
		currents[j].noP=branches[j].ammeters.noP
		
	}
	if((currents[j].noP==nodesn[i])&&((branches[j].dcAmpPwSupplies.length>0)||(branches[j].acAmpPwSupplies.length>0))){

		if(branches[j].dcAmpPwSupplies.length>0){
			for(let n=0;n<branches[j].dcAmpPwSupplies.length;n++){

				if(currents[j].noP==branches[j].dcAmpPwSupplies[n].globalNoN){
				if(branches[j].dcAmpPwSupplies[n].unitMult=="A"){
					sumDCAmp=sumDCAmp-parseFloat(branches[j].dcAmpPwSupplies[n].value)}

					if(branches[j].dcAmpPwSupplies[n].unitMult=="mA"){
					sumDCAmp=sumDCAmp-parseFloat(branches[j].dcAmpPwSupplies[n].value)*0.001;
					}
				}

				if(currents[j].noP==branches[j].dcAmpPwSupplies[n].globalNoP){
					if(branches[j].dcAmpPwSupplies[n].unitMult=="A"){
						sumDCAmp=sumDCAmp+parseFloat(branches[j].dcAmpPwSupplies[n].value)}
	
						if(branches[j].dcAmpPwSupplies[n].unitMult=="mA"){
						sumDCAmp=sumDCAmp+parseFloat(branches[j].dcAmpPwSupplies[n].value)*0.001;
						}
					}
			}

		branchesused.push(currents[j].ref);
		branchesusedflow.push("out");
		sumDCAmpReal=sumDCAmpReal+" - "+branches[j].dcAmpPwSupplies[0].ref;
		}

		if(branches[j].acAmpPwSupplies.length>0){
			for(let n=0;n<branches[j].acAmpPwSupplies.length;n++){
				radangulo = parseFloat(branches[j].acAmpPwSupplies[n].phase) / (180/Math.PI);
				if(branches[j].acAmpPwSupplies[n].unitMult=="A"){
				valuev=parseFloat(branches[j].acAmpPwSupplies[n].value);}
				if(branches[j].acAmpPwSupplies[n].unitMult=="mA"){
				valuev=parseFloat(branches[j].acAmpPwSupplies[n].value)/1000;}

				var Complex=math.multiply(valuev, math.exp(math.complex(0, radangulo)));
				Complex.im=Complex.im.toFixed(4);
				Complex.re=Complex.re.toFixed(4);
					if(parseFloat(Complex.im)==0){
					sumACAmp=sumACAmp+" - ("+Complex.re+")";
					}
					if(parseFloat(Complex.re)==0){
					sumACAmp=sumACAmp+" - ("+Complex.im+"i)";
					}

					if((parseFloat(Complex.re)!=0)&&(parseFloat(Complex.im)!=0)){
					if(parseFloat(Complex.im)>0){
					sumACAmp=sumACAmp+" - ("+Complex.re+" + "+Complex.im+"i)";
					}
					if(parseFloat(Complex.im)<0){
						sumACAmp=sumACAmp+ " - ("+Complex.re+" "+Complex.im+"i)"; 
					}
				   }

			}
			sumACAmpReal=sumACAmpReal+" - "+branches[j].acAmpPwSupplies[0].ref;
			branchesused.push(currents[j].ref);
			branchesusedflow.push("out");
			
		}

	}


	if((currents[j].noN==nodesn[i])&&((branches[j].dcAmpPwSupplies.length>0)||(branches[j].acAmpPwSupplies.length>0))){
		
		
		
		if(branches[j].dcAmpPwSupplies.length>0){
		for(let n=0;n<branches[j].dcAmpPwSupplies.length;n++){


			if(currents[j].noP==branches[j].dcAmpPwSupplies[n].globalNoN){
			if(branches[j].dcAmpPwSupplies[n].unitMult=="A"){
				sumDCAmp=sumDCAmp+parseFloat(branches[j].dcAmpPwSupplies[n].value)}

				if(branches[j].dcAmpPwSupplies[n].unitMult=="mA"){
				sumDCAmp=sumDCAmp+parseFloat(branches[j].dcAmpPwSupplies[n].value)*0.001;
				}
			}

			if(currents[j].noP==branches[j].dcAmpPwSupplies[n].globalNoP){
				if(branches[j].dcAmpPwSupplies[n].unitMult=="A"){
					sumDCAmp=sumDCAmp-parseFloat(branches[j].dcAmpPwSupplies[n].value)}
	
					if(branches[j].dcAmpPwSupplies[n].unitMult=="mA"){
					sumDCAmp=sumDCAmp-parseFloat(branches[j].dcAmpPwSupplies[n].value)*0.001;
					}
				}
		}
		branchesused.push(currents[j].ref);
		branchesusedflow.push("in");
		sumDCAmpReal=sumDCAmpReal+" + "+branches[j].dcAmpPwSupplies[0].ref;
		}

		if(branches[j].acAmpPwSupplies.length>0){
			for(let n=0;n<branches[j].acAmpPwSupplies.length;n++){
				radangulo = parseFloat(branches[j].acAmpPwSupplies[n].phase) / (180/Math.PI);
				if(branches[j].acAmpPwSupplies[n].unitMult=="A"){
				valuev=parseFloat(branches[j].acAmpPwSupplies[n].value);}
				if(branches[j].acAmpPwSupplies[n].unitMult=="mA"){
				valuev=parseFloat(branches[j].acAmpPwSupplies[n].value)/1000;}
				Complex=math.multiply(valuev, math.exp(math.complex(0, radangulo)));
				Complex.im=Complex.im.toFixed(4);
				Complex.re=Complex.re.toFixed(4);


					if(parseFloat(Complex.im)==0){
					sumACAmp=sumACAmp+" + ("+Complex.re+")";
					}
					if(parseFloat(Complex.re)==0){
					sumACAmp=sumACAmp+" + ("+Complex.im+"i)";
					}
					
					if((parseFloat(Complex.re)!=0)&&(parseFloat(Complex.im)!=0)){
					if(parseFloat(Complex.im)>0){
					sumACAmp=sumACAmp+" + ("+Complex.re+" + "+Complex.im+"i)";
					}
					if(parseFloat(Complex.im)<0){
						sumACAmp=sumACAmp+" + ("+Complex.re+" "+Complex.im+"i)"; 
					}
					}
			}
			sumACAmpReal=sumACAmpReal+" + "+branches[j].acAmpPwSupplies[0].ref;
			branchesused.push(currents[j].ref);
			branchesusedflow.push("in");

		}
	}
	
	if((currents[j].noP==nodesn[i])&&(currout!="")&&(branches[j].dcAmpPwSupplies.length==0)&&(branches[j].acAmpPwSupplies.length==0)){
		currout=currout+" + "+currents[j].ref;
		curroutReal=curroutReal+" + "+currents[j].ref;
		branchesused.push(currents[j].ref);
		branchesusedflow.push("out");

	}
	
	if((currents[j].noP==nodesn[i])&&(currout=="")&&(branches[j].dcAmpPwSupplies.length==0)&&(branches[j].acAmpPwSupplies.length==0)){
		currout=currout+currents[j].ref;
		curroutReal=curroutReal+currents[j].ref;
		branchesused.push(currents[j].ref);
		branchesusedflow.push("out");
	}


	if((currents[j].noN==nodesn[i])&&(currin!="")&&(branches[j].dcAmpPwSupplies.length==0)&&(branches[j].acAmpPwSupplies.length==0)){
		currin=currin+" - "+currents[j].ref;
		currinReal=currinReal+" - "+currents[j].ref;
		branchesused.push(currents[j].ref);
		branchesusedflow.push("in");
	}

	if((currents[j].noN==nodesn[i])&&(currin=="")&&(branches[j].dcAmpPwSupplies.length==0)&&(branches[j].acAmpPwSupplies.length==0)){
		currin=currin+" - "+currents[j].ref;
		currinReal=currinReal+" - "+currents[j].ref;
		branchesused.push(currents[j].ref);
		branchesusedflow.push("in");
	}

	if((currents[j].noN!=nodesn[i])&&(currents[j].noP!=nodesn[i])){
		//Nodeequations[i][j]=0;
		//branchesused.push(branches[j].id);
	}
}

if(sumDCAmpReal==""){
	sumDCAmpReal=0;
}
if(sumACAmpReal==""){
	sumACAmpReal=0;
}
/*if(sumDCAmp>=0){
	sumDCAmp=" - " +sumDCAmp
}

if(sumDCAmp<0){
	sumDCAmp=" -("+sumDCAmp+")";
}*/	

if((currin=="")&&(sumACAmp=="")){
	
	let equation={
		"type": 0,
		"node": nodesn[i],
		"equation": currout+" -("+sumDCAmp+")",
		}
	nodeEquations.equations.push(equation);

	let equationReal={
		"type": 0,
		"node": nodesn[i],
		"equation": curroutReal +" = "+sumDCAmpReal,
		"branchesused":branchesused,
		"branchesusedflow":branchesusedflow,
	}
	nodeEquations.equationReal.push(equationReal);

	let equationRevealed={
		"type": 0,
		"node": nodesn[i],
		"equation": currout+" = "+sumDCAmp,
		}
	nodeEquations.equationsRevealed.push(equationRevealed);
}

if((currout=="")&&(sumACAmp=="")){

	let equation={
		"type": 0,
		"node": nodesn[i],
		"equation": currin+" -("+sumDCAmp+")",
	}
	nodeEquations.equations.push(equation);

	let equationReal={
		"type": 0,
		"node": nodesn[i],
		"equation": currinReal +" = "+sumDCAmpReal,
		"branchesused":branchesused,
		"branchesusedflow":branchesusedflow,
	}
	nodeEquations.equationReal.push(equationReal);

	let equationRevealed={
		"type": 0,
		"node": nodesn[i],
		"equation": currin+" = "+sumDCAmp,
		}
	nodeEquations.equationsRevealed.push(equationRevealed);
}
	//equations1[i]="Nó "+nodesn[i]+ " : "+currin+" = 0";


if(((currin!="")&&(currout!=""))&&(sumACAmp=="")){
	let equation={
		"type": 0,
		"node": nodesn[i],
		"equation": currout +currin+" -("+sumDCAmp+")",
	}
	nodeEquations.equations.push(equation);

	let equationReal={
		"type": 0,
		"node": nodesn[i],
		"equation": curroutReal +currinReal+" = "+sumDCAmpReal,
		"branchesused":branchesused,
		"branchesusedflow":branchesusedflow,
	}
	nodeEquations.equationReal.push(equationReal);

	let equationRevealed={
		"type": 0,
		"node": nodesn[i],
		"equation": currout + currin+" = "+sumDCAmp,
		}
	nodeEquations.equationsRevealed.push(equationRevealed);
}

if((currin=="")&&(sumACAmp!="")){
	
	let equation={
		"type": 0,
		"node": nodesn[i],
		"equation": currout+" -("+sumACAmp+")",
		}
	nodeEquations.equations.push(equation);

	let equationReal={
		"type": 0,
		"node": nodesn[i],
		"equation": curroutReal +" = "+sumACAmpReal,
		"branchesused":branchesused,
		"branchesusedflow":branchesusedflow,
	}
	nodeEquations.equationReal.push(equationReal);

	let equationRevealed={
		"type": 0,
		"node": nodesn[i],
		"equation": currout+" = "+sumACAmp,
		}
	nodeEquations.equationsRevealed.push(equationRevealed);
}

if((currout=="")&&(sumACAmp!="")){

	let equation={
		"type": 0,
		"node": nodesn[i],
		"equation": currin+" -("+sumACAmp+")",
	}
	nodeEquations.equations.push(equation);

	let equationReal={
		"type": 0,
		"node": nodesn[i],
		"equation": currinReal +" = "+sumACAmpReal,
		"branchesused":branchesused,
		"branchesusedflow":branchesusedflow,
	}
	nodeEquations.equationReal.push(equationReal);

	let equationRevealed={
		"type": 0,
		"node": nodesn[i],
		"equation": currin+" = "+sumACAmp,
		}
	nodeEquations.equationsRevealed.push(equationRevealed);
}
	//equations1[i]="Nó "+nodesn[i]+ " : "+currin+" = 0";


if(((currin!="")&&(currout!=""))&&(sumACAmp!="")){
	let equation={
		"type": 0,
		"node": nodesn[i],
		"equation": currout +currin+" -("+sumACAmp+")",
	}
	nodeEquations.equations.push(equation);

	let equationReal={
		"type": 0,
		"node": nodesn[i],
		"equation": curroutReal +currinReal+" = "+sumACAmpReal,
		"branchesused":branchesused,
		"branchesusedflow":branchesusedflow,
	}
	nodeEquations.equationReal.push(equationReal);

	let equationRevealed={
		"type": 0,
		"node": nodesn[i],
		"equation": currout + currin+" = "+sumACAmp,
		}
	nodeEquations.equationsRevealed.push(equationRevealed);
}





	
	//analysisObj.nodeMatrix[i].push(sumDCAmp);
	Nodeequations[i].push(sumDCAmp);
	currin="";
	currout="";
   sumDCAmp=0;
   sumDCAmpReal="";
   var currinReal="";
	var curroutReal="";
	sumACAmp="";
	sumACAmpReal="";
	branchesused=[];
	branchesusedflow=[];
	

}
return{
	first: false,
	second: 0,
	third: nodeEquations
};

}

/**
 * 
 * 
 */
function getMeshEquations(Mesh){
	let meshEquations={
		"equations": [],
		"equationReal":[],
		"equationsRevealed":[],
	};
	
		let sumDC=0;
	let sumResistors=0;
	let s=0;
	let eqs="";
	let eq1="";
	let equations1=[];
	let kendNode=[];
	let kstartNode=[];
	let sumDCReal="";
	let sumAC="";
	let sumACReal="";
	let impRealText="";
	let impRealNum=0;
	let impImText="";
	let impImNum=0;

	for(let i=0;i<Mesh.length;i++){
		 kendNode[i]=[];
		 kstartNode[i]=[];
		for(let j=0;j<Mesh[i].length;j++){
			for(let k=0;k<branches.length;k++){

					for(let p=0;p<branches[k].resistors.length;p++){
						sumResistors=sumResistors+parseFloat(branches[k].resistors[p].value);
					}
					

				if((branches[k].id==Mesh[i][j])&&(j==0)){
					impImNum=0;
					impRealNum=0;
					impImText="";
					
					if(branches[k].resistors.length>0){
						//eqs=sumResistors+" * "+currents[k].ref;
						//eq1=branches[k].ref+" * "+currents[k].ref;
						for(let n=0;n<branches[k].resistors.length;n++){
							if(eq1==""){
							eq1=branches[k].resistors[n].ref+" * "+currents[k].ref;
							}
							else{
								eq1=eq1+" + "+branches[k].resistors[n].ref+" * "+currents[k].ref;
							}
						}
						
						
						
					}
					/*if((branches[k].dcVoltPwSupplies.length>0)&&(branches[k].startNode==branches[k].endVoltPsEndNodes[0].startNode)){
						sumDC=sumDC+parseInt(branches[k].equivVoltPs.value);
						sumDCReal=sumDCReal+" + "+branches[k].dcVoltPwSupplies[0].ref;
					}*/

					if(branches[k].dcVoltPwSupplies.length>0){
						for(let n=0;n<branches[k].dcVoltPwSupplies.length;n++){
							if(branches[k].startNode==branches[k].endVoltPsEndNodes[n].startNode){
								if(sumDCReal==""){
									sumDCReal=branches[k].dcVoltPwSupplies[n].ref;
								}
								else{
									sumDCReal=sumDCReal+" + "+branches[k].dcVoltPwSupplies[n].ref;
								}
								
							}

							if(branches[k].startNode!=branches[k].endVoltPsEndNodes[n].startNode){
								sumDCReal=sumDCReal+" - "+branches[k].dcVoltPwSupplies[n].ref;
							}

						}
						sumDC=sumDC+parseFloat(branches[k].equivVoltPs.value);
						
					}

					if(branches[k].acVoltPwSupplies.length>0){

						for(let n=0;n<branches[k].acVoltPwSupplies.length;n++){
							for(let m=0;m<branches[k].endVoltPsEndNodes.length;m++){
								if(branches[k].acVoltPwSupplies[n].ref==branches[k].endVoltPsEndNodes[m].voltPsRef){
									if(branches[k].startNode==branches[k].endVoltPsEndNodes[m].startNode){
										if(sumAC==""){
											sumAC="("+branches[k].acVoltPwSupplies[n].voltage+")";
											sumACReal=branches[k].acVoltPwSupplies[n].ref;
											}
											else{
											sumAC=sumAC+"+ ("+branches[k].acVoltPwSupplies[n].voltage+")";
											sumACReal=sumACReal+"+"+branches[k].acVoltPwSupplies[n].ref;
										}
									}
									if(branches[k].startNode!=branches[k].endVoltPsEndNodes[m].startNode){
										sumAC=sumAC+" -("+branches[k].acVoltPwSupplies[n].voltage+")";
										sumACReal=sumACReal+" - "+branches[k].acVoltPwSupplies[n].ref+"";
										
									}
								}
							}
						}	
					}

						/*for(let n=0;n<branches[k].acVoltPwSupplies.length;n++){
						if(sumAC==""){
						sumAC="("+branches[k].acVoltPwSupplies[n].voltage+")";
						sumACReal=branches[k].acVoltPwSupplies[n].ref;
						}
						else{
						sumAC=sumAC+"+ ("+branches[k].acVoltPwSupplies[n].voltage+")";
						sumACReal=sumACReal+"+"+branches[k].acVoltPwSupplies[n].ref;
						}
					}*/	
					

					/*if((branches[k].dcVoltPwSupplies.length>0)&&(branches[k].startNode!=branches[k].endVoltPsEndNodes[0].startNode)){
						sumDC=sumDC-parseInt(branches[k].equivVoltPs.value);
						sumDCReal=sumDCReal+" - "+branches[k].dcVoltPwSupplies[0].ref;
					}*/

					/*if((branches[k].acVoltPwSupplies.length>0)&&(branches[k].startNode!=branches[k].endVoltPsEndNodes[0].startNode)){
						sumAC=sumAC+"- ("+branches[k].acVoltPwSupplies[n].voltage+")";
						sumACReal=sumACReal+" - "+branches[k].acVoltPwSupplies[n].ref;
					}*/
					
					if(branches[k].capacitors.length>0){
						for(let q=0;q<branches[k].capacitors.length;q++){
							if(eq1==""){
								//eqs=eqs+"("+branches[k].capacitors[q].impedance+" * "+currents[k].ref+")";
								eq1=eq1+branches[k].capacitors[q].ref+" * "+currents[k].ref;
							}
							else{
								//eqs=eqs+" + ("+branches[k].capacitors[q].impedance+" * "+currents[k].ref+")";
							eq1=eq1+" + "+branches[k].capacitors[q].ref+" * "+currents[k].ref;
							}
							
						}

					}

					if(branches[k].coils.length>0){
						for(let w=0;w<branches[k].coils.length;w++){
							if(eq1==""){
								//eqs=eqs+"("+branches[k].coils[w].impedance+" * "+currents[k].ref+")";
								eq1=eq1+branches[k].coils[w].ref+" * "+currents[k].ref;
							}
							else{
								//eqs=eqs+" + ("+branches[k].coils[w].impedance+" * "+currents[k].ref+")";
							eq1=eq1+" + "+branches[k].coils[w].ref+" * "+currents[k].ref;
							}
							
						}

					}

					


					if((branches[k].resistors.length>0)||(branches[k].coils.length>0)||(branches[k].capacitors.length>0)){

						for(let z=0;z<branches[k].resistors.length;z++){
							
								if(branches[k].resistors[z].unitMult=="Ohm"){
								impRealNum=impRealNum+parseFloat(branches[k].resistors[z].value);}
								if(branches[k].resistors[z].unitMult=="kOhm"){
									impRealNum=impRealNum+(parseFloat(branches[k].resistors[z].value))*1000;}
								//impRealNum = +impRealNum.toFixed(2);
							
							impRealNum = +impRealNum.toFixed(2);
						}
						for(let y=0;y<branches[k].coils.length;y++){
							impImText=branches[k].coils[y].impedance;
							impImText=impImText.slice(0, -1);
							impImNum=impImNum+parseFloat(impImText);
							impImNum = +impImNum.toFixed(2);
						}

						for(let x=0;x<branches[k].capacitors.length;x++){
							impImText=branches[k].capacitors[x].impedance;
							impImText=impImText.slice(0, -1);
							impImNum=impImNum+parseFloat(impImText);
							impImNum = +impImNum.toFixed(2);
						}

						if(impRealNum==0){
							eqs="("+impImNum+"i) * " +currents[k].ref;
						}

						if(impImNum==0){
							eqs="("+impRealNum+") * " +currents[k].ref;
						}

						if((impImNum!=0)&&(impRealNum!=0)&&(eqs=="")){
							if (impImNum>0){
							eqs="("+impRealNum+" + "+ impImNum+"i) * " +currents[k].ref;
							}
							else{
							eqs="("+impRealNum+" "+ impImNum+"i) * " +currents[k].ref;
							}
						}

					}

					kendNode[i][j]=branches[k].endNode;
					kstartNode[i][j]=branches[k].startNode;
				}
				
				if((branches[k].id==Mesh[i][j])&&(j>0)&&((branches[k].startNode==kendNode[i][j-1])||(branches[k].endNode==kstartNode[i][j-1]))&&(s==-1)){

					impImNum=0;
					impRealNum=0;
					impImText="";

					if(branches[k].resistors.length>0){
						//eqs=eqs+" - "+sumResistors+" * "+currents[k].ref;
						//eq1=eq1+" - "+branches[k].ref+" * "+currents[k].ref;
						for(let n=0;n<branches[k].resistors.length;n++){
							
							eq1=eq1+" - "+branches[k].resistors[n].ref+" * "+currents[k].ref;
							
						}
						
					}
					/*if((branches[k].dcVoltPwSupplies.length>0)&&(branches[k].startNode==branches[k].endVoltPsEndNodes[0].startNode)){
						sumDC=sumDC-parseInt(branches[k].equivVoltPs.value);
						sumDCReal=sumDCReal+" - "+branches[k].dcVoltPwSupplies[0].ref;
					}
					if((branches[k].dcVoltPwSupplies.length>0)&&(branches[k].startNode!=branches[k].endVoltPsEndNodes[0].startNode)){
						sumDC=sumDC+parseInt(branches[k].equivVoltPs.value);
						sumDCReal=sumDCReal+" + "+branches[k].dcVoltPwSupplies[0].ref;
					}*/

					if(branches[k].dcVoltPwSupplies.length>0){
						for(let n=0;n<branches[k].dcVoltPwSupplies.length;n++){
							if(branches[k].startNode==branches[k].endVoltPsEndNodes[n].startNode){

								sumDCReal=sumDCReal+" - "+branches[k].dcVoltPwSupplies[n].ref;						
							}

							if(branches[k].startNode!=branches[k].endVoltPsEndNodes[n].startNode){
								if(sumDCReal==""){
									sumDCReal=branches[k].dcVoltPwSupplies[n].ref;
								}
								else{
									sumDCReal=sumDCReal+" + "+branches[k].dcVoltPwSupplies[n].ref;
								}
							}

						}
						if(parseFloat(branches[k].equivVoltPs.value)>0){
						sumDC=sumDC-parseFloat(branches[k].equivVoltPs.value);
						}
						if(parseFloat(branches[k].equivVoltPs.value)<0){
						sumDC=sumDC-parseFloat(branches[k].equivVoltPs.value);
						}
					}

					if(branches[k].acVoltPwSupplies.length>0){

						for(let n=0;n<branches[k].acVoltPwSupplies.length;n++){
							for(let m=0;m<branches[k].endVoltPsEndNodes.length;m++){
								if(branches[k].acVoltPwSupplies[n].ref==branches[k].endVoltPsEndNodes[m].voltPsRef){
									if(branches[k].startNode==branches[k].endVoltPsEndNodes[m].startNode){
										sumAC=sumAC+" -("+branches[k].acVoltPwSupplies[n].voltage+")";
										sumACReal=sumACReal+" - "+branches[k].acVoltPwSupplies[n].ref+"";
									}
									if(branches[k].startNode!=branches[k].endVoltPsEndNodes[m].startNode){
										if(sumAC==""){
											sumAC="("+branches[k].acVoltPwSupplies[n].voltage+")";
											sumACReal=branches[k].acVoltPwSupplies[n].ref;
											}
											else{
											sumAC=sumAC+"+ ("+branches[k].acVoltPwSupplies[n].voltage+")";
											sumACReal=sumACReal+"+"+branches[k].acVoltPwSupplies[n].ref;
										}
																		
									}
								}
							}
						}	
					}

					if(branches[k].capacitors.length>0){
						for(let q=0;q<branches[k].capacitors.length;q++){
							//eqs=eqs+" - ("+branches[k].capacitors[q].impedance+" * "+currents[k].ref+")";
							eq1=eq1+" - "+branches[k].capacitors[q].ref+" * "+currents[k].ref;
						}
					}

					if(branches[k].coils.length>0){
						for(let w=0;w<branches[k].coils.length;w++){
							//eqs=eqs+" - ("+branches[k].coils[w].impedance+" * "+currents[k].ref+")";
							eq1=eq1+" - "+branches[k].coils[w].ref+" * "+currents[k].ref;
						}
					}

					if((branches[k].resistors.length>0)||(branches[k].coils.length>0)||(branches[k].capacitors.length>0)){

						for(let z=0;z<branches[k].resistors.length;z++){
							
								if(branches[k].resistors[z].unitMult=="Ohm"){
								impRealNum=impRealNum+parseFloat(branches[k].resistors[z].value);}
								if(branches[k].resistors[z].unitMult=="kOhm"){
									impRealNum=impRealNum+(parseFloat(branches[k].resistors[z].value))*1000;}
								//impRealNum = +impRealNum.toFixed(2);
							
							impRealNum = +impRealNum.toFixed(2);
						}
						for(let y=0;y<branches[k].coils.length;y++){
							impImText=branches[k].coils[y].impedance;
							impImText=impImText.slice(0, -1);
							impImNum=impImNum+parseFloat(impImText);
							impImNum = +impImNum.toFixed(2);
						}

						for(let x=0;x<branches[k].capacitors.length;x++){
							impImText=branches[k].capacitors[x].impedance;
							impImText=impImText.slice(0, -1);
							impImNum=impImNum+parseFloat(impImText);
							impImNum = +impImNum.toFixed(2);
						}

						if((impRealNum==0)&&(eqs!="")){
							eqs=eqs + " - ("+impImNum+"i) * " +currents[k].ref;
						}

						if((impImNum==0)&&(eqs!="")){
							eqs=eqs + " - ("+impRealNum+") * " +currents[k].ref;
						}

						if((impImNum!=0)&&(impRealNum!=0)&&(eqs!="")){
							if(impImNum>0){
							eqs=eqs + " - ("+impRealNum+" + "+ impImNum+"i) * " +currents[k].ref;
							}
							else{
								eqs=eqs + " - ("+impRealNum+" "+ impImNum+"i) * " +currents[k].ref;	
							}
						}

						if((impRealNum==0)&&(eqs=="")){
							eqs="("+impImNum+"i) * " +currents[k].ref;
						}

						if((impImNum==0)&&(eqs=="")){
							eqs="("+impRealNum+") * " +currents[k].ref;
						}

						if((impImNum!=0)&&(impRealNum!=0)&&(eqs=="")){
							if (impImNum>0){
							eqs="("+impRealNum+" + "+ impImNum+"i) * " +currents[k].ref;
							}
							else{
							eqs="("+impRealNum+" "+ impImNum+"i) * " +currents[k].ref;
							}
						}



					/*if(branches[k].reactance=="0"){
						eqs=eqs+" -("+branches[k].equivImpedance.value+") * "+currents[k].ref;
					}else{eqs=eqs+ "-("+branches[k].reactance+"i) * "+currents[k].ref;}*/
					}
					//eqs=eqs+" -("+branches[k].equivImpedance.value+") * "+currents[k].ref;
					kendNode[i][j]=branches[k].endNode;
					kstartNode[i][j]=branches[k].startNode;
					sumResistors=0;
					break;
				}

				if((branches[k].id==Mesh[i][j])&&(j>0)&&((branches[k].endNode==kendNode[i][j-1])||(branches[k].startNode==kstartNode[i][j-1]))&&(s==-1)){

					impImNum=0;
					impRealNum=0;
					impImText="";

					
					if(branches[k].resistors.length>0){
						//eqs=eqs+" + "+sumResistors+" * "+currents[k].ref;
						//eq1=eq1+" + "+branches[k].ref+" * "+currents[k].ref;
						for(let n=0;n<branches[k].resistors.length;n++){
							if(eq1==""){
							eq1=branches[k].resistors[n].ref+" * "+currents[k].ref;
							}
							else{
								eq1=eq1+" + "+branches[k].resistors[n].ref+" * "+currents[k].ref;
							}
						}
						
					}
					/*if((branches[k].dcVoltPwSupplies.length>0)&&(branches[k].startNode==branches[k].endVoltPsEndNodes[0].startNode)){
						sumDC=sumDC+parseInt(branches[k].equivVoltPs.value);
						sumDCReal=sumDCReal+" + "+branches[k].dcVoltPwSupplies[0].ref;
					}
					if((branches[k].dcVoltPwSupplies.length>0)&&(branches[k].startNode!=branches[k].endVoltPsEndNodes[0].startNode)){
						sumDC=sumDC-parseInt(branches[k].equivVoltPs.value);
						sumDCReal=sumDCReal+" - "+branches[k].dcVoltPwSupplies[0].ref;
					}*/

					if(branches[k].dcVoltPwSupplies.length>0){
						for(let n=0;n<branches[k].dcVoltPwSupplies.length;n++){
							if(branches[k].startNode==branches[k].endVoltPsEndNodes[n].startNode){
								if(sumDCReal==""){
									sumDCReal=branches[k].dcVoltPwSupplies[n].ref;
								}
								else{
									sumDCReal=sumDCReal+" + "+branches[k].dcVoltPwSupplies[n].ref;
								}
								
							}

							if(branches[k].startNode!=branches[k].endVoltPsEndNodes[n].startNode){
								sumDCReal=sumDCReal+" - "+branches[k].dcVoltPwSupplies[n].ref;
							}

						}
						sumDC=sumDC+parseFloat(branches[k].equivVoltPs.value);
						
					}

					if(branches[k].acVoltPwSupplies.length>0){

						for(let n=0;n<branches[k].acVoltPwSupplies.length;n++){
							for(let m=0;m<branches[k].endVoltPsEndNodes.length;m++){
								if(branches[k].acVoltPwSupplies[n].ref==branches[k].endVoltPsEndNodes[m].voltPsRef){
									if(branches[k].startNode==branches[k].endVoltPsEndNodes[m].startNode){
										if(sumAC==""){
											sumAC="("+branches[k].acVoltPwSupplies[n].voltage+")";
											sumACReal=branches[k].acVoltPwSupplies[n].ref;
											}
											else{
											sumAC=sumAC+"+ ("+branches[k].acVoltPwSupplies[n].voltage+")";
											sumACReal=sumACReal+"+"+branches[k].acVoltPwSupplies[n].ref;
										}
									}
									if(branches[k].startNode!=branches[k].endVoltPsEndNodes[m].startNode){
										sumAC=sumAC+" -("+branches[k].acVoltPwSupplies[n].voltage+")";
										sumACReal=sumACReal+" - "+branches[k].acVoltPwSupplies[n].ref+"";
										
									}
								}
							}
						}	
					}

					if(branches[k].capacitors.length>0){
						for(let q=0;q<branches[k].capacitors.length;q++){
							//eqs=eqs+" + ("+branches[k].capacitors[q].impedance+" * "+currents[k].ref+")";
							eq1=eq1+" + "+branches[k].capacitors[q].ref+" * "+currents[k].ref;
						}
					}
					if(branches[k].coils.length>0){
						for(let w=0;w<branches[k].coils.length;w++){
							//eqs=eqs+" + ("+branches[k].coils[w].impedance+" * "+currents[k].ref+")";
							eq1=eq1+" + "+branches[k].coils[w].ref+" * "+currents[k].ref;
						}
					}

					if((branches[k].resistors.length>0)||(branches[k].coils.length>0)||(branches[k].capacitors.length>0)){

						for(let z=0;z<branches[k].resistors.length;z++){
							
								if(branches[k].resistors[z].unitMult=="Ohm"){
								impRealNum=impRealNum+parseFloat(branches[k].resistors[z].value);}
								if(branches[k].resistors[z].unitMult=="kOhm"){
									impRealNum=impRealNum+(parseFloat(branches[k].resistors[z].value))*1000;}
								//impRealNum = +impRealNum.toFixed(2);
							
							impRealNum = +impRealNum.toFixed(2);
						}
						for(let y=0;y<branches[k].coils.length;y++){
							impImText=branches[k].coils[y].impedance;
							impImText=impImText.slice(0, -1);
							impImNum=impImNum+parseFloat(impImText);
							impImNum = +impImNum.toFixed(2);
						}

						for(let x=0;x<branches[k].capacitors.length;x++){
							impImText=branches[k].capacitors[x].impedance;
							impImText=impImText.slice(0, -1);
							impImNum=impImNum+parseFloat(impImText);
							impImNum = +impImNum.toFixed(2);
						}

						if((impRealNum==0)&&(eqs!="")){
							eqs=eqs + " + ("+impImNum+"i) * " +currents[k].ref;
						}

						if((impImNum==0)&&(eqs!="")){
							eqs=eqs + " + ("+impRealNum+") * " +currents[k].ref;
						}

						if((impImNum!=0)&&(impRealNum!=0)&&(eqs!="")){
							if(impImNum>0){
							eqs=eqs + " + ("+impRealNum+" + "+ impImNum+"i) * " +currents[k].ref;
							}
							else{
								eqs=eqs + " + ("+impRealNum+" "+ impImNum+"i) * " +currents[k].ref;	
							}
						}

						if((impRealNum==0)&&(eqs=="")){
							eqs="("+impImNum+"i) * " +currents[k].ref;
						}

						if((impImNum==0)&&(eqs=="")){
							eqs="("+impRealNum+") * " +currents[k].ref;
						}

						if((impImNum!=0)&&(impRealNum!=0)&&(eqs=="")){
							if (impImNum>0){
							eqs="("+impRealNum+" + "+ impImNum+"i) * " +currents[k].ref;
							}
							else{
							eqs="("+impRealNum+" "+ impImNum+"i) * " +currents[k].ref;
							}
						}

						


					/*if(eqs==""){
						if(branches[k].reactance=="0"){
							eqs=eqs+ "("+branches[k].equivImpedance.value+") * "+currents[k].ref;
						}else{eqs=eqs+ "("+branches[k].reactance+"i) * "+currents[k].ref;}

						//eqs=eqs+" ("+branches[k].equivImpedance.value+") * "+currents[k].ref;
					}
					else{
						if(branches[k].reactance=="0"){
							eqs=eqs+ " + ("+branches[k].equivImpedance.value+") * "+currents[k].ref;
						}else{eqs=eqs + " + ("+branches[k].reactance+"i) * "+currents[k].ref;}

						//eqs=eqs+" + ("+branches[k].equivImpedance.value+") * "+currents[k].ref;
					}*/
					}
					kendNode[i][j]=branches[k].endNode;
					kstartNode[i][j]=branches[k].startNode;
					s=1;
					sumResistors=0;
					break;
				}


				
				if((branches[k].id==Mesh[i][j])&&(j>0)&&((branches[k].startNode==kendNode[i][j-1])||(branches[k].endNode==kstartNode[i][j-1]))&&(s==1)){

					impImNum=0;
					impRealNum=0;
					impImText="";


					if(branches[k].resistors.length>0){
						//eqs=eqs+" + "+sumResistors+" * "+currents[k].ref;
						//eq1=eq1+" + "+branches[k].ref+" * "+currents[k].ref;
						for(let n=0;n<branches[k].resistors.length;n++){
							if(eq1==""){
							eq1=branches[k].resistors[n].ref+" * "+currents[k].ref;
							}
							else{
								eq1=eq1+" + "+branches[k].resistors[n].ref+" * "+currents[k].ref;
							}
						}
					}
					

					if(branches[k].dcVoltPwSupplies.length>0){
						for(let n=0;n<branches[k].dcVoltPwSupplies.length;n++){
							if(branches[k].startNode==branches[k].endVoltPsEndNodes[n].startNode){
								if(sumDCReal==""){
									sumDCReal=branches[k].dcVoltPwSupplies[n].ref;
								}
								else{
									sumDCReal=sumDCReal+" + "+branches[k].dcVoltPwSupplies[n].ref;
								}
								
							}

							if(branches[k].startNode!=branches[k].endVoltPsEndNodes[n].startNode){
								sumDCReal=sumDCReal+" - "+branches[k].dcVoltPwSupplies[n].ref;
							}

						}
						sumDC=sumDC+parseFloat(branches[k].equivVoltPs.value);
						
					}

					if(branches[k].acVoltPwSupplies.length>0){

						for(let n=0;n<branches[k].acVoltPwSupplies.length;n++){
							for(let m=0;m<branches[k].endVoltPsEndNodes.length;m++){
								if(branches[k].acVoltPwSupplies[n].ref==branches[k].endVoltPsEndNodes[m].voltPsRef){
									if(branches[k].startNode==branches[k].endVoltPsEndNodes[m].startNode){
										if(sumAC==""){
											sumAC="("+branches[k].acVoltPwSupplies[n].voltage+")";
											sumACReal=branches[k].acVoltPwSupplies[n].ref;
											}
											else{
											sumAC=sumAC+"+ ("+branches[k].acVoltPwSupplies[n].voltage+")";
											sumACReal=sumACReal+"+"+branches[k].acVoltPwSupplies[n].ref;
										}
									}
									if(branches[k].startNode!=branches[k].endVoltPsEndNodes[m].startNode){
										sumAC=sumAC+" -("+branches[k].acVoltPwSupplies[n].voltage+")";
										sumACReal=sumACReal+" - "+branches[k].acVoltPwSupplies[n].ref+"";
										
									}
								}
							}
						}	
					}

					if(branches[k].capacitors.length>0){
						for(let q=0;q<branches[k].capacitors.length;q++){
							//eqs=eqs+" + ("+branches[k].capacitors[q].impedance+" * "+currents[k].ref+")";
							eq1=eq1+" + "+branches[k].capacitors[q].ref+" * "+currents[k].ref;
						}
					}

					if(branches[k].coils.length>0){
						for(let w=0;w<branches[k].coils.length;w++){
							//eqs=eqs+" + ("+branches[k].coils[w].impedance+" * "+currents[k].ref+")";
							eq1=eq1+" + "+branches[k].coils[w].ref+" * "+currents[k].ref;
						}
					}

					if((branches[k].resistors.length>0)||(branches[k].coils.length>0)||(branches[k].capacitors.length>0)){

						for(let z=0;z<branches[k].resistors.length;z++){
						
								if(branches[k].resistors[z].unitMult=="Ohm"){
								impRealNum=impRealNum+parseFloat(branches[k].resistors[z].value);}
								if(branches[k].resistors[z].unitMult=="kOhm"){
									impRealNum=impRealNum+(parseFloat(branches[k].resistors[z].value))*1000;}
								//impRealNum = +impRealNum.toFixed(2);
							
							impRealNum = +impRealNum.toFixed(2);
						}
						for(let y=0;y<branches[k].coils.length;y++){
							impImText=branches[k].coils[y].impedance;
							impImText=impImText.slice(0, -1);
							impImNum=impImNum+parseFloat(impImText);
							impImNum = +impImNum.toFixed(2);
						}

						for(let x=0;x<branches[k].capacitors.length;x++){
							impImText=branches[k].capacitors[x].impedance;
							impImText=impImText.slice(0, -1);
							impImNum=impImNum+parseFloat(impImText);
							impImNum = +impImNum.toFixed(2);
						}

						if((impRealNum==0)&&(eqs!="")){
							eqs=eqs + " + ("+impImNum+"i) * " +currents[k].ref;
						}

						if((impImNum==0)&&(eqs!="")){
							eqs=eqs + " + ("+impRealNum+") * " +currents[k].ref;
						}

						if((impImNum!=0)&&(impRealNum!=0)&&(eqs!="")){
							if(impImNum>0){
							eqs=eqs + " + ("+impRealNum+" + "+ impImNum+"i) * " +currents[k].ref;
							}
							else{
								eqs=eqs + " + ("+impRealNum+" "+ impImNum+"i) * " +currents[k].ref;	
							}
						}

						if((impRealNum==0)&&(eqs=="")){
							eqs="("+impImNum+"i) * " +currents[k].ref;
						}

						if((impImNum==0)&&(eqs=="")){
							eqs="("+impRealNum+") * " +currents[k].ref;
						}

						if((impImNum!=0)&&(impRealNum!=0)&&(eqs=="")){
							if (impImNum>0){
							eqs="("+impRealNum+" + "+ impImNum+"i) * " +currents[k].ref;
							}
							else{
							eqs="("+impRealNum+" "+ impImNum+"i) * " +currents[k].ref;
							}
						}

						




					/*if(eqs==""){
						if(branches[k].reactance=="0"){
							eqs=eqs + "("+branches[k].equivImpedance.value+") * "+currents[k].ref;
						}else{eqs=eqs +"("+branches[k].reactance+"i) * "+currents[k].ref;}

						//eqs=eqs+" ("+branches[k].equivImpedance.value+") * "+currents[k].ref;
					}
					else{
						if(branches[k].reactance=="0"){
							eqs=eqs +" + ("+branches[k].equivImpedance.value+") * "+currents[k].ref;
						}else{eqs=eqs+ " + ("+branches[k].reactance+"i) * "+currents[k].ref;}
						//eqs=eqs+" + ("+branches[k].equivImpedance.value+") * "+currents[k].ref;
					}*/
					}
					kendNode[i][j]=branches[k].endNode;
					kstartNode[i][j]=branches[k].startNode;
					sumResistors=0;
					break;

				}

				if((branches[k].id==Mesh[i][j])&&(j>0)&&((branches[k].endNode==kendNode[i][j-1])||(branches[k].startNode==kstartNode[i][j-1]))&&(s==1)){

					impImNum=0;
					impRealNum=0;
					impImText="";


					if(branches[k].resistors.length>0){
						
						for(let n=0;n<branches[k].resistors.length;n++){
							
							eq1=eq1+" - "+branches[k].resistors[n].ref+" * "+currents[k].ref;
							
						}
					}
					

					if(branches[k].dcVoltPwSupplies.length>0){
						for(let n=0;n<branches[k].dcVoltPwSupplies.length;n++){
							if(branches[k].startNode==branches[k].endVoltPsEndNodes[n].startNode){

								sumDCReal=sumDCReal+" - "+branches[k].dcVoltPwSupplies[n].ref;						
							}

							if(branches[k].startNode!=branches[k].endVoltPsEndNodes[n].startNode){
								if(sumDCReal==""){
									sumDCReal=branches[k].dcVoltPwSupplies[n].ref;
								}
								else{
									sumDCReal=sumDCReal+" + "+branches[k].dcVoltPwSupplies[n].ref;
								}
							}

						}
						if(parseFloat(branches[k].equivVoltPs.value)>0){
						sumDC=sumDC-parseFloat(branches[k].equivVoltPs.value);
						}
						if(parseFloat(branches[k].equivVoltPs.value)<0){
						sumDC=sumDC-parseFloat(branches[k].equivVoltPs.value);
						}
					}

					if(branches[k].acVoltPwSupplies.length>0){

						for(let n=0;n<branches[k].acVoltPwSupplies.length;n++){
							for(let m=0;m<branches[k].endVoltPsEndNodes.length;m++){
								if(branches[k].acVoltPwSupplies[n].ref==branches[k].endVoltPsEndNodes[m].voltPsRef){
									if(branches[k].startNode==branches[k].endVoltPsEndNodes[m].startNode){
										sumAC=sumAC+" -("+branches[k].acVoltPwSupplies[n].voltage+")";
										sumACReal=sumACReal+" - "+branches[k].acVoltPwSupplies[n].ref+"";
									}
									if(branches[k].startNode!=branches[k].endVoltPsEndNodes[m].startNode){
										if(sumAC==""){
											sumAC="("+branches[k].acVoltPwSupplies[n].voltage+")";
											sumACReal=branches[k].acVoltPwSupplies[n].ref;
											}
											else{
											sumAC=sumAC+"+ ("+branches[k].acVoltPwSupplies[n].voltage+")";
											sumACReal=sumACReal+"+"+branches[k].acVoltPwSupplies[n].ref;
										}
																		
									}
								}
							}
						}	
					}

					if(branches[k].capacitors.length>0){
						for(let q=0;q<branches[k].capacitors.length;q++){
							//eqs=eqs+" - ("+branches[k].capacitors[q].impedance+" * "+currents[k].ref+")";
							eq1=eq1+" - "+branches[k].capacitors[q].ref+" * "+currents[k].ref;
						}
					}

					if(branches[k].coils.length>0){
						for(let w=0;w<branches[k].coils.length;w++){
							//eqs=eqs+" - ("+branches[k].coils[w].impedance+" * "+currents[k].ref+")";
							eq1=eq1+" - "+branches[k].coils[w].ref+" * "+currents[k].ref;
						}
					}

					if((branches[k].resistors.length>0)||(branches[k].coils.length>0)||(branches[k].capacitors.length>0)){

						for(let z=0;z<branches[k].resistors.length;z++){
							
								if(branches[k].resistors[z].unitMult=="Ohm"){
								impRealNum=impRealNum+parseFloat(branches[k].resistors[z].value);}
								if(branches[k].resistors[z].unitMult=="kOhm"){
									impRealNum=impRealNum+(parseFloat(branches[k].resistors[z].value))*1000;}
								//impRealNum = +impRealNum.toFixed(2);
							
							impRealNum = +impRealNum.toFixed(2);
						}
						for(let y=0;y<branches[k].coils.length;y++){
							impImText=branches[k].coils[y].impedance;
							impImText=impImText.slice(0, -1);
							impImNum=impImNum+parseFloat(impImText);
							impImNum = +impImNum.toFixed(2);
						}

						for(let x=0;x<branches[k].capacitors.length;x++){
							impImText=branches[k].capacitors[x].impedance;
							impImText=impImText.slice(0, -1);
							impImNum=impImNum+parseFloat(impImText);
							impImNum = +impImNum.toFixed(2);
						}

						if((impRealNum==0)&&(eqs!="")){
							eqs=eqs + " - ("+impImNum+"i) * " +currents[k].ref;
						}

						if((impImNum==0)&&(eqs!="")){
							eqs=eqs + " - ("+impRealNum+") * " +currents[k].ref;
						}

						if((impImNum!=0)&&(impRealNum!=0)&&(eqs!="")){
							if(impImNum>0){
							eqs=eqs + " - ("+impRealNum+" + "+ impImNum+"i) * " +currents[k].ref;
							}
							else{
								eqs=eqs + " - ("+impRealNum+" "+ impImNum+"i) * " +currents[k].ref;	
							}
						}

						if((impRealNum==0)&&(eqs=="")){
							eqs="("+impImNum+"i) * " +currents[k].ref;
						}

						if((impImNum==0)&&(eqs=="")){
							eqs="("+impRealNum+") * " +currents[k].ref;
						}

						if((impImNum!=0)&&(impRealNum!=0)&&(eqs=="")){
							if (impImNum>0){
							eqs="("+impRealNum+" + "+ impImNum+"i) * " +currents[k].ref;
							}
							else{
							eqs="("+impRealNum+" "+ impImNum+"i) * " +currents[k].ref;
							}
						}





					/*if(branches[k].reactance=="0"){
						eqs=eqs + " - ("+branches[k].equivImpedance.value+") * "+currents[k].ref;
					}else{eqs=eqs +" - ("+branches[k].reactance+"i) * "+currents[k].ref;}*/
					}
					//eqs=eqs+" -("+branches[k].equivImpedance.value+") * "+currents[k].ref;
					kendNode[i][j]=branches[k].endNode;
					kstartNode[i][j]=branches[k].startNode;
					s=-1
					sumResistors=0;
					break;
				}

				if((branches[k].id==Mesh[i][j])&&(j>0)&&((branches[k].endNode==kendNode[i][j-1])||(branches[k].startNode==kstartNode[i][j-1]))&&(s==0)){

					impImNum=0;
					impRealNum=0;
					impImText="";


					if(branches[k].resistors.length>0){
						//eqs=eqs+" - "+sumResistors+" * "+currents[k].ref;
						//eq1=eq1+" - "+branches[k].ref+" * "+currents[k].ref;
						for(let n=0;n<branches[k].resistors.length;n++){
							
							eq1=eq1+" - "+branches[k].resistors[n].ref+" * "+currents[k].ref;
							
						}
					}
					/*if((branches[k].dcVoltPwSupplies.length>0)&&(branches[k].startNode==branches[k].endVoltPsEndNodes[0].startNode)){
						sumDC=sumDC-parseInt(branches[k].equivVoltPs.value);
						sumDCReal=sumDCReal+" - "+branches[k].dcVoltPwSupplies[0].ref;
					}*/

					if(branches[k].dcVoltPwSupplies.length>0){
						for(let n=0;n<branches[k].dcVoltPwSupplies.length;n++){
							if(branches[k].startNode==branches[k].endVoltPsEndNodes[n].startNode){

								sumDCReal=sumDCReal+" - "+branches[k].dcVoltPwSupplies[n].ref;						
							}

							if(branches[k].startNode!=branches[k].endVoltPsEndNodes[n].startNode){
								if(sumDCReal==""){
									sumDCReal=branches[k].dcVoltPwSupplies[n].ref;
								}
								else{
									sumDCReal=sumDCReal+" + "+branches[k].dcVoltPwSupplies[n].ref;
								}
							}

						}
						if(parseFloat(branches[k].equivVoltPs.value)>0){
						sumDC=sumDC-parseFloat(branches[k].equivVoltPs.value);
						}
						if(parseFloat(branches[k].equivVoltPs.value)<0){
						sumDC=sumDC-parseFloat(branches[k].equivVoltPs.value);
						}
					}

					if(branches[k].acVoltPwSupplies.length>0){

						for(let n=0;n<branches[k].acVoltPwSupplies.length;n++){
							for(let m=0;m<branches[k].endVoltPsEndNodes.length;m++){
								if(branches[k].acVoltPwSupplies[n].ref==branches[k].endVoltPsEndNodes[m].voltPsRef){
									if(branches[k].startNode==branches[k].endVoltPsEndNodes[m].startNode){
										sumAC=sumAC+" -("+branches[k].acVoltPwSupplies[n].voltage+")";
										sumACReal=sumACReal+" - "+branches[k].acVoltPwSupplies[n].ref+"";
									}
									if(branches[k].startNode!=branches[k].endVoltPsEndNodes[m].startNode){
										if(sumAC==""){
											sumAC="("+branches[k].acVoltPwSupplies[n].voltage+")";
											sumACReal=branches[k].acVoltPwSupplies[n].ref;
											}
											else{
											sumAC=sumAC+"+ ("+branches[k].acVoltPwSupplies[n].voltage+")";
											sumACReal=sumACReal+"+"+branches[k].acVoltPwSupplies[n].ref;
										}
																		
									}
								}
							}
						}	
					}
					




					if(branches[k].capacitors.length>0){
						for(let q=0;q<branches[k].capacitors.length;q++){
							//eqs=eqs+" - ("+branches[k].capacitors[q].impedance+" * "+currents[k].ref+")";
							eq1=eq1+" - "+branches[k].capacitors[q].ref+" * "+currents[k].ref;
						}
					}

					if(branches[k].coils.length>0){
						for(let w=0;w<branches[k].coils.length;w++){
							//eqs=eqs+" - ("+branches[k].coils[w].impedance+" * "+currents[k].ref+")";
							eq1=eq1+" - "+branches[k].coils[w].ref+" * "+currents[k].ref;
						}
					}

					if((branches[k].resistors.length>0)||(branches[k].coils.length>0)||(branches[k].capacitors.length>0)){

						for(let z=0;z<branches[k].resistors.length;z++){
							
								if(branches[k].resistors[z].unitMult=="Ohm"){
								impRealNum=impRealNum+parseFloat(branches[k].resistors[z].value);}
								if(branches[k].resistors[z].unitMult=="kOhm"){
									impRealNum=impRealNum+(parseFloat(branches[k].resistors[z].value))*1000;}
								//impRealNum = +impRealNum.toFixed(2);
							
							impRealNum = +impRealNum.toFixed(2);
						}
						for(let y=0;y<branches[k].coils.length;y++){
							impImText=branches[k].coils[y].impedance;
							impImText=impImText.slice(0, -1);
							impImNum=impImNum+parseFloat(impImText);
							impImNum = +impImNum.toFixed(2);
						}

						for(let x=0;x<branches[k].capacitors.length;x++){
							impImText=branches[k].capacitors[x].impedance;
							impImText=impImText.slice(0, -1);
							impImNum=impImNum+parseFloat(impImText);
							impImNum = +impImNum.toFixed(2);
						}

						if((impRealNum==0)&&(eqs!="")){
							eqs=eqs + " - ("+impImNum+"i) * " +currents[k].ref;
						}

						if((impImNum==0)&&(eqs!="")){
							eqs=eqs + " - ("+impRealNum+") * " +currents[k].ref;
						}

						if((impImNum!=0)&&(impRealNum!=0)&&(eqs!="")){
							if(impImNum>0){
							eqs=eqs + " - ("+impRealNum+" + "+ impImNum+"i) * " +currents[k].ref;
							}
							else{
								eqs=eqs + " - ("+impRealNum+" "+ impImNum+"i) * " +currents[k].ref;	
							}
						}

						if((impRealNum==0)&&(eqs=="")){
							eqs="("+impImNum+"i) * " +currents[k].ref;
						}

						if((impImNum==0)&&(eqs=="")){
							eqs="("+impRealNum+") * " +currents[k].ref;
						}

						if((impImNum!=0)&&(impRealNum!=0)&&(eqs=="")){
							if (impImNum>0){
							eqs="("+impRealNum+" + "+ impImNum+"i) * " +currents[k].ref;
							}
							else{
							eqs="("+impRealNum+" "+ impImNum+"i) * " +currents[k].ref;
							}
						}

						



					/*if(branches[k].reactance=="0"){
						eqs=eqs + " -("+branches[k].equivImpedance.value+") * "+currents[k].ref;
					}else{eqs=eqs+" -("+branches[k].reactance+"i) * "+currents[k].ref;}*/
					}
					//eqs=eqs+" -("+branches[k].equivImpedance.value+") * "+currents[k].ref;
					kendNode[i][j]=branches[k].endNode;
					kstartNode[i][j]=branches[k].startNode;
					s=-1;
					sumResistors=0;
					break;
				}
				
				if((branches[k].id==Mesh[i][j])&&(j>0)&&((branches[k].startNode==kendNode[i][j-1])||(branches[k].endNode==kstartNode[i][j-1]))&&(s==0)){

					impImNum=0;
					impRealNum=0;
					impImText="";


					if(branches[k].resistors.length>0){
						//eqs=eqs+" + "+sumResistors+" * "+currents[k].ref;
						//eq1=eq1+" + "+branches[k].ref+" * "+currents[k].ref;
						for(let n=0;n<branches[k].resistors.length;n++){
							if(eq1==""){
							eq1=branches[k].resistors[n].ref+" * "+currents[k].ref;
							}
							else{
								eq1=eq1+" + "+branches[k].resistors[n].ref+" * "+currents[k].ref;
							}
						}
					}
					
					

					if(branches[k].dcVoltPwSupplies.length>0){
						for(let n=0;n<branches[k].dcVoltPwSupplies.length;n++){
							if(branches[k].startNode==branches[k].endVoltPsEndNodes[n].startNode){
								if(sumDCReal==""){
									sumDCReal=branches[k].dcVoltPwSupplies[n].ref;
								}
								else{
									sumDCReal=sumDCReal+" + "+branches[k].dcVoltPwSupplies[n].ref;
								}
								
							}

							if(branches[k].startNode!=branches[k].endVoltPsEndNodes[n].startNode){
								sumDCReal=sumDCReal+" - "+branches[k].dcVoltPwSupplies[n].ref;
							}

						}
						sumDC=sumDC+parseFloat(branches[k].equivVoltPs.value);
						
					}

					if(branches[k].acVoltPwSupplies.length>0){

						for(let n=0;n<branches[k].acVoltPwSupplies.length;n++){
							for(let m=0;m<branches[k].endVoltPsEndNodes.length;m++){
								if(branches[k].acVoltPwSupplies[n].ref==branches[k].endVoltPsEndNodes[m].voltPsRef){
									if(branches[k].startNode==branches[k].endVoltPsEndNodes[m].startNode){
										if(sumAC==""){
											sumAC="("+branches[k].acVoltPwSupplies[n].voltage+")";
											sumACReal=branches[k].acVoltPwSupplies[n].ref;
											}
											else{
											sumAC=sumAC+"+ ("+branches[k].acVoltPwSupplies[n].voltage+")";
											sumACReal=sumACReal+"+"+branches[k].acVoltPwSupplies[n].ref;
										}
										
									}
									if(branches[k].startNode!=branches[k].endVoltPsEndNodes[m].startNode){
										sumAC=sumAC+" -("+branches[k].acVoltPwSupplies[n].voltage+")";
										sumACReal=sumACReal+" - "+branches[k].acVoltPwSupplies[n].ref+"";
									}
								}
							}
						}	
					}

					if(branches[k].capacitors.length>0){
						for(let q=0;q<branches[k].capacitors.length;q++){
							//eqs=eqs+" + ("+branches[k].capacitors[q].impedance+" * "+currents[k].ref+")";
							eq1=eq1+" + "+branches[k].capacitors[q].ref+" * "+currents[k].ref;
						}
					}

					if(branches[k].coils.length>0){
						for(let w=0;w<branches[k].coils.length;w++){
							//eqs=eqs+" + ("+branches[k].coils[w].impedance+" * "+currents[k].ref+")";
							eq1=eq1+" + "+branches[k].coils[w].ref+" * "+currents[k].ref;
						}
					}

					if((branches[k].resistors.length>0)||(branches[k].coils.length>0)||(branches[k].capacitors.length>0)){

						for(let z=0;z<branches[k].resistors.length;z++){
							if(branches[k].resistors[z].unitMult=="Ohm"){
							impRealNum=impRealNum+parseFloat(branches[k].resistors[z].value);}
							if(branches[k].resistors[z].unitMult=="kOhm"){
								impRealNum=impRealNum+(parseFloat(branches[k].resistors[z].value))*1000;}
							//impRealNum = +impRealNum.toFixed(2);
						}
						for(let y=0;y<branches[k].coils.length;y++){
							impImText=branches[k].coils[y].impedance;
							impImText=impImText.slice(0, -1);
							impImNum=impImNum+parseFloat(impImText);
							if(branches[k].coils[y].unitMult=="mH"){
								impImNum=+impImNum.toFixed(5);
							}
							if(branches[k].coils[y].unitMult=="nH"){
								impImNum=+impImNum.toFixed(8);
							}
							//impImNum = +impImNum.toFixed(2);
						}

						for(let x=0;x<branches[k].capacitors.length;x++){
							impImText=branches[k].capacitors[x].impedance;
							impImText=impImText.slice(0, -1);
							impImNum=impImNum+parseFloat(impImText);
							//impImNum = +impImNum.toFixed(2);
						}
						impRealNum = +impRealNum.toFixed(2);
						//impImNum = +impImNum.toFixed(2);
						if((impRealNum==0)&&(eqs!="")){
							eqs=eqs + " + ("+impImNum+"i) * " +currents[k].ref;
						}

						if((impImNum==0)&&(eqs!="")){
							eqs=eqs + " + ("+impRealNum+") * " +currents[k].ref;
						}

						if((impImNum!=0)&&(impRealNum!=0)&&(eqs!="")){
							if(impImNum>0){
							eqs=eqs + " + ("+impRealNum+" + "+ impImNum+"i) * " +currents[k].ref;
							}
							else{
								eqs=eqs + " + ("+impRealNum+" "+ impImNum+"i) * " +currents[k].ref;	
							}
						}

						if((impRealNum==0)&&(eqs=="")){
							eqs="("+impImNum+"i) * " +currents[k].ref;
						}

						if((impImNum==0)&&(eqs=="")){
							eqs="("+impRealNum+") * " +currents[k].ref;
						}

						if((impImNum!=0)&&(impRealNum!=0)&&(eqs=="")){
							if (impImNum>0){
							eqs="("+impRealNum+" + "+ impImNum+"i) * " +currents[k].ref;
							}
							else{
							eqs="("+impRealNum+" "+ impImNum+"i) * " +currents[k].ref;
							}
						}

						



					/*if(eqs==""){
						if(branches[k].reactance=="0"){
							eqs=eqs+ "("+branches[k].equivImpedance.value+") * "+currents[k].ref;
						}else{eqs=eqs+ "("+branches[k].reactance+"i) * "+currents[k].ref;}
						//eqs=eqs+" ("+branches[k].equivImpedance.value+") * "+currents[k].ref;
					}
					else{
						if(branches[k].reactance=="0"){
							eqs=eqs+" + ("+branches[k].equivImpedance.value+") * "+currents[k].ref;
						}else{eqs=eqs+ " + ("+branches[k].reactance+"i) * "+currents[k].ref;}
						//eqs=eqs+" + ("+branches[k].equivImpedance.value+") * "+currents[k].ref;
					}*/
					
				}
					
					kendNode[i][j]=branches[k].endNode;
					kstartNode[i][j]=branches[k].startNode;
					s=1;
					sumResistors=0;
					break;
				}

				
				
				impImNum=0;
				impRealNum=0;
				impImText="";
				sumResistors=0;
				
			}
			
	}
		equations1[i]=eqs+" = "+sumDC;

		//if(sumDCReal==""){
		//	sumDCReal=0;
		//}
		if ((sumACReal!="")&&(sumDCReal!="")){
			let equationReal={
				"type": 1,
				"mesh": Mesh[i],
				"equation": eq1+" = "+sumDCReal+" + "+sumACReal,
			}
			meshEquations.equationReal.push(equationReal);
			
			let equation={
				"type": 1,
				"mesh": Mesh[i],
				"equation": eqs+" -("+sumDC+")"+"-("+sumAC+")",
			}
			meshEquations.equations.push(equation);

			let equationRevealed={
				"type": 1,
				"mesh": Mesh[i],
				"equation": eqs+" = ("+sumDC+") + ("+sumAC+")",
			}
			meshEquations.equationsRevealed.push(equationRevealed);
		}
		if ((sumACReal=="")&&(sumDCReal!="")){
			let equationReal={
				"type": 1,
				"mesh": Mesh[i],
				"equation": eq1+" = "+sumDCReal,
			}
			meshEquations.equationReal.push(equationReal);
			
			let equation={
				"type": 1,
				"mesh": Mesh[i],
				"equation": eqs+" -("+sumDC+")",
			}
			meshEquations.equations.push(equation);

			let equationRevealed={
				"type": 1,
				"mesh": Mesh[i],
				"equation": eqs+" = "+sumDC,
			}
			meshEquations.equationsRevealed.push(equationRevealed);
		}

		if ((sumACReal!="")&&(sumDCReal=="")){
			let equationReal={
				"type": 1,
				"mesh": Mesh[i],
				"equation": eq1+" = "+sumACReal,
			}
			meshEquations.equationReal.push(equationReal);
			
			let equation={
				"type": 1,
				"mesh": Mesh[i],
				"equation": eqs+" -("+sumAC+")",
			}
			meshEquations.equations.push(equation);

			let equationRevealed={
				"type": 1,
				"mesh": Mesh[i],
				"equation": eqs+" = "+sumAC,
			}
			meshEquations.equationsRevealed.push(equationRevealed);
		}
		if ((sumACReal=="")&&(sumDCReal=="")){
			let equationReal={
				"type": 1,
				"mesh": Mesh[i],
				"equation": eq1+" = 0 ",
			}
			meshEquations.equationReal.push(equationReal);
			
			let equation={
				"type": 1,
				"mesh": Mesh[i],
				"equation": eqs+" -( 0 )",
			}
			meshEquations.equations.push(equation);

			let equationRevealed={
				"type": 1,
				"mesh": Mesh[i],
				"equation": eqs+" = 0",
			}
			meshEquations.equationsRevealed.push(equationRevealed);
		}

		

		

		eqs="";
		eq1="";
		s=0;
		sumDC=0;
		sumDCReal="";
		sumAC="";
		sumACReal="";
	}
	return{
		first: false,
		second: 0,
		third: meshEquations
	};
	
}

/**
 * 
 */
function getAllEquations(eqNos,eqMesh){
	let allEquations={
		"equations": [],
		"equationReal":[],
		"equationsRevealed":[],
		};
		for(let i=0;i<eqNos.equations.length;i++){
			allEquations.equations.push(eqNos.equations[i])
		}
		for(let i=0;i<eqNos.equations.length;i++){
			allEquations.equationReal.push(eqNos.equationReal[i])
		}
		for(let i=0;i<eqMesh.equations.length;i++){
			allEquations.equations.push(eqMesh.equations[i])
		}
		for(let i=0;i<eqMesh.equations.length;i++){
			allEquations.equationReal.push(eqMesh.equationReal[i])
		}
		for(let i=0;i<eqMesh.equations.length;i++){
			allEquations.equationsRevealed.push(eqMesh.equationsRevealed[i])
		}
		for(let i=0;i<eqNos.equations.length;i++){
			allEquations.equationsRevealed.push(eqNos.equationsRevealed[i])	
		}
		return{
			first: false,
			second: 0,
			third: allEquations
		};
}

/**
 * 
 * 
 */

function eqSolver(all_equations){
	let currResult= [];
	let eqresult;
	var letters=["a","b","c","d","f","g","h","j","k","l","m","n","o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A","B","C","D","F","G","H","J","K","L","M","N","O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
	
	var eq=[];
	let numHelp=0;
	let zangulo=0;
	let sumACAmpresult=0;
	let radanguloAC=0;
	let valuevAC=0;
	let ComplexAC;
	for(let i=0;i<all_equations.equations.length;i++){
		eq[i]=all_equations.equations[i].equation;
	}

	for(let i=0;i<all_equations.equations.length;i++){
		for (let j=0;j<currents.length;j++){
	
			if((branches[j].dcAmpPwSupplies.length==0)||(branches[j].acAmpPwSupplies.length==0)){
				eq[i]=eq[i].replace(currents[j].ref+" ",letters[j]);
				eq[i]=eq[i].replace(letters[j],letters[j]+" ");
								
		}



		}
			}
	var ziq = new linearEqSystem();
	for(let i=0;i<eq.length;i++){
		ziq.addEquation(eq[i]);
		}
	ziq.buildSystem();
	var txr = solve(ziq.coefMatrix, ziq.consMatrix, ziq.varMatrix,12);

	for(let i=0;i<currents.length;i++){

		if(branches[i].ammeters!=undefined){
			currents[i].noN=branches[i].ammeters.noN
			currents[i].noP=branches[i].ammeters.noP
			
		}

		if(branches[i].dcAmpPwSupplies.length>0){
			for(n=0;n<branches[i].dcAmpPwSupplies.length;n++){
				if((branches[i].dcAmpPwSupplies[n].globalNoN==currents[i].noP)&&(branches[i].dcAmpPwSupplies[n].globalNoP==currents[i].noN)){
					if(branches[i].dcAmpPwSupplies[n].unitMult=="A"){
					sumDCAmpresult=sumDCAmpresult+parseFloat(branches[i].dcAmpPwSupplies[n].value)}

					if(branches[i].dcAmpPwSupplies[n].unitMult=="mA"){
					sumDCAmpresult=sumDCAmpresult+parseFloat(branches[i].dcAmpPwSupplies[n].value)*0.001;
					}
				}
				else{
					if(branches[i].dcAmpPwSupplies[n].unitMult=="A"){
					sumDCAmpresult=sumDCAmpresult-parseFloat(branches[i].dcAmpPwSupplies[n].value)
	}

					if(branches[i].dcAmpPwSupplies[n].unitMult=="mA"){
						sumDCAmpresult=sumDCAmpresult-parseFloat(branches[i].dcAmpPwSupplies[n].value)*0.001;
					}
				}
			}
			if(sumDCAmpresult==0){
				eqresult=sumDCAmpresult+" = "+0+" A";
			}

			if((sumDCAmpresult>0.999999999)||(sumDCAmpresult<-0.999999999)){
				eqresult=currents[i].ref+" = "+sumDCAmpresult+"~A";
			}
			if(((sumDCAmpresult<0.999999999999)&&(sumDCAmpresult>0.000999999999))||((sumDCAmpresult>-0.999999999999)&&(sumDCAmpresult<-0.000999999999))){
				numHelp=sumDCAmpresult*1000;
				numHelp = +numHelp.toFixed(2);
				eqresult=currents[i].ref+" = "+numHelp+"~mA";
			}
			if(((sumDCAmpresult<0.000999999999)&&(sumDCAmpresult>0.000000999999))||((sumDCAmpresult>-0.000999999999)&&(sumDCAmpresult<-0.000000999999))){
				numHelp=sumDCAmpresult*1000000;
				numHelp = +numHelp.toFixed(2);
				eqresult=currents[i].ref+" = "+numHelp+"~uA";
			}
			if(((sumDCAmpresult<0.000000999999)&&(sumDCAmpresult>0.000000000999))||((sumDCAmpresult>-0.000000999999)&&(sumDCAmpresult<-0.000000000999))){
				numHelp=sumDCAmpresult*1000000000;
				numHelp = +numHelp.toFixed(2);
				eqresult=currents[i].ref+" = "+numHelp+"~nA";
			}

			//eqresult=currents[i].ref+" = "+sumDCAmpresult+" A";
			let lang = document.getElementById("lang-sel-txt").innerText.toLowerCase();
				if(lang=="português"){
					eqresult=eqresult.replace(".",",");
				}
			currResult.push(eqresult);
		}
		if(branches[i].acAmpPwSupplies.length>0){

				for(let n=0;n<branches[i].acAmpPwSupplies.length;n++){
					radanguloAC = parseFloat(branches[i].acAmpPwSupplies[n].phase) / (180/Math.PI);
					if(branches[i].acAmpPwSupplies[n].unitMult=="A"){
					valuevAC=parseFloat(branches[i].acAmpPwSupplies[n].value);}
					if(branches[i].acAmpPwSupplies[n].unitMult=="mA"){
					valuevAC=parseFloat(branches[i].acAmpPwSupplies[n].value)/1000;}
					if(branches[i].acAmpPwSupplies[n].unitMult=="uA"){
					valuevAC=parseFloat(branches[i].acAmpPwSupplies[n].value)/1000000;}
					if(branches[i].acAmpPwSupplies[n].unitMult=="nA"){
					valuevAC=parseFloat(branches[i].acAmpPwSupplies[n].value)/1000000000;}


					ComplexAC=math.multiply(valuevAC, math.exp(math.complex(0, radanguloAC)));
					ComplexAC.im=ComplexAC.im.toFixed(4);
					ComplexAC.re=ComplexAC.re.toFixed(4);

					
	
				}

					let zcomplexAC=Math.sqrt(Math.pow(ComplexAC.re, 2)+Math.pow(ComplexAC.im, 2));
					let zanguloAC = Math.atan(ComplexAC.im/ComplexAC.re)*57.2957795;
					if(ComplexAC.re< 0){
					if(ComplexAC.im< 0){
						zanguloAC -= 180;
					}
					else{
						zanguloAC += 180;
					}				
				}
				
				zanguloAC=+zanguloAC.toFixed(2);
			if(zcomplexAC==0){
				eqresult=currents[i].ref+" = "+0+" A";
			}

			if((zcomplexAC>0.999999999)||(zcomplexAC<-0.999999999)){
				zcomplexAC=+zcomplexAC.toFixed(2);
				eqresult=currents[i].ref+" = "+zcomplexAC+"\\angle{"+zanguloAC+"^{\\circ}}"+ " A";
			}
			if(((zcomplexAC<0.999999999999)&&(zcomplexAC>0.000999999999))||((zcomplexAC>-0.999999999999)&&(zcomplexAC<-0.000999999999))){
					zcomplexAC=zcomplexAC*1000;
					zcomplexAC = +zcomplexAC.toFixed(2);
					eqresult=currents[i].ref+" = "+zcomplexAC+"\\angle{"+zanguloAC+"^{\\circ}}"+ " mA";
			}
			if(((zcomplexAC<0.000999999999)&&(zcomplexAC>0.000000999999))||((zcomplexAC>-0.000999999999)&&(zcomplexAC<-0.000000999999))){
				zcomplexAC=zcomplexAC*1000000;
					zcomplexAC = +zcomplexAC.toFixed(2);
					eqresult=currents[i].ref+" = "+zcomplexAC+"\\angle{"+zanguloAC+"^{\\circ}}"+ " uA";
			}
			if(((zcomplexAC<0.000000999999)&&(zcomplexAC>0.000000000999))||((zcomplexAC>-0.000000999999)&&(zcomplexAC<-0.000000000999))){
				zcomplexAC=zcomplexAC*1000000000;
					zcomplexAC = +zcomplexAC.toFixed(2);
					eqresult=currents[i].ref+" = "+zcomplexAC+"\\angle{"+zanguloAC+"^{\\circ}}"+ " nA";
			}

			if(((zcomplexAC<0.000000000999)&&(zcomplexAC>0.00000000000000000000000000000000000999))||((zcomplexAC>-0.000000000999)&&(zcomplexAC<-0.00000000000000000000000000000000000999))){
				zcomplexAC=zcomplexAC*1000000000;
					zcomplexAC = +zcomplexAC.toFixed(2);
					eqresult=currents[i].ref+" = 0~A";
			}

			//eqresult=currents[i].ref+" = "+sumDCAmpresult+" A";
			let lang = document.getElementById("lang-sel-txt").innerText.toLowerCase();
				if(lang=="português"){
					eqresult=eqresult.replace(".",",");
				}
			currResult.push(eqresult);
		}




		if(simInfo.circuitFreq.value==0){
		for(let n=0;n<txr.variables._data.length;n++){


			if(letters[i]==txr.variables._data[n]){
				if(txr.result._data[n][0].re==0){
					eqresult=currents[i].ref+" = "+0+"~A";
				}
				if((txr.result._data[n][0].re>0.999999999)||(txr.result._data[n][0].re<-0.999999999)){
					numHelp=txr.result._data[n][0].re;
					numHelp = +numHelp.toFixed(2);
					eqresult=currents[i].ref+" = "+numHelp+"~A";
				}
				if(((txr.result._data[n][0].re<0.999999999999)&&(txr.result._data[n][0].re>0.000999999999))||((txr.result._data[n][0].re>-0.999999999999)&&(txr.result._data[n][0].re<-0.000999999999))){
					numHelp=txr.result._data[n][0].re*1000;
					numHelp = +numHelp.toFixed(2);
					eqresult=currents[i].ref+" = "+numHelp+"~mA";
				}
				if(((txr.result._data[n][0].re<0.000999999999)&&(txr.result._data[n][0].re>0.000000999999))||((txr.result._data[n][0].re>-0.000999999999)&&(txr.result._data[n][0].re<-0.000000999999))){
					numHelp=txr.result._data[n][0].re*1000000;
					numHelp = +numHelp.toFixed(2);
					eqresult=currents[i].ref+" = "+numHelp+"~uA";
				}
				if(((txr.result._data[n][0].re<0.000000999999)&&(txr.result._data[n][0].re>0.000000000999))||((txr.result._data[n][0].re>-0.000000999999)&&(txr.result._data[n][0].re<-0.000000000999))){
					numHelp=txr.result._data[n][0].re*1000000000;
					numHelp = +numHelp.toFixed(2);
					eqresult=currents[i].ref+" = "+numHelp+"~nA";
				}

				if(((txr.result._data[n][0].re<0.000000000999)&&(txr.result._data[n][0].re>0.00000000000000000000000000000000000999))||((txr.result._data[n][0].re>-0.000000000999)&&(txr.result._data[n][0].re<-0.00000000000000000000000000000000000999))){
					numHelp=txr.result._data[n][0].re*1000000000;
					numHelp = +numHelp.toFixed(2);
					eqresult=currents[i].ref+" = 0~A";
				}


				let lang = document.getElementById("lang-sel-txt").innerText.toLowerCase();
				if(lang=="português"){
					eqresult=eqresult.replace(".",",");
				}
				//eqresult=currents[i].ref+" = "+txr.result._data[n]+" A";
				currResult.push(eqresult);
			}
			

		}
		}
		
		if(simInfo.circuitFreq.value!=0){
			for(let n=0;n<txr.variables._data.length;n++){
				if(letters[i]==txr.variables._data[n]){
				let zcomplex=Math.sqrt(Math.pow(txr.result._data[n][0].re, 2)+Math.pow(txr.result._data[n][0].im, 2));
				let zangulo = Math.atan(txr.result._data[n][0].im/txr.result._data[n][0].re)*57.2957795;
				if(txr.result._data[n][0].re< 0){
					if(txr.result._data[n][0].im< 0){
						zangulo -= 180;
					}
					else{
						zangulo += 180;
					}				
				}
				zangulo=+zangulo.toFixed(2);
				if((zcomplex>0.999999999)||(zcomplex<-0.999999999)){
					zcomplex=+zcomplex.toFixed(2);
					eqresult=currents[i].ref+" = "+zcomplex+"\\angle{"+zangulo+"^{\\circ}}"+ " A";
				}
				if(((zcomplex<0.999999999999)&&(zcomplex>0.000999999999))||((zcomplex>-0.999999999999)&&(zcomplex<-0.000999999999))){
					zcomplex=zcomplex*1000;
					zcomplex = +zcomplex.toFixed(2);
					eqresult=currents[i].ref+" = "+zcomplex+"\\angle{"+zangulo+"^{\\circ}}"+ " mA";
				}
				if(((zcomplex<0.000999999999)&&(zcomplex>0.000000999999))||((zcomplex>-0.000999999999)&&(zcomplex<-0.000000999999))){
					zcomplex=zcomplex*1000000;
					zcomplex = +zcomplex.toFixed(2);
					eqresult=currents[i].ref+" = "+zcomplex+"\\angle{"+zangulo+"^{\\circ}}"+ " uA";
				}

				if(((zcomplex<0.000000999999)&&(zcomplex>0.000000000999))||((zcomplex>-0.000000999999)&&(zcomplex<-0.000000000999))){
					zcomplex=zcomplex*1000000;
					zcomplex = +zcomplex.toFixed(2);
					eqresult=currents[i].ref+" = "+zcomplex+"\\angle{"+zangulo+"^{\\circ}}"+ " nA";
				}

				if(((zcomplex<0.000000000999)&&(zcomplex>0.00000000000000000000000000000000000999))||((zcomplex>-0.000000000999)&&(zcomplex<-0.00000000000000000000000000000000000999))){
					zcomplex=zcomplex*1000000;
					zcomplex = +zcomplex.toFixed(2);
					eqresult=currents[i].ref+" = 0~A";
				}

				let lang = document.getElementById("lang-sel-txt").innerText.toLowerCase();
				if(lang=="português"){
					eqresult=eqresult.replace(".",",");
				}
				currResult.push(eqresult);
			}
		}

		}
		sumDCAmpresult=0;
	}
return currResult;
}

// meter as equacoes nas malhas

function meshEqinMesh(malhas,equacoes){

	for(let i=0;i<equacoes.equationReal.length;i++){
		malhas[i].incognitoEq=equacoes.equationreal[i].equation;
	}
	return{
		first: false,
		second: 0,
		third: malhas
	};
}

/**
 * fonte de tensao isoladas
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
 * 
 * 
 */

 function saveToJSON(totalMeshes,meshes,meshes2, alleq, eqresult, isolatedPowerScr, file){


	let R = file.branches.length;
	let N = countNodesByType(file.nodes, 0);
	let C = file.components.acAmpsPs.length + file.components.dcAmpsPs.length;
	let E = R - (N - 1) - C;
	let Q = N-1;

	file.analysisObj.totalMeshes = totalMeshes;
	//file.analysisObj.chosenMeshes = meshes;
	file.analysisObj.chosenMeshes= meshes2;
	file.branches = branches;
	file.components.isolatedVPS = isolatedPowerScr;
	file.analysisObj.numMeshEquations= E;
	file.analysisObj.numNodeEquations=Q;

	/*for(let i = 0; i < branchCurr.third.length; i++){
		file.analysisObj.currents[i].valueRe = branchCurr.third[i].valRe;
		file.analysisObj.currents[i].valueIm = branchCurr.third[i].valIm;
		file.analysisObj.currents[i].magnitude = branchCurr.third[i].magnitude;
		file.analysisObj.currents[i].angle = branchCurr.third[i].angle;
		file.analysisObj.currents[i].meshEquation = branchCurr.third[i].eq;
		file.analysisObj.currents[i].complex = branchCurr.third[i].string;
	}*/

	//file.analysisObj.currents.sort(function(a, b){return Number(a.ref.replace("I", "")) - Number(b.ref.replace("I", ""))});

	let realMeshEq =[];
	let realNodeEq=[];
	let currResult=[];
	let revealedNodeEq =[];
	let revealedMeshEq = [];
	let allRevealedEq=[];
	let allRealEq=[];
	//let alleq
	//let currentRevEq = [];
	//let allRevEq = [];
	
	for(let i = 0; i < alleq.equationReal.length; i++){
		if(alleq.equationReal[i].type == 0){
			realNodeEq.push(alleq.equationReal[i]);			
		}
		if(alleq.equationReal[i].type == 1){
			realMeshEq.push(alleq.equationReal[i])
		}
		
	}

	for(let i=0; i<alleq.equations.length;i++){
		if(alleq.equations[i].type == 0){
			revealedNodeEq.push(alleq.equationsRevealed[i])
		}
		if(alleq.equations[i].type == 1){
			revealedMeshEq.push(alleq.equationsRevealed[i])
		}
	}

	for(let i=0; i<alleq.equations.length;i++){
		allRevealedEq.push(alleq.equationsRevealed[i]);
		allRealEq.push(alleq.equationReal[i]);
	
	}

	for(let i=0;i<eqresult.length;i++){
		currResult[i]=eqresult[i];
	}

	file.analysisObj.result={
		cuurentResult:currResult
	}
	file.analysisObj.equations = {
		nodeEquationsReal: realNodeEq,
		meshEquationsReal: realMeshEq,
		nodeRevealedEq:revealedNodeEq,
		meshRevealedEq:revealedMeshEq,
		allRevealedEq:allRevealedEq,
		allRealEq:allRealEq
		//allRevealedEq: allRevEq
	}

    return file;
}

/**
 * Outputs the information to the modal
 * @param {object} jsonFile result json File
 */
 function Output2(jsonFile){

	// Print sections
	document.getElementById('results-board').innerHTML = outHTMLSectionsMCR();

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
	$('#buttonShowAll').html(outShowAllBtnMCR());

	//debug version
	$('#version').html(outVersionMCR(jsonFile));

	//circuit fundamental variables
	$('#fundamentalVars').html(outCircuitFundamentalsMCR(jsonFile));

	//circuit info MCM
	$('#circuitInfo').html(outCircuitInfoMCR(jsonFile));

	//circuit equations info
	$('#meshEquations').html(outEquationCalcMCR(jsonFile));
	

	//eq nos
	let knlCurrData = outCurrentsKNLMCR(jsonFile.analysisObj.equations.nodeEquationsReal);
	$('#KNLEquations').html(knlCurrData.first);
	let canvasObjectss = createCanvasCurrentsMCR(knlCurrData.second);


	let canvasObjects = outMeshesMCR(jsonFile.branches, jsonFile.analysisObj.chosenMeshes, jsonFile.analysisObj.result);

	let step1 = outStep1MCR(jsonFile.analysisObj.equations);
	let step2 = outStep2MCR(jsonFile.analysisObj.equations);
	//let step3 = outStep3MCM(jsonFile.analysisObj.equations);
	let equationSystemOutput = outEquationSystemMCR(jsonFile.analysisObj.equations, step1, step2);
	$('#eqSys').html(equationSystemOutput);
	//$('#resultsCurrentsMesh').html(outResultsMeshesMCM(jsonFile));
	$('#currentsInfo').html(outCurrentsInfoMCR(jsonFile.analysisObj.currents, jsonFile.branches).first);
	$('#resultsCurrentsBranch').html(outResultsCurrentsMCR(jsonFile));

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
		let studNumber = document.getElementById('output-number').value;
		// Get Simulation Time
		let hourstr = new Date().getHours();
		let minstr = new Date().getMinutes();
		if(hourstr.toString().length < 2)
			hourstr = "0" + hourstr;
		if(minstr.toString().length < 2)
			minstr = "0" + minstr;
		hourstr = hourstr + ":" + minstr;

		let TeX = buildTeXOv2(jsonFile, canvasObjects, canvasObjectss);
		let ImagesTeX = buildImTeXMCR(canvasObjects, canvasObjectss);

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
		let TeX = buildTeXRRich(jsonFile, canvasObjects, canvasObjectss);
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

		for(let i = 0; i< canvasObjectss.length; i++){
			docToPrint.addImgFile(canvasObjectss[i].id+'.jpg',canvasObjectss[i].dataURL)
		}

		docToPrint.print();
		
	});	

	// Open in overleaf
	$("#overleaf").off().on('click', function() {
		let TeX = buildTeXOv2(jsonFile, canvasObjects, canvasObjectss);
		let ImagesTeX = buildImTeXMCR(canvasObjects, canvasObjectss);
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
		let studName = document.getElementById('output-name').value;
		let studLastname = document.getElementById('output-lastname').value;
		let studNumber = document.getElementById('output-number').value;

		buildPrintPDFMCR(jsonFile, canvasObjects, canvasObjectss,studName,studLastname,studNumber);
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
 function loadFileAsTextMCR(data) {

	let jsonFile = JSON.parse(data);

	branches = jsonFile.branches;
	nodes = jsonFile.nodes;
	components = jsonFile.components;
	simInfo = jsonFile.analysisObj;

	//object com todas as malhas possíveis
	let circuito_malhas = findMeshess(nodes, branches);
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
	

 	//num malhas necessárias
	var nr_nodes=countNodesByType(nodes,0);
	var numMeshes = branches.length - dcAmpsPs.length - acAmpsPs.length - (nr_nodes - 1);
	
	//escolher malhas
	let malhas_escolhidas = escolherMalhas(malhas_arr, numMeshes);
	if(malhas_escolhidas.first){
		alert(malhas_escolhidas.third);
		return;
	}

	getBranchComponents2();

	//atualizar direções de malha e ramos
	malhas_escolhidas2 = meshDirection2(malhas_escolhidas.forth);
	if(malhas_escolhidas2.first){
		alert(malhas_escolhidas2.third);
		return;
	}

	malhas_escolhidas2 = getComponents2(malhas_escolhidas2.third);
	if(malhas_escolhidas2.first){
		alert(malhas_escolhidas2.third);
		return;
	}


	//equações do nós
	let equacoes_nos=getNodeEquations();
	if(equacoes_nos.first){
		alert(equacoes_nos.third);
		return;
	}
	//equações das malhas
	let equacoes_malhas=getMeshEquations(malhas_escolhidas.third);
	if(equacoes_malhas.first){
		alert(equacoes_malhas.third);
		return;
	}

	let todas_equacoes=getAllEquations(equacoes_nos.third,equacoes_malhas.third);
	if(todas_equacoes.first){
		alert(todas_equacoes.third);
		return;
	}

	//malhas_escolhidas2 = meshEqinMesh(malhas_escolhidas2.third,esquacoes_malhas.third);



	for(let i=0;i<equacoes_malhas.third.equationReal.length;i++){
		malhas_escolhidas2.third[i].incognitoEq=equacoes_malhas.third.equationReal[i].equation;
	}

	for(let i=0;i<equacoes_malhas.third.equationReal.length;i++){
		malhas_escolhidas2.third[i].revealedEq=equacoes_malhas.third.equations[i].equation;
	}

	
	let resultados_equacoes=eqSolver(todas_equacoes.third);
	
	let isolatedVPS = getIsolatedVoltPS();

	jsonFile =  saveToJSON(malhas_arr,malhas_escolhidas.third,malhas_escolhidas2.third, todas_equacoes.third, resultados_equacoes, isolatedVPS, jsonFile);

		


	Output2(jsonFile);

}