import React from "react";

import { Route, Switch, Redirect } from "react-router-dom";
import { MemoryRouter } from 'react-router';
import Main from "./Main";

class App extends React.Component {

  render() {
    return (
      <div className="roation-container">
        <MemoryRouter  >
          <Switch>
            <Route path="/manage/notification/show" component={Main} exact />
            <Redirect from="*" to="/manage/notification/show" />
          </Switch>
        </MemoryRouter>
      </div>
    );
  }
}
export default App;

//export default App;
