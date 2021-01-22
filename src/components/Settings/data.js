import _ from 'lodash';
import aws from 'aws-sdk';

// ask node land for whatever config aws-sdk resolved there.
const { ipcRenderer } = window.require('electron');

aws.config.update(ipcRenderer.sendSync('aws-bootstrap'));

let ec2 = new aws.EC2();

export const regionUpdated = (region) => {
  aws.config.update({ region });
  ec2 = new aws.EC2();
};

export const getRegions = async () => {
  try {
    const resp = await ec2.describeRegions({}).promise();
    console.log('[Settings] EC2/DescribeRegions resp:', resp);

    return _.flatMap(resp.Regions, 'RegionName');
  } catch (error) {
    console.error('[Hosts] EC2/DescribeInstances failed:', error);
    return [];
  }
};
