# EME Uno - Aplicación de Control de Emergencia

## 🚑 Descripción

EME Uno es una aplicación progresiva (PWA) diseñada para facilitar el control de equipamiento y psicofármacos en móviles de emergencia médica. Funciona tanto en dispositivos móviles como en computadoras, con y sin conexión a internet.

## ✨ Características

### Para Operarios (Móvil)
- ✅ Checklist de equipamiento (Bolsos, ECG, Cardiodesfibrilador, etc)
- ✅ Control de cantidad de psicofármacos
- ✅ Registro de observaciones
- ✅ Historial local de controles
- ✅ Funciona sin internet (sincroniza automáticamente)

### Para Supervisores
- 📊 Panel en tiempo real de todos los móviles
- 📱 Estado de cada móvil (activo/inactivo)
- 📋 Historial completo de controles
- 🔔 Identificación de faltantes
- ⏰ Seguimiento de actividad

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **Base de Datos Local**: Dexie.js (IndexedDB)
- **Estado Global**: Zustand
- **Backend**: Node.js + Express + SQLite
- **PWA**: Service Worker + Vite PWA Plugin
- **Estilos**: CSS3 con variables personalizadas

## 📦 Instalación

### Requisitos
- Node.js 16+
- npm o yarn

### Setup

```bash
# Clonar repositorio
git clone https://github.com/marcosdp3/eme-uno-app.git
cd eme-uno-app

# Instalar dependencias
npm install

# Compilar TypeScript del servidor
npm run build
```

## 🚀 Ejecución

### Desarrollo (Frontend + Backend)

```bash
# Terminal 1: Frontend (http://localhost:5173)
npm run dev

# Terminal 2: Backend (http://localhost:3001)
npm run server
```

### Producción

```bash
npm run build
npm start
```

## 📋 Checklist de Equipamiento

1. Bolso de Paro
2. Bolso Domicilio
3. ECG
4. Cardiodesfibrilador
5. Bolso de Curaciones
6. Minerva
7. Tabla

## 💊 Psicofármacos Controlados

1. Diazepam Comprimidos
2. Diazepam Intravenoso
3. Morfina
4. Dormicum
5. Haloperidol
6. Fentanilo
7. Tramadol
8. Flumasenil
9. Fenbarbital
10. Naloxona
11. Propofol

## 👥 Roles

### Operario
- Accede con su usuario y contraseña
- Selecciona su móvil
- Realiza controles diarios
- Ve su historial local

### Supervisor
- Accede con usuario supervisor
- Ve panel de todos los móviles
- Monitorea en tiempo real
- Recibe alertas de faltantes

## 🔄 Sincronización

La aplicación sincroniza automáticamente cuando:
- Hay conexión a internet
- Se completa un nuevo control
- Se abre la aplicación (después de estar offline)

Estado de sincronización:
- ✅ Sincronizado
- ⏳ Pendiente (sin conexión)

## 📱 Offline-First

- Todos los datos se guardan localmente primero
- Funciona sin internet gracias al Service Worker
- Sincroniza en background cuando hay conexión
- Nunca se pierden datos

## 🎨 Interfaz

- Color principal: Azul EME Uno (#0066CC)
- Responsive: Móvil, Tablet, Escritorio
- Accesible: WCAG AA
- Dark mode ready

## 📊 API Endpoints

### Controles
- `POST /api/controles` - Crear control
- `GET /api/controles` - Obtener todos
- `GET /api/controles?mobileId=X` - Por móvil
- `GET /api/controles/:id` - Obtener uno

### Móviles
- `GET /api/moviles` - Listar móviles
- `POST /api/moviles` - Crear móvil

### Usuarios
- `POST /api/usuarios` - Crear usuario

### Health
- `GET /api/health` - Estado del servidor

## 🔐 Seguridad

- Autenticación local (implementar JWT en producción)
- Contraseñas hasheadas (implementar bcrypt en producción)
- CORS habilitado
- Variables de entorno para configuración sensible

## 📈 Roadmap Futuro

- [ ] Autenticación JWT
- [ ] QR por móvil
- [ ] Firmas digitales
- [ ] Alertas push
- [ ] Reportes PDF
- [ ] Integración con base de datos centralizada
- [ ] Geolocalización de móviles
- [ ] Notificaciones en tiempo real
- [ ] Auditoría de cambios

## 📝 Licencia

MIT

## 👨‍💻 Autor

Marcos DP - marcosdp3@gmail.com

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

**EME Uno** - *Control de Equipamiento y Psicofármacos en Móviles de Emergencia* 🚑🔵
