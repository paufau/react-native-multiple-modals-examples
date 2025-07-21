import { execSync } from 'child_process';
import { Logger } from './utils.js';

const logger = new Logger();

const setupPods = ({ project, architecture }) => {
  logger.log(`Setting up Pods for iOS project at ${project}...`);
  try {
    execSync(`cd ${project}/ios && RCT_NEW_ARCH_ENABLED=${architecture === 'new' ? 1 : 0} pod install`, { stdio: 'inherit' });
    logger.log('Pods setup completed successfully.');
  } catch (error) {
    logger.raiseException(`Failed to set up Pods: ${error.message}`);
  }
}

const setupProject = ({ project }) => {
  logger.log(`Setting up project at ${project}...`);
  try {
    execSync(`cd ${project} && yarn install`, { stdio: 'inherit' });
    logger.log('Project setup completed successfully.');
  } catch (error) {
    logger.raiseException(`Failed to set up project: ${error.message}`);
  }
}

const launchIOSSimulator = ({ device, project }) => {
  logger.log(`Launching iOS simulator for device: ${device}`);
  try {
    execSync(`open -a Simulator`)
    // execSync(`cd ${project}/ios && xcrun simctl boot "${device}"`, { stdio: 'inherit' });
    logger.log('iOS simulator launched successfully.');
  } catch (error) {
    logger.raiseException(`Failed to launch iOS simulator: ${error.message}`);
  }
}

const installApp = ({ project, device }) => {
  logger.log(`Installing app at ${project}...`);
  try {
    execSync([
      `cd ${project} && npx react-native run-ios --extra-params="-allowProvisioningUpdates"`,
      device ? `--udid=${device}` : ''
    ].filter(Boolean).join(' '), { stdio: 'inherit' });
    logger.log('App installed successfully.');
  } catch (error) {
    logger.raiseException(`Failed to install app: ${error.message}`);
  }
}

export const runIOS = ({ project, device, architecture, verbose, skipSetup }) => {
  logger.isVerbose = verbose;

  logger.log(`Running iOS project at ${project} on device ${device} with architecture ${architecture}`);
  try {
    if (!skipSetup) {
      setupProject({ project });
    }
    setupPods({ project, architecture });

    if (device) {
      launchIOSSimulator({ project, device });
    }
    installApp({ project, device });
  } catch (error) {
    logger.raiseException(`Failed to install iOS app: ${error.message}`);
  }
}