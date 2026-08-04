@echo off
title Smarky CRM - Servidor
cd /d "%~dp0"
echo ========================================
echo  Iniciando Smarky CRM
echo  Puerto: 3000
echo ========================================
echo.

echo [1/4] Verificando dependencias...
if not exist node_modules (
    echo      Instalando dependencias (primera vez)... 
    npm install
    if errorlevel 1 (
        echo ERROR: Fallo en npm install
        pause
        exit /b 1
    )
) else (
    echo      node_modules ya existe
)

echo [2/4] Verificando configuración...
if not exist .env (
    if exist .env.example (
        echo      .env no encontrado, creando desde .env.example...
        copy .env.example .env >nul
        echo.
        echo      !!! IMPORTANTE: Edita .env con tus credenciales de Kapso !!!
        echo      KAPSO_API_KEY=tu_api_key
        echo      PHONE_NUMBER_ID=tu_phone_number_id
        echo      WABA_ID=tu_waba_id
        echo.
        pause
    ) else (
        echo ERROR: No existe .env.example
        pause
        exit /b 1
    )
) else (
    echo      .env encontrado
)

echo [3/4] Liberando puerto 3000...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [4/4] Iniciando servidor...
echo.
echo URL: http://localhost:3000
echo Para detener: Ctrl+C en esta ventana
echo ========================================
echo.

npx next dev -p 3000

pause