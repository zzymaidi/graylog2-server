import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Immutable from 'immutable';

import DataTableEntry from './DataTableEntry';

const DataTable = React.createClass({
  propTypes: {
    data: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.shape({
        rows: PropTypes.arrayOf(PropTypes.object),
      }),
    ]).isRequired,
    config: PropTypes.shape({
      fields: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
  },
  _extractAllFieldnames(data) {
    const fieldNames = new Set();
    data.forEach((item) => {
      Object.keys(item).forEach(fieldName => fieldNames.add(fieldName));
    });

    return new Immutable.OrderedSet(fieldNames);
  },
  render() {
    const { data, config } = this.props;
    const rows = data && data.rows ? _.values(data.rows) : data; // TODO: Workaround to support both, returned and declared result.
    const fields = config.fields ? new Immutable.OrderedSet(config.fields) : this._extractAllFieldnames(rows);
    return (
      <div className="messages-container">
        <table className="table table-condensed messages">
          <thead>
            <tr>
              {fields.toSeq().map((field) => {
                return (
                  <th key={field} style={{ left: '0px' }}>
                    {field}
                  </th>
                );
              })}
            </tr>
          </thead>
          {rows.map((item, idx) => <DataTableEntry key={`datatableentry-${idx}`} fields={fields} item={item} />)}
        </table>
      </div>
    );
  },
});

export default DataTable;
