import React from 'react';
import Nav from './Nav';
import firebase from 'firebase';
import { hashHistory } from 'react-router';
import Trivia from './Trivia';

export default class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            points: '',
            name: '',
        };
        this.updateState = this.updateState.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.losePoints = this.losePoints.bind(this);
        this.gainPoints = this.gainPoints.bind(this);
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
                                                points: (pointsVal),
                                            }
                                        );
                                    });
                            });
                    }
                } 
            }
        );
    }

    losePoints(){
        var user = firebase.auth().currentUser;
        var newPoints = this.state.points - 2;
        this.setState({points: newPoints});
        var userpointsRef = firebase.database().ref('users/' + user.uid + '/points');
        userpointsRef.set(newPoints);
    }
    
    gainPoints(){
         var user = firebase.auth().currentUser;
        var newPoints = this.state.points + 3;
        this.setState({points: newPoints});
        var userpointsRef = firebase.database().ref('users/' + user.uid + '/points');
        userpointsRef.set(newPoints);
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
                <h1>Test Your Knowledge</h1>
                {this.state.name === '' &&
                <p>Login or signup to start earning points!</p>
                }
                <Trivia losePoints={this.losePoints} gainPoints={this.gainPoints} userName={this.state.name}/>
            </main>
        </div>
      );
  }
}