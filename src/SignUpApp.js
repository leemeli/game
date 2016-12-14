import React from 'react';
import firebase from 'firebase';
import SignUpForm from './SignUpForm';
import Nav from './Nav';
import { hashHistory } from 'react-router';

export default class SignUpApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        name: '',
        points: ''
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  componentDidMount() {
      var that = this;
    /* Add a listener and callback for authentication events */
    this.unregister = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ userId: user.uid });
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
                                                points: pointsVal,
                                            }
                                        );
                                    });
                            });
                    }
      }
      else {
        this.setState({ userId: null }); //null out the saved state
      }
    })
  }
  //A callback function for registering new users
  signUp(email, password, fullName) {
    /* Create a new user and save their information */
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function (firebaseUser) {
        //include information (for app-level content)
        var profilePromise = firebaseUser.updateProfile({
          displayName: fullName,
          points: 0
        }); //return promise for chaining

        //create new entry in the Cloud DB (for others to reference)
        var userRef = firebase.database().ref('users/' + firebaseUser.uid);
        var userData = {
          fullName: fullName,
          points: 0
        }
        var userPromise = userRef.set(userData); //update entry in JOITC, return promise for chaining
        return Promise.all([profilePromise, userPromise]); //do both at once!
      })
      .then(function () {
        console.log('Logged in!');
        hashHistory.push('/main');
      })
      // .then(() => this.forceUpdate()) //bad, but helps demo
      .catch((err) => console.log(err));
  }

  componentWillUnmount() {
    //when the component is unmounted, unregister using the saved function
    if (this.unregister) { //if have a function to unregister with
      this.unregister(); //call that function!
    }
  }

  updateState(stateChange) {
        this.setState(stateChange);
    }

  render() {
      var name = this.state.name;
    return (
    <div>
        <Nav  updateParent={this.updateState} points={this.state.points} name={this.state.name}/>
        <main>
            <section id="signUpDiv" role="region">
                {name === '' &&
                <SignUpForm signUpCallback={this.signUp} />
                }
            </section>
            {name !== '' &&
                <p>You already have an account!</p>
            }
        </main>
    </div>
      );

  }
}