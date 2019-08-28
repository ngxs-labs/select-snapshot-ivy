import { State, Action, StateContext } from '@ngxs/store';

export interface CounterStateModel {
  counter: number;
}

export class Increment {
  static readonly type = '[Counter] Increment';
}

@State<CounterStateModel>({
  name: 'counter',
  defaults: {
    counter: 0,
  },
})
export class CounterState {
  @Action(Increment)
  increment(ctx: StateContext<CounterStateModel>) {
    const counter = ctx.getState().counter + 1;
    ctx.setState({ counter });
  }
}
