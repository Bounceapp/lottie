// Adapted from lottie-react-native (https://github.com/lottie-react-native/lottie-react-native),
// licensed under the Apache License, Version 2.0. See NOTICE and LICENSE-APACHE.

import NativeLottieView from "lottie-react-native"
import { type ComponentProps, type ElementRef, forwardRef } from "react"

import type { LottieViewProps } from "./types"

// lottie-react-native's props don't include the `dataSet` / `data-chromatic` escape
// hatches. They are accepted here for cross-platform parity and are no-ops on native.
export const LottieView = forwardRef<
  ElementRef<typeof NativeLottieView>,
  LottieViewProps
>((props, ref) => (
  <NativeLottieView
    ref={ref}
    {...(props as ComponentProps<typeof NativeLottieView>)}
  />
))
