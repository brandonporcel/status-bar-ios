import { Component, Input, OnInit } from '@angular/core';
import { Carrier } from '@app-shared/models/carrier.interface';

@Component({
  selector: 'app-carrier-card',
  templateUrl: './carrier-card.component.html',
  styleUrls: ['./carrier-card.component.scss'],
})
export class CarrierCardComponent implements OnInit {
  @Input() carrier: Carrier;
  constructor() {}

  ngOnInit() {}
}
