import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { AdCampaign } from "./entities/AdCampaign";
import { Subscription } from "./entities/Subscription";
import { Plan } from "./entities/Plan";
import { Package } from "./entities/Package";
import { Wallet } from "./entities/Wallet";
import { Payment } from "./entities/Payment";
import { Transaction } from "./entities/Transaction";
import { Analytics } from "./entities/Analytics";
import { AdCreative } from "./entities/AdCreative";
import { Campaign } from "./entities/Campaign";
import { ConnectedAccount } from "./entities/ConnectedAccount";
import { RealAd } from "./entities/RealAd";
import { PaymentSettings } from "./entities/PaymentSettings";
import { UserPackageSelection } from "./entities/UserPackageSelection";
import { PriceHistory } from "./entities/PriceHistory";
// Import social media entities at the end to avoid circular dependencies

// Force MySQL usage - no more SQLite fallback
export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "luna",
    synchronize: false, // Disable auto-sync to prevent duplicate tables
    logging: process.env.NODE_ENV === "development",
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
      RealAd,
      PaymentSettings,
      UserPackageSelection,
      PriceHistory,
    ],
    ssl: false,
    charset: "utf8mb4",
    timezone: "+00:00",
  }
);

export const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("Database connection established successfully");
    }
  } catch (error) {
    console.error("Error during database initialization:", error);
    throw error;
  }
};