import { catchError, lastValueFrom, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constants } from '@constants';
@Injectable({
  providedIn: 'root',
})
export class CarrierService {
  constructor(private httpClient: HttpClient) {}

  async sendInvitation(driverEmail: any): Promise<any> {
    return lastValueFrom(
      this.httpClient
        .post(constants.endpoints.carrier.sendInvitation, driverEmail)
        .pipe(
          map(async (data: any) => {
            return data.exist;
          }),
          catchError((error) => Promise.reject(error)),
        ),
    );
  }

  async acceptInvitation(token: string, isFromApp?: boolean): Promise<any> {
    return lastValueFrom(
      this.httpClient
        .get(constants.endpoints.carrier.acceptInvitation(token), {
          params: { isFromApp },
        })
        .pipe(
          map(async (data: any) => {}),
          catchError((error) => Promise.reject(error)),
        ),
    );
  }
}
