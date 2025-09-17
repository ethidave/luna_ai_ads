import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

export enum PackageType {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  WEEKLY = 'weekly',
  DAILY = 'daily'
}

export enum PackageStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived'
}

@Entity('packages')
export class Package {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar' })
  type: PackageType;

  @Column({ type: 'varchar', default: PackageStatus.ACTIVE })
  status: PackageStatus;

  @Column({ type: 'json' })
  features: string[]; // JSON array of features

  @Column({ type: 'json' })
  platforms: string[]; // JSON array of supported platforms

  @Column({ type: "integer" })
  duration: number; // Duration in days

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  budget: number; // Recommended budget

  @Column({ type: 'int', default: 0 })
  maxCampaigns: number; // Maximum number of campaigns

  @Column({ type: 'int', default: 0 })
  maxUsers: number; // Maximum number of users (for team packages)

  @Column({ type: 'json', nullable: true })
  limitations: Record<string, any>; // JSON object of limitations

  @Column({ type: 'json', nullable: true })
  customizations: string[]; // JSON array of available customizations

  @Column({ type: 'boolean', default: true })
  isPopular: boolean;

  @Column({ type: 'boolean', default: false })
  isCustom: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}



