export default {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  framework: {
    name: "@storybook/react-native-web-vite",
    options: {},
  },
  docs: {},
  viteFinal: config => {
    config.assetsInclude ??= []
    config.assetsInclude = [].concat(config.assetsInclude, "**/*.lottie")
    return config
  },
}
