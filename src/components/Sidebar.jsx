import useStore from '../store/useStore';

const equipmentLibrary = [
  {
    category: 'Inputs & Outputs',
    items: [
      { type: 'input', label: 'Raw Material Input', icon: '🌿', color: '#22c55e', description: 'Sugar cane or beet input' },
      { type: 'output', label: 'Product Output', icon: '🍬', color: '#10b981', description: 'Final sugar product' }
    ]
  },
  {
    category: 'Extraction',
    items: [
      { type: 'mill', label: 'Crushing Mill', icon: '⚙️', color: '#64748b', description: 'Extract juice from cane' },
      { type: 'diffuser', label: 'Diffuser', icon: '🔄', color: '#64748b', description: 'Counter-current extraction' }
    ]
  },
  {
    category: 'Purification',
    items: [
      { type: 'heater', label: 'Juice Heater', icon: '🔥', color: '#f97316', description: 'Heat treatment' },
      { type: 'clarifier', label: 'Clarifier', icon: '🧪', color: '#8b5cf6', description: 'Remove impurities' },
      { type: 'filter', label: 'Rotary Filter', icon: '🔘', color: '#6366f1', description: 'Mud filtration' }
    ]
  },
  {
    category: 'Concentration',
    items: [
      { type: 'evaporator', label: 'Evaporator', icon: '💨', color: '#06b6d4', description: 'Multi-effect evaporation' },
      { type: 'preheater', label: 'Pre-heater', icon: '♨️', color: '#f59e0b', description: 'Heat recovery' }
    ]
  },
  {
    category: 'Crystallization',
    items: [
      { type: 'crystallizer', label: 'Vacuum Pan', icon: '💎', color: '#ec4899', description: 'Sugar crystallization' },
      { type: 'cooler', label: 'Crystallizer Cooler', icon: '❄️', color: '#0ea5e9', description: 'Cooling crystallizer' }
    ]
  },
  {
    category: 'Separation',
    items: [
      { type: 'centrifuge', label: 'Centrifuge', icon: '🌀', color: '#3b82f6', description: 'Separate crystals' },
      { type: 'dryer', label: 'Rotary Dryer', icon: '🌡️', color: '#eab308', description: 'Dry sugar crystals' }
    ]
  },
  {
    category: 'Utilities',
    items: [
      { type: 'boiler', label: 'Steam Boiler', icon: '🏭', color: '#ef4444', description: 'Generate steam' },
      { type: 'condenser', label: 'Condenser', icon: '💧', color: '#14b8a6', description: 'Condense vapor' },
      { type: 'tank', label: 'Storage Tank', icon: '🛢️', color: '#78716c', description: 'Material storage' },
      { type: 'pump', label: 'Pump', icon: '⬆️', color: '#a855f7', description: 'Fluid transfer' }
    ]
  }
];

const defaultParams = {
  input: { flowRate: 1000, brixContent: 15, temperature: 25, purity: 85 },
  output: { purity: 99.8, moisture: 0.04, color: 25 },
  mill: { efficiency: 95, rollerSpeed: 6, pressure: 250 },
  diffuser: { efficiency: 97, temperature: 75, retention: 60 },
  heater: { targetTemp: 105, heatDuty: 500, efficiency: 92 },
  clarifier: { retentionTime: 45, limeAddition: 0.5, flocculant: 3 },
  filter: { filtrationRate: 100, vacuumPressure: 0.5, cakeWash: 2 },
  evaporator: { effects: 5, steamPressure: 2.5, targetBrix: 65, efficiency: 88 },
  preheater: { targetTemp: 95, heatRecovery: 80 },
  crystallizer: { vacuum: 0.85, seedAmount: 5, boilingTime: 180, crystalSize: 0.6 },
  cooler: { targetTemp: 45, coolingRate: 2 },
  centrifuge: { speed: 1200, cycleTime: 3, washWater: 2 },
  dryer: { airTemp: 85, residenceTime: 20, targetMoisture: 0.05 },
  boiler: { steamPressure: 30, efficiency: 85, capacity: 100 },
  condenser: { coolingWater: 500, vacuumLevel: 0.9 },
  tank: { capacity: 1000, level: 50 },
  pump: { flowRate: 100, head: 30, efficiency: 75 }
};

const Sidebar = () => {
  const addNode = useStore((state) => state.addNode);

  const onDragStart = (event, item) => {
    event.dataTransfer.setData('application/json', JSON.stringify(item));
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleAddEquipment = (item) => {
    const id = `${item.type}-${Date.now()}`;
    const newNode = {
      id,
      type: 'processNode',
      position: { x: 400 + Math.random() * 200, y: 200 + Math.random() * 200 },
      data: {
        ...item,
        params: { ...defaultParams[item.type] }
      }
    };
    addNode(newNode);
  };

  return (
    <div className="sidebar">
      <div style={{ marginBottom: '16px', padding: '12px', background: '#0f172a', borderRadius: '8px', border: '1px solid #334155' }}>
        <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
          Drag equipment to the canvas or click to add. Connect equipment by dragging from output to input handles.
        </p>
      </div>

      {equipmentLibrary.map((category) => (
        <div key={category.category} className="equipment-category">
          <h2>{category.category}</h2>
          {category.items.map((item) => (
            <div
              key={item.type}
              className="equipment-item"
              draggable
              onDragStart={(e) => onDragStart(e, item)}
              onClick={() => handleAddEquipment(item)}
            >
              <div
                className="equipment-icon"
                style={{ background: `${item.color}20`, color: item.color }}
              >
                {item.icon}
              </div>
              <div className="equipment-info">
                <h3>{item.label}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
export { equipmentLibrary, defaultParams };
