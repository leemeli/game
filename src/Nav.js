import React from 'react';
import { Link } from 'react-router';
import firebase from 'firebase';
import Leaderboard from './Leaderboard';
import SignInApp from './SignInApp';

export default class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.updateParent = this.props.updateParent;
        this.signOut = this.signOut.bind(this);
    }

    //A callback function for logging out the current user
    signOut() {
        /* Sign out the user, and update the state */
        console.log('Signing out');
        firebase.auth().signOut();
        this.updateParent({ currentUser: null, points: '', name: '' });
    }

    render() {

      var name = this.props.name;
      var points = this.props.points;

      return (
          <div id="sidebar">
                <span className="mdl-layout-title"><Link to="/main"><i className="fa fa-gamepad" aria-hidden="true"></i></Link></span>
                {name === '' &&
                <div>
                    <h5>Welcome, Guest!</h5>
                    Login to start earning points!
                    <SignInApp />
                    <p>
                        <Link to="/signup">New user? Sign up now!</Link>
                    </p>
                </div>
                }
                {name !== '' &&
                <div className="centerText">
                    <h5>Welcome, {name}!</h5>
                    <p>
                        <strong>Points: </strong> {this.props.points}
                    </p>
                    {points >= 0 &&
                    <p>
                        <strong>Rank: </strong> Noob
                    </p>
                    }
                    {points >= 50 &&
                    <p>
                        <strong>Rank: </strong> Wannabe Gamer
                    </p>
                    }
                    {points >= 150 &&
                    <p>
                        <strong>Rank: </strong> Typical Gamer
                    </p>
                    }
                    {points >= 250 &&
                    <p>
                        <strong>Rank: </strong> Addicted Gamer
                    </p>
                    }
                    {points >= 400 &&
                    <p>
                        <strong>Rank: </strong> Pro Gamer
                    </p>
                    }
                    <hr />
                    <Leaderboard />
                    <div className="logout">
                        <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent" onClick={() => this.signOut()}>Sign out</button>
                    </div>
                </div>
                }
            </div>

      );
  }
}