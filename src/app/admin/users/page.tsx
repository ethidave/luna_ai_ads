"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Shield,
  Crown,
  AlertTriangle,
  CheckCircle,
  Download,
  RefreshCw,
  X,
  Lock,
  Unlock,
} from "lucide-react";
import UserModal from "@/components/admin/UserModal";
import { useAdminApi } from "@/hooks/useAdminApi";
import { AdminUser } from "@/lib/services/adminApiService";
import {
  AdminErrorBoundary,
  ErrorMessage,
  NoDataMessage,
  LoadingSpinner,
} from "@/components/admin/ErrorBoundary";

interface UserFormData {
  name: string;
  email: string;
  password?: string;
  is_admin?: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [success, setSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | undefined>();
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  );

  const {
    loading,
    error,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    clearError,
  } = useAdminApi();

  // Fetch users from database
  const fetchUsers = async () => {
    const data = await getUsers();
    if (data && Array.isArray(data)) {
      // Ensure all users have required properties with fallbacks
      const safeUsers = data.map((user) => ({
        ...user,
        name: user.name || "Unknown User",
        email: user.email || "No email",
        is_admin: user.is_admin || false,
        email_verified_at: user.email_verified_at || null,
        created_at: user.created_at || new Date().toISOString(),
        updated_at: user.updated_at || new Date().toISOString(),
      }));

      setUsers(safeUsers);
      setSuccess(`Successfully loaded ${safeUsers.length} users`);
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter and sort users
  const filteredUsers = users
    .filter((user) => {
      // Safe string checks with null/undefined handling
      const userName = user.name || "";
      const userEmail = user.email || "";

      const matchesSearch =
        userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        userEmail.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole =
        roleFilter === "all" ||
        (roleFilter === "admin" ? user.is_admin : !user.is_admin);
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof AdminUser];
      let bValue = b[sortBy as keyof AdminUser];

      // Handle undefined/null values safely
      if (aValue === undefined || aValue === null) aValue = "";
      if (bValue === undefined || bValue === null) bValue = "";

      // Convert to string and lowercase for comparison
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (sortOrder === "asc") {
        return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
      } else {
        return aStr > bStr ? -1 : aStr < bStr ? 1 : 0;
      }
    });

  // CRUD Operations
  const handleCreateUser = async (userData: UserFormData) => {
    const newUser = await createUser(userData);
    if (newUser) {
      setUsers([...users, newUser]);
      setSuccess("User created successfully");
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleUpdateUser = async (userId: number, userData: UserFormData) => {
    const updatedUser = await updateUser(userId, userData);
    if (updatedUser) {
      setUsers(users.map((user) => (user.id === userId ? updatedUser : user)));
      setSuccess("User updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    const success = await deleteUser(userId);
    if (success) {
      setUsers(users.filter((user) => user.id !== userId));
      setSuccess("User deleted successfully");
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  // UI Handlers
  const handleAddUser = () => {
    setSelectedUser(undefined);
    setModalMode("create");
    setShowModal(true);
  };

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleViewUser = (user: AdminUser) => {
    setSelectedUser(user);
    setModalMode("view");
    setShowModal(true);
  };

  const handleSaveUser = (userData: UserFormData) => {
    if (modalMode === "create") {
      handleCreateUser(userData);
    } else if (modalMode === "edit" && selectedUser) {
      handleUpdateUser(selectedUser.id, userData);
    }
    setShowModal(false);
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  const handleExport = () => {
    const csvContent = [
      [
        "Name",
        "Email",
        "Role",
        "Status",
        "Plan",
        "Total Spent",
        "Campaigns",
        "Last Active",
        "Created At",
      ],
      ...filteredUsers.map((user) => [
        user.name,
        user.email,
        user.is_admin ? "Admin" : "User",
        user.email_verified_at ? "Verified" : "Unverified",
        "N/A", // plan
        "0.00", // totalSpent
        "0", // campaigns
        "N/A", // lastActive
        new Date(user.created_at).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Utility Functions
  const getRoleIcon = (isAdmin: boolean) => {
    return isAdmin ? Crown : Users;
  };

  const getRoleColor = (isAdmin: boolean) => {
    return isAdmin
      ? "text-purple-400 bg-purple-500/10 border-purple-500/20"
      : "text-gray-400 bg-gray-500/10 border-gray-500/20";
  };

  return (
    <AdminErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              User Management
            </h1>
            <p className="text-white/70">
              Manage users, roles, and permissions
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={handleAddUser}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400">{success}</span>
            <button
              onClick={() => setSuccess("")}
              className="ml-auto text-green-400 hover:text-green-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <ErrorMessage error={error} onRetry={handleRefresh} />

        {/* Filters and Search */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <div className="flex items-center space-x-2">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-");
                  setSortBy(field);
                  setSortOrder(order as "asc" | "desc");
                }}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="email-asc">Email A-Z</option>
                <option value="email-desc">Email Z-A</option>
                <option value="created_at-desc">Newest First</option>
                <option value="created_at-asc">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="text-white/70 text-sm">Total Users</div>
            <div className="text-2xl font-bold text-white">{users.length}</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="text-white/70 text-sm">Admins</div>
            <div className="text-2xl font-bold text-purple-400">
              {users.filter((u) => u.is_admin).length}
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="text-white/70 text-sm">Regular Users</div>
            <div className="text-2xl font-bold text-blue-400">
              {users.filter((u) => !u.is_admin).length}
            </div>
          </div>
        </div>

        {/* No Data State */}
        {!loading && !error && filteredUsers.length === 0 && (
          <NoDataMessage
            title={
              searchQuery || roleFilter !== "all"
                ? "No users found"
                : "No users available"
            }
            description={
              searchQuery || roleFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "There are no users in the database yet."
            }
            action={
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Refresh
                </button>
                {!searchQuery && roleFilter === "all" && (
                  <button
                    onClick={handleAddUser}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add First User
                  </button>
                )}
              </div>
            }
          />
        )}

        {/* Users Table */}
        {filteredUsers.length > 0 && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 text-left text-white font-medium">
                      User
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-white font-medium">
                      Role
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-white font-medium">
                      Email Verified
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-white font-medium">
                      Created At
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-white font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredUsers.map((user) => {
                    const RoleIcon = getRoleIcon(user.is_admin);
                    return (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hover:bg-white/5 transition-colors duration-200"
                      >
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {(user.name || "U")
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <div className="text-white font-medium truncate">
                                {user.name || "Unknown User"}
                              </div>
                              <div className="text-white/70 text-sm truncate">
                                {user.email || "No email"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <RoleIcon className="w-4 h-4 text-white/70" />
                            <span className="text-white capitalize">
                              {user.is_admin ? "Admin" : "User"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${
                              user.email_verified_at
                                ? "text-green-400 bg-green-500/10 border-green-500/20"
                                : "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
                            }`}
                          >
                            {user.email_verified_at ? "Verified" : "Pending"}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <span className="text-white/70 text-sm">
                            {new Date(user.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewUser(user)}
                              className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all duration-300"
                              title="View User"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditUser(user)}
                              className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-all duration-300"
                              title="Edit User"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* User Modal */}
        <UserModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          user={selectedUser}
          mode={modalMode}
          onSave={handleSaveUser}
          loading={loading}
        />
      </div>
    </AdminErrorBoundary>
  );
}
