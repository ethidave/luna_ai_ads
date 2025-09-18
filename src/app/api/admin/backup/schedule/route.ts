import { NextRequest, NextResponse } from 'next/server';
import { BackupService } from '@/lib/services/backupService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings, frequency, time } = body;

    if (!settings || !frequency || !time) {
      return NextResponse.json(
        { success: false, error: 'Settings, frequency, and time are required' },
        { status: 400 }
      );
    }

    const backupService = BackupService.getInstance();
    await backupService.scheduleBackup(settings, frequency, time);

    return NextResponse.json({
      success: true,
      message: 'Backup schedule updated successfully',
    });
  } catch (error) {
    console.error('Error scheduling backup:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to schedule backup' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const scheduleData = localStorage.getItem('backup_schedule');
    const schedule = scheduleData ? JSON.parse(scheduleData) : null;

    return NextResponse.json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    console.error('Error fetching backup schedule:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch backup schedule' },
      { status: 500 }
    );
  }
}
