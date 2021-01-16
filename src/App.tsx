import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Hosts from './components/Hosts';

import configureStore from './store';

const store = configureStore();

export default function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(() => {
    const mode = prefersDarkMode ? 'dark' : 'light';
    const bt = createMuiTheme({
      palette: {
        type: mode,
      },
    });

    const sbTheme = prefersDarkMode
      ? {
          // keep datagrids colors since they like them so much
          bg: '#202022',
          tb: '#585859',
          eb: '#838384',
        }
      : {
          bg: bt.palette.grey[300],
          tb: bt.palette.grey[400],
          eb: bt.palette.grey[500],
        };

    return createMuiTheme({
      palette: {
        type: mode,
      },
      overrides: {
        MuiCssBaseline: {
          '@global': {
            html: {
              '& *::-webkit-scrollbar': {
                backgroundColor: sbTheme.bg,
              },
              '& *::-webkit-scrollbar-thumb': {
                border: `3px solid ${sbTheme.bg}`,
                minHeight: 24,
                borderRadius: 8,
                backgroundColor: sbTheme.tb,
              },
              '& *::-webkit-scrollbar-thumb:focus': {
                backgroundColor: sbTheme.eb,
              },
              '& *::-webkit-scrollbar-thumb:active': {
                backgroundColor: sbTheme.eb,
              },
              '& *::-webkit-scrollbar-thumb:hover': {
                backgroundColor: sbTheme.eb,
              },
              '& *::-webkit-scrollbar-corner': {
                backgroundColor: sbTheme.bg,
              },
            },
          },
        },
      },
    });
  }, [prefersDarkMode]);
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Switch>
            <Route path="/" component={Hosts} />
          </Switch>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}
