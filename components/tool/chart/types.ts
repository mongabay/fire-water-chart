import { Spec } from 'vega';

export interface ChartProps {}

export type UseChartTitle = string | null;

export interface UseChartSpec {
  isLoading: boolean;
  isError: boolean;
  data: Spec | undefined;
}
