// Set EXPO_ROUTER_APP_ROOT for monorepo support
process.env.EXPO_ROUTER_APP_ROOT = './app';

module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
    };
};
