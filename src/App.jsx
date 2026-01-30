import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import useStore from './store/useStore';
import ProcessNode from './nodes/ProcessNode';
import Sidebar from './components/Sidebar';
import RightPanel from './components/RightPanel';
import Header from './components/Header';
import { defaultParams } from './components/Sidebar';

const nodeTypes = {
  processNode: ProcessNode
};

function Flow() {
  const reactFlowWrapper = useRef(null);
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setSelectedNode
  } = useStore();

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const data = event.dataTransfer.getData('application/json');
      if (!data) return;

      const item = JSON.parse(data);
      const bounds = reactFlowWrapper.current.getBoundingClientRect();

      const position = {
        x: event.clientX - bounds.left - 90,
        y: event.clientY - bounds.top - 50
      };

      const id = `${item.type}-${Date.now()}`;
      const newNode = {
        id,
        type: 'processNode',
        position,
        data: {
          ...item,
          params: { ...defaultParams[item.type] }
        }
      };

      addNode(newNode);
    },
    [addNode]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, [setSelectedNode]);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  return (
    <div className="app-container">
      <Header />
      <Sidebar />
      <div className="main-canvas" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid
          snapGrid={[15, 15]}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true
          }}
        >
          <Controls />
          <MiniMap
            nodeColor={(node) => node.data?.color || '#64748b'}
            maskColor="rgba(15, 23, 42, 0.8)"
          />
          <Background color="#334155" gap={20} size={1} />
        </ReactFlow>

        {nodes.length === 0 && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: '#64748b',
            pointerEvents: 'none'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>🏭</div>
            <h2 style={{ fontSize: '1.5rem', color: '#94a3b8', marginBottom: '8px' }}>
              Build Your Sugar Process
            </h2>
            <p style={{ maxWidth: '400px', margin: '0 auto', lineHeight: 1.6 }}>
              Drag equipment from the left sidebar onto the canvas to start building your sugar manufacturing process model.
              <br /><br />
              Or click <strong>"Load Example"</strong> to see a complete sugar cane processing plant.
            </p>
          </div>
        )}
      </div>
      <RightPanel />
    </div>
  );
}

function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}

export default App;
