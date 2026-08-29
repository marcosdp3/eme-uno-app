import React, { useState } from 'react';
import { useControlStore } from '../store/store';
import { guardarControl } from '../db/operations';
import './ControlForm.css';

const ControlForm: React.FC<{ mobileId: string; usuario: string }> = ({ mobileId, usuario }) => {
  const { controlActual, agregarEquipamiento, agregarPsicofarmaco, setControlActual } = useControlStore();
  const [observaciones, setObservaciones] = useState('');
  const [enviado, setEnviado] = useState(false);

  const psicofarmacosLista = [
    { key: 'diazepamComprimidos', label: 'Diazepam Comprimidos' },
    { key: 'diazepamIntravenoso', label: 'Diazepam Intravenoso' },
    { key: 'morfina', label: 'Morfina' },
    { key: 'dormicum', label: 'Dormicum' },
    { key: 'haloperidol', label: 'Haloperidol' },
    { key: 'fentanilo', label: 'Fentanilo' },
    { key: 'tramadol', label: 'Tramadol' },
    { key: 'flumasenil', label: 'Flumasenil' },
    { key: 'fenbarbital', label: 'Fenbarbital' },
    { key: 'naloxona', label: 'Naloxona' },
    { key: 'propofol', label: 'Propofol' }
  ];

  const handleSubmit = async () => {
    const control = {
      mobileId,
      date: new Date().toLocaleDateString('es-AR'),
      timestamp: Date.now(),
      user: usuario,
      role: 'operario' as const,
      equipamiento: controlActual?.equipamiento || {},
      psicofarmaco: controlActual?.psicofarmaco || {},
      observaciones,
      sincronizado: false
    };

    const resultado = await guardarControl(control);
    if (resultado.success) {
      setEnviado(true);
      setControlActual(null);
      setObservaciones('');
      setTimeout(() => setEnviado(false), 3000);
    }
  };

  return (
    <div className="control-form">
      <h2>Checklist de Equipamiento</h2>
      <div className="form-section">
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={controlActual?.equipamiento?.bolsoParo || false}
              onChange={(e) => agregarEquipamiento('bolsoParo', e.target.checked)}
            />
            Bolso de Paro
          </label>
          <label>
            <input
              type="checkbox"
              checked={controlActual?.equipamiento?.bolsoDomicilio || false}
              onChange={(e) => agregarEquipamiento('bolsoDomicilio', e.target.checked)}
            />
            Bolso Domicilio
          </label>
          <label>
            <input
              type="checkbox"
              checked={controlActual?.equipamiento?.ecg || false}
              onChange={(e) => agregarEquipamiento('ecg', e.target.checked)}
            />
            ECG
          </label>
          <label>
            <input
              type="checkbox"
              checked={controlActual?.equipamiento?.cardiodesfibrilador || false}
              onChange={(e) => agregarEquipamiento('cardiodesfibrilador', e.target.checked)}
            />
            Cardiodesfibrilador
          </label>
          <label>
            <input
              type="checkbox"
              checked={controlActual?.equipamiento?.bolsoCuraciones || false}
              onChange={(e) => agregarEquipamiento('bolsoCuraciones', e.target.checked)}
            />
            Bolso de Curaciones
          </label>
          <label>
            <input
              type="checkbox"
              checked={controlActual?.equipamiento?.minerva || false}
              onChange={(e) => agregarEquipamiento('minerva', e.target.checked)}
            />
            Minerva
          </label>
          <label>
            <input
              type="checkbox"
              checked={controlActual?.equipamiento?.tabla || false}
              onChange={(e) => agregarEquipamiento('tabla', e.target.checked)}
            />
            Tabla
          </label>
        </div>
      </div>

      <h2>Control de Psicofármacos</h2>
      <div className="form-section">
        <div className="input-grid">
          {psicofarmacosLista.map(({ key, label }) => (
            <div key={key} className="input-group">
              <label>{label}</label>
              <input
                type="number"
                min="0"
                value={controlActual?.psicofarmaco?.[key as keyof typeof controlActual.psicofarmaco] || ''}
                onChange={(e) => agregarPsicofarmaco(key, parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="form-section">
        <label>Observaciones</label>
        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Agrega observaciones si es necesario..."
          rows={4}
        />
      </div>

      {enviado && <div className="success-message">✅ Control guardado correctamente</div>}
      <button onClick={handleSubmit} className="btn-submit">Guardar Control</button>
    </div>
  );
};

export default ControlForm;
