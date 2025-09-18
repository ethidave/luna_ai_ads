export interface SettingsBackup {
  id: string;
  name: string;
  description: string;
  timestamp: string;
  version: string;
  settings: any;
  size: number;
  type: 'manual' | 'scheduled' | 'auto';
  status: 'active' | 'archived' | 'deleted';
}

export interface BackupOptions {
  includeSettings: boolean;
  includeDatabase: boolean;
  includeFiles: boolean;
  includeLogs: boolean;
  compression: boolean;
  encryption: boolean;
}

export class BackupService {
  private static instance: BackupService;
  private backups: SettingsBackup[] = [];
  private readonly STORAGE_KEY = 'admin_settings_backups';

  private constructor() {
    this.loadBackups();
  }

  public static getInstance(): BackupService {
    if (!BackupService.instance) {
      BackupService.instance = new BackupService();
    }
    return BackupService.instance;
  }

  private loadBackups(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.backups = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading backups:', error);
      this.backups = [];
    }
  }

  private saveBackups(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.backups));
    } catch (error) {
      console.error('Error saving backups:', error);
    }
  }

  public async createBackup(
    settings: any,
    name: string,
    description: string = '',
    type: 'manual' | 'scheduled' | 'auto' = 'manual',
    options: BackupOptions = {
      includeSettings: true,
      includeDatabase: false,
      includeFiles: false,
      includeLogs: false,
      compression: true,
      encryption: false,
    }
  ): Promise<SettingsBackup> {
    const backup: SettingsBackup = {
      id: this.generateId(),
      name,
      description,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      settings: options.compression ? this.compressSettings(settings) : settings,
      size: this.calculateSize(settings),
      type,
      status: 'active',
    };

    this.backups.unshift(backup);
    this.saveBackups();

    // Auto-cleanup old backups (keep last 10)
    if (this.backups.length > 10) {
      this.backups = this.backups.slice(0, 10);
      this.saveBackups();
    }

    return backup;
  }

  public getBackups(): SettingsBackup[] {
    return this.backups.filter(backup => backup.status !== 'deleted');
  }

  public getBackup(id: string): SettingsBackup | undefined {
    return this.backups.find(backup => backup.id === id);
  }

  public async restoreBackup(id: string): Promise<any> {
    const backup = this.getBackup(id);
    if (!backup) {
      throw new Error('Backup not found');
    }

    if (backup.status !== 'active') {
      throw new Error('Cannot restore archived or deleted backup');
    }

    return backup.settings;
  }

  public async deleteBackup(id: string): Promise<boolean> {
    const backupIndex = this.backups.findIndex(backup => backup.id === id);
    if (backupIndex === -1) {
      return false;
    }

    this.backups[backupIndex].status = 'deleted';
    this.saveBackups();
    return true;
  }

  public async exportBackup(id: string): Promise<Blob> {
    const backup = this.getBackup(id);
    if (!backup) {
      throw new Error('Backup not found');
    }

    const exportData = {
      ...backup,
      exportedAt: new Date().toISOString(),
      exportedBy: 'admin',
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    return new Blob([jsonString], { type: 'application/json' });
  }

  public async importBackup(file: File): Promise<SettingsBackup> {
    try {
      const text = await file.text();
      const importedData = JSON.parse(text);

      // Validate backup structure
      if (!this.validateBackupStructure(importedData)) {
        throw new Error('Invalid backup file format');
      }

      const backup: SettingsBackup = {
        ...importedData,
        id: this.generateId(),
        timestamp: new Date().toISOString(),
        status: 'active',
      };

      this.backups.unshift(backup);
      this.saveBackups();

      return backup;
    } catch (error) {
      throw new Error('Failed to import backup: ' + error);
    }
  }

  public async scheduleBackup(
    settings: any,
    frequency: 'daily' | 'weekly' | 'monthly',
    time: string = '02:00'
  ): Promise<void> {
    // This would integrate with a cron job or scheduled task system
    // For now, we'll just store the schedule preference
    const scheduleData = {
      frequency,
      time,
      lastRun: null,
      nextRun: this.calculateNextRun(frequency, time),
    };

    localStorage.setItem('backup_schedule', JSON.stringify(scheduleData));
  }

  public getBackupStats(): {
    total: number;
    totalSize: number;
    lastBackup: string | null;
    nextScheduled: string | null;
  } {
    const activeBackups = this.backups.filter(backup => backup.status === 'active');
    const totalSize = activeBackups.reduce((sum, backup) => sum + backup.size, 0);
    const lastBackup = activeBackups.length > 0 ? activeBackups[0].timestamp : null;
    
    const scheduleData = localStorage.getItem('backup_schedule');
    const nextScheduled = scheduleData ? JSON.parse(scheduleData).nextRun : null;

    return {
      total: activeBackups.length,
      totalSize,
      lastBackup,
      nextScheduled,
    };
  }

  private generateId(): string {
    return 'backup_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private compressSettings(settings: any): any {
    // Simple compression by removing empty values and nulls
    return JSON.parse(JSON.stringify(settings, (key, value) => {
      if (value === null || value === '' || value === undefined) {
        return undefined;
      }
      return value;
    }));
  }

  private calculateSize(settings: any): number {
    return new Blob([JSON.stringify(settings)]).size;
  }

  private validateBackupStructure(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      typeof data.name === 'string' &&
      typeof data.settings === 'object' &&
      typeof data.timestamp === 'string'
    );
  }

  private calculateNextRun(frequency: string, time: string): string {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    
    let nextRun = new Date(now);
    nextRun.setHours(hours, minutes, 0, 0);

    switch (frequency) {
      case 'daily':
        if (nextRun <= now) {
          nextRun.setDate(nextRun.getDate() + 1);
        }
        break;
      case 'weekly':
        nextRun.setDate(nextRun.getDate() + 7);
        break;
      case 'monthly':
        nextRun.setMonth(nextRun.getMonth() + 1);
        break;
    }

    return nextRun.toISOString();
  }

  public formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  public formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}
