import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init(): Promise<void> {
    if (!this._storage) {
      const storage = await this.storage.create();
      this._storage = storage;
    }
  }

  private async checkIfInitialized(): Promise<void> {
    if (!this._storage) {
      await this.init();
    }
  }

  async get(key: string): Promise<any> {
    await this.checkIfInitialized();
    return this._storage?.get(key);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async set(key: string, value: string): Promise<any> {
    await this.checkIfInitialized();
    return this._storage?.set(key, value);
  }

  async remove(key: string): Promise<any> {
    await this.checkIfInitialized();
    return this._storage?.remove(key);
  }
}
