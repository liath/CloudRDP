import _ from 'lodash';

import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';
import TableContainer from '@material-ui/core/TableContainer';
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';

import * as host from './host';
import Filters from '../Filters';

import { connectHost, getHosts, regionUpdated } from './data';

const ipValue = _.memoize((ip) =>
  Buffer.from(ip.split('.').map((o: string) => parseInt(o, 10)))
);

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

const Hosts = ({
  region,
  ssmPrefix,
}: {
  region: string;
  ssmPrefix: string;
}) => {
  const [hosts, setHosts] = useState<host.Host[]>([]);

  // when the AWS region changes, refresh hosts
  useEffect(() => {
    regionUpdated(region);
    getHosts()
      .then(setHosts)
      .catch(() => {
        // display a message or something
      });
  }, [region]);

  // hopefully altogether this makes status updates serial
  const [mutex, setMutex] = useState(true);
  const updateStatus = useCallback(
    (id, s) =>
      setHosts(hosts.map((x) => (x.id === id ? { ...x, status: s || '' } : x))),
    [hosts]
  );

  const classes = useStyles();
  return (
    <div>
      <div style={{ height: 4 }}>
        <LinearProgress style={{ display: mutex ? 'none' : 'block' }} />
      </div>
      <div style={{ display: 'flex' }}>
        <TableContainer style={{ height: '100vh' }}>
          <DataGrid
            className={classes.root}
            columns={[
              { field: 'id', headerName: 'InstanceID', width: 175 },
              {
                field: 'ip',
                headerName: 'IP Address',
                width: 175,
                sortComparator: (a, b) =>
                  Buffer.compare(ipValue(a), ipValue(b)),
              },
              { field: 'name', headerName: 'Name', flex: 0.5 },
              { field: 'status', headerName: 'Status', flex: 0.5 },
            ]}
            rows={hosts.filter((x) => !x.hidden)}
            hideFooterSelectedRowCount
            onSelectionChange={(event) => {
              if (!mutex) return null;
              setMutex(false);

              const id = event.rowIds[0];
              const target = hosts.find((x) => x.id === id);

              const ps = (s: string | void) => updateStatus(id, s);

              return connectHost(target, ssmPrefix, ps)
                .then(ps)
                .catch((error) => {
                  console.log('uncaught error???', error);
                })
                .then(() => setMutex(true));
            }}
          />
        </TableContainer>
        <Filters hosts={hosts} setHosts={setHosts} getHosts={getHosts} />
      </div>
    </div>
  );
};

Hosts.propTypes = {
  region: PropTypes.string.isRequired,
  ssmPrefix: PropTypes.string.isRequired,
};

export default Hosts;
