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
                    <Row key={playerInstance.id}>
                            <PlayerAndName currentPlayer={playerInstance} draftDict={draftDict} faction={faction} />
                    </Row>
            )
        });
        var sitOutMap = this.props.players.map(function(playerInstance){
            return  (
                <Row key={playerInstance.id}>
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
        return{currentPlayer: [], draftDict: [], faction: 0, waterBoys: false};
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
        var heroPool = draftDict && draftDict[currentPlayer] && draftDict[currentPlayer].heroPool;
        var heroPoolSelectedHeroId = draftDict && draftDict[currentPlayer] && draftDict[currentPlayer].selectedHeroId;
        var imageUrlLarge = function(shortCode){return 'http://cdn.dota2.com/apps/dota2/images/heroes/' + shortCode + '_lg.png'};
        var image = {};
        var sitOut = false;

        image[0] = <img src="https://via.placeholder.com/59x33/000000?text=%20" width="120px"/>;
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
module.exports = TeamOverview;
