[![Build Status][github-actions-status]][github-actions-url]
[![Dependency Status][david-image]][david-url]
[![DevDependency Status][david-dev-image]][david-dev-url]
[![Github Tag][github-tag-image]][github-tag-url]

## Install

- **If you have installation or compilation issues with this project, please see [our debugging guide](https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/400)**

First, clone the repo via git and install dependencies:

```bash
git clone --depth 1 --single-branch https://github.com/liath/cloudrdp
cd cloudrdp
yarn
```

## Starting Development

Start the app in the `dev` environment:

```bash
yarn start
```

## Packaging for Production

To package apps for the local platform:

```bash
yarn package
```

## Docs
This is the bare minimum to actually do what I set out to do. The app currently is not very configurable, so you'll need to upload the keypairs for your EC2 instances to SSM ParameterStore for anything to work. Something like this should work:
```bash
aws ssm put-parameter --type SecureString --name '/cloudrdp/keys/ec2-key' --value file://~/.ssh/ec2-key.pem
```
Outside of gettings the keys where they ought to be, everything should just work. :)

## Donations
### If you feel compelled to donate, it should probably be to the [electron-react-boilerplate folks](https://opencollective.com/electron-react-boilerplate-594)

