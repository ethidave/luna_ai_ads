import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User';
import { AdCreative } from './AdCreative';
import { Analytics } from './Analytics';
import { Payment } from './Payment';

export enum CampaignStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  ACTIVE = 'active',
  PAUSED = 'paused',
  ENDED = 'ended',
  REJECTED = 'rejected'
}

export enum CampaignType {
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  GOOGLE_SEARCH = 'google_search',
  GOOGLE_DISPLAY = 'google_display',
  YOUTUBE = 'youtube',
  LINKEDIN = 'linkedin',
  WEBSITE = 'website'
}

export enum BudgetType {
  DAILY = 'daily',
  LIFETIME = 'lifetime'
}

@Entity('campaigns')
export class Campaign {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: 'json' })
  platforms!: string; // JSON string of selected platforms

  @Column({ type: "varchar" })
  objective!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  budget!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  spent!: number;

  @Column({ type: 'json' })
  targetAudience!: string; // JSON string of target audience data

  @Column({ type: 'json' })
  creative!: string; // JSON string of creative assets

  @Column({ type: 'json' })
  schedule!: string; // JSON string of schedule data

  @Column({ type: 'json' })
  settings!: string; // JSON string of campaign settings

  @Column({ type: 'json', nullable: true })
  platformResults!: string; // JSON string of platform integration results

  @Column({ type: 'varchar', default: CampaignStatus.DRAFT })
  status!: CampaignStatus;

  @Column({ type: 'varchar', default: BudgetType.DAILY })
  budgettype: BudgetType;

  @Column({ type: 'date', nullable: true })
  startDate!: Date;

  @Column({ type: 'date', nullable: true })
  endDate!: Date;

  @Column({ type: 'json', nullable: true })
  targeting!: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  objectives!: Record<string, any>;

  @Column({ type: "varchar", length: 255, nullable: true })
  externalCampaignId!: string; // Facebook/Google campaign ID

  @Column({ type: "varchar", length: 255, nullable: true })
  externalAdSetId!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  externalAdId!: string;

  @Column({ type: 'json', nullable: true })
  performance!: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  metadata!: Record<string, any>;

  @ManyToOne(() => User, user => user.campaigns)
  user!: User;

  @Column({ type: "integer" })
  userId!: number;

  @OneToMany(() => AdCreative, creative => creative.campaign)
  creatives!: AdCreative[];

  @OneToMany(() => Analytics, analytics => analytics.campaign)
  analytics!: Analytics[];

  @OneToMany(() => Payment, payment => payment.campaign)
  payments!: Payment[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}


