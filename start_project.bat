@echo off
echo Starting Buku Tamu Project...

REM Ensure we're in the correct directory
cd /d "%~dp0"

REM Install dependencies if not already installed
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

REM Start backend and frontend in separate windows
start cmd /k "title Backend Server && cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start cmd /k "title Frontend Server && npm run dev"

echo Project started. Check console windows for frontend and backend services.
pause