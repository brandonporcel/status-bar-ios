import { Component, OnInit } from '@angular/core';
import { User } from '@app-shared/models/user.interface';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userSubscription: Subscription;
  user: User = null;
  constructor(private authenticationService: AuthenticationService) {}

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
}
