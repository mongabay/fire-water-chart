export interface Country {
  iso: string;
  name: string;
}

export interface Region {
  id: string;
  name: string;
}

export interface ChartDataPoint {
  /** Date in “YYYY-MM-DD” format */
  date: string;
  /** Precipitation in mm/day (1-week moving average) */
  precipitation_w: number;
  /** Precipitation in mm/day (2-month moving average) */
  precipitation_2m: number;
  /** Fire alerts (1-week moving average) */
  fire_w: number;
  /** Fire alerts (2-month moving average) */
  fire_2m: number;
}

export type ChartData = ChartDataPoint[];
