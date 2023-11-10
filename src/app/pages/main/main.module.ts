import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainPageRoutingModule } from './main-routing.module';
import { MainPage } from './main.page';
import { MainResolversModule } from './main.resolvers.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainPageRoutingModule,
    MainResolversModule,
  ],
  declarations: [MainPage],
})
export class MainPageModule {}
