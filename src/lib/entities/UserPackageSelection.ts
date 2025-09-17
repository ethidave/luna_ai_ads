import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Package } from "./Package";

@Entity("user_package_selections")
export class UserPackageSelection {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("uuid")
  userId!: string;

  @Column("int")
  packageId!: number;

  @Column({ type: "varchar", length: 50, default: "monthly" })
  billingCycle: string; // "monthly" or "yearly"

  @Column({ type: "decimal", precision: 10, scale: 2 })
  selectedPrice: number;

  @Column({ type: "boolean", default: false })
  isActive: boolean;

  @Column({ type: "boolean", default: false })
  isCompleted: boolean; // Whether user completed the purchase

  @Column({ type: "json", nullable: true })
  selectionData: Record<string, unknown>; // Store additional selection data

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Package, { onDelete: "CASCADE" })
  @JoinColumn({ name: "packageId" })
  package: Package;
}





