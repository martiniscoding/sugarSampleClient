import { useState } from 'react';
import useStore from '../store/useStore';

const RightPanel = () => {
  const { selectedNode, updateNode, removeNode, simulationResults, simulationRunning } = useStore();
  const [activeTab, setActiveTab] = useState('properties');

  const handleParamChange = (paramKey, value) => {
    if (!selectedNode) return;

    const numValue = parseFloat(value);
    updateNode(selectedNode.id, {
      params: {
        ...selectedNode.data.params,
        [paramKey]: isNaN(numValue) ? value : numValue
      }
    });
  };

  const renderParamInputs = () => {
    if (!selectedNode?.data?.params) return null;

    const paramConfig = {
      flowRate: { label: 'Flow Rate', unit: 't/h', min: 0, max: 10000 },
      brixContent: { label: 'Brix Content', unit: '%', min: 0, max: 100 },
      temperature: { label: 'Temperature', unit: '°C', min: 0, max: 200 },
      purity: { label: 'Purity', unit: '%', min: 0, max: 100 },
      efficiency: { label: 'Efficiency', unit: '%', min: 0, max: 100 },
      rollerSpeed: { label: 'Roller Speed', unit: 'rpm', min: 0, max: 20 },
      pressure: { label: 'Pressure', unit: 'bar', min: 0, max: 500 },
      targetTemp: { label: 'Target Temperature', unit: '°C', min: 0, max: 200 },
      heatDuty: { label: 'Heat Duty', unit: 'kW', min: 0, max: 5000 },
      retentionTime: { label: 'Retention Time', unit: 'min', min: 0, max: 120 },
      limeAddition: { label: 'Lime Addition', unit: 'kg/t', min: 0, max: 5 },
      flocculant: { label: 'Flocculant', unit: 'ppm', min: 0, max: 20 },
      effects: { label: 'Number of Effects', unit: '', min: 1, max: 7 },
      steamPressure: { label: 'Steam Pressure', unit: 'bar', min: 0, max: 50 },
      targetBrix: { label: 'Target Brix', unit: '%', min: 0, max: 100 },
      vacuum: { label: 'Vacuum Level', unit: 'bar abs', min: 0, max: 1 },
      seedAmount: { label: 'Seed Amount', unit: 'kg', min: 0, max: 50 },
      boilingTime: { label: 'Boiling Time', unit: 'min', min: 0, max: 300 },
      crystalSize: { label: 'Crystal Size', unit: 'mm', min: 0, max: 2 },
      speed: { label: 'Rotation Speed', unit: 'rpm', min: 0, max: 3000 },
      cycleTime: { label: 'Cycle Time', unit: 'min', min: 0, max: 10 },
      washWater: { label: 'Wash Water', unit: '%', min: 0, max: 10 },
      airTemp: { label: 'Air Temperature', unit: '°C', min: 0, max: 150 },
      residenceTime: { label: 'Residence Time', unit: 'min', min: 0, max: 60 },
      targetMoisture: { label: 'Target Moisture', unit: '%', min: 0, max: 1 },
      moisture: { label: 'Moisture Content', unit: '%', min: 0, max: 1 },
      color: { label: 'Color Index', unit: 'IU', min: 0, max: 100 },
      capacity: { label: 'Capacity', unit: 't', min: 0, max: 10000 },
      level: { label: 'Fill Level', unit: '%', min: 0, max: 100 },
      head: { label: 'Pump Head', unit: 'm', min: 0, max: 100 },
      filtrationRate: { label: 'Filtration Rate', unit: 'm³/h', min: 0, max: 500 },
      vacuumPressure: { label: 'Vacuum Pressure', unit: 'bar', min: 0, max: 1 },
      cakeWash: { label: 'Cake Wash Ratio', unit: '', min: 0, max: 5 },
      heatRecovery: { label: 'Heat Recovery', unit: '%', min: 0, max: 100 },
      coolingRate: { label: 'Cooling Rate', unit: '°C/h', min: 0, max: 10 },
      coolingWater: { label: 'Cooling Water', unit: 'm³/h', min: 0, max: 1000 },
      vacuumLevel: { label: 'Vacuum Level', unit: 'bar abs', min: 0, max: 1 }
    };

    return Object.entries(selectedNode.data.params).map(([key, value]) => {
      const config = paramConfig[key] || { label: key, unit: '', min: 0, max: 1000 };
      return (
        <div key={key} className="param-group">
          <label>{config.label}</label>
          <input
            type="number"
            value={value}
            min={config.min}
            max={config.max}
            step={config.max <= 1 ? 0.01 : 1}
            onChange={(e) => handleParamChange(key, e.target.value)}
          />
          {config.unit && <div className="param-unit">{config.unit}</div>}
        </div>
      );
    });
  };

  const renderResults = () => {
    if (!simulationResults) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h3>No Results Yet</h3>
          <p>Run a simulation to see results and analytics here.</p>
        </div>
      );
    }

    const { summary, massBalance, energyBalance, efficiency } = simulationResults;

    return (
      <div>
        <div className="panel-section">
          <h2>📈 Production Summary</h2>
          <div className="results-grid">
            <div className="result-card">
              <h4>Sugar Produced</h4>
              <span className="value">{summary.sugarProduced}</span>
              <span className="unit">t/h</span>
            </div>
            <div className="result-card">
              <h4>Overall Yield</h4>
              <span className="value">{summary.overallYield}</span>
              <span className="unit">%</span>
            </div>
            <div className="result-card">
              <h4>Steam Used</h4>
              <span className="value">{summary.steamConsumption}</span>
              <span className="unit">t/h</span>
            </div>
            <div className="result-card">
              <h4>Power</h4>
              <span className="value">{summary.powerConsumption}</span>
              <span className="unit">kWh/t</span>
            </div>
          </div>
        </div>

        <div className="panel-section">
          <h2>⚖️ Mass Balance</h2>
          <div className="results-grid">
            <div className="result-card full-width">
              <h4>Cane Input</h4>
              <span className="value">{massBalance.caneInput}</span>
              <span className="unit">t/h</span>
            </div>
            <div className="result-card">
              <h4>Juice Extracted</h4>
              <span className="value">{massBalance.juiceExtracted}</span>
              <span className="unit">t/h</span>
            </div>
            <div className="result-card">
              <h4>Bagasse</h4>
              <span className="value">{massBalance.bagasse}</span>
              <span className="unit">t/h</span>
            </div>
            <div className="result-card">
              <h4>Syrup</h4>
              <span className="value">{massBalance.syrup}</span>
              <span className="unit">t/h</span>
            </div>
            <div className="result-card">
              <h4>Molasses</h4>
              <span className="value">{massBalance.molasses}</span>
              <span className="unit">t/h</span>
            </div>
          </div>
        </div>

        <div className="panel-section">
          <h2>⚡ Energy Balance</h2>
          <div className="results-grid">
            <div className="result-card">
              <h4>Steam In</h4>
              <span className="value">{energyBalance.steamIn}</span>
              <span className="unit">t/h</span>
            </div>
            <div className="result-card">
              <h4>Electricity</h4>
              <span className="value">{energyBalance.electricityIn}</span>
              <span className="unit">kWh/t</span>
            </div>
            <div className="result-card full-width">
              <h4>Heat Recovered</h4>
              <span className="value">{energyBalance.heatRecovered}</span>
              <span className="unit">t/h steam equiv.</span>
            </div>
          </div>
        </div>

        <div className="panel-section">
          <h2>🎯 Efficiency</h2>
          <div className="results-grid">
            <div className="result-card">
              <h4>Extraction</h4>
              <span className="value">{efficiency.extraction}</span>
              <span className="unit">%</span>
            </div>
            <div className="result-card">
              <h4>Evaporation</h4>
              <span className="value">{efficiency.evaporation}</span>
              <span className="unit">%</span>
            </div>
            <div className="result-card">
              <h4>Crystallization</h4>
              <span className="value">{efficiency.crystallization}</span>
              <span className="unit">%</span>
            </div>
            <div className="result-card">
              <h4>Overall</h4>
              <span className="value">{efficiency.overall}</span>
              <span className="unit">%</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="right-panel">
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'properties' ? 'active' : ''}`}
          onClick={() => setActiveTab('properties')}
        >
          Properties
        </button>
        <button
          className={`tab ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          Results
        </button>
      </div>

      {activeTab === 'properties' ? (
        selectedNode ? (
          <div>
            <div className="panel-section">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: `${selectedNode.data.color}20`,
                    color: selectedNode.data.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}
                >
                  {selectedNode.data.icon}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1rem' }}>{selectedNode.data.label}</h2>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                    {selectedNode.data.type.charAt(0).toUpperCase() + selectedNode.data.type.slice(1)}
                  </p>
                </div>
              </div>
            </div>

            <div className="panel-section">
              <h2>⚙️ Parameters</h2>
              {renderParamInputs()}
            </div>

            <div className="panel-section">
              <button
                className="btn btn-danger"
                style={{ width: '100%' }}
                onClick={() => removeNode(selectedNode.id)}
              >
                🗑️ Remove Equipment
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">👆</div>
            <h3>Select Equipment</h3>
            <p>Click on an equipment node to view and edit its properties.</p>
          </div>
        )
      ) : (
        renderResults()
      )}

      {simulationRunning && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          right: '20px',
          background: '#0f172a',
          border: '1px solid #10b981',
          borderRadius: '8px',
          padding: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div className="status-indicator running"></div>
          <span style={{ fontSize: '0.875rem' }}>Running simulation...</span>
        </div>
      )}
    </div>
  );
};

export default RightPanel;
