import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { User } from '@app-shared/models/user.interface';
import { AuthenticationService } from '@app-shared/services/authentication.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/pages/auth/shared/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  userSubscription: Subscription;
  passwords: FormGroup;
  dynamicFieldPasswordType = 'password';
  isSuccess = false;
  message = '';
  minimumPass = 4;
  user: User = null;
  passwordsDoNotMatch: boolean = false;
  constructor(
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {
    this.prepareForm();
  }
  prepareForm(): void {
    this.passwords = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      password: [
        '',
        [Validators.required, Validators.minLength(this.minimumPass)],
      ],
      confirmPassword: ['', [Validators.required]],
    });
  }

  get password(): AbstractControl | null {
    if (!this.passwords) return null;
    return this.passwords.get('password');
  }

  get confirmPassword(): AbstractControl | null {
    if (!this.passwords) return null;
    return this.passwords.get('confirmPassword');
  }

  showPassword(): void {
    if (this.dynamicFieldPasswordType === 'password')
      this.dynamicFieldPasswordType = 'text';
    else this.dynamicFieldPasswordType = 'password';
  }

  ngOnInit() {
    this.userSubscription = this.authenticationService.authData.subscribe(
      (authData) => {
        if (authData) {
          this.user = authData.user;
        }
      },
    );
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  async changePassword() {
    const currentPassword = this.passwords.controls.currentPassword.value;
    const newPassword = this.passwords.controls.password.value;
    const confirmationPassword = this.passwords.controls.confirmPassword.value;

    if (newPassword === confirmationPassword) {
      try {
        const message = await this.authService.changePassword(
          currentPassword,
          newPassword,
          confirmationPassword,
        );
        this.isSuccess = true;
        this.message = message;
        this.passwordsDoNotMatch = false;
        this.passwords.reset();
      } catch (error) {
        this.isSuccess = false;
        this.message = error.error.error;
      }
    } else {
      this.passwordsDoNotMatch = true;
    }
  }
}
