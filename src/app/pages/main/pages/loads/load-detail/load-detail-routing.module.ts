import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoadDetailPage } from './load-detail.page';

const routes: Routes = [
  {
    path: '',
    component: LoadDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoadDetailPageRoutingModule {}
