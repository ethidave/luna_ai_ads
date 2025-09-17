import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

export enum PaymentType {
  DEPOSIT = 'deposit',
  CAMPAIGN_PAYMENT = 'campaign_payment',
  WITHDRAWAL = 'withdrawal',
  REFUND = 'refund'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum PaymentMethod {
  USDT_TRC20 = 'usdt_trc20',
  BNB_BSC = 'bnb_bsc',
  ETH_ERC20 = 'eth_erc20',
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  FLUTTERWAVE = 'flutterwave',
  NOWPAYMENTS = 'nowpayments'
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  type: PaymentType;

  @Column({ type: 'varchar', default: PaymentStatus.PENDING })
  status!: PaymentStatus;

  @Column({ type: 'varchar' })
  method!: PaymentMethod;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  fee!: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  exchangeRate!: number;

  @Column({ type: 'decimal', precision: 20, scale: 2, nullable: true })
  usdValue!: number;

  @Column({ type: "varchar", length: 255 })
  transactionHash!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  fromAddress!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  toAddress!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  blockNumber!: string;

  @Column({ type: "integer", nullable: true })
  confirmationCount!: number;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: 'varchar', nullable: true })
  currency!: string;

  @Column({ type: 'varchar', nullable: true })
  plan!: string;

  @Column({ type: 'datetime', nullable: true })
  processedAt!: Date;

  @Column({ type: 'datetime', nullable: true })
  refundedAt!: Date;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  refundAmount!: number;

  @Column({ type: 'json', nullable: true })
  metadata!: Record<string, any>;

  @ManyToOne("User", "payments")
  user!: any;

  @Column({ type: "integer" })
  userId!: number;

  @ManyToOne("Campaign", "payments", { nullable: true })
  campaign!: any;

  @Column({ type: "integer", nullable: true })
  campaignId!: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;
}




