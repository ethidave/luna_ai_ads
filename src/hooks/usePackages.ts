import { useState, useEffect } from 'react';
import { laravelPackageService, Package, Subscription, PurchasePackageData } from '@/lib/services/laravelPackageService';

export const usePackages = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [currentPackage, setCurrentPackage] = useState<Package | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await laravelPackageService.getPackages();
      
      if (response.success && response.packages) {
        setPackages(response.packages);
      } else {
        setError(response.error || 'Failed to fetch packages');
      }
    } catch (err) {
      setError('Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailablePackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await laravelPackageService.getAvailablePackages();
      
      if (response.success && response.packages) {
        setPackages(response.packages);
      } else {
        setError(response.error || 'Failed to fetch available packages');
      }
    } catch (err) {
      setError('Failed to fetch available packages');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentPackage = async () => {
    try {
      setError(null);
      const response = await laravelPackageService.getCurrentPackage();
      
      if (response.success) {
        setCurrentPackage(response.package || null);
        setCurrentSubscription(response.subscription || null);
      } else {
        setError(response.error || 'Failed to fetch current package');
      }
    } catch (err) {
      setError('Failed to fetch current package');
    }
  };

  const purchasePackage = async (data: PurchasePackageData) => {
    try {
      setError(null);
      const response = await laravelPackageService.purchasePackage(data);
      
      if (response.success && response.subscription) {
        setCurrentSubscription(response.subscription);
        // Refresh current package
        await fetchCurrentPackage();
        return { success: true, subscription: response.subscription };
      } else {
        setError(response.error || 'Failed to purchase package');
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMessage = 'Failed to purchase package';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const cancelPackage = async () => {
    try {
      setError(null);
      const response = await laravelPackageService.cancelPackage();
      
      if (response.success) {
        setCurrentSubscription(null);
        setCurrentPackage(null);
        return { success: true };
      } else {
        setError(response.error || 'Failed to cancel package');
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMessage = 'Failed to cancel package';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const fetchPackageUpgrades = async () => {
    try {
      setError(null);
      const response = await laravelPackageService.getPackageUpgrades();
      
      if (response.success && response.upgrades) {
        return { success: true, upgrades: response.upgrades };
      } else {
        setError(response.error || 'Failed to fetch package upgrades');
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMessage = 'Failed to fetch package upgrades';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    fetchPackages();
    fetchCurrentPackage();
  }, []);

  return {
    packages,
    currentPackage,
    currentSubscription,
    loading,
    error,
    fetchPackages,
    fetchAvailablePackages,
    fetchCurrentPackage,
    purchasePackage,
    cancelPackage,
    fetchPackageUpgrades,
  };
};

