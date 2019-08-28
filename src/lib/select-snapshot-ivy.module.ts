import { NgModule, ModuleWithProviders, Self } from '@angular/core';

import { StaticInjector } from './core/internals/static-injector';

@NgModule()
export class NgxsSelectSnapshotIvyModule {
  constructor(@Self() _staticInjector: StaticInjector) {}

  static forRoot(): ModuleWithProviders<NgxsSelectSnapshotIvyModule> {
    return {
      ngModule: NgxsSelectSnapshotIvyModule,
      providers: [StaticInjector]
    };
  }
}
