import { connect } from 'react-redux';

import { exportSelectors } from 'modules/tool';
import Component from './component';

export default connect(
  (state) => ({
    width: exportSelectors.selectWidth(state),
    height: exportSelectors.selectHeight(state),
    exporting: exportSelectors.selectExporting(state),
    mode: exportSelectors.selectMode(state),
    modeParams: exportSelectors.selectModeParams(state),
  }),
  {}
)(Component);
