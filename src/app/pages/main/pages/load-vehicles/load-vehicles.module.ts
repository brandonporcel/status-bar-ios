import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { LoadVehiclesPageRoutingModule } from './load-vehicles-routing.module';

import { LoadVehiclesPage } from './load-vehicles.page';
import { AddVehiclePageModule } from './add/add.module';

@NgModule({
  exports: [AddVehiclePageModule],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LoadVehiclesPageRoutingModule
  ],
  declarations: [LoadVehiclesPage]
})
export class LoadVehiclesPageModule { }
