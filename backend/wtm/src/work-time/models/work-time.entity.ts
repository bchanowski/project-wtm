import { UserEntity } from 'src/user/services/models/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity('work_time')
export class WorkTimeEntity {
  @PrimaryGeneratedColumn()
  work_time_id: number;

  @Column()
  message: string;

  @CreateDateColumn()
  message_sent_at: Date;

  @Column({ nullable: true })
  full_work_time: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  edited_at: Date;

  @ManyToOne(() => UserEntity)
  user_id_fk: UserEntity;
}
