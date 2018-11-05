# unit-e-desktop – UI

![UI Preview](preview.png)

> *"UnitE is an open source project that aims to provide a lean way to make payments on the internet."*

This repository is the user interface that works in combination with our [`unite-core`](https://github.com/drt-org/unit-e).

[Download the packaged wallet for Mac, Windows and Linux](https://github.com/dtr-org/unit-e-desktop/releases)

# Contribute

> Be sure to read our [Contributing Guidelines](CONTRIBUTING.md) first

## Development

### Boostrapping for development:

* Download + Install [Node.js®](https://nodejs.org/) 6.4—7.10
* Download + Install [git](https://git-scm.com/)

```bash
git clone https://github.com/dtr-org/unit-e-desktop
cd unit-e-desktop
yarn install
```

### Development with Electron

1. `git submodule init` (needed only for the first time setup)
2. `git submodule update` (needed only for the first time setup)
3. run `ng serve` to start the dev server and keep it running
4. in a 2nd terminal, run `yarn run start:electron:dev -testnet -opendevtools` to start the electron application. Daemon will be updated and launched automatically.
   * note: this command will auto-refresh the client on each saved change
   * `-testnet` – for running on testnet (omit this argument for running the client on mainnet)
   * `-opendevtools` – automatically opens Developer Tools on client launch

#### Interact with unite-core daemon

You can directly interact with the daemon ran by the Electron version.

```
./unite-cli -testnet getblockchaininfo
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