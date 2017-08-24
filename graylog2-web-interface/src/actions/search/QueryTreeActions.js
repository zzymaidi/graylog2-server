import Reflux from 'reflux';

const QueryTreeActions = Reflux.createActions({
  update: { asyncResult: true },
  preset: { asyncResult: true },
});

export default QueryTreeActions;
