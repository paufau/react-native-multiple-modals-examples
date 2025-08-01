import { execSync } from 'child_process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const { updateScreenshots, steps, platform } = yargs(hideBin(process.argv))
  .option('update-screenshots', {
    alias: 'u',
    describe: 'Update the expected screenshots with the current ones',
    type: 'boolean',
    default: false
  })
  .option('steps', {
    alias: 's',
    describe: 'Run specific steps in the E2E process',
    type: 'array',
    choices: ['setup', 'tests'],
    default: ['setup', 'tests']
  })
  .option('platform', {
    alias: 'p',
    describe: 'Specify the platform to run tests on',
    type: 'string',
    choices: ['android', 'ios'],
  })
  .help()
  .alias('help', 'h')
  .parse();

// TODO better device mapping
const testCases = [
  // New arch
  // RN 80
  {
    project: 'rn80',
    device: 'Pixel_9_Pro',
    platform: 'android',
    architecture: 'new'
  },
  {
    project: 'rn80',
    device: '313E0F09-0488-40BE-B902-E29B09229A22',
    platform: 'ios',
    architecture: 'new'
  },
  // RN 78
  {
    project: 'rn78',
    device: 'Pixel_9_Pro',
    platform: 'android',
    architecture: 'new'
  },
  {
    project: 'rn78',
    device: '313E0F09-0488-40BE-B902-E29B09229A22',
    platform: 'ios',
    architecture: 'new'
  },
  // Old arch
  // RN 80
  {
    project: 'rn80',
    device: '313E0F09-0488-40BE-B902-E29B09229A22',
    platform: 'ios',
    architecture: 'old'
  },
  {
    project: 'rn80',
    device: 'Pixel_9_Pro',
    platform: 'android',
    architecture: 'old'
  },
  // RN 78
  {
    project: 'rn78',
    device: '313E0F09-0488-40BE-B902-E29B09229A22',
    platform: 'ios',
    architecture: 'old'
  },
  {
    project: 'rn78',
    device: 'Pixel_9_Pro',
    platform: 'android',
    architecture: 'old'
  }
]

const stopMetroServer = () => {
  try {
    // Check if Metro server is running
    execSync('pgrep -f "cli.js start"', { stdio: 'ignore' });
    
    // If we reach here, Metro is running, so stop it
    execSync('pkill -f "cli.js start"', { stdio: 'ignore' });
    console.log('Metro server stopped successfully.');
  } catch (error) {
    // If pgrep fails, Metro is not running
    if (error.status === 1) {
      console.log('Metro server is not running.');
    } else {
      console.error('Failed to stop Metro server:', error.message);
    }
  }
};

const cases = testCases.filter(testCase => {
  if (platform) {
    return testCase.platform === platform;
  }
  return true;
});

cases.forEach(({ project, device, platform, architecture }) => {
  console.log(`Running tests for project: ${project}, device: ${device}, platform: ${platform}, architecture: ${architecture}`);

  stopMetroServer();
  
  if (steps.includes('setup')) {
    console.log('Setting up project...');
    execSync(`yarn project:run --platform=${platform} --project=${project} --device=${device} --arch=${architecture}`, { stdio: 'inherit' });
  } else {
    console.log('Skipping project setup.');
    // Spawn Metro server in a separate terminal
    execSync(`osascript -e 'tell application "Terminal" to do script "cd ${process.cwd()} && cd ${project} && yarn start"'`);
  }

  if (steps.includes('tests')) {
    console.log(`Running E2E tests for project: ${project} on device: ${device}`);
    execSync(`yarn e2e:run --architecture=${architecture} --device=${device} --project=${project} --platform=${platform} --update-screenshots=${updateScreenshots}`, { stdio: 'inherit' });
  }
});