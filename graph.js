const { Graph } = require('graphology');
const bfs = require('graphology-traversal').bfs;
const connectedComponents = require('graphology-components').connectedComponents;
const stronglyConnectedComponents = require('graphology-components').stronglyConnectedComponents;
const createPagerank = require('graphology-pagerank');
const fs = require('fs');

class NotFoundGraphError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundGraphError';
  }
}

// Read JSON files
const nodeData = JSON.parse(fs.readFileSync('./public/data/graphNode.json', 'utf8'));
const edgeMengingatData = JSON.parse(fs.readFileSync('./public/data/graphEdgeMengingat.json', 'utf8'));
const edgeMenimbangData = JSON.parse(fs.readFileSync('./public/data/graphEdgeMenimbang.json', 'utf8'));

if (!nodeData) throw new NotFoundGraphError("Graph.inDegree: could not find the node data in the graph.");

// Creating a graph
const graphMengingat = new Graph();

// Helper function to add or update nodes
function addOrUpdateNode(graph, node) {
  const nodeId = node.id;

  if (graph.hasNode(nodeId)) {
    // Node already exists, update its attributes
    graph.mergeNodeAttributes(nodeId, node);
  } else {
    // Node doesn't exist, add it to the graph
    graph.addNode(nodeId, node);
  }
}

function addEdge(graph, edge) {
    const { src, dst } = edge;

    // Check if source and destination nodes exist
    if (!graph.hasNode(src)) {
        console.warn(`Warning: Source node "${src}" not found for edge from "${src}" to "${dst}". Skipping this edge.`);
        return;  // Skip this edge
    }

    if (!graph.hasNode(dst)) {
        console.warn(`Warning: Target node "${dst}" not found for edge from "${src}" to "${dst}". Skipping this edge.`);
        return;  // Skip this edge
    }

    // Add the edge to the graph
    graph.addEdge(src, dst);
}


// Adding or updating nodes
nodeData.forEach(node => addOrUpdateNode(graphMengingat, node));

// Adding edges
edgeMengingatData.forEach(edge => {
    try {
        addEdge(graphMengingat, edge);
        console.log("Edge added from", edge.src, "to", edge.dst);
    } catch (error) {
        console.error(error.message);
    }
});

// Displaying vertices and edges
console.log("Vertices (graphMengingat) after adding nodes:", graphMengingat.nodes());
console.log("Edges (graphMengingat) after adding edges:", graphMengingat.edges());

// In-degree and Out-degree
const inDegrees = {};
const outDegrees = {};

graphMengingat.nodes().forEach(node => {
    if (graphMengingat.hasNode(node)) {
        inDegrees[node] = graphMengingat.inDegree(node);
        outDegrees[node] = graphMengingat.outDegree(node);
    } else {
        console.warn(`Warning: Node "${node}" not found in the graph. Skipping in-degree and out-degree calculations for this node.`);
    }
});

console.log("In-Degrees:", inDegrees);
console.log("Out-Degrees:", outDegrees);

// PageRank
const pageRank = createPagerank(graphMengingat);
console.log("PageRank:", pageRank);

// Connected Components
const cc = connectedComponents(graphMengingat);
console.log("Connected Components:", cc);

// Strongly Connected Components
const scc = stronglyConnectedComponents(graphMengingat, { maxIterations: 10 });
console.log("Strongly Connected Components:", scc);

// BFS
const bfsCallback = (node, information) => {
    console.log(node); 
};

bfs(graphMengingat, bfsCallback, { start: '34 tahun 2008', goal: '22 tahun 1999' });
