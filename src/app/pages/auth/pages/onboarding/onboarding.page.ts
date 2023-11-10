import { FilePicker, PickedFile } from '@capawesome/capacitor-file-picker';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  LoadingController,
  MenuController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { constants } from '@constants';
import { StorageService } from 'src/app/services/common/storage.service';
import Roles from '@enums/Roles.enum';
import { ICredentials } from '@app-shared/models/credentials.interface';
import { OnesignalNotificationService } from '@app-shared/services/onesignal-notification.service';
import { UserService } from '@app-shared/services/user.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {
  selectedOption: string | number = '';
  showLicenseInput: boolean = false;
  form: FormGroup;
  options = [];
  userOneSignalId: Promise<string | null> = null;

  public file: PickedFile | null = null;
  credentialsInStorage: ICredentials = {
    email: '',
    password: '',
    profileType: 0,
  };
  userSubscription: Subscription;

  constructor(
    private menuCtrl: MenuController,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private storage: StorageService,
    private oneSignalNotificationService: OnesignalNotificationService,
    private userService: UserService,
    private platform: Platform,
  ) {
    this.form = this.formBuilder.group({
      profileType: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.userSubscription = this.authenticationService.authData.subscribe();
    this.storage
      .cargar(constants.storage.userCredentials)
      .then((resp: string) => {
        if (resp) {
          this.credentialsInStorage = JSON.parse(this.storage.currentValue);
        }
      });
    this.getEntities();
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  async ionViewWillEnter() {
    this.menuCtrl.enable(true);
    this.userOneSignalId =
      await this.oneSignalNotificationService.getUserOneSignalId();
  }

  async getEntities() {
    const entities = await this.authenticationService.getEntities();
    this.options = entities;
  }

  async submitForm(): Promise<any> {
    const formData = new FormData();
    formData.append('profileType', this.selectedOption.toString());
    const loading = await this.loadingController.create();
    await loading.present();
    try {
      await this.authenticationService.loadAuthData();
      const authData = this.authenticationService.authData.getValue();
      if (!authData) {
        return;
      }
      await this.authenticationService.saveProfileType({
        ...this.form?.value,
        id: authData.user.id,
        userOneSignalId: this.userOneSignalId,
      });

      if (this.platform.is('mobile')) {
        await this.userService.saveOneSignalId(
          authData.user.id,
          this.userOneSignalId,
        );
      }

      let role = this.form.controls.profileType.value;
      this.storage.guardar({
        key: constants.storage.role,
        value: JSON.stringify(role),
      });

      if (role === Roles.Driver || role === Roles.Carrier || role === 0) {
        this.router.navigateByUrl(constants.routes.auth.form, {
          replaceUrl: true,
        });
      }

      await loading.dismiss();
    } catch (error) {
      await loading.dismiss();
      const toast = await this.toastController.create({
        message: `${error}`,
        duration: 3000,
      });
      await toast.present();
    }
  }

  selectOption(option: string | number) {
    if (this.selectedOption !== option) {
      this.file = null;
    }

    this.selectedOption = option;
    this.form.get('profileType').setValue(option);
  }
}
