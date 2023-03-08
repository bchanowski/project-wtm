import { HOEntity } from 'src/homeoffice-days/services/models/homeoffice.entity';
import { WorkTimeEntity } from 'src/work-time/models/work-time.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('user_info')
export class UserEntity {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  public created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public edited_at!: Date;

  @OneToMany(() => HOEntity, (homeofficeDay) => homeofficeDay.user_id_fk)
  homeofficeDays: HOEntity[];

  @OneToMany(
    () => WorkTimeEntity,
    (workTimeEntity) => workTimeEntity.user_id_fk,
  )
  workTimeMessages: WorkTimeEntity[];

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
