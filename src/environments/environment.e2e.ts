declare const require: any;

export const environment = {
  production: false,
  version: require('../../package.json').version,
  releasesUrl: 'https://api.github.com/repos/dtr-org/unit-e-desktop/releases/latest',
  envName: 'regtest',
  uniteHost: 'localhost',
  unitePort: 18440
};
