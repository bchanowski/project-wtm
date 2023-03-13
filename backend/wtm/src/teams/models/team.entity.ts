import { ServiceEntity } from 'src/service/models/service.entity';
import { UserDetailEntity } from 'src/user/services/models/user_detail.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('team')
export class TeamEntity {
  @PrimaryGeneratedColumn()
  team_id: number;

  @Column({ unique: true })
  team_name: string;

  @CreateDateColumn({ type: 'timestamp' })
  public created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public edited_at!: Date;

  @OneToMany(() => ServiceEntity, (service) => service.team_id, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  services: ServiceEntity[];

  @OneToMany(() => UserDetailEntity, (userDetail) => userDetail.team_id_fk)
  userDetails: UserDetailEntity[];
}
