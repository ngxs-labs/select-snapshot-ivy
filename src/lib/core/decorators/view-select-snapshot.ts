import {
  ɵComponentDef as ComponentDef,
  ɵComponentType as ComponentType,
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
    const properties = defineSelectSnapshotProperties(selectorOrFeature, paths, target, name);

    const def = getComponentDef(target.constructor);
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
  };
}

function getComponentDef<T>(target: ComponentType<T>): ComponentDef<T> {
  return target.ngComponentDef;
}

function createStoreSubscription(selector: any): Subscription {
  const store = directiveInject(Store);
  const ref = injectViewRef();
  return store.select(selector).subscribe(() => ref.markForCheck());
}

function injectViewRef(): ViewRef {
  // `<any>` is needed here because `ChangeDetectorRef` is an abstract class
  // abstract classes cannot be assigned to the `Type<T>`
  return directiveInject<ViewRef>(<any>ChangeDetectorRef);
}

function overrideOnDestroy<T>(def: ComponentDef<T>, selector: any): void {
  const subscription = createStoreSubscription(selector);

  // `ngOnDestroy` might not exist
  const onDestroy: (() => void) | null = def.onDestroy;
  def.onDestroy = () => {
    // If the instance actually has `ngOnDestroy` then call the original one
    onDestroy && onDestroy();
    // Unsubscribe to avoid potentional memory leaks
    subscription.unsubscribe();
  };
}
