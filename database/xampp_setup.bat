@echo off
setlocal enabledelayedexpansion

REM Check for XAMPP MySQL executable
set "MYSQL_PATH=C:\xampp\mysql\bin\mysql.exe"
if not exist "!MYSQL_PATH!" (
    echo XAMPP MySQL not found. Please install XAMPP.
    pause
    exit /b 1
)

REM Prompt for MySQL root password
set /p root_password="Enter XAMPP MySQL root password (default is blank, just press Enter): "

REM Create database and user
"!MYSQL_PATH!" -u root -p!root_password! -e "CREATE DATABASE IF NOT EXISTS buku_tamu_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

"!MYSQL_PATH!" -u root -p!root_password! -e "CREATE USER IF NOT EXISTS 'buku_tamu_app'@'localhost' IDENTIFIED BY 'ParkirApp2026!@#$';"

"!MYSQL_PATH!" -u root -p!root_password! -e "GRANT ALL PRIVILEGES ON buku_tamu_db.* TO 'buku_tamu_app'@'localhost';"

"!MYSQL_PATH!" -u root -p!root_password! -e "FLUSH PRIVILEGES;"

REM Import database schema
"!MYSQL_PATH!" -u root -p!root_password! buku_tamu_db < "%~dp0buku_tamu.sql"

if %errorlevel% equ 0 (
    echo Database setup completed successfully!
) else (
    echo Failed to set up database.
)

pause