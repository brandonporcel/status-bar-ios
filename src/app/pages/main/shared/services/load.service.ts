import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Load } from '@app-shared/models/load.interface';
import { PaginationData } from '@app-shared/models/pagination-data.interface';
import { User } from '@app-shared/models/user.interface';
import { AppService } from '@app-shared/services/app.service';
import { AuthenticationService } from '@app-shared/services/authentication.service';
import { constants } from '@constants';
import { LoadingController, ToastController } from '@ionic/angular';
import { Subscription, catchError, lastValueFrom, map } from 'rxjs';
import { StorageService } from 'src/app/services/common/storage.service';

import { format, parseISO } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class LoadService {
  credentials: FormGroup;
  userSubscription: Subscription;
  user: User;
  constructor(private httpClient: HttpClient) {}
  ngOnInit(): void {}

  getLoadsByRole(page: number, userId: string): Promise<PaginationData<Load>> {
    return lastValueFrom(
      this.httpClient
        .post(constants.endpoints.loads.getLoads(userId), {
          params: { page },
        })
        .pipe(
          map((data: any): PaginationData<Load> => {
            return parsePaginationLoads(data);
          }),
          catchError((error) => Promise.reject(error)),
        ),
    );
  }
}
export const parsePaginationLoads = (
  pagination: any,
): PaginationData<Load> => ({
  currentPage: pagination.current_page,
  data: parseLoads(pagination.data),
  perPage: pagination.per_page,
  total: pagination.total,
  lastPage: pagination.last_page,
});

export const parseLoads = (data: any): Load[] => {
  return data.map((item: any) => parseLoad(item));
};

export const parseLoad = (venue: any): Load => {
  return {
    id: venue.Id,
    publisher: venue.Publisher,
    publisherRole: venue.PublisherRole,
    description: venue.Description,
    createdAt: parseDate(venue.created_at),
    weight: venue.Weight,
    width: venue.Width,
    height: venue.Height,
    long: venue.Long,
    weightUnity: parseInt(venue.WeightUnity),
    pickupAddress: venue.PickupAddress,
    pickupHour: venue.PickupHour,
    pickupHourFrom: venue.pickupHourFrom,
    pickupHourTo: venue.pickupHourTo,
    deliverAddress: venue.DeliverAddress,
    deliverDate: venue.DeliverDate,
    deliverHourFrom: venue.DeliverHourFrom,
    deliverHourTo: venue.DeliverHourTo,
    factoringPermited: venue.FactoringPermited,
    publishedValue: venue.PublishedValue,
    offeredValue: venue.OfferedValue,
    exclusiveTruck: venue.ExclusiveTruck,
    payDays: venue.PayDays,
    fastPayDays: venue.FastPayDays,
    fastPayDiscount: venue.FastPayDiscount,
    miles: venue.Miles,
    pricePerMile: venue.PricePerMile,
    pricePerKilo: venue.PricePerKilo,
    idLane: venue.IdLane,

    requiredVehicleType: {
      id: venue.pick_up_state.Id,
      description: venue.pick_up_state.Description,
    },
    pickUpState: {
      id: venue.pick_up_state.Id,
      description: venue.pick_up_state.Name,
    },
    deliverState: {
      id: venue.pick_up_state.Id,
      description: venue.pick_up_state.Name,
    },
  };
};
export const parseDate = (date: any) => {
  return format(parseISO(date), 'MMM d, yyyy');
};
