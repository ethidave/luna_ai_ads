import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity("ad_campaigns")
export class AdCampaign {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @Column()
  platform!: string; // facebook, google, instagram, etc.

  @Column({ type: "json", default: "{}" })
  settings!: any;

  @Column({ type: "json", default: "{}" })
  targeting!: any;

  @Column({ type: "json", default: "{}" })
  creative!: any;

  @Column({ default: "draft" })
  status!: string; // draft, active, paused, completed

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  budget!: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  spent!: number;

  @Column({ type: "integer", default: 0 })
  impressions!: number;

  @Column({ type: "integer", default: 0 })
  clicks!: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  conversions!: number;

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  ctr!: number; // Click-through rate

  @Column({ type: "decimal", precision: 10, scale: 4, default: 0 })
  cpc!: number; // Cost per click

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  cpm!: number; // Cost per mille

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  roas!: number; // Return on ad spend

  @Column({ type: "date", nullable: true })
  startDate!: Date;

  @Column({ type: "date", nullable: true })
  endDate!: Date;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt!: Date;

  @ManyToOne("User", "campaigns")
  @JoinColumn({ name: "userId" })
  user!: any;

  @Column()
  userId!: number;
}




