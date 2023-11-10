import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TripsPageRoutingModule } from './trips-routing.module';
// import { MenuComponent } from '../../shared/components/menu/menu.component';
import { TripsPage } from './trips.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TripsPageRoutingModule],
  declarations: [TripsPage],
  // exports: [MenuComponent],
})
export class TripsPageModule {}
