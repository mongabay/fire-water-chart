import React from 'react';
import classnames from 'classnames';

import { useAppSelector } from 'hooks/redux';
import { exportSelectors } from 'modules/tool';

import Chart from '../chart';
import Attributions from '../attributions';

export const Visualization = () => {
  const width = useAppSelector(exportSelectors.selectWidth);
  const height = useAppSelector(exportSelectors.selectHeight);
  const exporting = useAppSelector(exportSelectors.selectExporting);

  return (
    <div className={classnames(['c-tool-visualization', `${exporting ? 'exporting' : ''}`])}>
      {exporting && <div className="exporting-message">Exporting...</div>}
      <div
        className="m-auto d-flex flex-column js-visualization"
        // We need both width and min-width:
        // - width so that charts smaller than the parent are correctly sized
        // - min-width so that charts bigger than the parent overflow correctly
        style={{ width: `${width}px`, minWidth: `${width}px`, height: `${height}px` }}
      >
        <div className="chart-container">
          <Chart />
        </div>
        <Attributions />
      </div>
    </div>
  );
};

export default Visualization;
