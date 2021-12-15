import { createSelector, createAction, createAsyncThunk } from '@reduxjs/toolkit';

import { deserialize, serialize } from 'utils/functions';
import { selectQuery } from '../routing';
import createExportSlice, * as exportModule from './export';

// Common actions for the tool module
const actions = {
  restoreState: createAsyncThunk('tool/restoreState', (_, { getState }) => {
    const state = getState();
    const query = selectQuery(state);
    return deserialize(query.state);
  }),
  updateMode: createAction('tool/updateMode'),
  updateMapDifference: createAction('tool/updateMapDifference'),
};

// Slices belonging to the tool module
const exportSlice = createExportSlice(actions);

// Common selectors for the tool module
const selectors = {
  selectSerializedState: createSelector([exportModule.selectSerializedState], (exportState) =>
    serialize({
      [exportModule.SLICE_NAME]: exportState,
    })
  ),
  selectRestoring: createSelector([], () => null),
  selectAttributions: createSelector(
    [exportModule.selectMode, exportModule.selectModeParams],
    (basemap, basemapParams, dataLayers, activeDataLayers, recentImagery, mode, modeParams) => {
      return '';
    }
  ),
};

export const toolActions = actions;
export const toolSelectors = selectors;

export const exportReducer = exportSlice.reducer;
export const exportActions = exportSlice.actions;
export const exportSelectors = exportModule;
