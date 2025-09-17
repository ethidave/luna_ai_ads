import "reflect-metadata";
import { AppDataSource } from "./database";
import { User } from "./entities/User";
import bcrypt from "bcryptjs";

export async function seedAdminUser() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userRepository = AppDataSource.getRepository(User);

    // Check if admin user already exists
    const existingAdmin = await userRepository.findOne({
      where: { email: "admin@lunaai.com" }
    });

    if (existingAdmin) {
      console.log("Admin user already exists");
      return existingAdmin;
    }

    // Create admin user
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
    });

    const savedAdmin = await userRepository.save(adminUser);
    console.log("Admin user created successfully:", savedAdmin.email);
    
    return savedAdmin;
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedAdminUser()
    .then(() => {
      console.log("Admin user seeding completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Admin user seeding failed:", error);
      process.exit(1);
    });
}
