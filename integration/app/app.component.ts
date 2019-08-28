import {
  Component,
  ɵivyEnabled as ivyEnabled,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  OnInit,
  NgZone,
  Renderer2
} from '@angular/core';
import { Store } from '@ngxs/store';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot-ivy';

import { CounterState, CounterStateModel, Increment } from './counter.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  @ViewSelectSnapshot(CounterState) counter!: CounterStateModel;

  @ViewChild('button', { static: true }) button!: ElementRef<HTMLButtonElement>;

  ivyEnabled = ivyEnabled;

  constructor(private zone: NgZone, private renderer: Renderer2, private store: Store) {}

  ngOnInit() {
    this.zone.runOutsideAngular(() =>
      this.renderer.listen(this.button.nativeElement, 'click', () => {
        this.store.dispatch(new Increment());
      })
    );
  }
}
