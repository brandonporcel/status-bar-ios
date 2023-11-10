import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../pages/auth/shared/auth.service';
import { User } from '@app-shared/models/user.interface';
import { AuthenticationService } from '@app-shared/services/authentication.service';
import { constants } from '@constants';
import Roles from '@enums/Roles.enum';
import InvitationTypes from '@enums/InvitationTypes.enum';
import { StorageService } from '../services/common/storage.service';

export const OnboardingGuard = async () => {
  let authenticationService = inject(AuthenticationService);
  let user: User;
  let storage = inject(StorageService);
  let router = inject(Router);
  const authService = inject(AuthService);
  await authenticationService.loadAuthData();
  const authData = authenticationService.authData.getValue();
  if (authData) {
    user = authData.user;
  }

  const userInvitation = await authService.isFromEmail(user.id);
  let isFromEmail = userInvitation.userIsFromInvitation;

  let role =
    userInvitation.type === InvitationTypes.FromCarrier
      ? Roles.Driver
      : Roles.Carrier;

  if (!isFromEmail) {
    return true;
  } else {
    await authenticationService.saveProfileType({
      id: authData.user.id,
      profileType: role,
    });
    storage.guardar({
      key: constants.storage.role,
      value: JSON.stringify(role),
    });

    if (role === Roles.Driver || role === Roles.Carrier || role === 0) {
      router.navigateByUrl(constants.routes.auth.form, {
        replaceUrl: true,
      });
    }
    return false;
  }
};
