import React, { Component } from 'react';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Table from 'react-bootstrap/lib/Table';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import { FormGroup, FormControl, InputGroup, Glyphicon } from 'react-bootstrap';
import PlayerName from './PlayerName';
import SitOutName from './SitOutCount';


var Team = React.createClass({
    getInitialState: function(){
        return{team: {}, player: "", draftDict: {}, admin: false};
    },
    componentDidMount: function(){
        var component = this;
        console.log(component.props);
        component.forceUpdate();
    },
    render: function(){
        var team = this.props.team;
        var draftDict = this.props.draftDict;
        return (
            <div className="Team">
                <a href={"/overview"}><div className="overview">Overview</div></a><a href={"/"+getFaction(team.faction)}><div className={getFaction(team.faction)}>{getFaction(team.faction)}</div></a>
                <ListGroupItem key={team.id}>

                    <HeroDraft players={team.players} draftDict={draftDict} admin={this.props.admin}/>

                </ListGroupItem>
            </div>
        );
    }
});



var HeroDraft = React.createClass({
    getInitialState: function(){
        return{players: [], draftDict: [], admin: false, sitOutArray: []};
    },
    componentDidMount: function(){
        var component = this;
        console.log(component.props);
        component.forceUpdate();
    },
    sitOutCallback: function(id){
        this.state.sitOutArray.push(id);
    },
    render: function(){
        var component = this;
        var draftDict = this.props.draftDict;
        var admin = this.props.admin
        var playersMap = this.props.players.map(function(playerInstance){
            return  (
                    <div>
                        <PlayerName currentPlayer={playerInstance} admin={admin} sitOutArray={component.state.sitOutArray}/>
                        <SitOutName currentPlayer={playerInstance} admin={admin} sitOutArray={component.state.sitOutArray}/>
                        <HeroPool currentPlayer={playerInstance.id} draftDict={draftDict} admin={admin} sitOutCallback={component.sitOutCallback}/>
                    </div>
                    )
        });
        if(playersMap.length === 0){
            return null;
        }
        return (
           <div>{playersMap}</div>
        )
    }
});

var HeroPool = React.createClass({
    getInitialState: function(){
        return{currentPlayer: [], draftDict: draftDict(), sitOutCallback: function(){}, admin: false};
    } ,
    componentDidMount: function(){
        var component = this;
        console.log(component.props);
        component.forceUpdate();
    },
    render: function(){
        var currentPlayer = this.props.currentPlayer;
        var draftDict = this.props.draftDict;
        var heroPool = draftDict[currentPlayer] && draftDict[currentPlayer].heroPool;
        var imageUrlSmall = function(shortCode){return 'http://cdn.dota2.com/apps/dota2/images/heroes/' + shortCode + '_sb.png'};
        var imageUrlLarge = function(shortCode){return 'http://cdn.dota2.com/apps/dota2/images/heroes/' + shortCode + '_lg.png'};
        var imageUrlFull = function(shortCode){return 'http://cdn.dota2.com/apps/dota2/images/heroes/' + shortCode + '_vert.jpg'};
        var sitOut = false;
        var playerPool = heroPool && heroPool.map(function(hero){
            if (hero.name === "iceFrog"){
                if(!sitOut){this.props.sitOutCallback(currentPlayer);}
                sitOut = true;
                return (<img src="http://i.imgur.com/S910xlC.png" width="33"/>);
            }
            return (
                <img src={imageUrlSmall(hero.shortCode)} className={hero.selected ? "":"desaturate"}/>
            );
            },this);

        if(sitOut && !this.props.admin){return null;}

        return (
            <Row>
                <Col xs={10} xsOffset={1}>
                    <p className="team"><div>{playerPool}</div></p>
                    <br/>
                </Col>
            </Row>
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

module.exports = Team;

