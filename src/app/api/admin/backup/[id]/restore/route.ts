import { NextRequest, NextResponse } from 'next/server';
import { BackupService } from '@/lib/services/backupService';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const backupService = BackupService.getInstance();
    const settings = await backupService.restoreBackup(params.id);

    return NextResponse.json({
      success: true,
      data: settings,
      message: 'Settings restored successfully',
    });
  } catch (error) {
    console.error('Error restoring backup:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to restore backup' },
      { status: 500 }
    );
  }
}
