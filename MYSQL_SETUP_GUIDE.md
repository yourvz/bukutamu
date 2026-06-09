# MySQL Setup Guide for Buku Tamu Project

## Option 1: MySQL Installer (Recommended)
1. Download MySQL Installer from official MySQL website
2. Run the installer
3. Choose "Developer Default" or "Server only" installation
4. Set root password during installation
5. Complete installation

## Option 2: XAMPP (Easier for Beginners)
1. Download XAMPP from https://www.apachefriends.org/
2. Run the installer
3. Select MySQL and phpMyAdmin during installation
4. Start MySQL service in XAMPP Control Panel

## Project Database Setup

### Using MySQL Command Line
1. Connect to MySQL:
   ```bash
   mysql -u root -p
   ```
2. Create Database:
   ```sql
   CREATE DATABASE buku_tamu_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'buku_tamu_app'@'localhost' IDENTIFIED BY 'secure_password_here';
   GRANT ALL PRIVILEGES ON buku_tamu_db.* TO 'buku_tamu_app'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Using phpMyAdmin
1. Open phpMyAdmin
2. Click "New" to create database
3. Name: `buku_tamu_db`
4. Create user with same credentials as above

### Import Database Schema
Use the SQL script in `database/buku_tamu.sql`

## Troubleshooting
- Ensure MySQL service is running
- Check firewall settings
- Verify connection credentials

## Security Notes
- Change default passwords
- Use strong, unique passwords
- Limit database user privileges