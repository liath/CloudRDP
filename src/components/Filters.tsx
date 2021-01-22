import _ from 'lodash';

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import RefreshIcon from '@material-ui/icons/Refresh';
import SettingsIcon from '@material-ui/icons/Settings';
import Tooltip from '@material-ui/core/Tooltip';

import * as host from './Hosts/host';

interface TagFilter {
  [key: string]: string[];
}

const parseHosts = (hosts: host.Host[]) =>
  _.chain(hosts)
    .filter((x) => !x.hidden)
    .flatMap('tags')
    .reduce((s: TagFilter, x: host.Tag) => {
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
      height: `calc(100vh - ${36 + theme.spacing(3)}px)`,
      overflowY: 'auto',
      overflowX: 'hidden',
      '& > * + *': {
        marginTop: theme.spacing(3),
      },
    },
    '& > #toolbar': {
      display: 'flex',
      paddingLeft: theme.spacing(1),
      color: theme.palette.text.secondary,
      paddingTop: 0,
      height: '56px',
      '& > h6': {
        flexGrow: 1,
        paddingTop: theme.spacing(1),
      },
      '& > button, & > a': {
        marginRight: theme.spacing(1),
        marginTop: 2,
      },
    },
  },
}));

const Filters = ({
  hosts,
  getHosts,
  setHosts,
}: {
  hosts: host.Host[];
  getHosts: () => Promise<host.Host[]>;
  setHosts: React.Dispatch<React.SetStateAction<host.Host[]>>;
}) => {
  // the actual filter settings
  const [filter, setFilter] = useState<TagFilter>({});
  // and the available filters for the UI
  const [tagFilters, setTagFilters] = useState<[string, string[]][]>([]);
  // facilitates clearing autocompletes
  const [reset, clearForm] = useState(true);

  // update list of available tags to filter when hosts or filter settings change
  useEffect(() => setTagFilters(parseHosts(hosts)), [hosts, filter]);

  // mark filtered hosts as hidden
  const updateFilter = (newFilter: TagFilter) => {
    setFilter(newFilter);
    const resetHosts = hosts.map((x) => ({ ...x, hidden: false }));

    // show everything when no filters are applied
    if (_.isEmpty(newFilter)) {
      setHosts(resetHosts);
      return;
    }

    const newHosts = _.entries(newFilter).reduce((keep, tag) => {
      const [name, values] = tag;

      return keep.map((h) => {
        if (h.hidden) return h;

        const t = h.tags.find((x) => x.Key === name);
        // hide the host if it doesn't have the target tag or the tag's value
        // isn't in the filter
        return {
          ...h,
          hidden: !t || _.isEmpty(t) || !values.includes(t.Value),
        };
      });
    }, resetHosts);

    setHosts(newHosts);
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div id="toolbar">
        <Typography variant="h6" id="tableTitle">
          Filters
        </Typography>
        {!_.isEmpty(filter) && (
          <Tooltip title="Clear Filters">
            <Fab
              color="primary"
              aria-label="clear-filters"
              onClick={() => {
                clearForm(!reset);
                updateFilter({});
              }}
            >
              <ClearAllIcon />
            </Fab>
          </Tooltip>
        )}
        <Tooltip title="Reload">
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
        <Tooltip title="Settings">
          <Link to="/settings">
            <Fab color="secondary" aria-label="settings">
              <SettingsIcon />
            </Fab>
          </Link>
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
                updateFilter(_.omit(filter, name));
                return;
              }

              updateFilter({
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
    PropTypes.exact({
      id: PropTypes.string,
      ip: PropTypes.string,
      name: PropTypes.string,
      keyName: PropTypes.string,
      tags: PropTypes.arrayOf(
        PropTypes.exact({
          Key: PropTypes.string,
          Value: PropTypes.string,
        })
      ),
      hidden: PropTypes.bool,
      status: PropTypes.string,
    })
  ).isRequired,
  getHosts: PropTypes.func.isRequired,
  setHosts: PropTypes.func.isRequired,
};

export default Filters;
