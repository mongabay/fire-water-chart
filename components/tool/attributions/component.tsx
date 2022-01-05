import React from 'react';

import { exportSelectors } from 'modules/tool';
import { useAppSelector } from 'hooks/redux';
import { AttributionsProps } from './types';

const Attributions: React.FC<AttributionsProps> = ({}: AttributionsProps) => {
  const exporting = useAppSelector(exportSelectors.selectExporting);

  return (
    <div className="c-tool-attributions">
      {exporting && (
        // We can't use the `<Image />` component from Next.js here because it doesn't get exported
        // correctly
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${process.env.BASE_PATH ?? ''}/images/mongabay-horizontal.jpg`}
          alt="Mongabay"
          width={135}
          height={20}
        />
      )}
      {!exporting && <div />}
      <div className="content">
        Data from{' '}
        <a href="https://globalforestwatch.org/" rel="noopener noreferrer" target="_blank">
          Global Forest Watch
        </a>{' '}
        (NASA FIRMS. “
        <a
          href="https://earthdata.nasa.gov/earth-observation-data/near-real-time/firms/v1-vnp14imgt"
          rel="noopener noreferrer"
          target="_blank"
        >
          VIIRS Active Fires
        </a>
        .”) and the{' '}
        <a href="https://chc.ucsb.edu/" rel="noopener noreferrer" target="_blank">
          Climate Hazards Center
        </a>{' '}
        (
        <a href="https://chc.ucsb.edu/data/chirps" rel="noopener noreferrer" target="_blank">
          CHIRPS Rainfall Estimates
        </a>
        ) .
      </div>
    </div>
  );
};

export default Attributions;
