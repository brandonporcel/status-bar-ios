/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { constants } from '@constants';
import { PaginationData } from '@app-shared/models/pagination-data.interface';
import { Notification } from '@app-shared/models/notification.interface';
import {
  CarrierFromDriver,
  DriverForCarrier,
  Invitation,
  TemporaryUser,
} from '@app-shared/models/invitation.interface';
import { Carrier } from '@app-shared/models/carrier.interface';
import { parseUser } from './authentication.service';
import { Driver } from '@app-shared/models/driver.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  getNotifications(
    page: number,
    userId: string,
  ): Promise<PaginationData<Notification>> {
    return lastValueFrom(
      this.httpClient
        .get(constants.endpoints.user.getMyNotifications(userId), {
          params: { page },
        })
        .pipe(
          map((data: any): PaginationData<Notification> => {
            return parsePaginationNotifications(data);
          }),
          catchError((error) => Promise.reject(error)),
        ),
    );
  }

  async existPermission(roles: any, permissionCode: string): Promise<any> {
    const data = { roles: roles.map((role) => role.Id), permissionCode };

    return lastValueFrom(
      this.httpClient
        .post(constants.endpoints.user.existPermission(), data)
        .pipe(
          map(async (data: any) => {
            return data.exist;
          }),
          catchError((error) => Promise.reject(error)),
        ),
    );
  }

  async getInvitations(
    page: number,
    userId: string,
  ): Promise<PaginationData<Invitation>> {
    return lastValueFrom(
      this.httpClient
        .get(constants.endpoints.user.getInvitations(userId), {
          params: { page },
        })
        .pipe(
          map((data: any): PaginationData<Invitation> => {
            return parsePaginationInvitations(data);
          }),
          catchError((error) => Promise.reject(error)),
        ),
    );
  }

  async getAssociatedDrivers(
    page: number,
    userId: string,
    isCarrier: boolean,
  ): Promise<PaginationData<Driver | Carrier>> {
    return lastValueFrom(
      this.httpClient
        .get(constants.endpoints.user.getAssociatedDrivers(userId), {
          params: { page },
        })
        .pipe(
          map((data: any): PaginationData<Driver | Carrier> => {
            return isCarrier
              ? parsePaginationDrivers(data)
              : parsePaginationCarriers(data);
          }),
          catchError((error) => Promise.reject(error)),
        ),
    );
  }

  async saveOneSignalId(userId: string, oneSignalId: any): Promise<any> {
    return lastValueFrom(
      this.httpClient
        .put(constants.endpoints.user.saveOneSignalId, { userId, oneSignalId })
        .pipe(
          map(async (data: any) => {
            return data;
          }),
          catchError((error) => {
            return Promise.reject(error);
          }),
        ),
    );
  }

  async sendNotificationsToDriver(userId: string): Promise<any> {
    return lastValueFrom(
      this.httpClient.post(constants.endpoints.trips.main, { userId }).pipe(
        map(async (data: any) => {
          console.log(data);
        }),
        catchError((error) => {
          return Promise.reject(error);
        }),
      ),
    );
  }

  async markAllAsReaded(userId: string): Promise<any> {
    return lastValueFrom(
      this.httpClient
        .post(constants.endpoints.notifications.allAsReaded, { userId })
        .pipe(
          catchError((error) => {
            return Promise.reject(error);
          }),
        ),
    );
  }
}

export const parsePaginationInvitations = (
  pagination: any,
): PaginationData<Invitation> => ({
  currentPage: pagination.current_page,
  data: parseInvitations(pagination.data),
  perPage: pagination.per_page,
  total: pagination.total,
  lastPage: pagination.last_page,
});

export const parsePaginationNotifications = (
  pagination: any,
): PaginationData<Notification> => ({
  currentPage: pagination.current_page,
  data: parseNotifications(pagination.data),
  perPage: pagination.per_page,
  total: pagination.total,
  lastPage: pagination.last_page,
});

export const parsePaginationDrivers = (
  pagination: any,
): PaginationData<Driver> => ({
  currentPage: pagination.current_page,
  data: parseDrivers(pagination.data),
  perPage: pagination.per_page,
  total: pagination.total,
  lastPage: pagination.last_page,
});

export const parsePaginationCarriers = (
  pagination: any,
): PaginationData<Carrier> => ({
  currentPage: pagination.current_page,
  data: parseCarriers(pagination.data),
  perPage: pagination.per_page,
  total: pagination.total,
  lastPage: pagination.last_page,
});

export const parseNotifications = (messages: any): Notification[] =>
  messages?.map((message) => parseNotification(message));

export const parseDrivers = (drivers: any): Driver[] =>
  drivers?.map((driver) => parseDriver(driver));

export const parseCarriers = (carriers: any): Carrier[] =>
  carriers?.map((carrier) => parseCarrier(carrier));

export const parseInvitations = (invitations: any): Invitation[] =>
  invitations?.map((invitation) => parseInvitation(invitation));

export const parseNotification = (message: any): Notification => ({
  id: message.Id,
  userId: message.IdUser,
  title: message.Title,
  message: message.Message,
  readed: message.Readed,
  typeId: message.NotificationTypeId,
  date: message.created_at,
});

export const parseInvitation = (invitation: any): Invitation => {
  return {
    id: invitation.Id,
    from: invitation.From,
    to: invitation.To,
    accept: invitation.Accept,
    type: invitation.Type,
    token: invitation.Token,
    createdAt: invitation.created_at,
    driver: parseDriver(invitation.driver),
    carrier: parseCarrier(invitation.carrier),
    temporaryUser: paraseTemporaryUser(invitation.temporary_user),
    carrierFromDriver: parseCarrierFromDriver(invitation.carrier_from_driver),
    driverForCarrier: parsedriverForCarrier(invitation.driver_for_carrier),
    userPostTUser: parseUser(invitation.user_post_t_u),
  };
};

export const parseDriver = (driver: any): Driver => {
  if (!driver) return null;
  return {
    id: driver.Id,
    description: driver.Description,
    email: driver.Email,
    jobAddress: driver.JobAddress,
    personalAddress: driver.PersonalAddress,
    phone: driver.Phone,
    carriers: driver.carriers,
    user: parseUser(driver.user),
  };
};

export const parseCarrier = (carrier: any): Carrier => {
  if (!carrier) return null;
  return {
    id: carrier.Id,
    description: carrier.Description,
    jobAddress: carrier.JobAddress,
    mc: carrier.Mc,
    phone: carrier.Phone,
    socialReason: carrier.SocialReason,
    createdAt: carrier.created_at,
    drivers: carrier.drivers,
    user: parseUser(carrier.user),
  };
};

export const paraseTemporaryUser = (temporaryUser: any): TemporaryUser => {
  if (!temporaryUser) return null;
  return {
    id: temporaryUser.Id,
    email: temporaryUser.Email,
  };
};

export const parseCarrierFromDriver = (
  carrierFromDriver: any,
): CarrierFromDriver => {
  if (!carrierFromDriver) return null;
  return {
    id: carrierFromDriver.Id,
    user: parseUser(carrierFromDriver.user),
  };
};

export const parsedriverForCarrier = (
  driverForCarrier: any,
): DriverForCarrier => {
  if (!driverForCarrier) return null;
  return {
    id: driverForCarrier.Id,
    user: parseUser(driverForCarrier.user),
  };
};
