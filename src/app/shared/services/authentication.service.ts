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

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  authData = new BehaviorSubject<AuthData | null>(null);

  constructor(
    private storageService: StorageService,
    private httpClient: HttpClient,
    private appService: AppService,
  ) {}

  async loadAuthData(): Promise<void> {
    const storageAuthData = await this.storageService.get(
      constants.storage.authData,
    );
    if (storageAuthData) {
      this.authData.next(JSON.parse(storageAuthData));
    }
  }
  async getEntities(): Promise<any> {
    const url = `${constants.endpoints.auth.entities()}`;
    try {
      const data = await lastValueFrom(
        this.httpClient.get(url).pipe(
          map((data: any) => {
            return data;
          }),
          catchError((error) => {
            this.appService.handleBlockingError('entities failed', error);
            throw error;
          }),
        ),
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
  async getUserType(email: string): Promise<any> {
    const url = `${constants.endpoints.auth.getUserByEmail}/${email}`;
    try {
      const data = await lastValueFrom(
        this.httpClient.get(url).pipe(
          map((data: any) => {
            return data;
          }),
          catchError((error) => {
            this.appService.handleBlockingError('type user', error);
            throw error;
          }),
        ),
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
  async getRequirements(role: string | number): Promise<any> {
    return lastValueFrom(
      this.httpClient.get(constants.endpoints.user.getRequirements(role)).pipe(
        map(async (data: any) => {
          const req = data.map((el) => parseRequirements(el));
          return req;
        }),
        catchError((error) =>
          this.appService.handleBlockingError('Get doc type error', error),
        ),
      ),
    );
  }
  async updateLoginData(authData: AuthData): Promise<void> {
    await this.storageService.set(
      constants.storage.authData,
      JSON.stringify(authData),
    );
    this.authData.next(authData);
  }

  async register(credentials: {
    email: string;
    password: string;
    doc: string;
  }): Promise<void> {
    return lastValueFrom(
      this.httpClient.post(constants.endpoints.auth.register, credentials).pipe(
        map(async (data: any) => {}),
        catchError((error) => {
          return Promise.reject(error);
        }),
      ),
    );
  }

  async login(credentials: { email: string; password: string }): Promise<void> {
    return lastValueFrom(
      this.httpClient.post(constants.endpoints.auth.login, credentials).pipe(
        map(async (data: any) => {
          const authData = this.parseAuthData(data);
          await this.updateLoginData(authData);
        }),
        catchError((error) =>
          this.appService.handleBlockingError('login', error),
        ),
      ),
    );
  }

  async saveProfileType(form: any): Promise<any> {
    return lastValueFrom(
      this.httpClient.post(constants.endpoints.auth.saveProfileType, form).pipe(
        map(async (data: any) => {
          return data;
        }),
        catchError((error) =>
          this.appService.handleBlockingError('Save Pofile Type', error),
        ),
      ),
    );
  }

  async logout(): Promise<boolean> {
    return this.storageService
      .remove(constants.storage.authData)
      .then(() => {
        this.authData.next(null);
        return true;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  }

  private parseAuthData(authData: any): AuthData {
    return {
      token: authData.token,
      user: parseUser(authData.user),
    };
  }
}
const parseRequirements = (data): Requirement => {
  return {
    id: data.Id,
    description: data.Description,
    code: data.Code,
    requiresBothSides: data.RequiresBothSides,
  };
};
export const parseUser = (user: any): User => {
  if (!user) return null;
  return {
    id: user.Id,
    email: user.Email,
    roles: user.roles,
  };
};
