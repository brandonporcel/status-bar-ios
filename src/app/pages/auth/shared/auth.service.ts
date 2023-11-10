import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { StorageService } from 'src/app/services/common/storage.service';
import { constants } from '@constants';
import { Subscription, catchError, lastValueFrom, map } from 'rxjs';
import Roles from '@enums/Roles.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: any;
  credentials: FormGroup;
  userSubscription: Subscription;
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private storage: StorageService,
    private httpClient: HttpClient,
  ) {}

  async login(credentials: { email: string; password: string }): Promise<any> {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      await this.authenticationService.login(credentials);

      await loading.dismiss();
      await this.authenticationService.loadAuthData();
      const authData = this.authenticationService.authData.getValue();
      if (authData) {
        const userRoles = authData.user.roles;
        const hasDriverOrCarrierRole = userRoles.some(
          (role: { Id: number; Description: string }) =>
            role.Id === Roles.Driver || role.Id === Roles.Carrier,
        );

        const hasNotRole = userRoles.length === 0;
        if (hasDriverOrCarrierRole) {
          this.router.navigateByUrl(constants.routes.main.default, {
            replaceUrl: true,
          });
        } else if (hasNotRole) {
          this.router.navigateByUrl(constants.routes.auth.onboarding, {
            replaceUrl: true,
          });
        }
        let data = {
          ...credentials,
        };
        this.storage.guardar({
          key: constants.storage.userCredentials,
          value: JSON.stringify(data),
        });
        this.storage.guardar({
          key: constants.storage.authData,
          value: JSON.stringify(authData),
        });
      }
    } catch (error) {
      console.log(error);
      await loading.dismiss();
      const toast = await this.toastController.create({
        message: `${error}`,
        duration: 3000,
      });
      await toast.present();
    }
  }

  async uploadPersonalData(form: FormGroup, userId: string): Promise<void> {
    return lastValueFrom(
      this.httpClient
        .put(constants.endpoints.user.savePersonalData, { ...form, userId })
        .pipe(
          map(async (data: any) => {}),
          catchError((error) => {
            return Promise.reject(error);
          }),
        ),
    );
  }

  async uploadRequirements(requirements): Promise<void> {
    const formData = new FormData();
    for (const key of Object.keys(requirements)) {
      const blob = requirements[key];
      formData.append(key, blob);
    }
    return lastValueFrom(
      this.httpClient
        .post(constants.endpoints.auth.uploadRequirements, formData)
        .pipe(
          map(async (data: any) => {}),
          catchError((error) => {
            return Promise.reject(error);
          }),
        ),
    );
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
    passwordConfirm: string,
  ): Promise<string> {
    this.userSubscription = this.authenticationService.authData.subscribe(
      (authData) => {
        if (authData) this.user = authData.user;
      },
    );

    const url = `${constants.endpoints.user.changePassword(this.user.id)}`;
    const body = {
      currentPassword,
      password: newPassword,
      passwordConfirmation: passwordConfirm,
    };

    try {
      const response = await this.httpClient.put(url, body).toPromise();
      return 'Password changed successfully';
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async isFromEmail(userId: string): Promise<any> {
    const url = `${constants.endpoints.user.isFromEmail(userId)}`;
    return lastValueFrom(
      this.httpClient.get(url).pipe(
        map((data: any): any => {
          return data;
        }),
        catchError((error) => Promise.reject(error)),
      ),
    );
  }
}
