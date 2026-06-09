@echo off
echo Setting up Buku Tamu Database...

REM Check if MySQL is in PATH or if XAMPP MySQL is available
where mysql >nul 2>&1
if %errorlevel% neq 0 (
    REM Try XAMPP MySQL path
    set "MYSQL_PATH=C:\xampp\mysql\bin\mysql.exe"
    if not exist "%MYSQL_PATH%" (
        echo MySQL is not installed or not in PATH.
        echo Please install MySQL or XAMPP and ensure it's added to system PATH.
        pause
        exit /b 1
    )
) else (
    set "MYSQL_PATH=mysql"
)

REM Prompt for MySQL root password
set /p root_password="Enter MySQL root password: "

REM Run database setup script
"%MYSQL_PATH%" -u root -p%root_password% < "%~dp0buku_tamu.sql"

if %errorlevel% equ 0 (
    echo Database setup completed successfully!
) else (
    echo Failed to set up database.
)

pause