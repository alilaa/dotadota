/**
 * Created by an-ali on 2017-06-03.
 */
import React, { Component } from 'react';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';


var TeamOverview = React.createClass({
    getInitialState: function(){
        return{team: {}, player: "", draftDict: {}};
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
                <a href={"/"+getFaction(team.faction)}><p className={"O"+getFaction(team.faction)}>{getFaction(team.faction)}</p></a>
                    <Players players={team.players} draftDict={draftDict} faction={getFaction(team.faction)}/>
            </div>
        );
    }
});

var Players = React.createClass({
    getInitialState: function(){
        return{players: [], draftDict: [], faction: 0};
    },
    componentDidMount: function(){
        var component = this;
        console.log(component.props);
        component.forceUpdate();
    },
    render: function(){
        var draftDict = this.props.draftDict;
        var faction = this.props.faction;
        var playersMap = this.props.players.map(function(playerInstance){
            return  (
                    <Row>
                            <PlayerAndName currentPlayer={playerInstance} draftDict={draftDict} faction={faction} />
                    </Row>
            )
        });
        var sitOutMap = this.props.players.map(function(playerInstance){
            return  (
                <Row>
                    <PlayerAndName currentPlayer={playerInstance} draftDict={draftDict} faction={faction} waterBoys={true}/>
                </Row>
            )
        });
        if(playersMap.length === 0){
            return null;
        }
        return (
            <div>
                <ListGroupItem>
                    {playersMap}
                </ListGroupItem>
                <Row>
                <div className="OWaterboys"><br/>Waterboys</div>
                </Row>
                <ListGroupItem>
                {sitOutMap}
                </ListGroupItem>
            </div>
        )
    }
});

var PlayerAndName = React.createClass({
    getInitialState: function(){
        return{currentPlayer: [], draftDict: draftDict(), faction: 0, waterBoys: false};
    } ,
    componentDidMount: function(){
        var component = this;
        console.log(component.props);
        component.forceUpdate();
    },
    render: function(){
        var faction = this.props.faction;
        var playerInstance = this.props.currentPlayer;
        var currentPlayer = this.props.currentPlayer.id;
        var draftDict = this.props.draftDict;
        var heroPool = draftDict[currentPlayer] && draftDict[currentPlayer].heroPool;
        var heroPoolSelectedHeroId = draftDict[currentPlayer] && draftDict[currentPlayer].selectedHeroId;
        var imageUrlSmall = function(shortCode){return 'http://cdn.dota2.com/apps/dota2/images/heroes/' + shortCode + '_sb.png'};
        var imageUrlLarge = function(shortCode){return 'http://cdn.dota2.com/apps/dota2/images/heroes/' + shortCode + '_lg.png'};
        var imageUrlFull = function(shortCode){return 'http://cdn.dota2.com/apps/dota2/images/heroes/' + shortCode + '_vert.jpg'};
        var image = {};
        var sitOut = false;

        image[0] = <img src="https://placeholdit.imgix.net/~text?txtsize=7&bg=000000&txtclr=000000&txt=59%C3%9733&w=59&h=33" width="120px"/>;
        var playerPool = heroPool && heroPool.forEach(function(hero){
                if (hero.name === "iceFrog"){
                    image[0] = <img src="http://i.imgur.com/S910xlC.png" width="75px"/>;
                    sitOut = true;
                }
                if(heroPoolSelectedHeroId === hero.id) {
                    image[0] = <img src={imageUrlLarge(hero.shortCode)} width="120px" />;
                    return;
                }
            },this);

        if(sitOut && !this.props.waterBoys){
            //we dont render sitouts
            return null;
        }
        if(!sitOut && this.props.waterBoys){
            //we only render sitouts
            return null;
        }
        return (
            <div>
                <Col xs={9}>
                <a className="OPlayer" href={"/"+faction}>{playerInstance.name}</a>
                </Col>
                <Col xs={1}>
                    {image[0]}
                </Col>
            </div>
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

module.exports = TeamOverview;
