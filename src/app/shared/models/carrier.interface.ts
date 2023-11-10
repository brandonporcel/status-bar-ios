import { Driver } from './driver.interface';
import { User } from './user.interface';

export interface Carrier {
  id: string;
  description: string;
  jobAddress: string;
  mc: string;
  phone: string;
  socialReason: string;
  createdAt: string;
  drivers?: Driver[];
  user?: User;
}
