const { Graph } = require('graphology');
const bfs = require('graphology-traversal').bfs;
const connectedComponents = require('graphology-components').connectedComponents;
const stronglyConnectedComponents = require('graphology-components').stronglyConnectedComponents;
const createPagerank = require('ngraph.pagerank');
const fs = require('fs');

// Read JSON files
const nodeData = JSON.parse(fs.readFileSync('./public/data/graphNode.json', 'utf8'));
const edgeMengingatData = JSON.parse(fs.readFileSync('./public/data/graphEdgeMengingat.json', 'utf8'));
const edgeMenimbangData = JSON.parse(fs.readFileSync('./public/data/graphEdgeMenimbang.json', 'utf8'));

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

// Adding or updating nodes
nodeData.forEach(node => addOrUpdateNode(graphMengingat, node));
edgeMengingatData.forEach(edge => graphMengingat.addEdge(edge.source, edge.target, edge));

// Displaying vertices and edges
console.log("Vertices (graphMengingat):", graphMengingat.nodes().toArray());
console.log("Edges (graphMengingat):", graphMengingat.edges().toArray());

// In-degree and Out-degree
const inDegrees = graphMengingat.inDegree();
console.log("In-Degrees:", inDegrees);

const outDegrees = graphMengingat.outDegree();
console.log("Out-Degrees:", outDegrees);

// PageRank
const pageRank = createPagerank(graphMengingat);
console.log("PageRank:", pageRank.rank());

// Connected Components
const cc = connectedComponents(graphMengingat);
console.log("Connected Components:", cc);

// Strongly Connected Components
const scc = stronglyConnectedComponents(graphMengingat, { maxIterations: 10 });
console.log("Strongly Connected Components:", scc);

// Breadth-First Search
const bfsResult = bfs(graphMengingat, { start: '1', goal: '2' });
console.log("BFS Result:", bfsResult);
