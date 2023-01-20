export interface Household {
  id: string;
  created_at: Date;
  name: string;
  users: User[];
  owner_id: string;
}

export interface User {
  id: string;
  created_at: Date;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Invite {
  id: string;
  created_at: Date;
  household: Household;
  household_id: string;
  user_id: string;
  status: 'pending' | 'accepted' | 'declined';
}
