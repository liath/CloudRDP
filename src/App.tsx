import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Hosts from './components/Hosts';

export default function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(() => {
    const base = {
      palette: {
        type: prefersDarkMode ? 'dark' : 'light',
      },
    };
    const bt = createMuiTheme(base);

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
      ...base,
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route path="/" component={Hosts} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}
