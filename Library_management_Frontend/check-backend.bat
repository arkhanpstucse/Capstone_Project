@echo off
echo ========================================
echo    🔍 BACKEND CONNECTION TEST
echo ========================================
echo.

echo Testing connection to backend...
echo.

echo 1. Testing localhost:8080...
curl -s -o nul -w "   Status: %%{http_code}\n" http://localhost:8080/api/books
if %errorlevel% equ 0 (
    echo ✅ Port 8080 is accessible
) else (
    echo ❌ Cannot connect to port 8080
)

echo.
echo 2. Checking if Spring Boot is running...
tasklist /fi "imagename eq java.exe" 2>nul | find /i "java.exe" >nul
if %errorlevel% equ 0 (
    echo ✅ Java is running (Spring Boot might be running)
) else (
    echo ❌ No Java process found
)

echo.
echo 3. Testing with PowerShell...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/books' -TimeoutSec 2; Write-Host '✅ PowerShell connection successful' -ForegroundColor Green } catch { Write-Host '❌ PowerShell connection failed' -ForegroundColor Red }"

echo.
echo ========================================
echo.
echo If all tests failed, start your backend:
echo cd C:\Users\NSW\Desktop\capstone Project\Book_library_Backend
echo mvn spring-boot:run
echo.
pause