import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"

import lottieAnimation from "../example/lottieAnimation.json"
import { LottieView } from "./Lottie"

export default {
  title: "LottieView",
  component: LottieView,
  parameters: {
    viewMode: "docs",
    layout: "fullscreen",
  },
} as ComponentMeta<typeof LottieView>

const Template: ComponentStory<typeof LottieView> = args => (
  <div
    style={{
      display: "flex",
      height: "100vh",
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    }}>
    <LottieView {...args} />
  </div>
)

export const Default = Template.bind({})
Default.storyName = "LottieView"
Default.args = {
  style: { width: 100, height: 100 },
  autoPlay: true,
  loop: true,
  source: lottieAnimation,
}
