import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PaginationData } from '@app-shared/models/pagination-data.interface';
import { Carrier } from '@app-shared/models/carrier.interface';
import { Driver } from '@app-shared/models/driver.interface';

@Component({
  selector: 'app-navigation-buttons',
  templateUrl: './navigation-buttons.component.html',
  styleUrls: ['./navigation-buttons.component.scss'],
})
export class NavigationButtonsComponent {
  @Input() isCarrier: boolean;
  @Input() paginationData: PaginationData<Driver | Carrier>;
  @Input() associatedEntities: (Carrier | Driver)[] = [];
  @Output() goBackClicked = new EventEmitter<void>();
  @Output() goNextClicked = new EventEmitter<void>();

  constructor() {}

  goBack() {
    this.goBackClicked.emit();
  }

  goNext() {
    this.goNextClicked.emit();
  }
}
