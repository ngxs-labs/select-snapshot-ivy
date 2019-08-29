import { Component, ChangeDetectionStrategy, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent implements OnDestroy {
  @Input() ivyEnabled: boolean = null!;

  @Input() counter: number = null!;

  ngOnDestroy(): void {
    console.log('Oh no, I was destroyed!');
  }
}
