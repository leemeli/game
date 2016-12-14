import React from 'react';
import { Link } from 'react-router';
import firebase from 'firebase';
import unirest from 'unirest';
import GameCard from './GameCard';

export default class Trivia extends React.Component {

    constructor(props) {
        super(props);
        this.state =  {
            games: ['zelda',
            'kirby',
            'mario',
            'halo',
            'sims',
            'pokemon',
            'yoshi',
            'donkey',
            'final fantasy',
            'fire emblem',
            'wii']
        };
        this.componentWillMount = this.componentWillMount.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.generateNewPrompt = this.generateNewPrompt.bind(this);
    }

    componentWillMount(){
        var initialGames = this.shuffleArray(this.state.games);
        this.setState({games: initialGames});
    }

    componentDidMount(){
        var that = this;
        var randomSearch = this.shuffleArray(this.state.games)[0];
        var promise = this.loadData(randomSearch);
        var currentGame;
        promise.then(function(result){
            var randomGame = that.shuffleArray(result);
            currentGame = randomGame[0];
            // So that it never gives you a game without both screenshots and summaries
            while (!currentGame['screenshots'] || !currentGame['summary']){
                var randomGame = that.shuffleArray(result);
                currentGame = randomGame[0];
            }
            that.setState({currentData: currentGame, otherGame1: randomGame[1], otherGame2: randomGame[2]});
        });
    }

    shuffleArray(array) {
        let i = array.length - 1;
        for (; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    loadData(inputValue){
        var url = "https://igdbcom-internet-game-database-v1.p.mashape.com/games/?fields=*&limit=15&offset=0&order=popularity%3Adesc&search=" + inputValue;
        // These code snippets use an open-source library. http://unirest.io/nodejs
        return new Promise(function(resolve, reject) {
            unirest.get(url)
                .header("X-Mashape-Key", "bzEPsCBiJHmshEqprwvPypyLQ4rEp1w3wC9jsnmulEW8m2jmD4")
                .header("Accept", "application/json")
                .end(function(result) {
                    if (result.status != 200) {
                        reject(result.body);
                    } else {
                        resolve(result.body);
                    }
                });
        });
    }

    // Method to choose a new game for user to guess
    generateNewPrompt(){
        var that = this;
        var randomSearch = this.shuffleArray(this.state.games)[0];
        var promise = this.loadData(randomSearch);
        var currentGame;
        promise.then(function(result){
            var randomGame = that.shuffleArray(result);
            currentGame = randomGame[0];
            // So that it never gives you a game without both screenshots and summaries
            while (!currentGame['screenshots'] || !currentGame['summary']){
                var randomGame = that.shuffleArray(result);
                currentGame = randomGame[0];
            }
            that.setState({currentData: currentGame, otherGame1: randomGame[1], otherGame2: randomGame[2]});
            console.log("promise done");
        });
    }

    render(){
        return(
            
            <div>
                {!this.state.currentData &&
                    <p>Loading...</p>
                }
                {this.state.currentData &&
                <GameCard data={this.state.currentData} game2={this.state.otherGame1} game3={this.state.otherGame2} newPrompt={this.generateNewPrompt} gainPoints={this.props.gainPoints} losePoints={this.props.losePoints} userName={this.props.userName}/>
                }
            </div>
            
        );
    }

}