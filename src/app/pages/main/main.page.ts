import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DriverService } from './shared/services/driver.service';
import { MenuItem } from 'src/app/shared/models/menu-item.interface';
import { Subscription } from 'rxjs';
import { User } from '@app-shared/models/user.interface';
import { AuthenticationService } from '@app-shared/services/authentication.service';
import MenuTypes from '@enums/MenuTypes.enum';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  routes: MenuItem[] = null;

  userSubscription: Subscription;
  user: User;
  constructor(
    private router: Router,
    private driverService: DriverService,
    private authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {
    this.userSubscription = this.authenticationService.authData.subscribe(
      (authData) => {
        if (authData) {
          this.user = authData.user;
        }
      },
    );
    this.setRoutes();
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  ionViewWillEnter() {
    if (this.user) {
    }
  }

  async setRoutes() {
    const menuItems = await this.driverService.getMenuItems(
      this.user.roles,
      MenuTypes.Bottom,
    );
    this.routes = menuItems;
  }
  selectRoute(route: string): void {
    this.router.navigateByUrl(`main/${route}`, {
      replaceUrl: true,
    });
  }
}
