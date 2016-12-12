import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import App from './App';
import Main from './Main';
import SignUpApp from './SignUpApp';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';

import '../css/main.css';


// Initialize Firebase
 var config = {
    apiKey: "AIzaSyCV1FUqs2KZPV1O_i4D-US2f4fY5R64XsY",
    authDomain: "game-knowledge-tester.firebaseapp.com",
    databaseURL: "https://game-knowledge-tester.firebaseio.com",
    storageBucket: "game-knowledge-tester.appspot.com",
    messagingSenderId: "672593435207"
  };
  firebase.initializeApp(config);

//render the Application view with routes!
  ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
        <IndexRoute component={Main} />
        <Route path="main" component={Main} />
        <Route path="signup" component={SignUpApp} />
    </Route>
  </Router>,
  document.getElementById('root')
);