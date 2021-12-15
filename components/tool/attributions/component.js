import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';

const Attributions = ({ attributions, exporting }) => (
  <div className="c-tool-attributions">
    {exporting && (
      <Image
        src={`${process.env.BASE_PATH ?? ''}/images/mongabay-horizontal.jpg`}
        alt="Mongabay"
        width={135}
        height={20}
      />
    )}
    {!exporting && <div />}
  </div>
);

Attributions.propTypes = {
  attributions: PropTypes.string.isRequired,
  exporting: PropTypes.bool.isRequired,
};

export default Attributions;
