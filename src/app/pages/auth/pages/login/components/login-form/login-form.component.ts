import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from '../../../../../../shared/models/user.interface';
import { constants } from '@constants';
import { AuthService } from 'src/app/pages/auth/shared/auth.service';
import { OnesignalNotificationService } from '@app-shared/services/onesignal-notification.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  credentials: FormGroup;
  userSubscription: Subscription;
  user: User;
  dynamicFieldPasswordType = 'password';
  biometricIsAvailable: boolean;
  authRoutes = constants.routes.auth;
  userOneSignalId: Promise<string | null> = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private oneSignalNotificationService: OnesignalNotificationService,
    private authService: AuthService,
  ) {
    this.prepareForm();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
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

  async login(): Promise<any> {
    this.userOneSignalId =
      await this.oneSignalNotificationService.getUserOneSignalId();
    this.authService.login(this.credentials?.value);
  }

  showPassword(): void {
    if (this.dynamicFieldPasswordType === 'password')
      this.dynamicFieldPasswordType = 'text';
    else this.dynamicFieldPasswordType = 'password';
  }

  public comebackToAuthPage(url: string) {
    this.router.navigateByUrl(url, { replaceUrl: true });
  }
}
