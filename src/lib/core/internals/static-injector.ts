import { Injector, Injectable } from '@angular/core';
import { ɵk as NgxsConfig, Store } from '@ngxs/store';

class NgxsSelectSnapshotModuleIsNotImported extends Error {
  constructor() {
    super(`You've forgotten to import "NgxsSelectSnapshotModule"!`);
  }
}

@Injectable()
export class StaticInjector {
  private static injector: Injector | null = null;

  constructor(injector: Injector) {
    StaticInjector.injector = injector;
  }

  static getConfig(): never | NgxsConfig {
    if (this.injector === null) {
      throw new NgxsSelectSnapshotModuleIsNotImported();
    }

    return this.injector.get<NgxsConfig>(NgxsConfig);
  }

  static getStore(): never | Store {
    if (this.injector === null) {
      throw new NgxsSelectSnapshotModuleIsNotImported();
    }

    return this.injector.get<Store>(Store);
  }
}
