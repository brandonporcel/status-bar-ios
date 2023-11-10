import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';
import { OnesignalNotificationService } from '@app-shared/services/onesignal-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private oneSignalNotificationService: OnesignalNotificationService,
    private platform: Platform,
  ) {
    this.initializeApp();
  }

  initializeApp(): void {
    this.platform.ready().then(async () => {
      console.log({
        android: this.platform.is('android'),
        capacitor: this.platform.is('capacitor'),
        cordova: this.platform.is('cordova'),
        desktop: this.platform.is('desktop'),
        electron: this.platform.is('electron'),
        hybrid: this.platform.is('hybrid'),
        ios: this.platform.is('ios'),
        ipad: this.platform.is('ipad'),
        iphone: this.platform.is('iphone'),
        mobile: this.platform.is('mobile'),
        mobileweb: this.platform.is('mobileweb'),
        phablet: this.platform.is('phablet'),
        pwa: this.platform.is('pwa'),
        tablet: this.platform.is('tablet'),
      });
      if (this.platform.is('mobile')) {
        this.oneSignalNotificationService.bindNotifications();
      }

      StatusBar.hide();
    });
  }
}
