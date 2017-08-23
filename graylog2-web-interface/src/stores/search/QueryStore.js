import Reflux from 'reflux';

import ActionsProvider from 'injection/ActionsProvider';

const QueryActions = ActionsProvider.getActions('Query');

const QueryStore = Reflux.createStore({
  listenables: [QueryActions],
  queries: ['*'],

  init() {
    this.trigger({ queries: this.queries });
  },

  getInitialState() {
    return {
      queries: this.queries,
    };
  },

  add(query) {
    this.queries.push(query);
    this.init();
  },

  remove(query) {
    this.queries = this.queries.filter(elem => elem !== query);
    this.init();
  }
});

export default QueryStore;
