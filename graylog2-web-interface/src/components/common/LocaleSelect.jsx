import PropTypes from 'prop-types';
import React from "react";
import Reflux from "reflux";

import { Select, Spinner } from "components/common";

import StoreProvider from "injection/StoreProvider";
const SystemStore = StoreProvider.getStore('System');

/**
 * Component that renders a form input with all available locale settings. It also makes easy to filter
 * values to quickly find the locale needed.
 */
const LocaleSelect = React.createClass({
  mixins: [Reflux.connect(SystemStore, 'system')],
  propTypes: {
    /** Function to call when the input changes. It will receive the new locale value as argument. */
    onChange: PropTypes.func,
  },
  getValue() {
    return this.refs.locale.getValue();
  },
  _formatLocales(locales) {
    const sortedLocales = Object.values(locales)
        .filter(locale => locale['language_tag'] !== 'und')
        .map(locale => {
          return {value: locale['language_tag'], label: locale['display_name']}
        })
        .sort(function(a, b) {
        const nameA = a.label.toUpperCase();
        const nameB = b.label.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        return 0;
    });

    return [{value: 'und', label:'Default locale'}].concat(sortedLocales);
  },
  _renderOption(option) {
      return <span key={option.value} title="{option.value} [{option.value}]">{option.label} [{option.value}]</span>;
  },
  render() {
    const { locales } = this.state.system;
    if (!locales) {
      return <Spinner />;
    }

    const formattedLocales = this._formatLocales(locales);
    return (
      <Select ref="locale" {...this.props}
              placeholder="Pick a locale"
              options={formattedLocales}
              optionRenderer={this._renderOption} />
    );
  },
});

export default LocaleSelect;
