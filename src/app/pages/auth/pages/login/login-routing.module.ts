import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from './login.page';
import { OnboardingGuard } from 'src/app/guards/onboarding.guard';

const routes: Routes = [
  {
    path: '',
    component: LoginPage,
    // canActivate:[OnboardingGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
