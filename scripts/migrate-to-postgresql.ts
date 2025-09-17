import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../src/lib/entities/User";
import { AdCampaign } from "../src/lib/entities/AdCampaign";
import { Subscription } from "../src/lib/entities/Subscription";
import { Plan } from "../src/lib/entities/Plan";
import { Package } from "../src/lib/entities/Package";
import { Wallet } from "../src/lib/entities/Wallet";
import { Payment } from "../src/lib/entities/Payment";
import { Transaction } from "../src/lib/entities/Transaction";
import { Analytics } from "../src/lib/entities/Analytics";
import { AdCreative } from "../src/lib/entities/AdCreative";
import { Campaign } from "../src/lib/entities/Campaign";
import { ConnectedAccount } from "../src/lib/entities/ConnectedAccount";
import { RealAd } from "../src/lib/entities/RealAd";
import bcrypt from "bcryptjs";

// PostgreSQL DataSource configuration
const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "luna_ai_db",
  entities: [
    User,
    AdCampaign,
    Subscription,
    Plan,
    Package,
    Wallet,
    Payment,
    Transaction,
    Analytics,
    AdCreative,
    Campaign,
    ConnectedAccount,
    RealAd
  ],
  synchronize: false, // We'll use migrations instead
  logging: true,
  migrations: ["src/migrations/*.ts"],
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

async function migrateToPostgreSQL() {
  try {
    console.log("🚀 Starting PostgreSQL Migration...");
    
    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("✅ Database connected successfully");
    }

    // Run migrations
    console.log("📦 Running migrations...");
    await AppDataSource.runMigrations();
    console.log("✅ Migrations completed successfully");

    // Seed initial data
    await seedInitialData();

    console.log("🎉 PostgreSQL migration completed successfully!");
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

async function seedInitialData() {
  console.log("🌱 Seeding initial data...");
  
  const userRepository = AppDataSource.getRepository(User);
  const planRepository = AppDataSource.getRepository(Plan);
  const packageRepository = AppDataSource.getRepository(Package);

  // Create admin user
  console.log("👤 Creating admin user...");
  const existingAdmin = await userRepository.findOne({
    where: { email: "admin@lunaai.com" }
  });

  if (!existingAdmin) {
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
    await userRepository.save(adminUser);
    console.log("✅ Admin user created");
  } else {
    console.log("ℹ️  Admin user already exists");
  }

  // Create default plans
  console.log("📋 Creating default plans...");
  const plans = [
    {
      name: "Free",
      description: "Basic features for getting started",
      price: 0,
      currency: "USD",
      billingCycle: "monthly",
      features: {
        campaigns: 3,
        credits: 100,
        analytics: "basic",
        support: "community"
      }
    },
    {
      name: "Pro",
      description: "Advanced features for growing businesses",
      price: 29.99,
      currency: "USD",
      billingCycle: "monthly",
      features: {
        campaigns: 25,
        credits: 1000,
        analytics: "advanced",
        support: "priority",
        aiOptimization: true
      }
    },
    {
      name: "Enterprise",
      description: "Full features for large organizations",
      price: 99.99,
      currency: "USD",
      billingCycle: "monthly",
      features: {
        campaigns: -1, // unlimited
        credits: 10000,
        analytics: "enterprise",
        support: "dedicated",
        aiOptimization: true,
        customIntegrations: true
      }
    }
  ];

  for (const planData of plans) {
    const existingPlan = await planRepository.findOne({
      where: { name: planData.name }
    });

    if (!existingPlan) {
      const plan = planRepository.create(planData);
      await planRepository.save(plan);
      console.log(`✅ Plan "${planData.name}" created`);
    } else {
      console.log(`ℹ️  Plan "${planData.name}" already exists`);
    }
  }

  // Create default packages
  console.log("📦 Creating default packages...");
  const packages = [
    {
      name: "Starter Pack",
      description: "100 credits to get started",
      price: 9.99,
      currency: "USD",
      credits: 100,
      features: {
        aiGeneration: true,
        basicAnalytics: true
      }
    },
    {
      name: "Growth Pack",
      description: "500 credits for growing campaigns",
      price: 39.99,
      currency: "USD",
      credits: 500,
      features: {
        aiGeneration: true,
        advancedAnalytics: true,
        optimization: true
      }
    },
    {
      name: "Pro Pack",
      description: "2000 credits for professional use",
      price: 149.99,
      currency: "USD",
      credits: 2000,
      features: {
        aiGeneration: true,
        enterpriseAnalytics: true,
        optimization: true,
        prioritySupport: true
      }
    }
  ];

  for (const packageData of packages) {
    const existingPackage = await packageRepository.findOne({
      where: { name: packageData.name }
    });

    if (!existingPackage) {
      const pkg = packageRepository.create(packageData);
      await packageRepository.save(pkg);
      console.log(`✅ Package "${packageData.name}" created`);
    } else {
      console.log(`ℹ️  Package "${packageData.name}" already exists`);
    }
  }

  console.log("✅ Initial data seeding completed");
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateToPostgreSQL().catch(console.error);
}

export { migrateToPostgreSQL };
