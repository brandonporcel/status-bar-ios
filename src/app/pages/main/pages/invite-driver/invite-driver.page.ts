import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Invitation } from '@app-shared/models/invitation.interface';
import { PaginationData } from '@app-shared/models/pagination-data.interface';
import { User } from '@app-shared/models/user.interface';
import { AuthenticationService } from '@app-shared/services/authentication.service';
import { UserService } from '@app-shared/services/user.service';
import Roles from '@enums/Roles.enum';
import { CarrierService } from '@main-shared/services/carrier.service';
import { DriverService } from '@main-shared/services/driver.service';
import InvitationTypes from '@enums/InvitationTypes.enum';

@Component({
  selector: 'app-invite-driver',
  templateUrl: './invite-driver.page.html',
  styleUrls: ['./invite-driver.page.scss'],
})
export class InviteDriverPage implements OnInit {
  form: FormGroup;
  invitationTypes = InvitationTypes;
  userSubscription: Subscription;
  user: User;
  isCarrier: boolean = false;
  invitations: Invitation[] = [];
  initialPage = 1;
  paginationData: PaginationData<Invitation>;
  JSON: JSON;
  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private carrierService: CarrierService,
    private driverService: DriverService,
    private router: Router,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private toastController: ToastController,
  ) {
    this.JSON = JSON;
    this.prepareForm();
  }

  ngOnInit() {
    this.userSubscription = this.authenticationService.authData.subscribe(
      async (authData) => {
        if (authData) {
          this.user = authData.user;
          if (this.user.roles.some((el) => el.Id === Roles.Carrier)) {
            this.isCarrier = true;
          }
        }
      },
    );
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.getInvitations(this.initialPage);
  }

  prepareForm(): void {
    this.form = this.formBuilder.group({
      entityEmail: ['', [Validators.required, Validators.email]],
    });
  }

  get entityEmail(): AbstractControl | null {
    if (!this.form) return null;
    return this.form.get('entityEmail');
  }

  async getInvitations(page: number): Promise<void> {
    const loading = await this.loadingController.create();
    await loading.present();
    try {
      this.paginationData = await this.userService.getInvitations(
        page,
        this.user.id,
      );

      this.invitations = this.paginationData.data;
    } finally {
      await loading.dismiss();
    }
  }

  async sendInvitation(): Promise<any> {
    const loading = await this.loadingController.create();
    await loading.present();
    try {
      const form = {
        [this.isCarrier ? 'driverEmail' : 'carrierEmail']:
          this.form.controls.entityEmail.value,
        userId: this.user.id,
      };

      this.form.reset();
      if (this.isCarrier) {
        await this.carrierService.sendInvitation(form);
      } else {
        await this.driverService.sendInvitation(form);
      }
      await this.getInvitations(this.initialPage);
    } catch (error) {
      await loading.dismiss();

      const toast = await this.toastController.create({
        message: `${error.error.error}`,
        duration: 3000,
      });
      await toast.present();
    } finally {
      await loading.dismiss();
    }
  }

  async acceptInvitation(token: string): Promise<any> {
    const loading = await this.loadingController.create();
    await loading.present();
    try {
      if (this.isCarrier) {
        await this.carrierService.acceptInvitation(token, true);
      } else {
        await this.driverService.acceptInvitation(token, true);
      }
      await this.getInvitations(this.initialPage);
    } catch (error) {
      await loading.dismiss();

      const toast = await this.toastController.create({
        message: `${error.error.error}`,
        duration: 3000,
      });
      await toast.present();
    } finally {
      await loading.dismiss();
    }
  }

  async goBack() {
    if (
      this.paginationData.currentPage > 1 &&
      this.paginationData.currentPage <= this.paginationData.lastPage
    ) {
      this.paginationData = await this.userService.getInvitations(
        this.paginationData.currentPage - 1,
        this.user.id,
      );
      this.invitations = this.paginationData.data;
    }
  }

  async goNext() {
    if (this.paginationData.lastPage > this.paginationData.currentPage) {
      this.paginationData = await this.userService.getInvitations(
        this.paginationData.currentPage + 1,
        this.user.id,
      );
    }

    this.invitations = this.paginationData.data;
  }

  redirectTo(route: string) {
    this.router.navigateByUrl(`main/${route}`, {
      replaceUrl: true,
    });
  }
}
