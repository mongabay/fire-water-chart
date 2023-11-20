import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

const HeadComponent = ({ title, description }) => (
  <Head>
    <title key="title">
      {title ? `${title} | Fire-Drought Data Tool` : 'Fire-Drought Data Tool'}
    </title>
    <meta
      key="description"
      name="description"
      content={
        description
          ? description
          : 'Use this tool to explore and report temporal interactions between annual precipitation and fire occurrences at national and subnational scales.'
      }
    />
  </Head>
);

HeadComponent.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};

HeadComponent.defaultProps = {
  title: null,
  description: null,
};

export default HeadComponent;
