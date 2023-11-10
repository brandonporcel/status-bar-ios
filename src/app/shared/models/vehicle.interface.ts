import { IModelDictionary } from "./model-dictionary.interface";

interface BasicDataVehicle {
  id: string;
  plate: string;
  VIN: string;
  lightsHoseConnector: string;
  airHoseConnector: string;
}

interface TrailerDimensionData {
  width: number;
  height: number;
  length: number;
  maximumSupportedWeight: number;
  tare: number;
}

export interface Trailer extends BasicDataVehicle {
  dimensionData: TrailerDimensionData;
  trailerType: IModelDictionary;
  trailerBrand: IModelDictionary;
  trailerColour: IModelDictionary;
  dorType: string;
  inches: number;
  isVentiled: boolean;
  sizeTarp: string;
  strapQuantity: number;
  freeze: string;
}

export interface Truck extends BasicDataVehicle {
  truckModel: IModelDictionary;
  truckBrand: IModelDictionary;
  transmissionType: string;
}