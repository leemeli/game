import React from 'react';
import firebase from 'firebase';

export default class Leaderboard extends React.Component {
    constructor(props) {
        super(props);
    }

    getLeaders(){
        var array = [];
        var db = firebase.database();
        var ref = db.ref("users");
        ref.orderByChild("points").on("child_added", function(snapshot) {
            var points = snapshot.val().points;
            var rank = "";
            if (points >= 0 && points < 50){
                rank = "Noob";
            }
            else if (points >= 50 && points < 150){
                rank = "Wannabe Gamer";
            }
            else if (points >= 150 && points < 250){
                rank = "Typical Gamer";
            }
            else if (points >= 250 && points < 400){
                rank = "Addicted Gamer";
            }
            else {
                rank ="Pro Gamer";
            }
            array.push(snapshot.val().fullName + " (" + rank + ")" + " - " + points);
        });
        array = array.reverse();
        array = array.slice(0, 3);
        return array;
    }

    render (){
        var leadersArray = this.getLeaders();
        return(
            <div className="centerText leaderBoard">
                <h5>Leaderboard</h5>
                <ul className="list-item mdl-list">
                    <li>
                        1. {leadersArray[0]}
                    </li>
                    <li>
                        2. {leadersArray[1]}
                    </li>
                    <li>
                        3. {leadersArray[2]}
                    </li>
                </ul>
            </div>
        );
    }
}