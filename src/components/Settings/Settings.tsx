import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  Checkbox,
  Fab,
  FormControl,
  FormControlLabel,
  FormLabel,
  TextField,
  Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

import { getRegions, regionUpdated } from './data';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
  },
  form: {
    '& > *': {
      marginTop: theme.spacing(1),
    },
  },
  exit: {
    float: 'right',
  },
}));

const Settings = ({
  analytics,
  region,
  ssmPrefix,
  setAnalytics,
  setRegion,
  setSSMPrefix,
}: {
  analytics: boolean;
  region: string;
  ssmPrefix: string;
  setAnalytics: (analytics: boolean) => void;
  setRegion: (region: string) => void;
  setSSMPrefix: (ssmPrefix: string) => void;
}) => {
  const [regions, setRegions] = useState<string[]>([]);

  useEffect(() => regionUpdated(region), [region]);
  useEffect(() => {
    (async () => setRegions(await getRegions()))();
  }, [region, setRegions]);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Tooltip className={classes.exit} title="Exit Settings">
        <Link to="/">
          <Fab color="primary" aria-label="exit-settings">
            <CloseIcon />
          </Fab>
        </Link>
      </Tooltip>
      <FormControl className={classes.form} component="fieldset">
        <FormLabel component="legend">Settings</FormLabel>
        <Autocomplete
          blurOnSelect
          value={region}
          options={_.uniq(regions)}
          renderInput={(params) => (
            <TextField
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...params}
              variant="standard"
              label="region"
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
        <FormControlLabel
          label="Analytics Participation"
          labelPlacement="start"
          control={
            <Checkbox
              aria-label="analytics participation"
              checked={analytics}
              onChange={(event, value) => {
                setAnalytics(value);
              }}
            />
          }
        />
      </FormControl>
    </div>
  );
};

Settings.propTypes = {
  analytics: PropTypes.bool.isRequired,
  region: PropTypes.string.isRequired,
  ssmPrefix: PropTypes.string.isRequired,
  setAnalytics: PropTypes.func.isRequired,
  setRegion: PropTypes.func.isRequired,
  setSSMPrefix: PropTypes.func.isRequired,
};

export default Settings;
