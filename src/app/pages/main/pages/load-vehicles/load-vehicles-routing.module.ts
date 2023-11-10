import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoadVehiclesPage } from './load-vehicles.page';

const routes: Routes = [
  {
    path: '',
    component: LoadVehiclesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoadVehiclesPageRoutingModule { }
