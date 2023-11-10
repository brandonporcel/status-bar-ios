import { Injectable, isDevMode } from '@angular/core';
import { PopoverController, ModalController, AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { IToast, ILoading, IModal, IAlert, IPopover } from '@app-shared/models/controls.index';
import {
  timer,
  messageTime,
  message,
  popoverStyles
} from 'src/constants/config.constants';

@Injectable({
  providedIn: 'root'
})
export class ControlService {

  constructor(
    private popoverCtrl: PopoverController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) { }

  //** ------------------------------------------------------------> ALERT */
  async mostrar_alert(config: IAlert) {

    const alert = await this.alertCtrl.create({
      header: config.header,
      subHeader: config.subHeader,
      message: config.message,
      buttons: config.buttons,
      backdropDismiss: config.backdropDismiss
    });

    await alert.present();

    if (config.returnData) {
      const data = await alert.onDidDismiss();
      return data;
    }
  }

  cerrar_alert(data?: any) {

    this.alertCtrl.dismiss(data);
  }

  //** ------------------------------------------------------------> MODAL */
  async mostrar_modal(config: IModal) {

    const modal = await this.modalCtrl.create({
      component: config.component,
      componentProps: config.componentProps,
      cssClass: config.cssClass,
      backdropDismiss: config.backdropDismiss,
    });

    await modal.present();

    if (config.returnData) {

      const data = await modal.onDidDismiss();
      return data;
    }
  }

  cerrar_modal(data?: any) {

    this.modalCtrl.dismiss(data)
      .catch((error) => console.log(error));
  }

  //** ------------------------------------------------------------> LOADING */
  async mostrarLoading(message?: string, duration: number = timer.loading) {

    const loading = await this.loadingCtrl.create({
      message,
      duration
    });

    return await loading.present();
  }

  async mostrar_loading_con_opciones(config: ILoading) {

    const loading = await this.loadingCtrl.create({
      spinner: config.spinner,
      duration: config.duration,
      message: config.message,
      translucent: config.translucent,
      cssClass: config.cssClass
    });

    return await loading.present();
  }

  async ocultar_loading() {

    this.loadingCtrl.dismiss()
      .catch(() => { });
  }

  //** ------------------------------------------------------------> TOAST */
  async mostrar_toast(message?: string, duration?: number) {

    const toast = await this.toastCtrl.create({
      message,
      duration
    });

    toast.present();
  }

  /**
   * Muestra un toast con el mensaje.d
   * En modo dev muestra la devolución del server.
   * En modo prod muestra la respuesta del front.
   * @param error Objeto de Error para interpretar como mensaje que será mostrado en el toast
   * @param mostrarMensajeEnProd Bandera si queremos que muestre el mensaje en modo productivo
   * @param duration Duración en que demorará el toast para ocultarse
   */
  async mostrar_toast_con_error(error: string, mostrarMensajeEnProd: boolean = true, duration?: number) {

    duration = duration ? duration : messageTime;
    if (isDevMode()) {

      this.mostrar_toast(error, duration);
    }
    else if (mostrarMensajeEnProd) {

      this.mostrar_toast(message.error.messageErrorServer, duration);
    }
  }

  async mostrar_toast_con_opciones(config: IToast) {

    const toast = await this.toastCtrl.create({
      header: config.header,
      message: config.message,
      position: config.position,
      buttons: config.buttons
    });

    toast.present();
  }

  //** ------------------------------------------------------------> POPOVER */

  //**control: control que desencadena el evento, es decir, $event */
  //**component: componente que tendrá el contenido del popover */
  //**mode: diseño ios | android */
  //**closeDidDismiss: indicador para determinar si se espera a cerrar o no el popover para devolver la data */
  //**backdropDismiss: indicador para determinar si el popover se cierra o no al presionar el fondo de la pantalla */
  async mostrarPopOver(
    {
      component,
      componentProps = null,
      control = null,
      cssClass = popoverStyles.default,
      mode = 'ios',
      closeDidDismiss = false,
      backdropDismiss = true,
      translucent = false }: IPopover
  ) {

    const popover = await this.popoverCtrl.create({
      component,
      event: control,
      mode,
      backdropDismiss,
      translucent,
      componentProps,
      cssClass,
    });

    await popover.present();

    // Esperar a que se cierre el popover para ejecutar o NO Esperar a que se cierre el popover para ejecutar
    const { data } = closeDidDismiss ?
      await popover.onDidDismiss() : await popover.onWillDismiss();

    return data;
  }

  //**data: información que se devolverá al componente padre que llamó al popover.*/
  cerrarPopOver(data?: any) {

    this.popoverCtrl.dismiss(data);
  }

  //** ------------------------------------------------------------> INFINITESCROLL */
  completar_infinite_scroll(event) {

    if (event) {

      event.target.complete();
    }
  }

  habilitar_infinite_scroll(event, habilitar: boolean = true) {

    if (event) {

      if (event.target) { event.target.disabled = !habilitar; }
      else { event.disabled = !habilitar; }
    }
  }
}
