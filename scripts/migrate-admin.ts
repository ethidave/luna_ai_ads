import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../src/lib/entities/User";
import bcrypt from "bcryptjs";

// Create a minimal DataSource for migration
const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "luna_ai_db",
  entities: [User],
  synchronize: true, // Use synchronize for simple admin creation
  logging: false,
});

async function migrateAdmin() {
  try {
    console.log("🔌 Connecting to database...");
    
    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("✅ Database connected successfully");
    }

    const userRepository = AppDataSource.getRepository(User);

    // Check if admin user already exists
    console.log("🔍 Checking for existing admin user...");
    const existingAdmin = await userRepository.findOne({
      where: { email: "admin@lunaai.com" }
    });

    if (existingAdmin) {
      console.log("ℹ️  Admin user already exists");
      console.log(`   ID: ${existingAdmin.id}`);
      console.log(`   Name: ${existingAdmin.name}`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log(`   Is Admin: ${existingAdmin.isAdmin}`);
      return;
    }

    // Create admin user
    console.log("👤 Creating admin user...");
    const hashedPassword = await bcrypt.hash("admin123", 12);
    
    const adminUser = userRepository.create({
      name: "Admin User",
      email: "admin@lunaai.com",
      password: hashedPassword,
      role: "admin",
      isAdmin: true,
      isActive: true,
      emailVerified: true,
      plan: "enterprise",
      credits: 999999,
    });

    const savedAdmin = await userRepository.save(adminUser);
    
    console.log("✅ Admin user created successfully!");
    console.log(`   ID: ${savedAdmin.id}`);
    console.log(`   Name: ${savedAdmin.name}`);
    console.log(`   Email: ${savedAdmin.email}`);
    console.log(`   Role: ${savedAdmin.role}`);
    console.log(`   Is Admin: ${savedAdmin.isAdmin}`);
    console.log(`   Plan: ${savedAdmin.plan}`);
    console.log(`   Credits: ${savedAdmin.credits}`);
    
  } catch (error) {
    console.error("❌ Error during admin migration:", error);
    throw error;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("🔌 Database connection closed");
    }
  }
}

// Run migration
migrateAdmin()
  .then(() => {
    console.log("🎉 Migration completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Migration failed:", error);
    process.exit(1);
  });
