import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import omit from 'lodash/omit';

import { RootState } from 'lib/store';
import { ToolActionsType } from '../types';

export const SLICE_NAME = 'chart';

export interface ChartSliceInitialState {
  /** ISO of the country */
  iso: string;
  /** ID of the region (the whole country if `null`) */
  region: string | null;
  /** Date in the “YYYY-MM-DD” format */
  date: string;
  settings: {
    /** Whether the value axes are displayed */
    valueAxes: boolean;
    /** Whether the time axis is displayed */
    timeAxis: boolean;
    /** Whether the header is displayed */
    header: boolean;
    /** Whether the grid is displayed */
    grid: boolean;
    /** Whether the legend is displayed */
    legend: boolean;
  };
}

export const INITIAL_STATE: ChartSliceInitialState = {
  iso: 'BRA',
  region: null,
  date: new Date().toISOString().split('T')[0],
  settings: {
    valueAxes: true,
    timeAxis: true,
    header: true,
    grid: true,
    legend: true,
  },
};

export const selectChartSettings = (state: RootState) => state[SLICE_NAME];
export const selectIso = createSelector([selectChartSettings], (settings) => settings.iso);
export const selectRegion = createSelector([selectChartSettings], (settings) => settings.region);
export const selectDate = createSelector([selectChartSettings], (settings) => settings.date);
export const selectSettings = createSelector(
  [selectChartSettings],
  (settings) => settings.settings
);

export const selectSerializedState = createSelector([selectChartSettings], (settings) => {
  return omit(settings);
});

const createExportSlice = (toolActions: ToolActionsType) =>
  createSlice({
    name: SLICE_NAME,
    initialState: INITIAL_STATE,
    reducers: {
      updateIso(state, action: PayloadAction<string>) {
        state.iso = action.payload;
        state.region = null;
      },
      updateRegion(state, action: PayloadAction<string | null>) {
        state.region = action.payload;
      },
      updateDate(state, action: PayloadAction<string>) {
        state.date = action.payload;
      },
      updateSettings(state, action: PayloadAction<ChartSliceInitialState['settings']>) {
        state.settings = action.payload;
      },
    },
    extraReducers: (builder) => {
      builder.addCase(
        toolActions.restoreState.fulfilled,
        (state, action: PayloadAction<Partial<RootState>>) => {
          const stateToRestore: Partial<ChartSliceInitialState> = action.payload[SLICE_NAME] ?? {};

          return {
            ...state,
            ...stateToRestore,
          };
        }
      );
    },
  });

export default createExportSlice;
