import React from 'react';
import Reflux from 'reflux';
import { Row } from 'react-bootstrap';

import { DocumentTitle, ReactGridContainer, Spinner } from 'components/common';
import { LegacyHistogram, NoSearchResults, QuerySidebar, ResultTable, SearchBar, SearchGrid, SearchSidebar, SearchWidget } from 'components/search';

import StoreProvider from 'injection/StoreProvider';
const ConfigurationsStore = StoreProvider.getStore('Configurations');
const CurrentUserStore = StoreProvider.getStore('CurrentUser');
const SearchStore = StoreProvider.getStore('Search');

import ActionsProvider from 'injection/ActionsProvider';
const ConfigurationActions = ActionsProvider.getActions('Configuration');

import CombinedProvider from 'injection/CombinedProvider';

const { QueryTreeStore, QueryTreeActions } = CombinedProvider.get('QueryTree');

const NewSearchPage = React.createClass({
  mixins: [
    Reflux.connect(CurrentUserStore),
    Reflux.connect(ConfigurationsStore),
    Reflux.connect(QueryTreeStore),
  ],
  getInitialState() {
    return {};
  },
  componentDidMount() {
    ConfigurationActions.listSearchesClusterConfig();
  },
  _addSearch(config) {},
  render() {
    if (!this.state.currentUser || !this.state.searchesClusterConfig) {
      return <Spinner />;
    }

    SearchStore.load();

    return (
      <DocumentTitle title="Search">
        <span>
          <SearchBar onExecuteSearch={this._addSearch}
                     config={this.state.searchesClusterConfig}
                     savedSearches={[]} />
          <Row>
            <SearchGrid queryTree={this.state.tree} />
          </Row>
        </span>
      </DocumentTitle>
    );
  },
});

export default NewSearchPage;
