import _ from 'lodash';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import RefreshIcon from '@material-ui/icons/Refresh';
import Tooltip from '@material-ui/core/Tooltip';
import CssBaseline from '@material-ui/core/CssBaseline';

const parseHosts = (hosts) =>
  _.chain(hosts)
    .filter((x) => !x.hidden)
    .flatMap('tags')
    .reduce((s, x) => {
      // skip Name as we surface that in the table already.
      if (x.Key === 'Name') return s;

      // create a map tags to all known values
      if (!s[x.Key]) s[x.Key] = [x.Value];
      else s[x.Key].push(x.Value);

      return s;
    }, {})
    .entries()
    .sortBy('0')
    .value();

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300,
    flexShrink: 0,
    '& > #tag-filters': {
      height: `calc(100vh - ${30 + theme.spacing(3)}px)`,
      overflowY: 'auto',
      overflowX: 'hidden',
      '& > * + *': {
        marginTop: theme.spacing(3),
      },
    },
    '& > #toolbar': {
      display: 'flex',
      paddingLeft: theme.spacing(1),
      paddingTop: theme.spacing(1),
      color: theme.palette.text.secondary,
      height: '56px',
      '& > h6': {
        flexGrow: 1,
      },
      '& > button': {
        marginRight: theme.spacing(1),
      },
    },
  },
}));

const Filters = ({ hosts, getHosts, setHosts }) => {
  // the actual filter settings
  const [filter, setFilter] = useState({});
  // and the available filters for the UI
  const [tagFilters, setTagFilters] = useState([]);
  // facilitates clearing autocompletes
  const [reset, clearForm] = useState(true);

  // update list of available tags to filter when hosts change
  useEffect(() => setTagFilters(parseHosts(hosts)), [hosts, filter]);

  // mark filtered hosts as hidden
  useEffect(() => {
    const resetHosts = hosts.map((x) => ({ ...x, hidden: false }));

    // show everything when no filters are applied
    if (_.isEmpty(filter)) {
      setHosts(resetHosts);
      return;
    }

    const newHosts = _.entries(filter).reduce((keep, tag) => {
      const [name, values] = tag;

      return keep.map((host) => {
        if (host.hidden) return host;

        const t = host.tags.find((x) => x.Key === name);
        // hide the host if it doesn't have the target tag or the tag's value
        // isn't in the filter
        return {
          ...host,
          hidden: _.isEmpty(t) || !values.includes(t.Value),
        };
      });
    }, resetHosts);

    setHosts(newHosts);
  }, [filter]);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <div id="toolbar">
        <Typography className={classes.title} variant="h6" id="tableTitle">
          Filters
        </Typography>
        {!_.isEmpty(filter) && (
          <Tooltip title="Clear Filters">
            <Fab
              color="primary"
              aria-label="clear-filters"
              onClick={() => {
                clearForm(!reset);
                setFilter({});
              }}
            >
              <ClearAllIcon />
            </Fab>
          </Tooltip>
        )}
        <Tooltip title="Reload from AWS">
          <Fab
            color="primary"
            aria-label="refresh"
            onClick={() => {
              getHosts()
                .then((x) => {
                  setHosts(x);
                  // reloading the hosts list doesn't require that we reset the
                  // filters, not sure what is better ux...
                  return clearForm(!reset);
                })
                .catch(() => {});
            }}
          >
            <RefreshIcon />
          </Fab>
        </Tooltip>
      </div>
      <div id="tag-filters">
        {tagFilters.map(([name, values]) => (
          <Autocomplete
            key={`ac-${name}-${reset ? 'flip' : 'flop'}`}
            multiple
            blurOnSelect
            options={_.uniq(values)}
            renderInput={(params) => (
              <TextField
                // I just do what Mui tells me /shrug
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...params}
                variant="standard"
                label={_.truncate(name, { length: 32, omission: '…' })}
                placeholder={_.truncate(name, { length: 27, omission: '…' })}
              />
            )}
            onChange={(_event, value) => {
              if (_.isEmpty(value)) {
                setFilter(_.omit(filter, name));
                return;
              }

              setFilter({
                ...filter,
                [name]: value,
              });
            }}
          />
        ))}
      </div>
    </div>
  );
};

Filters.propTypes = {
  hosts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      ip: PropTypes.string,
      name: PropTypes.string,
      tags: PropTypes.arrayOf(
        PropTypes.shape({
          Key: PropTypes.string,
          Value: PropTypes.string,
        })
      ),
      hidden: PropTypes.bool,
    })
  ).isRequired,
  getHosts: PropTypes.func.isRequired,
  setHosts: PropTypes.func.isRequired,
};

export default Filters;
