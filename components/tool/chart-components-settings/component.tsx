import React, { useMemo } from 'react';

import { chartActions, chartSelectors } from 'modules/tool';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { Checkbox } from 'components/forms';

import { ChartComponentsSettingsProps } from './types';

export const ChartComponentsSettings: React.FC<
  ChartComponentsSettingsProps
> = ({}: ChartComponentsSettingsProps) => {
  const settings = useAppSelector(chartSelectors.selectSettings);

  const dispatch = useAppDispatch();

  const settingList = useMemo(
    () => [
      {
        id: 'value-axes',
        name: 'Value axes',
        value: settings.valueAxes,
        onChange: (valueAxes: boolean) =>
          dispatch(chartActions.updateSettings({ ...settings, valueAxes })),
      },
      {
        id: 'time-axis',
        name: 'Time axis',
        value: settings.timeAxis,
        onChange: (timeAxis: boolean) =>
          dispatch(chartActions.updateSettings({ ...settings, timeAxis })),
      },
      {
        id: 'time-header',
        name: 'Chart header',
        value: settings.header,
        onChange: (header: boolean) =>
          dispatch(chartActions.updateSettings({ ...settings, header })),
      },
      {
        id: 'time-grid',
        name: 'Chart grid',
        value: settings.grid,
        onChange: (grid: boolean) => dispatch(chartActions.updateSettings({ ...settings, grid })),
      },
      {
        id: 'time-legend',
        name: 'Legend',
        value: settings.legend,
        onChange: (legend: boolean) =>
          dispatch(chartActions.updateSettings({ ...settings, legend })),
      },
    ],
    [settings, dispatch]
  );

  return (
    <div className="c-tool-chart-components-settings">
      {settingList.map((setting) => (
        <Checkbox
          key={setting.id}
          id={`chart-component-${setting.id}`}
          name="chart-component"
          checked={setting.value}
          onChange={() => setting.onChange(!setting.value)}
        >
          {setting.name}
        </Checkbox>
      ))}
    </div>
  );
};

export default ChartComponentsSettings;
