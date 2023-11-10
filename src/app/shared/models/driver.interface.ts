import { Carrier } from './carrier.interface';
import { User } from './user.interface';

export interface Driver {
  id: string;
  description: string;
  email: string;
  jobAddress: string;
  personalAddress: string;
  phone: string;
  carriers?: Carrier[];
  user?: User;
}
