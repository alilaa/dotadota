import React from 'react';
import ReactDOM from 'react-dom';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Well from 'react-bootstrap/lib/Well';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import { Router, Route, Link, browserHistory } from 'react-router';
import Button from 'react-bootstrap/lib/Button';
import { FormGroup, FormControl, InputGroup, Glyphicon } from 'react-bootstrap';
import $ from 'jquery';
import 'signalr/jquery.signalR.js';
//internal
import Team from './Team';
import TeamPlayer from './TeamPlayer';
import SoundOverview from './Overview';
import BanningView from './BanningVIew';
import SetupHub from './Hub';



var FactionView = React.createClass({
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        this.getData();
        SetupHub(this.gotData, ()=>{}, ()=>{});
    },
    getData: function(){
        this.serverRequest = $.get('/api/GetDraft', function (result) {
            var d = result;
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
        var teams = this.state.data && this.state.data.teams;
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

var AdminView = React.createClass({
    getInitialState: function() {
        return {data: [], password: ""};
    },
    componentDidMount: function() {
        this.getData();
        SetupHub(this.gotData, ()=>{}, ()=>{});
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
    handlePasswordChange (event){
        this.setState({password: event.target.value});
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
        } if(this.state.password !== "dagon5"){
            return (<div><FormGroup>
                <InputGroup>
                    <FormControl
                        type="password"
                        value={this.state.password}
                        placeholder={"Password"}
                        onChange={this.handlePasswordChange}
                    />
                </InputGroup>
            </FormGroup>
            </div>);
        }
        return (
                    <Grid fluid={true}>
                        <Row>
                            <DraftPlayerDisplay allPlayers={allPlayers} playersInDraft={teams[0].players.concat(teams[1].players)} />

                            <Col xs={2}><Well><Team team={teams[0]} player={player} draftDict={draftDict} admin={true}/></Well></Col>
                            <Col xs={2}><Well><Team team={teams[1]} player={player} draftDict={draftDict} admin={true}/></Well></Col>
                        </Row>
                        <Row>
                            <BanningView />
                        </Row>

                    </Grid>
        );
    }
});

var DraftPlayerDisplay = React.createClass({
    getInitialState: function() {
        return {allPlayers: [], playersInDraft: [], playerGuidInDraft: [], heroPoolSize: "", sitOutCount: ""};
    },
    handleHeroChange (event) {
        this.setState({ heroPoolSize: event.target.value });
    },
    handleSitOutChange (event) {
        this.setState({ sitOutCount: event.target.value });
    },
    render: function() {

        this.propagateState(false);

        return (
            <Col xs={6}>
                <Row>
                    <Col xs={6}>
                        <br/>
                        <div className="player">Drafter:</div>
                        <FormGroup>
                            <InputGroup>
                                <FormControl
                                    type="text"
                                    value={this.state.heroPoolSize}
                                    placeholder={"Heropool Size"}
                                    onChange={this.handleHeroChange}
                                />
                                <FormControl
                                    type="text"
                                    value={this.state.sitOutCount}
                                    placeholder={"Number of sitouts"}
                                    onChange={this.handleSitOutChange}
                                />
                            </InputGroup>
                        </FormGroup>
                        <Button btn btn-default btn-lg onClick={()=>this.postNewDraft()}>Generate New Draft</Button>
                        <Button btn btn-default btn-lg onClick={()=>this.apiCall("api/NewDraft/"+ this.state.heroPoolSize + "/" + this.state.sitOutCount)}>Only new HeroPools and Sitout</Button>
                        <br/>
                        <br/>
                    </Col>
                    <Col xs={6}>
                        <br/>
                        <div className="player">Misc:</div>
                        <Button btn btn-default btn-lg onClick={()=>this.apiCall("api/ClearAllPlayerSitOut")}>Reset all sitout counters</Button>
                    </Col>
                </Row>
                <Row>
                    <Col xs={6}>
                        <ListGroup>
                            <ListGroupItem>
                            <div className="player">In next draft ({this.state.playerGuidInDraft.length})</div>
                            </ListGroupItem>
                        </ListGroup>
                        <InDraft allPlayers={this.props.allPlayers} playerGuidInDraft={this.state.playerGuidInDraft} callbackPlayerClick={this.inDraftCallback} renderIn={true} />
                    </Col>
                    <Col xs={6}>
                        <ListGroup>
                            <ListGroupItem>
                                <div className="player">Out of next draft ({this.props.allPlayers.length - this.state.playerGuidInDraft.length})</div>
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
    },
    apiCall: function (apiCall) {
        this.serverRequest = $.post('/'+apiCall+'/', function (result) {

        });

    },
    postNewDraft: function(){
        if(this.state.heroPoolSize === ""){
            alert("Set Heropool size!");
            return;
        }
        if(this.state.sitOutCount === ""){
            alert("Set sitOutCount size!");
            return;
        }
        if(this.state.playerGuidInDraft.length % 2 === 1 && this.state.sitOutCount % 2 !== 1){
            alert("The number of players in the draft is uneven. Sitout count must be uneven!");
            return;
        }
        if(this.state.playerGuidInDraft.length % 2 === 0 && this.state.sitOutCount % 2 !== 0){
            alert("The number of players in the draft is even. Sitout count must be even!");
            return;
        }
        var myJsonString = JSON.stringify(this.state.playerGuidInDraft);
        $.ajax({
            type: "POST",
            url: "/api/ResetWithTeams/" + this.state.heroPoolSize + "/" + this.state.sitOutCount,
            data: myJsonString,
            dataType: "json",
            contentType: "application/json",
            success: function() { this.propagateState(true);},
            failure: function() { alert("Dotadota failed you :("); }
        });
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
                <ListGroupItem onClick={() => callbackPlayerClick(playerInstance.id)} key={playerInstance.id}>
                    <div className="buttonPlayer"> {playerInstance.name}</div>
                </ListGroupItem>
            )
        });
        console.log("playersMap");
        console.log(playersMap);
        if(!renderIn) {
            return (
                <ListGroup>{playersMap}
                    <ListGroupItem>
                        <PlayerAdding />
                    </ListGroupItem>
                </ListGroup>
            )
        }
        return (
            <ListGroup>{playersMap}</ListGroup>
        )
    },
});

var PlayerAdding = React.createClass({
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
                        placeholder={"New player name"}
                        onChange={this.handleChange}
                        onKeyPress={this.handleKeyPress}
                    />
                    <InputGroup.Addon>
                        <Glyphicon onClick={this.onOkClick} role="button" glyph="ok"></Glyphicon>
                    </InputGroup.Addon>
                </InputGroup>
            </FormGroup>
        </div>);
    },
    onOkClick: function(){
        console.log("on ok click in player edit");
        console.log(this.state.value);
        this.apiCall("api/AddPlayerName/"+ this.state.value);
        this.setState({ value: "" });
    },
    apiCall: function (apiCall) {
        this.serverRequest = $.post('/'+apiCall+'/', function (result) {

        });

    },
    handleKeyPress: function(target) {
        if(target.charCode==13){
            this.onOkClick();
        }
    }
});

var PlayerView = React.createClass({
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        this.getData();
        SetupHub(this.gotData, ()=>{}, ()=>{});
    },
    getData: function(){
        this.serverRequest = $.get('/api/GetDraft', function (result) {
            var d = result;
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
            //backgroundImage: 'url(http://i.imgur.com/HrIj50P.jpg)',
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
            //backgroundImage: 'url(http://i.imgur.com/h7laoUJ.png)',
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
        var playerFaction = getPlayerFaction(teams, player);
        var playerTeamArrayId = getPlayerTeamArrayId(teams, player);

        var isEmpty = this.state.data.length === 0;
        if (isEmpty) {
            return null;
        }
        return (
            <div style={playerFaction === 1 ? dire:radiant}>
                <Grid>
                    <Row>
                        <Col><TeamPlayer team={teams[playerTeamArrayId]} player={player} draftDict={draftDict} playerTeam={true}/></Col>
                    </Row>
                    <Row>
                        <Col><TeamPlayer team={teams[playerTeamArrayId===1?0:1]} player={player} draftDict={draftDict} playerTeam={false}/></Col>
                    </Row>
                </Grid>
            </div>
        );
    }
});

//Dont look pls :)
var getPlayerFaction = function(teams, player){
    var playersTeam0 = teams && teams[0] && teams[0].players;
    var factionTeam0 = teams && teams[0] && teams[0].faction;
    var factionTeam1 = teams && teams[1] && teams[1].faction;

    var t0 = false;
    playersTeam0 && playersTeam0.forEach(function(p){if(p.id===player){t0 = true}},this);

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
    var t0 = false;
    playersTeam0 && playersTeam0.forEach(function(p){if(p.id===player){t0 = true}},this);

    if(t0){
        return 0;
    }
    else{
        return 1;
    }
};

ReactDOM.render(<Router history={browserHistory}><Route path="/admin" component={AdminView}/><Route path="/player" component={PlayerView}/><Route path="/radiant" faction="1" component={FactionView}/><Route path="/dire" faction="0" component={FactionView}/><Route path="/overview" component={SoundOverview}/></Router>, document.getElementById('imageProgress'));

