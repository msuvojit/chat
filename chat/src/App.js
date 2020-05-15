import React, { useState } from 'react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from "@date-io/date-fns";
import { ThemeProvider } from '@material-ui/core';
import theme from './settings/theme';
import Chat from './Pages/Chat/Chat';

function App() {
  const [showDash, setShowDash] = useState(false)
  return (
    <div className="App">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <ThemeProvider theme={theme}>
          <Chat />
        </ThemeProvider>
      </MuiPickersUtilsProvider>
    </div>
  );
}

export default App;
