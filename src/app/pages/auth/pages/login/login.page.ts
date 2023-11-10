import { Component, ViewChild } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RoutingService } from '../../../../shared/services/routing.service';
import { LoginFormComponent } from './components/login-form/login-form.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  @ViewChild(LoginFormComponent)
  loginFormComponent: LoginFormComponent | null = null;
  biometricIsAvailable: boolean;
  constructor(
    private routingService: RoutingService,
    private loadingController: LoadingController,
    public router: Router,
  ) {}

  async ionViewWillEnter(): Promise<void> {
    const loading = await this.loadingController.create();
    await loading.present();
    this.routingService.setPreviousUrl('');
    await loading.dismiss();
  }

  ionViewDidEnter(): void {
    this.loginFormComponent?.prepareForm();
  }
}
