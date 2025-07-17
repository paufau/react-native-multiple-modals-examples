const { execSync } = require('child_process');
const fs = require('fs');

const arguments = process.argv.slice(2);
const argProjectPath = arguments[0];

if (!argProjectPath) {
  console.error('Please provide the project path as an argument.');
  process.exit(1);
}

const verbose = true; // Set to true for detailed output

const log = (message) => {
  if (verbose) {
    console.log(message);
  }
}

const installExternalLibs = () => {
  const dependencies = [
    '@react-native-community/blur',
    '@react-navigation/bottom-tabs',
    '@react-navigation/native',
    'react-native-gesture-handler',
    'react-native-reanimated',
    'react-native-safe-area-context',
    'react-native-screens'
  ];

  dependencies.forEach(dep => {
    try {
      log(`Installing ${dep}...`);
      execSync(`cd ${argProjectPath} && yarn add ${dep}`, { stdio: 'inherit' });
      log(`${dep} installed successfully.`);
    } catch (error) {
      console.error(`Failed to install ${dep}:`, error.message);
    }
  });
}

const removeLocalLibs = () => {
  log('Removing local libraries from package.json...');
  const packageJsonPath = `${argProjectPath}/package.json`;
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const localLibs = ['demo-components', 'react-native-multiple-modals'];

  localLibs.forEach(lib => {
    if (packageJson.dependencies[lib]) {
      delete packageJson.dependencies[lib];
      log(`${lib} removed from package.json.`);
    } else {
      console.warn(`${lib} not found in package.json dependencies.`);
    }
  });

  log('Writing updated package.json...');
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  log('Local libraries removed successfully.');
}

const installLocalLibs = () => {
  log('Reading package.json to link local libraries...');
  const packageJsonPath = `${argProjectPath}/package.json`;
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  log('Linking local libraries...');

  packageJson.dependencies['demo-components'] = 'file:../demo-components';
  log('demo-components linked successfully.');

  packageJson.dependencies['react-native-multiple-modals'] = 'file:../../react-native-multiple-modals';
  log('react-native-multiple-modals linked successfully.');

  log('Writing package.json with local libraries...');
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  log('Local libraries linked successfully.');

  try {
    log('Running yarn install to update dependencies...');
    execSync(`cd ${argProjectPath} && yarn`, { stdio: 'inherit' });
    log('Dependencies updated successfully.');
  } catch (error) {
    console.error('Failed to update dependencies:', error.message);
  }
}

const linkReanimatedPlugin = () => {
  log('Linking react-native-reanimated plugin to babel.config.js...');
  const babelConfigPath = `${argProjectPath}/babel.config.js`;
  const babelConfig = require(babelConfigPath);

  babelConfig.plugins = [
    ...(babelConfig.plugins, []),
    'react-native-reanimated/plugin'
  ];

  log('Writing babel.config.js with react-native-reanimated plugin...');
  fs.writeFileSync(babelConfigPath, `module.exports = ${JSON.stringify(babelConfig, null, 2)};`);
  log('react-native-reanimated plugin linked successfully.');
}

const setupApp = () => {
  log('Setting up App component in App.tsx...');
  const appPath = `${argProjectPath}/App.tsx`;
  const appContent = `import { DemoApp } from 'demo-components';\n\nfunction App() {\n\treturn <DemoApp />;\n}\n\nexport default App;`;

  fs.writeFileSync(appPath, appContent);
  log('App component setup completed.');
}

const installPods = () => {
  log('Installing CocoaPods dependencies...');
  try {
    execSync(`cd ${argProjectPath}/ios && pod install`, { stdio: 'inherit' });
    log('CocoaPods dependencies installed successfully.');
  } catch (error) {
    console.error('Failed to install CocoaPods dependencies:', error.message);
  }
}

// Main execution
removeLocalLibs();
installExternalLibs();
installLocalLibs();
linkReanimatedPlugin();
setupApp();
installPods();