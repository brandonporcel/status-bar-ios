import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RoutingService } from 'src/app/shared/services/routing.service';
import { RegisterFormComponent } from './components/register-form/register-form.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  @ViewChild(RegisterFormComponent)
  registerFormComponent: RegisterFormComponent|null=null;
  constructor(
    private loadingController: LoadingController,
    public router: Router,
    private routingService: RoutingService,
  ) { }

  ngOnInit() {
  }
  async ionViewWillEnter(): Promise<void> {
    const loading = await this.loadingController.create();
    await loading.present();
    this.routingService.setPreviousUrl('');
    await loading.dismiss();
  }
  ionViewDidEnter(): void {
    try {
      this.registerFormComponent?.prepareForm();
    } catch (error) {
      console.error("Error in ionViewDidEnter:", error);
    }
  }
}
