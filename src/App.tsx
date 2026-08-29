import React, { useEffect } from 'react';
import { useAuthStore, useControlStore } from './store/store';
import Login from './components/Login';
import ControlForm from './components/ControlForm';
import SupervisorPanel from './components/SupervisorPanel';
import HistorialControles from './components/HistorialControles';
import './App.css';

const App: React.FC = () => {
  const { usuario, role, mobileId, isAuthenticated, logout } = useAuthStore();
  const { setControlActual } = useControlStore();

  useEffect(() => {
    setControlActual({
      equipamiento: {
        bolsoParo: false,
        bolsoDomicilio: false,
        ecg: false,
        cardiodesfibrilador: false,
        bolsoCuraciones: false,
        minerva: false,
        tabla: false
      },
      psicofarmaco: {
        diazepamComprimidos: 0,
        diazepamIntravenoso: 0,
        morfina: 0,
        dormicum: 0,
        haloperidol: 0,
        fentanilo: 0,
        tramadol: 0,
        flumasenil: 0,
        fenbarbital: 0,
        naloxona: 0,
        propofol: 0
      }
    });
  }, []);

  if (!isAuthenticated()) {
    return <Login />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🚑 EME UNO</h1>
          {role === 'operario' && <p className="subtitle">Móvil: {mobileId}</p>}
          {role === 'supervisor' && <p className="subtitle">Panel de Supervisión</p>}
        </div>
        <button onClick={logout} className="btn-logout">
          Cerrar Sesión
        </button>
      </header>

      <main className="app-main">
        {role === 'operario' && usuario && mobileId && (
          <div className="operario-view">
            <ControlForm mobileId={mobileId} usuario={usuario} />
            <HistorialControles mobileId={mobileId} />
          </div>
        )}
        {role === 'supervisor' && (
          <SupervisorPanel />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2024 EME UNO - Control de Equipamiento y Psicofármacos</p>
      </footer>
    </div>
  );
};

export default App;
