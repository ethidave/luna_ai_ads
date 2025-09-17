const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Setting up PostgreSQL Database for Luna AI...\n");

// Check if .env file exists
const envPath = path.join(process.cwd(), ".env");
if (!fs.existsSync(envPath)) {
  console.log("📝 Creating .env file from template...");
  const envExample = fs.readFileSync(
    path.join(process.cwd(), "env.example"),
    "utf8"
  );
  fs.writeFileSync(envPath, envExample);
  console.log(
    "✅ .env file created. Please update the database credentials.\n"
  );
}

// Load environment variables
require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || "5432",
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "luna_ai_db",
};

console.log("🔧 Database Configuration:");
console.log(`   Host: ${dbConfig.host}`);
console.log(`   Port: ${dbConfig.port}`);
console.log(`   Username: ${dbConfig.username}`);
console.log(`   Database: ${dbConfig.database}\n`);

// Function to run commands with error handling
function runCommand(command, description) {
  try {
    console.log(`🔄 ${description}...`);
    execSync(command, { stdio: "inherit" });
    console.log(`✅ ${description} completed\n`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

// Step 1: Install dependencies
runCommand("npm install", "Installing dependencies");

// Step 2: Generate migration files
runCommand("npm run db:generate", "Generating migration files");

// Step 3: Run migrations
runCommand("npm run db:run", "Running database migrations");

// Step 4: Seed admin user
runCommand("npm run migrate:admin", "Creating admin user");

// Step 5: Test database connection
runCommand("npm run test:db", "Testing database connection");

console.log("🎉 PostgreSQL database setup completed successfully!");
console.log("\n📋 Next steps:");
console.log("1. Update your .env file with correct database credentials");
console.log('2. Run "npm run dev" to start the development server');
console.log("3. Access admin panel at http://localhost:3000/admin/login");
console.log("   - Email: admin@lunaai.com");
console.log("   - Password: admin123");
