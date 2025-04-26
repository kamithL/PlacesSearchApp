// // metro.config.js
// const { getDefaultConfig } = require('@expo/metro-config');
//
// const config = getDefaultConfig(__dirname);
//
// config.resolver.extraNodeModules = {
//     ...config.resolver.extraNodeModules,
//     crypto: require.resolve('./polyfills.js'), // 👈 Force polyfills for crypto
// };
//
// module.exports = config;
// metro.config.js
const { getDefaultConfig } = require("@expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = config;
