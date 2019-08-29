import { Component, ChangeDetectionStrategy, Input, OnDestroy } from '@angular/core';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot-ivy';

import { CounterState } from '../counter.state';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent implements OnDestroy {
  @ViewSelectSnapshot(CounterState.getCounter) counterz!: number;

  @Input() ivyEnabled: boolean = null!;

  @Input() counter: number = null!;

  ngOnDestroy(): void {
    console.log('Oh no, I was destroyed!');
  }
}
