// Simple test script to verify backup functionality
// Run this in browser console to test backup service

const testBackupService = async () => {
  console.log("🧪 Testing Backup Service...");

  try {
    // Import the backup service
    const { BackupService } = await import("./services/backupService.ts");
    const backupService = BackupService.getInstance();

    // Test data
    const testSettings = {
      siteName: "Test Site",
      adminEmail: "test@example.com",
      timezone: "UTC",
      language: "en",
      security: {
        twoFactor: true,
        sessionTimeout: 30,
        passwordMinLength: 8,
      },
      payments: {
        stripe: {
          enabled: false,
          publicKey: "test_key",
        },
      },
    };

    console.log("📦 Creating test backup...");
    const backup = await backupService.createBackup(
      testSettings,
      "Test Backup",
      "This is a test backup",
      "manual",
      {
        includeSettings: true,
        includeDatabase: false,
        includeFiles: false,
        includeLogs: false,
        compression: true,
        encryption: false,
      }
    );

    console.log("✅ Backup created:", backup);

    // Test getting backups
    console.log("📋 Fetching all backups...");
    const allBackups = backupService.getBackups();
    console.log("✅ All backups:", allBackups);

    // Test backup stats
    console.log("📊 Getting backup stats...");
    const stats = backupService.getBackupStats();
    console.log("✅ Backup stats:", stats);

    // Test restore
    console.log("🔄 Testing restore...");
    const restoredSettings = await backupService.restoreBackup(backup.id);
    console.log("✅ Restored settings:", restoredSettings);

    // Test export
    console.log("📤 Testing export...");
    const exportBlob = await backupService.exportBackup(backup.id);
    console.log("✅ Export blob size:", exportBlob.size, "bytes");

    // Test delete
    console.log("🗑️ Testing delete...");
    const deleteResult = await backupService.deleteBackup(backup.id);
    console.log("✅ Delete result:", deleteResult);

    // Verify deletion
    const remainingBackups = backupService.getBackups();
    console.log("✅ Remaining backups:", remainingBackups.length);

    console.log("🎉 All tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
};

// Export for use in browser console
if (typeof window !== "undefined") {
  window.testBackupService = testBackupService;
  console.log(
    "💡 Run testBackupService() in console to test backup functionality"
  );
}

export { testBackupService };
