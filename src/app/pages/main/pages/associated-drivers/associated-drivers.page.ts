import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Carrier } from '@app-shared/models/carrier.interface';
import { PaginationData } from '@app-shared/models/pagination-data.interface';
import { User } from '@app-shared/models/user.interface';
import { AuthenticationService } from '@app-shared/services/authentication.service';
import { UserService } from '@app-shared/services/user.service';
import Roles from '@enums/Roles.enum';
import { Driver } from '@app-shared/models/driver.interface';

@Component({
  selector: 'app-associated-drivers',
  templateUrl: './associated-drivers.page.html',
  styleUrls: ['./associated-drivers.page.scss'],
})
export class AssociatedDriversPage implements OnInit {
  userSubscription: Subscription;
  user: User;
  isCarrier: boolean = false;

  associatedDrivers: Driver[] = [];
  associatedCarriers: Carrier[] = [];
  initialPage = 1;
  paginationData: PaginationData<Driver | Carrier>;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private loadingController: LoadingController,
  ) {}
  ngOnInit() {
    this.userSubscription = this.authenticationService.authData.subscribe(
      async (authData) => {
        if (authData) {
          this.user = authData.user;
          if (this.user.roles.some((el) => el.Id === Roles.Carrier)) {
            this.isCarrier = true;
          }
        }
      },
    );
  }

  async ionViewWillEnter(): Promise<void> {
    await this.getAssociatedDrivers(this.initialPage);
  }

  async getAssociatedDrivers(page: number): Promise<void> {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      this.paginationData = await this.userService.getAssociatedDrivers(
        page,
        this.user.id,
        this.isCarrier,
      );

      if (this.isCarrier)
        this.associatedDrivers = this.paginationData.data as Driver[];
      else this.associatedCarriers = this.paginationData.data as Carrier[];
      console.log(this.paginationData.data);
    } finally {
      await loading.dismiss();
    }
  }

  async goBack() {
    if (
      this.paginationData.currentPage > 1 &&
      this.paginationData.currentPage <= this.paginationData.lastPage
    ) {
      this.paginationData = await this.userService.getAssociatedDrivers(
        this.paginationData.currentPage - 1,
        this.user.id,
        this.isCarrier,
      );

      if (this.isCarrier)
        this.associatedDrivers = this.paginationData.data as Driver[];
      else this.associatedCarriers = this.paginationData.data as Carrier[];
    }
  }

  async goNext() {
    if (this.paginationData.lastPage > this.paginationData.currentPage) {
      this.paginationData = await this.userService.getAssociatedDrivers(
        this.paginationData.currentPage + 1,
        this.user.id,
        this.isCarrier,
      );
    }

    if (this.isCarrier)
      this.associatedDrivers = this.paginationData.data as Driver[];
    else this.associatedCarriers = this.paginationData.data as Carrier[];
  }
}
