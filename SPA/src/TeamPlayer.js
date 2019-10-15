import React, { Component } from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import $ from 'jquery';

var TeamPlayer = React.createClass({
    getInitialState: function () {
        return {team: [], player: "", draftDict: {}, playerTeam: false};
    },
    componentDidMount: function () {
        var component = this;
        console.log("TeamPlayer mounted");
        console.log(component.state.team);
        component.forceUpdate();
    },
    onClick: function () {
        this.serverRequest = $.post('/api/PlayerPicked/' + this.props.player + '/', function (result) {});
        console.log("picked");
    },
    render: function () {
        var team = this.props.team;
        var player = this.props.player;
        var draftDict = this.props.draftDict;
        var playerTeam = this.props.playerTeam;
        var overviewAndPlayer = function(){
            if(playerTeam){
                return (
                    <div>
                        <a href={"/overview"}><div className="overview">Overview</div></a>
                        <a href={"/"+getFaction(team && team.faction)}><p className={getFaction(team && team.faction)}>{getFaction(team && team.faction)}</p></a>
                    </div>
                )
            }
            //not team faction
            return (
                <div><p className={getFaction(team && team.faction)}>{getFaction(team && team.faction)}</p></div>
            )
        }
        return (
            <div className="Team">
                {overviewAndPlayer()}
                <Row>
                    <HeroDraftPlayer players={team && team.players} player={player} draftDict={draftDict}
                                     playerTeam={playerTeam} faction={team.faction}/>
                </Row>
                <Row>
                    <HeroDraftPlayerDraft players={team && team.players} player={player} draftDict={draftDict}
                                          playerTeam={playerTeam}/>
                </Row>
                <Row>
                    <Col>
                        <div className={playerTeam ? "padding" : "hidden"}>
                            <Button className="btn btn-success btn-block" onClick={this.onClick}>
                                <div className="padding">PICK HERO!</div>
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
});

var HeroDraftPlayer = React.createClass({
    getInitialState: function(){
        return{players: [], player: "", draftDict: [], playerTeam: false, sitOutArray: [], faction: 0, length: 0};
    },
    componentDidMount: function(){
        var component = this;
        console.log("HeroDraftPlayer: ");
        console.log(component.props);
        component.forceUpdate();
    },
    sitOutCallback: function(id){
        this.state.sitOutArray.push(id);
    },
    render: function(){
        var component = this;
        var player = this.props.player;
        var draftDict = this.props.draftDict;
        var playerTeam = this.props.playerTeam;
        var players = this.props.players;

        var playersMap = this.props.players.map(function(playerInstance){
            if(component.state.sitOutArray.indexOf(playerInstance.id) !== -1 ){
                return null;
            }
            return  (
                    <Col xs={1} xsPush={2} key={playerInstance.id}>
                        <div className="player">{playerInstance.name}</div>
                        <div className="team"><HeroPoolPlayer currentPlayer={playerInstance.id} draftDict={draftDict} player={player} playerTeam={playerTeam} sitOutCallback={component.sitOutCallback} faction={component.props.faction}/></div>
                    </Col>
            )
        });
        if(!playersMap){
            return null;
        }
        if(playersMap.length === 0 || player.length === 0){
            return null;
        }
        this.state.length = playersMap.length;
        return (
            <div>{playersMap}</div>
        )
    }
});

var HeroDraftPlayerDraft = React.createClass({
    getInitialState: function(){
        return{players: [], player: "", draftDict: [], playerTeam: false};
    } ,
    componentDidMount: function(){
        var component = this;
        console.log('HeroDraftPlayerDraft');
        console.log(component.props);
        component.forceUpdate();
    },
    render: function(){
        var player = this.props.player;
        var draftDict = this.props.draftDict;
        var playerTeam = this.props.playerTeam;
        var playersMap = this.props.players && this.props.players.map(function(playerInstance){
                if(playerInstance.id !== player){return null;};
                return  (
                    <div key={playerInstance.id}>
                        <Col xs={12}>
                            <p className="currentPlayer">{playerInstance.name}</p>
                            <div className="team"><HeroPoolPlayerDraft currentPlayer={playerInstance.id} draftDict={draftDict} player={player} playerTeam={playerTeam}/></div>
                        </Col>
                    </div>
                )
            });
        if(playersMap && playersMap.length === 0 || player.length === 0){
            return null;
        }
        return (
            <div>{playersMap}</div>
        )
    }
});

var HeroPoolPlayer = React.createClass({
    getInitialState: function(){
        return{currentPlayer: [], draftDict: [], player:"", sitOutCallback: function(){}};
    },
    componentDidMount: function(){
        var component = this;
        console.log(component.props);
        component.forceUpdate();
    },
    render: function(){
        var sitOutCallback = this.props.sitOutCallback;
        var currentPlayer = this.props.currentPlayer;
        var draftDict = this.props.draftDict;
        var player = this.props.player;
        var playerTeam = this.props.playerTeam;
        var heroPool = draftDict && draftDict[currentPlayer] && draftDict[currentPlayer].heroPool;
        var heroPoolSelectedHeroId = draftDict[currentPlayer] && draftDict[currentPlayer].selectedHeroId;
        var imageUrlSmall = function(shortCode){return 'http://cdn.dota2.com/apps/dota2/images/heroes/' + shortCode + '_sb.png'};
        var image = {};
        image[0] = <img className={getFaction(this.props.faction)} src="https://via.placeholder.com/59x33/000000?text=%20"/>;
        var sitOut = false;
        var playerPool = heroPool && heroPool.forEach(function(hero){
            if (hero.name === "iceFrog"){
                if(!sitOut){sitOutCallback(currentPlayer);}
                sitOut = true;
                image[0] = <img src="http://i.imgur.com/S910xlC.png" width="33"/>;
            }
            if(heroPoolSelectedHeroId === hero.id) {
                    image[0] = <img className={getFaction(this.props.faction)} src={imageUrlSmall(hero.shortCode)} />;
                    return;
                }
            if(hero.selected && playerTeam){
                    image[0] = <img src={imageUrlSmall(hero.shortCode)} className={getFaction(this.props.faction) + " desaturate"}/>;
                    return;
                }
            },this);

        if(player.length === 0){
            return null;
        }
        return (

            <div>{image[0]}</div>
        )
    }
});

var HeroPoolPlayerDraft = React.createClass({
    getInitialState: function(){
        return{currentPlayer: [], draftDict: [], player:"", localHeroState: 0};
    } ,
    componentDidMount: function(){
        var component = this;
        console.log(component.props);
        component.forceUpdate();
    },
    onClick: function(heroId) {
        this.serverRequest = $.post('/api/Player/' + this.props.player + '/' + heroId, function (result) {

        });
    },
    render: function(){
        var currentPlayer = this.props.currentPlayer;
        var draftDict = this.props.draftDict;
        var player = this.props.player;
        var heroPool = draftDict && draftDict[currentPlayer] && draftDict[currentPlayer].heroPool;
        var heroPoolSelectedHero = draftDict && draftDict[currentPlayer] && draftDict[currentPlayer].selectedHeroId;
        var imageUrlFull = function(shortCode){return 'http://cdn.dota2.com/apps/dota2/images/heroes/' + shortCode + '_vert.jpg'};

        var playerPool = heroPool && heroPool.map(function(hero){
            if(heroPoolSelectedHero !== 0 && heroPoolSelectedHero !== hero.id){
                return null;
            }
                return (
                    <a className="padding" key={hero.id}><img height="272" src={imageUrlFull(hero.shortCode)} onClick={()=>this.onClick(hero.id)}  className={hero.selected ? "glow":"desaturate"}/></a>
                )
            },this);

        if(player.length === 0){
            return null;
        }
        return (
            <div>{playerPool}</div>
        )
    }
});

var getFaction = function(faction){
    switch(faction){
        case 0:
            return "Radiant";
        case 1:
            return "Dire";
        default:
            return "Unknown";
    }
};

module.exports = TeamPlayer;