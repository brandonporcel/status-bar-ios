import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FilePicker, PickedFile } from '@capawesome/capacitor-file-picker';
import { LoadingController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/services/common/storage.service';
import { User } from 'src/app/shared/models/user.interface';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { constants } from '@constants';
import Roles from '@enums/Roles.enum';
import { ICredentials } from '@app-shared/models/credentials.interface';
import { AuthService } from '../../../shared/auth.service';
import Requirements, { RequirementsCodes } from '@enums/Requirements.enum';

@Component({
  selector: 'app-requirement',
  templateUrl: './requirement.page.html',
  styleUrls: ['./requirement.page.scss'],
})
export class RequirementPage implements OnInit {
  public files: { [key: number]: { front?: PickedFile; back?: PickedFile } } =
    {};

  form: FormGroup;
  userSubscription: Subscription;
  user: User;
  JSON: JSON;
  docType: string = '';

  credentialsInStorage: ICredentials = {
    email: '',
    password: '',
  };
  credentials: FormGroup;
  role: string;
  requirements: any = [];
  constructor(
    private formBuilder: FormBuilder,
    private storage: StorageService,
    private authenticationService: AuthenticationService,
    private authService: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router,
  ) {
    this.JSON = JSON;

    this.form = this.formBuilder.group(
      {},
      { validators: this.allFilesValidator },
    );
  }

  ngOnInit() {
    this.prepareForm();
    this.userSubscription = this.authenticationService.authData.subscribe(
      async (authData) => {
        if (authData) {
          this.user = authData.user;
          try {
            this.storage
              .cargar(constants.storage.role)
              .then(async (response: string) => {
                if (response) {
                  response = JSON.parse(response);
                  this.role = response;
                  await this.getRequirements();
                }
              });
          } catch (error) {}
          try {
            this.storage
              .cargar(constants.storage.userCredentials)
              .then((resp: string) => {
                if (resp) {
                  resp = JSON.parse(this.storage.currentValue);
                  this.credentialsInStorage.email = resp['email'];
                  this.credentialsInStorage.password = resp['password'];
                }
              });
          } catch (error) {
            console.log(error);
          }
        }
      },
    );
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  allFilesValidator(formGroup: FormGroup) {
    let allFilesSelected = true;
    for (const controlName in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(controlName)) {
        const control = formGroup.controls[controlName];
        if (!control.value) {
          allFilesSelected = false;
          break;
        }
      }
    }

    return allFilesSelected ? null : { notAllFilesSelected: true };
  }

  async getRequirements(): Promise<any> {
    const requirements = await this.authenticationService.getRequirements(
      this.role,
    );
    this.requirements = requirements;

    this.requirements.forEach((requirement) => {
      if (requirement.requiresBothSides) {
        this.form.addControl(
          `${RequirementsCodes[Requirements[requirement.id]]}`,
          new UntypedFormControl(null),
        );
        this.form.addControl(
          `${RequirementsCodes[Requirements[requirement.id]]}_back`,
          new UntypedFormControl(null),
        );
      } else {
        this.form.addControl(
          `${RequirementsCodes[Requirements[requirement.id]]}`,
          new UntypedFormControl(null),
        );
      }
    });
  }

  prepareForm(): void {
    this.credentials = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  async submitForm(): Promise<any> {
    const loading = await this.loadingController.create();
    await loading.present();
    let requirements = {
      ...this.form.value,
      userId: this.user.id,
    };
    try {
      await this.authService.uploadRequirements(requirements);
      await this.authenticationService.login(this.credentialsInStorage);
      await this.authenticationService.loadAuthData();
      const authData = this.authenticationService.authData.getValue();
      if (!authData) {
        return;
      }
      if (authData) {
        if (
          authData.user.roles.some((el) => el.Id === Roles.Driver) ||
          authData.user.roles.some((el) => el.Id === Roles.Carrier)
        ) {
          this.router.navigateByUrl(constants.routes.main.default, {
            replaceUrl: true,
          });
        }
        let data = JSON.stringify(this.credentialsInStorage);
        this.storage.guardar({
          key: constants.storage.userCredentials,
          value: data,
        });
      }
      await loading.dismiss();
    } catch (error) {
      await loading.dismiss();
      const toast = await this.toastController.create({
        message: `Error saving requirement(s) failed: ${error}`,
        duration: 3000,
      });
      await toast.present();
    }
  }

  public formGroup = new UntypedFormGroup({
    types: new UntypedFormControl([
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf',
    ]),
    multiple: new UntypedFormControl(false),
    readData: new UntypedFormControl(true),
  });

  public getFileLabel(reqId: number, side: string): string {
    if (side === 'front') {
      const file = this.files[reqId]?.front;
      return file ? file.name : `No file selected ${side}`;
    } else {
      const file = this.files[reqId]?.back;
      return file ? file.name : `No file selected ${side}`;
    }
  }

  public async pickFile(reqId: number, side: string): Promise<void> {
    const types = this.formGroup.get('types')?.value || [];
    const multiple = this.formGroup.get('multiple')?.value || false;
    const readData = this.formGroup.get('readData')?.value || false;
    const { files } = await FilePicker.pickFiles({ types, multiple, readData });
    if (side === 'front') {
      this.files[reqId] = { ...this.files[reqId], front: files[0] };
    } else {
      this.files[reqId] = { ...this.files[reqId], back: files[0] };
    }
    const base64ImageData = `data:${files[0].mimeType};base64,${files[0].data}`;
    const base64Response = await fetch(base64ImageData);
    const blob = await base64Response.blob();

    if (side === 'front') {
      this.form.get(`${RequirementsCodes[Requirements[reqId]]}`).setValue(blob);
    } else {
      this.form
        .get(`${RequirementsCodes[Requirements[reqId]]}_${side}`)
        .setValue(blob);
    }
  }
}
