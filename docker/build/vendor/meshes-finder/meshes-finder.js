/*
 * Author : André Rocha
 * Email : anr@isep.ipp.pt
 * Source : https://github.com/urisolve/meshes-finder
 */

const _VERSION = "2.00"; 

const _VISIT_ST = Object.freeze({
  UNVISITED: 0,
  VISITED: 1,
  FULLY_VISITED: 2
})

class MeshesFinder {
  constructor() {
    this.adjacencyList = {};
		let adjMatrix = null;
		let incMatrix = null;
		let edges = null;
		let vertices = null;    
  }
  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }
  addEdge(source, destination) {
    if (!this.adjacencyList[source]) {
      this.addVertex(source);
    }
    if (!this.adjacencyList[destination]) {
      this.addVertex(destination);
    }
    if(this.adjacencyList[source].indexOf(destination) === -1) this.adjacencyList[source].push(destination);
    if(this.adjacencyList[destination].indexOf(source) === -1) this.adjacencyList[destination].push(source);
  }
  removeEdge(source, destination) {
    this.adjacencyList[source] = this.adjacencyList[source].filter(vertex => vertex !== destination);
    this.adjacencyList[destination] = this.adjacencyList[destination].filter(vertex => vertex !== source);
  }
  removeVertex(vertex) {
    while (this.adjacencyList[vertex]) {
      const adjacentVertex = this.adjacencyList[vertex].pop();
      this.removeEdge(vertex, adjacentVertex);
    }
    delete this.adjacencyList[vertex];
  }
  buildEdges(){
    let result = { error: {state: false, reason: "OK"}, data: {}}
    for (let i = 0; i < this.incMatrix.length-1; i++) {
      const v1 = i;
      for (let j = i+1; j < this.incMatrix.length; j++) {
        const v2 = j;
        const row1 = this.incMatrix[v1];
        const row2 = this.incMatrix[v2];
        for (let k = 0; k < row1.length; k++) {
          const bit1 = row1[k];
          const bit2 = row2[k];
          if(bit1&bit2) this.addEdge(v1, v2);
        } 
      }
    }
    return result;
  }
  initGraph(adjacencyMatrix, incidenceMatrix, vertices, edges, print = false){
		this.adjMatrix = adjacencyMatrix;
		this.incMatrix = incidenceMatrix;
		this.vertices = vertices;
		this.edges = edges;
    if(this.incMatrix.length) this.buildEdges();
    if(print) {
      console.table(this.vertices);
      console.table(this.edges);
      console.table(this.adjMatrix);
      console.table(this.incMatrix);
    };
	}
  dfsRecursive(start) {
    let result = {errorCode: 0, data: []};
    let adjacencyList = this.adjacencyList;
    let stack = [ { vertex: start, skip: [] } ];
    let visited = {};
    let paths = [];
    let end = false;
    do {
      let vertex = stack[stack.length-1].vertex;
      if(visited[vertex] == _VISIT_ST.FULLY_VISITED){
        visited[vertex] = _VISIT_ST.UNVISITED;
        if(visited[start]== 0) {
          end = true;
          
        }
        else stack[stack.length-2].skip.push(stack.pop().vertex);
      }
      else{
        visited[vertex] = _VISIT_ST.VISITED; 
        for (let i = 0; i < adjacencyList[vertex].length; i++) {
          const neighbor = adjacencyList[vertex][i];
          if(stack[stack.length-1].skip.includes(neighbor)) continue;
          if(i == adjacencyList[vertex].length-1) visited[vertex] = _VISIT_ST.FULLY_VISITED;
          if(!visited[neighbor]) { stack.push({vertex: neighbor, skip: []}); break; }
          else if(neighbor == start) paths.push(JSON.parse(JSON.stringify(stack)));
        }
      }
    } while (!end);
    
    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      let circ = [];
      for (let j = 0; j < path.length; j++) {
        const hop = path[j];
        circ.push(hop.vertex);
      }
      result.data.push(circ);
    }
    return result;
  }
	/**
	 * Get the Loops (meshes) in the provided matrices
	 * Meshes are segmented by the order of magnitude (number os branches used to close the loop)
	 * 
	 * @param {Int} deepness Define the level of detail of the data returned. It's possible to get 3 levels, from 0 to 2, being 2 the most detailed.
	 * Level 0 - Provide information just about the branches names (a simple list);
	 * Level 1 - Provide information about the branches' names, categorized by meshes' order and a resume of overall info;
   * Level 2 - Provide information about the branches' names (its parent and child nodes' names), categorized by meshes' order and a resume of overall info;
	 * @returns An object with information about error and meshes data.
	 */
  getMeshes(deepness = 1){
    let result = { error: {state: false, reason: "OK"}, data: {}};
    function compareArrays(arr1, arr2) {
      // compare arrays
      const result = JSON.stringify(arr1) == JSON.stringify(arr2)
      return result;
    }
    
    function compareSortedArrays(arr1, arr2) {
      // compare sorted arrays
      const a = JSON.parse(JSON.stringify(arr1));
      const b = JSON.parse(JSON.stringify(arr2));
      const result = JSON.stringify(a.sort()) == JSON.stringify(b.sort());
      return result;
    }
    
    function convertMeshesToString(ms, edg) {
      let errorCode = 0;
      let m = JSON.parse(JSON.stringify(ms));
      for (let i = 0; i < m.length; i++) {
        for (let j = 0; j < m[i].length; j++) {
          m[i][j] = edg[m[i][j]];
        }
      }
      return {
        errorCode: errorCode,
        data: m
      }
    }
    
    function convertPathInfoToString(vert, edg, info) {
      let errorCode = 0;
      for (let i = 0; i < info.length; i++) {
        const pathInfo = info[i];
        for (let j = 0; j < pathInfo.fullpath.length; j++) {
          pathInfo.fullpath[j] = vert[pathInfo.fullpath[j]];
        }
        for (let j = 0; j < pathInfo.hops.length; j++) {
          pathInfo.hops[j].source = vert[pathInfo.hops[j].source];
          pathInfo.hops[j].destination = vert[pathInfo.hops[j].destination];
          for (let k = 0; k < pathInfo.hops[j].branches.length; k++) {
            pathInfo.hops[j].branches[k] = edg[pathInfo.hops[j].branches[k]];
          }
        }
      }
      return {
        errorCode: errorCode,
        data: JSON.parse(JSON.stringify(info))
      }
    }
        
    function sortAndSetMeshesOrder(ms) {
      let errorCode = 0;
      let m = JSON.parse(JSON.stringify(ms));
      let total = 0;
      let ordermax = 0;
    
      // Get Info
      for (let i = 0; i < m.length; i++) {
        let order = m[i].length;
        if( order > ordermax) ordermax = order;
        total++;
      }
    
      let newMeshList = { order:  new Array(ordermax+1), info: { count:  new Array(ordermax+1), total: total, ordermax: ordermax}};
    
      // Sort Meshes 
      for (let i = 0; i < newMeshList.order.length; i++) {
        newMeshList.order[i] = [];
        newMeshList.info.count[i] = 0;
      }
    
      let mesh = new Array(ordermax);
      
      for (let i = 0; i < m.length; i++) {
        let order = m[i].length;
        newMeshList.order[order].push(m[i]);
        newMeshList.info.count[order]++;
      }
    
      return {
        errorCode: errorCode,
        data: newMeshList
      }
    }
    
    /*
      How to calculate the total number of meshes in a Graph (that represents an electric circuit)?
      
      After the Graph search, do as follows:
    
      For each path (vertices sequence),
        if the number of vertices (or hops) is equal to 2:
          the total number of meshes is equal to (1/2)*(edges^2-edges)
        else
          the total number of meshes will be given by the product of hop edges.
    
      The total number of meshes is the Sum of the paths meshes.
    
      Example:
      Graph Info:
        V = {A,B,C,D} and E{e1, e2, e3, e4, e5, e6, e7, e8}
      
      Graph Search Results: 
        Paths/Edges:
        [1] -> [A,B] = {e1, e2, e3}
        [2] -> [A,B,C,D] = {e1, e2, e3}
        [3] -> [B,C] = {e7, e8}
        [4] -> [C,D] = {e5, e6}
      
      Calculate the (possible) number of meshes:
        [1] -> [A,B] = (1/2)*(3^2-3) = 3 possible meshes
        [2] -> [A,B,C,D] = 3*2*2*1 = 12 possible meshes
        [3] -> [B,C] = (1/2)*(2^2-2) = 1 possible mesh
        [4] -> [C,D] = (1/2)*(2^2-2) = 1 possible mesh
        
        Therefore, Graph total number of meshes is: 3+12+1+1 = 17
    */
    function getHopCombinations(h) {
      let errorCode = 0;
      let meshList = [];
      let cnt = 1;
      
      let hopCount = h.length;
      if(hopCount == 2) cnt = (1/2)*((h[0].branches.length*h[0].branches.length)-h[0].branches.length);
      else{
        for (let i = 0; i < hopCount; i++) {
          const hop = h[i];
          cnt = cnt * hop.branches.length;
        }
      }
      //console.log("getHopCombinations::Meshes Count: " + cnt);
    
      // Search for combinations
      for (let i = 0; i < h.length; i++) {
        const hop = h[i];
    
        if(hopCount==2){
          let tempList = [];
          for (let j = 0; j < hop.branches.length; j++){
            const b1 = hop.branches[j];
            for (let k = j+1; k < hop.branches.length; k++) {
              const b2 = hop.branches[k];
              tempList.push([[b1],[b2]]);
            }        
          }
          meshList = JSON.parse(JSON.stringify(tempList));
        }
        else{
          if(meshList.length == 0) {
            for (let j = 0; j < hop.branches.length; j++) {
              meshList.push([hop.branches[j]]);
            }
          }
          else{
            let tempList = [];
            for (let k = 0; k < meshList.length; k++) {
              const m = meshList[k];
              for (let j = 0; j < hop.branches.length; j++) {
                tempList.push(JSON.parse(JSON.stringify(m)));
                tempList[tempList.length-1].push(hop.branches[j])
              }
            }
            meshList = JSON.parse(JSON.stringify(tempList));
          }
        }
      }
      return {
        errorCode: errorCode,
        data: meshList
      }
    }

    console.log("Meshes-finder v" + _VERSION + " started the job...");
    console.time("meshes-finder-duration");

    let paths = [];
    for (let i = 0; i < this.vertices.length; i++) {
      let s = this.dfsRecursive(i).data;
      for (let j = 0; j < s.length; j++){
        const newPath = s[j];
        //paths.push(newPath);
        let found = false;
        for (let k = 0; k < paths.length; k++) {
          const storedPath = paths[k];
          if(compareArrays(newPath, storedPath)) { found = true; break; }
        }
        if(!found) paths.push(newPath);
      }
    }
    
    //console.table(paths);
    
    // Add/Remove paths with size equal to 2 (if it has more than 1 branch connecting them)
    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      if(path.length == 2){
        const row1 = this.incMatrix[path[0]];
        const row2 = this.incMatrix[path[1]];
        let incidence = 0;
        for (let j = 0; j < row1.length; j++) {
          const bit1 = row1[j];
          const bit2 = row2[j];
          if(bit1&bit2) incidence++;
        }
        if(incidence < 2) {
          paths.splice(i, 1);
          i--;
        }
        else {
          if(incidence>2) for (let h = 0; h < incidence-1; h++) { paths.unshift([path[0], path[1]]); i++; }
        }
      }
    }
    
    //console.table(paths);
    
    // Build Paths Info
    let pathsInfo = [];
    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      let pathInfo = {
        fullpath: path,
        hops: []
      }
      let si = 0;
      let di = 0;
      for (let j = 0; j < path.length; j++) {     
        // Path Index
        si=j;
        if(si<path.length-1) di=j+1;
        else di=0;
        // Path Vertices Index
        const s = path[si];
        const d = path[di];
        //console.log("path: " + path + " s: " + s + " d: " + d);
        let hop = { source: s, destination: d, branches: [] };
        // Matrix Rows
        const sm = this.incMatrix[s];
        const dm = this.incMatrix[d];
    
        for (let k = 0; k < sm.length; k++) {
          const se = sm[k];
          const de = dm[k];
          if(se & de){
            //console.log(edges[k]);
            hop.branches.push(k);
          }
        }
        pathInfo.hops.push(JSON.parse(JSON.stringify(hop)));
      }
      pathsInfo.push(JSON.parse(JSON.stringify(pathInfo)));
    }
    
    let meshesShuffledList = [];
    for (let i = 0; i < pathsInfo.length; i++) {
      let x = getHopCombinations(pathsInfo[i].hops).data
      let b = convertMeshesToString(x, this.edges).data;
      for (let j = 0; j < b.length; j++) {
        meshesShuffledList.push(b[j]);
      }
    }
    
    // Filter valid Meshes
    let meshes = [];
    for (let j = 0; j < meshesShuffledList.length; j++){
      const newPath = meshesShuffledList[j];
      let found = false;
      for (let k = 0; k < meshes.length; k++) {
        const storedPath = meshes[k];
        if(compareSortedArrays(newPath, storedPath)) { found = true; break; }
      }
      if(!found) meshes.push(newPath);
    }
    
    let meshesInfo = sortAndSetMeshesOrder(meshes).data;
    
    // Produce return values
    switch (deepness) {
      case 1:
        result.data = JSON.parse(JSON.stringify(meshesInfo));
        break;
      case 2:
        // Error Code 1: not implemented
        result.error.state = 1;
        result.error.reason = "not implemented"
      default:
        result.data = JSON.parse(JSON.stringify(meshes));
        break;
    }

    console.timeEnd("meshes-finder-duration");
    console.log("Meshes-finder v" + _VERSION + " finished the job...");

    return result;
  }

}

