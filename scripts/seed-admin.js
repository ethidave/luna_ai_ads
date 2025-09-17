const { execSync } = require("child_process");
const path = require("path");

console.log("🌱 Seeding admin user...");

try {
  // Run the TypeScript seeder
  execSync("npx tsx src/lib/seed-admin.ts", {
    stdio: "inherit",
    cwd: path.join(__dirname, ".."),
  });

  console.log("✅ Admin user seeded successfully!");
  console.log("📧 Email: admin@lunaai.com");
  console.log("🔑 Password: admin123");
  console.log("🔗 Admin Login: http://localhost:3000/admin/login");
} catch (error) {
  console.error("❌ Error seeding admin user:", error.message);
  process.exit(1);
}
