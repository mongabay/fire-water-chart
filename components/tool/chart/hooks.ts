import { Spec, InitSignal, ValuesData } from 'vega';
import cloneDeep from 'lodash/cloneDeep';

import { ChartSliceInitialState } from 'modules/tool/chart';
import { useChartData } from 'hooks/use-chart-data';
import { useCountryList } from 'hooks/use-country-list';
import { useRegionList } from 'hooks/use-region-list';
import { UseChartTitle, UseChartSpec } from './types';
import spec from './vega.json';

export const useChartTitle = (iso: string, region: string | null): UseChartTitle => {
  const countryList = useCountryList();
  const regionList = useRegionList(iso);

  if (
    countryList.isError ||
    countryList.isLoading ||
    (region !== null && (regionList.isError || regionList.isError))
  ) {
    return null;
  }

  const countryName = countryList.data?.find((d) => d.iso === iso);
  const regionName = region !== null ? regionList.data?.find((d) => d.id === region) : null;

  if (!countryName || (region && !regionName)) {
    return null;
  }

  if (!region) {
    return countryName.name;
  }

  return `${regionName?.name}, ${countryName.name}`;
};

export const useChartSpec = (
  iso: string,
  region: string | null,
  date: string,
  settings: ChartSliceInitialState['settings']
): UseChartSpec => {
  const chartTitle = useChartTitle(iso, region);
  const chartData = useChartData(date, iso, region ?? undefined);

  const isLoading = !chartTitle || chartData.isLoading;
  const isError = chartData.isError;

  let data;
  if (!isLoading && !isError) {
    data = cloneDeep(spec as Spec);
    (data.signals![0] as InitSignal).value = chartTitle;
    (data.data![0] as ValuesData).values = chartData.data ?? [];

    if (!settings.valueAxes) {
      (data.signals![1] as InitSignal).value = false;
      // This needs to be still manually edited because Vega doesn't support signals on the `labels`
      // property: https://github.com/vega/vega/issues/2691
      data.config!.axisY!.labels = false;
    }

    if (!settings.timeAxis) {
      (data.signals![2] as InitSignal).value = false;
      // This needs to be still manually edited because Vega doesn't support signals on the `labels`
      // property: https://github.com/vega/vega/issues/2691
      data.config!.axisBottom = {
        labels: false,
      };
    }

    if (!settings.header) {
      (data.signals![3] as InitSignal).value = false;
    }

    if (!settings.grid) {
      // This needs to be still manually edited because Vega doesn't support signals on the `grid`
      // property
      data.config!.axis!.grid = false;
    }

    if (!settings.legend) {
      (data.signals![4] as InitSignal).value = false;
    }
  }

  return {
    isLoading,
    isError,
    data,
  };
};
