import React from 'react';
import { CssBaseline, PaletteType, useMediaQuery } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const Theme = ({
  children,
  theme,
}: {
  children: JSX.Element[];
  theme: string;
}) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const muiTheme = React.useMemo(() => {
    let mode: PaletteType = prefersDarkMode ? 'dark' : 'light';
    if (theme !== 'default') {
      mode = theme as PaletteType;
    }
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
  }, [prefersDarkMode, theme]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default Theme;
