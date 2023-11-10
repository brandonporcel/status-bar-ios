import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InviteDriverPageRoutingModule } from './invite-driver-routing.module';

import { InviteDriverPage } from './invite-driver.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InviteDriverPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [InviteDriverPage],
})
export class InviteDriverPageModule {}
