import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { AuthenticationService } from '../shared/services/authentication.service';
import { constants } from '@constants';
import Roles from '@enums/Roles.enum';

@Injectable({
  providedIn: 'root',
})
export class AutoLoginGuard implements CanLoad, CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
  ) { }

  async canLoad(): Promise<boolean> {
    await this.authenticationService.loadAuthData();
    const authData = this.authenticationService.authData.getValue();

    // la primera vez que ingrese va a ser undefined?. al recargar la pag se tiene el valor
    if (
      authData?.user?.roles?.length === undefined ||
      authData?.user?.roles?.length === 0
    ) {
      return true;
    }

    if (authData) {
      const userRoles = authData.user.roles;
      const hasDriverOrCarrierRole = userRoles.some(
        (role: { Id: number; Description: string }) =>
          role.Id === Roles.Driver || role.Id === Roles.Carrier,
      );
      if (hasDriverOrCarrierRole) {
        this.router.navigateByUrl(constants.routes.main.default, {
          replaceUrl: true,
        });
      }
      return false;
    } else {
      return true;
    }
  }

  async canActivate(): Promise<boolean> {
    return await this.canLoad();
  }
}
