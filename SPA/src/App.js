import React, { Component } from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
export default class App extends Component {
  render() {
    return (
        <Grid>
          <Row className="show-grid">
            <Col lg={3} md={3} sm={3} xs={3}>1</Col>
            <Col lg={3} md={3} sm={3} xs={3}>2</Col>
            <Col lg={3} md={3} sm={3} xs={3}>3</Col>
            <Col lg={3} md={3} sm={3} xs={3}>4</Col>
          </Row>
        </Grid>
    );
  }
}