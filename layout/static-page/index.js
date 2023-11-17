import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Head from 'components/head';
import Icons from 'components/icons';

const StaticPage = ({ className, children }) => (
  <div className={classNames('l-simple-page', className)}>
    <Head />
    <main className="l-static-page">
      <div className="logo">
        <img // eslint-disable-line @next/next/no-img-element
          src={`${process.env.BASE_PATH ?? ''}/images/mongabay-horizontal.jpg`}
          alt="Mongabay"
          width={135}
          height={20}
        />
      </div>
      {children}
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
