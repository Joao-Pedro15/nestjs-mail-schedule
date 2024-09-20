import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm'
import { MailStatusEnum } from './enum/mail-status.enum'

@Entity({ name: "mails" })

export class MailEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: "destination_address", nullable: false })
  destinationAddress: string

  @Column({ name: "destination_name", nullable: false })
  destinationName: string


  @Column({ name: "due_date", type: "timestamp", nullable: false })
  dueDate: string

  @Column({ type: "text", nullable: false })
  body: string

  @Column({ nullable: false })
  subject: string

  @Column({ default: MailStatusEnum.WAITING })
  status: string

  @CreateDateColumn({ name: "created_at" })
  createdAt: string


  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: string

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: string
}