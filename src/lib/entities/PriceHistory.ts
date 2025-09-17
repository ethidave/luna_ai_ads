import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Package } from "./Package";
import { User } from "./User";

@Entity("price_history")
export class PriceHistory {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("int")
  packageId!: number;

  @Column("uuid", { nullable: true })
  changedByUserId: string; // Admin who made the change

  @Column({ type: "decimal", precision: 10, scale: 2 })
  oldPrice: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  newPrice: number;

  @Column({ type: "decimal", precision: 5, scale: 2 })
  priceChangePercentage: number;

  @Column({ type: "varchar", length: 20 })
  changeType: string; // "increase", "decrease", "no_change"

  @Column({ type: "varchar", length: 50, default: "monthly" })
  billingCycle: string; // "monthly", "yearly", "weekly", "daily"

  @Column({ type: "text", nullable: true })
  reason: string; // Reason for price change

  @Column({ type: "json", nullable: true })
  metadata: Record<string, unknown>; // Additional data about the change

  @CreateDateColumn()
  createdAt!: Date;

  // Relations
  @ManyToOne(() => Package, { onDelete: "CASCADE" })
  @JoinColumn({ name: "packageId" })
  package: Package;

  @ManyToOne(() => User, { onDelete: "SET NULL" })
  @JoinColumn({ name: "changedByUserId" })
  changedByUser: User;
}





