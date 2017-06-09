/**
 * Created by an-ali on 2017-06-03.
 */
import React from 'react';
import SetupHub from './Hub';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Well from 'react-bootstrap/lib/Well';

import TeamOverview from './TeamOverview';

var OverviewView = React.createClass({
    getInitialState: function() {
        return {data: []};
    },

    componentDidMount: function() {
        this.getData();
        SetupHub(this.gotData);
    },
    getData: function(){
        this.serverRequest = $.get('/api/GetDraft', function (result) {
            var d = result;
            console.log("Got data pulled by interval, see below: ");
            console.log(d);
            this.setState({ data: d });
        }.bind(this));
    },
    gotData: function(result){
        var d = result;
        console.log("Got data pumped from server :) see below: ");
        console.log(d);
        this.setState({data: d});
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    render: function() {
        console.log(this.state.data);
        var teams = this.state.data.teams;
        var draftDict = this.state.data.playerHeroPoolDict;
        var player = this.props.location.query.player;
        var faction = this.props.route.faction;
        var divBackground = {
            backgroundImage: 'url(http://i.imgur.com/wSzr5hm.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            textAlign: 'center'
        }


        var isEmpty = this.state.data.length === 0;
        if (isEmpty) {
            return null;
        }
        return (
            <div className="box" style={divBackground}>
                <Grid fluid={true}>
                    <Row>
                        <Col lg={4} md={4} sm={4} xs={4}><Well><TeamOverview team={teams[0]} player={player} draftDict={draftDict}/></Well></Col>
                        <Col lg={4} md={4} sm={2} xs={1}><Well></Well></Col>
                        <Col lg={4} md={4} sm={4} xs={4}><Well><TeamOverview team={teams[1]} player={player} draftDict={draftDict}/></Well></Col>
                    </Row>
                </Grid>
            </div>
        );
    }
});

module.exports = OverviewView;