import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Nucleus from 'nucleus-nodejs';

import Hosts from './components/Hosts';
import Settings from './components/Settings';

// Gives us splat tracking and an idea how many users there are.
Nucleus.init('600a02d29971711903443e4d', {
  disableTracking: true,
});

const App = ({ analytics }) => {
  useEffect(() => {
    if (analytics) Nucleus.enableTracking();
    else Nucleus.disableTracking();
  }, [analytics]);

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(() => {
    // TODO: make this a setting, probably 'light', 'dark', 'default'
    const mode = prefersDarkMode ? 'dark' : 'light';
    const bt = createMuiTheme({
      palette: {
        type: mode,
      },
    });

    const sbTheme = {
      bg: bt.palette.background.default,
      tb: bt.palette.divider,
      eb: bt.palette.action.selected,
    };

    return createMuiTheme({
      palette: {
        type: mode,
      },
      overrides: {
        MuiCssBaseline: {
          '@global': {
            html: {
              '& *::-webkit-scrollbar, & .MuiDataGrid-root *::-webkit-scrollbar': {
                backgroundColor: sbTheme.bg,
              },
              '& *::-webkit-scrollbar-thumb, & .MuiDataGrid-root *::-webkit-scrollbar-thumb': {
                border: `3px solid ${sbTheme.bg}`,
                minHeight: 24,
                borderRadius: 8,
                backgroundColor: sbTheme.tb,
              },
              '& *::-webkit-scrollbar-thumb:focus, & .MuiDataGrid-root *::-webkit-scrollbar-thumb:focus': {
                backgroundColor: sbTheme.eb,
              },
              '& *::-webkit-scrollbar-thumb:active, & .MuiDataGrid-root *::-webkit-scrollbar-thumb:active': {
                backgroundColor: sbTheme.eb,
              },
              '& *::-webkit-scrollbar-thumb:hover, & .MuiDataGrid-root *::-webkit-scrollbar-thumb:hover': {
                backgroundColor: sbTheme.eb,
              },
              '& *::-webkit-scrollbar-corner, & .MuiDataGrid-root *::-webkit-scrollbar-corner': {
                backgroundColor: sbTheme.bg,
              },
            },
          },
        },
      },
    });
  }, [prefersDarkMode]);

  useEffect(() => Nucleus.appStarted(), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route exact path="/settings" component={Settings} />
          <Route path="/" component={Hosts} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

App.propTypes = {
  analytics: PropTypes.bool.isRequired,
};

export default App;
