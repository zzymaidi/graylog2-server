import React from 'react';

import StringUtils from 'util/StringUtils';

const queryIcons = {
  aggregation: 'compress',
  alert: 'bell-o',
  graph: 'line-chart',
  query: 'binoculars',
};

const QueryTreeNode = ({ node, title }) => (
  <span style={{ color: node.disabled ? '#bbbbbb' : 'inherit' }}>
    <i className={`fa fa-${queryIcons[node.type]}`} /> {StringUtils.capitalizeFirstLetter(node.type)}: {title}
  </span>
);

export default QueryTreeNode;
