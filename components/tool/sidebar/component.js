import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Accordion, AccordionItem, AccordionTitle, AccordionPanel } from 'components/accordion';
import Tooltip, { sticky } from 'components/tooltip';
// import ExportTooltip from 'components/export-tooltip';
import DataLayerSettings from '../data-layer-settings';
import ChartComponentsSettings from '../chart-components-settings';
import DownloadSuccessModal from '../download-success-modal';

const Sidebar = ({ exporting, onClickPresets }) => {
  const [expandedAccordion, setExpandedAccordion] = useState('data-layer');
  const [previousExporting, setPreviousExporting] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  useEffect(() => {
    if (previousExporting !== exporting) {
      if (!exporting) {
        setDownloadModalOpen(true);
      }

      setPreviousExporting(exporting);
    }
  }, [exporting, previousExporting, setDownloadModalOpen, setPreviousExporting]);

  return (
    <aside className="c-tool-sidebar">
      <DownloadSuccessModal open={downloadModalOpen} onClose={() => setDownloadModalOpen(false)} />
      <Accordion
        multi={false}
        expanded={[expandedAccordion]}
        onChange={(uuids) => setExpandedAccordion(uuids[0] ?? null)}
      >
        <AccordionItem
          id="data-layer"
          className={expandedAccordion === 'data-layer' ? '-expanded' : null}
        >
          <AccordionTitle aria-level={1}>
            <span className="h1">Data layer</span>
          </AccordionTitle>
          <AccordionPanel>
            <DataLayerSettings />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem
          id="contextual-layers"
          className={expandedAccordion === 'contextual-layers' ? '-expanded' : null}
        >
          <AccordionTitle aria-level={1}>
            <span className="h1">Chart components</span>
          </AccordionTitle>
          <AccordionPanel>
            <ChartComponentsSettings />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <div className="mt-4">
        <Tooltip sticky="popper" plugins={[sticky]} content={<div>Export tooltip content</div>}>
          {/* <Tooltip sticky="popper" plugins={[sticky]} content={<ExportTooltip />}> */}
          <button type="button" className="btn btn-primary mr-2">
            Export
          </button>
        </Tooltip>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  exporting: PropTypes.bool.isRequired,
  onClickPresets: PropTypes.func.isRequired,
};

export default Sidebar;
