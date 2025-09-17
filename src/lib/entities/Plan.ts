import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

export enum PlanType {
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  BUSINESS = 'business',
  ENTERPRISE = 'enterprise'
}

export enum BillingCycle {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUALLY = 'annually',
  CUSTOM = 'custom'
}

@Entity('plans')
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    unique: true
  })
  type: PlanType;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column('text')
  description!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'varchar'
  })
  billingCycle: BillingCycle;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  originalPrice: number;

  @Column('int', { default: 0 })
  discountPercentage: number;

  @Column('json')
  features!: string[];

  @Column('json', { nullable: true })
  limitations: string[];

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('boolean', { default: false })
  isPopular: boolean;

  @Column('int', { default: 1 })
  maxFacebookAccounts: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  dailyBudgetCap: number;

  @Column('boolean', { default: false })
  hasUnlimitedBudget: boolean;

  @Column('boolean', { default: false })
  hasTeamCollaboration: boolean;

  @Column('boolean', { default: false })
  hasDedicatedConsultant: boolean;

  @OneToMany("Subscription", "plan")
  subscriptions!: any[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}




