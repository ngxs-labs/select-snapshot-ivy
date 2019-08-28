import { defineSelectSnapshotProperties } from '../internals/select-snapshot-internals';

/**
 * This decorator has to be used inside any non-component classes, these can be
 * services, interceptors etc. Everything that cannot inject `ChangeDetectorRef`
 */
export function SelectSnapshot(selectorOrFeature?: any, ...paths: string[]) {
  return (target: any, name: string) => {
    defineSelectSnapshotProperties(selectorOrFeature, paths, target, name);
  };
}
