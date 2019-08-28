<p align="center">
  <img src="https://raw.githubusercontent.com/ngxs-labs/emitter/master/docs/assets/logo.png">
</p>

---

> Flexibile decorator, an alternative for the `@Select` but selects a snapshot of the state.

# Disclaimer

This package is compatible only with Ivy and only if AOT is enabled via `"aot": true`.

## 📦 Install

To install `@ngxs-labs/select-snapshot-ivy` run the following command:

```console
yarn add @ngxs-labs/select-snapshot-ivy
```

## 🔨 Usage

Import the module into your root application module:

```typescript
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { NgxsSelectSnapshotIvyModule } from '@ngxs/select-snapshot-ivy';

@NgModule({
  imports: [
    NgxsModule.forRoot(states),
    NgxsSelectSnapshotIvyModule.forRoot()
  ]
})
export class AppModule {}
```

### Selecting snapshot

There are 2 decorators exposed publicly. These are `@SelectSnapshot` and `@ViewSelectSnapshot`. They can decorate class properties. Given the following example:

```ts
@Injectable()
export class TokenInterceptor {

  @SelectSnapshot(AuthState.token) token: string | null;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${this.token}`
        }
      });
    }

    return next.handle(req);
  }

}
```

We assume that the `AuthState` has static selector `token`:

```ts
export class AuthState {

  @Selector()
  static token(state: AuthStateModel): string | null {
    return state.token;
  }

}
```

As you mentioned we don't have to inject the `Store` class and call the `selectSnapshot`. This simplifies business logic. What about the `@ViewSelectSnapshot` decorator? This decorator must be used only inside components and directives. Why? They are able to inject an instance of the `ChangeDetectorRef`. The `@ViewSelectSnapshot` decorator retrieves `ChangeDetectorRef` instance and invokes `markForCheck` under the hood thus your view gets updated. Let's look at the below example:

```ts
import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  OnInit,
  NgZone,
  Renderer2,
} from '@angular/core';
import { Store } from '@ngxs/store';
import { ViewSelectSnapshot } from '@ngxs/select-snapshot-ivy';

import { CounterState, CounterStateModel, Increment } from './counter.state';

@Component({
  selector: 'app-root',
  template: `
    <pre>Counter state: {{ counter | json }}</pre>
    <button #button>Increment outside of Angular's zone</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  @ViewSelectSnapshot(CounterState) counter: CounterStateModel;

  @ViewChild('button', { static: true }) button: ElementRef<HTMLButtonElement>;

  constructor(private zone: NgZone, private renderer: Renderer2, private store: Store) {}

  ngOnInit() {
    this.zone.runOutsideAngular(() =>
      this.renderer.listen(this.button.nativeElement, 'click', () => {
        this.store.dispatch(new Increment());
      })
    );
  }

}
```

We intentionally use the `runOutsideAngular` to add an event listener outside of the Angular's zone, thus it will not cause `ApplicationRef.tick` to be invoked. But if you try this example you will mention that the view gets updated still reacting on the state changes.

### Summary

We have looked at several examples of using the `@SelectSnapshot` and the `@ViewSelectSnapshot`. Consider to use the `@SelectSnapshot` in non-component classes only! Use the `@ViewSelectSnapshot` in components and directives only!
