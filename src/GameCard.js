import React from 'react';
import firebase from 'firebase';

String.prototype.replaceAll = function(search, replace) {
    if (replace === undefined) {
        return this.toString();
    }
    return this.split(search).join(replace);
}

// Individual Card Component
export default class GameCard extends React.Component {
    constructor(props) {
        super(props);
        this.state =  {
            games: [],
            guessed: false
        };
        this.showAnswer = this.showAnswer.bind(this);
        this.resetGuess = this.resetGuess.bind(this);
        this.userGuess = this.userGuess.bind(this);
    }
    // Method to concat the background url
    backgroundUrl(array, fn){
        var result = [];
        for (var i = 0; i < array.length; i ++){
        var mapping = fn(array[i]);
        result = result.concat(mapping);
        }
        return result;
    }

    showAnswer(){
        this.setState({guessed: true});
    }

    resetGuess(){
        var that = this;
        setTimeout(function() {
            that.setState({guessed: false});
        }, 2000);
    }

    userGuess(guessName){
        var correct = this.props.data["name"];
        if (guessName === correct){
            console.log("correct!");
        }
        else {
            console.log("wrong!");
        }
    }

    render() {
        var that = this;
        var coverId = "0";
            if ("screenshots" in this.props.data){ // If it has a cover 
            coverId = this.props.data["screenshots"][0]["cloudinary_id"];
        }
        var currentBackgroundId = coverId;
        if (currentBackgroundId != "0"){
            var backgroundUrlParts = "url('https://images.igdb.com/igdb/image/upload/t_screenshot_huge/$.png') center center no-repeat #46B6AC"
            var backResult = this.backgroundUrl(backgroundUrlParts.split('$'), function(part){
                return [part, currentBackgroundId];
            });
            backResult.pop();
            backResult = backResult.join("");
            var cardStyle = {
            background: backResult,
            }
        }
        else {
            var cardStyle = {
            backgroundColor: "black", // If it doesn't have a cover, make it black
            }
        }
        // Shorten and filter summary
        var filteredSummary = "";
        var defaultSummary = this.props.data["summary"];
        var name = this.props.data["name"];
        name = name.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/gi,"");
        var wordToFilter = name.split(" ");
        if (defaultSummary){
            filteredSummary = defaultSummary.replace(name, "*****");
            for (var i = 0; i < wordToFilter.length; i ++){
                if (wordToFilter[i].length > 3 || !isNaN(wordToFilter[i])){
                    filteredSummary = filteredSummary.replaceAll(wordToFilter[i], "*****");
                }
            }
            if (filteredSummary.length > 350){
                filteredSummary = filteredSummary.substring(0, 350)+"...";
            }
        }
        var guessChoicesArray = [name, this.props.game2["name"], this.props.game3["name"]];

        var guessChoicesProcessedArray = guessChoicesArray.map(function(game){ // Go through every game in the array
            return <p key={game}><a className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onClick={function(){that.userGuess(game)}}>{game}</a></p>
        });
        return (
        <div className="demo-card-wide mdl-card mdl-shadow--2dp">
            <div className="mdl-card__title" style={cardStyle}>
                
            </div>
            <div className="mdl-card__supporting-text">
                {filteredSummary}
            </div>
            <div className="mdl-card__actions mdl-card--border">
                {!this.state.guessed && 
                    <div>
                    {this.props.userName !== '' &&
                        <p><strong>Can you guess the game? (+3 points)</strong></p>
                    }
                    {this.props.userName === '' &&
                        <p><strong>Can you guess the game?</strong></p>
                    }
                    {guessChoicesProcessedArray}
                    <p>
                        {this.props.userName !== '' &&
                            <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent" onClick={(e) => {this.showAnswer(); this.props.losePoints()}}>
                                See Answer (-2 points)
                            </button>
                        }
                        {this.props.userName === '' &&
                            <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent" onClick={this.showAnswer}>
                                See Answer
                            </button>
                        }
                    </p>
                    </div>
                }
                {this.state.guessed &&
                    <div>
                        <h3><strong>Answer:</strong> {name}</h3>
                        <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent" onClick={(e) => {this.props.newPrompt(); this.resetGuess()}}>
                            Challenge me again!
                        </button>
                    </div>
                }
            </div>
        </div>
        );
    }
}