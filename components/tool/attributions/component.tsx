import React from 'react';
import Image from 'next/image';

import { exportSelectors } from 'modules/tool';
import { useAppSelector } from 'hooks/redux';
import { AttributionsProps } from './types';

const Attributions: React.FC<AttributionsProps> = ({}: AttributionsProps) => {
  const exporting = useAppSelector(exportSelectors.selectExporting);

  return (
    <div className="c-tool-attributions">
      {exporting && (
        <div className="logo">
          <Image
            src={`${process.env.BASE_PATH ?? ''}/images/mongabay-horizontal.jpg`}
            alt="Mongabay"
            width={135}
            height={20}
          />
        </div>
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
