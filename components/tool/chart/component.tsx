import React, { useRef, useEffect } from 'react';
import { View, parse } from 'vega';

import { chartSelectors } from 'modules/tool';
import { useAppSelector } from 'hooks/redux';
import { ChartProps } from './types';
import { useChartSpec } from './hooks';
import LoadingSpinner from 'components/loading-spinner';

export const Chart: React.FC<ChartProps> = ({}: ChartProps) => {
  const iso = useAppSelector(chartSelectors.selectIso);
  const region = useAppSelector(chartSelectors.selectRegion);
  const date = useAppSelector(chartSelectors.selectDate);
  const unit = useAppSelector(chartSelectors.selectUnit);
  const oneWeekAverage = useAppSelector(chartSelectors.selectOneWeekAverage);
  const twoMonthAverage = useAppSelector(chartSelectors.selectTwoMonthAverage);
  const settings = useAppSelector(chartSelectors.selectSettings);

  const containerRef = useRef<HTMLDivElement>(null);

  const chartSpec = useChartSpec(
    iso,
    region,
    date,
    unit,
    oneWeekAverage,
    twoMonthAverage,
    settings
  );

  useEffect(() => {
    if (containerRef.current && !chartSpec.isLoading && !chartSpec.isError && chartSpec.data) {
      const runtime = parse(chartSpec.data);
      const view = new View(runtime, {
        container: '.js-chart-container',
      });

      const { width, height } = containerRef.current.getBoundingClientRect();

      // 1px is the width of the border around the chart
      view.width(width - 2);
      view.height(height - 2);
      view.runAsync();

      return () => {
        view.finalize();
      };
    }
  }, [chartSpec]);

  return (
    <div ref={containerRef} className="c-tool-chart">
      {!chartSpec.isLoading && !chartSpec.isError && <div className="js-chart-container" />}
      {chartSpec.isLoading && <LoadingSpinner inner transparent />}
      {chartSpec.isError && (
        <p className="text-center">
          Unable to load the data. Please retry in a few minutes or with different settings.
        </p>
      )}
    </div>
  );
};

export default Chart;
