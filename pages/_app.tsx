import React from 'react';
import { Provider } from 'react-redux';
import Head from 'next/head';
import type { AppProps } from 'next/app';

import { QueryClient, QueryClientProvider } from 'react-query';

import store from 'lib/store';

import 'css/index.scss';

const SatelliteStampApp = ({ Component, pageProps }: AppProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta name="viewport" content="width=1024, initial-scale=1, shrink-to-fit=no" />
          <meta name="author" content="Vizzuality" />
        </Head>
        <Component {...pageProps} />
      </Provider>
    </QueryClientProvider>
  );
};

export default SatelliteStampApp;
