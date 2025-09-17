import { ethers } from 'ethers';
import TronWeb from 'tronweb';

export interface PaymentConfig {
  usdtContractAddress: string;
  tronNetwork: string;
  bnbNetwork: string;
}

export interface PaymentRequest {
  amount: number;
  currency: 'USDT' | 'BNB' | 'ETH';
  recipientAddress: string;
  description?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionHash?: string;
  error?: string;
  estimatedGas?: string;
}

export class CryptoPaymentService {
  private config: PaymentConfig;
  private tronWeb: TronWeb;

  constructor(config: PaymentConfig) {
    this.config = config;
    this.tronWeb = new TronWeb({
      fullHost: config.tronNetwork,
      privateKey: process.env.TRON_PRIVATE_KEY,
    });
  }

  /**
   * Create USDT payment (TRC-20)
   */
  async createUSDTPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      if (request.currency !== 'USDT') {
        throw new Error('Invalid currency for USDT payment');
      }

      // Convert amount to USDT (6 decimals)
      const amount = ethers.utils.parseUnits(request.amount.toString(), 6);

      // Get contract instance
      const contract = await this.tronWeb.contract().at(this.config.usdtContractAddress);

      // Estimate gas
      const gasEstimate = await this.estimateGas(contract, 'transfer', [
        request.recipientAddress,
        amount.toString()
      ]);

      // Create transaction
      const transaction = await contract.transfer(
        request.recipientAddress,
        amount.toString()
      ).send();

      return {
        success: true,
        transactionHash: transaction,
        estimatedGas: gasEstimate
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Create BNB payment (BSC)
   */
  async createBNBPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      if (request.currency !== 'BNB') {
        throw new Error('Invalid currency for BNB payment');
      }

      // Convert amount to BNB (18 decimals)
      const amount = ethers.utils.parseEther(request.amount.toString());

      // Create provider for BSC
      const provider = new ethers.providers.JsonRpcProvider(this.config.bnbNetwork);
      const wallet = new ethers.Wallet(process.env.BSC_PRIVATE_KEY!, provider);

      // Estimate gas
      const gasEstimate = await wallet.estimateGas({
        to: request.recipientAddress,
        value: amount
      });

      // Create transaction
      const transaction = await wallet.sendTransaction({
        to: request.recipientAddress,
        value: amount,
        gasLimit: gasEstimate
      });

      return {
        success: true,
        transactionHash: transaction.hash,
        estimatedGas: gasEstimate.toString()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Verify transaction
   */
  async verifyTransaction(transactionHash: string, currency: string): Promise<boolean> {
    try {
      if (currency === 'USDT') {
        const transaction = await this.tronWeb.trx.getTransaction(transactionHash);
        return transaction && transaction.ret && transaction.ret[0].contractRet === 'SUCCESS';
      } else if (currency === 'BNB' || currency === 'ETH') {
        const provider = new ethers.providers.JsonRpcProvider(
          currency === 'BNB' ? this.config.bnbNetwork : process.env.ETH_NETWORK
        );
        const receipt = await provider.getTransactionReceipt(transactionHash);
        return receipt && receipt.status === 1;
      }
      return false;
    } catch (error) {
      console.error('Transaction verification failed:', error);
      return false;
    }
  }

  /**
   * Get wallet balance
   */
  async getWalletBalance(address: string, currency: string): Promise<number> {
    try {
      if (currency === 'USDT') {
        const contract = await this.tronWeb.contract().at(this.config.usdtContractAddress);
        const balance = await contract.balanceOf(address).call();
        return parseFloat(ethers.utils.formatUnits(balance, 6));
      } else if (currency === 'BNB') {
        const provider = new ethers.providers.JsonRpcProvider(this.config.bnbNetwork);
        const balance = await provider.getBalance(address);
        return parseFloat(ethers.utils.formatEther(balance));
      } else if (currency === 'ETH') {
        const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_NETWORK!);
        const balance = await provider.getBalance(address);
        return parseFloat(ethers.utils.formatEther(balance));
      }
      return 0;
    } catch (error) {
      console.error('Balance check failed:', error);
      return 0;
    }
  }

  /**
   * Generate payment QR code data
   */
  generatePaymentQR(request: PaymentRequest): string {
    const qrData = {
      address: request.recipientAddress,
      amount: request.amount,
      currency: request.currency,
      description: request.description
    };
    return JSON.stringify(qrData);
  }

  /**
   * Estimate gas for contract interaction
   */
  private async estimateGas(contract: any, method: string, params: any[]): Promise<string> {
    try {
      const gasEstimate = await contract[method](...params).estimateGas();
      return gasEstimate.toString();
    } catch (error) {
      return '21000'; // Default gas limit
    }
  }

  /**
   * Get current exchange rates
   */
  async getExchangeRates(): Promise<Record<string, number>> {
    try {
      // In production, use a real exchange rate API
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether,binancecoin,ethereum&vs_currencies=usd');
      const data = await response.json();
      
      return {
        USDT: data.tether.usd,
        BNB: data.binancecoin.usd,
        ETH: data.ethereum.usd
      };
    } catch (error) {
      // Fallback rates
      return {
        USDT: 1.0,
        BNB: 300.0,
        ETH: 2000.0
      };
    }
  }
}

// Initialize payment service
export const paymentService = new CryptoPaymentService({
  usdtContractAddress: process.env.USDT_CONTRACT_ADDRESS || 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
  tronNetwork: process.env.TRON_NETWORK || 'https://api.trongrid.io',
  bnbNetwork: process.env.BSC_NETWORK || 'https://bsc-dataseed.binance.org'
});

