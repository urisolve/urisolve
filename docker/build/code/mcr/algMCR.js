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
	var choosenMeshes=[];
	var choosenMeshes2=[];
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
			if ((meshestype1==0)&&(meshestype0>0)&&(choosenMeshes.length<numMeshes))
			{
				
				
				let cMesh={
					"type": 0,
					"id": meshid,
					"branches": Meshes[i],
					}
				choosenMeshes2.push(cMesh);

				choosenMeshes.push(Meshes[i]);
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
		third: choosenMeshes,
		forth: choosenMeshes2
		
	};

 }
/**
 * 
 * 
 * 
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
 * 
 * 
 */
function getNodeEquations(){
 let nodeEquations={
	"equations": [],
	"equationReal":[],
	};
var nodesn=[];
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
	
	if((currents[j].noP==nodesn[i])&&((branches[j].dcAmpPwSupplies.length>0)||(branches[j].acAmpPwSupplies.length>0))){

		if(branches[j].dcAmpPwSupplies.length>0){
			for(let n=0;n<branches[j].dcAmpPwSupplies.length;n++){
				if(branches[j].dcAmpPwSupplies[n].unitMult=="A"){
					sumDCAmp=sumDCAmp-parseFloat(branches[j].dcAmpPwSupplies[n].value)}

					if(branches[j].dcAmpPwSupplies[n].unitMult=="mA"){
					sumDCAmp=sumDCAmp-parseFloat(branches[j].dcAmpPwSupplies[n].value)*0.001;
					}
			}
		sumDCAmpReal=sumDCAmpReal+" - "+branches[j].dcAmpPwSupplies[0].ref;
		}

		if(branches[j].acAmpPwSupplies.length>0){
			for(let n=0;n<branches[j].acAmpPwSupplies.length;n++){
				radangulo = parseFloat(branches[j].acAmpPwSupplies[n].theta) / (180/Math.PI);
				valuev=parseFloat(branches[j].acAmpPwSupplies[n].value);
				var Complex=math.multiply(valuev, math.exp(math.complex(0, radangulo)));
				Complex.im=Complex.im.toFixed(4);
				Complex.re=Complex.re.toFixed(4);
					if(parseFloat(Complex.im)==0){
					sumACAmp=sumACAmp+" - ("+Complex.re+")";
					}
					if(parseFloat(Complex.re)==0){
					sumACAmp=sumACAmp+" - ("+Complex.im+")";
					}
					if(parseFloat(Complex.im)>0){
					sumACAmp=sumACAmp+" - ("+Complex.re+" + "+Complex.im+"i)";
					}
					if(parseFloat(Complex.im)<0){
						sumACAmp=sumACAmp+" - ("+Complex.re+" "+Complex.im+"i)"; 
					}

			}
			sumACAmpReal=sumACAmpReal+" - "+branches[j].acAmpPwSupplies[0].ref;
		}

	}
	if((currents[j].noN==nodesn[i])&&((branches[j].dcAmpPwSupplies.length>0)||(branches[j].acAmpPwSupplies.length>0))){
		if(branches[j].dcAmpPwSupplies.length>0){
		for(let n=0;n<branches[j].dcAmpPwSupplies.length;n++){
			if(branches[j].dcAmpPwSupplies[n].unitMult=="A"){
				sumDCAmp=sumDCAmp+parseFloat(branches[j].dcAmpPwSupplies[n].value)}

				if(branches[j].dcAmpPwSupplies[n].unitMult=="mA"){
				sumDCAmp=sumDCAmp+parseFloat(branches[j].dcAmpPwSupplies[n].value)*0.001;
				}
		}
		
		sumDCAmpReal=sumDCAmpReal+" + "+branches[j].dcAmpPwSupplies[0].ref;
		}

		if(branches[j].acAmpPwSupplies.length>0){
			for(let n=0;n<branches[j].acAmpPwSupplies.length;n++){
				radangulo = parseFloat(branches[j].acAmpPwSupplies[n].theta) / (180/Math.PI);
				valuev=parseFloat(branches[j].acAmpPwSupplies[n].value);
				Complex=math.multiply(valuev, math.exp(math.complex(0, radangulo)));
				Complex.im=Complex.im.toFixed(4);
				Complex.re=Complex.re.toFixed(4);
					if(parseFloat(Complex.im)==0){
					sumACAmp=sumACAmp+" + ("+Complex.re+")";
					}
					if(parseFloat(Complex.re)==0){
					sumACAmp=sumACAmp+" + ("+Complex.im+")";
					}
					
					if(parseFloat(Complex.im)>0){
					sumACAmp=sumACAmp+" + ("+Complex.re+" + "+Complex.im+"i)";
					}
					if(parseFloat(Complex.im)<0){
						sumACAmp=sumACAmp+" + ("+Complex.re+" "+Complex.im+"i)"; 
					}

			}
			sumACAmpReal=sumACAmpReal+" + "+branches[j].acAmpPwSupplies[0].ref;

		}
	}
	
	if((currents[j].noP==nodesn[i])&&(currout!="")&&(branches[j].dcAmpPwSupplies.length==0)){
		currout=currout+" + "+currents[j].ref;
		curroutReal=curroutReal+" + "+currents[j].ref;

	}
	
	if((currents[j].noP==nodesn[i])&&(currout=="")&&(branches[j].dcAmpPwSupplies.length==0)){
		currout=currout+currents[j].ref;
		curroutReal=curroutReal+currents[j].ref;

	}


	if((currents[j].noN==nodesn[i])&&(currin!="")&&(branches[j].dcAmpPwSupplies.length==0)){
		currin=currin+" - "+currents[j].ref;
		currinReal=currinReal+" - "+currents[j].ref;

	}

	if((currents[j].noN==nodesn[i])&&(currin=="")&&(branches[j].dcAmpPwSupplies.length==0)){
		currin=currin+"-"+currents[j].ref;
		currinReal=currinReal+" - "+currents[j].ref;

	}

	if((currents[j].noN!=nodesn[i])&&(currents[j].noP!=nodesn[i])){
		//Nodeequations[i][j]=0;
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

if(currin==""){
	
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
	}
	nodeEquations.equationReal.push(equationReal);
}

if(currout==""){

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
	}
	nodeEquations.equationReal.push(equationReal);
}
	//equations1[i]="Nó "+nodesn[i]+ " : "+currin+" = 0";


if((currin!="")&&(currout!="")){
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
	}
	nodeEquations.equationReal.push(equationReal);
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

	for(let i=0;i<Mesh.length;i++){
		 kendNode[i]=[];
		 kstartNode[i]=[];
		for(let j=0;j<Mesh[i].length;j++){
			for(let k=0;k<branches.length;k++){

					for(let p=0;p<branches[k].resistors.length;p++){
						sumResistors=sumResistors+parseFloat(branches[k].resistors[p].value);
					}
					

				if((branches[k].id==Mesh[i][j])&&(j==0)){
					
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
							if(eqs==""){
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
							if(eqs==""){
								//eqs=eqs+"("+branches[k].coils[w].impedance+" * "+currents[k].ref+")";
								eq1=eq1+branches[k].coils[w].ref+" * "+currents[k].ref;
							}
							else{
								//eqs=eqs+" + ("+branches[k].coils[w].impedance+" * "+currents[k].ref+")";
							eq1=eq1+" + "+branches[k].coils[w].ref+" * "+currents[k].ref;
							}
							
						}

					}
					eqs="("+branches[k].equivImpedance.value+") * "+currents[k].ref;
					kendNode[i][j]=branches[k].endNode;
					kstartNode[i][j]=branches[k].startNode;
				}
				
				if((branches[k].id==Mesh[i][j])&&(j>0)&&((branches[k].startNode==kendNode[i][j-1])||(branches[k].endNode==kstartNode[i][j-1]))&&(s==-1)){

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

					eqs=eqs+" -("+branches[k].equivImpedance.value+") * "+currents[k].ref;
					kendNode[i][j]=branches[k].endNode;
					kstartNode[i][j]=branches[k].startNode;
					sumResistors=0;
					break;
				}

				if((branches[k].id==Mesh[i][j])&&(j>0)&&((branches[k].endNode==kendNode[i][j-1])||(branches[k].startNode==kstartNode[i][j-1]))&&(s==-1)){
					
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

					if(eqs==""){
						eqs=eqs+" ("+branches[k].equivImpedance.value+") * "+currents[k].ref;
					}
					else{
						eqs=eqs+" + ("+branches[k].equivImpedance.value+") * "+currents[k].ref;
					}
					kendNode[i][j]=branches[k].endNode;
					kstartNode[i][j]=branches[k].startNode;
					s=1;
					sumResistors=0;
					break;
				}


				
				if((branches[k].id==Mesh[i][j])&&(j>0)&&((branches[k].startNode==kendNode[i][j-1])||(branches[k].endNode==kstartNode[i][j-1]))&&(s==1)){

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

					if(eqs==""){
						eqs=eqs+" ("+branches[k].equivImpedance.value+") * "+currents[k].ref;
					}
					else{
						eqs=eqs+" + ("+branches[k].equivImpedance.value+") * "+currents[k].ref;
					}
					kendNode[i][j]=branches[k].endNode;
					kstartNode[i][j]=branches[k].startNode;
					sumResistors=0;
					break;

				}

				if((branches[k].id==Mesh[i][j])&&(j>0)&&((branches[k].endNode==kendNode[i][j-1])||(branches[k].startNode==kstartNode[i][j-1]))&&(s==1)){

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
					eqs=eqs+" -("+branches[k].equivImpedance.value+") * "+currents[k].ref;
					kendNode[i][j]=branches[k].endNode;
					kstartNode[i][j]=branches[k].startNode;
					s=-1
					sumResistors=0;
					break;
				}

				if((branches[k].id==Mesh[i][j])&&(j>0)&&((branches[k].endNode==kendNode[i][j-1])||(branches[k].startNode==kstartNode[i][j-1]))&&(s==0)){

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
					/*if((branches[k].acVoltPwSupplies.length>0)&&(branches[k].startNode==branches[k].acVoltPwSupplies[0].noN)){
						for(let n=0;n<branches[k].acVoltPwSupplies.length;n++){
						if(sumAC==""){
						sumAC="("+branches[k].acVoltPwSupplies[n].voltage+")";
						sumACReal=branches[k].acVoltPwSupplies[n].ref;
						}
						else{
						sumAC=sumAC+"- ("+branches[k].acVoltPwSupplies[n].voltage+")";
						sumACReal=sumACReal+" - "+branches[k].acVoltPwSupplies[n].ref;
						}
					}	
					}*/


					/*if((branches[k].dcVoltPwSupplies.length>0)&&(branches[k].startNode!=branches[k].endVoltPsEndNodes[0].startNode)){
						sumDC=sumDC+parseInt(branches[k].equivVoltPs.value);
						sumDCReal=sumDCReal+" + "+branches[k].dcVoltPwSupplies[0].ref;
					}*/

					/*if((branches[k].acVoltPwSupplies.length>0)&&(branches[k].startNode!=branches[k].acVoltPwSupplies[0].noN)){
						for(let n=0;n<branches[k].acVoltPwSupplies.length;n++){
						if(sumAC==""){
						sumAC="("+branches[k].acVoltPwSupplies[n].voltage+")";
						sumACReal=branches[k].acVoltPwSupplies[n].ref;
						}
						else{
						sumAC=sumAC+"+ ("+branches[k].acVoltPwSupplies[n].voltage+")";
						sumACReal=sumACReal+"+"+branches[k].acVoltPwSupplies[n].ref;
						}
					}	
					}*/




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
					
					eqs=eqs+" -("+branches[k].equivImpedance.value+") * "+currents[k].ref;
					kendNode[i][j]=branches[k].endNode;
					kstartNode[i][j]=branches[k].startNode;
					s=-1;
					sumResistors=0;
					break;
				}
				
				if((branches[k].id==Mesh[i][j])&&(j>0)&&((branches[k].startNode==kendNode[i][j-1])||(branches[k].endNode==kstartNode[i][j-1]))&&(s==0)){

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

					if(eqs==""){
						eqs=eqs+" ("+branches[k].equivImpedance.value+") * "+currents[k].ref;
					}
					else{
						eqs=eqs+" + ("+branches[k].equivImpedance.value+") * "+currents[k].ref;
					}
					
					kendNode[i][j]=branches[k].endNode;
					kstartNode[i][j]=branches[k].startNode;
					s=1;
					sumResistors=0;
					break;
				}

				
				
				
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
	var letters=["a","b","c","d","f","g","h","j","k","l","m","n","o"];
	var eq=[];
	for(let i=0;i<all_equations.equations.length;i++){
		eq[i]=all_equations.equations[i].equation;
	}

	for(let i=0;i<all_equations.equations.length;i++){
		for (let j=0;j<currents.length;j++){
	
			if(branches[j].dcAmpPwSupplies.length==0){
				eq[i]=eq[i].replace(currents[j].ref,letters[j]);
			}
	
		
			
		}
	}
	var ziq = new linearEqSystem();
	for(let i=0;i<eq.length;i++){
		ziq.addEquation(eq[i]);
	}
	ziq.buildSystem();
	var txr = solve(ziq.coefMatrix, ziq.consMatrix, ziq.varMatrix, 4);

	for(let i=0;i<currents.length;i++){
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
			eqresult=currents[i].ref+" = "+sumDCAmpresult+" A";
			currResult.push(eqresult);
		}

		for(let n=0;n<txr.variables._data.length;n++){


			if(letters[i]==txr.variables._data[n]){
				eqresult=currents[i].ref+" = "+txr.result._data[n]+" A";
				currResult.push(eqresult);
			}
			

		}
		sumDCAmpresult=0;
	}
return currResult;
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

	file.analysisObj.totalMeshes = totalMeshes;
	file.analysisObj.chosenMeshes = meshes;
	file.analysisObj.choosenMeshes= meshes2;
	file.branches = branches;
	file.components.isolatedVPS = isolatedPowerScr;

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
	//let alleq
	//let currentRevEq = [];
	//let allRevEq = [];

	for(let i = 0; i < alleq.equationReal.length; i++){
		if(alleq.equationReal[i].type == 0){
			realNodeEq.push(alleq.equationReal[i].equation);			
		}
		if(alleq.equationReal[i].type == 1){
			realMeshEq.push(alleq.equationReal[i].equation)
		}

	}

	for(let i=0;i<eqresult.length;i++){
		currResult[i]=eqresult[i];
	}

	file.analysisObj.result={
		cuurentResult:currResult
	}
	file.analysisObj.equations = {
		nodeEquationsReal: realNodeEq,
		meshEquationsReal: realMeshEq
		//allRevealedEq: allRevEq
	}

    return file;
}

/**
 * Outputs the information to the modal
 * @param {object} jsonFile result json File
 */
 function Output(jsonFile){

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
	$('#buttonShowAll').html(outShowAllBtnMCM());

	//debug version
	$('#version').html(outVersion(jsonFile));

	//circuit fundamental variables
	$('#fundamentalVars').html(outCircuitFundamentalsMCM(jsonFile));

	//circuit info MCM
	$('#circuitInfo').html(outCircuitInfoMCM(jsonFile));

	//circuit equations info
	$('#meshEquations').html(outEquationCalcMCM(jsonFile));


	let canvasObjects = outMeshesMCM(jsonFile.branches, jsonFile.analysisObj.choosenMeshes, jsonFile.analysisObj.result);

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

	//atualizar direções de malha e ramos
	//malhas_escolhidas2 = meshDirection(malhas_escolhidas.forth);
	//if(malhas_escolhidas2.first){
	//	alert(malhas_escolhidas2.third);
	//	return;
	//}
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

	let resultados_equacoes=eqSolver(todas_equacoes.third);
	
	let isolatedVPS = getIsolatedVoltPS();

	jsonFile =  saveToJSON(malhas_arr,malhas_escolhidas.third,malhas_escolhidas.forth, todas_equacoes.third, resultados_equacoes, isolatedVPS, jsonFile);

		
	Output(jsonFile);
}