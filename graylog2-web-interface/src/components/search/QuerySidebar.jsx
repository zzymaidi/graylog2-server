import React from 'react';
import Reflux from 'reflux';
import SortableTree, { changeNodeAtPath } from 'react-sortable-tree';

import { Spinner } from 'components/common';

import CombinedProvider from 'injection/CombinedProvider';

const { QueryTreeStore, QueryTreeActions } = CombinedProvider.get('QueryTree');

const QuerySidebar = React.createClass({
  mixins: [Reflux.connect(QueryTreeStore)],

  getInitialState() {
    return {};
  },
  _canDrop(args) {
    const { node, nextParent } = args;

    switch (node.type) {
      case 'query': return false;
      case 'aggregation': return nextParent !== null && nextParent.type !== 'graph';
      case 'graph': return nextParent !== null;
      default: return true;
    }
  },
  render() {
    if (!this.state.tree) {
      return <Spinner />;
    }
    const getNodeKey = ({ treeIndex }) => treeIndex;
    const alertNodeInfo = ({ node, path, treeIndex }) => {
      const newTree = changeNodeAtPath({ treeData: this.state.tree, path, getNodeKey, newNode: { ...node, disabled: !node.disabled }});
      this.setState({ tree: newTree });
    };
    return (
      <div className="content-col" style={{ top: undefined, position: undefined }}>
        <h2>Queries:</h2>
        <div style={{ height: 400 }}>
          <SortableTree treeData={this.state.tree}
                        canDrag={({ node }) => !node.noDragging}
                        canDrop={this._canDrop}
                        generateNodeProps={rowInfo => ({
                          buttons: [
                            <button style={{ verticalAlign: 'middle' }}
                                    onClick={() => alertNodeInfo(rowInfo)}>
                              {rowInfo.node.disabled ? <i className="fa fa-search-plus" /> : <i className="fa fa-search-minus" />}
                            </button>,
                          ],
                        })}
                        onChange={QueryTreeActions.update} />
        </div>
      </div>
    );
  },
});

export default QuerySidebar;
