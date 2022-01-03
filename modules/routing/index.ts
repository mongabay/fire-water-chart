import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from 'lib/store';

interface RoutingSliceInitialState {
  pathname: string;
  query: any;
}

const SLICE_NAME = 'routing';

const INITIAL_STATE: RoutingSliceInitialState = {
  pathname: '/',
  query: {},
};

export const selectPathname = (state: RootState) => state[SLICE_NAME].pathname;
export const selectQuery = (state: RootState) => state[SLICE_NAME].query;

const routingSlice = createSlice({
  name: SLICE_NAME,
  initialState: INITIAL_STATE,
  reducers: {
    updateRoute(state, action: PayloadAction<RoutingSliceInitialState>) {
      return action.payload;
    },
  },
});

export const { updateRoute } = routingSlice.actions;

export default routingSlice.reducer;
