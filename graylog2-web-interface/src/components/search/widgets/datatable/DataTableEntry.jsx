import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';

const DataTableEntry = React.createClass({
  propTypes: {
    item: PropTypes.object.isRequired,
    fields: PropTypes.instanceOf(Immutable.OrderedSet).isRequired,
  },

  render() {
    const classes = 'message-group';
    const item = this.props.item;
    return (
      <tbody className={classes}>
        <tr className="fields-row">
          { this.props.fields.toSeq().map(fieldName => <td
            key={fieldName}>{item[fieldName]}</td>) }
        </tr>
      </tbody>
    );
  },
});

export default DataTableEntry;
