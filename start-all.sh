#!/bin/bash

# Script para iniciar frontend y backend automáticamente
# Uso: bash start-all.sh

echo "🚑 Iniciando EME Uno (Frontend + Backend)..."
echo ""

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "🛑 Deteniendo aplicaciones..."
    kill $FRONTEND_PID $BACKEND_PID 2>/dev/null
    exit
}

# Capturar Ctrl+C
trap cleanup SIGINT

# Iniciar Frontend
echo "🌐 Iniciando Frontend (React)..."
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend en http://localhost:5173 (PID: $FRONTEND_PID)"
echo ""

# Esperar a que el frontend inicie
sleep 3

# Iniciar Backend
echo "🖥️  Iniciando Backend (Node.js)..."
npm run server &
BACKEND_PID=$!
echo "✅ Backend en http://localhost:3001 (PID: $BACKEND_PID)"
echo ""

echo "✅ Ambas aplicaciones iniciadas"
echo ""
echo "📝 Logs:"
echo "  Frontend: http://localhost:5173"
echo "  Backend: http://localhost:3001"
echo ""
echo "🛑 Presiona Ctrl+C para detener"
echo ""

# Esperar a que terminen
wait
