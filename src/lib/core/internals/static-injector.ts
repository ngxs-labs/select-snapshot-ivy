import { Injector } from '@angular/core';
import { ɵk as NgxsConfig, Store } from '@ngxs/store';

class NgxsSelectSnapshotIvyModuleIsNotImported extends Error {
  constructor() {
    super(`You have import the "NgxsSelectSnapshotIvyModule" before using decorators.`);
  }
}

// The algorithm is originally taken from `@angular/core`
let injector: Injector | null = null;

function assertDefined<T>(actual: T | null | undefined): never | void {
  if (actual == null) {
    throw new NgxsSelectSnapshotIvyModuleIsNotImported();
  }
}

export function setInjector(parentInjector: Injector): void {
  injector = parentInjector;
}

export function getConfig(): never | NgxsConfig {
  assertDefined(injector);
  return injector!.get<NgxsConfig>(NgxsConfig);
}

export function getStore(): never | Store {
  assertDefined(injector);
  return injector!.get<Store>(Store);
}
