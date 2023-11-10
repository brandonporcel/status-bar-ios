import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Load } from '@app-shared/models/load.interface';
import { PaginationData } from '@app-shared/models/pagination-data.interface';
import { User } from '@app-shared/models/user.interface';
import { AuthenticationService } from '@app-shared/services/authentication.service';
import { DriverService } from '@main-shared/services/driver.service';
import { LoadService } from '@main-shared/services/load.service';

@Component({
  selector: 'app-loads',
  templateUrl: './loads.page.html',
  styleUrls: ['./loads.page.scss'],
})
export class LoadsPage implements OnInit {
  loads: Load[] = null;
  paginationData: PaginationData<Load>;

  user: User;
  initialPage = 1;

  constructor(
    private authenticationService: AuthenticationService,
    private loadService: LoadService,
    private router: Router,
  ) {}

  async ngOnInit() {
    await this.authenticationService.loadAuthData();
    const authData = this.authenticationService.authData.getValue();
    if (authData) {
      this.user = authData.user;
      this.loadTrips();
    }
  }

  async loadTrips() {
    try {
      this.paginationData = await this.loadService.getLoadsByRole(
        this.initialPage,
        this.user.id,
      );
    } catch (error) {
      console.log(error);
    }
    this.loads = this.paginationData.data;
  }

  async goBack() {
    if (
      this.paginationData.currentPage > 1 &&
      this.paginationData.currentPage <= this.paginationData.lastPage
    ) {
      this.paginationData = await this.loadService.getLoadsByRole(
        this.initialPage - 1,
        this.user.id,
      );
      this.loads = this.paginationData.data;
    }
  }
  async goNext() {
    if (this.paginationData.lastPage > this.paginationData.currentPage) {
      this.paginationData = await this.loadService.getLoadsByRole(
        this.initialPage + 1,
        this.user.id,
      );
    }
    this.loads = this.paginationData.data;
  }
  redirectTo(id: string) {
    this.router.navigateByUrl(`main/loads/${id}`, {
      replaceUrl: true,
    });
  }
}
