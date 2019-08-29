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
  return (target: Object, name: string) => {
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
      overrideOnDestroy(def, selector, instance);
      return instance;
    };
  };
}

function getComponentDef<T>(target: Function): ComponentDef<T> {
  return (<ComponentType<T>>target).ngComponentDef;
}

function createStoreSubscription(selector: any): Subscription {
  const store = directiveInject(Store);
  // `<any>` is needed here because `ChangeDetectorRef` is an abstract class
  // abstract classes cannot be assigned to the `Type<T>`
  const ref = directiveInject<ViewRef>(<any>ChangeDetectorRef);
  return store.select(selector).subscribe(() => ref.markForCheck());
}

function overrideOnDestroy<T>(def: ComponentDef<T>, selector: any, instance: any): void {
  const subscription = createStoreSubscription(selector);

  // `ngOnDestroy` might not exist
  const onDestroy: (() => void) | null = def.onDestroy;
  def.onDestroy = () => {
    // If the instance actually has `ngOnDestroy` then call the original one
    onDestroy && onDestroy.call(instance);
    // Unsubscribe to avoid potentional memory leaks
    subscription.unsubscribe();
  };
}
