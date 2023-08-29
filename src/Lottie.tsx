import Lottie, { LottieRef } from "lottie-react"
import React, { forwardRef, useImperativeHandle, useRef } from "react"

import type { LottieViewProps, LottieViewRef } from "./types"

/**
 * ```tsx
 * import React from "react"
 *
 * import { LottieView } from "@bounceapp/lottie"
 *
 * import lottieAnimation from "./lottieAnimation.json"
 *
 * const App = () => (
 *   <LottieView
 *     style={{ width: 100, height: 100 }}
 *     autoPlay
 *     loop
 *     source={lottieAnimation}
 *   />
 * )
 *
 * export default App
 * ```
 *
 * @category Component
 */
const LottieView = forwardRef<LottieViewRef, LottieViewProps>(
  ({ source, style, loop, autoPlay, onAnimationFinish }, ref) => {
    const lottieRef: LottieRef = useRef(null)

    useImperativeHandle(ref, () => ({
      pause: () => lottieRef.current?.pause(),
      play: () => lottieRef.current?.play(),
      reset: () => lottieRef.current?.goToAndPlay(0),
    }))

    return (
      <Lottie
        data-chromatic="ignore"
        lottieRef={lottieRef}
        animationData={source}
        loop={loop}
        autoplay={autoPlay}
        style={style as React.CSSProperties}
        onComplete={onAnimationFinish}
      />
    )
  },
)

export { LottieView }
