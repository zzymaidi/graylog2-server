import React from 'react';
import PropTypes from 'prop-types';

import StringUtils from 'util/StringUtils';

const queryIcons = {
  aggregation: 'compress',
  alert: 'bell-o',
  graph: 'line-chart',
  query: 'binoculars',
};

const titleFromNode = (node) => {
  switch (node.type) {
    case 'query': return `"${node.parameters.query}"`;
    case 'aggregation': return StringUtils.capitalizeFirstLetter(node.parameters.type);
    case 'graph': return `${StringUtils.capitalizeFirstLetter(node.parameters.type)} Chart`;
    case 'alert': return 'Threshold exceeded';
  }
  return '';
};
const QueryTreeNode = ({ node }) => (
  <span style={{ color: node.disabled ? '#bbbbbb' : 'inherit' }}>
    <i className={`fa fa-${queryIcons[node.type]}`} /> {StringUtils.capitalizeFirstLetter(node.type)}: {titleFromNode(node)}
  </span>
);

QueryTreeNode.propTypes = {
  node: PropTypes.shape({
    type: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    parameters: PropTypes.object.isRequired,
  }).isRequired,
};

export default QueryTreeNode;
