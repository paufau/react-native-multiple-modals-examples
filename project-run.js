import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { runAndroid } from './project-run-android.js';
import {runIOS} from './project-run-ios.js'

// Examples

// Android
// yarn project:run --platform=android --project=rn80 --device=Pixel_9_Pro --arch=new --verbose --skip-setup

// iOS
// yarn project:run --platform=ios --project=rn80 --device=313E0F09-0488-40BE-B902-E29B09229A22 --arch=new --verbose --skip-setup

const argv = yargs(hideBin(process.argv))
  .option('platform', {
    demandOption: true,
    describe: 'Specify the platform to run the project on',
    choices: ['ios', 'android'],
  })
  .option('project', {
    demandOption: true,
    describe: 'Path to the React Native project',
    type: 'string',
  })
  .option('architecture', {
    alias: 'arch',
    describe: 'Specify the architecture for the build',
    choices: ['new', 'old'],
    default: 'new'
  })
  .option('device', {
    describe: 'Run the project on a specific device',
    type: 'string',
  })
  .option('verbose', {
    alias: 'v',
    describe: 'Enable verbose output',
    type: 'boolean',
    default: false
  })
  .option('skip-setup', {
    describe: 'Skip project setup steps',
    type: 'boolean',
    default: false
  })
  .option('fast-setup', {
    alias: 'f',
    describe: 'Use fast setup for the project',
    type: 'boolean',
    default: false
  })
  .help()
  .alias('help', 'h')
  .parse();

const { platform } = argv;

if (platform === 'android') {
  runAndroid(argv);
} else if (platform === 'ios') {
  runIOS(argv);
}