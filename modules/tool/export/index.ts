import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import omit from 'lodash/omit';

import { RootState } from 'lib/store';
import { ToolActionsType } from '../types';

export const SLICE_NAME = 'export';

interface ExportSliceInitialState {
  /** Whether the visualization is being exported */
  exporting: boolean;
  /** Current display mode/visualization layout */
  mode: '1' | '2-vertical' | '2-horizontal' | '4';
  /** Parameters of the current mode */
  modeParams: {
    /** The difference between the multiple charts */
    difference: 'temporal' | 'spatial' | null;
    /** The configuration of each chart from top left corner to bottom right */
    dates: string[];
  };
  /** Width of the exported image */
  width: number;
  /** Height of the exported image */
  height: number;
}

export const INITIAL_STATE: ExportSliceInitialState = {
  exporting: false,
  mode: '1',
  modeParams: {
    difference: null,
    dates: [''],
  },
  width: 480,
  height: 480,
};

export const selectSettings = (state: RootState) => state[SLICE_NAME];
export const selectWidth = createSelector([selectSettings], (settings) => settings.width);
export const selectHeight = createSelector([selectSettings], (settings) => settings.height);
export const selectExporting = createSelector([selectSettings], (settings) => settings.exporting);
export const selectMode = createSelector([selectSettings], (settings) => settings.mode);
export const selectModeParams = createSelector([selectSettings], (settings) => settings.modeParams);

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
      updateModeParams(state, action: PayloadAction<ExportSliceInitialState['modeParams']>) {
        state.modeParams = action.payload;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(
          toolActions.restoreState.fulfilled,
          (state, action: PayloadAction<Partial<RootState>>) => {
            const stateToRestore: Partial<ExportSliceInitialState> =
              action.payload[SLICE_NAME] ?? {};

            return {
              ...state,
              ...stateToRestore,
            };
          }
        )
        .addCase(
          toolActions.updateMode.toString(),
          (state, action: PayloadAction<ExportSliceInitialState['mode']>) => {
            state.mode = action.payload;

            switch (action.payload) {
              case '1':
                state.modeParams.difference = null;
                state.modeParams.dates = [''];
                return;

              case '2-vertical':
              case '2-horizontal':
                state.modeParams.difference = 'spatial';
                state.modeParams.dates = ['', ''];
                return;

              case '4':
                state.modeParams.difference = 'spatial';
                state.modeParams.dates = ['', '', '', ''];
                return;

              default:
            }
          }
        );
    },
  });

export default createExportSlice;
