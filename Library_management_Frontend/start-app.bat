@echo off
title Book Library Frontend
color 0A

cls
echo ========================================
echo    📚 BOOK LIBRARY FRONTEND LAUNCHER
echo ========================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo Please download from: https://nodejs.org
    pause
    exit /b
)

:: Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies (first time setup)...
    echo This may take a few minutes...
    echo.
    call npm install
)

:: Display menu
echo Select environment:
echo.
echo [1] Development (Local Backend - http://localhost:8080)
echo [2] Production (EC2 Backend - You'll enter IP)
echo [3] Exit
echo.

set /p choice="Enter choice (1-3): "

if "%choice%"=="1" goto dev
if "%choice%"=="2" goto prod
if "%choice%"=="3" goto end
echo Invalid choice!
pause
goto end

:dev
echo.
echo 🚀 Starting in DEVELOPMENT mode...
echo API: http://localhost:8080
echo.
echo Make sure your backend is running!
echo.
pause
set REACT_APP_API_URL=http://localhost:8080/api
npm start
goto end

:prod
echo.
echo Enter your EC2 Public IP address:
set /p ec2_ip="IP: "
echo.
echo 🚀 Starting in PRODUCTION mode...
echo API: http://%ec2_ip%:8080
echo.
pause
set REACT_APP_API_URL=http://%ec2_ip%:8080/api
npm start
goto end

:end
pause