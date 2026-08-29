import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/store';
import { obtenerControles } from '../db/operations';
import { Control } from '../db/database';
import './HistorialControles.css';

const HistorialControles: React.FC<{ mobileId: string }> = ({ mobileId }) => {
  const [controles, setControles] = useState<Control[]>([]);
  const [controlSeleccionado, setControlSeleccionado] = useState<Control | null>(null);

  useEffect(() => {
    cargarControles();
  }, []);

  const cargarControles = async () => {
    const resultado = await obtenerControles(mobileId);
    if (resultado.success) {
      setControles(resultado.data.sort((a, b) => b.timestamp - a.timestamp));
    }
  };

  return (
    <div className="historial-controles">
      <h2>Historial de Controles</h2>
      <div className="historial-lista">
        {controles.length === 0 ? (
          <p className="sin-datos">No hay controles registrados</p>
        ) : (
          controles.map((control) => (
            <div
              key={control.id}
              className="control-item"
              onClick={() => setControlSeleccionado(control)}
            >
              <div className="control-fecha">{control.date}</div>
              <div className="control-usuario">{control.user}</div>
              <div className="control-sync">
                {control.sincronizado ? '✓' : '⏳'}
              </div>
            </div>
          ))
        )}
      </div>

      {controlSeleccionado && (
        <div className="detalle-control">
          <button
            className="btn-cerrar"
            onClick={() => setControlSeleccionado(null)}
          >
            ✕
          </button>
          <h3>Detalle del Control</h3>
          <div className="detalle-contenido">
            <div className="seccion">
              <h4>Equipamiento</h4>
              <div className="grid-items">
                {Object.entries(controlSeleccionado.equipamiento).map(([key, value]) => (
                  <div key={key} className={`item ${value ? 'presente' : 'faltante'}`}>
                    <span className="icono">{value ? '✓' : '✕'}</span>
                    <span>{key}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="seccion">
              <h4>Psicofármacos</h4>
              <div className="grid-items">
                {Object.entries(controlSeleccionado.psicofarmaco).map(([key, value]) => (
                  <div key={key} className="item">
                    <span className="label">{key}:</span>
                    <span className="valor">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            {controlSeleccionado.observaciones && (
              <div className="seccion">
                <h4>Observaciones</h4>
                <p>{controlSeleccionado.observaciones}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistorialControles;
