import Reflux from 'reflux';

const QueryActions = Reflux.createActions({
  create: { asyncResult: true },
  delete: { asyncResult: true },
});

export default QueryActions;
