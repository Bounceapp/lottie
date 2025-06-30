import { Meta, StoryObj } from "@storybook/react-webpack5"
import React from "react"

import { LottieView } from "./Lottie"
import { LottieViewProps } from "./types"
import lottieAnimation from "../example/lottieAnimation.json"

export default {
  title: "LottieView",
  component: LottieView,
  parameters: {
    viewMode: "docs",
    layout: "fullscreen",
  },
  decorators: [
    Story => (
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LottieView>

export const Default: StoryObj<LottieViewProps> = {
  name: "LottieView",
  args: {
    style: { width: 100, height: 100 },
    autoPlay: true,
    loop: true,
    source: lottieAnimation,
  },
}
