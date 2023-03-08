import { UserEntity } from 'src/user/services/models/user.entity';

export interface WorkTime {
  work_time_id?: number;
  message: string;
  message_sent_at?: Date;
  full_work_time?: number;
  created_at?: Date;
  edited_at?: Date;
  user_id_fk: UserEntity;
}
