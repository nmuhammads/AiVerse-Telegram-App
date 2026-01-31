// Set EXPO_ROUTER_APP_ROOT before Metro loads
process.env.EXPO_ROUTER_APP_ROOT = './app';

const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch all files in the monorepo
config.watchFolders = [workspaceRoot];

// Let Metro know where to resolve packages
config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
];

// Force Metro to use a single version of React from workspace root
config.resolver.extraNodeModules = {
    react: path.resolve(workspaceRoot, 'node_modules/react'),
    'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
};

// Disable package exports as they can cause issues in monorepos
config.resolver.unstable_enablePackageExports = false;

// Override expo-router context files to use our custom implementation
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
    // Redirect expo-router context files to our custom implementation
    if (moduleName.includes('expo-router') && moduleName.includes('_ctx')) {
        return {
            filePath: path.resolve(projectRoot, 'expo-router-ctx.js'),
            type: 'sourceFile',
        };
    }

    // Use default resolver for everything else
    if (originalResolveRequest) {
        return originalResolveRequest(context, moduleName, platform);
    }
    return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
