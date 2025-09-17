import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/lib/crypto/payment';
import { AppDataSource } from '@/lib/database';
import { Payment } from '@/lib/entities/Payment';
import { Wallet } from '@/lib/entities/Wallet';
import { User } from '@/lib/entities/User';

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, userId } = await request.json();

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userRepository = AppDataSource.getRepository(User);
    const walletRepository = AppDataSource.getRepository(Wallet);
    const paymentRepository = AppDataSource.getRepository(Payment);

    // Verify user exists
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's wallet
    const wallet = await walletRepository.findOne({ where: { userId } });
    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      );
    }

    // Create payment record
    const payment = paymentRepository.create({
      type: 'deposit',
      method: currency.toLowerCase(),
      amount: parseFloat(amount),
      userId,
      status: 'pending',
      description: `Deposit ${amount} ${currency}`
    });

    const savedPayment = await paymentRepository.save(payment);

    // Generate payment QR code data
    const qrData = paymentService.generatePaymentQR({
      amount: parseFloat(amount),
      currency: currency,
      recipientAddress: process.env.PLATFORM_WALLET_ADDRESS!,
      description: `Deposit for ${user.name}`
    });

    // Get exchange rates
    const exchangeRates = await paymentService.getExchangeRates();
    const usdValue = parseFloat(amount) * (exchangeRates[currency] || 1);

    return NextResponse.json({
      success: true,
      payment: {
        id: savedPayment.id,
        amount,
        currency,
        usdValue,
        qrData,
        status: 'pending'
      },
      message: 'Payment request created successfully'
    });

  } catch (error) {
    console.error('Deposit error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionHash = searchParams.get('hash');
    const currency = searchParams.get('currency');

    if (!transactionHash || !currency) {
      return NextResponse.json(
        { error: 'Transaction hash and currency required' },
        { status: 400 }
      );
    }

    // Verify transaction
    const isVerified = await paymentService.verifyTransaction(transactionHash, currency);
    
    if (!isVerified) {
      return NextResponse.json(
        { error: 'Transaction not verified' },
        { status: 400 }
      );
    }

    // Update payment status
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const paymentRepository = AppDataSource.getRepository(Payment);
    const payment = await paymentRepository.findOne({ 
      where: { transactionHash } 
    });

    if (payment) {
      payment.status = 'completed';
      payment.transactionHash = transactionHash;
      await paymentRepository.save(payment);

      // Update wallet balance
      const walletRepository = AppDataSource.getRepository(Wallet);
      const wallet = await walletRepository.findOne({ 
        where: { userId: payment.userId } 
      });

      if (wallet) {
        if (currency === 'USDT') {
          wallet.usdtBalance += payment.amount;
        } else if (currency === 'BNB') {
          wallet.bnbBalance += payment.amount;
        } else if (currency === 'ETH') {
          wallet.ethBalance += payment.amount;
        }
        
        wallet.totalDeposited += payment.amount;
        await walletRepository.save(wallet);
      }
    }

    return NextResponse.json({
      success: true,
      verified: true,
      message: 'Transaction verified and wallet updated'
    });

  } catch (error) {
    console.error('Transaction verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}





