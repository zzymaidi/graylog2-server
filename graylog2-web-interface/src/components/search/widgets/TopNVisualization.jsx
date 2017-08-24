import React from 'react';

import QuickValuesVisualization from 'components/visualizations/QuickValuesVisualization';

const TopNVisualization = React.createClass({
  render() {
    const limit = this.props.config.limit || 5;
    return (
      <QuickValuesVisualization sortOrder="desc" limit={limit} {...this.props} />
    );
  },
});

export default TopNVisualization;
    