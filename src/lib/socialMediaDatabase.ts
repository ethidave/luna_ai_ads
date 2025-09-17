import { DataSource } from "typeorm";
import { SocialMediaAccount } from "./entities/SocialMediaAccount";
import { SocialMediaPost } from "./entities/SocialMediaPost";
import { SocialMediaAnalytics } from "./entities/SocialMediaAnalytics";

export const SocialMediaDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "luna",
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV === "development",
  entities: [
    SocialMediaAccount,
    SocialMediaPost,
    SocialMediaAnalytics
  ],
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export const initializeSocialMediaDatabase = async () => {
  try {
    if (!SocialMediaDataSource.isInitialized) {
      await SocialMediaDataSource.initialize();
      console.log("Social Media Database connection established successfully");
    }
  } catch (error) {
    console.error("Error during social media database initialization:", error);
    throw error;
  }
};

