import { NextRequest, NextResponse } from 'next/server';
import { BackupService } from '@/lib/services/backupService';

export async function GET(request: NextRequest) {
  try {
    const backupService = BackupService.getInstance();
    const backups = backupService.getBackups();
    const stats = backupService.getBackupStats();

    return NextResponse.json({
      success: true,
      data: {
        backups,
        stats,
      },
    });
  } catch (error) {
    console.error('Error fetching backups:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch backups' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings, name, description, type, options } = body;

    if (!settings || !name) {
      return NextResponse.json(
        { success: false, error: 'Settings and name are required' },
        { status: 400 }
      );
    }

    const backupService = BackupService.getInstance();
    const backup = await backupService.createBackup(
      settings,
      name,
      description || '',
      type || 'manual',
      options || {
        includeSettings: true,
        includeDatabase: false,
        includeFiles: false,
        includeLogs: false,
        compression: true,
        encryption: false,
      }
    );

    return NextResponse.json({
      success: true,
      data: backup,
    });
  } catch (error) {
    console.error('Error creating backup:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create backup' },
      { status: 500 }
    );
  }
}
