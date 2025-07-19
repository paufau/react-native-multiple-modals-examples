# Example App for React Native Multiple Modals

## Project Structure

- 'demo-components' - Contains all the modals
- 'e2e' - Contains end to end test cases
- 'rnXX' - Projects

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

## Manual Setup

1. Clone `react-native-multiple-modals` to the root folder so you have this repo at the same level
1. `cd` to a preferred project (Eg. `cd rn80`)
1. Install Node Modules `yarn install`
1. Install CocoaPods `pod install --project-directory=ios`
1. Run the app:
   1. Android: `yarn android`
   1. iOS: `yarn ios`

## How to run test

Prefer using `yarn e2e:matrix`. It will run all possible test scenarios for you

#### Updating test snapshots

`yarn e2e:matrix -u`

## Examples inside

See `/demo-components/src/modals`
