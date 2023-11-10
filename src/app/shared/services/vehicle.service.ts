import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AppService } from './app.service';
import { StorageService } from './storage.service';
import { AuthData } from '../models/auth-data.interface';
import { User } from '../models/user.interface';
import { constants } from '@constants';
import { FormGroup } from '@angular/forms';
import { Requirement } from '@app-shared/models/requirement.interface';
import { IModelDictionary } from '@app-shared/models/model-dictionary.interface';
import { Trailer, Truck } from '@app-shared/models/vehicle.interface';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  authData = new BehaviorSubject<AuthData | null>(null);

  constructor(
    private storageService: StorageService,
    private httpClient: HttpClient,
    private appService: AppService,
  ) { }

  getTrailerColours(): Promise<IModelDictionary[]> {
    return lastValueFrom(
      this.httpClient.get(constants.endpoints.vehicles.getTrailerColours).pipe(
        map((data: any) => {
          return this.parseIModelDictionary(data);
        }),
        catchError((error) => {
          return this.appService.handleBlockingError(
            'getTrailerColours',
            error
          );
        })
      )
    )
  }

  getTrailerBrands(): Promise<IModelDictionary[]> {
    return lastValueFrom(
      this.httpClient.get(constants.endpoints.vehicles.getTrailerBrands).pipe(
        map((data: any) => {
          return this.parseIModelDictionary(data);
        }),
        catchError((error) => {
          return this.appService.handleBlockingError(
            'getTrailerBrands',
            error
          );
        })
      )
    )
  }

  getTruckBrands(): Promise<IModelDictionary[]> {
    return lastValueFrom(
      this.httpClient.get(constants.endpoints.vehicles.getTruckBrands).pipe(
        map((data: any) => {
          return this.parseIModelDictionary(data);
        }),
        catchError((error) => {
          return this.appService.handleBlockingError(
            'getTruckBrands',
            error
          );
        })
      )
    )
  }

  getTruckModels(): Promise<IModelDictionary[]> {
    return lastValueFrom(
      this.httpClient.get(constants.endpoints.vehicles.getTruckModels).pipe(
        map((data: any) => {
          return this.parseIModelDictionary(data);
        }),
        catchError((error) => {
          return this.appService.handleBlockingError(
            'getTruckModels',
            error
          );
        })
      )
    );
  }

  getTrailers(): Promise<Trailer[]> {
    const url = constants.endpoints.vehicles.trailers();
    return lastValueFrom(
      this.httpClient.get(url).pipe(
        map((data: any) => {
          return this.parseTrailers(data);
        }),
        catchError((error) => {
          return this.appService.handleBlockingError(
            'getTrailers',
            error
          );
        })
      )
    )
  }


  getTrucks(): Promise<Truck[]> {
    const url = constants.endpoints.vehicles.trucks();
    return lastValueFrom(
      this.httpClient.get(url).pipe(
        map((data: any) => {
          return this.parseTrucks(data);
        }),
        catchError((error) => {
          return this.appService.handleBlockingError(
            'getTrucks',
            error
          );
        })
      )
    )
  }

  parseTrailers(data: any[]): Trailer[] {
    return data.map((item) => ({
      id: item.Id,
      plate: item.Plate,
      VIN: item.VIN,
      lightsHoseConnector: item.LightsHoseConnector,
      airHoseConnector: item.AirHoseConnector,
      dimensionData: {
        width: item.dimension_data.Width,
        height: item.dimension_data.Height,
        length: item.dimension_data.Length,
        maximumSupportedWeight: item.dimension_data.MaximumSupportedWeight,
        tare: item.dimension_data.Tare,
      },
      dorType: item.DorType,
      inches: item.Inches,
      isVentiled: item.IsVentiled === 1,
      freeze: item.Freeze,
      sizeTarp: item.SizeTarp,
      strapQuantity: item.StrapQuantity,
      trailerBrand: { id: item.trailer_brand.Id, description: item.trailer_brand.Description },
      trailerColour: { id: item.trailer_colour.Id, description: item.trailer_colour.Description },
      trailerType: { id: item.trailer_type.Id, description: item.trailer_type.Description }
    }));
  }

  parseTrucks(data: any[]): Truck[] {
    return data.map((item): Truck => ({
      id: item.Id,
      plate: item.Plate,
      VIN: item.VIN,
      lightsHoseConnector: item.LightsHoseConnector,
      airHoseConnector: item.AirHoseConnector,
      truckBrand: { id: item.truck_brand.Id, description: item.truck_brand.Description },
      truckModel: { id: item.truck_model.Id, description: item.truck_model.Description },
      transmissionType: item.TransmissionType
    }));
  }


  getTrailerTypes(): Promise<IModelDictionary[]> {
    return lastValueFrom(
      this.httpClient.get(constants.endpoints.vehicles.getTrailerTypes).pipe(
        map((data: any) => {
          return this.parseIModelDictionary(data);
        }),
        catchError((error) => {
          return this.appService.handleBlockingError(
            'getTrailerTypes',
            error
          );
        })
      )
    )
  }

  deleteVehicle(vehicleId: string, vehicleMode: string): Promise<boolean> {
    const url = `${constants.endpoints.vehicles.destroyVehicle(vehicleId)}?vehicleMode=${vehicleMode}`;
    return lastValueFrom(
      this.httpClient.delete(url).pipe(
        map((data: any) => {
          return data;
        }),
        catchError((error) => {
          return this.appService.handleBlockingError(
            'deleteVehicle',
            error
          );
        })
      )
    );
  }

  parseIModelDictionary = (data: any[]): IModelDictionary[] => {
    return data.map((item) => ({
      id: item.Id,
      description: item.Description,
    }));
  };

  async createVehicle(body: any): Promise<any> {
    return lastValueFrom(
      this.httpClient.post(constants.endpoints.vehicles.default, body).pipe(
        map(async (data: any) => {
          console.log(data);
        }),
        catchError((error) => {
          return Promise.reject(error);
        }),
      ),
    );
  }

  async updateTrailer(trailerId: string, body: any): Promise<any> {
    const url = `${constants.endpoints.vehicles.trailers()}/${trailerId}`;
    return lastValueFrom(
      this.httpClient.put(url, body).pipe(
        map(async (data: any) => {
          console.log(data);
        }),
        catchError((error) => {
          return Promise.reject(error);
        }),
      ),
    );
  }

  async updateTruck(truckId: string, body: any): Promise<any> {
    const url = `${constants.endpoints.vehicles.trucks()}/${truckId}`;
    return lastValueFrom(
      this.httpClient.put(url, body).pipe(
        map(async (data: any) => {
          console.log(data);
        }),
        catchError((error) => {
          return Promise.reject(error);
        }),
      ),
    );
  }
}

export const parseUser = (user: any): User => {
  return {
    id: user.Id,
    email: user.Email,
    roles: user.roles,
  };
};
