import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { StripeProvider } from "react-stripe-elements";
import { MuiThemeProvider } from "@material-ui/core";
import firebase from "./firebase";
import "firebase/firebase-firestore";
import "firebase/firebase-auth";
import Editor from "./Editor";
import Checkout from "./Checkout";
import Admin from "./Admin";
import theme from "./theme";
import Home from "./Home";

const fb = firebase();
const db = fb.firestore();

const App = () => {
  const [stripeKey, setStripeKey] = useState(null);

  useEffect(() => {
    fetch("http://localhost:9000/stripe_key", {
      method: "GET"
    })
      .then(res => res.json())
      .then(res => setStripeKey(res.stripe_key))
      .catch(err => console.log(err));
  }, []);

  const Wrapper = stripeKey ? StripeProvider : () => <></>;

  return (
    <MuiThemeProvider theme={theme}>
      <Wrapper apiKey={stripeKey}>
        <div className="app-wrapper">
          <Router>
            <Switch>
              <Route path="/edit" component={Editor} />
              <Route path="/checkout" component={props => <Checkout db={db} {...props} />} />
              <Route path="/admin" component={props => <Admin db={db} firebase={fb} {...props} />} />
              <Route path="/" component={Home} />
            </Switch>
          </Router>
        </div>
      </Wrapper>
    </MuiThemeProvider>
  );
};

export default App;
