import { Handle, Position } from '@xyflow/react';

const ProcessNode = ({ data, selected }) => {
  const { type, label, icon, color, params } = data;

  const getParamDisplay = () => {
    if (!params) return [];

    switch (type) {
      case 'input':
        return [
          { label: 'Flow Rate', value: `${params.flowRate} t/h` },
          { label: 'Brix', value: `${params.brixContent}%` },
          { label: 'Purity', value: `${params.purity}%` }
        ];
      case 'mill':
        return [
          { label: 'Efficiency', value: `${params.efficiency}%` },
          { label: 'Pressure', value: `${params.pressure} bar` }
        ];
      case 'heater':
        return [
          { label: 'Target Temp', value: `${params.targetTemp}°C` },
          { label: 'Heat Duty', value: `${params.heatDuty} kW` }
        ];
      case 'clarifier':
        return [
          { label: 'Retention', value: `${params.retentionTime} min` },
          { label: 'Lime', value: `${params.limeAddition} kg/t` }
        ];
      case 'evaporator':
        return [
          { label: 'Effects', value: params.effects },
          { label: 'Target Brix', value: `${params.targetBrix}%` },
          { label: 'Efficiency', value: `${params.efficiency}%` }
        ];
      case 'crystallizer':
        return [
          { label: 'Vacuum', value: `${params.vacuum} bar` },
          { label: 'Crystal Size', value: `${params.crystalSize} mm` }
        ];
      case 'centrifuge':
        return [
          { label: 'Speed', value: `${params.speed} rpm` },
          { label: 'Cycle', value: `${params.cycleTime} min` }
        ];
      case 'dryer':
        return [
          { label: 'Air Temp', value: `${params.airTemp}°C` },
          { label: 'Moisture', value: `${params.targetMoisture}%` }
        ];
      case 'output':
        return [
          { label: 'Purity', value: `${params.purity}%` },
          { label: 'Color', value: `${params.color} IU` }
        ];
      default:
        return Object.entries(params).slice(0, 3).map(([key, value]) => ({
          label: key,
          value: typeof value === 'number' ? value.toFixed(2) : value
        }));
    }
  };

  const paramDisplay = getParamDisplay();

  return (
    <div className={`process-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Left} />

      <div className="process-node-header">
        <div className="process-node-icon" style={{ background: `${color}20`, color }}>
          {icon}
        </div>
        <div>
          <div className="process-node-title">{label}</div>
          <div className="process-node-type">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
        </div>
      </div>

      <div className="process-node-body">
        {paramDisplay.map((param, index) => (
          <div key={index} className="node-param">
            <span className="node-param-label">{param.label}</span>
            <span className="node-param-value">{param.value}</span>
          </div>
        ))}
      </div>

      <div className="process-node-footer">
        <div className="node-input">
          <span>●</span> In
        </div>
        <div className="node-output">
          Out <span>●</span>
        </div>
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default ProcessNode;
