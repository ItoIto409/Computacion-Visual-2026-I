import React from 'react';

interface ControlPanelProps {
  viewMode: 'faces' | 'edges' | 'vertices' | 'wireframe';
  onViewModeChange: (mode: 'faces' | 'edges' | 'vertices' | 'wireframe') => void;
  modelInfo: {
    vertices: number;
    faces: number;
    edges: number;
  } | null;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  viewMode, 
  onViewModeChange, 
  modelInfo 
}) => {
  return (
    <div className="control-panel">
      <h2>Controles de Visualización</h2>
      
      <div className="view-modes">
        <h3>Modo de Vista</h3>
        <div className="button-group">
          <button
            className={viewMode === 'faces' ? 'active' : ''}
            onClick={() => onViewModeChange('faces')}
          >
            🔷 Caras
          </button>
          <button
            className={viewMode === 'edges' ? 'active' : ''}
            onClick={() => onViewModeChange('edges')}
          >
            📐 Aristas
          </button>
          <button
            className={viewMode === 'vertices' ? 'active' : ''}
            onClick={() => onViewModeChange('vertices')}
          >
            ⚫ Vértices
          </button>
          <button
            className={viewMode === 'wireframe' ? 'active' : ''}
            onClick={() => onViewModeChange('wireframe')}
          >
            🕸️ Wireframe
          </button>
        </div>
      </div>

      {modelInfo && (
        <div className="model-info">
          <h3>Información del Modelo</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Vértices:</span>
              <span className="value">{modelInfo.vertices.toLocaleString()}</span>
            </div>
            <div className="info-item">
              <span className="label">Caras:</span>
              <span className="value">{modelInfo.faces.toLocaleString()}</span>
            </div>
            <div className="info-item">
              <span className="label">Aristas:</span>
              <span className="value">{modelInfo.edges.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      <div className="instructions">
        <h3>Instrucciones</h3>
        <ul>
          <li>🖱️ Click + Arrastrar: Rotar cámara</li>
          <li>🖱️ Rueda: Zoom in/out</li>
          <li>🖱️ Click derecho + Arrastrar: Mover (pan)</li>
        </ul>
      </div>
    </div>
  );
};

export default ControlPanel;
