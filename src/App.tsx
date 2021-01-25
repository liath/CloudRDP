import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Analytics from './components/Analytics';
import Hosts from './components/Hosts';
import Settings from './components/Settings';
import Theme from './components/Theme';

export default function App() {
  return (
    <Theme>
      <Analytics />
      <Router>
        <Switch>
          <Route exact path="/settings" component={Settings} />
          <Route path="/" component={Hosts} />
        </Switch>
      </Router>
    </Theme>
  );
}
