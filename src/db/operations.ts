import { db, Control } from './database';

export async function guardarControl(control: Omit<Control, 'id'>) {
  try {
    const id = await db.controles.add(control);
    return { success: true, id };
  } catch (error) {
    console.error('Error guardando control:', error);
    return { success: false, error };
  }
}

export async function obtenerControles(mobileId?: string) {
  try {
    let controles;
    if (mobileId) {
      controles = await db.controles.where('mobileId').equals(mobileId).toArray();
    } else {
      controles = await db.controles.toArray();
    }
    return { success: true, data: controles };
  } catch (error) {
    console.error('Error obteniendo controles:', error);
    return { success: false, error };
  }
}

export async function obtenerControlesPendientes() {
  try {
    const controles = await db.controles.where('sincronizado').equals(false).toArray();
    return { success: true, data: controles };
  } catch (error) {
    console.error('Error obteniendo controles pendientes:', error);
    return { success: false, error };
  }
}

export async function marcarComoSincronizado(controlId: number) {
  try {
    await db.controles.update(controlId, { sincronizado: true });
    return { success: true };
  } catch (error) {
    console.error('Error marcando como sincronizado:', error);
    return { success: false, error };
  }
}
