import { Injectable, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { Router } from '@angular/router';
import { Subscription, lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { constants } from '@constants';
import { AppService } from 'src/app/shared/services/app.service';
import { MenuItem } from 'src/app/shared/models/menu-item.interface';
import { User } from '@app-shared/models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class DriverService implements OnInit {
  credentials: FormGroup;
  menuItems: MenuItem[] | null = null;
  userSubscription: Subscription;
  user: User;
  constructor(
    private httpClient: HttpClient,
    private appService: AppService,
  ) {}
  ngOnInit(): void {}

  async getMenuItems(roles: any, side: number): Promise<any> {
    const roleIds = { roles: roles.map((el) => el.Id) };
    const url = `${constants.endpoints.main.menuItems}`;
    try {
      const data = await lastValueFrom(
        this.httpClient.post(url, roleIds).pipe(
          map((data: any) => {
            if (data.length === 0) return [];
            const routes = this.parseMenuItems(data);
            return routes.filter((el) => el.menuType.Id === side);
          }),
          catchError((error) => {
            this.appService.handleBlockingError('menu items failed', error);
            throw error;
          }),
        ),
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  private parseMenuItems(menuItems: any): MenuItem[] {
    return menuItems.map((menuItem) => parseMenuItem(menuItem));
  }

  async sendInvitation(carrierEmail: any): Promise<any> {
    return lastValueFrom(
      this.httpClient
        .post(constants.endpoints.driver.sendInvitation, carrierEmail)
        .pipe(
          map(async (data: any) => {
            return data;
          }),
          catchError((error) => Promise.reject(error)),
        ),
    );
  }

  async acceptInvitation(token: string, isFromApp?: boolean): Promise<any> {
    return lastValueFrom(
      this.httpClient
        .get(constants.endpoints.driver.acceptInvitation(token), {
          params: { isFromApp },
        })
        .pipe(
          map(async (data: any) => {
            return data;
          }),
          catchError((error) => Promise.reject(error)),
        ),
    );
  }
}

export const parseMenuItem = (menuItem: any): MenuItem => {
  return {
    id: menuItem.Id,
    name: menuItem.Name,
    image: menuItem.Image,
    route: menuItem.Route,
    parentId: menuItem.ParentId,
    menuType: menuItem.menu_item_type,
  };
};
