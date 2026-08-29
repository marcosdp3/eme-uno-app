import axios from 'axios';
import { db, Control } from '../db/database';
import { obtenerControlesPendientes, marcarComoSincronizado } from '../db/operations';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export async function sincronizarControles() {
  try {
    // Obtener controles pendientes
    const resultado = await obtenerControlesPendientes();
    if (!resultado.success || resultado.data.length === 0) {
      return { success: true, sincronizados: 0 };
    }

    // Enviar controles al servidor
    for (const control of resultado.data) {
      try {
        await axios.post(`${API_BASE_URL}/controles`, control);
        // Marcar como sincronizado
        if (control.id) {
          await marcarComoSincronizado(control.id);
        }
      } catch (error) {
        console.error('Error sincronizando control:', error);
      }
    }

    return { success: true, sincronizados: resultado.data.length };
  } catch (error) {
    console.error('Error en sincronización:', error);
    return { success: false, error };
  }
}

export async function descargarControles() {
  try {
    const response = await axios.get(`${API_BASE_URL}/controles`);
    if (response.data && Array.isArray(response.data)) {
      // Guardar en base de datos local
      for (const control of response.data) {
        await db.controles.put({
          ...control,
          sincronizado: true
        });
      }
      return { success: true, descargados: response.data.length };
    }
    return { success: false };
  } catch (error) {
    console.error('Error descargando controles:', error);
    return { success: false, error };
  }
}
