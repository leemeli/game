import React from 'react';
import firebase from 'firebase';

export default class Leaderboard extends React.Component {
    constructor(props) {
        super(props);
    }
    render (){
        return(
            <p className="centerText">
                <h5>Leaderboard</h5>
                <ul className="list-item mdl-list">
                    <li>
                        1. Bryan Cranston - 294
                    </li>
                    <li>
                        2. Aaron Paul - 222
                    </li>
                    <li>
                        3. Bob Odenkirk - 108
                    </li>
                </ul>
            </p>
        );
    }
}