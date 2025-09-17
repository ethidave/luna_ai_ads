import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";

export enum PostType {
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
  CAROUSEL = "carousel",
  STORY = "story",
  REEL = "reel",
  AD = "ad"
}

export enum PostStatus {
  DRAFT = "draft",
  SCHEDULED = "scheduled",
  PUBLISHED = "published",
  FAILED = "failed",
  CANCELLED = "cancelled"
}

export enum PostVisibility {
  PUBLIC = "public",
  FRIENDS = "friends",
  FOLLOWERS = "followers",
  PRIVATE = "private"
}

@Entity("social_media_posts")
export class SocialMediaPost {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  platform: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  platformPostId: string;

  @Column({ type: "text" })
  content: string;

  @Column({ type: "varchar", length: 50 })
  type: PostType;

  @Column({ type: "varchar", length: 50, default: PostStatus.DRAFT })
  status: PostStatus;

  @Column({ type: "varchar", length: 50, default: PostVisibility.PUBLIC })
  visibility: PostVisibility;

  @Column({ type: "json", nullable: true })
  mediaUrls: string[];

  @Column({ type: "json", nullable: true })
  hashtags: string[];

  @Column({ type: "json", nullable: true })
  mentions: string[];

  @Column({ type: "json", nullable: true })
  location: {
    name: string;
    latitude?: number;
    longitude?: number;
  };

  @Column({ type: "datetime", nullable: true })
  scheduledAt: Date;

  @Column({ type: "datetime", nullable: true })
  publishedAt: Date;

  @Column({ type: "boolean", default: false })
  isAd: boolean;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  adBudget: number;

  @Column({ type: "varchar", length: 50, nullable: true })
  adObjective: string;

  @Column({ type: "json", nullable: true })
  adTargeting: Record<string, any>;

  @Column({ type: "json", nullable: true })
  adCreative: {
    headline?: string;
    description?: string;
    callToAction?: string;
    buttonText?: string;
  };

  @Column({ type: "json", nullable: true })
  aiOptimization: {
    suggestedContent?: string;
    suggestedHashtags?: string[];
    suggestedTime?: Date;
    engagementScore?: number;
    reachScore?: number;
    conversionScore?: number;
  };

  @Column({ type: "json", nullable: true })
  platformData: Record<string, any>;

  @Column({ type: "text", nullable: true })
  errorMessage: string;

  @Column({ type: "integer", default: 0 })
  likes: number;

  @Column({ type: "integer", default: 0 })
  comments: number;

  @Column({ type: "integer", default: 0 })
  shares: number;

  @Column({ type: "integer", default: 0 })
  views: number;

  @Column({ type: "integer", default: 0 })
  clicks: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  spend: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  revenue: number;

  @ManyToOne("User", "socialMediaPosts")
  user!: any;

  @Column({ type: "uuid" })
  userId: number;

  @ManyToOne("SocialMediaAccount", "posts")
  socialMediaAccount!: any;

  @Column({ type: "uuid" })
  socialMediaAccountId: string;

  @OneToMany("SocialMediaAnalytics", "socialMediaPost")
  analytics!: any[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}



