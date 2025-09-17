import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';

export enum WalletType {
  USDT_TRC20 = 'usdt_trc20',
  BNB_BSC = 'bnb_bsc',
  ETH_ERC20 = 'eth_erc20',
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  FLUTTERWAVE = 'flutterwave'
}

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, default: 0 })
  usdtBalance: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, default: 0 })
  bnbBalance: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, default: 0 })
  ethBalance: number;

  @Column({ type: 'decimal', precision: 20, scale: 2, default: 0 })
  stripeBalance: number;

  @Column({ type: 'decimal', precision: 20, scale: 2, default: 0 })
  paypalBalance: number;

  @Column({ type: 'decimal', precision: 20, scale: 2, default: 0 })
  flutterwaveBalance: number;

  @Column({ nullable: true })
  usdtAddress: string;

  @Column({ nullable: true })
  bnbAddress: string;

  @Column({ nullable: true })
  ethAddress: string;

  @Column({ nullable: true })
  stripeCustomerId: string;

  @Column({ nullable: true })
  paypalAccountId: string;

  @Column({ nullable: true })
  flutterwaveCustomerId: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, default: 0 })
  totalDeposited: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, default: 0 })
  totalSpent: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, default: 0 })
  totalWithdrawn: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @OneToOne("User", "wallet")
  @JoinColumn()
  user!: any;

  @Column({ type: "integer" })
  userId: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}




