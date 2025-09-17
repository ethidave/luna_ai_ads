import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "moderator" | "user";
}

export async function requireAdminAuth(request: NextRequest): Promise<AdminUser> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error("Unauthorized: No session found");
  }

  // Check if user has admin privileges from session
  if (!session.user.isAdmin) {
    throw new Error("Forbidden: Admin privileges required");
  }
  
  const user: AdminUser = {
    id: session.user.id || "1",
    email: session.user.email || "",
    name: session.user.name || "",
    role: session.user.role as "admin" | "moderator" | "user" || "user",
  };

  // Check if user has admin privileges
  if (user.role !== "admin" && user.role !== "moderator") {
    throw new Error("Forbidden: Insufficient permissions");
  }

  return user;
}

export function isAdmin(user: AdminUser): boolean {
  return user.role === "admin";
}

export function isModerator(user: AdminUser): boolean {
  return user.role === "admin" || user.role === "moderator";
}

export function canManageUsers(user: AdminUser): boolean {
  return user.role === "admin";
}

export function canManagePackages(user: AdminUser): boolean {
  return user.role === "admin";
}

export function canManageCampaigns(user: AdminUser): boolean {
  return user.role === "admin" || user.role === "moderator";
}

export function canViewAnalytics(user: AdminUser): boolean {
  return user.role === "admin" || user.role === "moderator";
}

export function canManagePayments(user: AdminUser): boolean {
  return user.role === "admin";
}

export function canManageReports(user: AdminUser): boolean {
  return user.role === "admin" || user.role === "moderator";
}

export function canManageSettings(user: AdminUser): boolean {
  return user.role === "admin";
}
