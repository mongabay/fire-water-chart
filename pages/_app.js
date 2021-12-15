import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import Head from 'next/head';

import store from 'lib/store';

import 'css/index.scss';

const SatelliteStampApp = ({ Component, pageProps }) => (
  <Provider store={store}>
    <Head>
      <meta charSet="utf-8" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta name="viewport" content="width=1024, initial-scale=1, shrink-to-fit=no" />
      <meta name="author" content="Vizzuality" />
    </Head>
    <Component {...pageProps} />
  </Provider>
);

SatelliteStampApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.any,
};

SatelliteStampApp.defaultProps = {
  pageProps: {},
};

export default SatelliteStampApp;
