import { capitalize } from 'lodash'
import { create, Mutate, StateCreator, StoreApi, UseBoundStore } from 'zustand'
import {
  subscribeWithSelector,
  devtools,
  persist,
  PersistOptions,
  DevtoolsOptions,
  redux,
} from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { ZustandGetterSelectors, ZustandHookSelectors } from './types'

export const createStore = <T extends object>(
  creator: StateCreator<
    T,
    [
      ['zustand/subscribeWithSelector', never],
      ['zustand/immer', never],
      ['zustand/devtools', never],
    ]
  >,
  devtoolsOptions?: DevtoolsOptions,
) => {
  return create<T>()(subscribeWithSelector(immer(devtools(creator, devtoolsOptions))))
}

export const createPersistStore = <T extends object, P = T>(
  creator: StateCreator<
    T,
    [
      ['zustand/subscribeWithSelector', never],
      ['zustand/immer', never],
      ['zustand/devtools', never],
      ['zustand/persist', P],
    ]
  >,
  persistOptions: PersistOptions<T, P>,
  devtoolsOptions?: DevtoolsOptions,
) => {
  return create<T>()(
    subscribeWithSelector(
      immer(devtools(persist(creator as unknown as any, persistOptions), devtoolsOptions)),
    ),
  )
}

type Action = {
  type: unknown
}

export const createReduxStore = <T extends object, A extends Action>(
  reducer: (state: T, action: A) => T,
  initialState: T,
  devtoolsOptions?: DevtoolsOptions,
) => create(subscribeWithSelector(immer(devtools(redux(reducer, initialState), devtoolsOptions))))

export const createPersistReduxStore = <T extends object, A extends Action, P = T>(
  reducer: (state: T, action: A) => T,
  initialState: T,
  persistOptions: PersistOptions<T, P>,
  devtoolsOptions?: DevtoolsOptions,
) =>
  create(
    subscribeWithSelector(
      immer(
        devtools(persist(redux(reducer, initialState), persistOptions as any), devtoolsOptions),
      ),
    ),
  )

/**
 * 直接通过getters获取状态值，比如store.getters.xxx()
 * @param store
 */
export function createStoreGetters<T extends object>(
  store: UseBoundStore<
    Mutate<
      StoreApi<T>,
      [
        ['zustand/subscribeWithSelector', never],
        ['zustand/immer', never],
        ['zustand/devtools', never],
      ]
    >
  >,
) {
  const storeIn = store as any

  storeIn.getters = {}
  Object.keys(storeIn.getState()).forEach((key) => {
    const selector = (state: T) => state[key as keyof T]
    storeIn.getters[key] = () => storeIn(selector)
  })

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  return storeIn as typeof store & ZustandGetterSelectors<T>
}

/**
 * 直接通过类似hooks的方法获取状态值，比如store.useXxx()
 * @param store
 */
export function createStoreHooks<T extends Record<string, any>>(
  store: UseBoundStore<
    Mutate<
      StoreApi<T>,
      [
        ['zustand/subscribeWithSelector', never],
        ['zustand/immer', never],
        ['zustand/devtools', never],
      ]
    >
  >,
) {
  const storeIn = store as any

  Object.keys(storeIn.getState()).forEach((key) => {
    const selector = (state: T) => state[key as keyof T]
    storeIn[`use${capitalize(key)}`] = () => storeIn(selector)
  })

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  return storeIn as typeof store & ZustandHookSelectors<T>
}
