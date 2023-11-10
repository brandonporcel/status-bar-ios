import { Carrier } from './carrier.interface';
import { Driver } from './driver.interface';
import { User } from './user.interface';

export interface Invitation {
  id: number;
  from: string;
  to: string;
  accept: boolean;
  createdAt: string;
  type: number;
  token: string;
  driver?: Driver;
  carrier?: Carrier;
  temporaryUser?: TemporaryUser;
  carrierFromDriver?: CarrierFromDriver;
  driverForCarrier?: DriverForCarrier;
  userPostTUser?: User;
}

export interface TemporaryUser {
  id: string;
  email: string;
}

export interface CarrierFromDriver {
  id: string;
  user: User;
}

export interface DriverForCarrier {
  id: string;
  user: User;
}
