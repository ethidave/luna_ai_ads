import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index } from 'typeorm';

export enum AdStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  ARCHIVED = 'archived',
  DELETED = 'deleted'
}

export enum AdPlatform {
  FACEBOOK = 'facebook',
  GOOGLE = 'google'
}

@Entity('real_ads')
@Index(['platform', 'status'])
@Index(['connectedAccountId', 'platform'])
export class RealAd {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  connectedAccountId!: number;

  // @ManyToOne(() => ConnectedAccount, account => account.realAds)
  // connectedAccount!: ConnectedAccount;

  @Column()
  platformAdId!: string; // Original ad ID from platform

  @Column({
    type: 'varchar'
  })
  platform: AdPlatform;

  @Column()
  campaignId!: string;

  @Column({ nullable: true })
  adSetId: string; // Facebook only

  @Column()
  name!: string;

  @Column({
    type: 'varchar'
  })
  status: AdStatus;

  @Column()
  objective!: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  budget: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  spent: number;

  @Column('integer', { default: 0 })
  impressions: number;

  @Column('integer', { default: 0 })
  clicks: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  conversions: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  ctr: number;

  @Column('decimal', { precision: 10, scale: 4, default: 0 })
  cpc: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  roas: number;

  @Column('integer', { default: 0 })
  reach: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  frequency: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  engagement: number;

  @Column({ nullable: true })
  headline: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: true })
  callToAction: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  videoUrl: string;

  @Column('json', { default: '[]' })
  targetAudience: string[];

  @Column('json', { default: '[]' })
  keywords: string[];

  // Real-time data
  @Column({ type: 'datetime', nullable: true })
  lastUpdated: Date;

  @Column({ default: false })
  isActive: boolean;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  performanceScore: number;

  @Column('json', { default: '[]' })
  optimizationSuggestions: string[];

  // AI Analysis data
  @Column('json', { nullable: true })
  aiAnalysis: any;

  @Column('json', { nullable: true })
  generatedTags: string[];

  @Column('json', { nullable: true })
  improvementSuggestions: any;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}



