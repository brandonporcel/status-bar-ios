export interface Load {
  id: string;
  publisher: string;
  publisherRole: string;
  createdAt: Date | string;
  description: string;
  requiredVehicleType: RequiredVehicleType;
  height: string;
  weightUnity: number;
  width: string;
  long: string;
  weight: number;

  pickUpState: PickUpState;
  pickupAddress: string;
  pickupHour: Date;
  pickupHourFrom: Date;
  pickupHourTo: Date;
  deliverState: DeliverState;
  deliverAddress: string;
  deliverDate: Date;
  deliverHourFrom: Date;
  deliverHourTo: Date;
  factoringPermited: boolean;
  publishedValue: number;
  offeredValue: number;
  exclusiveTruck: boolean;
  payDays?: number | null;
  fastPayDays?: number | null;
  fastPayDiscount?: number | null;
  miles?: number | null;
  pricePerMile?: number | null;
  pricePerKilo?: number | null;
  idLane?: string;
}
export interface PickUpState {
  id: number;
  description: string;
}

export interface DeliverState {
  id: number;
  description: string;
}

export interface RequiredVehicleType {
  id: number;
  description: string;
}
