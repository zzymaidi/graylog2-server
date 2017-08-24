import React from 'react';

import { ReactGridContainer } from 'components/common';
import { QuerySidebar, SearchWidget } from 'components/search';
import style from 'pages/ShowDashboardPage.css';

const SearchGrid = React.createClass({
  getInitialState() {
    return {
      positions: { foo: { col: 0, row: 0, height: 3, width: 1.5 } },
    };
  },

  _onPositionsChange(positions) {
    const newPositions = {};
    positions.forEach(position => {
      newPositions[position.id] = position;
    });

    this.setState({ positions: newPositions });
  },
  _onWidgetSizeChange(widgetId, newSize) {
    /*const newPositions = this.state.positions;
    this.state.positions[widgetId].height = newSize.height;
    this.state.positions[widgetId].width = newSize.width;

    this.setState({ positions: newPositions });*/
  },
  render() {
    return (
      <div className="dashboard">
        <ReactGridContainer locked positions={this.state.positions} onPositionsChange={this._onPositionsChange}>
          <div key="foo" className={style.widgetContainer}>
            <SearchWidget title="Foo" widgetId="foo" onSizeChange={this._onWidgetSizeChange}>
              <QuerySidebar />
            </SearchWidget>
          </div>
        </ReactGridContainer>
      </div>
    );
  },
});

export default SearchGrid;
