import React from 'react';
import PropTypes from 'prop-types';

const GenericWidget = React.createClass({
  propTypes: {
    data: PropTypes.any.isRequired,
  },
  DEFAULT_VALUE_FONT_SIZE: '70px',
  _calculateFontSize() {
    if (typeof this.props.data === 'undefined') {
      return this.DEFAULT_VALUE_FONT_SIZE;
    }

    const numberOfDigits = this.props.data.length;

    return numberOfDigits < 7 ? this.DEFAULT_VALUE_FONT_SIZE : Math.max(100 - (numberOfDigits * 5), 15);
  },
  render() {
    return (
      <div className="number">
        <div className="text-center">
            <span className="value" style={{ fontSize: this._calculateFontSize() }}>
              {this.props.data}
            </span>
        </div>
      </div>
    );
  },
});

export default GenericWidget;