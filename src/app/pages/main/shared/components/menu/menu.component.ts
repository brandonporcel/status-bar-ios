import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../../shared/services/authentication.service';
import { constants } from 'src/constants/constants';
import { MenuController } from '@ionic/angular';
import { DriverService } from '../../services/driver.service';
import { MenuItem } from '@app-shared/models/menu-item.interface';
import { Subscription } from 'rxjs';
import { User } from '@app-shared/models/user.interface';
import MenuTypes from '@enums/MenuTypes.enum';
import Roles from '@enums/Roles.enum';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  routes: MenuItem[] | null = null;
  isCarrier: boolean = false;
  userSubscription: Subscription;
  user: User;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private menu: MenuController,
    private driverService: DriverService,
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authenticationService.authData.subscribe(
      (authData) => {
        if (authData) this.user = authData.user;
        if (this.user.roles.some((el) => el.Id === Roles.Carrier)) {
          this.isCarrier = true;
        }
      },
    );
    this.setRoutes();
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  async setRoutes() {
    this.routes = await this.driverService.getMenuItems(
      this.user.roles,
      MenuTypes.Side,
    );
  }
  selectRoute(route: string) {
    this.router.navigateByUrl(`main/${route}`, {
      replaceUrl: true,
    });
    this.menu.close();
  }
  async logout(): Promise<void> {
    try {
      await this.authenticationService.logout();
      this.router.navigateByUrl(constants.routes.auth.index, {
        replaceUrl: true,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
