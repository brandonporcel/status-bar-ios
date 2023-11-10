import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssociatedDriversPage } from './associated-drivers.page';

const routes: Routes = [
  {
    path: '',
    component: AssociatedDriversPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssociatedDriversPageRoutingModule {}
