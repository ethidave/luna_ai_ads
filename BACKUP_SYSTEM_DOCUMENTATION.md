# Admin Settings Backup System Documentation

## Overview

The Admin Settings Backup System provides comprehensive backup and restore functionality for the LunaLuna AI admin panel settings. It allows administrators to create, manage, restore, and schedule backups of their configuration settings.

## Features

### 🔄 Core Functionality

- **Create Backups**: Manual, scheduled, and automatic backup creation
- **Restore Settings**: One-click restore from any backup
- **Export/Import**: Backup files can be exported and imported
- **Backup Management**: View, delete, and organize backups
- **Scheduling**: Automatic backup scheduling (daily, weekly, monthly)
- **Compression**: Automatic data compression to save space
- **Version Control**: Track backup versions and timestamps

### 📊 Backup Contents

The system backs up all admin settings including:

- General settings (site name, email, timezone, language)
- Security configurations (2FA, password requirements, IP whitelist)
- Notification settings (email, SMS, push notifications)
- Social media links and configurations
- Payment gateway settings (Stripe, PayPal, Razorpay, etc.)
- Database configurations
- System preferences (file uploads, cache, CDN)
- API settings (rate limiting, CORS, webhooks)
- Theme customizations (colors, branding, custom CSS)

## Architecture

### Components

#### 1. BackupService (`src/lib/services/backupService.ts`)

- Singleton service managing all backup operations
- Handles backup creation, restoration, deletion, export/import
- Manages backup storage in localStorage
- Provides compression and optimization features

#### 2. BackupModal (`src/components/admin/BackupModal.tsx`)

- React component for backup management UI
- Three tabs: Create, Manage, Schedule
- Real-time backup statistics and management
- File upload/download functionality

#### 3. useBackup Hook (`src/hooks/useBackup.ts`)

- Custom React hook for backup operations
- Provides state management and error handling
- Simplifies integration with components

#### 4. API Endpoints

- `GET /api/admin/backup` - List all backups and stats
- `POST /api/admin/backup` - Create new backup
- `GET /api/admin/backup/[id]` - Get specific backup
- `DELETE /api/admin/backup/[id]` - Delete backup
- `POST /api/admin/backup/[id]/restore` - Restore backup
- `GET /api/admin/backup/[id]/export` - Export backup file
- `POST /api/admin/backup/import` - Import backup file
- `POST /api/admin/backup/schedule` - Schedule automatic backups

## Usage

### Creating a Backup

#### Manual Backup

```typescript
import { BackupService } from "@/lib/services/backupService";

const backupService = BackupService.getInstance();
const backup = await backupService.createBackup(
  currentSettings,
  "My Backup",
  "Description of this backup",
  "manual",
  {
    includeSettings: true,
    compression: true,
    encryption: false,
  }
);
```

#### Using the Hook

```typescript
import { useBackup } from "@/hooks/useBackup";

function MyComponent() {
  const { createBackup, isLoading, error } = useBackup();

  const handleCreateBackup = async () => {
    try {
      await createBackup(settings, "Backup Name");
    } catch (error) {
      console.error("Backup failed:", error);
    }
  };
}
```

### Restoring a Backup

```typescript
const settings = await backupService.restoreBackup(backupId);
// Apply restored settings to your application
```

### Exporting/Importing Backups

```typescript
// Export
const blob = await backupService.exportBackup(backupId);
const url = URL.createObjectURL(blob);
// Download the file

// Import
const file = // File from input
const backup = await backupService.importBackup(file);
```

### Scheduling Backups

```typescript
await backupService.scheduleBackup(
  settings,
  "daily", // or 'weekly', 'monthly'
  "02:00" // Time in HH:MM format
);
```

## UI Integration

### Adding Backup Tab to Settings

The backup functionality is integrated into the admin settings page with a dedicated "Backup" tab that provides:

1. **Quick Actions**:

   - Create Backup button
   - Quick Backup (with default settings)
   - View Backups button

2. **Backup Information**:

   - What's included in backups
   - Backup features and capabilities
   - Best practices guide

3. **Backup Modal**:
   - Create new backups with custom options
   - Manage existing backups
   - Schedule automatic backups
   - Export/import functionality

### Backup Statistics

The system displays real-time statistics:

- Total number of backups
- Total storage used
- Last backup timestamp
- Next scheduled backup time

## Storage

### Local Storage

- Backups are stored in browser's localStorage
- Automatic cleanup (keeps last 10 backups)
- Compressed storage to optimize space usage

### Backup Format

```json
{
  "id": "backup_1234567890_abc123",
  "name": "My Backup",
  "description": "Backup description",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "settings": {
    /* compressed settings object */
  },
  "size": 1024,
  "type": "manual",
  "status": "active"
}
```

## Security

### Data Protection

- Sensitive data is not logged
- Backup files are validated before import
- Secure deletion of backup data
- No external data transmission

### Access Control

- Admin-only access to backup functionality
- Authentication required for all operations
- Backup operations are logged

## Error Handling

The system includes comprehensive error handling:

```typescript
try {
  const backup = await createBackup(settings, name);
} catch (error) {
  if (error.message.includes("not found")) {
    // Handle backup not found
  } else if (error.message.includes("invalid")) {
    // Handle invalid backup format
  } else {
    // Handle general errors
  }
}
```

## Testing

### Manual Testing

Run the test script in browser console:

```javascript
// Import and run test
import { testBackupService } from "./lib/test-backup.js";
testBackupService();
```

### Test Coverage

- Backup creation and validation
- Restore functionality
- Export/import operations
- Delete operations
- Error handling
- Storage management

## Best Practices

### Backup Strategy

1. **Regular Backups**: Create backups before major changes
2. **Scheduled Backups**: Set up automatic daily backups for production
3. **Export Backups**: Regularly export backups for off-site storage
4. **Test Restores**: Periodically test restore functionality
5. **Version Control**: Keep multiple backup versions for rollback options

### Performance Optimization

1. **Compression**: Enable compression to save storage space
2. **Cleanup**: Regularly clean up old backups
3. **Selective Backup**: Only backup necessary settings
4. **Scheduled Timing**: Schedule backups during low-traffic periods

## Troubleshooting

### Common Issues

#### Backup Creation Fails

- Check available storage space
- Verify settings object is valid
- Ensure proper permissions

#### Restore Fails

- Verify backup file is not corrupted
- Check backup version compatibility
- Ensure sufficient permissions

#### Import Fails

- Verify file format is JSON
- Check file size limits
- Validate backup structure

### Debug Mode

Enable debug logging by setting:

```javascript
localStorage.setItem("backup_debug", "true");
```

## Future Enhancements

### Planned Features

- Cloud storage integration (AWS S3, Google Drive)
- Backup encryption with custom keys
- Backup comparison and diff viewing
- Automated backup testing
- Multi-environment backup management
- Backup analytics and reporting

### API Improvements

- GraphQL support for complex queries
- WebSocket updates for real-time status
- Batch operations for multiple backups
- Advanced filtering and search

## Support

For issues or questions regarding the backup system:

1. Check the troubleshooting section
2. Review error messages in console
3. Test with the provided test script
4. Contact the development team

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Compatibility**: Next.js 14+, React 18+
