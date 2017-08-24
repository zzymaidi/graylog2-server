import React from 'react';
import Reflux from 'reflux';

import { QueryTreeNode } from 'components/search';
import ActionsProvider from 'injection/ActionsProvider';

const QueryTreeActions = ActionsProvider.getActions('QueryTree');

const renderTitle = ({ node }) => <QueryTreeNode node={node} />;
const renderSubtitle = ({ node }) => <span>{JSON.stringify(node.parameters)}</span>;

const secondQuery = 'source:192.168.1.3';
const secondAggregationField = 'nf_src_address';
const presets = {
  rootQuery: [{
    title: renderTitle,
    subtitle: renderSubtitle,
    type: 'query',
    id: 'rootquery',
    parameters: { query: '*', time_range: { type: 'relative', relative: 300 } },
    noDragging: true,
    expanded: true,
    children: [],
  }],
  one: [{
    title: renderTitle,
    subtitle: renderSubtitle,
    type: 'query',
    id: 'rootquery',
    parameters: { query: '*', time_range: { type: 'relative', relative: 300 } },
    noDragging: true,
    expanded: true,
    children: [{
      title: renderTitle,
      subtitle: renderSubtitle,
      type: 'aggregation',
      id: 'aggregation-1',
      parameters: { type: 'top-n', limit: 5, field: 'source' },
      expanded: true,
      children: [],
    }],
  }],
  two: [{
    title: renderTitle,
    subtitle: renderSubtitle,
    type: 'query',
    id: 'rootquery',
    parameters: { query: '*', time_range: { type: 'relative', relative: 300 } },
    noDragging: true,
    expanded: true,
    children: [{
      title: renderTitle,
      subtitle: renderSubtitle,
      type: 'aggregation',
      id: 'aggregation-1',
      parameters: { type: 'top-n', limit: 5, field: 'source' },
      expanded: true,
      children: [{
        title: renderTitle,
        subtitle: renderSubtitle,
        id: 'graph-1',
        parameters: { type: 'pie' },
        type: 'graph',
        expanded: true,
      }],
    }],
  }],
  three: [{
    title: renderTitle,
    subtitle: renderSubtitle,
    type: 'query',
    id: 'rootquery',
    parameters: { query: '*', time_range: { type: 'relative', relative: 300 } },
    noDragging: true,
    expanded: true,
    children: [],
  }, {
    title: renderTitle,
    subtitle: renderSubtitle,
    type: 'query',
    id: 'rootquery-2',
    parameters: { query: secondQuery, time_range: { type: 'relative', relative: 300 } },
    noDragging: true,
    expanded: true,
    children: [],
  }],
  fullFrenzy: [{
    title: renderTitle,
    subtitle: renderSubtitle,
    type: 'query',
    id: 'rootquery',
    parameters: { query: '*', time_range: { type: 'relative', relative: 300 } },
    noDragging: true,
    expanded: true,
    children: [{
      title: renderTitle,
      subtitle: renderSubtitle,
      type: 'aggregation',
      id: 'aggregation-1',
      parameters: { type: 'top-n', limit: 5, field: 'source' },
      expanded: true,
      children: [{
        title: renderTitle,
        subtitle: renderSubtitle,
        id: 'graph-1',
        parameters: { type: 'pie' },
        type: 'graph',
        expanded: true,
      }, {
        title: renderTitle,
        subtitle: renderSubtitle,
        id: 'alert-1',
        type: 'alert',
        parameters: { threshold: 42 },
        expanded: true,
      }],
    }],
  }, {
    title: renderTitle,
    subtitle: renderSubtitle,
    type: 'query',
    id: 'rootquery-2',
    parameters: { query: secondQuery, time_range: { type: 'relative', relative: 300 } },
    noDragging: true,
    expanded: true,
    children: [
      {
        title: renderTitle,
        subtitle: renderSubtitle,
        type: 'aggregation',
        id: 'aggregation-2',
        parameters: { type: 'top-n', limit: 5, field: secondAggregationField },
        expanded: true,
        children: [],
      },
    ],
  }],
};
const QueryTreeStore = Reflux.createStore({
  listenables: [QueryTreeActions],
  tree: presets.rootQuery,
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

  preset(name) {
    this.tree = presets[name];
    this.init();
  }
});

export default QueryTreeStore;
