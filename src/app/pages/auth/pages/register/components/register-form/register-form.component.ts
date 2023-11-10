import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { constants as c } from '@constants';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent implements OnInit {
  successMessage = '';
  credentials: FormGroup;
  dynamicFieldPasswordType = 'password';
  authRoutes = c.routes.auth;

  constructor(
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.prepareForm();
  }

  prepareForm(): void {
    this.credentials = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get email(): AbstractControl | null {
    if (!this.credentials) return null;
    return this.credentials.get('email');
  }

  get password(): AbstractControl | null {
    if (!this.credentials) return null;
    return this.credentials.get('password');
  }

  showPassword(): void {
    if (this.dynamicFieldPasswordType === 'password')
      this.dynamicFieldPasswordType = 'text';
    else this.dynamicFieldPasswordType = 'password';
  }
  async register(): Promise<any> {
    const loading = await this.loadingController.create();
    await loading.present();
    try {
      await this.authenticationService.register(this.credentials?.value);

      await loading.dismiss();
      this.credentials.reset();

      this.successMessage = c.messages.successRegister;
      setTimeout(() => {
        this.successMessage = '';
      }, 6000);
    } catch (error) {
      let errorMessage = c.errors.defaultError;

      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          errorMessage = c.errors.unauthorized;
        } else if (error.error) {
          console.log(error.error.error.email[0], error.message);
          errorMessage = error.error.error.email[0];
        }
      }
      await loading.dismiss();

      const toast = await this.toastController.create({
        message: `Register failed: ${errorMessage}`,
        duration: 3000,
      });

      await toast.present();
    }
  }

  public comebackToAuthPage(url: string) {
    this.router.navigateByUrl(url, { replaceUrl: true });
  }
}
