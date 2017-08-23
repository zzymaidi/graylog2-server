import React from 'react';
import Reflux from 'reflux';

import { QueryTreeNode } from 'components/search';
import ActionsProvider from 'injection/ActionsProvider';

const QueryTreeActions = ActionsProvider.getActions('QueryTree');

const QueryTreeStore = Reflux.createStore({
  listenables: [QueryTreeActions],
  tree: [{
    title: ({ node }) => <QueryTreeNode node={node} title="*" />,
    type: 'query',
    noDragging: true,
    expanded: true,
    children: [{
      title: ({ node }) => <QueryTreeNode node={node} title="Top-N" />,
      type: 'aggregation',
      subtitle: 'Limit: 5',
      expanded: true,
      children: [{
        title: ({ node }) => <QueryTreeNode node={node} title="Pie Chart" />,
        type: 'graph',
        expanded: true,
      }, {
        title: ({ node } ) => <QueryTreeNode node={node} title="Threshold exceeded" />,
        type: 'alert',
        subtitle: 'Threshold: 42',
        expanded: true,
      }],
    }],
  }],
  init() {
    this.trigger({ tree: this.tree });
  },

  getInitialState() {
    return {
      tree: this.tree,
    };
  },

  update(tree) {
    this.tree = tree;
    this.init();
  },
});

export default QueryTreeStore;
