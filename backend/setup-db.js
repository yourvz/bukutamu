import { createConnection } from "mysql2/promise";

async function setupDatabase() {
  let connection;
  try {
    // Connect as root (XAMPP MariaDB - no password by default)
    connection = await createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "",
    });
    console.log("✓ Connected to XAMPP MariaDB");

    // Create database
    await connection.execute(`CREATE DATABASE IF NOT EXISTS buku_tamu_db;`);
    console.log("✓ Database buku_tamu_db ready");

    // Close current connection and reconnect to the database
    await connection.end();

    connection = await createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "",
      database: "buku_tamu_db",
    });

    // Create table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS tamu (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(255) NOT NULL,
        telepon VARCHAR(20) NOT NULL,
        dari ENUM('umum', 'instansi', 'organisasi') NOT NULL,
        nama_instansi VARCHAR(255),
        keperluan TEXT NOT NULL,
        waktu_kunjungan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    try {
      await connection.execute(createTableSQL);
      console.log("✓ Table tamu created");
    } catch (err) {
      if (err.code === "ER_TABLE_EXISTS_ERROR") {
        console.log("✓ Table tamu already exists");
      } else {
        throw err;
      }
    }

    console.log("\n✅ Database setup completed!");
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
    console.error("\n📌 Make sure XAMPP is running:");
    console.error("   - Open XAMPP Control Panel");
    console.error("   - Click 'Start' next to MySQL/MariaDB");
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

setupDatabase().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
