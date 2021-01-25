import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Autocomplete } from '@material-ui/lab';
import {
  Button,
  ButtonGroup,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons';

import { getRegions, regionUpdated } from './data';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    overflow: 'hidden',
  },
  form: {
    '& .MuiPaper-root': {
      padding: theme.spacing(1),
      '& > div, & > fieldset:not(:first-child)': {
        marginTop: theme.spacing(1),
      },
      '& > *': {
        width: '100%',
      },
    },
  },
  exit: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1) + 4,
    height: 40,
    '& > *': {
      padding: 6,
    },
  },
}));

const Settings = ({
  analytics,
  region,
  ssmPrefix,
  theme,
  setAnalytics,
  setRegion,
  setSSMPrefix,
  setTheme,
}: {
  analytics: boolean;
  region: string;
  theme: string;
  ssmPrefix: string;
  setAnalytics: (analytics: boolean) => void;
  setRegion: (region: string) => void;
  setSSMPrefix: (ssmPrefix: string) => void;
  setTheme: (theme: string) => void;
}) => {
  const [regions, setRegions] = useState<string[]>([]);

  useEffect(() => regionUpdated(region), [region]);
  useEffect(() => {
    (async () => setRegions(await getRegions()))();
  }, [region, setRegions]);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ButtonGroup variant="contained" className={classes.exit}>
        <Tooltip title="Exit Settings">
          <Button
            component={Link}
            to="/"
            color="primary"
            aria-label="exit-settings"
          >
            <Close />
          </Button>
        </Tooltip>
      </ButtonGroup>
      <Grid container spacing={3} className={classes.form}>
        <Grid item xs={12}>
          <Typography variant="h6">Settings</Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper>
            <FormControl component="fieldset">
              <FormLabel component="legend">Theme</FormLabel>
              <Select
                value={theme}
                onChange={(event) => {
                  const t = event.target.value;
                  setTheme(t ? String(t) : 'default');
                }}
              >
                <MenuItem value="default">Default (use OS setting)</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="light">Light</MenuItem>
              </Select>
            </FormControl>
            <FormControl component="fieldset">
              <FormLabel component="legend">Analytics Participation</FormLabel>
              <FormGroup>
                <FormControlLabel
                  label={analytics ? 'enabled' : 'not enabled'}
                  control={
                    <Switch
                      checked={analytics}
                      onChange={(event) => setAnalytics(event.target.checked)}
                      name="analytics-opt-in"
                    />
                  }
                />
              </FormGroup>
            </FormControl>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper>
            <FormLabel component="legend">AWS</FormLabel>
            <Autocomplete
              blurOnSelect
              value={region}
              options={_.uniq(regions)}
              renderInput={(params) => (
                <TextField
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...params}
                  variant="standard"
                  label="Region"
                  placeholder="region"
                />
              )}
              onChange={(_event, value) => {
                if (!value || _.isEmpty(value)) {
                  return;
                }

                setRegion(value);
              }}
            />
            <TextField
              label="SSM Prefix"
              defaultValue={ssmPrefix}
              onBlur={(event) => {
                const val = event.target.value;
                if (val !== ssmPrefix) setSSMPrefix(val);
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

Settings.propTypes = {
  analytics: PropTypes.bool.isRequired,
  region: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
  ssmPrefix: PropTypes.string.isRequired,
  setAnalytics: PropTypes.func.isRequired,
  setRegion: PropTypes.func.isRequired,
  setSSMPrefix: PropTypes.func.isRequired,
  setTheme: PropTypes.func.isRequired,
};

export default Settings;
