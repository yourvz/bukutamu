@echo off
echo Building TypeScript backend...
call npm run build

if %errorlevel% neq 0 (
    echo Build failed
    exit /b 1
)

echo Starting backend server...
call npm start