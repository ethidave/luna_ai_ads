import { useState, useEffect } from 'react';
import { BackupService, SettingsBackup, BackupOptions } from '@/lib/services/backupService';

export interface UseBackupReturn {
  backups: SettingsBackup[];
  stats: {
    total: number;
    totalSize: number;
    lastBackup: string | null;
    nextScheduled: string | null;
  };
  isLoading: boolean;
  error: string | null;
  createBackup: (
    settings: any,
    name: string,
    description?: string,
    type?: 'manual' | 'scheduled' | 'auto',
    options?: BackupOptions
  ) => Promise<SettingsBackup>;
  restoreBackup: (id: string) => Promise<any>;
  deleteBackup: (id: string) => Promise<boolean>;
  exportBackup: (id: string) => Promise<Blob>;
  importBackup: (file: File) => Promise<SettingsBackup>;
  scheduleBackup: (settings: any, frequency: string, time: string) => Promise<void>;
  refreshBackups: () => void;
}

export function useBackup(): UseBackupReturn {
  const [backups, setBackups] = useState<SettingsBackup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const backupService = BackupService.getInstance();

  const stats = backupService.getBackupStats();

  const loadBackups = () => {
    try {
      const allBackups = backupService.getBackups();
      setBackups(allBackups);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load backups');
    }
  };

  useEffect(() => {
    loadBackups();
  }, []);

  const createBackup = async (
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
  ): Promise<SettingsBackup> => {
    setIsLoading(true);
    setError(null);

    try {
      const backup = await backupService.createBackup(
        settings,
        name,
        description,
        type,
        options
      );
      loadBackups();
      return backup;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create backup';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const restoreBackup = async (id: string): Promise<any> => {
    setIsLoading(true);
    setError(null);

    try {
      const settings = await backupService.restoreBackup(id);
      return settings;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to restore backup';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBackup = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const success = await backupService.deleteBackup(id);
      if (success) {
        loadBackups();
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete backup';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const exportBackup = async (id: string): Promise<Blob> => {
    setIsLoading(true);
    setError(null);

    try {
      const blob = await backupService.exportBackup(id);
      return blob;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export backup';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const importBackup = async (file: File): Promise<SettingsBackup> => {
    setIsLoading(true);
    setError(null);

    try {
      const backup = await backupService.importBackup(file);
      loadBackups();
      return backup;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import backup';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const scheduleBackup = async (
    settings: any,
    frequency: string,
    time: string
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await backupService.scheduleBackup(settings, frequency as any, time);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to schedule backup';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBackups = () => {
    loadBackups();
  };

  return {
    backups,
    stats,
    isLoading,
    error,
    createBackup,
    restoreBackup,
    deleteBackup,
    exportBackup,
    importBackup,
    scheduleBackup,
    refreshBackups,
  };
}
