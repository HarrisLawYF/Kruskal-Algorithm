//Minimum Spanning Tree (greedy algorithm)
//It has (V-1) edges (where only one edge between 2 nodes, undirected), which V is the number of vertices in the given graph, which the graph should not form a cycle.
//This example demonstrates using Kruskal algorithm to find the MST


//union by rank: Union by rank always attaches the shorter tree to the root of the taller tree, be used to decide which should become the parent of other sub-tree

//Path Compression: flattens the structure (virtually) of the tree by making every node point to the root whenever Find is used on it, so the ultimate
//result is parent of every node will be the main root at the end.

//Credit: https://www.geeksforgeeks.org/kruskals-minimum-spanning-tree-algorithm-greedy-algo-2/ (translated from C to javascript)

//Just a representative of a virtual struct
var edge = {
	src: 0,
	dest: 0,
	weight: 0
}

//Just a representative of a virtual struct
var subset = {
	parent: 0,
	rank: 0
}

var graph = {
	edges:[],
	vertices: 0,
	edge_number: 0,
	create: function(){
		for (i = 0; i < this.edge_number; i++) {
			// Initialize the graph with empty nodes			
			var new_edge = {src:0,dest:0};
			this.edges.push(new_edge);
		}
		return this;
	},
}

function find(subsets, i) 
{ 
    // find root and make root as parent of i (path compression) 
    if (subsets[i].parent != i) 
        subsets[i].parent = find(subsets, subsets[i].parent); 
  
    return subsets[i].parent; 
}

function Union(subsets, xroot, yroot) 
{   
    // Attach smaller rank tree under root of high rank tree 
    // (Union by Rank) 
    if (subsets[xroot].rank < subsets[yroot].rank) 
        subsets[xroot].parent = yroot; 
    else if (subsets[xroot].rank > subsets[yroot].rank) 
        subsets[yroot].parent = xroot; 
  
    // If ranks are same, then make one as root and increment 
    // its rank by one 
    else
    { 
        subsets[yroot].parent = xroot; 
        subsets[xroot].rank++;
    } 
}

// The main function to construct MST using Kruskal's algorithm 
function CreateKruskalMST(graph) 
{ 
    var V = graph.vertices;
    var E = graph.edge_number;
	
	var result = []; // Tnis will store the resultant MST  
    var e = 0;  // An index variable, used for result[]
    var i = 0;  // An index variable, used for sorted edges 
  
    // Step 1:  Sort all the edges in non-decreasing  
    // order of their weight (virtually). 
	// We only change the sequence of reading the tree in array format.
	// We can also sort by bubble sort etc
	console.log("Before.....................");
	console.log(graph);
	graph.edges.sort((a, b) => (a.weight > b.weight) ? 1 : -1);
	console.log("After.....................");
	console.log(graph);
  
    // Allocate memory for creating V ssubsets 
    var subsets = [];
  
    // Create V subsets with single elements 
    for (var v = 0; v < V; ++v) 
    { 
		var new_subset = {parent:v,rank:0};
		subsets.push(new_subset);
    } 
  
    // Number of edges to be taken is equal to V-1 (practically, we just need to check only i < E)
    while (e < V - 1 && i < E) 
    { 
        // Step 2: Pick the smallest edge. And increment  
        // the index for next iteration
        var next_edge = graph.edges[i++]; 
  
        var x = find(subsets, next_edge.src);
        var y = find(subsets, next_edge.dest);
  
        // If including this edge does't cause cycle, 
        // include it in result and increment the index  
        // of result for next edge 
        if (x != y) 
        { 
			e++;
            result.push(next_edge);
            Union(subsets, x, y); 
        } 
        // Else discard the next_edge
    } 
  
    // print the contents of result[] to display the 
    // built MST 
    console.log("Following are the edges in the constructed MST\n"); 
    for (i = 0; i < e; ++i) 
        console.log("%d -- %d == %d\n", result[i].src, result[i].dest, 
                                                 result[i].weight);
} 

function main() 
{ 
	var V = 4, E = 5; 
    var new_graph = {edges:[],vertices:V,edge_number:E};
	
	// calling create function using virtual graph struct, to create a graph that has no edges first
	new_graph = graph.create.call(new_graph);
	
	new_graph.edges[0].src = 0; 
    new_graph.edges[0].dest = 1; 
    new_graph.edges[0].weight = 10; 
  
    // add edge 0-2 
    new_graph.edges[1].src = 0; 
    new_graph.edges[1].dest = 2; 
    new_graph.edges[1].weight = 6; 
  
    // add edge 0-3 
    new_graph.edges[2].src = 0; 
    new_graph.edges[2].dest = 3; 
    new_graph.edges[2].weight = 5; 
  
    // add edge 1-3 
    new_graph.edges[3].src = 1; 
    new_graph.edges[3].dest = 3; 
    new_graph.edges[3].weight = 15; 
  
    // add edge 2-3 
    new_graph.edges[4].src = 2; 
    new_graph.edges[4].dest = 3; 
    new_graph.edges[4].weight = 4;
	
	CreateKruskalMST(new_graph);
}

main();
//---------------------------------------------------------------------------------------------------------------------------------
//Basic function to test if the cyclic check is functioning correctly
function isCycle(graph) 
{ 
    var V = graph.vertices;
    var E = graph.edge_number;
  
    // Allocate memory for creating V sets 
	var subsets = [];
  
	//Group each node as its own subset first, starting from rank 0
    for (var v = 0; v < V; ++v) 
    { 
		var new_subset = {parent:v,rank:0};
		subsets.push(new_subset);
    } 
  
    // Iterate through all edges of graph, find sets of both 
    // vertices of every edge. 
	// If both vertices has the same ancestor, it means they are linked at somewhere else too, therefore there is a cycle in the graph.
	// else put them into one subset and determine a new ancestor based on ranks
    for(var e = 0; e < E; ++e)
    {
        var x = find(subsets, graph.edges[e].src);
		console.log(x);
		console.log("---------------------------------");
        var y = find(subsets, graph.edges[e].dest);
		console.log(y);
		console.log("========================");
        if (x == y) 
            return 1; 
  
        Union(subsets, x, y); 
    } 
    return 0; 
}
