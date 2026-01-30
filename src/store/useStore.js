import { create } from 'zustand';

const initialNodes = [];
const initialEdges = [];

const useStore = create((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNode: null,
  simulationRunning: false,
  simulationResults: null,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  addNode: (node) => set((state) => ({
    nodes: [...state.nodes, node]
  })),

  updateNode: (nodeId, data) => set((state) => ({
    nodes: state.nodes.map((node) =>
      node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
    )
  })),

  removeNode: (nodeId) => set((state) => ({
    nodes: state.nodes.filter((node) => node.id !== nodeId),
    edges: state.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
    selectedNode: state.selectedNode?.id === nodeId ? null : state.selectedNode
  })),

  setSelectedNode: (node) => set({ selectedNode: node }),

  onNodesChange: (changes) => set((state) => {
    const newNodes = [...state.nodes];
    changes.forEach((change) => {
      if (change.type === 'position' && change.position) {
        const nodeIndex = newNodes.findIndex((n) => n.id === change.id);
        if (nodeIndex !== -1) {
          newNodes[nodeIndex] = {
            ...newNodes[nodeIndex],
            position: change.position
          };
        }
      }
      if (change.type === 'select') {
        const node = newNodes.find((n) => n.id === change.id);
        if (change.selected && node) {
          set({ selectedNode: node });
        }
      }
      if (change.type === 'remove') {
        const idx = newNodes.findIndex((n) => n.id === change.id);
        if (idx !== -1) {
          newNodes.splice(idx, 1);
        }
      }
    });
    return { nodes: newNodes };
  }),

  onEdgesChange: (changes) => set((state) => {
    const newEdges = [...state.edges];
    changes.forEach((change) => {
      if (change.type === 'remove') {
        const idx = newEdges.findIndex((e) => e.id === change.id);
        if (idx !== -1) {
          newEdges.splice(idx, 1);
        }
      }
    });
    return { edges: newEdges };
  }),

  onConnect: (connection) => set((state) => ({
    edges: [
      ...state.edges,
      {
        ...connection,
        id: `e${connection.source}-${connection.target}`,
        type: 'smoothstep',
        animated: true
      }
    ]
  })),

  runSimulation: () => {
    const state = get();
    set({ simulationRunning: true });

    // Simulate processing time
    setTimeout(() => {
      const results = calculateSimulation(state.nodes, state.edges);
      set({ simulationResults: results, simulationRunning: false });
    }, 1500);
  },

  clearSimulation: () => set({
    nodes: [],
    edges: [],
    selectedNode: null,
    simulationResults: null
  }),

  loadExample: () => {
    const exampleNodes = [
      {
        id: 'input-1',
        type: 'processNode',
        position: { x: 50, y: 200 },
        data: {
          type: 'input',
          label: 'Raw Sugar Cane',
          icon: '🌿',
          color: '#22c55e',
          params: {
            flowRate: 1000,
            brixContent: 15,
            temperature: 25,
            purity: 85
          }
        }
      },
      {
        id: 'mill-1',
        type: 'processNode',
        position: { x: 300, y: 200 },
        data: {
          type: 'mill',
          label: 'Crushing Mill',
          icon: '⚙️',
          color: '#64748b',
          params: {
            efficiency: 95,
            rollerSpeed: 6,
            pressure: 250
          }
        }
      },
      {
        id: 'heater-1',
        type: 'processNode',
        position: { x: 550, y: 100 },
        data: {
          type: 'heater',
          label: 'Juice Heater',
          icon: '🔥',
          color: '#f97316',
          params: {
            targetTemp: 105,
            heatDuty: 500,
            efficiency: 92
          }
        }
      },
      {
        id: 'clarifier-1',
        type: 'processNode',
        position: { x: 550, y: 300 },
        data: {
          type: 'clarifier',
          label: 'Clarifier',
          icon: '🧪',
          color: '#8b5cf6',
          params: {
            retentionTime: 45,
            limeAddition: 0.5,
            flocculant: 3
          }
        }
      },
      {
        id: 'evaporator-1',
        type: 'processNode',
        position: { x: 800, y: 200 },
        data: {
          type: 'evaporator',
          label: 'Multiple Effect Evaporator',
          icon: '💨',
          color: '#06b6d4',
          params: {
            effects: 5,
            steamPressure: 2.5,
            targetBrix: 65,
            efficiency: 88
          }
        }
      },
      {
        id: 'crystallizer-1',
        type: 'processNode',
        position: { x: 1050, y: 200 },
        data: {
          type: 'crystallizer',
          label: 'Vacuum Pan',
          icon: '💎',
          color: '#ec4899',
          params: {
            vacuum: 0.85,
            seedAmount: 5,
            boilingTime: 180,
            crystalSize: 0.6
          }
        }
      },
      {
        id: 'centrifuge-1',
        type: 'processNode',
        position: { x: 1300, y: 200 },
        data: {
          type: 'centrifuge',
          label: 'Centrifuge',
          icon: '🌀',
          color: '#3b82f6',
          params: {
            speed: 1200,
            cycleTime: 3,
            washWater: 2
          }
        }
      },
      {
        id: 'dryer-1',
        type: 'processNode',
        position: { x: 1550, y: 200 },
        data: {
          type: 'dryer',
          label: 'Rotary Dryer',
          icon: '🌡️',
          color: '#eab308',
          params: {
            airTemp: 85,
            residenceTime: 20,
            targetMoisture: 0.05
          }
        }
      },
      {
        id: 'output-1',
        type: 'processNode',
        position: { x: 1800, y: 200 },
        data: {
          type: 'output',
          label: 'White Sugar',
          icon: '🍬',
          color: '#10b981',
          params: {
            purity: 99.8,
            moisture: 0.04,
            color: 25
          }
        }
      }
    ];

    const exampleEdges = [
      { id: 'e1', source: 'input-1', target: 'mill-1', type: 'smoothstep', animated: true },
      { id: 'e2', source: 'mill-1', target: 'heater-1', type: 'smoothstep', animated: true },
      { id: 'e3', source: 'mill-1', target: 'clarifier-1', type: 'smoothstep', animated: true },
      { id: 'e4', source: 'heater-1', target: 'evaporator-1', type: 'smoothstep', animated: true },
      { id: 'e5', source: 'clarifier-1', target: 'evaporator-1', type: 'smoothstep', animated: true },
      { id: 'e6', source: 'evaporator-1', target: 'crystallizer-1', type: 'smoothstep', animated: true },
      { id: 'e7', source: 'crystallizer-1', target: 'centrifuge-1', type: 'smoothstep', animated: true },
      { id: 'e8', source: 'centrifuge-1', target: 'dryer-1', type: 'smoothstep', animated: true },
      { id: 'e9', source: 'dryer-1', target: 'output-1', type: 'smoothstep', animated: true }
    ];

    set({ nodes: exampleNodes, edges: exampleEdges, selectedNode: null, simulationResults: null });
  }
}));

// Simulation calculation function
function calculateSimulation(nodes, edges) {
  if (nodes.length === 0) return null;

  const inputNode = nodes.find(n => n.data.type === 'input');
  if (!inputNode) return null;

  const inputParams = inputNode.data.params;
  const flowRate = inputParams.flowRate || 1000;
  const brix = inputParams.brixContent || 15;
  const purity = inputParams.purity || 85;

  // Calculate mass balance
  const sugarInCane = flowRate * (brix / 100);
  const puresugar = sugarInCane * (purity / 100);

  // Get equipment efficiencies
  const mill = nodes.find(n => n.data.type === 'mill');
  const evaporator = nodes.find(n => n.data.type === 'evaporator');
  const crystallizer = nodes.find(n => n.data.type === 'crystallizer');
  const centrifuge = nodes.find(n => n.data.type === 'centrifuge');

  const millEff = mill?.data.params.efficiency || 95;
  const evapEff = evaporator?.data.params.efficiency || 88;
  const crystEff = 92; // Assumed crystallization efficiency

  // Calculate yields
  const juiceExtracted = flowRate * (millEff / 100);
  const waterEvaporated = juiceExtracted * 0.7 * (evapEff / 100);
  const syrupFlow = juiceExtracted - waterEvaporated;

  const sugarRecovered = puresugar * (millEff / 100) * (evapEff / 100) * (crystEff / 100) / 100;
  const overallYield = (sugarRecovered / flowRate) * 100;

  // Energy calculations
  const steamRequired = waterEvaporated * 0.5; // kg steam per kg water
  const powerConsumption = flowRate * 0.025; // kWh per ton cane

  // Calculate process stream data for each node
  const streamData = {};
  nodes.forEach(node => {
    switch(node.data.type) {
      case 'input':
        streamData[node.id] = { flow: flowRate, brix: brix, temp: 25 };
        break;
      case 'mill':
        streamData[node.id] = { flow: juiceExtracted, brix: brix * 1.1, temp: 30 };
        break;
      case 'heater':
        streamData[node.id] = { flow: juiceExtracted, brix: brix * 1.1, temp: 105 };
        break;
      case 'evaporator':
        streamData[node.id] = { flow: syrupFlow, brix: 65, temp: 60 };
        break;
      case 'crystallizer':
        streamData[node.id] = { flow: syrupFlow * 0.6, brix: 92, temp: 70 };
        break;
      case 'centrifuge':
        streamData[node.id] = { flow: sugarRecovered, brix: 99.5, temp: 55 };
        break;
      case 'dryer':
        streamData[node.id] = { flow: sugarRecovered * 0.98, brix: 99.8, temp: 40 };
        break;
      case 'output':
        streamData[node.id] = { flow: sugarRecovered * 0.98, purity: 99.8, temp: 30 };
        break;
      default:
        streamData[node.id] = { flow: flowRate * 0.9, temp: 50 };
    }
  });

  return {
    summary: {
      inputFlow: flowRate,
      sugarProduced: sugarRecovered.toFixed(2),
      overallYield: overallYield.toFixed(2),
      steamConsumption: steamRequired.toFixed(2),
      powerConsumption: powerConsumption.toFixed(2),
      waterEvaporated: waterEvaporated.toFixed(2),
      molassesProduced: (puresugar - sugarRecovered).toFixed(2)
    },
    massBalance: {
      caneInput: flowRate,
      juiceExtracted: juiceExtracted.toFixed(2),
      bagasse: (flowRate - juiceExtracted).toFixed(2),
      syrup: syrupFlow.toFixed(2),
      sugar: sugarRecovered.toFixed(2),
      molasses: (puresugar - sugarRecovered).toFixed(2)
    },
    energyBalance: {
      steamIn: steamRequired.toFixed(2),
      electricityIn: powerConsumption.toFixed(2),
      heatRecovered: (steamRequired * 0.3).toFixed(2)
    },
    streamData,
    efficiency: {
      extraction: millEff,
      evaporation: evapEff,
      crystallization: crystEff,
      overall: ((millEff * evapEff * crystEff) / 10000).toFixed(2)
    }
  };
}

export default useStore;
