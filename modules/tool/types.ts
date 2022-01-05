import { ActionCreatorWithoutPayload, AsyncThunk } from '@reduxjs/toolkit';

import { RootState } from 'lib/store';

export interface ToolActionsType {
  restoreState: AsyncThunk<Partial<RootState>, void, { state: unknown }>;
}
