import { tmpdir, platform, release } from 'os';
import { promises as fs } from 'fs';
import { join } from 'path';
import { rng } from 'crypto';
import { execFile, spawn } from 'child_process';

const tmp = fs.readdir(tmpdir()).then(async (folders) => {
  // clean up old directories if any exist
  await Promise.all(
    folders
      .filter((x) => x.startsWith('cloudrdp-'))
      .map((x) => fs.rmdir(join(tmpdir(), x), { recursive: true }))
  );

  return fs.mkdtemp(join(tmpdir(), 'cloudrdp-'));
});

// fixup WSL path to something mstsc can live with
export const wslpath = (path) =>
  new Promise((resolve, reject) => {
    execFile('wslpath', ['-w', path], (error, stdout, stderr) => {
      if (error) return reject(error);
      if (stderr) return reject(stderr);
      return resolve(stdout.trim());
    });
  });

// We could probably do this a lot more efficiently but I'd rather not mess
// with gyp or ffi and this doesn't need to be super performant as not much
// passes through it.
export const protectPassword = (password) =>
  new Promise((resolve, reject) => {
    const script = `Add-Type -AssemblyName System.Security
$pb = [system.Text.Encoding]::Unicode.GetBytes('${password}')
$ps = [System.Security.Cryptography.DataProtectionScope]::CurrentUser
([System.Security.Cryptography.ProtectedData]::Protect($pb, $null, $ps) | %  { "{0:x2}" -f $_ }) -join ''`;
    execFile('powershell.exe', [script], (error, stdout, stderr) => {
      if (error) return reject(error);
      if (stderr) return reject(stderr);
      return resolve(stdout.trim());
    });
  });

export const mstscConnector = async (
  username,
  password,
  ipAddress,
  setStatus
) => {
  setStatus('generating connection config...');
  // package up password such that it appeases the RDP file format. We have to
  // use DPAPI because it holds some key we don't get access to that lets this
  // machine decrypt the password. So even if we knew how it encrypts the data
  // we give it, DPAPI would be unable to decrypt it later.
  const passwordEncrypted = await protectPassword(password);

  const rdpPath = join(await tmp, `${rng(4).toString('hex')}.rdp`);

  // drop RDP config
  await fs.writeFile(
    rdpPath,
    `auto connect:i:1
full address:s:${ipAddress}
username:s:${username}
password 51:b:${passwordEncrypted}`
  );

  // spawn mstsc
  try {
    // fixup the path if we're under WSL
    const runPath =
      platform() === 'linux' && release().includes('microsoft')
        ? await wslpath(rdpPath)
        : rdpPath;

    setStatus('connecting...');
    spawn('mstsc.exe', [runPath]);
  } catch (error) {
    console.error('mstsc spawn error', error);
  }
};

export default mstscConnector;
