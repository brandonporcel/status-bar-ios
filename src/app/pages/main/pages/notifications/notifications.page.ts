import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Notification } from '@app-shared/models/notification.interface';
import { PaginationData } from '@app-shared/models/pagination-data.interface';
import { User } from '@app-shared/models/user.interface';
import { AuthenticationService } from '@app-shared/services/authentication.service';
import { UserService } from '@app-shared/services/user.service';
import NotificationTypes from '@enums/NotificationTypes.enum';
import { LoadingController } from '@ionic/angular';

const INITIAL_PAGE = 1;
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage {
  user: User;
  userSubscription: Subscription;
  paginationData: PaginationData<Notification>;
  notifications: Notification[] = [];

  constructor(
    private authenticationSevice: AuthenticationService,
    private loadingController: LoadingController,
    private userService: UserService,
    private router: Router,
  ) {}

  async doRefresh(event: any): Promise<void> {
    await this.getNotifications(INITIAL_PAGE);
    event.target.complete();
  }

  async ionViewWillEnter(): Promise<void> {
    this.userSubscription = this.authenticationSevice.authData.subscribe(
      (authData) => {
        if (authData) {
          this.user = authData.user;
        }
      },
    );

    await this.getNotifications(INITIAL_PAGE);
  }

  async loadData(event: any): Promise<void> {
    this.paginationData = await this.userService.getNotifications(
      this.paginationData.currentPage + 1,
      this.user.id,
    );

    this.notifications.push(...this.paginationData.data);
    if (event) {
      event.target.complete();
    }
  }

  private async getNotifications(page: number): Promise<void> {
    const loading = await this.loadingController.create();
    await loading.present();
    try {
      this.paginationData = await this.userService.getNotifications(
        page,
        this.user.id,
      );
      if (page > INITIAL_PAGE) {
        this.notifications = this.notifications.concat(
          this.paginationData.data,
        );
      } else {
        this.notifications = this.paginationData.data;
      }
    } finally {
      await loading.dismiss();
    }
  }

  async markAllAsReaded() {
    await this.userService.markAllAsReaded(this.user.id);
    await this.getNotifications(INITIAL_PAGE);
  }

  notificationRedirect(notification: Notification) {
    const tripId = notification.id;

    if (notification.typeId === NotificationTypes.NewTrip) {
      this.router.navigateByUrl(`main/trips/${tripId}`, {
        replaceUrl: true,
      });
    }
  }

  redirectTo(route: string) {
    this.router.navigateByUrl(`main/${route}`, {
      replaceUrl: true,
    });
  }
}
