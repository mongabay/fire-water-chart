import React from 'react';

import { DataLayersSettingsProps } from './types';

export const DataLayersSettings: React.FC<DataLayersSettingsProps> = ({}: DataLayersSettingsProps) => (
  <div className="c-tool-data-layers-settings">
    <h2>Location</h2>
    <h2>Time frame</h2>
  </div>
);

export default DataLayersSettings;
