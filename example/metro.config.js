"use strict"

const path = require("path")

const { getDefaultConfig } = require("@expo/metro-config")
const escape = require("escape-string-regexp")
const exclusionList = require("metro-config/src/defaults/exclusionList")

const pak = require("../package.json")

const root = path.resolve(__dirname, "..")
const defaultConfig = getDefaultConfig(__dirname)

defaultConfig.watchFolders = [root]

const modules = Object.keys({
  ...pak.peerDependencies,
})

// We need to make sure that only one version is loaded for peerDependencies
// So we block them at the root, and alias them to the versions in example's node_modules
defaultConfig.resolver.blacklistRE = exclusionList(
  modules.map(
    m => new RegExp(`^${escape(path.join(root, "node_modules", m))}\\/.*$`),
  ),
)

defaultConfig.resolver.extraNodeModules = modules.reduce((acc, name) => {
  acc[name] = path.join(__dirname, "node_modules", name)
  return acc
}, {})

module.exports = defaultConfig
