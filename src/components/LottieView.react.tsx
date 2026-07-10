// Adapted from lottie-react-native (https://github.com/lottie-react-native/lottie-react-native),
// licensed under the Apache License, Version 2.0. See NOTICE and LICENSE-APACHE.

import { type DotLottie, DotLottieReact } from "@lottiefiles/dotlottie-react"
import React, {
  forwardRef,
  type Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react"

import type { LottieViewProps } from "./types"

type ParsedSource =
  | {
      sourceURL?: string
      sourceJson?: string
      sourceName?: string
      sourceDotLottieURI?: string
    }
  | undefined

const parsePossibleSources = (source: unknown): ParsedSource => {
  const uri = (source as any).uri

  if (typeof source === "string") {
    return { sourceName: source }
  }

  if (typeof source === "object" && !uri) {
    return { sourceJson: JSON.stringify(source) }
  }

  if (typeof source === "object" && uri) {
    // uri contains .lottie extension return sourceDotLottieURI
    if (uri.includes(".lottie")) {
      return { sourceDotLottieURI: uri }
    }

    return { sourceURL: uri }
  }

  return undefined
}

export const LottieView = forwardRef(
  (
    {
      source,
      speed,
      loop,
      webStyle,
      autoPlay,
      hover,
      direction,
      progress,
      theme,
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
    const [dotLottie, setDotLottie] = useState<DotLottie | null>(null)
    const sources = parsePossibleSources(source)
    const dotLottieRefCallback = useCallback((dotLottie: DotLottie) => {
      setDotLottie(dotLottie)
    }, [])

    useEffect(() => {
      if (dotLottie) {
        dotLottie.addEventListener("load", () => {
          onAnimationLoaded?.()
        })
        dotLottie.addEventListener("loadError", e => {
          onAnimationFailure?.(e.error.message)
        })
        dotLottie.addEventListener("complete", () => {
          onAnimationFinish?.(false)
        })
        dotLottie.addEventListener("stop", () => {
          onAnimationFinish?.(true)
        })
        dotLottie.addEventListener("pause", () => {
          onAnimationFinish?.(true)
        })
        dotLottie.addEventListener("loop", () => {
          onAnimationLoop?.()
        })

        return () => {
          dotLottie.removeEventListener("load")
          dotLottie.removeEventListener("loadError")
          dotLottie.removeEventListener("complete")
          dotLottie.removeEventListener("stop")
          dotLottie.removeEventListener("pause")
          dotLottie.removeEventListener("loop")
        }
      }
      return undefined
    }, [
      dotLottie,
      onAnimationFailure,
      onAnimationFinish,
      onAnimationLoaded,
      onAnimationLoop,
    ])

    useEffect(() => {
      if (progress != null && __DEV__) {
        console.warn("lottie-react-native: progress is not supported on web")
      }
    }, [progress])

    useImperativeHandle(ref, () => {
      return {
        play: (s?: number, e?: number) => {
          if (!dotLottie) return
          try {
            const bothDefined = s !== undefined && e !== undefined
            const bothUndefined = s === undefined && e === undefined
            const bothEqual = e === s
            if (bothDefined) {
              if (bothEqual) {
                dotLottie.setFrame(e)
                dotLottie.play()
                return
              }
              dotLottie.setSegment(s, e)
              return
            }
            if (s !== undefined && e === undefined) {
              dotLottie.setFrame(s)
              dotLottie.play()
            }
            if (bothUndefined) {
              dotLottie.play()
            }
          } catch (error) {
            console.error(error)
          }
        },
        reset: () => {
          dotLottie?.setFrame(0)
        },
        pause: () => {
          dotLottie?.pause()
        },
        resume: () => {
          dotLottie?.play()
        },
      }
    }, [dotLottie])

    if (!sources) {
      return null
    }

    return (
      <DotLottieReact
        dotLottieRefCallback={dotLottieRefCallback}
        data={sources.sourceJson}
        src={
          sources.sourceDotLottieURI ?? sources.sourceURL ?? sources.sourceName
        }
        style={webStyle}
        autoplay={autoPlay}
        speed={speed}
        loop={loop}
        playOnHover={hover}
        mode={direction === -1 ? "reverse" : "forward"}
        themeId={theme}
      />
    )
  },
)
