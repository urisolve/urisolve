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