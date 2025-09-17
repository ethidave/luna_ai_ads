import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  PENDING = 'pending'
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  userId!: number;

  @Column('uuid')
  planId!: string;

  @ManyToOne("User", "subscriptions")
  @JoinColumn({ name: 'userId' })
  user: any;

  @ManyToOne("Plan", "subscriptions")
  @JoinColumn({ name: 'planId' })
  plan: any;

  @Column({
    type: 'varchar',
    default: SubscriptionStatus.PENDING
  })
  status: SubscriptionStatus;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('date')
  startDate!: Date;

  @Column('date')
  endDate!: Date;

  @Column('date', { nullable: true })
  nextBillingDate: Date;

  @Column('boolean', { default: true })
  autoRenew: boolean;

  @Column('varchar', { nullable: true })
  paymentMethod: string;

  @Column('varchar', { nullable: true })
  transactionId: string;

  @Column('text', { nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}




