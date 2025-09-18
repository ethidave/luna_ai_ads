import { useState, useCallback } from 'react';
import { adminApiService, AdminUser, AdminCampaign, AdminPackage, AdminPayment, PaymentSettings, AnalyticsResponse, PaymentStats } from '@/lib/services/adminApiService';

interface UseAdminApiReturn {
  loading: boolean;
  error: string | null;
  
  // User Management
  getUsers: () => Promise<AdminUser[] | null>;
  getUser: (id: number) => Promise<AdminUser | null>;
  createUser: (userData: any) => Promise<AdminUser | null>;
  updateUser: (id: number, userData: any) => Promise<AdminUser | null>;
  deleteUser: (id: number) => Promise<boolean>;
  
  // Campaign Management
  getCampaigns: () => Promise<AdminCampaign[] | null>;
  getCampaign: (id: number) => Promise<AdminCampaign | null>;
  createCampaign: (campaignData: any) => Promise<AdminCampaign | null>;
  updateCampaign: (id: number, campaignData: any) => Promise<AdminCampaign | null>;
  deleteCampaign: (id: number) => Promise<boolean>;
  
  // Package Management
  getPackages: () => Promise<AdminPackage[] | null>;
  getPackage: (id: number) => Promise<AdminPackage | null>;
  createPackage: (packageData: any) => Promise<AdminPackage | null>;
  updatePackage: (id: number, packageData: any) => Promise<AdminPackage | null>;
  deletePackage: (id: number) => Promise<boolean>;
  
  // Payment Management
  getPayments: () => Promise<AdminPayment[] | null>;
  getPayment: (id: number) => Promise<AdminPayment | null>;
  updatePayment: (id: number, paymentData: any) => Promise<AdminPayment | null>;
  refundPayment: (id: number, refundData: any) => Promise<AdminPayment | null>;
  deletePayment: (id: number) => Promise<boolean>;
  getPaymentStats: (timeRange?: string) => Promise<PaymentStats | null>;
  getPaymentSettings: () => Promise<PaymentSettings | null>;
  updatePaymentSettings: (settings: any) => Promise<PaymentSettings | null>;
  
  // Analytics
  getAnalytics: (timeRange?: string) => Promise<AnalyticsResponse | null>;
  
  // Reports
  getReports: (timeRange?: string) => Promise<any | null>;
  generateReport: (reportData: any) => Promise<any | null>;
  
  // Utility
  clearError: () => void;
}

export const useAdminApi = (): UseAdminApiReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiCall = useCallback(async <T>(
    apiCall: () => Promise<{ success: boolean; data?: T; error?: string; message?: string }>
  ): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall();
      
      if (response.success && response.data !== undefined) {
        return response.data;
      } else {
        setError(response.error || 'Operation failed');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // User Management
  const getUsers = useCallback(async (): Promise<AdminUser[] | null> => {
    return handleApiCall(() => adminApiService.getUsers());
  }, [handleApiCall]);

  const getUser = useCallback(async (id: number): Promise<AdminUser | null> => {
    return handleApiCall(() => adminApiService.getUser(id));
  }, [handleApiCall]);

  const createUser = useCallback(async (userData: any): Promise<AdminUser | null> => {
    return handleApiCall(() => adminApiService.createUser(userData));
  }, [handleApiCall]);

  const updateUser = useCallback(async (id: number, userData: any): Promise<AdminUser | null> => {
    return handleApiCall(() => adminApiService.updateUser(id, userData));
  }, [handleApiCall]);

  const deleteUser = useCallback(async (id: number): Promise<boolean> => {
    const result = await handleApiCall(() => adminApiService.deleteUser(id));
    return result !== null;
  }, [handleApiCall]);

  // Campaign Management
  const getCampaigns = useCallback(async (): Promise<AdminCampaign[] | null> => {
    return handleApiCall(() => adminApiService.getCampaigns());
  }, [handleApiCall]);

  const getCampaign = useCallback(async (id: number): Promise<AdminCampaign | null> => {
    return handleApiCall(() => adminApiService.getCampaign(id));
  }, [handleApiCall]);

  const createCampaign = useCallback(async (campaignData: any): Promise<AdminCampaign | null> => {
    return handleApiCall(() => adminApiService.createCampaign(campaignData));
  }, [handleApiCall]);

  const updateCampaign = useCallback(async (id: number, campaignData: any): Promise<AdminCampaign | null> => {
    return handleApiCall(() => adminApiService.updateCampaign(id, campaignData));
  }, [handleApiCall]);

  const deleteCampaign = useCallback(async (id: number): Promise<boolean> => {
    const result = await handleApiCall(() => adminApiService.deleteCampaign(id));
    return result !== null;
  }, [handleApiCall]);

  // Package Management
  const getPackages = useCallback(async (): Promise<AdminPackage[] | null> => {
    return handleApiCall(() => adminApiService.getPackages());
  }, [handleApiCall]);

  const getPackage = useCallback(async (id: number): Promise<AdminPackage | null> => {
    return handleApiCall(() => adminApiService.getPackage(id));
  }, [handleApiCall]);

  const createPackage = useCallback(async (packageData: any): Promise<AdminPackage | null> => {
    return handleApiCall(() => adminApiService.createPackage(packageData));
  }, [handleApiCall]);

  const updatePackage = useCallback(async (id: number, packageData: any): Promise<AdminPackage | null> => {
    return handleApiCall(() => adminApiService.updatePackage(id, packageData));
  }, [handleApiCall]);

  const deletePackage = useCallback(async (id: number): Promise<boolean> => {
    const result = await handleApiCall(() => adminApiService.deletePackage(id));
    return result !== null;
  }, [handleApiCall]);

  // Payment Management
  const getPayments = useCallback(async (): Promise<AdminPayment[] | null> => {
    return handleApiCall(() => adminApiService.getPayments());
  }, [handleApiCall]);

  const getPayment = useCallback(async (id: number): Promise<AdminPayment | null> => {
    return handleApiCall(() => adminApiService.getPayment(id));
  }, [handleApiCall]);

  const updatePayment = useCallback(async (id: number, paymentData: any): Promise<AdminPayment | null> => {
    return handleApiCall(() => adminApiService.updatePayment(id, paymentData));
  }, [handleApiCall]);

  const refundPayment = useCallback(async (id: number, refundData: any): Promise<AdminPayment | null> => {
    return handleApiCall(() => adminApiService.refundPayment(id, refundData));
  }, [handleApiCall]);

  const deletePayment = useCallback(async (id: number): Promise<boolean> => {
    const result = await handleApiCall(() => adminApiService.deletePayment(id));
    return result !== null;
  }, [handleApiCall]);

  const getPaymentStats = useCallback(async (timeRange: string = '30d'): Promise<PaymentStats | null> => {
    return handleApiCall(() => adminApiService.getPaymentStats(timeRange));
  }, [handleApiCall]);

  const getPaymentSettings = useCallback(async (): Promise<PaymentSettings | null> => {
    return handleApiCall(() => adminApiService.getPaymentSettings());
  }, [handleApiCall]);

  const updatePaymentSettings = useCallback(async (settings: any): Promise<PaymentSettings | null> => {
    return handleApiCall(() => adminApiService.updatePaymentSettings(settings));
  }, [handleApiCall]);

  // Analytics
  const getAnalytics = useCallback(async (timeRange: string = '7d'): Promise<AnalyticsResponse | null> => {
    return handleApiCall(() => adminApiService.getAnalytics(timeRange));
  }, [handleApiCall]);

  // Reports
  const getReports = useCallback(async (timeRange: string = '30d'): Promise<any | null> => {
    return handleApiCall(() => adminApiService.getReports());
  }, [handleApiCall]);

  const generateReport = useCallback(async (reportData: any): Promise<any | null> => {
    return handleApiCall(() => adminApiService.generateReport(reportData));
  }, [handleApiCall]);

  return {
    loading,
    error,
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getCampaigns,
    getCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    getPackages,
    getPackage,
    createPackage,
    updatePackage,
    deletePackage,
    getPayments,
    getPayment,
    updatePayment,
    refundPayment,
    deletePayment,
    getPaymentStats,
    getPaymentSettings,
    updatePaymentSettings,
    getAnalytics,
    getReports,
    generateReport,
    clearError,
  };
};
