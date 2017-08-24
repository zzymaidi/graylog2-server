import React from 'react';

import QuickValuesVisualization from 'components/visualizations/QuickValuesVisualization';

const BottomNVisualization = React.createClass({
  render() {
    const limit = this.props.config.limit || 3;
    return (
      <QuickValuesVisualization sortOrder="asc" dataTableTitle="Bottom Values" limit={limit} {...this.props} />
    );
  },
});

export default BottomNVisualization;
