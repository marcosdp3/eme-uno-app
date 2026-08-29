import express, { Request, Response } from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Base de datos SQLite
const dbPath = path.join(__dirname, '..', 'data', 'eme-uno.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
  } else {
    console.log('Conectado a SQLite');
    inicializarDB();
  }
});

// Inicializar base de datos
function inicializarDB() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS controles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mobileId TEXT NOT NULL,
        date TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        user TEXT NOT NULL,
        role TEXT NOT NULL,
        equipamiento TEXT NOT NULL,
        psicofarmaco TEXT NOT NULL,
        observaciones TEXT,
        sincronizado INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS moviles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mobileId TEXT UNIQUE NOT NULL,
        nombre TEXT,
        tipo TEXT,
        activo INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        mobileId TEXT,
        activo INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });
}

// Rutas de Controles
app.post('/api/controles', (req: Request, res: Response) => {
  const { mobileId, date, timestamp, user, role, equipamiento, psicofarmaco, observaciones } = req.body;

  const stmt = db.prepare(`
    INSERT INTO controles (mobileId, date, timestamp, user, role, equipamiento, psicofarmaco, observaciones)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    mobileId,
    date,
    timestamp,
    user,
    role,
    JSON.stringify(equipamiento),
    JSON.stringify(psicofarmaco),
    observaciones,
    (err: any) => {
      if (err) {
        console.error('Error guardando control:', err);
        res.status(500).json({ error: 'Error guardando control' });
      } else {
        res.status(201).json({ success: true });
      }
    }
  );
  stmt.finalize();
});

app.get('/api/controles', (req: Request, res: Response) => {
  const mobileId = req.query.mobileId as string;
  let query = 'SELECT * FROM controles ORDER BY timestamp DESC';
  const params: any[] = [];

  if (mobileId) {
    query = 'SELECT * FROM controles WHERE mobileId = ? ORDER BY timestamp DESC';
    params.push(mobileId);
  }

  db.all(query, params, (err: any, rows: any[]) => {
    if (err) {
      console.error('Error obteniendo controles:', err);
      res.status(500).json({ error: 'Error obteniendo controles' });
    } else {
      const controlesConParse = (rows || []).map((row) => ({
        ...row,
        equipamiento: JSON.parse(row.equipamiento),
        psicofarmaco: JSON.parse(row.psicofarmaco)
      }));
      res.json(controlesConParse);
    }
  });
});

app.get('/api/controles/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.get('SELECT * FROM controles WHERE id = ?', [id], (err: any, row: any) => {
    if (err) {
      console.error('Error obteniendo control:', err);
      res.status(500).json({ error: 'Error obteniendo control' });
    } else if (!row) {
      res.status(404).json({ error: 'Control no encontrado' });
    } else {
      res.json({
        ...row,
        equipamiento: JSON.parse(row.equipamiento),
        psicofarmaco: JSON.parse(row.psicofarmaco)
      });
    }
  });
});

// Rutas de Móviles
app.get('/api/moviles', (req: Request, res: Response) => {
  db.all('SELECT * FROM moviles WHERE activo = 1 ORDER BY nombre', (err: any, rows: any[]) => {
    if (err) {
      console.error('Error obteniendo móviles:', err);
      res.status(500).json({ error: 'Error obteniendo móviles' });
    } else {
      res.json(rows || []);
    }
  });
});

app.post('/api/moviles', (req: Request, res: Response) => {
  const { mobileId, nombre, tipo } = req.body;

  const stmt = db.prepare(`
    INSERT INTO moviles (mobileId, nombre, tipo)
    VALUES (?, ?, ?)
  `);

  stmt.run(mobileId, nombre, tipo, (err: any) => {
    if (err) {
      console.error('Error creando móvil:', err);
      res.status(500).json({ error: 'Error creando móvil' });
    } else {
      res.status(201).json({ success: true });
    }
  });
  stmt.finalize();
});

// Rutas de Usuarios
app.post('/api/usuarios', (req: Request, res: Response) => {
  const { username, password, role, mobileId } = req.body;

  const stmt = db.prepare(`
    INSERT INTO usuarios (username, password, role, mobileId)
    VALUES (?, ?, ?, ?)
  `);

  stmt.run(username, password, role, mobileId || null, (err: any) => {
    if (err) {
      console.error('Error creando usuario:', err);
      res.status(500).json({ error: 'Error creando usuario' });
    } else {
      res.status(201).json({ success: true });
    }
  });
  stmt.finalize();
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor EME Uno corriendo en http://localhost:${PORT}`);
});

export default app;
