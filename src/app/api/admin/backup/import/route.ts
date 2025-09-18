import { NextRequest, NextResponse } from 'next/server';
import { BackupService } from '@/lib/services/backupService';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/json') {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Please upload a JSON file.' },
        { status: 400 }
      );
    }

    const backupService = BackupService.getInstance();
    const backup = await backupService.importBackup(file);

    return NextResponse.json({
      success: true,
      data: backup,
      message: 'Backup imported successfully',
    });
  } catch (error) {
    console.error('Error importing backup:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to import backup' },
      { status: 500 }
    );
  }
}
