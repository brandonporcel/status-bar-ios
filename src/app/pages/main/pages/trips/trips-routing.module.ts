import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TripsPage } from './trips.page';
import { TripDetailPage } from './pages/trip-detail/trip-detail.page';

const routes: Routes = [
  {
    path: '',
    component: TripsPage,
    children: [],
  },

  {
    path: ':id',
    loadChildren: () =>
      import('./pages/trip-detail/trip-detail.module').then(
        (m) => m.TripDetailPageModule,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TripsPageRoutingModule {}
