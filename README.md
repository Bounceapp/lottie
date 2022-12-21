# @bounceapp/lottie

[![Package version](https://img.shields.io/npm/v/@bounceapp/lottie?style=for-the-badge&labelColor=000000)](https://www.npmjs.com/package/@bounceapp/lottie)
[![MIT license](https://img.shields.io/badge/License-MIT-brightgreen.svg?style=for-the-badge&labelColor=000000)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-hotpink.svg?style=for-the-badge&labelColor=000000)](https://github.com/dcangulo/@bounceapp/lottie/pulls)

Lottie wrapper for React Native Web

## Platform Compatibility

| Android Device | Android Emulator | iOS Device | iOS Simulator | Web |
| -------------- | ---------------- | ---------- | ------------- | --- |
| ✅             | ✅               | ✅         | ✅            | ✅  |

## Documentation

[API Reference](https://bounceapp.github.io/lottie/)

## Installation

```bash
npx expo install @bounceapp/lottie lottie-react-native lottie-react
```

## Usage

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
