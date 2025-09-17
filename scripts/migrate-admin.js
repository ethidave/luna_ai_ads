const { execSync } = require("child_process");
const path = require("path");

console.log("🚀 Starting admin migration...");

try {
  // Run the TypeScript migration
  execSync("npx tsx scripts/migrate-admin.ts", {
    stdio: "inherit",
    cwd: path.join(__dirname, ".."),
  });

  console.log("✅ Admin migration completed successfully!");
  console.log("🔑 Admin Login Credentials:");
  console.log("   📧 Email: admin@lunaai.com");
  console.log("   🔐 Password: admin123");
  console.log("🌐 Admin Panel: http://localhost:3001/admin/login");
} catch (error) {
  console.error("❌ Error during admin migration:", error.message);
  process.exit(1);
}
