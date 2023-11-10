import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app-shared/models/user.interface';
import { AuthenticationService } from '@app-shared/services/authentication.service';
import { constants } from '@constants';
import { StorageService } from '../services/common/storage.service';
import { ICredentials } from '@app-shared/models/credentials.interface';

export const RequirementGuard = async () => {
  const authenticationService = inject(AuthenticationService);
  const storage = inject(StorageService);
  const router = inject(Router);

  let user: User;
  let role: string | number;
  let requirements: any;

  let credentialsInStorage: ICredentials = {
    email: '',
    password: '',
  };

  await authenticationService.loadAuthData();
  const authData = authenticationService.authData.getValue();
  if (authData) {
    user = authData.user;
  }

  const response: any = await storage.cargar(constants.storage.role);
  if (response) {
    role = JSON.parse(response);
  }

  const resp: any = await storage.cargar(constants.storage.userCredentials);
  if (resp) {
    const parsedResp = JSON.parse(resp);
    credentialsInStorage.email = parsedResp['email'];
    credentialsInStorage.password = parsedResp['password'];

    if (role || role === 0) {
      requirements = await authenticationService.getRequirements(role);
    }
  }

  if (requirements && requirements.length === 0) {
    try {
      await authenticationService.login(credentialsInStorage);
      await authenticationService.loadAuthData();
      router.navigateByUrl(constants.routes.main.default, {
        replaceUrl: true,
      });
      return false;
    } catch (error) {
      console.log('Error al autenticar:', error);
    }
  } else {
    return true;
  }
};
