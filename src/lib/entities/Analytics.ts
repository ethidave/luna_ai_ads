import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

@Entity('analytics')
export class Analytics {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'integer', default: 0 })
  impressions: number;

  @Column({ type: 'integer', default: 0 })
  reach: number;

  @Column({ type: 'integer', default: 0 })
  clicks: number;

  @Column({ type: 'decimal', precision: 5, scale: 4, default: 0 })
  ctr: number; // Click-through rate

  @Column({ type: 'integer', default: 0 })
  conversions: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  revenue: number;

  @Column({ type: 'decimal', precision: 5, scale: 4, default: 0 })
  roas: number; // Return on ad spend

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cpc: number; // Cost per click

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cpm: number; // Cost per mille

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cpa: number; // Cost per acquisition

  @Column({ type: 'json', nullable: true })
  demographics: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  placements: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  devices: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  locations: Record<string, any>;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'varchar', nullable: true })
  platform: string;

  @ManyToOne("Campaign", "analytics")
  campaign!: any;

  @Column({ type: "varchar" })
  campaignId: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}




