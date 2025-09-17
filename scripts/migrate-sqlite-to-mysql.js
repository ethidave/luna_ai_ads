const sqlite3 = require("sqlite3").verbose();
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

// SQLite configuration
const sqlitePath = path.join(__dirname, "..", "database.sqlite");

// MySQL configuration
const mysqlConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "luna_ai",
};

async function migrateData() {
  let sqliteDb;
  let mysqlConnection;

  try {
    console.log("🚀 Starting migration from SQLite to MySQL...");

    // Check if SQLite database exists
    if (!fs.existsSync(sqlitePath)) {
      console.log(
        "❌ SQLite database not found. Please run the application first to create it."
      );
      process.exit(1);
    }

    // Connect to SQLite
    console.log("📂 Connecting to SQLite database...");
    sqliteDb = new sqlite3.Database(sqlitePath);

    // Connect to MySQL
    console.log("🐬 Connecting to MySQL database...");
    mysqlConnection = await mysql.createConnection(mysqlConfig);

    // First, ensure MySQL database and tables exist
    console.log("🔧 Setting up MySQL database...");
    await setupMySQLDatabase(mysqlConnection);

    // Migrate data table by table
    await migrateUsers(sqliteDb, mysqlConnection);
    await migratePackages(sqliteDb, mysqlConnection);
    await migrateUserPackageSelections(sqliteDb, mysqlConnection);
    await migratePaymentSettings(sqliteDb, mysqlConnection);
    await migrateCampaigns(sqliteDb, mysqlConnection);
    await migratePayments(sqliteDb, mysqlConnection);
    await migratePriceHistory(sqliteDb, mysqlConnection);
    await migrateWallets(sqliteDb, mysqlConnection);
    await migrateAnalytics(sqliteDb, mysqlConnection);
    await migrateConnectedAccounts(sqliteDb, mysqlConnection);
    await migrateRealAds(sqliteDb, mysqlConnection);
    await migrateAdCampaigns(sqliteDb, mysqlConnection);
    await migrateAdCreatives(sqliteDb, mysqlConnection);
    await migrateSubscriptions(sqliteDb, mysqlConnection);
    await migratePlans(sqliteDb, mysqlConnection);
    await migrateTransactions(sqliteDb, mysqlConnection);

    console.log("🎉 Migration completed successfully!");
    console.log(
      "📝 You can now start your application with MySQL: npm run dev"
    );
  } catch (error) {
    console.error("❌ Error during migration:", error);
    process.exit(1);
  } finally {
    if (sqliteDb) {
      sqliteDb.close();
    }
    if (mysqlConnection) {
      await mysqlConnection.end();
    }
  }
}

async function setupMySQLDatabase(connection) {
  // Create database if it doesn't exist
  await connection.execute(
    `CREATE DATABASE IF NOT EXISTS \`${mysqlConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await connection.execute(`USE \`${mysqlConfig.database}\``);

  // Create all tables (reuse the setup script logic)
  const setupScript = require("./setup-mysql-db.js");
  // Note: This will create tables if they don't exist
}

async function migrateUsers(sqliteDb, mysqlConnection) {
  console.log("👥 Migrating users...");

  return new Promise((resolve, reject) => {
    sqliteDb.all("SELECT * FROM users", async (err, rows) => {
      if (err) {
        console.log("⚠️  No users table found in SQLite, skipping...");
        return resolve();
      }

      try {
        for (const row of rows) {
          await mysqlConnection.execute(
            `
            INSERT IGNORE INTO users (
              id, email, name, password, role, isActive, emailVerified, 
              verificationToken, resetToken, resetTokenExpires, lastLogin, 
              createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
            [
              row.id,
              row.email,
              row.name,
              row.password,
              row.role || "user",
              row.isActive ? 1 : 0,
              row.emailVerified ? 1 : 0,
              row.verificationToken,
              row.resetToken,
              row.resetTokenExpires,
              row.lastLogin,
              row.createdAt,
              row.updatedAt,
            ]
          );
        }
        console.log(`✅ Migrated ${rows.length} users`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function migratePackages(sqliteDb, mysqlConnection) {
  console.log("📦 Migrating packages...");

  return new Promise((resolve, reject) => {
    sqliteDb.all("SELECT * FROM packages", async (err, rows) => {
      if (err) {
        console.log("⚠️  No packages table found in SQLite, skipping...");
        return resolve();
      }

      try {
        for (const row of rows) {
          await mysqlConnection.execute(
            `
            INSERT IGNORE INTO packages (
              id, name, description, price, type, features, platforms,
              duration, budget, maxCampaigns, maxUsers, isPopular, isCustom,
              isActive, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
            [
              row.id,
              row.name,
              row.description,
              row.price,
              row.type,
              row.features ? JSON.stringify(row.features) : null,
              row.platforms ? JSON.stringify(row.platforms) : null,
              row.duration,
              row.budget,
              row.maxCampaigns,
              row.maxUsers,
              row.isPopular ? 1 : 0,
              row.isCustom ? 1 : 0,
              row.isActive ? 1 : 0,
              row.createdAt,
              row.updatedAt,
            ]
          );
        }
        console.log(`✅ Migrated ${rows.length} packages`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function migrateUserPackageSelections(sqliteDb, mysqlConnection) {
  console.log("🎯 Migrating user package selections...");

  return new Promise((resolve, reject) => {
    sqliteDb.all("SELECT * FROM user_package_selections", async (err, rows) => {
      if (err) {
        console.log(
          "⚠️  No user_package_selections table found in SQLite, skipping..."
        );
        return resolve();
      }

      try {
        for (const row of rows) {
          await mysqlConnection.execute(
            `
            INSERT IGNORE INTO user_package_selections (
              id, userId, packageId, billingCycle, selectedPrice,
              isActive, isCompleted, selectionData, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
            [
              row.id,
              row.userId,
              row.packageId,
              row.billingCycle || "monthly",
              row.selectedPrice,
              row.isActive ? 1 : 0,
              row.isCompleted ? 1 : 0,
              row.selectionData ? JSON.stringify(row.selectionData) : null,
              row.createdAt,
              row.updatedAt,
            ]
          );
        }
        console.log(`✅ Migrated ${rows.length} user package selections`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function migratePaymentSettings(sqliteDb, mysqlConnection) {
  console.log("💳 Migrating payment settings...");

  return new Promise((resolve, reject) => {
    sqliteDb.all("SELECT * FROM payment_settings", async (err, rows) => {
      if (err) {
        console.log(
          "⚠️  No payment_settings table found in SQLite, skipping..."
        );
        return resolve();
      }

      try {
        for (const row of rows) {
          await mysqlConnection.execute(
            `
            INSERT IGNORE INTO payment_settings (
              id, provider, enabled, configuration, testMode,
              lastTested, testStatus, testMessage, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
            [
              row.id,
              row.provider,
              row.enabled ? 1 : 0,
              row.configuration ? JSON.stringify(row.configuration) : null,
              row.testMode ? 1 : 0,
              row.lastTested,
              row.testStatus,
              row.testMessage,
              row.createdAt,
              row.updatedAt,
            ]
          );
        }
        console.log(`✅ Migrated ${rows.length} payment settings`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function migrateCampaigns(sqliteDb, mysqlConnection) {
  console.log("📢 Migrating campaigns...");

  return new Promise((resolve, reject) => {
    sqliteDb.all("SELECT * FROM campaigns", async (err, rows) => {
      if (err) {
        console.log("⚠️  No campaigns table found in SQLite, skipping...");
        return resolve();
      }

      try {
        for (const row of rows) {
          await mysqlConnection.execute(
            `
            INSERT IGNORE INTO campaigns (
              id, name, description, status, budget, startDate, endDate,
              targetAudience, platforms, userId, packageId, isActive,
              createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
            [
              row.id,
              row.name,
              row.description,
              row.status,
              row.budget,
              row.startDate,
              row.endDate,
              row.targetAudience ? JSON.stringify(row.targetAudience) : null,
              row.platforms ? JSON.stringify(row.platforms) : null,
              row.userId,
              row.packageId,
              row.isActive ? 1 : 0,
              row.createdAt,
              row.updatedAt,
            ]
          );
        }
        console.log(`✅ Migrated ${rows.length} campaigns`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function migratePayments(sqliteDb, mysqlConnection) {
  console.log("💰 Migrating payments...");

  return new Promise((resolve, reject) => {
    sqliteDb.all("SELECT * FROM payments", async (err, rows) => {
      if (err) {
        console.log("⚠️  No payments table found in SQLite, skipping...");
        return resolve();
      }

      try {
        for (const row of rows) {
          await mysqlConnection.execute(
            `
            INSERT IGNORE INTO payments (
              id, type, status, method, amount, fee, exchangeRate, usdValue,
              transactionHash, fromAddress, toAddress, blockNumber,
              confirmationCount, description, currency, plan, processedAt,
              refundedAt, refundAmount, metadata, userId, campaignId,
              createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
            [
              row.id,
              row.type,
              row.status,
              row.method,
              row.amount,
              row.fee,
              row.exchangeRate,
              row.usdValue,
              row.transactionHash,
              row.fromAddress,
              row.toAddress,
              row.blockNumber,
              row.confirmationCount,
              row.description,
              row.currency,
              row.plan,
              row.processedAt,
              row.refundedAt,
              row.refundAmount,
              row.metadata ? JSON.stringify(row.metadata) : null,
              row.userId,
              row.campaignId,
              row.createdAt,
              row.updatedAt,
            ]
          );
        }
        console.log(`✅ Migrated ${rows.length} payments`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function migratePriceHistory(sqliteDb, mysqlConnection) {
  console.log("📈 Migrating price history...");

  return new Promise((resolve, reject) => {
    sqliteDb.all("SELECT * FROM price_history", async (err, rows) => {
      if (err) {
        console.log("⚠️  No price_history table found in SQLite, skipping...");
        return resolve();
      }

      try {
        for (const row of rows) {
          await mysqlConnection.execute(
            `
            INSERT IGNORE INTO price_history (
              id, packageId, changedByUserId, oldPrice, newPrice,
              priceChangePercentage, changeType, billingCycle, reason,
              metadata, createdAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
            [
              row.id,
              row.packageId,
              row.changedByUserId,
              row.oldPrice,
              row.newPrice,
              row.priceChangePercentage,
              row.changeType,
              row.billingCycle || "monthly",
              row.reason,
              row.metadata ? JSON.stringify(row.metadata) : null,
              row.createdAt,
            ]
          );
        }
        console.log(`✅ Migrated ${rows.length} price history records`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function migrateWallets(sqliteDb, mysqlConnection) {
  console.log("👛 Migrating wallets...");

  return new Promise((resolve, reject) => {
    sqliteDb.all("SELECT * FROM wallets", async (err, rows) => {
      if (err) {
        console.log("⚠️  No wallets table found in SQLite, skipping...");
        return resolve();
      }

      try {
        for (const row of rows) {
          await mysqlConnection.execute(
            `
            INSERT IGNORE INTO wallets (
              id, address, balance, currency, userId, isActive, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
            [
              row.id,
              row.address,
              row.balance,
              row.currency || "USDT",
              row.userId,
              row.isActive ? 1 : 0,
              row.createdAt,
              row.updatedAt,
            ]
          );
        }
        console.log(`✅ Migrated ${rows.length} wallets`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function migrateAnalytics(sqliteDb, mysqlConnection) {
  console.log("📊 Migrating analytics...");

  return new Promise((resolve, reject) => {
    sqliteDb.all("SELECT * FROM analytics", async (err, rows) => {
      if (err) {
        console.log("⚠️  No analytics table found in SQLite, skipping...");
        return resolve();
      }

      try {
        for (const row of rows) {
          await mysqlConnection.execute(
            `
            INSERT IGNORE INTO analytics (
              id, campaignId, impressions, clicks, conversions, spend,
              revenue, date, platform, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
            [
              row.id,
              row.campaignId,
              row.impressions || 0,
              row.clicks || 0,
              row.conversions || 0,
              row.spend || 0,
              row.revenue || 0,
              row.date,
              row.platform,
              row.createdAt,
              row.updatedAt,
            ]
          );
        }
        console.log(`✅ Migrated ${rows.length} analytics records`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function migrateConnectedAccounts(sqliteDb, mysqlConnection) {
  console.log("🔗 Migrating connected accounts...");

  return new Promise((resolve, reject) => {
    sqliteDb.all("SELECT * FROM connected_accounts", async (err, rows) => {
      if (err) {
        console.log(
          "⚠️  No connected_accounts table found in SQLite, skipping..."
        );
        return resolve();
      }

      try {
        for (const row of rows) {
          await mysqlConnection.execute(
            `
            INSERT IGNORE INTO connected_accounts (
              id, platform, accountId, accountName, accessToken,
              refreshToken, tokenExpiresAt, isActive, userId, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
            [
              row.id,
              row.platform,
              row.accountId,
              row.accountName,
              row.accessToken,
              row.refreshToken,
              row.tokenExpiresAt,
              row.isActive ? 1 : 0,
              row.userId,
              row.createdAt,
              row.updatedAt,
            ]
          );
        }
        console.log(`✅ Migrated ${rows.length} connected accounts`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function migrateRealAds(sqliteDb, mysqlConnection) {
  console.log("📱 Migrating real ads...");

  return new Promise((resolve, reject) => {
    sqliteDb.all("SELECT * FROM real_ads", async (err, rows) => {
      if (err) {
        console.log("⚠️  No real_ads table found in SQLite, skipping...");
        return resolve();
      }

      try {
        for (const row of rows) {
          await mysqlConnection.execute(
            `
            INSERT IGNORE INTO real_ads (
              id, platform, adId, name, status, budget, spend,
              impressions, clicks, conversions, campaignId, userId,
              createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
            [
              row.id,
              row.platform,
              row.adId,
              row.name,
              row.status,
              row.budget,
              row.spend || 0,
              row.impressions || 0,
              row.clicks || 0,
              row.conversions || 0,
              row.campaignId,
              row.userId,
              row.createdAt,
              row.updatedAt,
            ]
          );
        }
        console.log(`✅ Migrated ${rows.length} real ads`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function migrateAdCampaigns(sqliteDb, mysqlConnection) {
  console.log("🎯 Migrating ad campaigns...");

  return new Promise((resolve, reject) => {
    sqliteDb.all("SELECT * FROM ad_campaigns", async (err, rows) => {
      if (err) {
        console.log("⚠️  No ad_campaigns table found in SQLite, skipping...");
        return resolve();
      }

      try {
        for (const row of rows) {
          await mysqlConnection.execute(
            `
            INSERT IGNORE INTO ad_campaigns (
              id, name, status, budget, startDate, endDate,
              targetAudience, platforms, userId, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
            [
              row.id,
              row.name,
              row.status,
              row.budget,
              row.startDate,
              row.endDate,
              row.targetAudience ? JSON.stringify(row.targetAudience) : null,
              row.platforms ? JSON.stringify(row.platforms) : null,
              row.userId,
              row.createdAt,
              row.updatedAt,
            ]
          );
        }
        console.log(`✅ Migrated ${rows.length} ad campaigns`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function migrateAdCreatives(sqliteDb, mysqlConnection) {
  console.log("🎨 Migrating ad creatives...");

  return new Promise((resolve, reject) => {
    sqliteDb.all("SELECT * FROM ad_creatives", async (err, rows) => {
      if (err) {
        console.log("⚠️  No ad_creatives table found in SQLite, skipping...");
        return resolve();
      }

      try {
        for (const row of rows) {
          await mysqlConnection.execute(
            `
            INSERT IGNORE INTO ad_creatives (
              id, name, type, content, imageUrl, videoUrl, linkUrl,
              campaignId, userId, isActive, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
            [
              row.id,
              row.name,
              row.type,
              row.content,
              row.imageUrl,
              row.videoUrl,
              row.linkUrl,
              row.campaignId,
              row.userId,
              row.isActive ? 1 : 0,
              row.createdAt,
              row.updatedAt,
            ]
          );
        }
        console.log(`✅ Migrated ${rows.length} ad creatives`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function migrateSubscriptions(sqliteDb, mysqlConnection) {
  console.log("📋 Migrating subscriptions...");

  return new Promise((resolve, reject) => {
    sqliteDb.all("SELECT * FROM subscriptions", async (err, rows) => {
      if (err) {
        console.log("⚠️  No subscriptions table found in SQLite, skipping...");
        return resolve();
      }

      try {
        for (const row of rows) {
          await mysqlConnection.execute(
            `
            INSERT IGNORE INTO subscriptions (
              id, status, startDate, endDate, packageId, userId,
              isActive, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
            [
              row.id,
              row.status,
              row.startDate,
              row.endDate,
              row.packageId,
              row.userId,
              row.isActive ? 1 : 0,
              row.createdAt,
              row.updatedAt,
            ]
          );
        }
        console.log(`✅ Migrated ${rows.length} subscriptions`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function migratePlans(sqliteDb, mysqlConnection) {
  console.log("📝 Migrating plans...");

  return new Promise((resolve, reject) => {
    sqliteDb.all("SELECT * FROM plans", async (err, rows) => {
      if (err) {
        console.log("⚠️  No plans table found in SQLite, skipping...");
        return resolve();
      }

      try {
        for (const row of rows) {
          await mysqlConnection.execute(
            `
            INSERT IGNORE INTO plans (
              id, name, description, price, duration, features,
              isActive, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
            [
              row.id,
              row.name,
              row.description,
              row.price,
              row.duration,
              row.features ? JSON.stringify(row.features) : null,
              row.isActive ? 1 : 0,
              row.createdAt,
              row.updatedAt,
            ]
          );
        }
        console.log(`✅ Migrated ${rows.length} plans`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function migrateTransactions(sqliteDb, mysqlConnection) {
  console.log("💸 Migrating transactions...");

  return new Promise((resolve, reject) => {
    sqliteDb.all("SELECT * FROM transactions", async (err, rows) => {
      if (err) {
        console.log("⚠️  No transactions table found in SQLite, skipping...");
        return resolve();
      }

      try {
        for (const row of rows) {
          await mysqlConnection.execute(
            `
            INSERT IGNORE INTO transactions (
              id, type, amount, currency, status, transactionHash,
              fromAddress, toAddress, description, userId, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
            [
              row.id,
              row.type,
              row.amount,
              row.currency || "USDT",
              row.status,
              row.transactionHash,
              row.fromAddress,
              row.toAddress,
              row.description,
              row.userId,
              row.createdAt,
              row.updatedAt,
            ]
          );
        }
        console.log(`✅ Migrated ${rows.length} transactions`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

// Run the migration
migrateData().catch(console.error);
