import { createSelector, createAction, createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from 'lib/store';
import { deserialize, serialize } from 'utils/functions';
import { selectQuery } from '../routing';
import { ToolActionsType } from './types';
import createExportSlice, * as exportModule from './export';
import createChartSlice, * as chartModule from './chart';

// Common actions for the tool module
const actions: ToolActionsType = {
  restoreState: createAsyncThunk<Partial<RootState>, void, { state: RootState }>(
    'tool/restoreState',
    (_, { getState }) => {
      const state = getState();
      const query = selectQuery(state);
      return deserialize(query.state);
    }
  ),
  updateMode: createAction('tool/updateMode'),
  updateMapDifference: createAction('tool/updateMapDifference'),
};

// Slices belonging to the tool module
const exportSlice = createExportSlice(actions);
const chartSlice = createChartSlice(actions);

// Common selectors for the tool module
const selectors = {
  selectSerializedState: createSelector(
    [exportModule.selectSerializedState, chartModule.selectSerializedState],
    (exportState, chartState) =>
      serialize({
        [exportModule.SLICE_NAME]: exportState,
        [chartModule.SLICE_NAME]: chartState,
      })
  ),
  selectRestoring: createSelector([], () => null),
  selectAttributions: createSelector(
    [exportModule.selectMode, exportModule.selectModeParams],
    (mode, modeParams) => {
      return '';
    }
  ),
};

export const toolActions = actions;
export const toolSelectors = selectors;

export const exportReducer = exportSlice.reducer;
export const exportActions = exportSlice.actions;
export const exportSelectors = exportModule;
export const exportInitialState = exportSlice.getInitialState();

export const chartReducer = chartSlice.reducer;
export const chartActions = chartSlice.actions;
export const chartSelectors = chartModule;
export const chartInitialState = chartSlice.getInitialState();
