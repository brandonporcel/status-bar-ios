import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from '@app-shared/models/menu-item.interface';
import { User } from '@app-shared/models/user.interface';
import { UserService } from '@app-shared/services/user.service';
import { constants } from '@constants';
import MenuTypes from '@enums/MenuTypes.enum';
import { MenuController } from '@ionic/angular';
import { DriverService } from '@main-shared/services/driver.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { permissions } from 'src/constants/permissions.contants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('popover') popover;
  permisos: Record<string, boolean> = {};
  notification: boolean = false;
  userSubscription: Subscription;
  user: User;
  routes: MenuItem[] = [];
  JSON: JSON;
  constructor(
    private menu: MenuController,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private driverService: DriverService,
    private http: HttpClient,
  ) {
    this.JSON = JSON;
  }
  ngOnInit(): void {
    this.userSubscription = this.authenticationService.authData.subscribe(
      (authData) => {
        if (authData) this.user = authData.user;
      },
    );
    this.setRoutes();
    this.checkPermission();
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
  
  async checkPermission() {
    for (const permissionName in permissions.header) {
      const permisoId = permissions.header[permissionName];
      this.permisos[permissionName] = await this.userService.existPermission(
        this.user.roles,
        permisoId,
      );
    }
  }

  async setRoutes() {
    const menuItems = await this.driverService.getMenuItems(
      this.user.roles,
      MenuTypes.Profile,
    );
    this.routes = menuItems;
  }
  openMenu() {
    this.menu.toggle();
  }
  isOpen = false;

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }
  selectRoute(route: string) {
    this.isOpen = false;
    this.router.navigateByUrl(`main/${route}`, {
      replaceUrl: true,
    });
  }

  async logout(): Promise<void> {
    this.isOpen = false;
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
