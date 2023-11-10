import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NavigationButtonsComponent } from './shared/components/navigation-buttons/navigation-buttons.component';
import { DriverCardComponent } from './shared/components/driver-card/driver-card.component';
import { CarrierCardComponent } from './shared/components/carrier-card/carrier-card.component';

@NgModule({
  declarations: [
    NavigationButtonsComponent,
    DriverCardComponent,
    CarrierCardComponent,
  ],
  imports: [CommonModule, IonicModule],
  exports: [
    NavigationButtonsComponent,
    DriverCardComponent,
    CarrierCardComponent,
  ],
})
export class AssociatedResolversModule {}
