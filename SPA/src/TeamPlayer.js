import React, { Component } from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import $ from 'jquery';

var TeamPlayer = React.createClass({
    getInitialState: function () {
        return {team: team(), player: "", draftDict: {}, playerTeam: false};
    },
    componentDidMount: function () {
        var component = this;
        console.log("TeamPlayer mounted");
        console.log(component.state.team);
        component.forceUpdate();
    },
    onClick: function () {
        this.serverRequest = $.post('/api/PlayerPicked/' + this.props.player + '/', function (result) {

        });
        //window.location.reload();
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
                        <a href={"/"+getFaction(team.faction)}><p className={getFaction(team.faction)}>{getFaction(team.faction)}</p></a>
                    </div>
                )
            }
            //not team faction
            return (
                <div><p className={getFaction(team.faction)}>{getFaction(team.faction)}</p></div>
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
                    <Col xs={1} xsPush={2}>
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
                    <div>
                        <Col xs={12}>
                            <p className="currentPlayer">{playerInstance.name}</p>
                            <p className="team"><HeroPoolPlayerDraft currentPlayer={playerInstance.id} draftDict={draftDict} player={player} playerTeam={playerTeam}/></p>
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
        return{currentPlayer: [], draftDict: draftDict(), player:"", sitOutCallback: function(){}};
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
        var heroPool = draftDict[currentPlayer] && draftDict[currentPlayer].heroPool;
        var heroPoolSelectedHeroId = draftDict[currentPlayer] && draftDict[currentPlayer].selectedHeroId;
        console.log(heroPoolSelectedHeroId);
        var imageUrlSmall = function(shortCode){return 'http://cdn.dota2.com/apps/dota2/images/heroes/' + shortCode + '_sb.png'};
        var imageUrlLarge = function(shortCode){return 'http://cdn.dota2.com/apps/dota2/images/heroes/' + shortCode + '_lg.png'};
        var imageUrlFull = function(shortCode){return 'http://cdn.dota2.com/apps/dota2/images/heroes/' + shortCode + '_vert.jpg'};
        console.log("HeroPoolPlayer");
        console.log(heroPool);
        var image = {};
        image[0] = <img className={getFaction(this.props.faction)} src="https://placeholdit.imgix.net/~text?txtsize=7&bg=000000&txtclr=000000&txt=59%C3%9733&w=59&h=33"/>;
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
        return{currentPlayer: [], draftDict: draftDict(), player:"", localHeroState: 0};
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

    onHover: function(heroId) {
        this.setState({ hoverTargetHeroId: heroId });
    },
    render: function(){
        var localHeroState = this.props.localHeroState;
        var currentPlayer = this.props.currentPlayer;
        var draftDict = this.props.draftDict;
        var player = this.props.player;
        var heroPool = draftDict[currentPlayer] && draftDict[currentPlayer].heroPool;
        var heroPoolSelectedHero = draftDict[currentPlayer] && draftDict[currentPlayer].selectedHeroId;
        var imageUrlFull = function(shortCode){return 'http://cdn.dota2.com/apps/dota2/images/heroes/' + shortCode + '_vert.jpg'};

        var playerPool = heroPool && heroPool.map(function(hero){
            if(heroPoolSelectedHero !== 0 && heroPoolSelectedHero !== hero.id){
                return null;
            }
                return (
                    <a className="padding"><img src={imageUrlFull(hero.shortCode)} onClick={()=>this.onClick(hero.id)}  className={hero.selected ? "glow":"desaturate"}/></a>
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

var team = function(){
  return {
              "id": "000000000000000000",
              "faction": 1,
              "players": [
                  {
                      "id": "514d8302-b3e7-43fc-9c7c-5a3ceee98087",
                      "name": "Player1"
                  },
                  {
                      "id": "91cbc658-408f-456d-96f2-55e1d83a6886",
                      "name": "Player2"
                  },
                  {
                      "id": "d43c0efa-9e73-465c-b7ef-95449be6c0aa",
                      "name": "Player3"
                  },
                  {
                      "id": "ebc09622-46a6-4a79-ae00-b78a24ea8b52",
                      "name": "Player4"
                  },
                  {
                      "id": "92b34f28-2af1-48c8-bcfb-3c337ceafbce",
                      "name": "Player5"
                  },
                  {
                      "id": "1e60aa98-caf7-41e5-aa81-cbe4e4ad4562",
                      "name": "Player6"
                  },
                  {
                      "id": "1142d678-bfa6-4ac0-8974-6a18655d4501",
                      "name": "Player7"
                  },
                  {
                      "id": "ee12f26b-8b2f-448b-ae8c-02f3b42d84e8",
                      "name": "Player8"
                  },
                  {
                      "id": "c24aee9f-e27f-4c86-98c9-a1d1f174f352",
                      "name": "Player9"
                  },
                  {
                      "id": "c3cdab30-54c1-4be2-8ed5-75b8aecc3799",
                      "name": "Player10"
                  }
              ]
          }
};

var draftDict = function() {
    return {
        "playerHeroPoolDict": {
            "514d8302-b3e7-43fc-9c7c-5a3ceee98087": {
                "heroPool": [
                    {
                        "id": 99,
                        "code": "npc_dota_hero_bristleback",
                        "name": "Bristleback",
                        "shortCode": "bristleback",
                        "selected": false,
                        "aliases": [
                            "Rigwarl",
                            "bb"
                        ],
                        "team": "dire",
                        "roles": {
                            "carry": 2,
                            "escape": 0,
                            "nuker": 1,
                            "initiator": 1,
                            "durable": 3,
                            "disabler": null,
                            "jungler": null,
                            "support": null,
                            "pusher": null
                        },
                        "primaryAttribute": "strength",
                        "attack": "melee",
                        "attackRate": 1,
                        "attackRange": 150,
                        "projectileSpeed": 0,
                        "movementSpeed": 290,
                        "movementTurnRate": 1,
                        "cmEnabled": true,
                        "complexity": 1,
                        "url": "https://www.dota2.com/hero/Bristleback/",
                        "spawn": null
                    },
                    {
                        "id": 34,
                        "code": "npc_dota_hero_tinker",
                        "name": "Tinker",
                        "shortCode": "tinker",
                        "selected": false,
                        "aliases": [],
                        "team": "dire",
                        "roles": {
                            "carry": 1,
                            "escape": 0,
                            "nuker": 3,
                            "initiator": null,
                            "durable": null,
                            "disabler": null,
                            "jungler": null,
                            "support": null,
                            "pusher": 2
                        },
                        "primaryAttribute": "intellect",
                        "attack": "ranged",
                        "attackRate": 1,
                        "attackRange": 500,
                        "projectileSpeed": 900,
                        "movementSpeed": 305,
                        "movementTurnRate": 0.6,
                        "cmEnabled": true,
                        "complexity": 2,
                        "url": "https://www.dota2.com/hero/Tinker/",
                        "spawn": null
                    },
                    {
                        "id": 105,
                        "code": "npc_dota_hero_techies",
                        "name": "Techies",
                        "shortCode": "techies",
                        "selected": false,
                        "aliases": [],
                        "team": "radiant",
                        "roles": {
                            "carry": 0,
                            "escape": 0,
                            "nuker": 3,
                            "initiator": null,
                            "durable": null,
                            "disabler": 1,
                            "jungler": null,
                            "support": null,
                            "pusher": null
                        },
                        "primaryAttribute": "intellect",
                        "attack": "ranged",
                        "attackRate": 1,
                        "attackRange": 700,
                        "projectileSpeed": 900,
                        "movementSpeed": 270,
                        "movementTurnRate": 0.5,
                        "cmEnabled": true,
                        "complexity": 2,
                        "url": "https://www.dota2.com/hero/Techies/",
                        "spawn": null
                    }
                ],
                "selectedHeroId": 0
            }
        }
    }
}


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