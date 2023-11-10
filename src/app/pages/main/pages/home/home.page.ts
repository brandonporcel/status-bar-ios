import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app-shared/models/user.interface';
import { AuthenticationService } from '@app-shared/services/authentication.service';
import { UserService } from '@app-shared/services/user.service';
import Roles from '@enums/Roles.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userSubscription: Subscription;
  user: User;
  isCarrier: boolean = false;
  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.userSubscription = this.authenticationService.authData.subscribe(
      async (authData) => {
        if (authData) {
          this.user = authData.user;
          console.log(',');
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

  redirectTo(route: string) {
    this.router.navigateByUrl(`main/${route}`, {
      replaceUrl: true,
    });
  }

  async sendNotifications() {
    if (this.user) {
      const newTrip = await this.userService.sendNotificationsToDriver(
        this.user.id,
      );
    }
  }
}
