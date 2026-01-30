import useStore from '../store/useStore';

const Header = () => {
  const {
    runSimulation,
    clearSimulation,
    loadExample,
    simulationRunning,
    nodes,
    simulationResults
  } = useStore();

  const handleExport = () => {
    const data = {
      nodes: useStore.getState().nodes,
      edges: useStore.getState().edges,
      results: simulationResults
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sugar-process-model.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="header">
      <div className="logo">
        <div className="logo-icon">🏭</div>
        <div>
          <h1>SUGARS</h1>
          <span>Process Simulator</span>
        </div>
      </div>

      <div className="simulation-status">
        <div className={`status-indicator ${simulationRunning ? 'running' : ''}`}></div>
        <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
          {simulationRunning ? 'Simulating...' : simulationResults ? 'Simulation Complete' : 'Ready'}
        </span>
      </div>

      <div className="header-actions">
        <button className="btn btn-secondary" onClick={loadExample}>
          📋 Load Example
        </button>
        <button className="btn btn-secondary" onClick={handleExport} disabled={nodes.length === 0}>
          💾 Export
        </button>
        <button className="btn btn-secondary" onClick={clearSimulation}>
          🗑️ Clear
        </button>
        <button
          className="btn btn-primary"
          onClick={runSimulation}
          disabled={simulationRunning || nodes.length === 0}
        >
          {simulationRunning ? '⏳ Running...' : '▶️ Run Simulation'}
        </button>
      </div>
    </header>
  );
};

export default Header;
