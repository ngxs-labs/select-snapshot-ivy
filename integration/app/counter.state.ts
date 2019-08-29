import { State, Action, StateContext, Selector } from '@ngxs/store';

export interface CounterStateModel {
  counter: number;
}

export class Increment {
  static readonly type = '[Counter] Increment';
}

@State<CounterStateModel>({
  name: 'counter',
  defaults: {
    counter: 0
  }
})
export class CounterState {
  @Selector()
  static getCounter(state: CounterStateModel): number {
    return state.counter;
  }

  @Action(Increment)
  increment(ctx: StateContext<CounterStateModel>) {
    const counter = ctx.getState().counter + 1;
    ctx.setState({ counter });
  }
}
