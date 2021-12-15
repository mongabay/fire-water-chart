import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Attributions from '../attributions';

const Visualization = ({ exporting, width, height, mode, modeParams }) => {
  return (
    <div
      className={classnames([
        'c-tool-visualization',
        `mode-${mode}`,
        `${exporting ? 'exporting' : ''}`,
      ])}
    >
      {exporting && <div className="exporting-message">Gathering the tiles and exporting...</div>}
      <div
        className="container-width js-visualization"
        // We need both width and min-width:
        // - width so that maps smaller than the parent are correctly sized
        // - min-width so that maps bigger than the parent overflow correctly
        style={exporting ? { width: `${width}px`, minWidth: `${width}px` } : undefined}
      >
        <div className="container-ratio" style={exporting ? { height: `${height}px` } : undefined}>
          <div
            className="map-container"
            style={
              exporting
                ? {
                    width,
                    height: height - 26, // 26px is the height of the attributions
                  }
                : undefined
            }
          ></div>
          <Attributions exporting={exporting} />
        </div>
      </div>
    </div>
  );
};

Visualization.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  exporting: PropTypes.bool.isRequired,
  mode: PropTypes.string.isRequired,
  modeParams: PropTypes.object.isRequired,
};

export default Visualization;
