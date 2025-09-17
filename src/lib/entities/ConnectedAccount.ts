import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';

export enum PlatformType {
  FACEBOOK = 'facebook',
  GOOGLE = 'google'
}

export enum AccountStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
  ERROR = 'error'
}

@Entity('connected_accounts')
export class ConnectedAccount {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  // @ManyToOne(() => User, user => user.connectedAccounts)
  // user!: User;

  @Column({
    type: 'varchar'
  })
  platform: PlatformType;

  @Column()
  accountId!: string;

  @Column()
  accountName!: string;

  @Column()
  currency!: string;

  @Column()
  timezone!: string;

  @Column({ nullable: true })
  accessToken: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({
    type: 'varchar',
    default: AccountStatus.ACTIVE
  })
  status: AccountStatus;

  @Column('json', { nullable: true })
  permissions: string[];

  @Column({ type: 'datetime', nullable: true })
  lastSyncAt: Date;

  @Column({ nullable: true })
  errorMessage: string;

  // @OneToMany(() => RealAd, realAd => realAd.connectedAccount)
  // realAds!: RealAd[];

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}



