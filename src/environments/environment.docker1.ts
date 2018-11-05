declare const require: any;

export const environment = {
  production: false,
  releasesUrl: 'https://api.github.com/repos/dtr-org/unit-e-desktop/releases/latest',
  version: require('../../package.json').version,
  envName: 'docker1',
  uniteHost: 'localhost',
  unitePort: 52935
};
