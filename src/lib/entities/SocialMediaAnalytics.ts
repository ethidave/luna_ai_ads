import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";

export enum AnalyticsType {
  ACCOUNT = "account",
  POST = "post",
  AD = "ad",
  CAMPAIGN = "campaign"
}

export enum MetricType {
  IMPRESSIONS = "impressions",
  REACH = "reach",
  ENGAGEMENT = "engagement",
  LIKES = "likes",
  COMMENTS = "comments",
  SHARES = "shares",
  SAVES = "saves",
  CLICKS = "clicks",
  CONVERSIONS = "conversions",
  REVENUE = "revenue",
  COST = "cost",
  CTR = "ctr",
  CPC = "cpc",
  CPM = "cpm",
  ROAS = "roas",
  FREQUENCY = "frequency",
  VIDEO_VIEWS = "video_views",
  VIDEO_COMPLETION = "video_completion",
  STORY_VIEWS = "story_views",
  PROFILE_VISITS = "profile_visits",
  WEBSITE_CLICKS = "website_clicks",
  EMAIL_CONTACTS = "email_contacts",
  PHONE_CALLS = "phone_calls",
  DIRECT_MESSAGES = "direct_messages"
}

@Entity("social_media_analytics")
export class SocialMediaAnalytics {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 50 })
  platform: string;

  @Column({ type: "varchar", length: 50 })
  analyticsType: AnalyticsType;

  @Column({ type: "varchar", length: 50 })
  metricType: MetricType;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  value: number;

  @Column({ type: "varchar", length: 50, nullable: true })
  currency: string;

  @Column({ type: "date" })
  date: Date;

  @Column({ type: "varchar", length: 50, nullable: true })
  timezone: string;

  @Column({ type: "json", nullable: true })
  breakdown: {
    age?: Record<string, number>;
    gender?: Record<string, number>;
    location?: Record<string, number>;
    device?: Record<string, number>;
    platform?: Record<string, number>;
    time?: Record<string, number>;
  };

  @Column({ type: "json", nullable: true })
  demographics: {
    ageRange?: string;
    gender?: string;
    location?: string;
    interests?: string[];
    behaviors?: string[];
  };

  @Column({ type: "json", nullable: true })
  aiInsights: {
    trend?: "increasing" | "decreasing" | "stable";
    anomaly?: boolean;
    recommendation?: string;
    score?: number;
    confidence?: number;
  };

  @Column({ type: "json", nullable: true })
  platformData: Record<string, any>;

  @Column({ type: "text", nullable: true })
  notes: string;

  @ManyToOne("SocialMediaAccount", "analytics")
  socialMediaAccount!: any;

  @Column({ type: "uuid" })
  socialMediaAccountId: string;

  @ManyToOne("SocialMediaPost", "analytics", { nullable: true })
  socialMediaPost: any;

  @Column({ type: "uuid", nullable: true })
  socialMediaPostId: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}



