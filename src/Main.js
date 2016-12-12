import React from 'react';
import Nav from './Nav';
import firebase from 'firebase';
import { hashHistory } from 'react-router';

export default class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            points: '',
            name: '',
        };
        this.updateState = this.updateState.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
    }

    updateState(stateChange) {
        this.setState(stateChange);
    }

    componentWillMount() {
        var that = this;
         this.unregister = firebase.auth().onAuthStateChanged(
            user => {
                if (user) {
                    if (user.email !== null) {
                        console.log("You're logged in as", user.email);

                        // Reevaluate user's net worth when the user is here:

                        var fullName = '';

                        // User's name to display
                        var userNameRef = firebase.database().ref('users/' + user.uid + '/fullName');
                        userNameRef.once('value')
                            .then(function(snapshot) {
                                fullName = snapshot.val();
                                that.setState({
                                    name: fullName
                                });
                            }

                            // User's points to display
                            ).then(function() {
                                var userpointsRef = firebase.database().ref('users/' + user.uid + '/points');
                                userpointsRef.once('value')
                                    .then(function(snapshot) {

                                        // points assets
                                        var pointsVal = snapshot.val();

                                        that.setState(
                                            {
                                                points: (pointsVal).toFixed(2),
                                            }
                                        );
                                    });
                            });
                    }
                } 
            }
        );
    }

      componentWillUnmount() {
        //when the component is unmounted, unregister using the saved function
        if(this.unregister){ //if have a function to unregister with
            this.unregister(); //call that function!
        }
      }


    render() {

      return (
        <div>
            <Nav  updateParent={this.updateState} points={this.state.points} name={this.state.name}/>
            <main>
                    <h1>True Gamer Test</h1>
                        <p>This template has a responsive menu toggling system. The menu will appear collapsed on smaller screens, and will appear non-collapsed on larger screens. When toggled using the button below, the menu will appear/disappear. On small screens, the page content will be pushed off canvas.</p>
                        <p>Make sure to keep all page content within the <code>#page-content-wrapper</code>.</p>
            </main>
        </div>
      );
  }
}