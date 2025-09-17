const { Client } = require("pg");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function createAdminUser() {
  const client = new Client({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || "5432",
    user: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "luna_ai_db",
  });

  try {
    console.log("🚀 Starting admin user creation...");
    console.log("🔌 Connecting to database...");

    await client.connect();
    console.log("✅ Database connected successfully");

    // Create users table if it doesn't exist
    console.log("📋 Creating users table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR UNIQUE NOT NULL,
        name VARCHAR NOT NULL,
        password VARCHAR NOT NULL,
        avatar VARCHAR,
        "emailVerified" BOOLEAN DEFAULT false,
        "emailVerificationToken" VARCHAR,
        "passwordResetToken" VARCHAR,
        "passwordResetExpires" TIMESTAMP,
        plan VARCHAR DEFAULT 'free',
        role VARCHAR DEFAULT 'user',
        "isAdmin" BOOLEAN DEFAULT false,
        credits INTEGER DEFAULT 0,
        "isActive" BOOLEAN DEFAULT true,
        "lastLoginAt" TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("✅ Users table created/verified");

    // Check if admin user already exists
    console.log("🔍 Checking for existing admin user...");
    const existingAdmin = await client.query(
      "SELECT * FROM users WHERE email = $1",
      ["admin@lunaai.com"]
    );

    if (existingAdmin.rows.length > 0) {
      console.log("ℹ️  Admin user already exists");
      console.log(`   ID: ${existingAdmin.rows[0].id}`);
      console.log(`   Name: ${existingAdmin.rows[0].name}`);
      console.log(`   Email: ${existingAdmin.rows[0].email}`);
      console.log(`   Role: ${existingAdmin.rows[0].role}`);
      console.log(`   Is Admin: ${existingAdmin.rows[0].isAdmin}`);
      return;
    }

    // Create admin user
    console.log("👤 Creating admin user...");
    const hashedPassword = await bcrypt.hash("admin123", 12);

    const result = await client.query(
      `
      INSERT INTO users (
        name, email, password, role, "isAdmin", "isActive", 
        "emailVerified", plan, credits
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, name, email, role, "isAdmin"
    `,
      [
        "Admin User",
        "admin@lunaai.com",
        hashedPassword,
        "admin",
        true,
        true,
        true,
        "enterprise",
        999999,
      ]
    );

    const adminUser = result.rows[0];
    console.log("✅ Admin user created successfully!");
    console.log(`   ID: ${adminUser.id}`);
    console.log(`   Name: ${adminUser.name}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   Is Admin: ${adminUser.isAdmin}`);

    console.log("\n🎉 Admin user setup completed!");
    console.log("📋 Login credentials:");
    console.log("   Email: admin@lunaai.com");
    console.log("   Password: admin123");
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createAdminUser();
