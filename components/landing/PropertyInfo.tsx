export interface PropertyElements {
  symbol: string
  name: string
  color: string
}

export interface PropertyStats {
  elements: PropertyElements[]
  keyStats: {
    label: string
    value: string
  }[]
  mineralizationType: string
}

export const PROPERTY_INFO: Record<string, PropertyStats> = {
  'TENNYSON': {
    elements: [
      { symbol: 'Cu', name: 'Copper', color: '#B87333' },
      { symbol: 'Au', name: 'Gold', color: '#FFD700' },
      { symbol: 'Mo', name: 'Molybdenum', color: '#54585A' }
    ],
    keyStats: [
      { label: 'Best Intercept', value: '229.5m @ 0.32% Cu, 0.25 g/t Au' },
      { label: 'Drill Holes', value: '64 historical (1986-2013)' },
      { label: 'Target Type', value: 'Porphyry Cu-Au' },
      { label: 'Gossan Size', value: '900m × 700m outcrop' }
    ],
    mineralizationType: 'Porphyry Copper-Gold'
  },
  "FOUR J'S": {
    elements: [
      { symbol: 'Au', name: 'Gold', color: '#FFD700' },
      { symbol: 'Ag', name: 'Silver', color: '#C0C0C0' },
      { symbol: 'Cu', name: 'Copper', color: '#B87333' },
      { symbol: 'Pb', name: 'Lead', color: '#565656' },
      { symbol: 'Zn', name: 'Zinc', color: '#7B9095' }
    ],
    keyStats: [
      { label: 'High Grade', value: 'Up to 29.2 g/t Au, 17 g/t Ag' },
      { label: 'Drill Holes', value: '30+ holes' },
      { label: 'Mineralization Styles', value: '3 distinct types' },
      { label: 'Recent Discovery', value: 'Porphyry signatures (2023)' }
    ],
    mineralizationType: 'VMS + Porphyry Potential'
  },
  'BIG GOLD': {
    elements: [
      { symbol: 'Au', name: 'Gold', color: '#FFD700' },
      { symbol: 'Ag', name: 'Silver', color: '#C0C0C0' },
      { symbol: 'Cu', name: 'Copper', color: '#B87333' },
      { symbol: 'Pb', name: 'Lead', color: '#565656' },
      { symbol: 'Zn', name: 'Zinc', color: '#7B9095' }
    ],
    keyStats: [
      { label: 'Exceptional Grade', value: '27.7 g/t Au, 6,240 g/t Ag' },
      { label: 'New Discoveries', value: 'Roman & Zall zones (2023)' },
      { label: 'Mineralization', value: 'Massive sulfide occurrences' },
      { label: 'Hyperspectral', value: 'Extensive alteration zones' }
    ],
    mineralizationType: 'Eskay Creek-type VMS'
  },
  'ESKAY RIFT': {
    elements: [
      { symbol: 'Ag', name: 'Silver', color: '#C0C0C0' },
      { symbol: 'Au', name: 'Gold', color: '#FFD700' },
      { symbol: 'Cu', name: 'Copper', color: '#B87333' },
      { symbol: 'Zn', name: 'Zinc', color: '#7B9095' }
    ],
    keyStats: [
      { label: 'ZTEM Anomalies', value: '2 large conductors at depth' },
      { label: 'Exploration Stage', value: 'Undrilled' },
      { label: 'Target Type', value: 'Buried massive sulfides' },
      { label: 'Host Rocks', value: 'Iskut River Formation' }
    ],
    mineralizationType: 'Eskay Creek-type VMS Target'
  },
  'LEDUC SILVER': {
    elements: [
      { symbol: 'Ag', name: 'Silver', color: '#C0C0C0' },
      { symbol: 'Pb', name: 'Lead', color: '#565656' },
      { symbol: 'Au', name: 'Gold', color: '#FFD700' }
    ],
    keyStats: [
      { label: 'Silver Grades', value: '99.2 to 386.6 g/t Ag' },
      { label: 'Vein Type', value: 'Argentiferous galena-pyrite' },
      { label: 'Gold Credit', value: 'Minor gold values' },
      { label: 'Setting', value: 'Near Granduc mine' }
    ],
    mineralizationType: 'High-Grade Silver Veins'
  },
  'PEARSON': {
    elements: [
      { symbol: 'Cu', name: 'Copper', color: '#B87333' },
      { symbol: 'Au', name: 'Gold', color: '#FFD700' }
    ],
    keyStats: [
      { label: 'EM Anomaly', value: '2.5km long conductor' },
      { label: 'Geophysics', value: 'Granduc-like signature' },
      { label: 'Boulder Train', value: 'Anomalous Cu-Au (2022)' },
      { label: 'Drill History', value: '5 holes (2018)' }
    ],
    mineralizationType: 'Besshi-type VMS Target'
  },
  'CATSPAW': {
    elements: [
      { symbol: 'Ag', name: 'Silver', color: '#C0C0C0' },
      { symbol: 'Au', name: 'Gold', color: '#FFD700' },
      { symbol: 'Cu', name: 'Copper', color: '#B87333' }
    ],
    keyStats: [
      { label: 'Historic High Grade', value: 'Up to 1,309.7 g/t Ag' },
      { label: 'Development', value: '50m adit (1928)' },
      { label: 'Gold Values', value: 'Up to 4.25 g/t Au' },
      { label: 'Vein Structures', value: 'E-W trending' }
    ],
    mineralizationType: 'High-Grade Silver Veins'
  },
  'BIG GOLD WEST': {
    elements: [
      { symbol: 'Au', name: 'Gold', color: '#FFD700' },
      { symbol: 'Ag', name: 'Silver', color: '#C0C0C0' },
      { symbol: 'Cu', name: 'Copper', color: '#B87333' },
      { symbol: 'Zn', name: 'Zinc', color: '#7B9095' }
    ],
    keyStats: [
      { label: 'Area', value: '358.855 hectares' },
      { label: 'Location', value: 'West of Big Gold' },
      { label: 'Potential', value: 'Along strike extension' },
      { label: 'Exploration Stage', value: 'Untested' }
    ],
    mineralizationType: 'VMS Extension Target'
  }
}

export function PeriodicElement({ symbol, name, color }: PropertyElements) {
  return (
    <div 
      className="relative inline-flex flex-col items-center justify-center"
      style={{
        width: '48px',
        height: '48px',
        background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
        border: `1.5px solid ${color}`,
        borderRadius: '6px',
        boxShadow: `0 0 12px ${color}30`,
      }}
    >
      <span 
        style={{
          fontSize: '20px',
          fontWeight: 700,
          color: color,
          textShadow: `0 0 8px ${color}40`,
          fontFamily: "'Aeonik Extended', sans-serif",
        }}
      >
        {symbol}
      </span>
      <span 
        style={{
          fontSize: '8px',
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.7)',
          marginTop: '-2px',
          fontFamily: "'Switzer Variable', sans-serif",
        }}
      >
        {name}
      </span>
    </div>
  )
}