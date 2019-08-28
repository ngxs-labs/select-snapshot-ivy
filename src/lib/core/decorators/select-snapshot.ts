import {
  defineSelectorFnName,
  defineSnapshotSelectorGetter,
  resolveProperties,
} from '../internals/select-snapshot-internals';

/**
 * This decorator has to be used inside any non-component classes, these can be
 * services, interceptors etc. Everything that cannot inject `ChangeDetectorRef`
 */
export function SelectSnapshot(selectorOrFeature?: any, ...paths: string[]) {
  return (target: any, name: string) => {
    const properties = resolveProperties(name, paths, selectorOrFeature);

    defineSelectorFnName(target, properties.selectorFnName);

    defineSnapshotSelectorGetter(
      target,
      name,
      properties.selectorFnName,
      properties.createSelector,
      selectorOrFeature
    );
  };
}
