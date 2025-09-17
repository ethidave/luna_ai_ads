import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";

export enum SocialPlatform {
  GOOGLE = "google",
  FACEBOOK = "facebook",
  INSTAGRAM = "instagram",
  TWITTER = "twitter",
  LINKEDIN = "linkedin",
  TIKTOK = "tiktok",
  YOUTUBE = "youtube"
}

export enum AccountStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  PENDING_VERIFICATION = "pending_verification"
}

@Entity("social_media_accounts")
export class SocialMediaAccount {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  platform: SocialPlatform;

  @Column({ type: "varchar", length: 255 })
  platformAccountId: string;

  @Column({ type: "varchar", length: 255 })
  username: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  displayName: string;

  @Column({ type: "text", nullable: true })
  profilePicture: string;

  @Column({ type: "text", nullable: true })
  bio: string;

  @Column({ type: "varchar", length: 255 })
  email: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  website: string;

  @Column({ type: "integer", default: 0 })
  followersCount: number;

  @Column({ type: "integer", default: 0 })
  followingCount: number;

  @Column({ type: "integer", default: 0 })
  postsCount: number;

  @Column({ type: "varchar", length: 50, default: AccountStatus.ACTIVE })
  status: AccountStatus;

  @Column({ type: "text", nullable: true })
  accessToken: string;

  @Column({ type: "text", nullable: true })
  refreshToken: string;

  @Column({ type: "datetime", nullable: true })
  tokenExpiresAt: Date;

  @Column({ type: "json", nullable: true })
  platformData: Record<string, any>;

  @Column({ type: "boolean", default: true })
  isConnected: boolean;

  @Column({ type: "datetime", nullable: true })
  lastSyncAt: Date;

  @Column({ type: "json", nullable: true })
  permissions: string[];

  @Column({ type: "boolean", default: false })
  canPostAds: boolean;

  @Column({ type: "boolean", default: false })
  canAccessAnalytics: boolean;

  @Column({ type: "boolean", default: false })
  canManagePages: boolean;

  @ManyToOne("User", "socialMediaAccounts")
  user!: any;

  @Column({ type: "uuid" })
  userId: number;

  @OneToMany("SocialMediaPost", "socialMediaAccount")
  posts!: any[];

  @OneToMany("SocialMediaAnalytics", "socialMediaAccount")
  analytics!: any[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}



