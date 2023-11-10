import { Injectable } from '@angular/core';

// Plugins
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';

// Interfaces
import { IDictionary } from '@app-shared/models/storage.interface';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private isWeb: boolean;
  currentValue: string;

  constructor(
    private platform: Platform,
    private storage: Storage,
  ) {
    this.isWeb = !this.platform.is('capacitor');
  }

  guardar(keyValuePair: IDictionary) {
    if (this.isWeb) {
      // web
      localStorage.setItem(keyValuePair.key, keyValuePair.value);
    } else {
      // mobile
      this.storage.set(keyValuePair.key, keyValuePair.value).catch((error) => {
        throw error;
      });
    }
  }

  cargar(key: string) {
    return new Promise<string | boolean>((resolve, reject) => {
      if (this.isWeb) {
        // web
        if (localStorage.getItem(key)) {
          this.currentValue = localStorage.getItem(key);
          resolve(this.currentValue);
        } else {
          resolve(null);
        }
      } else {
        // mobile
        this.storage
          .get(key)
          .then((val) => {
            if (val) {
              this.currentValue = val;
              resolve(this.currentValue);
            } else {
              resolve(null);
            }
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  }

  borrar(listKey: string[]) {
    listKey.forEach((key: string) => {
      if (this.isWeb) {
        localStorage.removeItem(key);
      } else {
        this.storage.remove(key);
      }
    });
  }

  limpiar() {
    if (this.isWeb) {
      localStorage.clear();
    } else {
      this.storage.clear().then(() => (this.currentValue = null));
    }
  }

  existe(key: string): any {
    if (this.isWeb) {
      // web
      if (localStorage.getItem(key)) {
        return localStorage.getItem(key);
      } else {
        return false;
      }
    }
    if (!this.isWeb) {
      this.storage.get(key).then((val) => {
        if (val) {
          return val;
        } else {
          return false;
        }
      });
    }
  }
}
