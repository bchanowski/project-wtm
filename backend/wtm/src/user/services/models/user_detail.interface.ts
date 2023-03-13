import { Team } from 'src/teams/models/team.interface';
import { User } from './user.interface';

export interface UserDetail {
  user_detail_id?: number;
  user_id?: User;
  name?: string;
  surname?: string;
  phone_number?: string;
  team_id_fk?: Team;
}
