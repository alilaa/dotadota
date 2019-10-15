/**
 * Created by an-ali on 2017-06-06.
 */
import React, { Component } from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import { FormGroup, FormControl, InputGroup, Glyphicon } from 'react-bootstrap';

var SitOutEdit = React.createClass({
    getInitialState: function(){
        return{value: ""};
    },
    handleChange (event) {
        this.setState({ value: event.target.value });
    },
    render: function () {
        return (<div>
            <FormGroup>
                <InputGroup>
                    <FormControl
                        type="text"
                        value={this.state.value}
                        placeholder={this.props.currentPlayer.sitOutCount}
                        onChange={this.handleChange}
                        onKeyPress={this.handleKeyPress}
                    />
                    <InputGroup.Addon>
                        <Glyphicon onClick={this.onOkClick} role="button" glyph="ok"></Glyphicon>{ " " }
                        <Glyphicon onClick={this.props.onCancel} role="button" glyph="remove"></Glyphicon>
                    </InputGroup.Addon>
                </InputGroup>
            </FormGroup>
        </div>);
    },
    onOkClick: function(){
        console.log("on ok click in player edit");
        console.log(this.state.value);
        this.props.onOk(this.state.value);
    },
    handleKeyPress: function(target) {
        if(target.charCode==13){
            this.onOkClick();
        }
    }
});

var SitOutDisplay = React.createClass({
    render: function () {
        return (<div className="sitOut">Sit out count: {this.props.currentPlayer.sitOutCount} <Glyphicon onClick={this.props.onEdit} role="button" glyph="pencil"></Glyphicon></div> );
    },
});

var SitOutName = React.createClass ({
    getInitialState: function(){
        return{inEditMode: false, admin: false};
    },
    render: function(){
        if(this.props.sitOutArray.indexOf(this.props.currentPlayer.id) !== -1 && !this.props.admin){
            return null;
        }
        if(!this.props.admin){
            return (
                <Row>
                    <Col xs={10} xsOffset={1}>
                        <div className="sitOut">Sit out count: {this.props.currentPlayer.sitOutCount}</div>
                    </Col>
                </Row>
            );
        }
        if (this.state.inEditMode) {
            return (
                <Row>
                    <Col xs={10} xsOffset={1}>
                        <SitOutEdit currentPlayer={this.props.currentPlayer} onOk={this.handleChildOkClick} onCancel={this.handleChildCancelClick} newName=""/>
                    </Col>
                </Row>
            );
        }
        return (
            <Row>
                <Col xs={10} xsOffset={1}>
                    <SitOutDisplay currentPlayer={this.props.currentPlayer} onEdit={this.handleChildEditClick} />
                </Col>
            </Row>
        );
    },
    handleChildEditClick: function(event) {
        console.log("handled edit click - state: " + this.state.inEditMode );
        if(this.state.inEditMode){
            this.state.inEditMode = false;
            return;
        }
        this.state.inEditMode = true;
        this.forceUpdate();
    },
    handleChildCancelClick: function(event) {
        this.state.inEditMode = false;
        this.forceUpdate();
    },
    handleChildOkClick: function(event) {
        console.log("handle child ok click event ");
        console.log(event);
        //call backend -------------------------------------------------------------------------
        this.serverRequest = $.post('/api/UpdatePlayerSitOut/' + this.props.currentPlayer.id + '/' + event + '/', function (result) {});
        this.state.inEditMode = false;
        this.forceUpdate();
    },
});

module.exports = SitOutName;