import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IModelDictionary } from '@app-shared/models/model-dictionary.interface';
import { Trailer, Truck } from '@app-shared/models/vehicle.interface';
import { VehicleService } from '@app-shared/services/vehicle.service';
import TrailerType from '@enums/TrailerType.enum';
import { ControlService } from 'src/app/services/common/control.service';
import { messageTime } from 'src/constants/config.constants';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddVehiclePage implements OnInit {

  @Input() title = '';
  @Input() vehicleMode = '';
  @Input() trailer: Trailer = null;
  @Input() truck: Truck = null;
  vehicleForm: FormGroup;
  truckModels: IModelDictionary[] = [];
  truckBrands: IModelDictionary[] = [];
  trailerColours: IModelDictionary[] = [];
  trailerBrands: IModelDictionary[] = [];
  trailerTypes: IModelDictionary[] = [];
  enumTrailerType = TrailerType;

  constructor(
    private formBuilder: FormBuilder,
    private controlService: ControlService,
    private vehicleService: VehicleService,
  ) {
    this.prepareForm();
  }

  ngOnInit() {
    this.getFormItems();
    this.prepareForm();
  }

  get vin(): AbstractControl {
    return this.vehicleForm.get('vin');
  }
  get plate(): AbstractControl {
    return this.vehicleForm.get('plate');
  }
  get width(): AbstractControl {
    return this.vehicleForm.get('width');
  }
  get height(): AbstractControl {
    return this.vehicleForm.get('height');
  }
  get length(): AbstractControl {
    return this.vehicleForm.get('length');
  }
  get maximumSupportedWeight(): AbstractControl {
    return this.vehicleForm.get('maximumSupportedWeight');
  }
  get tare(): AbstractControl {
    return this.vehicleForm.get('tare');
  }

  async getFormItems() {
    this.trailerColours = await this.vehicleService.getTrailerColours();
    this.trailerBrands = await this.vehicleService.getTrailerBrands();
    this.trailerTypes = await this.vehicleService.getTrailerTypes();
    this.truckModels = await this.vehicleService.getTruckModels();
    this.truckBrands = await this.vehicleService.getTruckBrands();
  }

  prepareForm() {
    const VIN = this.trailer?.VIN ? this.trailer.VIN : this.truck?.VIN ?? null;
    const plate = this.trailer?.plate ? this.trailer.plate : this.truck?.plate ?? null;
    const lightsHoseConnector = this.trailer?.lightsHoseConnector ? this.trailer.lightsHoseConnector : this.truck?.lightsHoseConnector ?? null;
    const airHoseConnector = this.trailer?.airHoseConnector ? this.trailer.airHoseConnector : this.truck?.airHoseConnector ?? null;

    this.vehicleForm = this.formBuilder.group({
      trailerBrand: [this.trailer?.trailerBrand?.id ?? null, [Validators.required]],
      trailerColour: [this.trailer?.trailerColour?.id ?? null],
      trailerType: [this.trailer?.trailerType?.id ?? null],
      truckModel: [this.truck?.truckModel?.id ?? null],
      truckBrand: [this.truck?.truckBrand?.id ?? null],
      transmissionType: [this.truck?.truckBrand?.id ?? null],
      vin: [VIN, [Validators.required]],
      plate: [plate, [Validators.required]],
      lightsHoseConnector: [lightsHoseConnector, [Validators.required]],
      airHoseConnector: [airHoseConnector, [Validators.required]],
      width: [this.trailer?.dimensionData.width ?? null, [Validators.required]],
      height: [this.trailer?.dimensionData.height ?? null, [Validators.required]],
      length: [this.trailer?.dimensionData.length ?? null, [Validators.required]],
      maximumSupportedWeight: [this.trailer?.dimensionData.maximumSupportedWeight ?? null, [Validators.required]],
      tare: [this.trailer?.dimensionData.tare ?? null, [Validators.required]],
      dorType: [this.trailer?.dorType ?? null],
      inches: [this.trailer?.inches ?? null],
      isVentiled: [this.trailer?.isVentiled ?? false],
      sizeTarp: [this.trailer?.sizeTarp ?? null],
      strapQuantity: [this.trailer?.strapQuantity ?? null],
      freeze: [this.trailer?.freeze ?? null],
    });
  }

  actionButton() {
    if (this.trailer || this.truck) {
      const body = {
        ...this.vehicleForm.value,
        vehicleMode: this.vehicleMode
      };
      if (this.trailer) {
        this.vehicleService.updateTrailer(this.trailer.id, body);
      } else {
        this.vehicleService.updateTruck(this.truck.id, body);
      }

      this.closeModal();
      this.controlService.mostrar_toast("Vechicle updated", messageTime);
    } else {
      this.createVehicle();
    }
  }

  async createVehicle() {
    const body = {
      ...this.vehicleForm.value,
      vehicleMode: this.vehicleMode
    };
    await this.vehicleService.createVehicle(body);
    this.closeModal();
    this.controlService.mostrar_toast("Vechicle created", messageTime);
  }


  closeModal() {
    this.controlService.cerrar_modal(true);
  }


}
