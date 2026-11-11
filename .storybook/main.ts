import type { StorybookConfig } from "@storybook/react-native-web-vite"

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  framework: {
    name: "@storybook/react-native-web-vite",
    options: {},
  },
  docs: {},
  addons: ["@storybook/addon-mcp"],
}

export default config
