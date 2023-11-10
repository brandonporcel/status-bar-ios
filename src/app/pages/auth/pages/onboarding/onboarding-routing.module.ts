import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnboardingPage } from './onboarding.page';
import { OnboardingGuard } from 'src/app/guards/onboarding.guard';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: OnboardingPage,
    canActivate: [AuthGuard, OnboardingGuard],
  },
  {
    path: 'requirements',
    loadChildren: () =>
      import('./requirement/requirement.module').then(
        (m) => m.RequirementPageModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'form',
    loadChildren: () =>
      import('./form/form.module').then((m) => m.FormPageModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnboardingPageRoutingModule {}
