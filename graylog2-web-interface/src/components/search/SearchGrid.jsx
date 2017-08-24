import React from 'react';

import { ReactGridContainer, Spinner } from 'components/common';
import { QuerySidebar, SearchWidget } from 'components/search';
import { walk } from 'react-sortable-tree';
import style from 'pages/ShowDashboardPage.css';
import { DataTable, MessageList } from 'components/search/widgets';

import CombinedProvider from 'injection/CombinedProvider';
const { SearchStore } = CombinedProvider.get('Search');
const { UniversalSearchStore } = CombinedProvider.get('UniversalSearch');

const SearchGrid = React.createClass({
  getInitialState() {
    return {
      positions: { foo: { col: 0, row: 0, height: 3, width: 1.5 } },
      searchResults: {},
      aggregationResults: {},
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
                state.searchResults[query.id] = response;
                state.error = undefined;
                Object.keys(aggregations).forEach(aggregation => {
                  state.aggregationResults[aggregation] = response.aggregations[aggregation];
                });
                return state;
              });
            }
          });
    });
  },
  _onPositionsChange(positions) {
    const newPositions = {};
    positions.forEach(position => {
      newPositions[position.id] = position;
    });

    this.setState({ positions: newPositions });
  },
  _onWidgetSizeChange(widgetId, newSize) {
    /*const newPositions = this.state.positions;
    this.state.positions[widgetId].height = newSize.height;
    this.state.positions[widgetId].width = newSize.width;

    this.setState({ positions: newPositions });*/
  },
  render() {
    const widgets = this.props.queryTree.filter(query => query.disabled === undefined || query.disabled === false).map(query => (
      <div key={query.id} className={style.widgetContainer}>
        <SearchWidget title={query.title({ node: query })} widgetId={query.id} onSizeChange={this._onWidgetSizeChange}>
          {this.state.searchResults[query.id] ?
            <MessageList data={this.state.searchResults[query.id].messages} config={{ pageSize: 20, fields: ['source', 'message'] }} /> :
            <Spinner />}
        </SearchWidget>
      </div>
    ));
    const aggregationWidgets = [];
    const keyFromTreeIndex = ({ treeIndex }) => treeIndex;
    const callback = ({ node }) => { if (node.type === 'aggregation' && !node.disabled) { aggregationWidgets.push(node); } };
    walk({ treeData: this.props.queryTree, ignoreCollapsed: false, getNodeKey: keyFromTreeIndex, callback: callback });
    aggregationWidgets.forEach((aggregation) => {
      const buckets = this.state.aggregationResults[aggregation.id] ? this.state.aggregationResults[aggregation.id].buckets : [];
      const data = buckets.map((bucket) => { return { key: bucket.key, value: bucket.count }; });
      widgets.push(<div key={aggregation.id} className={style.widgetContainer}>
        <SearchWidget title={aggregation.title({ node: aggregation })} widgetId={aggregation.id} onSizeChange={this._onWidgetSizeChange}>
          <DataTable data={data} config={{ fields: ['key', 'value'] }} />
        </SearchWidget>
      </div>);
    });
    return (
      <div className="dashboard">
        <ReactGridContainer locked positions={this.state.positions} onPositionsChange={this._onPositionsChange}>
          <div key="foo" className={style.widgetContainer}>
            <SearchWidget title="Foo" widgetId="foo" onSizeChange={this._onWidgetSizeChange}>
              <QuerySidebar />
            </SearchWidget>
          </div>
          {widgets}
        </ReactGridContainer>
      </div>
    );
  },
});

export default SearchGrid;
