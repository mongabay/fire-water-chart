import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import classnames from 'classnames';
import debounce from 'lodash/debounce';

import { exportActions, exportSelectors } from 'modules/tool';
import { ExportSliceInitialState } from 'modules/tool/export';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { ExportTooltipProps } from './types';
import { downloadImage } from './helper';

export const ExportTooltip: React.FC<ExportTooltipProps> = ({}: ExportTooltipProps) => {
  const width = useAppSelector(exportSelectors.selectWidth);
  const height = useAppSelector(exportSelectors.selectHeight);
  const exporting = useAppSelector(exportSelectors.selectExporting);

  const dispatch = useAppDispatch();

  const [form, setForm] = useState<{
    width: {
      value: number | string;
      isValid: boolean;
    };
    height: {
      value: number | string;
      isValid: boolean;
    };
  }>({
    width: {
      value: width,
      isValid: true,
    },
    height: {
      value: height,
      isValid: true,
    },
  });

  const previousExporting = useRef(exporting);

  const debouncedUpdateSettings = useMemo(
    () =>
      debounce<(settings: Partial<ExportSliceInitialState>) => void>(
        (settings) => dispatch(exportActions.updateSettings(settings)),
        500
      ),
    [dispatch]
  );

  const onChangeWidthOrHeight = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const name = e.target.name as keyof typeof form;
      const isValid = e.target.checkValidity();
      const value = isValid ? +e.target.value : e.target.value;

      setForm((f) => ({ ...f, [name]: { value, isValid } }));

      if (isValid) {
        debouncedUpdateSettings({ [name]: value });
      }
    },
    [setForm, debouncedUpdateSettings]
  );

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      dispatch(exportActions.updateExporting(true));
    },
    [dispatch]
  );

  const initDownload = useCallback(async () => {
    await downloadImage();
    dispatch(exportActions.updateExporting(false));
  }, [dispatch]);

  // We initiate the download when the exporting flag is set
  useEffect(() => {
    if (!previousExporting.current && exporting) {
      initDownload();
    }

    previousExporting.current = exporting;
  }, [exporting, initDownload]);

  return (
    <div className="c-export-tooltip">
      <form onSubmit={onSubmit}>
        <fieldset>
          <legend>Chart size</legend>
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
                min="400"
                onChange={onChangeWidthOrHeight}
              />
              <div className="invalid-feedback">
                {(form.width.value as string).length === 0 && 'Must be a number.'}
                {(form.width.value as string).length > 0 && 'Minimum value: 400.'}
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
                min="400"
                value={form.height.value}
                onChange={onChangeWidthOrHeight}
              />
              <div className="invalid-feedback">
                {(form.height.value as string).length === 0 && 'Must be a number.'}
                {(form.height.value as string).length > 0 && 'Minimum value: 400.'}
              </div>
            </div>
          </div>
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

export default ExportTooltip;
