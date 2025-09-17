import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/services/emailService';
import { AppDataSource } from '@/lib/database';
import { User } from '@/lib/entities/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { success: false, message: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { resetToken: token }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid reset token' },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (user.resetExpires && new Date() > user.resetExpires) {
      return NextResponse.json(
        { success: false, message: 'Reset token has expired' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetExpires = null;
    await userRepository.save(user);

    // Send confirmation email
    await emailService.sendPasswordResetConfirmationEmail(
      user.email,
      user.name || user.email
    );

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

