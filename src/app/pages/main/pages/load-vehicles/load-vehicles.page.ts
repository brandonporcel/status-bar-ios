import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IModal } from '@app-shared/models/controls.index';
import { VehicleService } from '@app-shared/services/vehicle.service';
import { ControlService } from 'src/app/services/common/control.service';
import { AddVehiclePage } from './add/add.page';
import TrailerType from '@enums/TrailerType.enum';
import { message, messageTime } from 'src/constants/config.constants';
import { Trailer, Truck } from '@app-shared/models/vehicle.interface';

@Component({
  selector: 'app-load-vehicles',
  templateUrl: './load-vehicles.page.html',
  styleUrls: ['./load-vehicles.page.scss'],
})

export class LoadVehiclesPage implements OnInit {
  headerTabs = [{ id: "trailers", description: "Trailers" }, { id: "trucks", description: "Trucks" }];
  activeHeaderTabId = 'trailers';
  trailers: Trailer[] = [];
  trucks: Truck[] = [];
  constructor(
    private vehicleService: VehicleService,
    private controlService: ControlService,
  ) {
  }

  ngOnInit() {
    this.getVehicles();
  }

  async getVehicles() {
    const showLoading = this.showLoading();

    if (showLoading) await this.controlService.mostrarLoading();


    if (this.activeHeaderTabId === 'trailers') {
      this.trailers = await this.vehicleService.getTrailers();

    } else {
      this.trucks = await this.vehicleService.getTrucks();
    }

    if (showLoading) await this.controlService.ocultar_loading();
  }

  showLoading(): boolean {
    if (this.activeHeaderTabId === 'trailers') {
      return this.trailers.length === 0;
    }

    return this.trucks.length === 0;
  }

  toggleHeaderTab(tabId: string): void {
    this.activeHeaderTabId = tabId;
    this.getVehicles();
  };

  newVehicleModal() {
    const titulo = 'New Vehicle';
    const modal: IModal = { component: AddVehiclePage, componentProps: { title: titulo, vehicleMode: this.activeHeaderTabId }, returnData: true };

    this.controlService.mostrar_modal(modal).then((data) => {
      this.getVehicles();
    });;
  }

  editVehicle(vehicle: Trailer | Truck) {
    const titulo = 'Edit Vehicle';
    let trailer = null;
    let truck = null;

    if (this.activeHeaderTabId === 'trailers') {
      trailer = vehicle;
    } else {
      truck = vehicle;
    }

    const modal: IModal = { component: AddVehiclePage, componentProps: { title: titulo, vehicleMode: this.activeHeaderTabId, trailer, truck }, returnData: true };

    this.controlService.mostrar_modal(modal).then((data) => {
      this.getVehicles();
    });
  }

  deleteVehicle(vehicle: Trailer | Truck) {
    this.controlService.mostrar_alert({
      header: 'Confirm',
      message: message.vehicles.confirmDelete,
      backdropDismiss: false,
      buttons: [
        {
          text: message.common.cancel,
        },
        {
          text: message.common.accept,
          handler: () => {
            this.controlService
              .mostrarLoading(message.common.loading)
              .then(() => {
                this.vehicleService.deleteVehicle(vehicle.id, this.activeHeaderTabId).then(() => {
                  if (this.activeHeaderTabId === 'trailers') {
                    this.trailers = this.trailers.filter(({ id }) => id !== vehicle.id);
                  } else {
                    this.trucks = this.trucks.filter(({ id }) => id !== vehicle.id);
                  }
                  this.controlService.ocultar_loading();
                  this.controlService.mostrar_toast("Vehicle removed", messageTime);
                });
              });
          },
        },
      ],
    });
  }

}
