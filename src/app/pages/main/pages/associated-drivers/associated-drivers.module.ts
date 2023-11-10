import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssociatedDriversPageRoutingModule } from './associated-drivers-routing.module';

import { AssociatedDriversPage } from './associated-drivers.page';
import { AssociatedResolversModule } from './associated-entities.resolver';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssociatedDriversPageRoutingModule,
    AssociatedResolversModule,
  ],
  declarations: [AssociatedDriversPage],
})
export class AssociatedDriversPageModule {}
