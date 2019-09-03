import {
  ɵComponentDef as ComponentDef,
  ɵComponentType as ComponentType,
  ɵDirectiveType as DirectiveType,
  ɵDirectiveDef as DirectiveDef,
  ɵɵdirectiveInject as directiveInject,
  ViewRef,
  ChangeDetectorRef
} from '@angular/core';
import { Store } from '@ngxs/store';
import { Subscription } from 'rxjs';

import {
  defineSelectSnapshotProperties,
  getSelectorFromInstance
} from '../internals/select-snapshot-internals';

/**
 * This decorator has to be used inside component/directives classes. Because only components
 * and directives can inject `ChangeDetectorRef`
 */
export function ViewSelectSnapshot(selectorOrFeature?: any, ...paths: string[]) {
  return (target: any, name: string) => {
    // If the `ngComponentDef` property defined then it means we're
    // running in the AOT mode
    if (target.constructor.ngComponentDef) {
      decorateDirectiveProperty(selectorOrFeature, paths, target, name);
    } else {
      // This means that application is running in the JIT mode. TypeScript invokes
      // property decorators first before class decorators. That means that the `ngComponentDef`
      // property is not available yet
      // NOTE: This is safe! Because that micro task is scheduled before
      // the application initialized.
      // Angular waits for the completion of the `APP_INITIALIZER`
      // promise factories later
      Promise.resolve().then(() =>
        decorateDirectiveProperty(selectorOrFeature, paths, target, name)
      );
    }
  };
}

function decorateDirectiveProperty(
  selectorOrFeature: any,
  paths: string[],
  target: any,
  name: string
): void {
  const properties = defineSelectSnapshotProperties(selectorOrFeature, paths, target, name);

  const def = getDef(target.constructor);
  const factory = def.factory;

  def.factory = () => {
    const instance = factory(def.type);
    const selector = getSelectorFromInstance(
      instance,
      properties.selectorFnName,
      properties.createSelector,
      properties.selectorOrFeature
    );
    overrideOnDestroy(def, selector);
    return instance;
  };
}

function getDef<T>(type: ComponentType<T> | DirectiveType<T>): ComponentDef<T> | DirectiveDef<T> {
  return (type as ComponentType<T>).ngComponentDef || (type as DirectiveType<T>).ngDirectiveDef;
}

function createStoreSubscription(selector: any): Subscription {
  const store = directiveInject(Store);
  // `<any>` is needed here because `ChangeDetectorRef` is an abstract class
  // abstract classes cannot be assigned to the `Type<T>`
  const ref = directiveInject<ViewRef>(<any>ChangeDetectorRef);
  return store.select(selector).subscribe(() => ref.markForCheck());
}

function overrideOnDestroy<T>(def: ComponentDef<T> | DirectiveDef<T>, selector: any): void {
  const subscription = createStoreSubscription(selector);
  const onDestroy: (() => void) | null = def.onDestroy;

  // Capture context. `onDestroy` is invoked by Angular on the top level
  // already with `onDestroy.call(context)`
  def.onDestroy = function() {
    // Invoke the original `ngOnDestroy` if it exists
    onDestroy && onDestroy.call(this);
    // Unsubscribe to avoid potentional memory leaks
    subscription.unsubscribe();
  };
}
