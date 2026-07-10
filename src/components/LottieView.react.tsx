// Adapted from lottie-react-native (https://github.com/lottie-react-native/lottie-react-native),
// licensed under the Apache License, Version 2.0. See NOTICE and LICENSE-APACHE.

import Lottie, { type LottieRef } from "lottie-react"
import {
  forwardRef,
  type Ref,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react"

import type { LottieViewProps } from "./types"

const parseAnimationData = (source: LottieViewProps["source"]) => {
  if (typeof source === "object" && !("uri" in source)) {
    return source
  }
  return undefined
}

export const LottieView = forwardRef(
  (
    {
      source,
      speed,
      loop,
      style,
      autoPlay,
      hover,
      direction,
      progress,
      onAnimationLoaded,
      onAnimationFailure,
      onAnimationFinish,
      onAnimationLoop,
    }: LottieViewProps,
    ref: Ref<{
      play: (s?: number, e?: number) => void
      reset: () => void
      pause: () => void
      resume: () => void
    }>,
  ) => {
    const lottieRef: LottieRef = useRef(null)
    const animationData = parseAnimationData(source)

    useEffect(() => {
      lottieRef.current?.setSpeed(speed ?? 1)
    }, [speed])

    useEffect(() => {
      lottieRef.current?.setDirection(direction === -1 ? -1 : 1)
    }, [direction])

    useEffect(() => {
      if (progress != null && __DEV__) {
        // biome-ignore lint/suspicious/noConsole: intentional dev-only warning
        console.warn("lottie-react-native: progress is not supported on web")
      }
    }, [progress])

    useImperativeHandle(ref, () => {
      return {
        play: (s?: number, e?: number) => {
          try {
            const bothDefined = s !== undefined && e !== undefined
            const bothUndefined = s === undefined && e === undefined
            const bothEqual = e === s
            if (bothDefined) {
              if (bothEqual) {
                lottieRef.current?.goToAndPlay(e, true)
                return
              }
              lottieRef.current?.playSegments([s, e], true)
              return
            }
            if (s !== undefined && e === undefined) {
              lottieRef.current?.goToAndPlay(s, true)
            }
            if (bothUndefined) {
              lottieRef.current?.play()
            }
          } catch (error) {
            // biome-ignore lint/suspicious/noConsole: surface playback errors during development
            console.error(error)
          }
        },
        reset: () => {
          lottieRef.current?.goToAndPlay(0)
        },
        pause: () => {
          lottieRef.current?.pause()
          onAnimationFinish?.(true)
        },
        resume: () => {
          lottieRef.current?.play()
        },
      }
    }, [onAnimationFinish])

    if (!animationData) {
      if (__DEV__) {
        // biome-ignore lint/suspicious/noConsole: intentional dev-only warning
        console.warn(
          "lottie-react-native: string and remote uri sources are not supported on web, pass parsed animation JSON instead",
        )
      }
      return null
    }

    return (
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        style={style as React.CSSProperties}
        autoplay={autoPlay}
        loop={loop}
        onMouseEnter={hover ? () => lottieRef.current?.play() : undefined}
        onMouseLeave={hover ? () => lottieRef.current?.stop() : undefined}
        onComplete={() => onAnimationFinish?.(false)}
        onLoopComplete={() => onAnimationLoop?.()}
        onDOMLoaded={() => onAnimationLoaded?.()}
        onDataFailed={() => onAnimationFailure?.("Failed to load animation")}
      />
    )
  },
)
