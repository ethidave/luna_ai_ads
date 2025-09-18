"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useLaravelAuth } from "@/hooks/useLaravelAuth";
import { User } from "@/lib/services/authService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    user?: User;
    token?: string;
    error?: string;
  }>;
  adminLogin: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    user?: User;
    token?: string;
    error?: string;
  }>;
  register: (
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (
    email: string
  ) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (
    token: string,
    password: string,
    password_confirmation: string
  ) => Promise<{ success: boolean; error?: string }>;
  verifyEmail: (token: string) => Promise<{ success: boolean; error?: string }>;
  sendVerification: () => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: any) => Promise<{ success: boolean; error?: string }>;
  changePassword: (data: any) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: (data: any) => Promise<{ success: boolean; error?: string }>;
  refreshToken: () => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    user,
    loading,
    error,
    login,
    adminLogin,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    sendVerification,
    updateProfile,
    changePassword,
    deleteAccount,
    refreshToken,
    isAuthenticated,
    isAdmin,
  } = useLaravelAuth();

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        adminLogin,
        register,
        logout,
        forgotPassword,
        resetPassword,
        verifyEmail,
        sendVerification,
        updateProfile,
        changePassword,
        deleteAccount,
        refreshToken,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
