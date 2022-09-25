import { LottieView } from "@bounceapp/lottie"
import React from "react"
import { View } from "react-native"

import lottieAnimation from "./lottieAnimation.json"

const App = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <LottieView
        style={{ width: 100, height: 100 }}
        autoPlay
        loop
        source={lottieAnimation}
      />
    </View>
  )
}

export default App
