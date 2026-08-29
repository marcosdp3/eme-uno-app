# 🚑 EME Uno - Guía de Testing

## 📋 Requisitos Previos

- Node.js 16+ instalado
- npm instalado
- Git instalado
- Puerto 5173 disponible (Frontend)
- Puerto 3001 disponible (Backend)

## ⚡ Setup Rápido (1 minuto)

### Windows:
```bash
bash setup.sh
```

### macOS/Linux:
```bash
chmod +x setup.sh
./setup.sh
```

Esto va a:
1. ✅ Verificar Node.js y npm
2. ✅ Instalar todas las dependencias
3. ✅ Crear directorio de datos
4. ✅ Configurar variables de entorno
5. ✅ Crear datos de prueba

## 🚀 Iniciar la Aplicación

### Terminal 1 - Frontend (React)
```bash
npm run dev
```

Debería ver:
```
  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Terminal 2 - Backend (Node.js)
```bash
npm run server
```

Debería ver:
```
✅ Servidor EME Uno corriendo en http://localhost:3001
```

## 👤 Credenciales de Prueba

### 1️⃣ Operario (Móvil MOV-001)
- **Usuario**: `operario1`
- **Contraseña**: `pass123`
- **ID Móvil**: `MOV-001`
- **Descripción**: Ambulancia Centro

### 2️⃣ Operario (Móvil MOV-002)
- **Usuario**: `operario2`
- **Contraseña**: `pass123`
- **ID Móvil**: `MOV-002`
- **Descripción**: Ambulancia Sur

### 3️⃣ Supervisor
- **Usuario**: `supervisor`
- **Contraseña**: `pass123`
- **Rol**: Supervisor (ve todos los móviles)

## 🧪 Plan de Testing

### Escenario 1: Crear Control como Operario

1. Abre http://localhost:5173
2. Login con `operario1` / `pass123`
3. Selecciona Móvil: `MOV-001`
4. **Checklist de Equipamiento**:
   - ☑️ Bolso de Paro
   - ☑️ Bolso Domicilio
   - ☑️ ECG
   - ☑️ Cardiodesfibrilador
   - ☑️ Bolso de Curaciones
   - ☐ Minerva (sin marcar)
   - ☐ Tabla (sin marcar)
5. **Psicofármacos** (ingresa cantidades):
   - Diazepam Comprimidos: 5
   - Diazepam Intravenoso: 3
   - Morfina: 2
   - Dormicum: 4
   - Haloperidol: 2
   - Fentanilo: 1
   - Tramadol: 3
   - Flumasenil: 1
   - Fenbarbital: 0
   - Naloxona: 2
   - Propofol: 1
6. **Observaciones**: "Control realizado correctamente"
7. Click en **"Guardar Control"**
8. ✅ Debería ver: "✅ Control guardado correctamente"

### Escenario 2: Verificar Historial Local

1. En la pestaña de **Historial de Controles** (derecha)
2. Debería ver el control que acabas de crear
3. Click en el control para ver detalles
4. Verifica que todos los datos sean correctos
5. Cierra el modal

### Escenario 3: Panel de Supervisor

1. Logout (botón arriba a la derecha)
2. Login con `supervisor` / `pass123`
3. Deberías ver el **Panel de Supervisión**
4. Verifica que aparezcan las tarjetas de móviles:
   - MOV-001 ✅ (con datos del control que creaste)
   - MOV-002 ⚠️ (sin controles aún)
5. Click en una tarjeta para filtrar y ver sus controles
6. Verifica el control que creamos aparezca en la tabla
7. Columnas a verificar:
   - Móvil: MOV-001
   - Fecha: (día actual)
   - Usuario: operario1
   - Equipamiento: 5/7 (5 items marcados)
   - Psicofármacos: 10/11 (10 con cantidad > 0)
   - Estado: ⏳ Pendiente (si el backend no está sincronizado) o ✅ Sincronizado

### Escenario 4: Crear Segundo Control

1. Logout del Supervisor
2. Login con `operario2` / `pass123`
3. Crear un control diferente:
   - Equipamiento: marca todos excepto "Bolso Paro"
   - Psicofármacos: cantidades diferentes
   - Observaciones: "Control MOV-002"
4. Guardar
5. Volver al Supervisor
6. Debería ver ambos móviles con sus respectivos controles

### Escenario 5: Sincronización Offline

1. Como Operario, crea un control
2. Antes de guardar, **desconecta el wifi/internet**
3. Click en "Guardar Control"
4. ✅ Debería guardarse localmente (IndexedDB)
5. Estado: "⏳ Pendiente"
6. **Vuelve a conectar internet**
7. El control debería sincronizarse automáticamente
8. En el Supervisor, deberías ver el control "✅ Sincronizado"

## ✅ Checklist de Validación

### Frontend
- [ ] Login funciona con credenciales correctas
- [ ] Login rechaza credenciales incorrectas
- [ ] Operario ve su móvil asignado
- [ ] Checklist de equipamiento guarda correctamente
- [ ] Control de psicofármacos guarda cantidades
- [ ] Historial muestra controles guardados
- [ ] Modal de detalles muestra datos completos
- [ ] Logout borra sesión y vuelve al login

### Supervisor
- [ ] Panel muestra todos los móviles
- [ ] Tarjeta de móvil muestra último control
- [ ] Tabla muestra controles de todos los móviles
- [ ] Filtro por móvil funciona
- [ ] Estado de sincronización es correcto
- [ ] Cantidades de equipamiento y psicofármacos son correctas

### Backend
- [ ] Servidor inicia sin errores
- [ ] GET /api/health responde OK
- [ ] POST /api/controles guarda datos
- [ ] GET /api/controles devuelve datos guardados
- [ ] Base de datos SQLite se crea correctamente
- [ ] Datos de prueba se insertan

### Base de Datos
- [ ] Archivo eme-uno.db se crea en carpeta data/
- [ ] Tablas (controles, moviles, usuarios) existen
- [ ] Datos de prueba están presentes
- [ ] Controles nuevos se guardan correctamente

### Offline
- [ ] IndexedDB guarda controles localmente
- [ ] Control se muestra en historial sin conexión
- [ ] Service Worker cachea assets
- [ ] Sincronización ocurre cuando hay conexión
- [ ] Estado cambia a "Sincronizado"

## 🐛 Troubleshooting

### Puerto 5173 ya está en uso
```bash
# Usa otro puerto
npm run dev -- --port 5174
```

### Puerto 3001 ya está en uso
```bash
# Edita src/server/index.ts y cambia PORT
const PORT = process.env.PORT || 3002;
```

### Error: "Cannot find module..."
```bash
# Borra node_modules y reinstala
rm -rf node_modules
npm install
```

### Base de datos no se crea
```bash
# Verifica que exista la carpeta data/
mkdir -p data
```

### CORS errors
```bash
# Verifica que el backend esté corriendo en http://localhost:3001
# Verifica que VITE_API_URL en .env sea correcto
```

## 📊 Análisis de Resultados

### Esperado después de completar todos los escenarios:

1. **Base de datos SQLite** tendrá:
   - 3 usuarios (2 operarios + 1 supervisor)
   - 3 móviles
   - Al menos 2 controles (1 por operario)

2. **IndexedDB (navegador)** tendrá:
   - Todos los controles sincronizados
   - Estado de sincronización correcto

3. **API funcionará**:
   - Crear controles
   - Recuperar controles
   - Filtrar por móvil

4. **UI será fluida**:
   - Sin lag en formularios
   - Carga rápida de datos
   - Transiciones suaves

## 🎯 Próximos Steps

Una vez que todo funcione:

1. ✅ Documenta cualquier bug encontrado
2. ✅ Prueba en diferentes navegadores
3. ✅ Prueba en móviles (iPhone, Android)
4. ✅ Prueba con lenta conexión (DevTools Network throttling)
5. ✅ Prueba desactivando JavaScript (Service Worker debe funcionar)

## 📞 Soporte

Si encuentras errores:
1. Comparte el error completo
2. Indica qué paso estabas haciendo
3. Comparte tu navegador y sistema operativo
4. Adjunta logs de la consola (F12 → Console)

---

**¡A testear!** 🚀
