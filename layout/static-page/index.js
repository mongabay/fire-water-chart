import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Head from 'components/head';
import Icons from 'components/icons';
import Header from 'components/header';

const StaticPage = ({ className, children }) => (
  <div>
    <Head />
    <main className="l-static-page">
      <Header />
      <div className={classNames('l-simple-page', className)}>{children}</div>
    </main>
    <Icons />
  </div>
);

StaticPage.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

StaticPage.defaultProps = { className: null };

export default StaticPage;
