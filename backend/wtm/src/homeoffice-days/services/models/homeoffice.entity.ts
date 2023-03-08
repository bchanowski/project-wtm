import { UserEntity } from 'src/user/services/models/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity('homeoffice_days')
export class HOEntity {
  @PrimaryGeneratedColumn()
  public homeoffice_id: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ nullable: true })
  conversation: string;

  @Column({ nullable: true })
  message_sent_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  public created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public edited_at!: Date;

  @ManyToOne(() => UserEntity)
  user_id_fk: UserEntity;
}
