/**
 * Created by an-ali on 2017-11-10.
 */
import React from 'react';
import SetupHub from './Hub';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

var BanningView = React.createClass({
    intervalId: null,
    getInitialState: function() {
        return {banState: []};
    },
    getData: function(){
        this.serverRequest = $.get('/api/banState', function (result) {
            var d = result;
            console.log("Got banstate, see below: ");
            console.log(d);
            this.setState({ banState: d });
        }.bind(this));
    },
    componentDidMount: function() {
        this.getData();
        SetupHub(()=>{}, ()=>{}, this.gotBanState);
    },
    gotBanState: function(state){
        this.setState({banState: state});
    },
    ban: function(heroId){
        this.serverRequest = $.get('/api/ban/' + heroId, function (result) {
        });
    },
    unban: function(heroId){
        this.serverRequest = $.get('/api/unban/' + heroId, function (result) {
        });
    },
    render: function() {
        var bannedHeroes = this.state.banState ? this.state.banState.banned : [];
        var pickableHeroes = this.state.banState ? this.state.banState.pickable : [];
        var imageUrlSmall = function(shortCode){return 'http://cdn.dota2.com/apps/dota2/images/heroes/' + shortCode + '_sb.png'};
        var banMap = bannedHeroes && bannedHeroes.map(function(hero){
                return  (
                    <Col xs={1} key={hero.id}>
                        <Row>
                            <img src={imageUrlSmall(hero.shortCode)} onClick={()=>this.unban(hero.id)} />
                        </Row>
                        <Row>
                            <div className="sitOut">{hero.name}</div>
                        </Row>
                    </Col>
                )
            },this);
        var pickMap = pickableHeroes && pickableHeroes.map(function(hero){
                return  (
                    <Col xs={1} key={hero.id}>
                        <Row>
                            <img src={imageUrlSmall(hero.shortCode)} onClick={()=>this.ban(hero.id)} />
                        </Row>
                        <Row>
                            <div className="sitOut">{hero.name}</div>
                        </Row>
                    </Col>
                )
            },this);
        return (
            <div>
                <Grid fluid={true}>
                    <Row>
                        <div className="player">Banned heroes:</div>
                        <br/>
                    </Row>
                    <Row>
                        {banMap}
                    </Row>
                    <Row>
                        <br/>
                    </Row>
                    <Row>
                        <div className="player">Pickable heroes:</div>
                        <br/>
                    </Row>
                    <Row>
                        {pickMap}
                    </Row>
                </Grid>
            </div>
        )
    },
});

module.exports = BanningView;