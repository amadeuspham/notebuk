# notebuk
A simple, cross-platform note-taking and reminder app created using React Native.

## Table of Contents
- [Getting Started](#getting-started)
  - [Requirements](#requirements)
- [Development](#development)
  - [Install Dependencies](#install-dependencies)
  - [Network Configuration](#network-configuration)
  - [Running the Project](#running-the-project)
  - [Debugging](#debugging)
- [Troubleshooting](#troubleshooting)

## Getting Started
```bash
git clone https://github.com/vormium/notebuk.git
cd notebuk
```

### Requirements
Instructions for setting up your development workstation and phone.

##### Workstation
Mac `OSX`:
- Install [node](https://nodejs.org/en/) `v6`+
  - npm `v3`+

- Install [yarn](https://yarnpkg.com/lang/en/docs/migrating-from-npm/) for package management
```bash
npm install -g yarn
```

- [Xcode](https://itunes.apple.com/us/app/xcode/id497799835?mt=12)
  - `Xcode` command line tools
```bash
xcode-select --install
```

#### Phone
[`CRNA`](https://github.com/react-community/create-react-native-app)'s development environment uses a client app called `Expo Client` for live-reloading in development.

Go to the App Store on your iOS or Andriod device, and install the Expo Client app ([iOS](https://itunes.apple.com/us/app/expo-client/id982107779), [Andriod](https://play.google.com/store/apps/details?id=host.exp.exponent)).

## Development
Run the project on your workstation and preview app on your phone or in Simulator.

### Install dependencies
This will create a `node_modules` folder in your application's root directory and a [lock file](https://yarnpkg.com/lang/en/docs/yarn-lock/).
```bash
yarn install
```

### Network configuration
If you are running the project on your iOS device, **both the device and your workstation must be on the same network**! See the Troubleshooting section below if you are experiencing issues.

### Running the project
```bash
exp start
```
To view the app on your phone:
```
1. Open Expo Client on phone
2. Scan QR code presented in terminal
3. Code
```

Alternatively, you can run the app in the Simulator on your macOS workstation, e.g:
```bash
yarn run ios
```

Some screenshots of the application on iOS Simulator:

![Notes list](https://github.com/vormium/notebuk/blob/master/screenshots/notes%20list.png?raw=true) ![Notes list](https://github.com/vormium/notebuk/blob/master/screenshots/notes%20list.png?raw=true)

### Debugging
Anything written to the console should print in the terminal. 