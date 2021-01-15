import { ipcMain } from 'electron';
import aws from 'aws-sdk';

// if we load the SDK on the node side it looks up creds for us, check inside
// aws-sdk/node_loader.js for more.
export const awsBootstrap = (event) => {
  // get local config
  event.returnValue = {
    accessKeyId: aws.config.credentials.accessKeyId,
    secretAccessKey: aws.config.credentials.secretAccessKey,
    sessionToken: aws.config.credentials.sessionToken || null,
    region: aws.config.region,
  };
};
ipcMain.on('aws-bootstrap', awsBootstrap);

export default awsBootstrap;
