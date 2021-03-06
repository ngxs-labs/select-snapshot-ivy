import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsSelectSnapshotIvyModule } from '@ngxs-labs/select-snapshot-ivy';

import { CounterState } from './counter.state';

import { AppComponent } from './app.component';
import { CounterComponent } from './counter/counter.component';

import { environment } from '../environments/environment';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'select-snapshot-ivy' }),
    NgxsModule.forRoot([CounterState], { developmentMode: !environment.production }),
    NgxsLoggerPluginModule.forRoot({ disabled: environment.production }),
    NgxsSelectSnapshotIvyModule.forRoot()
  ],
  declarations: [AppComponent, CounterComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
