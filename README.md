# unit-e-desktop – UI

![UI Preview](preview.png)

> *"UnitE is an open source project that aims to provide a lean way to make payments on the internet."*

This repository is the user interface that works in combination with our [`unite-core`](https://github.com/drt-org/unit-e).

[Download the packaged wallet for Mac, Windows and Linux](https://github.com/dtr-org/unit-e-desktop/releases)

## Code of conduct

The UnitE team is committed to fostering a welcoming and harassment-free
environment. All participants are expected to adhere to our [code of
conduct](CODE_OF_CONDUCT.md).

## Contribute

> Be sure to read our [Contributing Guidelines](CONTRIBUTING.md) first

## Development

### Boostrapping for development:

* Download + Install [Node.js®](https://nodejs.org/) 6.4—7.10
* Download + Install [git](https://git-scm.com/)

*Note: On MacOS you will need to have the full Xcode installed in order to
build all dependencies.*

```bash
git clone https://github.com/dtr-org/unit-e-desktop
cd unit-e-desktop
yarn install
```

### Development with Electron

1. run `ng serve --env=regtest` to start the dev server and keep it running
2. in a 2nd terminal, run `yarn run start:electron:dev -regtest -devtools` to
   start the electron application. Daemon will be updated and launched
   automatically.
   * note: this command will auto-refresh the client on each saved change
   * `-regtest` – for running in a local testing environment
   * `-devtools` – automatically opens Developer Tools on client launch


### Running the unit tests

Run the unit tests with

```
ng test
```

This will open a browser window where the tests are running and show progress on
the command line. Keep the window open to continuously run the unit tests when
changing the code.

### Interact with Unit-e daemon

You need to start a Unit-e daemon so the UI can talk to it.

```
./united -regtest
```

You can directly interact with the daemon.

```
./unite-cli -regtest getblockchaininfo
```

## Running

### Start Electron

* `yarn run start:electron:fast` – disables debug messages for faster startup (keep in mind using `:fast` disables auto-reload of app on code change)

### Package Electron

Building for Windows requires the 32-bit libraries to be available.
```
sudo apt-get install gcc-multilib
sudo apt-get install g++-multilib
```

* `yarn run package:win` – Windows
* `yarn run package:mac` – OSX
* `yarn run package:linux` – Linux

## Contributors

Join us in `#unite-core-dev` on FreeNode or on our developer [mailing list](https://lists.linuxfoundation.org/mailman/listinfo/unite-dev).

## Copyright

Copyright (C) 2018 UnitE Maintainers.

Portions copyright (C) 2017-2018 Particl Maintainers.

The code in this repository is licensed under the [GPL](LICENSE).
