import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import omit from 'lodash/omit';

import { RootState } from 'lib/store';
import { ToolActionsType } from '../types';

export const SLICE_NAME = 'export';

export interface ExportSliceInitialState {
  /** Whether the visualization is being exported */
  exporting: boolean;
  /** Width of the exported image */
  width: number;
  /** Height of the exported image */
  height: number;
}

export const INITIAL_STATE: ExportSliceInitialState = {
  exporting: false,
  width: 480,
  height: 480,
};

export const selectSettings = (state: RootState) => state[SLICE_NAME];
export const selectWidth = createSelector([selectSettings], (settings) => settings.width);
export const selectHeight = createSelector([selectSettings], (settings) => settings.height);
export const selectExporting = createSelector([selectSettings], (settings) => settings.exporting);
export const selectSerializedState = createSelector([selectSettings], (settings) => {
  return omit(settings, 'exporting', 'width', 'height');
});

const createExportSlice = (toolActions: ToolActionsType) =>
  createSlice({
    name: SLICE_NAME,
    initialState: INITIAL_STATE,
    reducers: {
      updateSettings(state, action: PayloadAction<Partial<ExportSliceInitialState>>) {
        for (const [key, value] of Object.entries(action.payload)) {
          // The following lines essentially execute this code: `state[key] = value`. Unfortunately,
          // it needs to be a bit more complex for Typescript to accept it.
          type State = typeof state;

          const updateKey = <Key extends keyof State>(stateKey: Key, stateValue: State[Key]) => {
            state[stateKey] = stateValue;
          };

          updateKey(key as keyof State, value);
        }
      },
      updateExporting(state, action: PayloadAction<boolean>) {
        state.exporting = action.payload;
      },
    },
    extraReducers: (builder) => {
      builder.addCase(
        toolActions.restoreState.fulfilled,
        (state, action: PayloadAction<Partial<RootState>>) => {
          const stateToRestore: Partial<ExportSliceInitialState> = action.payload[SLICE_NAME] ?? {};

          return {
            ...state,
            ...stateToRestore,
          };
        }
      );
    },
  });

export default createExportSlice;
