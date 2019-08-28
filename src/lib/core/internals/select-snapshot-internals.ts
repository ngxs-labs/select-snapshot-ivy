/**
 * The content of this file are internals of the `@ngxs/select-snapshot-ivy` package
 */
import { StaticInjector } from './static-injector';
import { getPropsArray, propGetter, META_KEY, removeDollarAtTheEnd } from './ngxs-internals';

type CreateSelectorFactory = (selectorOrFeature: any) => any;

function createSelectorFactory(paths: string[]): CreateSelectorFactory {
  return (selectorOrFeature: any) => {
    const config = StaticInjector.getConfig();

    if (typeof selectorOrFeature === 'string') {
      const propsArray = getPropsArray(selectorOrFeature, paths);
      return propGetter(propsArray, config);
    } else if (selectorOrFeature[META_KEY] && selectorOrFeature[META_KEY].path) {
      return propGetter(selectorOrFeature[META_KEY].path.split('.'), config);
    }

    return selectorOrFeature;
  };
}

export function defineSelectorFnName(target: any, selectorFnName: string) {
  Object.defineProperty(target, selectorFnName, {
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

export function defineSnapshotSelectorGetter(
  target: any,
  name: string,
  selectorFnName: string,
  createSelector: CreateSelectorFactory,
  selectorOrFeature: any
) {
  Object.defineProperty(target, name, {
    get() {
      const selector = getSelectorFromInstance(
        this,
        selectorFnName,
        createSelector,
        selectorOrFeature
      );
      // Don't use the `directiveInject` here as it works ONLY
      // during view creation
      const store = StaticInjector.getStore();
      return store.selectSnapshot(selector);
    },
    enumerable: true,
    configurable: true,
  });
}

export function getSelectorFromInstance(
  instance: any,
  selectorFnName: string,
  createSelector: CreateSelectorFactory,
  selectorOrFeature: any
) {
  return instance[selectorFnName] || (instance[selectorFnName] = createSelector(selectorOrFeature));
}

/**
 * Just a reusable function between 2 decorators
 */
export function resolveProperties(name: string, paths: string[], selectorOrFeature: any) {
  return {
    selectorFnName: `__${name}__selector`,
    createSelector: createSelectorFactory(paths),
    selectorOrFeature: selectorOrFeature || removeDollarAtTheEnd(name)
  };
}
