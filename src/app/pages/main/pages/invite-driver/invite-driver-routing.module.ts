import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InviteDriverPage } from './invite-driver.page';

const routes: Routes = [
  {
    path: '',
    component: InviteDriverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InviteDriverPageRoutingModule {}
