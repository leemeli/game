import React from 'react';
import SignInApp from './SignInApp';
import { Link } from 'react-router';
import firebase from 'firebase';

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
                <div>
                    <h5>Welcome, {name}!</h5>
                    <p>
                        <strong>Points: </strong> {this.props.points}
                    </p>
                    <div className="logout">
                        <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent" onClick={() => this.signOut()}>Sign out</button>
                    </div>
                </div>
                }
            </div>

      );
  }
}