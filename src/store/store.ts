import create from 'zustand';
import { Control } from '../db/database';

interface AuthState {
  usuario: string | null;
  role: 'operario' | 'supervisor' | null;
  mobileId: string | null;
  login: (usuario: string, role: 'operario' | 'supervisor', mobileId?: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  usuario: localStorage.getItem('usuario') || null,
  role: (localStorage.getItem('role') as any) || null,
  mobileId: localStorage.getItem('mobileId') || null,
  login: (usuario: string, role: 'operario' | 'supervisor', mobileId?: string) => {
    localStorage.setItem('usuario', usuario);
    localStorage.setItem('role', role);
    if (mobileId) localStorage.setItem('mobileId', mobileId);
    set({ usuario, role, mobileId: mobileId || null });
  },
  logout: () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('role');
    localStorage.removeItem('mobileId');
    set({ usuario: null, role: null, mobileId: null });
  },
  isAuthenticated: () => {
    const state = get();
    return !!state.usuario && !!state.role;
  }
}));

interface ControlState {
  controles: Control[];
  controlActual: Partial<Control> | null;
  setControles: (controles: Control[]) => void;
  setControlActual: (control: Partial<Control> | null) => void;
  agregarEquipamiento: (key: string, value: boolean) => void;
  agregarPsicofarmaco: (key: string, value: number) => void;
}

export const useControlStore = create<ControlState>((set) => ({
  controles: [],
  controlActual: null,
  setControles: (controles: Control[]) => set({ controles }),
  setControlActual: (control: Partial<Control> | null) => set({ controlActual: control }),
  agregarEquipamiento: (key: string, value: boolean) =>
    set((state) => ({
      controlActual: {
        ...state.controlActual,
        equipamiento: {
          ...state.controlActual?.equipamiento,
          [key]: value
        }
      }
    })),
  agregarPsicofarmaco: (key: string, value: number) =>
    set((state) => ({
      controlActual: {
        ...state.controlActual,
        psicofarmaco: {
          ...state.controlActual?.psicofarmaco,
          [key]: value
        }
      }
    }))
}));
