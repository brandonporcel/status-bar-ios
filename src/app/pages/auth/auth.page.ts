import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { constants } from '@constants';

@Component({
  selector: 'app-auth',
  templateUrl: 'auth.page.html',
  styleUrls: ['auth.page.scss'],
})
export class AuthPage {
  authRoutes = constants.routes.auth;
  constructor(private router: Router) {}

  goToUrl(url: string): void {
    this.router.navigateByUrl(url, { replaceUrl: true });
  }
}
