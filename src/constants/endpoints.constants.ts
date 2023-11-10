export const endpoints = {
  auth: {
    main: 'auth',
    login: 'login/email',
    register: 'register',
    getUserByEmail: 'users/get-user-by-email',
    saveProfileType: 'users/save-profile-type',
    entities(): string {
      return `${this.main}/entities`;
    },
    uploadRequirements: 'requirements/upload-file',
  },

  user: {
    main: 'users',
    changePassword(userId: string): string {
      return `${this.main}/${userId}/change-password`;
    },
    getMyNotifications(userId: string): string {
      return `${this.main}/${userId}/notifications`;
    },
    getRequirements(role: string | number): string {
      return `${this.main}/${role}/requirements`;
    },
    getInvitations(userId: string): string {
      return `${this.main}/${userId}/invitations`;
    },
    getAssociatedDrivers(userId: string): string {
      return `${this.main}/${userId}/associated-entities`;
    },
    existPermission(): string {
      return `${this.main}/permission`;
    },
    isFromEmail(userId: string): string {
      return `${this.main}/${userId}/is-from-email`;
    },
    saveOneSignalId: 'users/onesignal',
    savePersonalData: 'users/personal-data',
  },

  vehicles: {
    default: 'vehicles',
    getTrailerColours: 'vehicles/get-trailer-colours',
    getTrailerBrands: 'vehicles/get-trailer-brands',
    getTrailerTypes: 'vehicles/get-trailer-types',
    getTruckBrands: 'vehicles/get-truck-brands',
    getTruckModels: 'vehicles/get-truck-models',
    destroyVehicle(vehicleId: string): string {
      return `${this.default}/${vehicleId}`;
    },
    trailers(): string {
      return `${this.default}/trailers`;
    },
    trucks(): string {
      return `${this.default}/trucks`;
    },
  },

  trips: {
    main: 'trips',
  },

  carrier: {
    c: 'carrier',
    sendInvitation: 'carrier/send-invitation',
    acceptInvitation(token: string): string {
      return `${this.c}/accept-invitation/${token}`;
    },
  },

  loads: {
    main: 'loads',
    getByRole: 'loads/get-by-role',
    getLoads(userId: string): string {
      return `${this.main}/${userId}`;
    },
  },

  driver: {
    d: 'driver',
    sendInvitation: 'driver/send-invitation',
    acceptInvitation(token: string): string {
      return `${this.d}/accept-invitation/${token}`;
    },
  },

  notifications: {
    allAsReaded: 'notifications/all-readed',
  },

  main: {
    menuItems: 'users/menu-items',
    trips: {
      driverUrl: 'drivers',
      tripUrl: 'trips',
    },
  },
};
