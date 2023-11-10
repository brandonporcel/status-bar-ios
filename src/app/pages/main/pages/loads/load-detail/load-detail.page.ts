import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { parseLoad } from '@main-shared/services/load.service';

@Component({
  selector: 'app-load-detail',
  templateUrl: './load-detail.page.html',
  styleUrls: ['./load-detail.page.scss'],
})
export class LoadDetailPage implements OnInit {
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

  loadTripDetails(loadId: string) {
    if (!loadId) return;
    this.http.get(`loads/${loadId}`).subscribe((data: any) => {
      this.tripDetails = parseLoad(data);
    });
  }
}
