import LottieViewRN from "lottie-react-native"
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react"
import { Platform } from "react-native"

import { LottieViewProps, LottieViewRef } from "./types"

const LottieView = forwardRef<LottieViewRef, LottieViewProps>(
  ({ source, style, loop, autoPlay, onAnimationFinish }, ref) => {
    const lottieRef = useRef<LottieViewRN>(null)

    /**
     * Fix IOS autoPlay
     * https://github.com/lottie-react-native/lottie-react-native/issues/832
     */
    useEffect(() => {
      if (autoPlay && Platform.OS === "ios") {
        setTimeout(() => {
          lottieRef.current?.reset()
          lottieRef.current?.play()
        }, 100)
      }
    }, [autoPlay])

    useImperativeHandle(ref, () => ({
      pause: () => lottieRef.current?.pause(),
      play: () => lottieRef.current?.play(),
      reset: () => lottieRef.current?.reset(),
    }))

    return (
      <LottieViewRN
        ref={lottieRef}
        source={source}
        loop={loop}
        autoPlay={autoPlay}
        style={style}
        speed={1}
        onAnimationFinish={onAnimationFinish}
      />
    )
  },
)

export { LottieView }
