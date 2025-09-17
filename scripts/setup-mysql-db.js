const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

// MySQL configuration
const mysqlConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "luna_ai",
};

async function setupMySQLDatabase() {
  let connection;

  try {
    console.log("🚀 Setting up MySQL database...");

    // First connect without database to create it
    const tempConnection = await mysql.createConnection({
      host: mysqlConfig.host,
      port: mysqlConfig.port,
      user: mysqlConfig.user,
      password: mysqlConfig.password,
    });

    // Create database if it doesn't exist
    await tempConnection.execute(
      `CREATE DATABASE IF NOT EXISTS \`${mysqlConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`✅ Database '${mysqlConfig.database}' created/verified`);

    await tempConnection.end();

    // Now connect to the specific database
    connection = await mysql.createConnection(mysqlConfig);
    console.log("✅ Connected to MySQL database");

    // Create tables using TypeORM entities
    await createTables(connection);

    console.log("🎉 MySQL database setup completed successfully!");
    console.log("📝 You can now start your application with: npm run dev");
  } catch (error) {
    console.error("❌ Error setting up MySQL database:", error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function createTables(connection) {
  console.log("📋 Creating tables...");

  // Create users table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS \`users\` (
      \`id\` varchar(36) NOT NULL,
      \`email\` varchar(255) NOT NULL,
      \`name\` varchar(255) NOT NULL,
      \`password\` varchar(255) DEFAULT NULL,
      \`role\` varchar(50) DEFAULT 'user',
      \`isActive\` tinyint(1) DEFAULT 1,
      \`emailVerified\` tinyint(1) DEFAULT 0,
      \`verificationToken\` varchar(255) DEFAULT NULL,
      \`resetToken\` varchar(255) DEFAULT NULL,
      \`resetTokenExpires\` datetime DEFAULT NULL,
      \`lastLogin\` datetime DEFAULT NULL,
      \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`UQ_users_email\` (\`email\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("✅ Created users table");

  // Create packages table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS \`packages\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`name\` varchar(255) NOT NULL,
      \`description\` text,
      \`price\` decimal(10,2) NOT NULL,
      \`type\` varchar(50) NOT NULL,
      \`features\` json DEFAULT NULL,
      \`platforms\` json DEFAULT NULL,
      \`duration\` int DEFAULT NULL,
      \`budget\` decimal(10,2) DEFAULT NULL,
      \`maxCampaigns\` int DEFAULT NULL,
      \`maxUsers\` int DEFAULT NULL,
      \`isPopular\` tinyint(1) DEFAULT 0,
      \`isCustom\` tinyint(1) DEFAULT 0,
      \`isActive\` tinyint(1) DEFAULT 1,
      \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("✅ Created packages table");

  // Create user_package_selections table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS \`user_package_selections\` (
      \`id\` varchar(36) NOT NULL,
      \`userId\` varchar(36) NOT NULL,
      \`packageId\` int NOT NULL,
      \`billingCycle\` varchar(50) DEFAULT 'monthly',
      \`selectedPrice\` decimal(10,2) NOT NULL,
      \`isActive\` tinyint(1) DEFAULT 0,
      \`isCompleted\` tinyint(1) DEFAULT 0,
      \`selectionData\` json DEFAULT NULL,
      \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
      PRIMARY KEY (\`id\`),
      KEY \`FK_user_package_selections_userId\` (\`userId\`),
      KEY \`FK_user_package_selections_packageId\` (\`packageId\`),
      CONSTRAINT \`FK_user_package_selections_packageId\` FOREIGN KEY (\`packageId\`) REFERENCES \`packages\` (\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("✅ Created user_package_selections table");

  // Create payment_settings table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS \`payment_settings\` (
      \`id\` varchar(36) NOT NULL,
      \`provider\` varchar(50) NOT NULL,
      \`enabled\` tinyint(1) DEFAULT 0,
      \`configuration\` json DEFAULT NULL,
      \`testMode\` tinyint(1) DEFAULT 0,
      \`lastTested\` datetime DEFAULT NULL,
      \`testStatus\` varchar(20) DEFAULT NULL,
      \`testMessage\` text,
      \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`UQ_payment_settings_provider\` (\`provider\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("✅ Created payment_settings table");

  // Create campaigns table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS \`campaigns\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`name\` varchar(255) NOT NULL,
      \`description\` text,
      \`status\` varchar(50) DEFAULT 'draft',
      \`budget\` decimal(10,2) DEFAULT NULL,
      \`startDate\` datetime DEFAULT NULL,
      \`endDate\` datetime DEFAULT NULL,
      \`targetAudience\` json DEFAULT NULL,
      \`platforms\` json DEFAULT NULL,
      \`userId\` varchar(36) NOT NULL,
      \`packageId\` int DEFAULT NULL,
      \`isActive\` tinyint(1) DEFAULT 1,
      \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
      PRIMARY KEY (\`id\`),
      KEY \`FK_campaigns_userId\` (\`userId\`),
      KEY \`FK_campaigns_packageId\` (\`packageId\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("✅ Created campaigns table");

  // Create payments table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS \`payments\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`type\` varchar(50) NOT NULL,
      \`status\` varchar(50) DEFAULT 'pending',
      \`method\` varchar(50) NOT NULL,
      \`amount\` decimal(10,2) NOT NULL,
      \`fee\` decimal(20,8) DEFAULT NULL,
      \`exchangeRate\` decimal(20,8) DEFAULT NULL,
      \`usdValue\` decimal(20,2) DEFAULT NULL,
      \`transactionHash\` varchar(255) NOT NULL,
      \`fromAddress\` varchar(255) DEFAULT NULL,
      \`toAddress\` varchar(255) DEFAULT NULL,
      \`blockNumber\` varchar(255) DEFAULT NULL,
      \`confirmationCount\` int DEFAULT NULL,
      \`description\` text NOT NULL,
      \`currency\` varchar(10) DEFAULT NULL,
      \`plan\` varchar(50) DEFAULT NULL,
      \`processedAt\` datetime DEFAULT NULL,
      \`refundedAt\` datetime DEFAULT NULL,
      \`refundAmount\` decimal(20,8) DEFAULT NULL,
      \`metadata\` json DEFAULT NULL,
      \`userId\` int NOT NULL,
      \`campaignId\` int DEFAULT NULL,
      \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
      PRIMARY KEY (\`id\`),
      KEY \`FK_payments_userId\` (\`userId\`),
      KEY \`FK_payments_campaignId\` (\`campaignId\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("✅ Created payments table");

  // Create price_history table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS \`price_history\` (
      \`id\` varchar(36) NOT NULL,
      \`packageId\` int NOT NULL,
      \`changedByUserId\` varchar(36) DEFAULT NULL,
      \`oldPrice\` decimal(10,2) NOT NULL,
      \`newPrice\` decimal(10,2) NOT NULL,
      \`priceChangePercentage\` decimal(5,2) NOT NULL,
      \`changeType\` varchar(20) NOT NULL,
      \`billingCycle\` varchar(50) DEFAULT 'monthly',
      \`reason\` text,
      \`metadata\` json DEFAULT NULL,
      \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      PRIMARY KEY (\`id\`),
      KEY \`FK_price_history_packageId\` (\`packageId\`),
      KEY \`FK_price_history_changedByUserId\` (\`changedByUserId\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("✅ Created price_history table");

  // Create wallets table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS \`wallets\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`address\` varchar(255) NOT NULL,
      \`balance\` decimal(20,8) DEFAULT 0,
      \`currency\` varchar(10) DEFAULT 'USDT',
      \`userId\` varchar(36) NOT NULL,
      \`isActive\` tinyint(1) DEFAULT 1,
      \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`UQ_wallets_address\` (\`address\`),
      KEY \`FK_wallets_userId\` (\`userId\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("✅ Created wallets table");

  // Create analytics table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS \`analytics\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`campaignId\` int NOT NULL,
      \`impressions\` int DEFAULT 0,
      \`clicks\` int DEFAULT 0,
      \`conversions\` int DEFAULT 0,
      \`spend\` decimal(10,2) DEFAULT 0,
      \`revenue\` decimal(10,2) DEFAULT 0,
      \`date\` date NOT NULL,
      \`platform\` varchar(50) NOT NULL,
      \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
      PRIMARY KEY (\`id\`),
      KEY \`FK_analytics_campaignId\` (\`campaignId\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("✅ Created analytics table");

  // Create connected_accounts table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS \`connected_accounts\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`platform\` varchar(50) NOT NULL,
      \`accountId\` varchar(255) NOT NULL,
      \`accountName\` varchar(255) NOT NULL,
      \`accessToken\` text NOT NULL,
      \`refreshToken\` text DEFAULT NULL,
      \`tokenExpiresAt\` datetime DEFAULT NULL,
      \`isActive\` tinyint(1) DEFAULT 1,
      \`userId\` varchar(36) NOT NULL,
      \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
      PRIMARY KEY (\`id\`),
      KEY \`FK_connected_accounts_userId\` (\`userId\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("✅ Created connected_accounts table");

  // Create real_ads table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS \`real_ads\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`platform\` varchar(50) NOT NULL,
      \`adId\` varchar(255) NOT NULL,
      \`name\` varchar(255) NOT NULL,
      \`status\` varchar(50) NOT NULL,
      \`budget\` decimal(10,2) DEFAULT NULL,
      \`spend\` decimal(10,2) DEFAULT 0,
      \`impressions\` int DEFAULT 0,
      \`clicks\` int DEFAULT 0,
      \`conversions\` int DEFAULT 0,
      \`campaignId\` int NOT NULL,
      \`userId\` varchar(36) NOT NULL,
      \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
      PRIMARY KEY (\`id\`),
      KEY \`FK_real_ads_campaignId\` (\`campaignId\`),
      KEY \`FK_real_ads_userId\` (\`userId\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("✅ Created real_ads table");

  // Create ad_campaigns table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS \`ad_campaigns\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`name\` varchar(255) NOT NULL,
      \`status\` varchar(50) DEFAULT 'draft',
      \`budget\` decimal(10,2) DEFAULT NULL,
      \`startDate\` datetime DEFAULT NULL,
      \`endDate\` datetime DEFAULT NULL,
      \`targetAudience\` json DEFAULT NULL,
      \`platforms\` json DEFAULT NULL,
      \`userId\` varchar(36) NOT NULL,
      \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
      PRIMARY KEY (\`id\`),
      KEY \`FK_ad_campaigns_userId\` (\`userId\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("✅ Created ad_campaigns table");

  // Create ad_creatives table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS \`ad_creatives\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`name\` varchar(255) NOT NULL,
      \`type\` varchar(50) NOT NULL,
      \`content\` text,
      \`imageUrl\` varchar(500) DEFAULT NULL,
      \`videoUrl\` varchar(500) DEFAULT NULL,
      \`linkUrl\` varchar(500) DEFAULT NULL,
      \`campaignId\` int NOT NULL,
      \`userId\` varchar(36) NOT NULL,
      \`isActive\` tinyint(1) DEFAULT 1,
      \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
      PRIMARY KEY (\`id\`),
      KEY \`FK_ad_creatives_campaignId\` (\`campaignId\`),
      KEY \`FK_ad_creatives_userId\` (\`userId\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("✅ Created ad_creatives table");

  // Create subscriptions table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS \`subscriptions\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`status\` varchar(50) DEFAULT 'active',
      \`startDate\` datetime NOT NULL,
      \`endDate\` datetime NOT NULL,
      \`packageId\` int NOT NULL,
      \`userId\` varchar(36) NOT NULL,
      \`isActive\` tinyint(1) DEFAULT 1,
      \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
      PRIMARY KEY (\`id\`),
      KEY \`FK_subscriptions_packageId\` (\`packageId\`),
      KEY \`FK_subscriptions_userId\` (\`userId\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("✅ Created subscriptions table");

  // Create plans table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS \`plans\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`name\` varchar(255) NOT NULL,
      \`description\` text,
      \`price\` decimal(10,2) NOT NULL,
      \`duration\` int NOT NULL,
      \`features\` json DEFAULT NULL,
      \`isActive\` tinyint(1) DEFAULT 1,
      \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("✅ Created plans table");

  // Create transactions table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS \`transactions\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`type\` varchar(50) NOT NULL,
      \`amount\` decimal(20,8) NOT NULL,
      \`currency\` varchar(10) DEFAULT 'USDT',
      \`status\` varchar(50) DEFAULT 'pending',
      \`transactionHash\` varchar(255) NOT NULL,
      \`fromAddress\` varchar(255) DEFAULT NULL,
      \`toAddress\` varchar(255) DEFAULT NULL,
      \`description\` text,
      \`userId\` varchar(36) NOT NULL,
      \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
      PRIMARY KEY (\`id\`),
      KEY \`FK_transactions_userId\` (\`userId\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("✅ Created transactions table");

  console.log("🎉 All tables created successfully!");
}

// Run the setup
setupMySQLDatabase().catch(console.error);
