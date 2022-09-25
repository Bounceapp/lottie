import type { AnimatedLottieViewProps } from "lottie-react-native"

/**
 * The props type for {@link LottieView}.
 */
export type LottieViewProps = Pick<
  AnimatedLottieViewProps,
  "source" | "style" | "loop" | "autoPlay"
> & {
  onAnimationFinish?: () => void
}

export type LottieViewRef = {
  play: () => void
  pause: () => void
  reset: () => void
}
