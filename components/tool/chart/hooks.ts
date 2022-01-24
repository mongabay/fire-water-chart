import { Spec, InitSignal, ValuesData, GroupMark } from 'vega';
import cloneDeep from 'lodash/cloneDeep';

import { Country } from 'types';
import { ChartSliceInitialState } from 'modules/tool/chart';
import { useChartData } from 'hooks/use-chart-data';
import { useCountryList } from 'hooks/use-country-list';
import { useRegionList } from 'hooks/use-region-list';
import { UseChartTitle, UseChartSpec } from './types';
import spec from './vega.json';
import { VALUE_UNIT } from '../data-layer-settings/constants';

export const useChartTitle = (country: Country | null, region: string | null): UseChartTitle => {
  const regionList = useRegionList(country);

  if (!country || (region !== null && (regionList.isError || regionList.isError))) {
    return null;
  }

  const regionName = region !== null ? regionList.data?.find((d) => d.id === region) : null;

  if (region && !regionName) {
    return null;
  }

  if (!region) {
    return country.name;
  }

  return `${regionName?.name}, ${country.name}`;
};

export const useChartSpec = (
  iso: string,
  region: string | null,
  date: string,
  unit: keyof typeof VALUE_UNIT,
  oneWeekAverage: boolean,
  twoMonthAverage: boolean,
  settings: ChartSliceInitialState['settings']
): UseChartSpec => {
  const countryList = useCountryList();
  const country = countryList.data?.find((d) => d.iso === iso) ?? null;

  const chartTitle = useChartTitle(country, region);
  const chartData = useChartData(date, iso, region ?? undefined);

  const isLoading = !chartTitle || chartData.isLoading;
  const isError = chartData.isError;

  let data;
  if (!isLoading && !isError) {
    data = cloneDeep(spec as Spec);
    (data.signals![0] as InitSignal).value = chartTitle;
    (data.data![0] as ValuesData).values = cloneDeep(chartData.data) ?? [];

    if (unit === 'Percentage') {
      (data.signals![5] as InitSignal).value = true;
    }

    if (!oneWeekAverage) {
      (data.signals![6] as InitSignal).value = false;
      (data.marks![1] as GroupMark).marks = (data.marks![1] as GroupMark).marks!.filter(
        (mark) => mark.type !== 'line'
      );
    }

    if (!twoMonthAverage) {
      (data.signals![7] as InitSignal).value = false;
      (data.marks![1] as GroupMark).marks = (data.marks![1] as GroupMark).marks!.filter(
        (mark) => mark.type !== 'area'
      );
    }

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
