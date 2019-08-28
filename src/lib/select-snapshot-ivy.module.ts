import { NgModule, ModuleWithProviders, Self, Injector } from '@angular/core';

import { setInjector } from './core/internals/static-injector';

@NgModule()
export class NgxsSelectSnapshotIvyModule {
  constructor(injector: Injector) {
    setInjector(injector);
  }

  static forRoot(): ModuleWithProviders<NgxsSelectSnapshotIvyModule> {
    return {
      ngModule: NgxsSelectSnapshotIvyModule
    };
  }
}
