import React, { useState } from 'react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from "@date-io/date-fns";
import { ThemeProvider } from '@material-ui/core';
import theme from './settings/theme';
import Chat from './Pages/Chat/Chat';
import FireBase from './Config/FireBase';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom'


function App() {
  const [showDash, setShowDash] = useState(false)
  return (
    <div className="App">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <ThemeProvider theme={theme}>
          <Router>
            <Route exact path="/:token" component={Chat}/>
          </Router>
        </ThemeProvider>
      </MuiPickersUtilsProvider>
    </div>
  );
}

export default App;
