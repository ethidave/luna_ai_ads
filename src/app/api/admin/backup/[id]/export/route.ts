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

    const exportData = {
      ...backup,
      exportedAt: new Date().toISOString(),
      exportedBy: 'admin',
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });

    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="backup_${params.id}.json"`,
      },
    });
  } catch (error) {
    console.error('Error exporting backup:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export backup' },
      { status: 500 }
    );
  }
}
