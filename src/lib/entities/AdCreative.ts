import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

export enum CreativeType {
  IMAGE = 'image',
  VIDEO = 'video',
  CAROUSEL = 'carousel',
  COLLECTION = 'collection'
}

export enum CreativeStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ACTIVE = 'active',
  PAUSED = 'paused'
}

@Entity('ad_creatives')
export class AdCreative {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: 'varchar' })
  type!: CreativeType;

  @Column({ type: 'varchar', default: CreativeStatus.DRAFT })
  status!: CreativeStatus;

  @Column({ type: "varchar", length: 255, nullable: true })
  headline!: string;

  @Column({ type: 'text', nullable: true })
  primaryText!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  callToAction!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  link!: string;

  @Column({ type: 'json', nullable: true })
  images!: string[];

  @Column({ type: 'json', nullable: true })
  videos!: string[];

  @Column({ type: 'json', nullable: true })
  aiGeneratedContent!: Record<string, any>;

  @Column({ type: "boolean", default: false })
  isAiGenerated!: boolean;

  @Column({ type: 'json', nullable: true })
  specifications!: Record<string, any>;

  @Column({ type: "varchar", length: 255, nullable: true })
  externalCreativeId!: string;

  @Column({ type: 'json', nullable: true })
  performance!: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  metadata!: Record<string, any>;

  @ManyToOne("Campaign", "creatives")
  campaign!: any;

  @Column({ type: "varchar" })
  campaignId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}




