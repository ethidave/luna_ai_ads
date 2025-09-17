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

// SQLite fallback database configuration
export const SQLiteDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
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
    RealAd
  ],
});

// Function to get the appropriate data source
export function getDataSource() {
  // Check if we should use SQLite (when DATABASE_URL contains sqlite)
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes("sqlite")) {
    return SQLiteDataSource;
  }
  
  // Check if PostgreSQL is configured and working
  if (process.env.DB_HOST && process.env.DB_USERNAME && process.env.DB_PASSWORD && process.env.DB_NAME) {
    // Try to use PostgreSQL first
    try {
      const { AppDataSource } = require("./database");
      return AppDataSource;
    } catch (error) {
      console.log("PostgreSQL not available, falling back to SQLite");
    }
  }
  
  // Fall back to SQLite
  return SQLiteDataSource;
}
