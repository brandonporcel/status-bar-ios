import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OnboardingFormItem } from '@app-shared/models/onboarding-form-item.interface';
import { User } from '@app-shared/models/user.interface';
import { AuthenticationService } from '@app-shared/services/authentication.service';
import { constants } from '@constants';
import Roles from '@enums/Roles.enum';
import { StorageService } from 'src/app/services/common/storage.service';
import { AuthService } from '../../../shared/auth.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {
  user: User;
  role: number;
  personalDataForm: FormGroup;

  formItemsForCarrier: OnboardingFormItem[] = [
    {
      name: 'mc',
      label: 'mc',
      type: 'string',
    },
    {
      name: 'phone',
      label: 'phone',
      type: 'string',
    },
    {
      name: 'jobAddress',
      label: 'Job Adress',
      type: 'string',
    },
    {
      name: 'socialReason',
      label: 'Social Reason',
      type: 'string',
    },
    {
      name: 'dotNumber',
      label: 'Dot Number',
      type: 'string',
    },
  ];

  formItemsForDriver: OnboardingFormItem[] = [
    {
      name: 'phone',
      label: 'phone',
      type: 'string',
    },
    {
      name: 'personalAddress',
      label: 'Personal Address',
      type: 'string',
    },
    {
      name: 'jobAddress',
      label: 'Job Address',
      type: 'string',
    },
  ];

  formData: any = {};

  constructor(
    private authenticationService: AuthenticationService,
    private authService: AuthService,
    private storage: StorageService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.personalDataForm = this.formBuilder.group({});
  }

  ngOnInit() {
    this.authenticationService.authData.subscribe(async (authData) => {
      if (authData) {
        this.user = authData.user;
        try {
          this.storage
            .cargar(constants.storage.role)
            .then(async (response: string) => {
              if (response) {
                this.role = parseInt(response);
                let formItems =
                  this.role === Roles.Carrier
                    ? this.formItemsForCarrier
                    : this.role === Roles.Driver
                    ? this.formItemsForDriver
                    : this.formItemsForDriver.concat(this.formItemsForCarrier);

                formItems.forEach((item) => {
                  this.personalDataForm.addControl(
                    item.name,
                    this.formBuilder.control('', Validators.required),
                  );
                });
              }
            });
        } catch (error) {}
      }
    });
  }

  getLabel(key: string): string {
    if (this.role === Roles.Carrier) {
      const item = this.formItemsForCarrier.find((el) => el.name === key);
      return item ? item.label : key;
    } else {
      const item = this.formItemsForDriver.find((el) => el.name === key);
      return item ? item.label : key;
    }
  }

  onSubmit() {
    if (this.personalDataForm.valid) {
      this.formData = this.personalDataForm.value;

      this.authService.uploadPersonalData(this.formData, this.user.id);
      this.router.navigateByUrl(constants.routes.auth.requirements, {
        replaceUrl: true,
      });
    }
  }
}
