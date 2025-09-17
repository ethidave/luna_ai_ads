import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  CAMPAIGN_SPEND = 'campaign_spend',
  REFUND = 'refund',
  FEE = 'fee'
}

export enum TransactionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: "integer" })
  userId: number;

  @Column({ type: 'varchar' })
  type: TransactionType;

  @Column({ type: 'varchar', default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number;

  @Column({ type: "varchar" })
  currency: string;

  @Column({ type: "varchar", length: 255 })
  transactionHash: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  blockNumber: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  fromAddress: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  toAddress: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  gasUsed: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  gasPrice: number;

  @Column({ type: "text" })
  description: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}




