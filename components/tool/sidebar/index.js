import { connect } from 'react-redux';

import { exportSelectors } from 'modules/tool';
import Component from './component';

export default connect(
  (state) => ({
    exporting: exportSelectors.selectExporting(state),
  }),
  {}
)(Component);
