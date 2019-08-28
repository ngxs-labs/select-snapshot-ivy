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
export function defineSelectSnapshotProperties(
  selectorOrFeature: any,
  paths: string[],
  target: any,
  name: string
) {
  const selectorFnName = `__${name}__selector`;
  const createSelector = createSelectorFactory(paths);

  Object.defineProperties(target, {
    [selectorFnName]: {
      writable: true,
      enumerable: false,
      configurable: true,
    },
    [name]: {
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
    },
  });

  return {
    selectorFnName,
    createSelector,
    selectorOrFeature: selectorOrFeature || removeDollarAtTheEnd(name),
  };
}
