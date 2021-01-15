import _ from 'lodash';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TableContainer from '@material-ui/core/TableContainer';
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import Filters from '../Filters';

import { connectHost, getHosts, regionUpdated } from './data';

const ipValue = _.memoize((ip) =>
  Buffer.from(ip.split('.').map((o) => parseInt(o, 10)))
);

const columnDefinitions = [
  { field: 'id', headerName: 'InstanceID', width: 175 },
  {
    field: 'ip',
    headerName: 'IP Address',
    width: 175,
    sortComparator: (a, b) => Buffer.compare(ipValue(a), ipValue(b)),
  },
  { field: 'name', headerName: 'Name', flex: 0.5 },
  { field: 'status', headerName: 'Status', flex: 0.5 },
];

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiDataGrid-cell:focus': {
      outline: 'none',
    },
    '& .MuiDataGrid-window': {
      overflowX: 'hidden',
    },
  },
}));

const Hosts = ({ region, ssmPrefix }) => {
  const [hosts, setHosts] = useState([]);

  // when the AWS region changes, refresh hosts
  useEffect(() => {
    regionUpdated(region);
    getHosts()
      .then(setHosts)
      .catch(() => {
        // display a message or something
      });
  }, [region]);

  const classes = useStyles();

  return (
    <div style={{ display: 'flex' }}>
      <TableContainer style={{ height: '100vh' }}>
        <DataGrid
          className={classes.root}
          columns={columnDefinitions}
          rows={hosts.filter((x) => !x.hidden)}
          hideFooterSelectedRowCount
          onSelectionChange={(event) => {
            const id = event.rowIds[0];
            const host = hosts.find((x) => x.id === id);
            const setStatus = (status) => {
              setHosts(hosts.map((x) => (x.id === id ? { ...x, status } : x)));
            };
            connectHost(host, ssmPrefix, setStatus)
              .then(setStatus)
              .catch((error) => {
                console.log('uncaught error???', error);
              });
          }}
        />
      </TableContainer>
      <Filters hosts={hosts} setHosts={setHosts} getHosts={getHosts} />
    </div>
  );
};

Hosts.propTypes = {
  region: PropTypes.string.isRequired,
  ssmPrefix: PropTypes.string.isRequired,
};

export default Hosts;
