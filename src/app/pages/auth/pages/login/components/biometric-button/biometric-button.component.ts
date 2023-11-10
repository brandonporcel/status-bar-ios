import {
  type AuthenticateOptions,
  BiometricAuth,
  BiometryErrorType,
  BiometryType,
  type CheckBiometryResult,
  getBiometryName,
  type ResultError,
} from '@aparajita/capacitor-biometric-auth';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../../../../shared/services/authentication.service';
import { constants } from '@constants';
import { ICredentials } from '@app-shared/models/credentials.interface';
import { StorageService } from 'src/app/services/common/storage.service';
import { AuthService } from 'src/app/pages/auth/shared/auth.service';
import { User } from '@app-shared/models/user.interface';
@Component({
  selector: 'app-biometric-button',
  templateUrl: './biometric-button.component.html',
  styleUrls: ['./biometric-button.component.scss'],
})
export class BiometricButtonComponent implements OnInit {
  credentials: FormGroup;
  userSubscription: Subscription;
  user: User;
  dynamicFieldPasswordType = 'password';
  biometricIsAvailable: boolean;
  credentialsInStorage: ICredentials = {
    email: '',
    password: '',
  };
  existCredentialsInStorage: boolean = false;
  JSON: JSON;
  loginWithForm: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private storage: StorageService,
    private authService: AuthService,
  ) {
    this.JSON = JSON;
    this.checkBiometricIsAvailable();
  }
  authRoutes = constants.routes.auth;

  ngOnInit(): void {
    this.userSubscription = this.authenticationService.authData.subscribe(
      (authData) => {
        if (authData) this.user = authData.user;
      },
    );

    this.storage
      .cargar(constants.storage.userCredentials)
      .then((resp: string) => {
        if (resp) {
          resp = JSON.parse(this.storage.currentValue);
          this.existCredentialsInStorage = true;
          this.credentialsInStorage.email = resp['email'];
          this.credentialsInStorage.password = resp['password'];
        } else {
          this.existCredentialsInStorage = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  async login(): Promise<any> {
    this.authService.login(this.credentialsInStorage);
  }

  updateBiometryInfo(info: CheckBiometryResult): void {
    this.biometricIsAvailable = info.isAvailable;
  }

  async checkBiometricIsAvailable(): Promise<any> {
    this.updateBiometryInfo(await BiometricAuth.checkBiometry());
  }

  async loginHuellaFaceID(): Promise<void> {
    try {
      await BiometricAuth.authenticate();
      try {
        this.login();
      } catch (error) {
        console.log('Failed to login', error);
      }
    } catch (error) {
      console.log('Biometric Auth failed', error);
    }
  }
  goToUrl(url: string): void {
    this.router.navigateByUrl(url, { replaceUrl: true });
  }
}
