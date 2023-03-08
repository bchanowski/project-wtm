import { Team } from 'src/teams/models/team.interface';

export interface Service {
  service_id?: number;
  start_date: Date;
  end_date: Date;
  created_at?: Date;
  edited_at?: Date;
  team_id: Team;
}
