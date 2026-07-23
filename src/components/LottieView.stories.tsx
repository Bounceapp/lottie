import type { Meta, StoryObj } from "@storybook/react-native-web-vite"
import type React from "react"

import lottieAnimation from "../../example/lottieAnimation.json"
import splashScreenAnimation from "../../example/splash-screen.json"
import { LottieView as LottieViewReact } from "./LottieView.react"
import { LottieView as LottieViewWeb } from "./LottieView.web"
import type { LottieViewProps } from "./types"

const rowStyle: React.CSSProperties = {
  display: "flex",
  height: "100vh",
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
  gap: 64,
}

const columnStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 16,
}

export default {
  title: "LottieView",
  component: LottieViewWeb,
  parameters: {
    viewMode: "docs",
    layout: "fullscreen",
  },
} satisfies Meta<LottieViewProps>

export const SideBySide: StoryObj<LottieViewProps> = {
  name: "React vs React Native Web",
  args: {
    style: { width: 100, height: 100 },
    autoPlay: true,
    loop: true,
    source: lottieAnimation,
    dataSet: { customAttr: "value" },
  },
  render: args => (
    <div style={rowStyle}>
      <div style={columnStyle}>
        <span>LottieView.react</span>
        <LottieViewReact {...args} />
      </div>
      <div style={columnStyle}>
        <span>LottieView.web</span>
        <LottieViewWeb {...args} />
      </div>
    </div>
  ),
}

export const SplashScreen: StoryObj<LottieViewProps> = {
  name: "Splash Screen",
  args: {
    style: { width: 200, height: 200 },
    autoPlay: true,
    loop: true,
    source: splashScreenAnimation,
  },
  render: args => (
    <div style={rowStyle}>
      <div style={columnStyle}>
        <span>LottieView.react</span>
        <LottieViewReact {...args} />
      </div>
      <div style={columnStyle}>
        <span>LottieView.web</span>
        <LottieViewWeb {...args} />
      </div>
    </div>
  ),
}
