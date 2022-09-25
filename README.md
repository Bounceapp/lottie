# @bounceapp/lottie

[![Version](https://img.shields.io/npm/v/@bounceapp/lottie.svg)](https://www.npmjs.com/package/@bounceapp/lottie) [![License](https://img.shields.io/github/license/Bounceapp/lottie)](https://github.com/Bounceapp/lottie/blob/master/LICENSE)

Lottie wrapper for React Native Web

## 📱 Platform Compatibility

| Android Device | Android Emulator | iOS Device | iOS Simulator | Web |
| -------------- | ---------------- | ---------- | ------------- | --- |
| ✅             | ✅               | ✅         | ✅            | ✅  |

## 📚 Documentation

[API Reference](https://bounceapp.github.io/lottie/)

## 🧱 Installation

```bash
npx expo install @bounceapp/lottie lottie-react-native lottie-ios lottie-react
```

## 🏡 Usage

```tsx
import React from "react"

import { LottieView } from "@bounceapp/lottie"

import lottieAnimation from "./lottieAnimation.json"

const App = () => (
  <LottieView
    style={{ width: 100, height: 100 }}
    autoPlay
    loop
    source={lottieAnimation}
  />
)

export default App
```

## 👏 Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

The source code is made available under the [MIT license](LICENSE). Some of the dependencies can be licensed differently, with the BSD license, for example.
