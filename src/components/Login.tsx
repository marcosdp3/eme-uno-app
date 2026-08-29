import React, { useState } from 'react';
import { useAuthStore } from '../store/store';
import './Login.css';

const Login: React.FC = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'operario' | 'supervisor'>('operario');
  const [mobileId, setMobileId] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario || !password) {
      setError('Usuario y contraseña son requeridos');
      return;
    }
    if (role === 'operario' && !mobileId) {
      setError('ID del móvil es requerido para operarios');
      return;
    }
    login(usuario, role, mobileId);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🚑 EME UNO</h1>
          <p>Control de Equipamiento y Psicofármacos</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Usuario</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Ingresa tu usuario"
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
            />
          </div>
          <div className="form-group">
            <label>Tipo de Usuario</label>
            <select value={role} onChange={(e) => setRole(e.target.value as any)}>
              <option value="operario">Operario (Móvil)</option>
              <option value="supervisor">Supervisor</option>
            </select>
          </div>
          {role === 'operario' && (
            <div className="form-group">
              <label>ID del Móvil</label>
              <input
                type="text"
                value={mobileId}
                onChange={(e) => setMobileId(e.target.value)}
                placeholder="Ej: MOV-001"
              />
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn-login">Ingresar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
