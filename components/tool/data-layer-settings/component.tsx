import React, { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useCountryList } from 'hooks/use-country-list';
import { useOptionList } from 'hooks/use-option-list';
import { useRegionList } from 'hooks/use-region-list';
import { chartActions, chartSelectors, chartReducer, chartInitialState } from 'modules/tool';
import { Select } from 'components/forms';
import LoadingSpinner from 'components/loading-spinner';
import { DataLayerSettingsProps } from './types';

export const DataLayerSettings: React.FC<DataLayerSettingsProps> = ({}: DataLayerSettingsProps) => {
  const iso = useAppSelector(chartSelectors.selectIso);
  const region = useAppSelector(chartSelectors.selectRegion);
  const date = useAppSelector(chartSelectors.selectDate);

  const dispatch = useAppDispatch();

  const {
    isLoading: isCountryListLoading,
    isError: isCountryListError,
    data: countryListData,
  } = useCountryList();

  const countryList = useOptionList(countryListData ?? [], 'name', 'iso');
  const country = countryListData?.find((d) => d.iso === iso);

  const {
    isLoading: isRegionListLoading,
    isError: isRegionListError,
    data: regionListData,
  } = useRegionList(country);

  const regionList = useOptionList(regionListData ?? [], 'name', 'id', {
    additionalOptions:
      !country || !country.partial_data
        ? [
            {
              label: 'Whole country',
              value: '',
            },
          ]
        : undefined,
  });

  // Check if the iso exists in `countryListData` and set Brazil as a default otherwise
  useEffect(() => {
    if (!isCountryListLoading && !isCountryListError) {
      if (!country) {
        dispatch(chartActions.updateIso(chartInitialState.iso));
      }
    }
  }, [country, isCountryListLoading, isCountryListError, iso, dispatch]);

  // Check if the region exists in `regionListData` and set the whole country as a default otherwise
  useEffect(() => {
    if (!isRegionListLoading && !isRegionListError) {
      const regionMatch = regionListData?.find((d) => d.id === region);
      if (!regionMatch) {
        if (country?.partial_data) {
          dispatch(chartActions.updateRegion(regionListData?.[0].id ?? null));
        } else {
          dispatch(chartActions.updateRegion(null));
        }
      }
    }
  }, [regionListData, country, isRegionListLoading, isRegionListError, region, dispatch]);

  return (
    <form className="c-tool-data-layer-settings">
      <h2>Location</h2>
      <div className="form-group">
        <label htmlFor="data-layer-country">
          Country {isCountryListLoading && <LoadingSpinner inline mini />}
        </label>
        <Select
          id="data-layer-country"
          className={isCountryListError ? 'is-invalid' : undefined}
          options={countryList}
          value={iso}
          onChange={({ value }) => dispatch(chartActions.updateIso(value))}
          disabled={isCountryListLoading || isCountryListError}
          required
          aria-describedby="data-layer-country-error"
        />
        <div id="data-layer-country-error" className="invalid-feedback">
          Unable to load the list of countries. Please reload the page.
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="data-layer-region">
          Region {(isCountryListLoading || isRegionListLoading) && <LoadingSpinner inline mini />}
        </label>
        <Select
          id="data-layer-region"
          className={isRegionListError ? 'is-invalid' : undefined}
          options={regionList}
          value={region ?? ''}
          onChange={({ value }) => dispatch(chartActions.updateRegion(value))}
          disabled={
            isCountryListLoading || isCountryListError || isRegionListLoading || isRegionListError
          }
          required
          aria-describedby="data-layer-region-error"
        />
        <div id="data-layer-region-error" className="invalid-feedback">
          Unable to load the list of regions. Please reload the page.
        </div>
      </div>
      <h2>Time frame</h2>
      <div className="form-group">
        <label htmlFor="data-layer-date">Date</label>
        <input
          id="data-layer-date"
          type="date"
          className="form-control"
          value={date}
          onChange={({ target }) => dispatch(chartActions.updateDate(target.value))}
          max={new Date().toISOString().split('T')[0]}
          required
          aria-describedby="data-layer-date-note"
        />
        <div id="data-layer-date-note" className="form-text note">
          The time frame automatically counts one year backwards from the date you select.
        </div>
      </div>
    </form>
  );
};

export default DataLayerSettings;
