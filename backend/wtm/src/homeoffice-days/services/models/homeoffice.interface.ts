import { User } from '../../../user/services/models/user.interface';

export interface Homeoffice_days {
  homeoffice_id?: number;
  date: string;
  conversation?: string;
  message_sent_at?: Date;
  user_id_fk: User;
}
