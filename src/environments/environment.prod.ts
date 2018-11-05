declare const require: any;

export const environment = {
  production: true,
  version: require('../../package.json').version,
  releasesUrl: 'https://api.github.com/repos/dtr-org/unit-e-desktop/releases/latest',
  envName: 'prod',
  uniteHost: 'localhost',
  unitePort: 8332
};
