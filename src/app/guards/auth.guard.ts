import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthenticationService } from '../shared/services/authentication.service';
import { constants } from '@constants';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad, CanActivate {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) { }

  canLoad(): Observable<boolean> {
    return this.authenticationService.authData.pipe(
      filter((value) => value !== undefined),
      take(1),
      map((authData) => {
        if (authData) {
          return true;
        } else {
          this.router.navigateByUrl(constants.routes.auth.index);
          return false;
        }
      }),
    );
  }

  canActivate(): Observable<boolean> {
    return this.canLoad();
  }
}
