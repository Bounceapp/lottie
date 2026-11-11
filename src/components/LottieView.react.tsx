// Adapted from lottie-react-native (https://github.com/lottie-react-native/lottie-react-native),
// licensed under the Apache License, Version 2.0. See NOTICE and LICENSE-APACHE.

import { type LottieInstance, useLottie } from "lottie-react"
import {
  forwardRef,
  type Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react"

import type { LottieViewProps } from "./types"

/** lottie-web's animation object, which lottie-react loads and destroys for us. */
type Engine = NonNullable<LottieInstance["animationItem"]>

type Command = (engine: Engine) => void

/** Stands in for the animation while there is none, when nothing is drawn. */
const NO_ANIMATION = {}

const parseAnimationData = (source: LottieViewProps["source"]) => {
  if (typeof source === "object" && !("uri" in source)) {
    return source
  }
  return undefined
}

/**
 * Converts a `dataSet` map into hyphenated `data-*` DOM attributes, matching the
 * behaviour of `HTMLElement.dataset` (e.g. `{ fooBar: "baz" }` -> `data-foo-bar="baz"`).
 */
const dataSetToAttributes = (dataSet: LottieViewProps["dataSet"]) => {
  if (!dataSet) {
    return {}
  }
  const attributes: Record<string, string | number | boolean> = {}
  for (const [key, value] of Object.entries(dataSet)) {
    const attribute = `data-${key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}`
    attributes[attribute] = value
  }
  return attributes
}

/**
 * lottie-react reads `window.matchMedia` every time it loads an animation, and
 * throws where there is none. Every browser has it, so this only ever fills the
 * gap in environments like jsdom, which is to say in the tests of our consumers.
 */
const ensureMatchMedia = () => {
  if (typeof window === "undefined" || "matchMedia" in window) {
    return
  }
  const noop = () => {}
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: noop,
      removeListener: noop,
      addEventListener: noop,
      removeEventListener: noop,
      dispatchEvent: () => false,
    }),
  })
}

/** A destroyed engine lets go of its renderer, and ignores whatever it is told. */
const isAlive = (engine: Engine) => Boolean(engine.renderer)

/**
 * Returns a function that runs commands against the engine, and starts the
 * animation when `autoPlay` asks for it.
 *
 * lottie-react only creates the engine on its second render, and replaces it
 * when the source changes, so a command can arrive while there is none: `play()`
 * called from a parent's mount effect is the usual case. Those are held back and
 * run in order as soon as the engine exists, rather than being dropped.
 */
const useEngine = (engine: Engine | null, autoPlay: boolean | undefined) => {
  const engineRef = useRef<Engine | null>(null)
  const pendingRef = useRef<Command[]>([])
  const autoPlayRef = useRef(autoPlay)

  useEffect(() => {
    autoPlayRef.current = autoPlay
  }, [autoPlay])

  useEffect(() => {
    if (!engine || !isAlive(engine)) {
      return
    }
    engineRef.current = engine
    // Started here rather than by lottie-react, which declines to autoplay for
    // people who ask for reduced motion and so never reports the animation as
    // finished. Read once per engine, like the load-time option it replaces.
    if (autoPlayRef.current) {
      engine.play()
    }
    for (const command of pendingRef.current.splice(0)) {
      command(engine)
    }
  }, [engine])

  return useCallback((command: Command) => {
    const current = engineRef.current
    if (current && isAlive(current)) {
      command(current)
    } else {
      pendingRef.current.push(command)
    }
  }, [])
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
      dataSet,
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
    const animationData = parseAnimationData(source)

    useEffect(ensureMatchMedia, [])

    // The hook rather than the `<Lottie>` component, which sizes its element to
    // 100% of the parent and clips it. The element below carries only `style`.
    const { animationItem, setDisplayRef } = useLottie({
      src: animationData ?? NO_ANIMATION,
      autoplay: false,
      loop: loop ?? true,
      speed: speed ?? 1,
      direction: direction === -1 ? "reverse" : "forward",
      subscriptions: {
        complete: () => onAnimationFinish?.(false),
        loopCompleted: () => onAnimationLoop?.(),
        ready: () => onAnimationLoaded?.(),
        error: () => onAnimationFailure?.("Failed to load animation"),
      },
    })

    // Commands go to the engine itself. lottie-react's own `play` restarts an
    // animation that is on its last frame and its `seek` stops short of that
    // frame, so `play(lastFrame)` would replay everything instead of ending.
    const run = useEngine(animationItem, autoPlay)

    useEffect(() => {
      if (progress != null && __DEV__) {
        // oxlint-disable-next-line no-console -- intentional dev-only warning
        console.warn("lottie-react-native: progress is not supported on web")
      }
    }, [progress])

    useImperativeHandle(ref, () => {
      return {
        play: (s?: number, e?: number) => {
          run(engine => {
            try {
              const bothDefined = s !== undefined && e !== undefined
              const bothUndefined = s === undefined && e === undefined
              const bothEqual = e === s
              if (bothDefined) {
                if (bothEqual) {
                  engine.goToAndPlay(e, true)
                  return
                }
                engine.playSegments([s, e], true)
                return
              }
              if (s !== undefined && e === undefined) {
                engine.goToAndPlay(s, true)
              }
              if (bothUndefined) {
                engine.play()
              }
            } catch (error) {
              // oxlint-disable-next-line no-console -- surface playback errors during development
              console.error(error)
            }
          })
        },
        reset: () => {
          run(engine => engine.goToAndPlay(0))
        },
        pause: () => {
          run(engine => engine.pause())
          onAnimationFinish?.(true)
        },
        resume: () => {
          run(engine => engine.play())
        },
      }
    }, [run, onAnimationFinish])

    if (!animationData) {
      if (__DEV__) {
        // oxlint-disable-next-line no-console -- intentional dev-only warning
        console.warn(
          "lottie-react-native: string and remote uri sources are not supported on web, pass parsed animation JSON instead",
        )
      }
      return null
    }

    return (
      <div
        ref={setDisplayRef}
        {...dataSetToAttributes(dataSet)}
        style={style as React.CSSProperties}
        onMouseEnter={hover ? () => run(engine => engine.play()) : undefined}
        onMouseLeave={hover ? () => run(engine => engine.stop()) : undefined}
      />
    )
  },
)
