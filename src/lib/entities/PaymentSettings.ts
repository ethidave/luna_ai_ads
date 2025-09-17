import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('payment_settings')
export class PaymentSettings {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  provider: string; // 'stripe', 'paypal', 'flutterwave', 'nowpayments'

  @Column({ type: 'boolean', default: false })
  enabled: boolean;

  @Column({ type: 'json', nullable: true })
  configuration: Record<string, unknown>; // Store all provider-specific settings

  @Column({ type: 'boolean', default: false })
  testMode: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastTested: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  testStatus: string; // 'success', 'failed', 'pending'

  @Column({ type: 'text', nullable: true })
  testMessage: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}





