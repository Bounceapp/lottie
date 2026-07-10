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
npx expo install @bounceapp/lottie lottie-react-native @lottiefiles/dotlottie-react
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

### dotLottie (`.lottie`) files

On web, `source` can also point to a `.lottie` file:

```tsx
import splashScreen from "./splash-screen.lottie"

const App = () => (
  <LottieView
    style={{ width: 100, height: 100 }}
    autoPlay
    loop
    source={{ uri: splashScreen }}
  />
)
```

### Setting up `.lottie` import support

`import`-ing a `.lottie` file works out of the box in this package's own Storybook (see `.storybook/main.mjs`), but a consuming app's own bundler and test runner need to be told how to handle the extension too:

- **Metro (Expo/React Native)**: add `lottie` to `resolver.assetExts` so Metro bundles it like any other binary asset, and declare the module type so it resolves to the asset's numeric ID:

  ```js
  // metro.config.js
  config.resolver.assetExts.push("lottie")
  ```

  ```ts
  // e.g. types/assets.d.ts
  declare module "*.lottie" {
    const content: string
    export default content
  }
  ```

- **Webpack/Turbopack (Next.js, web)**: treat `*.lottie` as a static asset that resolves to a URL string:

  ```ts
  // next.config.ts
  turbopack: {
    rules: {
      "*.lottie": { type: "asset" },
    },
  }
  ```

  ```ts
  // e.g. types/assets.d.ts
  declare module "*.lottie" {
    const content: string
    export default content
  }
  ```

- **Jest**: add `lottie` to the binary-asset extensions in your `moduleNameMapper` so imports resolve through your existing file mock, e.g. `\.(png|jpg|...|lottie)$`.

- **Vite-based tooling (Vitest, Storybook)**: add `.lottie` to `assetsInclude` so Vite treats it as a static asset instead of trying to parse it as source (see this package's own `.storybook/main.mjs` and `src/lottie-asset.d.ts` for a working example):

  ```ts
  assetsInclude: ["**/*.lottie"]
  ```

## 👏 Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

The source code is made available under the [MIT license](LICENSE). Some of the dependencies can be licensed differently, with the BSD license, for example.

Portions of `src/components/types.ts` and `src/components/LottieView.react.tsx` are adapted from [lottie-react-native](https://github.com/lottie-react-native/lottie-react-native), licensed under [Apache License 2.0](LICENSE-APACHE). See [NOTICE](NOTICE) for details.
