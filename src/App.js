import React from "react";
import { Switch, Route } from "react-router";
import { initializeIcons } from "@fluentui/react/lib/Icons";

import "./App.css";
import Settings from "./pages/Settings";

initializeIcons();

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/">
          <Settings />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
