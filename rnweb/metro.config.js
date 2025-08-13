const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../../');

const config = getDefaultConfig(projectRoot);

const monorepoPackages = {
  'react-native-multiple-modals': path.resolve(monorepoRoot, 'react-native-multiple-modals/src'),
  'demo-components': path.resolve(projectRoot, './../demo-components'),
};

config.watchFolders = [projectRoot, ...Object.values(monorepoPackages)];

config.resolver.extraNodeModules = monorepoPackages;

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

module.exports = config;