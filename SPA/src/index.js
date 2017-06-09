import React from 'react';
import ReactDOM from 'react-dom';

import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Well from 'react-bootstrap/lib/Well';
import Table from 'react-bootstrap/lib/Table';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import { Router, Route, Link, browserHistory } from 'react-router';
import Button from 'react-bootstrap/lib/Button';
import $ from 'jquery';
import 'signalr/jquery.signalR.js';

import Team from './Team';
import TeamPlayer from './TeamPlayer';
import OverviewView from './Overview';
import SetupHub from './Hub';



var FactionView = React.createClass({
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
        var dire = {
            backgroundImage: 'url(http://i.imgur.com/HrIj50P.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            textAlign: 'center',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: '0',
            left: '0',
        };
        var radiant = {
            backgroundImage: 'url(http://i.imgur.com/h7laoUJ.png)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            textAlign: 'center',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: '0',
            left: '0',
        };
        console.log(this.state.data);
        var teams = this.state.data.teams;
        var draftDict = this.state.data.playerHeroPoolDict;
        var player = this.props.location.query.player;
        var faction = this.props.route.faction;
        var isEmpty = this.state.data.length === 0;
        if (isEmpty) {
            return null;
        }
        return (
            <div style={faction == 0 ? dire:radiant}>
            <Grid>
                <Row>
                    <Col lg={6} md={6} sm={6} xs={6}><Well><Team team={teams[faction]} player={player} draftDict={draftDict} admin={false}/></Well></Col>

                </Row>
            </Grid>
            </div>
        );
    }
});

var FetchData = React.createClass({
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
    onClick: function (apiCall) {
        this.serverRequest = $.post('/'+apiCall+'/', function (result) {

        });

    },

    render: function() {
        console.log(this.state.data);
        var allPlayers = this.state.data.allPlayers;
        console.log(allPlayers);
        var teams = this.state.data.teams;
        var draftDict = this.state.data.playerHeroPoolDict;
        var player = this.props.location.query.player;


        var isEmpty = this.state.data.length === 0;
        if (isEmpty) {
            return null;
        }
        return (
                    <Grid fluid={true}>
                        <Row>
                            <DraftPlayerDisplay allPlayers={allPlayers} playersInDraft={teams[0].players.concat(teams[1].players)} />

                            <Col xs={2}><Well><Team team={teams[0]} player={player} draftDict={draftDict} admin={true}/></Well></Col>
                            <Col xs={2}><Well><Team team={teams[1]} player={player} draftDict={draftDict} admin={true}/></Well></Col>
                        </Row>

                    </Grid>
        );
    }
});

var DraftPlayerDisplay = React.createClass({
    getInitialState: function() {
        return {allPlayers: [], playersInDraft: [], playerGuidInDraft: []};
    },
    render: function() {

        this.propagateState(false);

        return (
            <Col xs={6}>
                <Row>
                    <Col xs={12}>
                        <Button btn btn-default btn-lg onClick={()=>this.onClick("api/newTeams")}>New Draft (resuffle existing teams with new draft heroes)</Button>
                        <Button btn btn-default btn-lg onClick={()=>this.onClick("api/newDraft")}>Same teams new draft (just new heroes to pick from)</Button>
                        <Button btn btn-default btn-lg onClick={()=>this.onClick("api/Reset/12/3/2")}>Completely new draft (6vs6) (will reset player links)</Button>
                        <Button btn btn-default btn-lg onClick={()=>this.onClick("api/Reset/14/3/2")}>Completely new draft (7vs7) (will reset player links)</Button>
                        <Button btn btn-default btn-lg onClick={()=>this.onClick("api/Reset/16/3/2")}>Completely new draft (8vs8) (will reset player links)</Button>
                        <Button btn btn-default btn-lg onClick={()=>this.onClick("api/Reset/18/3/2")}>Completely new draft (9vs9) (will reset player links)</Button>
                        <Button btn btn-default btn-lg onClick={()=>this.onClick("api/Reset/20/3/2")}>Completely new draft (10vs10) (will reset player links)</Button>
                        <Button btn btn-default btn-lg onClick={()=>this.onClick("api/ClearAllPlayerSitOut")}>Reset all sitout counters</Button>
                    </Col>
                </Row>
                <Row>
                    <Col xs={6}>
                        <ListGroup>
                            <ListGroupItem>
                            <div className="player">In draft</div>
                            </ListGroupItem>
                        </ListGroup>
                        <InDraft allPlayers={this.props.allPlayers} playerGuidInDraft={this.state.playerGuidInDraft} callbackPlayerClick={this.inDraftCallback} renderIn={true} />
                    </Col>
                    <Col xs={6}>
                        <ListGroup>
                            <ListGroupItem>
                                <div className="player">Out of draft</div>
                            </ListGroupItem>
                        </ListGroup>
                        <InDraft allPlayers={this.props.allPlayers} playerGuidInDraft={this.state.playerGuidInDraft} callbackPlayerClick={this.outDraftCallback} />
                    </Col>
                </Row>
            </Col>
        )
    },
    inDraftCallback: function(event) {
        var index = this.state.playerGuidInDraft.indexOf(event);
        if (index > -1) {
            this.state.playerGuidInDraft.splice(index, 1);
        }
        this.forceUpdate();
    },
    outDraftCallback: function(event) {
        var index = this.state.playerGuidInDraft.indexOf(event);
        if (index === -1) {
            this.state.playerGuidInDraft.push(event);
        }
        this.forceUpdate();
    },
    propagateState: function(forced){
        //We only want to propagate state when a new draft is generated or when we draft again.
        if(this.state.allPlayers.length == 0 || forced){
            console.log("propagating state, forced:" + forced);
            this.state.allPlayers = this.props.allPlayers;
            this.state.playersInDraft = this.props.playersInDraft;
            this.state.playerGuidInDraft = this.state.playersInDraft.map(function(playerInDraftInst) {
                return playerInDraftInst.id;
            });
        }
    }
});

var InDraft = React.createClass({
    render: function() {
        var allPlayers = this.props.allPlayers;
        var renderIn = this.props.renderIn;

        var playerGuidInDraft = this.props.playerGuidInDraft;
        var callbackPlayerClick = this.props.callbackPlayerClick;
        var playersMap = allPlayers.map(function(playerInstance){
            if(renderIn && playerGuidInDraft.indexOf(playerInstance.id) == -1){return;};
            if(!renderIn && playerGuidInDraft.indexOf(playerInstance.id) !== -1){return;};
            return  (
                <ListGroupItem onClick={() => callbackPlayerClick(playerInstance.id)}>
                    {playerInstance.name}
                </ListGroupItem>
            )
        });
        console.log("playersMap");
        console.log(playersMap);
        return (
            <ListGroup>{playersMap}</ListGroup>
        )
    },
});

var PlayerView = React.createClass({
    intervalId: null,
    request: null,
    getInitialState: function() {
        return {data: []};
    },

    componentDidMount: function() {
        this.getData();
        //this.intervalId = setInterval(this.getData, 15000);
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
        var playerFaction = getPlayerFaction(teams, player);
        var playerTeamArrayId = getPlayerTeamArrayId(teams, player);
        console.log("player faction: " + playerFaction + "array id:" +  playerTeamArrayId);

        var isEmpty = this.state.data.length === 0;
        if (isEmpty) {
            return null;
        }
        return (
            <Grid>
                <Row>
                    <Col><TeamPlayer team={teams[playerTeamArrayId]} player={player} draftDict={draftDict} playerTeam={true}/></Col>
                </Row>
                    <Row>
                    <Col><TeamPlayer team={teams[playerTeamArrayId===1?0:1]} player={player} draftDict={draftDict} playerTeam={false}/></Col>
                </Row>
            </Grid>
        );
    }
});

//Dont look pls :)
var getPlayerFaction = function(teams, player){
    var playersTeam0 = teams && teams[0] && teams[0].players;
    var factionTeam0 = teams && teams[0] && teams[0].faction;
    var factionTeam1 = teams && teams[1] && teams[1].faction;
    console.log("players: " + playersTeam0);
    var t0 = false;
    playersTeam0 && playersTeam0.forEach(function(p){if(p.id===player){t0 = true}},this);
    console.log("t0:" + t0);
    if(t0){
        return factionTeam0;
    }
    else{
        return factionTeam1;
    }
};

var getPlayerTeamArrayId = function(teams, player){
    var playersTeam0 = teams && teams[0] && teams[0].players;
    var factionTeam0 = teams && teams[0] && teams[0].faction;
    var factionTeam1 = teams && teams[1] && teams[1].faction;
    console.log("players: " + playersTeam0);
    var t0 = false;
    playersTeam0 && playersTeam0.forEach(function(p){if(p.id===player){t0 = true}},this);
    console.log("t0:" + t0);
    if(t0){
        return 0;
    }
    else{
        return 1;
    }
};

ReactDOM.render(<Router history={browserHistory}><Route path="/admin" component={FetchData}/><Route path="/player" component={PlayerView}/><Route path="/radiant" faction="1" component={FactionView}/><Route path="/dire" faction="0" component={FactionView}/><Route path="/overview" component={OverviewView}/></Router>, document.getElementById('imageProgress'));

