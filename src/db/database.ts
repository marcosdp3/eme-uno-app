import Dexie, { Table } from 'dexie';

export interface Control {
  id?: number;
  mobileId: string;
  date: string;
  timestamp: number;
  user: string;
  role: 'operario' | 'supervisor';
  equipamiento: {
    bolsoParo: boolean;
    bolsoDomicilio: boolean;
    ecg: boolean;
    cardiodesfibrilador: boolean;
    bolsoCuraciones: boolean;
    minerva: boolean;
    tabla: boolean;
  };
  psicofarmaco: {
    diazepamComprimidos: number;
    diazepamIntravenoso: number;
    morfina: number;
    dormicum: number;
    haloperidol: number;
    fentanilo: number;
    tramadol: number;
    flumasenil: number;
    fenbarbital: number;
    naloxona: number;
    propofol: number;
  };
  observaciones: string;
  sincronizado: boolean;
}

export interface Movil {
  id?: number;
  mobileId: string;
  nombre: string;
  tipo: string;
  createdAt: number;
}

export interface Usuario {
  id?: number;
  username: string;
  password: string;
  role: 'operario' | 'supervisor';
  mobileId?: string;
  createdAt: number;
}

export class EmeDexie extends Dexie {
  controles!: Table<Control>;
  moviles!: Table<Movil>;
  usuarios!: Table<Usuario>;

  constructor() {
    super('EmeTUnoDb');
    this.version(1).stores({
      controles: '++id, mobileId, date, timestamp',
      moviles: '++id, mobileId',
      usuarios: '++id, username'
    });
  }
}

export const db = new EmeDexie();
