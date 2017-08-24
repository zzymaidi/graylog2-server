import React, { PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';

const AlertTriggerVisualization = React.createClass({
  propTypes: {
    id: PropTypes.string.isRequired,
    config: PropTypes.shape({
      color_normal: PropTypes.string,
      color_triggered: PropTypes.string,
    }).isRequired,
    data: PropTypes.shape({
      trigger: PropTypes.bool,
      message: PropTypes.string,
    }).isRequired,
    height: PropTypes.number,
    width: PropTypes.number,
  },

  getDefaultProps() {
    return {
      height: 1,
      width: 1,
    };
  },

  render() {
    const config = this.props.config;
    const data = this.props.data;
    const bgColor = data.trigger ? config.color_triggered : config.color_normal;

    return (
      <Row>
        <Col md={12} style={{ backgroundColor: bgColor }}>
          <h1>{data.message}</h1>
        </Col>
      </Row>
    );
  },
});

export default AlertTriggerVisualization;
