import { execSync } from "child_process";
import fs from "fs";
import * as Jimp from "jimp";
import yaml from "js-yaml";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import modalsConfig from './demo-components/src/modals.config.json' assert { type: 'json' };
import { Logger } from "./utils.js";

// Constants
const SCREENSHOTS_PATH = './e2e/screenshots/';
const EXPECTED_SCREENSHOTS_PATH = './e2e/expected-screenshots/';
const GENERATED_FLOW_NAME = "generated_flow.yaml";

// Initialize logger
const logger = new Logger();
logger.isVerbose = true;

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
  .option('project', {
    demandOption: true,
    describe: 'Path to the React Native project',
    type: 'string',
  })
  .option('device', {
    describe: 'Run the project on a specific device',
    type: 'string',
  })
  .option('platform', {
    demandOption: true,
    describe: 'Specify the platform for the build',
    type: 'string',
    choices: ['ios', 'android'],
  })
  .option('architecture', {
    demandOption: true,
    alias: 'arch',
    describe: 'Specify the architecture for the build',
    choices: ['new', 'old'],
    default: 'new'
  })
  .option('run-steps', {
    alias: 'steps',
    describe: 'Run specific steps in the E2E process',
    type: 'array',
    choices: ['generation', 'tests', 'images'],
    default: ['generation', 'tests', 'images']
  })
  .option('update-screenshots', {
    alias: 'u',
    describe: 'Update the expected screenshots with the current ones',
    type: 'boolean',
    default: false
  })
  .option('silent', {
    alias: 's',
    describe: 'Enable silent output',
    type: 'boolean',
    default: false
  })
  .help()
  .alias('help', 'h')
  .parse();

  
// Setup project variables
const { project, platform, runSteps, architecture, silent, updateScreenshots, device: specificDevice } = argv;

logger.isVerbose = !silent;

const projectName = path.basename(project);
const appId = `com.modals.${projectName}`;
const generatedFlowPath = path.join(process.cwd(), 'e2e', 'flows', GENERATED_FLOW_NAME);
const baseFlowPath = path.join(process.cwd(), 'e2e', 'flows', 'base.yaml');

const getBootedDevice = () => {
  if (platform === 'ios') {
    if (specificDevice) {
      return specificDevice
    }

    const devices = execSync('xcrun simctl list devices booted', { encoding: 'utf8' });
    const bootedDevice = devices.match(/\(([A-F0-9\-]+)\)\s+\(Booted\)/);
    return bootedDevice ? bootedDevice[1] : null;
  } else if (platform === 'android') {
    const devices = execSync('adb devices', { encoding: 'utf8' });
    const bootedDevice = devices.match(/(emulator-\d+)\s+device/);
    return bootedDevice ? bootedDevice[1] : null;
  }
}

const device = getBootedDevice();

// Generate flow configurations for E2E tests
const generateFlowConfigs = () => {
  const flowConfigs = [];
  
  modalsConfig.modals.forEach(modalConfig => {
    modalConfig.e2e.scenarios.forEach(scenario => {
      const testFileName = `${scenario}.yaml`;
      
      const flowConfig = {
        runFlow: {
          file: testFileName,
          env: {
            APP_ID: appId,
            MODAL_ID: modalConfig.id,
            SCREENSHOTS_PATH,
            DEVICE: device,
            ARCHITECTURE: architecture
          }
        }
      };
      
      flowConfigs.push(flowConfig);
    });
  });
  
  return flowConfigs;
};

// Generate the combined flow file
const generateFlow = () => {
  const baseFlowString = execSync(`cat ${baseFlowPath}`, { encoding: 'utf8' });
  const generatedFlowContent = `${baseFlowString}\n${yaml.dump(generateFlowConfigs(), { indent: 2 })}`;
  
  fs.mkdirSync(path.dirname(generatedFlowPath), { recursive: true });
  fs.writeFileSync(generatedFlowPath, generatedFlowContent, { encoding: 'utf8' });
};

// Run E2E tests using Maestro
const runE2ETests = () => {
  logger.log(`Running E2E tests for project: ${projectName} on device: ${device}`);
  
  try {
    execSync(`maestro --device ${device} test ${generatedFlowPath} -e APP_ID=${appId}`, { stdio: 'inherit' });
    logger.log('E2E tests completed successfully.');
  } catch (error) {
    logger.raiseException('E2E tests failed:', error.message);
  }
};

// Compare two images with extremely strict criteria
const compareImages = async (actualPath, expectedPath, imageName) => {
  try {
    const actualImage = await Jimp.Jimp.read(actualPath);
    const expectedImage = await Jimp.Jimp.read(expectedPath);
    
    const distance = Jimp.distance(actualImage, expectedImage);
    const pixelDiff = Jimp.diff(actualImage, expectedImage);
    
    // Use provided strictness: match if distance <= 0.015625 and diff <= 0.0397%
    const isMatch = distance <= 0.02 && pixelDiff.percent <= 0.001;
    
    if (isMatch) {
      logger.log(`✅ Screenshot ${imageName} matches expected (distance: ${distance.toFixed(6)}, diff: ${(pixelDiff.percent * 100).toFixed(4)}%)`);
    } else {
      logger.raiseException(`❌ Screenshot ${imageName} does not match expected (distance: ${distance.toFixed(6)}, diff: ${(pixelDiff.percent * 100).toFixed(4)}%)`);
    }
    
    return isMatch;
  } catch (error) {
    logger.raiseException(`❌ Error comparing images for ${imageName}:`, error.message);
    return false;
  }
};

// Compare all screenshots with their expected versions
const runImageComparison = async () => {
  if (updateScreenshots) {
    // Move screenshots to expected-screenshots
    logger.log('Updating expected screenshots...');
    fs.mkdirSync(EXPECTED_SCREENSHOTS_PATH, { recursive: true });
    const screenshots = fs.readdirSync(SCREENSHOTS_PATH);
    screenshots.forEach(screenshot => {
      const src = path.join(SCREENSHOTS_PATH, screenshot);
      const dest = path.join(EXPECTED_SCREENSHOTS_PATH, screenshot);
      fs.copyFileSync(src, dest);
    });
    logger.log('Screenshots copied to expected-screenshots.');
    return;
  }

  const screenshots = fs.readdirSync(SCREENSHOTS_PATH);
  let allMatched = true;
  
  for (const screenshot of screenshots) {
    const expectedScreenshotPath = path.join(EXPECTED_SCREENSHOTS_PATH, screenshot);
    const actualScreenshotPath = path.join(SCREENSHOTS_PATH, screenshot);

    if (fs.existsSync(expectedScreenshotPath)) {
      const matched = await compareImages(actualScreenshotPath, expectedScreenshotPath, screenshot);
      if (!matched) allMatched = false;
    } else {
      console.warn(`⚠️  Expected screenshot ${screenshot} not found.`);
      allMatched = false;
    }
  }
  
  if (allMatched) {
    logger.log('\n🎉 All screenshots match the expected results!');
  } else {
    logger.log('\n❌ Some screenshots do not match the expected results.');
    process.exit(1);
  }
};

const cleanScreenshots = () => {
  if (fs.existsSync(SCREENSHOTS_PATH)) {
    fs.rmSync(SCREENSHOTS_PATH, { recursive: true, force: true });
    logger.log('Cleaned up screenshots folder.');
  }
};

// Main execution
cleanScreenshots();

if (runSteps.includes('generation')) {
  generateFlow();
}
if (runSteps.includes('tests')) {
  runE2ETests();
}
if (runSteps.includes('images')) {
  runImageComparison();
}