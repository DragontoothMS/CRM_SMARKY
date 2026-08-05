@echo off
title Smarky CRM - Servidor
cd /d "%~dp0"
echo ========================================
echo  Iniciando Smarky CRM
echo  Puerto: 3000
echo ========================================
echo.

echo [1/2] Liberando puerto 3000...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/2] Iniciando servidor...
echo.
echo URL: http://localhost:3000
echo Para detener: Ctrl+C en esta ventana
echo ========================================
echo.

npx next dev -p 3000

pause