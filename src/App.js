import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Redirect } from 'react-router';
import { Typography, Button, MuiThemeProvider } from '@material-ui/core';
import firebase from './firebase';
import 'firebase/firebase-firestore';
import Editor from './Editor';
import Checkout from './Checkout';
import Admin from './Admin';
import theme from './theme';

const db = firebase().firestore();

const Home = () => {
  const [ go, setGo ] = useState(false);
  return (
    <div className="page-wrapper banner">
      <Typography variant="h1" style={{ color: '#fff' }}>Scatter Bros</Typography>
      <Typography variant="body1" style={{ color: '#fafafa', width: '43%', textAlign: 'center' }}>Build Your Dream Marshmallow Launcher! This site lets you customize your very own PVC pipe marshmallow launcher. After you design your dream launcher we will ship the parts right to your door!</Typography>
      <Button onClick={() => setGo(true)} variant="contained" color="primary" style={{ marginTop: 20, width: 300 }}>Get Started</Button>
      {go ? <Redirect to="/edit" /> : null}
    </div>
  );
};

const App = () => (
  <MuiThemeProvider theme={theme}>
    <div className="app-wrapper">
      <Router>
        <Switch>
          <Route path="/edit" component={Editor} />
          <Route path="/checkout" component={(props) => <Checkout db={db} {...props} />} />
          <Route path="/admin" component={(props) => <Admin db={db} {...props} />} />
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    </div>
  </MuiThemeProvider>
);

export default App;
