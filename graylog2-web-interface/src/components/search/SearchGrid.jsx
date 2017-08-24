import React from 'react';

import { ReactGridContainer, Spinner } from 'components/common';
import { QuerySidebar, SearchWidget } from 'components/search';
import { getNodeAtPath, walk } from 'react-sortable-tree';
import style from 'pages/ShowDashboardPage.css';
import { DataTable, MessageList, TopNVisualization } from 'components/search/widgets';

import CombinedProvider from 'injection/CombinedProvider';
const { SearchStore } = CombinedProvider.get('Search');
const { UniversalSearchStore } = CombinedProvider.get('UniversalSearch');

const SearchGrid = React.createClass({
  getInitialState() {
    return {
      positions: { foo: { col: 0, row: 0, height: 3, width: 1.5 } },
      results: {},
    };
  },
  componentDidMount() {
    const { queryTree } = this.props;
    this.retrieveQueryResults(queryTree);
  },
  componentWillReceiveProps(nextProps) {
    const { queryTree } = nextProps;
    this.retrieveQueryResults(queryTree);
  },
  retrieveQueryResults(queries) {
    queries.forEach((query) => {
      const aggregations = {};
      query.children
        .filter(child => child.type === 'aggregation')
        .forEach((aggregation) => {
          aggregations[aggregation.id] = aggregation.parameters;
        });
      this.promise = UniversalSearchStore.search(SearchStore.originalRangeType, query.parameters.query,
          SearchStore.originalRangeParams.toJS(), null, null, SearchStore.page, SearchStore.sortField,
          SearchStore.sortOrder, null, aggregations)
        .then(
          (response) => {
            if (this.isMounted()) {
              this.setState((state) => {
                state.results[query.id] = response;
                state.error = undefined;
                Object.keys(aggregations).forEach(aggregation => {
                  state.results[aggregation] = response.aggregations[aggregation];
                });
                return state;
              });
            }
          });
    });
  },
  _onPositionsChange(positions) {
    const newPositions = {};
    positions.forEach((position) => {
      newPositions[position.id] = position;
    });

    this.setState({ positions: newPositions });
  },
  _onWidgetSizeChange(widgetId, newSize) {
    /* const newPositions = this.state.positions;
    if (!newPositions[widgetId]) {
      newPositions[widgetId] = { col: 0, row: 0, height: newSize.height, width: newSize.width };
    } else {
      newPositions[widgetId].height = newSize.height;
      newPositions[widgetId].width = newSize.width;
    }

    this.setState({ positions: newPositions }); */
  },
  _getAggregationsFromTree(tree) {
    const aggregations = [];
    const keyFromTreeIndex = ({ treeIndex }) => treeIndex;
    const callback = ({ node }) => { if (node.type === 'aggregation' && !node.disabled) { aggregations.push(node); } };
    walk({ treeData: tree, ignoreCollapsed: false, getNodeKey: keyFromTreeIndex, callback: callback });

    return aggregations;
  },
  _getGraphsFromTree(tree) {
    const graphs = [];
    const keyFromTreeIndex = ({ treeIndex }) => treeIndex;
    const callback = ({ path, node, treeIndex }) => { if (node.type === 'graph' && !node.disabled) { graphs.push({ path, treeIndex, node }); } };
    walk({ treeData: tree, ignoreCollapsed: false, getNodeKey: keyFromTreeIndex, callback: callback });

    return graphs;
  },
  render() {
    const widgets = this.props.queryTree.filter(query => query.disabled === undefined || query.disabled === false).map(query => (
      <div key={query.id} className={style.widgetContainer}>
        <SearchWidget title={query.title({ node: query })} widgetId={query.id} onSizeChange={this._onWidgetSizeChange}>
          {this.state.results[query.id] ?
            <MessageList data={this.state.results[query.id].messages} config={{ pageSize: 20, fields: ['source', 'message'] }} /> :
            <Spinner />}
        </SearchWidget>
      </div>
    ));
    const positions = this.state.positions;
    this.props.queryTree.filter(query => query.disabled === undefined || query.disabled === false).forEach((query) => {
      if (positions[query.id]) {
        positions[query.id].height = 1;
        positions[query.id].width = 2;
      } else {
        positions[query.id] = { height: 1, width: 2};
      }
    });

    this._getAggregationsFromTree(this.props.queryTree).forEach((aggregation) => {
      const buckets = this.state.results[aggregation.id] ? this.state.results[aggregation.id].buckets : [];
      const data = buckets.map((bucket) => { return { key: bucket.key, value: bucket.count }; });
      widgets.push(<div key={aggregation.id} className={style.widgetContainer}>
        <SearchWidget title={aggregation.title({ node: aggregation })} widgetId={aggregation.id} onSizeChange={this._onWidgetSizeChange}>
          <DataTable data={data} config={{ fields: ['key', 'value'] }} />
        </SearchWidget>
      </div>);
    });

    this._getGraphsFromTree(this.props.queryTree).forEach(({ node, path }) => {
      path.pop();
      const parentPath = path;
      const keyFromTreeIndex = ({ treeIndex }) => treeIndex;
      const { node: parentElement } = getNodeAtPath({ treeData: this.props.queryTree, path: parentPath, getNodeKey: keyFromTreeIndex });
      if (parentElement) {
        const buckets = this.state.results[parentElement.id] ? this.state.results[parentElement.id].buckets : [];
        const data = {
          terms: {},
          total: 0,
          missing: 0,
        };
        buckets.forEach((bucket) => {
          data.terms[bucket.key] = bucket.count;
          data.total += bucket.count;
        });
        widgets.push(<div key={node.id} className={style.widgetContainer}>
          <SearchWidget title={node.title({ node: node })} widgetId={node.id} onSizeChange={this._onWidgetSizeChange}>
            <TopNVisualization data={data} config={{ show_pie_chart: true, show_data_table: false }} />
          </SearchWidget>
        </div>);
      }
      if (positions[node.id]) {
        positions[node.id].height = 2;
        positions[node.id].width = 1;
      } else {
        positions[node.id] = { height: 2, width: 1};
      }
    });
    return (
      <div className="dashboard">
        <ReactGridContainer locked={false} positions={positions} onPositionsChange={this._onPositionsChange}>
          {widgets}
        </ReactGridContainer>
      </div>
    );
  },
});

export default SearchGrid;
