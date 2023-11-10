import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.page.html',
  styleUrls: ['./trip-detail.page.scss'],
})
export class TripDetailPage implements OnInit {
  tripId: string;
  tripDetails: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.tripId = this.route.snapshot.paramMap.get('id');
    this.loadTripDetails(this.tripId);
  }

  loadTripDetails(tripId: string) {
    this.http.get(`trips/${tripId}`).subscribe((data: any) => {
      this.tripDetails = data;
    });
  }
}
