import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/lib/database";
import { withApiErrorHandling } from "@/lib/api-error-handler";

async function testDatabaseHandler(request: NextRequest) {
  try {
    // Initialize database if not already done
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("✅ Database initialized successfully");
    }

    // Test basic database connection
    const isMySQL = AppDataSource.options.type === 'mysql';
    let connectionTest, tableNames;
    
    if (isMySQL) {
      connectionTest = await AppDataSource.query("SELECT NOW() as currentTime, VERSION() as version");
      const tables = await AppDataSource.query("SHOW TABLES");
      tableNames = tables.map(t => Object.values(t)[0]);
    } else {
      // SQLite
      connectionTest = await AppDataSource.query("SELECT datetime('now') as currentTime, sqlite_version() as version");
      const tables = await AppDataSource.query("SELECT name FROM sqlite_master WHERE type='table'");
      tableNames = tables.map(t => t.name);
    }
    
    console.log("✅ Database query successful:", connectionTest[0]);
    console.log("✅ Available tables:", tableNames);

    // Test user table if it exists
    let userCount = 0;
    let campaignCount = 0;
    
    if (tableNames.includes('users')) {
      const userResult = await AppDataSource.query("SELECT COUNT(*) as count FROM users");
      userCount = userResult[0].count;
    }

    if (tableNames.includes('campaigns')) {
      const campaignResult = await AppDataSource.query("SELECT COUNT(*) as count FROM campaigns");
      campaignCount = campaignResult[0].count;
    }

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      data: {
        connectionTime: connectionTest[0].currentTime,
        databaseVersion: connectionTest[0].version,
        databaseType: AppDataSource.options.type,
        userCount,
        campaignCount,
        isInitialized: AppDataSource.isInitialized,
        tables: tableNames,
        totalTables: tableNames.length
      }
    });
  } catch (error) {
    console.error("Database test error:", error);
    throw error; // Let the error handler deal with it
  }
}

export const GET = withApiErrorHandling(testDatabaseHandler);
