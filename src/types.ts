import type { LottieViewProps as RNLottieViewProps } from "lottie-react-native"

/**
 * The props type for {@link LottieView}.
 */
export type LottieViewProps = Pick<
  RNLottieViewProps,
  "source" | "style" | "loop" | "autoPlay"
> & {
  onAnimationFinish?: () => void
}

export type LottieViewRef = {
  play: () => void
  pause: () => void
  reset: () => void
}
