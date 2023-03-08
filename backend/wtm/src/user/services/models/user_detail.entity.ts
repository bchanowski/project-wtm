import { TeamEntity } from 'src/teams/models/team.entity';
import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('user_detail')
export class UserDetailEntity {
  @PrimaryGeneratedColumn()
  public user_detail_id: number;

  @OneToOne(() => UserEntity, { cascade: true })
  @JoinColumn()
  public user_id: UserEntity;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({ nullable: true })
  phone_number: string;

  @ManyToOne(() => TeamEntity, { onDelete: 'SET NULL', nullable: true })
  team_id: TeamEntity;

  @CreateDateColumn({ type: 'timestamp' })
  public created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public edited_at!: Date;
}
