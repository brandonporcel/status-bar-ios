import { User } from './user.interface';

export interface AuthData {
  token: string;
  user: User|null;
}
