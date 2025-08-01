import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const args = process.argv.slice(2);
const argProjectPath = args[0];

if (!argProjectPath) {
  console.error('Please provide the project path as an argument.');
  process.exit(1);
}

const verbose = true; // Set to true for detailed output
const projectName = path.basename(argProjectPath);
const nextBundleId = `com.modals.${projectName}`;

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
  // Read babel.config.js as a string and parse the exported object
  const babelConfigContent = fs.readFileSync(babelConfigPath, 'utf8');
  const babelConfigMatch = babelConfigContent.match(/module\.exports\s*=\s*(\{[\s\S]*\});?/);
  let babelConfig = {};
  
  if (babelConfigMatch) {
    try {
      babelConfig = eval('(' + babelConfigMatch[1] + ')');
    } catch (e) {
      console.error('Failed to parse babel.config.js:', e.message);
      return;
    }
  } else {
    console.warn('Could not find module.exports in babel.config.js, using empty config.');
  }

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

const removeGitSubrepo = () => {
  log('Removing git subrepo...');
  try {
    execSync(`cd ${argProjectPath} && rm -rf .git .gitignore`, { stdio: 'inherit' });
    log('Git subrepo removed successfully.');
  } catch (error) {
    console.error('Failed to remove git subrepo:', error.message);
  }
}

const setupBundleId = () => {
  // Set iOS Bundle ID in Info.plist using PlistBuddy
  log('Setting up Bundle ID in Info.plist...');
  const infoPlistPath = `${argProjectPath}/ios/${projectName}/Info.plist`;
  
  if (fs.existsSync(infoPlistPath)) {
    try {
      execSync(`/usr/libexec/PlistBuddy -c "Set :CFBundleIdentifier ${nextBundleId}" "${infoPlistPath}"`, { stdio: 'inherit' });
      log('Bundle ID setup completed in Info.plist using PlistBuddy.');
    } catch (error) {
      console.error('Failed to update bundle ID with PlistBuddy, falling back to manual replacement:', error.message);
      // Fallback to manual replacement
      const infoPlist = fs.readFileSync(infoPlistPath, 'utf8');
      const updatedPlist = infoPlist.replace(/<key>CFBundleIdentifier<\/key>\s*<string>.*?<\/string>/, `<key>CFBundleIdentifier</key>\n\t<string>${nextBundleId}</string>`);
      fs.writeFileSync(infoPlistPath, updatedPlist);
      log('Bundle ID setup completed using manual replacement.');
    }
  } else {
    console.warn(`Info.plist not found at ${infoPlistPath}`);
  }

  // Update PRODUCT_BUNDLE_IDENTIFIER in Xcode project
  log('Setting up PRODUCT_BUNDLE_IDENTIFIER in Xcode project...');
  const xcodeprojPath = `${argProjectPath}/ios/${projectName}.xcodeproj`;
  
  if (fs.existsSync(xcodeprojPath)) {
    try {
      // Update PRODUCT_BUNDLE_IDENTIFIER for all configurations and targets
      execSync(`cd "${argProjectPath}/ios" && xcodebuild -project ${projectName}.xcodeproj -target ${projectName} PRODUCT_BUNDLE_IDENTIFIER=${nextBundleId} -configuration Debug build`, { stdio: 'pipe' });
      execSync(`cd "${argProjectPath}/ios" && xcodebuild -project ${projectName}.xcodeproj -target ${projectName} PRODUCT_BUNDLE_IDENTIFIER=${nextBundleId} -configuration Release build`, { stdio: 'pipe' });
      log('PRODUCT_BUNDLE_IDENTIFIER updated in Xcode project using xcodebuild.');
    } catch (error) {
      console.warn('Failed to update PRODUCT_BUNDLE_IDENTIFIER with xcodebuild, trying manual approach:', error.message);
      
      // Fallback: manually edit project.pbxproj file
      const projectPbxprojPath = `${xcodeprojPath}/project.pbxproj`;
      if (fs.existsSync(projectPbxprojPath)) {
        try {
          const projectContent = fs.readFileSync(projectPbxprojPath, 'utf8');
          const updatedContent = projectContent.replace(/PRODUCT_BUNDLE_IDENTIFIER = ".*?";/g, `PRODUCT_BUNDLE_IDENTIFIER = "${nextBundleId}";`);
          fs.writeFileSync(projectPbxprojPath, updatedContent);
          log('PRODUCT_BUNDLE_IDENTIFIER updated in project.pbxproj manually.');
        } catch (pbxError) {
          console.error('Failed to update project.pbxproj manually:', pbxError.message);
        }
      }
    }
  } else {
    console.warn(`Xcode project not found at ${xcodeprojPath}`);
  }

  // Set Android application ID
  log('Setting up application ID in android/app/build.gradle...');
  const buildGradlePath = `${argProjectPath}/android/app/build.gradle`;
  
  if (fs.existsSync(buildGradlePath)) {
    const buildGradle = fs.readFileSync(buildGradlePath, 'utf8');
    const updatedGradle = buildGradle.replace(/applicationId\s+".*?"/, `applicationId "${nextBundleId}"`);
    fs.writeFileSync(buildGradlePath, updatedGradle);
    log('Application ID setup completed in android/app/build.gradle.');
  } else {
    console.warn(`build.gradle not found at ${buildGradlePath}`);
  }
}

// Main execution
removeGitSubrepo();
setupBundleId();
removeLocalLibs();
installExternalLibs();
installLocalLibs();
linkReanimatedPlugin();
setupApp();
installPods();