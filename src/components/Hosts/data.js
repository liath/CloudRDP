import _ from 'lodash';
import aws from 'aws-sdk';
import crypto from 'crypto';

// ask node land for whatever config aws-sdk resolved there.
const { ipcRenderer } = window.require('electron');
aws.config.update(ipcRenderer.sendSync('aws-bootstrap'));

let ec2 = new aws.EC2();
let ssm = new aws.SSM();

export const regionUpdated = (region) => {
  aws.config.update({ region });
  ec2 = new aws.EC2();
  ssm = new aws.SSM();
};

// recursively fetches pages of instances
export const getHosts = async (token = false) => {
  try {
    const resp = await ec2
      .describeInstances({
        Filters: [
          {
            Name: 'platform',
            Values: ['windows'],
          },
          {
            Name: 'instance-state-name',
            Values: ['running'],
          },
        ],
        ...(token && {
          NextToken: token,
        }),
      })
      .promise();
    console.log('[Hosts] EC2/DescribeInstances resp:', resp);

    const instances = _.flatMap(resp.Reservations, 'Instances').map((i) => {
      const name = i.Tags.find((t) => t.Key === 'Name');

      return {
        id: i.InstanceId,
        ip: i.PrivateIpAddress,
        name: name ? name.Value : '',
        keyName: i.KeyName,
        tags: i.Tags,
      };
    });

    if (resp.NextToken) {
      return instances.concat(await getHosts(resp.NextToken));
    }
    return instances;
  } catch (error) {
    console.error('[Hosts] EC2/DescribeInstances failed:', error);
    return [];
  }
};

export const connectHost = async (host, ssmPrefix, setStatus) => {
  setStatus('retrieving password from EC2...');

  let encryptedPasswordBase64 = '';
  try {
    const resp = await ec2
      .getPasswordData({
        InstanceId: host.id,
      })
      .promise();
    console.log('[Hosts] EC2/GetPasswordData resp:', resp);

    if (_.isEmpty(resp.PasswordData)) return 'No password in EC2';

    encryptedPasswordBase64 = resp.PasswordData;
  } catch (error) {
    console.log('[Hosts] EC2/GetPasswordData error:', error);
    throw error;
  }

  // TODO: this should probably also be pluggable,
  setStatus('retrieving key from SSM...');
  const path = `${ssmPrefix}/keys/${host.keyName}`;
  let privateKey = '';
  try {
    const resp = await ssm
      .getParameter({
        Name: path,
        WithDecryption: true,
      })
      .promise();
    console.log('[Hosts] SSM/GetParameter resp:', resp);

    privateKey = resp.Parameter.Value;
  } catch (error) {
    if (error.code === 'ParameterNotFound')
      return `Key not found in SSM. [key] ${host.keyName} [path] ${path}`;

    console.log('[Hosts] SSM/GetParameter error:', error);
    throw error;
  }

  setStatus('decrypting password...');
  let password = '';
  try {
    password = crypto
      .privateDecrypt(
        { key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING },
        Buffer.from(encryptedPasswordBase64, 'base64')
      )
      .toString('utf-8');
  } catch (error) {
    console.error('[Hosts] password decryption failed:', error);
    return 'password decryption failed';
  }

  setStatus('launching connector...');
  // TODO: dynamic import whatever RDP client and probably allow choosing how
  // to connect in settings. Setup now cause I'd like to at least do remmina
  // support at some point.
  const { default: connector } = await import('./connector-mstsc');

  // EC2 stored password is always for Administrator afaik
  return connector('Administrator', password, host.ip, setStatus);
};
