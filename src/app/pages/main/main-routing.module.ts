import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./pages/home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'historial',
        loadChildren: () =>
          import('./pages/historial/historial.module').then(
            (m) => m.HistorialPageModule,
          ),
      },
      {
        path: 'trips',
        loadChildren: () =>
          import('./pages/trips/trips.module').then((m) => m.TripsPageModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./pages/profile/profile.module').then(
            (m) => m.ProfilePageModule,
          ),
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./pages/notifications/notifications.module').then(
            (m) => m.NotificationsPageModule,
          ),
      },
      {
        path: 'contacts',
        loadChildren: () =>
          import('./pages/contacts/contacts.module').then(
            (m) => m.ContactsPageModule,
          ),
      },
      {
        path: 'invite-driver',
        loadChildren: () =>
          import('./pages/invite-driver/invite-driver.module').then(
            (m) => m.InviteDriverPageModule,
          ),
      },
      {
        path: 'associated-drivers',
        loadChildren: () =>
          import('./pages/associated-drivers/associated-drivers.module').then(
            (m) => m.AssociatedDriversPageModule,
          ),
      },
      {
        path: 'load-vehicles',
        loadChildren: () =>
          import('./pages/load-vehicles/load-vehicles.module').then(
            (m) => m.LoadVehiclesPageModule,
          ),
      },
      {
        path: 'loads',
        loadChildren: () =>
          import('./pages/loads/loads.module').then((m) => m.LoadsPageModule),
      },
      { path: '**', redirectTo: 'home' },
    ],
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
