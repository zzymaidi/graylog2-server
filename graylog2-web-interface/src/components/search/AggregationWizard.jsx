import React from 'react';
import PropTypes from 'prop-types';

import { Button, Col, Modal, Row } from 'react-bootstrap';

import { Input } from 'components/bootstrap';
import StringUtils from 'util/StringUtils';

const AggregationButton = ({ type }) => (
  <Button style={{ margin: '5px' }}>
    <i className={`fa fa-${type}-chart`} style={{ 'font-size': '48px', padding: '10px' }} />
    <br />
    {`${StringUtils.capitalizeFirstLetter(type)} Chart`}
  </Button>
);

AggregationButton.propTypes = {
  type: PropTypes.string.isRequired,
};

class AggregationWizard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      charts: this.availableCharts,
    };
  }
  componentDidMount() {
    if (this.visElement) {
      this.visElement.getInputDOMNode().focus();
    }
  }
  availableCharts = ['topn', 'bottomn', 'line', 'pie'];
  _onVisTypeChange = (evt) => {
    const value = evt.target.value;

    const charts = this.availableCharts.filter(chart => chart.indexOf(value.toLowerCase()) !== -1);
    this.setState({ charts: charts });
  };
  render() {
    const { fieldName, onHide } = this.props;
    return (
      <Modal show onHide={onHide} keyboard>
        <Modal.Header closeButton>
          <Modal.Title>Adding Visualization for {fieldName}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{margin: '10px', 'text-align': 'center'}}>
          {this.state.charts.map(type => <AggregationButton key={type} type={type}/>)}

          <hr />

          <Row>
            <Col md={4}>
              <Input type="text" value={fieldName} />
            </Col>
            <Col md={4}>
              <Input ref={(element) => { this.visElement = element; }}
                     type="text"
                     autofocus
                     placeholder="Visualization Type"
                     onChange={this._onVisTypeChange} />
            </Col>
            <Col md={4}>
              <Input type="text" />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>Footer</Modal.Footer>
      </Modal>
    );
  }
}

AggregationWizard.propTypes = {
  fieldName: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default AggregationWizard;
