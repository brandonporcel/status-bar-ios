import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.page.html',
  styleUrls: ['./trips.page.scss'],
})
export class TripsPage implements OnInit {
  trips: any[];

  constructor() {}

  ngOnInit() {
    this.loadTrips();
  }

  loadTrips() {
    this.trips = [
      {
        destination: 'Destino 1',
        distance: '1000 km',
        truck: 'Camión 1',
        province: 'Provincia 1',
        cargo: 'Mercancía 1',
      },
      {
        destination: 'Destino 2',
        distance: '800 km',
        truck: 'Camión 2',
        province: 'Provincia 2',
        cargo: 'Mercancía 2',
      },
    ];
  }
}
