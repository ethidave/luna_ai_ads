import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { TokenManager } from '@/lib/auth/tokenManager';
import { AppDataSource } from '@/lib/database';
import { User } from '@/lib/entities/User';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: session.user.id }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate new token
    const newToken = TokenManager.generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.avatar,
    });

    // Generate refresh token
    const refreshToken = TokenManager.generateRefreshToken(user.id);

    return NextResponse.json({
      success: true,
      token: newToken,
      refreshToken: refreshToken,
      expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = TokenManager.extractTokenFromRequest(request);
    
    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const payload = TokenManager.verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const timeUntilExpiration = TokenManager.getTimeUntilExpiration(token);
    const needsRefresh = TokenManager.needsRefresh(token);

    return NextResponse.json({
      valid: true,
      payload: {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        image: payload.image,
      },
      expiresAt: new Date(payload.exp * 1000).toISOString(),
      timeUntilExpiration: timeUntilExpiration,
      needsRefresh: needsRefresh,
    });

  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { error: 'Token validation failed' },
      { status: 500 }
    );
  }
}

