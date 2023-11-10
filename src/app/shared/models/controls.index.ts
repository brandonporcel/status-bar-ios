import { ToastButton, AlertButton, Mode, SpinnerTypes } from '@ionic/core';

enum position {
    top = 'top',
    bottom = 'bottom',
    middle = 'middle'
};

export interface IToast {
    header?: string;
    message?: string;
    position?: position;
    buttons?: (string | ToastButton)[];
}

export interface IAlert {
    header?: string;
    subHeader?: string;
    message?: string;
    buttons?: (string | AlertButton)[];
    backdropDismiss?: boolean;
    returnData?: boolean;
}

export interface IModal {
    component: any;
    componentProps?: any;
    returnData?: boolean;
    cssClass?: string;
    backdropDismiss?: boolean;
}

export interface IAlert {
    header?: string;
    subHeader?: string;
    message?: string;
    buttons?: (string | AlertButton)[];
    backdropDismiss?: boolean;
    returnData?: boolean;
}

export interface IPopover {
    component: any,
    componentProps?: any,
    control?: any,
    cssClass?: string,
    mode?: Mode,
    closeDidDismiss?: boolean,
    backdropDismiss?: boolean,
    translucent?: boolean
}

export interface ILoading {
    spinner?: SpinnerTypes;
    duration?: number;
    message?: string;
    translucent?: boolean;
    cssClass?: (string | string[]);
}