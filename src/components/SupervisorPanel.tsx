import React, { useEffect, useState } from 'react';
import { obtenerControles } from '../db/operations';
import { Control } from '../db/database';
import './SupervisorPanel.css';

const SupervisorPanel: React.FC = () => {
  const [controles, setControles] = useState<Control[]>([]);
  const [filtroMovil, setFiltroMovil] = useState('');
  const [moviles, setMoviles] = useState<string[]>([]);

  useEffect(() => {
    cargarControles();
    const intervalo = setInterval(cargarControles, 5000);
    return () => clearInterval(intervalo);
  }, []);

  const cargarControles = async () => {
    const resultado = await obtenerControles();
    if (resultado.success) {
      setControles(resultado.data);
      const movilesUnicos = [...new Set(resultado.data.map(c => c.mobileId))];
      setMoviles(movilesUnicos as string[]);
    }
  };

  const controlesFilterados = filtroMovil
    ? controles.filter(c => c.mobileId === filtroMovil)
    : controles;

  const resumenPorMovil = moviles.map(movilId => {
    const controlesMovil = controles.filter(c => c.mobileId === movilId);
    const ultimoControl = controlesMovil[controlesMovil.length - 1];
    return {
      movilId,
      ultimoControl,
      totalControles: controlesMovil.length
    };
  });

  return (
    <div className="supervisor-panel">
      <div className="panel-header">
        <h1>🚑 Panel de Supervisión EME UNO</h1>
        <p>Monitoreo en tiempo real de todos los móviles</p>
      </div>

      <div className="resumen-moviles">
        <h2>Estado de Móviles</h2>
        <div className="moviles-grid">
          {resumenPorMovil.map(({ movilId, ultimoControl, totalControles }) => (
            <div
              key={movilId}
              className="movil-card"
              onClick={() => setFiltroMovil(movilId === filtroMovil ? '' : movilId)}
            >
              <div className="movil-id">{movilId}</div>
              <div className="movil-info">
                <p><strong>Controles:</strong> {totalControles}</p>
                {ultimoControl && (
                  <p><strong>Último:</strong> {ultimoControl.date}</p>
                )}
              </div>
              <div className={`status-badge ${ultimoControl ? 'activo' : 'inactivo'}`}>
                {ultimoControl ? '✓' : '⚠'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="controles-lista">
        <h2>Historial de Controles {filtroMovil && `- ${filtroMovil}`}</h2>
        {filtroMovil && (
          <button className="btn-limpiar-filtro" onClick={() => setFiltroMovil('')}>
            Limpiar filtro
          </button>
        )}
        <div className="tabla-controles">
          {controlesFilterados.length === 0 ? (
            <p className="sin-datos">Sin controles registrados</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Móvil</th>
                  <th>Fecha</th>
                  <th>Usuario</th>
                  <th>Equipamiento</th>
                  <th>Psicofármacos</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {controlesFilterados.map((control) => {
                  const equipCompletado = Object.values(control.equipamiento).filter(v => v).length;
                  const psicofarmaco = Object.values(control.psicofarmaco).filter(v => v > 0).length;
                  return (
                    <tr key={control.id}>
                      <td><strong>{control.mobileId}</strong></td>
                      <td>{control.date}</td>
                      <td>{control.user}</td>
                      <td>{equipCompletado}/7</td>
                      <td>{psicofarmaco}/11</td>
                      <td>
                        <span className={`status ${control.sincronizado ? 'sincronizado' : 'pendiente'}`}>
                          {control.sincronizado ? '✓ Sincronizado' : '⏳ Pendiente'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupervisorPanel;
