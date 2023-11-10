import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequirementPage } from './requirement.page';
import { RequirementPageRoutingModule } from './requirement-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequirementPageRoutingModule,
  ],
  declarations: [RequirementPage],
})
export class RequirementPageModule {}
