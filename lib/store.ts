import { configureStore, combineReducers } from '@reduxjs/toolkit';

import routingReducer from 'modules/routing';
import { exportReducer, chartReducer } from 'modules/tool';
import routes from 'lib/routes';

const { pathname, query } =
  // During development, SSR is still on, so we need to make sure it can execute on the server
  // Anyway, the code will be executed again in the browser
  typeof window !== 'undefined'
    ? routes.match(location.href).parsedUrl
    : { pathname: '/', query: {} };

const store = configureStore({
  preloadedState: {
    // We want the initial state to contain the route info to later restore the state
    routing: {
      pathname,
      query,
    },
  },
  reducer: combineReducers({
    routing: routingReducer,
    export: exportReducer,
    chart: chartReducer,
  }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
