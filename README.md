# Example App for React Native Multiple Modals

### Look at `demo-components/src/modals` for implementations

---

## Project Structure

- `demo-components` - Demo app and modals
- `e2e` - E2E test cases
- `rnXX` - Projects

#### Specific files

- `demo-components/src/modals.config.js` - Crucial for setting up UI & e2e tests

## Automatic Setup

1. Clone `react-native-multiple-modals` to the root folder so you have this repo at the same level
1. Run `yarn project:run` with following arguments
   1. `--platform=` (android | ios)
   1. `--project=` (rn78 | rn80)
   1. `--arch=` (new | old)
   1. Prefer adding: `--verbose`

```sh
yarn project:run --platform=android --project=rn80 --arch=new --verbose
# or
yarn project:run --platform=ios --project=rn80 --arch=new --verbose
```

### Manual Setup

1. Clone `react-native-multiple-modals` to the root folder so you have this repo at the same level
1. `cd` to a preferred project (Eg. `cd rn80`)
1. Install Node Modules `yarn install`
1. Install CocoaPods `pod install --project-directory=ios`
1. Run the app:
   1. Android: `yarn android`
   1. iOS: `yarn ios`

## How to run Maestro tests

Prefer using `yarn e2e:matrix`. It will run all possible test scenarios for you

#### Updating test snapshots

`yarn e2e:matrix -u`

## Adding more projects & RN version

1. Use `npx @react-native-community/cli init rnXX --version XX`
2. Run `yarn project:setup rnXX`

## Examples inside

See `/demo-components/src/modals`
