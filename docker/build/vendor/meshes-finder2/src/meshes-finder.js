/*
 * Author : André Rocha
 * Email : anr@isep.ipp.pt
 * Source : https://github.com/urisolve/meshes-finder
 */


const math = require('mathjs');
const fs = require('fs');
const { kldivergence, json, matrix } = require ('mathjs');
const { Console } = require ('console');



class MeshesFinder{
	/**
	* Meshes Finder
	* 
	* Implements a Graph Search and returns the total amount of Meshes.
	* This task must be done in two steps: initdGraph and then getLoops.
	*/




	constructor(){
		let adjacencyMatrix = null;
		let incidenceMatrix = null;
		let nodes = null;
		let branches = null;
	};
	/**
	 * Do the (re)initialization of the variables
	 * @param {math.matrix} adjacencyMatrix A square matrix, contaning nodes relationship
	 * @param {math.matrix} incidenceMatrix A matrix containing the relationship between the nodes and the branches
	 * @param {Array} nodes	An array with the nodes names (string), sorted in the same way used in the adjacency/incidency matrices
 	 * @param {Array} branches An array with the branches names (string), sorted in the same way used in the adjacency/incidency matrices
	 * @returns Nothing
	 */

  



	initGraph(adjacencyMatrix, incidenceMatrix, nodes, branches){
		this.adjacencyMatrix = adjacencyMatrix;
		this.incidenceMatrix = incidenceMatrix;
		this.nodes = nodes;
		this.branches = branches;
	}
	/**
	 * Get the Loops (meshes) in the provided matrices
	 * Meshes are segmented by the order of magnitude (number os branches used to close the loop)
	 * 
	 * @param {Int} deepness Define the level of detail of the data returned. It's possible to get 3 levels, from 0 to 2, being 2 the most detailed.
	 * Level 0 - Gives information just about the branches names;
	 * Level 1 - Gives information about the branches' names, and its parent and child nodes' names;
	 * Level 2 - Gives information about the branches' names and ids, and its parent and child nodes' names and ids.
	 * @returns An object with information about error and meshes data.
	 */

  



	getLoops(deepness = 2){
		let returnData;
		let errorCode = { state: false, reason: [] };
		if(this.adjacencyMatrix == null) { errorCode.state = true; errorCode.reason.push("Empty Adjacency Matrix"); }
		if(this.incidenceMatrix == null) { errorCode.state = true; errorCode.reason.push("Empty Incidence Matrix"); }
		if(this.nodes == null) { errorCode.state = true; errorCode.reason.push("Empty Nodes Names Array"); }
		if(this.branches == null) { errorCode.state = true; errorCode.reason.push("Empty Branches Array"); }

		if(errorCode.state == true) return { error: errorCode, data: returnData};

		var nodeState = {
			UNVISITED: -1,
			VISITED: 0,
			COMPLETED: 1,
			VOID: 2
		};
	
	var machineState ={
			ROOT: 0,
			VERIFY_LINKS: 1,
			UPDATE_NODES: 2,
			INIT_BLOCK: 3,
			GET_UNVISITED: 4,
			SAVE_LOOP: 5
	}
	
	function print(m){ const precision = 14; console.log(math.format(m, precision)) };
	function getGraphType(g){
			let errorCode = 0;
			let size = math.size(g);
			let vertices = size._data[0];
			let edges = size._data[1];
			let type = "dense";
			let diff = math.divide(5,100);
	
			if(edges * math.subtract(1,diff) < math.pow(vertices,2) || edges * math.sum(1,diff) > math.pow(vertices,2)) { type = "sparse"; }
	
			print("V = " + vertices + " | E = " + edges );
			print("Graph Type: " + type);
			//print(g.toJSON());
	
			return {
					"error": errorCode,
					"vertices": vertices,
					"edges": edges,
					"type": type
			}
	}
	function andOperation(a, b, s) {
			let errorCode = 0;
			let res = new Array(s);
			for(let i=0; i<res.length; i++) {
					 res[i] = a._data[0][i] & b._data[0][i];
					 errorCode = 1;
			}
			return {
					"error": errorCode,
					"result": res
			}
	}

		let graph = getGraphType(this.incidenceMatrix);

		/* Search Algorythm starts here
				Consider the following tree structure and nomenclature:
				root Node       -> the node where the search begins (and ends, when we complete the loop)
				parent Node     -> a node already visited and junst one level above the current node
				current Node    -> the node in question at the moment
				child Node      -> the node immediately below the current node

				State: [-1] - unvisited; [0] - visited; [1] - completed.
		*/



    



		console.time("meshes-finder-duration");
		console.log('\nSCRIPT STARTED...\n');

		let loops = new Array();
		let branchPossibilities = new Array();

		let search = true;

		let rootNode = { "id": -1};
		let parentNode = { "id": 0};
		let currentNode = { "id": -1};
		let childNode = { "id": 0};

		let visitList = new Array(graph.vertices);

		for (let i = 0; i < visitList.length; i++) {
				visitList[i] = { "st": nodeState.UNVISITED, "branches": [] };
		}

		let rootVisits = JSON.parse(JSON.stringify(visitList));

		let chain = new Array();

		let overlap = 0;
		let ms = machineState.ROOT;

		let hops = 0;
		let path = new Array(graph.vertices);

		do {
				switch (ms) {
						case machineState.ROOT:
								{
										let f = false;
										for (let i = 0; i < rootVisits.length; i++) {
												const e = rootVisits[i];
												if(e.st == -1){
														currentNode.id = i;
														rootNode.id = i;
														e.st = nodeState.COMPLETED;
														e.blocks = [];
														rootVisits[rootNode.id].blocks[hops] = currentNode.id;
														f = true;
														break;
												}
										}
										if(f) {
												ms = machineState.INIT_BLOCK;
												for (let i = 0; i < path.length; i++) {
														path[i] = { "hop": i, "branches": []};
												}
										}
										else search = false;
										break;
								}
						case machineState.INIT_BLOCK:
								{
										// Add new Block to the Chain
										let v = JSON.parse(JSON.stringify(visitList));

										// In the last node, a search including previous nodes will result in a duplication of loops
										if(hops.length == graph.vertices-1) {
												for (let i = 0; i < v.length; i++) {
														if(i != rootNode.id ) v[i] = { "st": nodeState.COMPLETED, "branches": [] };
												}
										}
										else{
												v[currentNode.id] = { "st": nodeState.COMPLETED, "branches": [] };
												for (let i = 0; i < rootVisits[rootNode.id].blocks.length; i++) {
														const e = rootVisits[rootNode.id].blocks[i];
														if(e!=rootNode.id) v[e] = { "st": nodeState.COMPLETED, "branches": [] };
												}
										}

										let block = {"id": currentNode.id, "visitList": v};
										chain.push(block);
										ms = machineState.GET_UNVISITED;
										break;
								}
						case machineState.GET_UNVISITED:
								{
										// Analyse neighbourhood
										let f = false;

										let blockNb = chain.length - 1;
										for (let i = 0; i < chain[blockNb].visitList.length; i++) {
												const e = chain[blockNb].visitList[i];
												if(e.st == nodeState.UNVISITED) {
														parentNode.id = childNode.id;
														childNode.id = i;
														e.st = nodeState.VISITED;
														f = true;
														break;
												}
										}
										if(f) ms = machineState.VERIFY_LINKS;
										else{
												// Go back one level
												// The current node is fully visited

												chain.pop();
												if(chain.length == 0) {
														ms = machineState.ROOT;
														break;
												}

												let blockNb = chain.length - 1;
												chain[blockNb].visitList[currentNode.id].st = nodeState.COMPLETED;

												rootVisits[rootNode.id].blocks.pop();
												hops--;
												currentNode.id = rootVisits[rootNode.id].blocks.slice(-1).pop();

												ms = machineState.GET_UNVISITED;
										}
										break;
								}
						case machineState.VERIFY_LINKS:
								{
										let f = false;
										branchPossibilities = [];
										overlap = andOperation(math.row(this.incidenceMatrix, currentNode.id), math.row(this.incidenceMatrix, childNode.id), graph.edges);
										for(let i=0; i<overlap.result.length; i++) {
												if(!overlap.result[i]) continue;
												else {
														let link = {
																"parentNode": currentNode.id,
																"parentNodeStr": this.nodes[currentNode.id],
																"childNode": childNode.id,
																"childNodeStr": this.nodes[childNode.id],
																"branchId": i,
																"branchStr": this.branches[i],
																"pathPos": chain.length-1};
														branchPossibilities.push(link);
												}
										}
										if(overlap.error == 1) {
												// Nodes are connected
												// Now that we kwow the branches we can use to travel from the current node to its child node

												path[hops].branches = branchPossibilities;

												let blockNb = chain.length - 1;
												chain[blockNb].visitList[childNode.id].branches = JSON.parse(JSON.stringify(branchPossibilities));
												branchPossibilities = [];

												// If child node is the root node, add new loop element
												if(childNode.id==rootNode.id) ms = machineState.SAVE_LOOP;
												else{
														parentNode.id = currentNode.id;
														currentNode.id = childNode.id;
														hops++;
														rootVisits[rootNode.id].blocks[hops] = currentNode.id;
														ms = machineState.INIT_BLOCK;
												}
										}
										else ms.machineState = GET_UNVISITED;

										break;
								}
						case machineState.SAVE_LOOP:
								{
										let hop = new Array();
										for (let n = 0; n <= hops; n++) {
												path[n].branches.forEach(element => {
														hop[n] = path[n].branches;
												});
										}
										let valid = true;
										if(!("0" in hop)) valid = false;
										if(hop.length>0 && valid == true){
											const pNode = hop[0][0].parentNode;
											const cNode = hop[hop.length-1][0].childNode;
											if( pNode == cNode ) loops.push(JSON.parse(JSON.stringify(hop)));
										}										
										let blockNb = chain.length - 1;
										chain[blockNb].visitList[childNode.id].st = nodeState.COMPLETED;
										ms = machineState.GET_UNVISITED;
										break;
								}
						default:
								break;
				}
		} while (search);

		let filteredLoops = { "order": [] };
		for (let i = 0; i <= graph.vertices; i++) {
				filteredLoops.order[i] = new Array();
		}
		let filteredLoopsSecond = JSON.parse(JSON.stringify(filteredLoops));
		let filteredLoopsThird = JSON.parse(JSON.stringify(filteredLoops));
		let filteredLoopsFourth = JSON.parse(JSON.stringify(filteredLoops));

		for (let j = 0; j < loops.length; j++) {
				const element = loops[j];
				let loop = { "loop_id": j, "hop": []};
				let f = false;
				for (let k = 0; k < loops[j].length; k++) {
						const b = loops[j][k];
						if(element.length == 2 && b.length<2) continue;
						f = true;
						const h = {"id": 0, "branches": []};
						h.id = k;
						h.branches = b;
						if(b) loop.hop.push(h);
				}
				if(f) filteredLoops.order[loops[j].length].push(loop);
		}

		// Remove Loops with a number of hops lower than the order of the Loop
		
		for (let i = 2; i < filteredLoops.order.length; i++) {
			const element = filteredLoops.order[i];
			let f = false;
			if(element && element.length){
				for (let j = 0; j < element.length; j++) {
					const e = element[j];
					if(e.hop.length != i)	{
						filteredLoops.order[i].splice(j, 1);
						i--;
						f = true;
						break;
					}
				}				
			}
			if(f) continue;
		}

		filteredLoopsSecond.order[2] = JSON.parse(JSON.stringify(filteredLoops.order[2]));

		for (let i = 3; i <= graph.vertices; i++) {
				let loop = filteredLoops.order[i];

				let listB = new Array();
				loop.forEach(el => {
						let id = el.loop_id;
						let b = new Array();
						el.hop.forEach(hop => {
								b.push(hop.branches[0].branchStr);
						});
						b.sort();
						listB.push({"id": id, "b": b});
				});

				let duplicates = new Array();
				let uniques = new Array();
				for (let i = 0; i < listB.length-1; i++){
						let a = listB[i];
						for (let j = i+1; j < listB.length; j++) {
								let b = listB[j];
								if(JSON.stringify(a.b)==JSON.stringify(b.b)) {
										duplicates.push(b);
										listB.splice(j,1);
										j--;
								}
								else {
								continue;
								}
						}
				}
				listB.forEach(e => {
						for (let j = 0; j < loop.length; j++) {
								const el = loop[j];
								if(e.id == el.loop_id) {
										uniques.push(el);
										filteredLoopsSecond.order[i].push(filteredLoops.order[i][j]);
								}
						};
				});
		}

		let loopIdsArray = new Array();

		filteredLoopsSecond.order.forEach(a => {
				a.forEach(b => {
						loopIdsArray.push(b.loop_id);
				});

		});
		loopIdsArray.filter((item,index) => loopIdsArray.indexOf(item) === index);
		loopIdsArray.sort((a,b) => a - b);

		// Find Loops between 2 nodes
		// The number of simple meshes (M) formed using 2 nodes and B branches is given by:
		// M = (1/2) * (B^2-B)
		let loop = filteredLoops.order[2];

		let listB = new Array();
		loop.forEach(el => {
				let id = el.loop_id;
				let b = new Array();
				let i = 0;
				el.hop[0].branches.forEach(br => {
						b.push(br.branchStr);
				});
				b.sort();
				listB.push({"id": id, "b": b});
		});

		listB.forEach(function(a, i){
				for (let j = i+1; j < listB.length; j++) {
						let b = listB[j];
						if(JSON.stringify(a.b)==JSON.stringify(b.b)) {
								listB.splice(j,1);
								j--;
						}
						else {
						continue;
						}
				}
		});

		listB.forEach(function(a, i){
				for (let i = 0; i < filteredLoopsSecond.order[2].length; i++) {
						const b = filteredLoopsSecond.order[2][i];
						let c = JSON.parse(JSON.stringify(b));
						if (c.loop_id == a.id) {
								let first = 0;
								let last = c.hop[0].branches.length-1;
								let possib = (1/2)*(a.b.length*a.b.length-a.b.length);
								let lp = new Array();
								for (let j = 1; j < c.hop[0].branches.length; j++) {
										let startBranch = c.hop[0].branches[first];
										// TODO check if this inversion is necessary
										let endBranch = {
											branchId: c.hop[0].branches[first+j].branchId,
											branchStr: c.hop[0].branches[first+j].branchStr,
											childNode: c.hop[0].branches[first+j].parentNode,
											childNodeStr: c.hop[0].branches[first+j].parentNodeStr,
											parentNode: c.hop[0].branches[first+j].childNode,
											parentNodeStr: c.hop[0].branches[first+j].childNodeStr,
											pathPos: c.hop[0].branches[first+j].pathPos
										};											;
										const lId = loopIdsArray[loopIdsArray.length-1]+1;
										loopIdsArray.push(lId);
										let d = { "loop_id": lId, "hop": []};
										d.hop.push({"id": 0, "branches": [startBranch]});
										d.hop.push({"id": 1, "branches": [endBranch]});
										lp.push(d);
										if(first == last-1) break;
										if(first+j == last) { j = 0; first++; }
								}
								lp.forEach(x => {
										filteredLoopsThird.order[2].push({"loop_id": x.loop_id, "hop": x.hop});
								});
						}
				}
		});

		// Number of Meshes of higher order than 2, considering all branches, may be given by the following algorythm:
		// Step 0:
				// Start at root node (hop 0) and add it to an array, representing the path already traveled;

		// Step 1 (repeat until you reach the last hop):
				// Being positionated at the next node, check  the number of branches available to travel to the next node;
				// If number of branches is equal to 1, push its reference to every copy of the path already traveled;
				// If number of branches is higher than 1, save as many copies of a path as the number of branches;

		for (let n = 3; n < filteredLoopsSecond.order.length; n++) {
			filteredLoopsThird.order[n] = filteredLoopsSecond.order[n];
		}
		// TODO remove meshesMatrixArr array 
		let meshesMatrixArr = [];

		filteredLoopsFourth.order[2] = filteredLoopsThird.order[2];

		for (let n = 3; n < filteredLoopsThird.order.length; n++) {
			filteredLoopsFourth.order[n] = [];
			filteredLoopsThird.order[n].forEach(loop => {
				let hopCount = loop.hop.length;
				let meshesMatrix = [];

				for (let i = 0; i < hopCount; i++) {
						const hop = loop.hop[i];
						// Matrix - Count Rows and Columns
						let branchesCount = hop.branches.length;
						let siblingCount = branchesCount-1;
				
						// Get the position of the last matrix row
						let pathPosition = meshesMatrix.length-1;
			
						if(pathPosition>=0){
								// Create (twins) Siblings, as much as the branches minus 1
								// Resize Matrix - add new columns in the same size of new Siblings
								// Fill each row with an array with blocks:
										// block size = branches
										// block data = branch data copies in each element of the block
							let blockRows = meshesMatrix.length;
							let blockCols = meshesMatrix[pathPosition].length;
							let blockCount = branchesCount;
			
								// Prepare Original
							let original = meshesMatrix.slice();
							let siblings = new Array(siblingCount);
							for (let s = 0; s < siblings.length; s++) {
								siblings[s] = original;
							}
			
							// Resize and copy data
							let newRow = [];
							for (let index = 0; index < blockRows+1; index++) {
								newRow[index] = [];
								for (let index2 = 0; index2 < blockCols*(siblingCount+1); index2++) {
									newRow[index][index2] = null;
								}
							}
			
							for (let r = 0; r < original.length; r++) {
								const row = original[r];
								for (let c = 0; c < row.length; c++) {
									const cell = row[c];
									newRow[r][c] = cell;
								}
							}
							let offset = original[0].length;
							for (let s = 0; s < siblings.length; s++) {
								const sibling = siblings[s];
								for (let r = 0; r < sibling.length; r++) {
									const row = sibling[r];
									for (let c = 0; c < row.length; c++) {
										const cell = row[c];
										newRow[r][c+offset*(s+1)] = cell;
									}
								}
							}
			
							for (let b = 0; b < blockCount; b++) {
								let branch = hop.branches[b];
								for (let c = 0; c < offset; c++) {
									newRow[blockRows][(b*offset)+c] = branch;
								}
							}
			
							meshesMatrix = newRow.slice();
						}
						else{
								// Just for the first iteration
								let original = [];
								for (let b = 0; b < hop.branches.length; b++) {
										const branch = hop.branches[b];
										original.push(branch);
								}
								meshesMatrix.push(original);
								continue;
						}
				}
				meshesMatrixArr.push(meshesMatrix);
			});

		}

		meshesMatrixArr.forEach(meshGroup => {
			let lastLoopId = loopIdsArray[loopIdsArray.length-1];

			let order = meshGroup.length;
			let rows = order;
			let cols = meshGroup[0].length;

			let meshesElements = [];

			for (let c = 0; c < cols; c++) {
				let meshesEl = new Array(rows);
				let newLoop = { loop_id: ++lastLoopId, hop: [] };
				for (let r = 0; r < rows; r++) {
					const row = meshGroup[r];
					meshesEl[r] = row[c];
					newLoop.hop.push( { id: r, branches: [row[c]] } );
				}
				meshesElements.push(meshesEl);
				filteredLoopsFourth.order[order].push(newLoop);

			}
		});

		console.log("Meshes-finder finished the job...");

		let meshesCount = 0;

		console.log("Search Results:");
		let info = {count: [], total: 0};
		filteredLoopsFourth.order.forEach(function(a, i){
				if(i>1){
						meshesCount += a.length;
						console.log("Order " + i + ": " + a.length);}
						info.count.push(a.length);
				});
		info.total = meshesCount;
		info.ordermax = filteredLoopsFourth.order.length-1;
		console.log("Found " + meshesCount + " Meshes in the circuit.");

		console.timeEnd("meshes-finder-duration");

		switch (deepness) {
			case 0:{
				let filteredLoopsFourthDeepness = {order: new Array(filteredLoopsFourth.order.length)};
				for (let o = 0; o < filteredLoopsFourth.order.length; o++) {
					filteredLoopsFourthDeepness.order[o] = [];
					const loops = filteredLoopsFourth.order[o];
					for (let l = 0; l < loops.length; l++) {
						const loop = loops[l];
						let m = [];
						for (let h = 0; h < loop.hop.length; h++) {
							const hop = loop.hop[h];
							m.push(hop.branches[0].branchStr);
						}
						filteredLoopsFourthDeepness.order[o].push(m);		
					}
				}
				filteredLoopsFourthDeepness.info = info;		
				returnData = filteredLoopsFourthDeepness;
				break;
			}
			case 1:{
				let filteredLoopsFourthDeepness = {order: new Array(filteredLoopsFourth.order.length)};

				for (let o = 0; o < filteredLoopsFourth.order.length; o++) {
					filteredLoopsFourthDeepness.order[o] = [];
					const loops = filteredLoopsFourth.order[o];
					for (let l = 0; l < loops.length; l++) {
						const loop = loops[l];
						let m = [];
						for (let h = 0; h < loop.hop.length; h++) {
							const hop = loop.hop[h];
							m.push( {
								Branch: hop.branches[0].branchStr,
								ParentNode: hop.branches[0].parentNodeStr,
								ChildNode: hop.branches[0].childNodeStr,
							} );
						}
						filteredLoopsFourthDeepness.order[o].push(m);
					}
				}
				filteredLoopsFourthDeepness.info = JSON.parse(JSON.stringify(info));
				returnData = filteredLoopsFourthDeepness;
				break;
			}	
			case 2:{
				filteredLoopsFourth.info = info;
				returnData = filteredLoopsFourth;
				break;
			}	
		
			default:
				errorCode.state = true;
				errorCode.reason.push("Invalid level of data detail. Available Options: 0 to 2, being 2 the most detailed.");
				break;
		}

		return { error: errorCode, data: returnData};
	}
}


<<<<<<< HEAD
module.exports = MeshesFinder;
=======
module.exports = MeshesFinder;
>>>>>>> d6a8f1d4fbfe17343daef815faa7f91735205470
