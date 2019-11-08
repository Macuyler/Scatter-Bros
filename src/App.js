import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Editor from './Editor';
import Checkout from './Checkout';
import Admin from './Admin';

const Home = () => (
  <div className="page-wrapper">
    <h1>Home</h1>
  </div>
)

function App() {
  return (
    <div className="app-wrapper">
      <Router>
        <Switch>
          <Route path="/edit" component={Editor} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/admin" component={Admin} />
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
