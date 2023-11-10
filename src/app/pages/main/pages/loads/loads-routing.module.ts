import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoadsPage } from './loads.page';

const routes: Routes = [
  {
    path: '',
    component: LoadsPage,
  },
  // {
  //   path: 'load-detail',
  //   loadChildren: () => import('./load-detail/load-detail.module').then( m => m.LoadDetailPageModule)
  // },
  {
    path: ':id',
    loadChildren: () =>
      import('./load-detail/load-detail.module').then(
        (m) => m.LoadDetailPageModule,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoadsPageRoutingModule {}
