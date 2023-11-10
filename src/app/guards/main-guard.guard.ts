import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { constants } from '@constants';

@Injectable({
  providedIn: 'root',
})
// no entiendo este guard
export class MainGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    const splittedURL = state.url.split('/');
    if (splittedURL.length < 3) {
      console.log(splittedURL, 'aca me lleva a home?');
      alert('4');
      return false;

      this.router.navigateByUrl(constants.routes.main.default, {
        replaceUrl: true,
      });
      return false;
    }
    return true;
  }
}
