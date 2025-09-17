import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", unique: true })
  email!: string;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar" })
  password!: string;

  @Column({ type: "varchar", nullable: true })
  avatar!: string;

  @Column({ type: "boolean", default: false })
  emailVerified!: boolean;

  @Column({ type: "varchar", nullable: true })
  verificationToken!: string;

  @Column({ type: "datetime", nullable: true })
  verificationExpires!: Date;

  @Column({ type: "varchar", nullable: true })
  resetToken!: string;

  @Column({ type: "datetime", nullable: true })
  resetExpires!: Date;

  @Column({ type: "varchar", default: "free" })
  plan!: string;

  @Column({ type: "varchar", default: "user" })
  role!: string;

  @Column({ type: "boolean", default: false })
  isAdmin!: boolean;

  @Column({ type: "integer", default: 0 })
  credits!: number;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @Column({ type: "datetime", nullable: true })
  lastLoginAt!: Date;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt!: Date;

  // Use string references to avoid circular dependencies
  @OneToMany("AdCampaign", "user")
  adCampaigns!: any[];

  @OneToMany("Campaign", "user")
  campaigns!: any[];

  @OneToMany("Subscription", "user")
  subscriptions!: any[];

  @OneToMany("Payment", "user")
  payments!: any[];

  @OneToOne("Wallet", "user")
  wallet!: any;

  // Social media relationships removed to avoid circular dependencies
  // These will be handled through separate API calls
}


