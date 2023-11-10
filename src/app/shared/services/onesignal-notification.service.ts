import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { Platform } from '@ionic/angular';
import OneSignal, { OneSignalPlugin } from 'onesignal-cordova-plugin';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OnesignalNotificationService {
  unreadNotifications = new BehaviorSubject<number>(0);
  constructor(
    private platform: Platform,
  ) { }
  bindNotifications(): void {
    OneSignal.initialize('d7249d04-ce9b-47a3-9ed3-159dca51024e');

    OneSignal.Notifications.addEventListener('click', async (e) => {
      let clickData = await e.notification;
      console.log('OneSignalAppCode : ' + clickData);
    });

    OneSignal.Notifications.requestPermission(true).then((success: Boolean) => {
      console.log('Notification permission granted ' + success);
    });
  }
  handleNotification(notification: OneSignalPlugin): void {
    this.unreadNotifications.next(this.unreadNotifications.value + 1);
  }

  async getUserOneSignalId(): Promise<any> {
    if (this.platform.is('mobile')) {
      const OSSubscriptionId = OneSignal.User.pushSubscription.id;
      const APP_ID = environment.ONESIGNAL_APPID;

      const options = {
        method: 'GET',
        headers: { accept: 'application/json' },
      };

      const response = fetch(
        `https://onesignal.com/api/v1/apps/${APP_ID}/subscriptions/${OSSubscriptionId}/user/identity`,
        options,
      )
        .then((response) => response.json())
        .then((response) => response.identity.onesignal_id)
        .catch((err) => console.error(err));

      return response;
    } else {
      return null;
    }
  }
}
