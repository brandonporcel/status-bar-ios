import { Component, Input, OnInit } from '@angular/core';
import { Driver } from '@app-shared/models/driver.interface';

@Component({
  selector: 'app-driver-card',
  templateUrl: './driver-card.component.html',
  styleUrls: ['./driver-card.component.scss'],
})
export class DriverCardComponent implements OnInit {
  @Input() driver: Driver;

  constructor() {}

  ngOnInit() {}
}
