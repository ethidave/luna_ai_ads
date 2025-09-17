import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Mock data (in a real app, this would be in a database)
let mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
    plan: "enterprise",
    totalSpent: 2500.00,
    campaigns: 12,
    lastActive: "2024-01-15T10:30:00Z",
    createdAt: "2023-06-15T08:00:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    status: "active",
    plan: "professional",
    totalSpent: 850.00,
    campaigns: 5,
    lastActive: "2024-01-14T15:45:00Z",
    createdAt: "2023-08-20T12:00:00Z",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "moderator",
    status: "inactive",
    plan: "starter",
    totalSpent: 150.00,
    campaigns: 2,
    lastActive: "2024-01-10T09:15:00Z",
    createdAt: "2023-11-10T14:30:00Z",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    role: "user",
    status: "suspended",
    plan: "professional",
    totalSpent: 1200.00,
    campaigns: 8,
    lastActive: "2024-01-05T16:20:00Z",
    createdAt: "2023-09-05T10:15:00Z",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david@example.com",
    role: "user",
    status: "active",
    plan: "starter",
    totalSpent: 300.00,
    campaigns: 3,
    lastActive: "2024-01-15T11:00:00Z",
    createdAt: "2023-12-01T09:45:00Z",
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const user = mockUsers.find(u => u.id === id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { name, email, role, status, plan, totalSpent, campaigns } = body;

    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user
    const updatedUser = {
      ...mockUsers[userIndex],
      name: name || mockUsers[userIndex].name,
      email: email || mockUsers[userIndex].email,
      role: role || mockUsers[userIndex].role,
      status: status || mockUsers[userIndex].status,
      plan: plan || mockUsers[userIndex].plan,
      totalSpent: totalSpent !== undefined ? totalSpent : mockUsers[userIndex].totalSpent,
      campaigns: campaigns !== undefined ? campaigns : mockUsers[userIndex].campaigns,
      lastActive: new Date().toISOString(),
    };

    mockUsers[userIndex] = updatedUser;

    return NextResponse.json({
      user: updatedUser,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const userIndex = mockUsers.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete user
    const deletedUser = mockUsers.splice(userIndex, 1)[0];

    return NextResponse.json({
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
