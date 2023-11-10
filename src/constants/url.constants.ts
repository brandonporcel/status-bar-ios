export const routes = {
  default: 'auth/',
  auth: {
    index: '/auth',
    login: '/auth/login',
    register: '/auth/register',
    onboarding: '/auth/login/onboarding',
    form: '/auth/login/onboarding/form',
    requirements: '/auth/login/onboarding/requirements',
  },
  main: {
    default: '/main',
    inviteDriver: 'main/invite-users',
    loadVehicles: '/main/load-vehicles'
  },
};
