import { NextRequest, NextResponse } from 'next/server';
import { BackupService } from '@/lib/services/backupService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const backupService = BackupService.getInstance();
    const backup = backupService.getBackup(params.id);

    if (!backup) {
      return NextResponse.json(
        { success: false, error: 'Backup not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: backup,
    });
  } catch (error) {
    console.error('Error fetching backup:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch backup' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const backupService = BackupService.getInstance();
    const success = await backupService.deleteBackup(params.id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Backup not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Backup deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting backup:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete backup' },
      { status: 500 }
    );
  }
}
