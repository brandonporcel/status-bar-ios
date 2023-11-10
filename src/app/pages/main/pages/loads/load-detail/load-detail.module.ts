import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoadDetailPageRoutingModule } from './load-detail-routing.module';

import { LoadDetailPage } from './load-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadDetailPageRoutingModule
  ],
  declarations: [LoadDetailPage]
})
export class LoadDetailPageModule {}
