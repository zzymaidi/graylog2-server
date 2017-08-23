import PropTypes from 'prop-types';
import React from 'react';

import { Dropdown, MenuItem } from 'react-bootstrap';

import { MessageFieldDescription } from 'components/search';

import Styles from './MessageField.css';
import VisualizationWizard from './VisualizationWizard';

const MessageField = React.createClass({
  propTypes: {
    customFieldActions: PropTypes.node,
    disableFieldActions: PropTypes.bool,
    fieldName: PropTypes.string.isRequired,
    message: PropTypes.object.isRequired,
    possiblyHighlight: PropTypes.func.isRequired,
    value: PropTypes.any.isRequired,
  },
  getInitialState() {
    return {
      showVisualizeWizard: false,
    };
  },

  SPECIAL_FIELDS: ['full_message', 'level'],
  _isAdded(key) {
    const decorationStats = this.props.message.decoration_stats;
    return decorationStats && decorationStats.added_fields && decorationStats.added_fields[key] !== undefined;
  },
  _isChanged(key) {
    const decorationStats = this.props.message.decoration_stats;
    return decorationStats && decorationStats.changed_fields && decorationStats.changed_fields[key] !== undefined;
  },
  _isDecorated(key) {
    return this._isAdded(key) || this._isChanged(key);
  },
  render() {
    let innerValue = this.props.value;
    const key = this.props.fieldName;
    if (this.SPECIAL_FIELDS.indexOf(key) !== -1) {
      innerValue = this.props.message.fields[key];
    }

    return (
      <span>
        <dt key={`${key}Title`} className={Styles.message_field_key}>
          <Dropdown id="dropdown-custom-menu">
            <span bsRole="toggle">{key} <i className="fa fa-caret-down"/></span>
            <Dropdown.Menu>
              <MenuItem eventKey="1" onClick={() => { this.setState({ showVisualizeWizard: true }); }}>Visualize</MenuItem>
              <MenuItem eventKey="2">Aggregate</MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        </dt>
        <MessageFieldDescription key={`${key}Description`}
                                 message={this.props.message}
                                 fieldName={key}
                                 fieldValue={innerValue}
                                 possiblyHighlight={this.props.possiblyHighlight}
                                 disableFieldActions
                                 customFieldActions={this.props.customFieldActions}
                                 isDecorated={this._isDecorated(key)} />
        {this.state.showVisualizeWizard && <VisualizationWizard fieldName={key} onHide={() => { this.setState({ showVisualizeWizard: false}); }} />}
      </span>
    );
  },
});

export default MessageField;
