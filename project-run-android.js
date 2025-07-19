import { execSync } from 'child_process';
import { Logger } from './utils.js';
import path from 'path';

const logger = new Logger();

const setArchitecture = ({architecture, project}) => {
  logger.log(`Setting architecture to ${architecture}...`);
  const gradlePropertiesPath = path.resolve(project, 'android', 'gradle.properties');

  try {
    let gradleProperties = execSync(`cat ${gradlePropertiesPath}`, { encoding: 'utf8' });
    const currentArch = gradleProperties.match(/newArchEnabled=(true|false)/)[1];
    const nextArch = architecture === 'new' ? 'true' : 'false';

    if (currentArch === nextArch) {
      logger.log(`Architecture is already set to ${architecture}.`);
      return;
    }

    if (architecture === 'new') {
      gradleProperties = gradleProperties.replace(/newArchEnabled=false/, 'newArchEnabled=true');
      logger.log('New architecture enabled.');
    } else if (architecture === 'old') {
      gradleProperties = gradleProperties.replace(/newArchEnabled=true/, 'newArchEnabled=false');
      logger.log('Old architecture enabled.');
    } else {
      logger.raiseException(`Unknown architecture: ${architecture}`);
    }

    execSync(`echo "${gradleProperties}" > ${gradlePropertiesPath}`, { stdio: 'inherit' });
    logger.log(`Architecture set to ${architecture} successfully.`);
  } catch (error) {
    logger.raiseException(`Failed to set architecture: ${error.message}`);
  }
} 

const launchAndroidEmulator = (device) => {
  logger.log(`Launching Android emulator for device: ${device}`);
  try {
    // Check if the emulator is already running
    const runningDevices = execSync(`adb devices`, { encoding: 'utf8' });
    if (runningDevices.includes('emulator-')) {
      logger.log(`An emulator is already running.`);
      return;
    }

    execSync(`emulator -avd ${device} > /dev/null 2>&1 &`);
    logger.log(`Emulator ${device} launched successfully.`);
  } catch (error) {
    logger.raiseException(`Failed to launch emulator: ${error.message}`);
  }
}

const setupProject = ({project}) => {
  logger.log(`Setting up project at ${project}...`);
  try {
    execSync(`cd ${project} && yarn install`, { stdio: 'inherit' });
    logger.log('Project setup completed successfully.');
  } catch (error) {
    logger.raiseException(`Failed to set up project: ${error.message}`);
  }
}

const installApp = ({project}) => {
  logger.log(`Installing app at ${project}...`);
  try {
    execSync(`cd ${project} && npx react-native run-android`, { stdio: 'inherit' });
    logger.log('App installed successfully.');
  } catch (error) {
    logger.raiseException(`Failed to install app: ${error.message}`);
  }
}

export const runAndroid = ({ project, device, architecture, verbose, skipSetup }) => {
  logger.isVerbose = verbose;
  logger.log(`Running Android project at ${project} with architecture ${architecture}`);
  
  setArchitecture({architecture, project});

  if (device) {
    launchAndroidEmulator(device);
  }
  if (!skipSetup) {
    setupProject({project});
  }
  installApp({project});
}