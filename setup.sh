#!/bin/bash

# EME Uno - Script de Setup Automático
# Este script instala dependencias y prepara la aplicación para desarrollo

echo "🚑 EME Uno - Setup Automático"
echo "================================"

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar Node.js
echo -e "${BLUE}📋 Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    echo "Descárgalo desde: https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v)${NC}"

# Verificar npm
echo -e "${BLUE}📋 Verificando npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm -v)${NC}"

# Crear directorio data si no existe
echo -e "${BLUE}📁 Creando directorio de datos...${NC}"
mkdir -p data
echo -e "${GREEN}✅ Directorio creado${NC}"

# Instalar dependencias
echo -e "${BLUE}📦 Instalando dependencias...${NC}"
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencias instaladas${NC}"
else
    echo -e "${RED}❌ Error instalando dependencias${NC}"
    exit 1
fi

# Crear archivo .env si no existe
echo -e "${BLUE}⚙️  Configurando variables de entorno...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ Archivo .env creado${NC}"
else
    echo -e "${GREEN}✅ Archivo .env ya existe${NC}"
fi

# Crear archivo de datos de prueba
echo -e "${BLUE}📊 Creando datos de prueba...${NC}"
cat > data/seed.sql << 'EOF'
-- Usuarios de prueba
INSERT OR IGNORE INTO usuarios (username, password, role, mobileId) VALUES ('operario1', 'pass123', 'operario', 'MOV-001');
INSERT OR IGNORE INTO usuarios (username, password, role, mobileId) VALUES ('operario2', 'pass123', 'operario', 'MOV-002');
INSERT OR IGNORE INTO usuarios (username, password, role) VALUES ('supervisor', 'pass123', 'supervisor', NULL);

-- Móviles
INSERT OR IGNORE INTO moviles (mobileId, nombre, tipo) VALUES ('MOV-001', 'Ambulancia Centro', 'ambulancia');
INSERT OR IGNORE INTO moviles (mobileId, nombre, tipo) VALUES ('MOV-002', 'Ambulancia Sur', 'ambulancia');
INSERT OR IGNORE INTO moviles (mobileId, nombre, tipo) VALUES ('MOV-003', 'Rescate Urbano', 'rescate');
EOF
echo -e "${GREEN}✅ Datos de prueba creados${NC}"

# Mostrar resumen
echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✅ Setup completado correctamente${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${BLUE}📝 Próximos pasos:${NC}"
echo ""
echo -e "${GREEN}Terminal 1 - Frontend:${NC}"
echo "  npm run dev"
echo "  → http://localhost:5173"
echo ""
echo -e "${GREEN}Terminal 2 - Backend:${NC}"
echo "  npm run server"
echo "  → http://localhost:3001"
echo ""
echo -e "${BLUE}👤 Credenciales de prueba:${NC}"
echo "  Operario: operario1 / pass123 (Móvil: MOV-001)"
echo "  Operario: operario2 / pass123 (Móvil: MOV-002)"
echo "  Supervisor: supervisor / pass123"
echo ""
echo -e "${BLUE}📖 Consulta TESTING.md para más detalles${NC}"
echo ""
