import { Component, Type, ɵivyEnabled as ivyEnabled } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { State, Action, StateContext, NgxsModule, Store, Selector } from '@ngxs/store';

import { SelectSnapshot, NgxsSelectSnapshotIvyModule } from '..';

describe('SelectSnapshot', () => {
  interface AnimalsStateModel {
    pandas: string[];
  }

  type BearsStateModel = string[];

  interface BearsChildrenStateModel {
    children: string[];
  }

  class AddPanda {
    static type = '[Animals] Add panda';
    constructor(public name: string) {}
  }

  // Used for convenience and avoiding `any` in the selector callbacks
  interface RootStateModel {
    animals: {
      pandas: string[];
      bears: string[] & {
        bearsChildren: {
          children: string[];
        };
      };
    };
  }

  @State<BearsChildrenStateModel>({
    name: 'bearsChildren',
    defaults: {
      children: []
    }
  })
  class BearsChildrenState {}

  @State<BearsStateModel>({
    name: 'bears',
    defaults: [],
    children: [BearsChildrenState]
  })
  class BearsState {}

  @State<AnimalsStateModel>({
    name: 'animals',
    defaults: {
      pandas: []
    },
    children: [BearsState]
  })
  class AnimalsState {
    @Action(AddPanda)
    addPanda({ getState, patchState }: StateContext<AnimalsStateModel>, { name }: AddPanda): void {
      const { pandas } = getState();

      patchState({
        pandas: [...pandas, name]
      });
    }
  }

  const states = [BearsChildrenState, BearsState, AnimalsState];

  function configureTestingModule<T>(component: Type<T>): void {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot(states), NgxsSelectSnapshotIvyModule.forRoot()],
      declarations: [component]
    });
  }

  it('should', () => {
    // TODO: enable Ivy with tests
    expect(10).toBe(10);
  });
});
