import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import debounce from 'lodash/debounce';

import Icon from 'components/icon';
import { Select, Checkbox } from 'components/forms';
import { waitUntil, generateCanvasFrame, downloadImage, downloadAnimatedImage } from './helper';

import './style.scss';

export const IMAGE_RATIO = 2 / 3;

const ExportTooltip = ({
  width,
  height,
  mode,
  modeParams,
  temporalDiffLayers,
  animatedLayerStartDate,
  animatedLayerEndDate,
  exporting,
  idle,
  updateSettings,
  updateExporting,
  updateMode,
  updateDifference,
  updateModeParams,
  updateLayer,
  updateBasemapParams,
  updateProgress,
}) => {
  const [form, setForm] = useState({
    width: {
      value: width,
      isValid: true,
    },
    height: {
      value: height,
      isValid: true,
    },
  });

  const [layerUsedInTempDifference, setLayerUsedInTempDifference] = useState('');

  const [animationDuration, setAnimationDuration] = useState(5);
  const [aggregateData, setAggregateData] = useState(false);

  const latestIdle = useRef(idle);
  const previousExporting = useRef(exporting);

  const debouncedUpdateSettings = useCallback(debounce(updateSettings, 500), [updateSettings]);

  const onChangeWidthOrHeight = useCallback(
    e => {
      const name = /** @type {'width' | 'height'} */ (e.target.name);
      const isValid = e.target.checkValidity();
      const value = isValid ? +e.target.value : e.target.value;

      if (!isValid) {
        setForm(f => ({ ...f, [name]: { value, isValid: false } }));
      } else {
        const otherName = name === 'width' ? 'height' : 'width';
        const otherValue = Math.round(name === 'width' ? value * IMAGE_RATIO : value / IMAGE_RATIO);

        // @ts-ignore
        setForm({
          [name]: { value, isValid: true },
          [otherName]: { value: otherValue, isValid: true },
        });

        debouncedUpdateSettings({ [name]: value, [otherName]: otherValue });
      }
    },
    [setForm, debouncedUpdateSettings]
  );

  const onSubmit = useCallback(
    e => {
      e.preventDefault();
      updateExporting(true);
      updateProgress(0);
    },
    [updateExporting, updateProgress]
  );

  const initDownload = useCallback(async () => {
    if (mode !== 'animated') {
      await downloadImage();
    }

    updateExporting(false);
  }, [
    mode,
    modeParams,
    animationDuration,
    aggregateData,
    updateExporting,
    updateLayer,
    updateBasemapParams,
    updateProgress,
  ]);

  // If the user removes one of the layers that was used for temporal diffing, then we also remove
  // it from the options
  useEffect(() => {
    const layersToRemove = [];
    modeParams.layers.forEach(layer => {
      if (Object.keys(temporalDiffLayers).indexOf(layer) === -1) {
        layersToRemove.push(layer);
      }
    });

    // We only want to call updateModeParams if there are actually layers that have been removed
    if (layersToRemove.length > 0) {
      const newLayers = modeParams.layers.filter(layer => layersToRemove.indexOf(layer) === -1);
      let newDates = [...modeParams.dates];

      layersToRemove.forEach((layer, index) => {
        newDates.splice(index, 1);
      });

      if (newDates.length === 0) {
        // By default dates contain at least one array item that is an array the length of the
        // number of maps
        newDates = [new Array(modeParams.dates[0].length).fill('')];
      }

      updateModeParams({ ...modeParams, layers: newLayers, dates: newDates });

      if (layersToRemove.indexOf(layerUsedInTempDifference) !== -1) {
        setLayerUsedInTempDifference(newLayers?.[0] ?? '');
      }
    }
  }, [
    modeParams,
    temporalDiffLayers,
    layerUsedInTempDifference,
    updateModeParams,
    setLayerUsedInTempDifference,
  ]);

  // If the user removes the layer that was used for the animation, then we reset the animation
  // settings
  useEffect(() => {
    if (mode === 'animated' && modeParams.layers.length > 0) {
      const existsLayer = Object.keys(temporalDiffLayers).indexOf(modeParams.layers[0]) !== -1;
      if (!existsLayer) {
        updateModeParams({
          layers: [],
          dates: [['']],
        });
      }
    }
  }, [mode, modeParams, temporalDiffLayers, updateModeParams]);

  // When the mode is changed, reset the animation's duration and aggregation setting
  useEffect(() => {
    setAnimationDuration(5);
    setAggregateData(false);
  }, [mode, setAnimationDuration, setAggregateData]);

  // We initiate the download when the map is idle and the exporting flag is set
  useEffect(() => {
    // When the user clicks the download button, at that precise moment, the map is idle but it
    // hasn't resized yet. To avoid executing initDownload at that point, we delay its execution.
    // Unfortunately, idle will still have the value of when the effect was executed so we may still
    // export the image before the map was resized.
    // latestIdle is a ref to idle. By using it instead of idle, we ensure that the function inside
    // setTimeout will see the latest value of idle. This prevents the app from exporting before the
    // map has resized and its tiles have loaded.
    // Learn more about the ref technique here:
    // https://reactjs.org/docs/hooks-faq.html#why-am-i-seeing-stale-props-or-state-inside-my-function
    latestIdle.current = idle;

    const triggerDownload = async () => {
      await waitUntil(() => latestIdle.current.every(i => i), 100);
      initDownload();
    };

    if (!previousExporting.current && exporting) {
      triggerDownload();
    }

    previousExporting.current = exporting;
  }, [exporting, idle, initDownload]);

  return (
    <div className="c-export-tooltip">
      <form onSubmit={onSubmit}>
        <fieldset>
          <legend>Map size</legend>
          <div className="form-row">
            <div className="form-group col-6">
              <label htmlFor="export-width">Width</label>
              <input
                type="number"
                id="export-width"
                name="width"
                className={classnames({ 'form-control': true, 'is-invalid': !form.width.isValid })}
                pattern="\d+"
                value={form.width.value}
                min="150"
                onChange={onChangeWidthOrHeight}
              />
              <div className="invalid-feedback">
                {form.width.value.length === 0 && 'Must be a number.'}
                {form.width.value.length > 0 && 'Minimum value: 150.'}
              </div>
            </div>
            <div className="form-group col-6">
              <label htmlFor="export-height">Height</label>
              <input
                type="number"
                id="export-height"
                name="height"
                className={classnames({ 'form-control': true, 'is-invalid': !form.height.isValid })}
                pattern="\d+"
                min="100"
                value={form.height.value}
                onChange={onChangeWidthOrHeight}
              />
              <div className="invalid-feedback">
                {form.height.value.length === 0 && 'Must be a number.'}
                {form.height.value.length > 0 && 'Minimum value: 100.'}
              </div>
            </div>
          </div>
        </fieldset>
        <fieldset className="mt-3">
          <legend>Grid</legend>
          <div className="form-row">
            <div className="form-group col grid-buttons">
              <input
                type="radio"
                id="export-tooltip-grid-1"
                name="export-tooltip-grid"
                value="1"
                checked={mode === '1'}
                onChange={() => updateMode('1')}
              />
              <label htmlFor="export-tooltip-grid-1">
                <Icon name="one-map" />
              </label>
              <input
                type="radio"
                id="export-tooltip-grid-2-horizontal"
                name="export-tooltip-grid"
                value="2-horizontal"
                checked={mode === '2-horizontal'}
                onChange={() => updateMode('2-horizontal')}
              />
              <label htmlFor="export-tooltip-grid-2-horizontal">
                <Icon name="two-maps-horizontal" />
              </label>
              <input
                type="radio"
                id="export-tooltip-grid-2-vertical"
                name="export-tooltip-grid"
                value="2-vertical"
                checked={mode === '2-vertical'}
                onChange={() => updateMode('2-vertical')}
              />
              <label htmlFor="export-tooltip-grid-2-vertical">
                <Icon name="two-maps-vertical" />
              </label>
              <input
                type="radio"
                id="export-tooltip-grid-4"
                name="export-tooltip-grid"
                value="4"
                checked={mode === '4'}
                onChange={() => updateMode('4')}
              />
              <label htmlFor="export-tooltip-grid-4">
                <Icon name="four-maps" />
              </label>
              <input
                type="radio"
                id="export-tooltip-grid-animated"
                name="export-tooltip-grid"
                value="animated"
                checked={mode === 'animated'}
                onChange={() => updateMode('animated')}
              />
              <label htmlFor="export-tooltip-grid-animated">
                <Icon name="animated-map" />
              </label>
            </div>
          </div>
          {(mode === '2-vertical' || mode === '2-horizontal' || mode === '4') && (
            <>
              <div className="form-row">
                <div className="form-group col">
                  <label htmlFor="export-difference">Difference</label>
                  <div className="input-group">
                    <Select
                      id="export-difference"
                      value={modeParams.difference}
                      options={[
                        { label: 'Spatial', value: 'spatial' },
                        { label: 'Temporal', value: 'temporal' },
                      ]}
                      onChange={({ value }) => {
                        updateDifference(value);
                        setLayerUsedInTempDifference('');
                      }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </fieldset>
        <button
          type="submit"
          className="btn btn-primary btn-block mt-3"
          disabled={!form.width.isValid || !form.height.isValid}
        >
          Download
        </button>
      </form>
    </div>
  );
};

ExportTooltip.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  mode: PropTypes.string.isRequired,
  modeParams: PropTypes.object.isRequired,
  temporalDiffLayers: PropTypes.object.isRequired,
  animatedLayerStartDate: PropTypes.array.isRequired,
  animatedLayerEndDate: PropTypes.array.isRequired,
  exporting: PropTypes.bool.isRequired,
  idle: PropTypes.arrayOf(PropTypes.bool),
  updateSettings: PropTypes.func.isRequired,
  updateExporting: PropTypes.func.isRequired,
  updateMode: PropTypes.func.isRequired,
  updateDifference: PropTypes.func.isRequired,
  updateModeParams: PropTypes.func.isRequired,
  updateLayer: PropTypes.func.isRequired,
  updateBasemapParams: PropTypes.func.isRequired,
  updateProgress: PropTypes.func.isRequired,
};

export default ExportTooltip;
