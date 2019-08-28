import { Injector } from '@angular/core';
import { ɵk as NgxsConfig, Store } from '@ngxs/store';

class NgxsSelectSnapshotModuleIsNotImported extends Error {
  constructor() {
    super(`You've forgotten to import "NgxsSelectSnapshotModule"!`);
  }
}

// The algorithm is originally taken from `@angular/core`
let injector: Injector | null = null;

function assertInjector() {
  if (injector === null) {
    throw new NgxsSelectSnapshotModuleIsNotImported();
  }
}

export function setInjector(parentInjector: Injector): void {
  injector = parentInjector;
}

export function getConfig(): never | NgxsConfig {
  assertInjector();
  return injector!.get<NgxsConfig>(NgxsConfig);
}

export function getStore(): never | Store {
  assertInjector();
  return injector!.get<Store>(Store);
}
