@echo off
REM Quick start script for Inventory Management System (Windows)

echo.
echo 🚀 Starting Inventory ^& Order Management System...
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker first.
    exit /b 1
)

echo ✓ Docker found
echo.

REM Create .env file from example
if not exist "backend\.env" (
    echo 📝 Creating backend\.env file...
    copy backend\.env.example backend\.env
)

echo 🐳 Building Docker images...
docker-compose build

echo.
echo 🚀 Starting services...
docker-compose up -d

echo.
echo ⏳ Waiting for services to be ready (15 seconds)...
timeout /t 15 /nobreak

echo.
echo ✅ Services started successfully!
echo.
echo 📊 Access the application:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:5000/api
echo    Database: localhost:5432
echo.
echo 📝 Database credentials:
echo    User: postgres
echo    Password: inventory_password
echo    Database: inventory_db
echo.
echo 💡 Useful commands:
echo    View logs: docker-compose logs -f
echo    Stop services: docker-compose down
echo    Clean everything: docker-compose down -v
echo.
pause
