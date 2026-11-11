// Runs on web only (jsdom + react-native-web): `jest.config.ts` keeps
// `*.web.test.tsx` out of the iOS and Android projects.

import { act, fireEvent, render, waitFor } from "@testing-library/react"
import type { LottieInstance } from "lottie-react"
import { type ComponentRef, createRef, useEffect, useRef } from "react"

import { LottieView as PackageLottieView } from "../index"
import { LottieView } from "./LottieView.react"
import type { AnimationObject, LottieViewProps } from "./types"

// Six frames at 60fps: short enough to play through in real time.
const animation: AnimationObject = {
  v: "5.7.4",
  fr: 60,
  ip: 0,
  op: 6,
  w: 100,
  h: 100,
  assets: [],
  layers: [],
}

// The real lottie-react and lottie-web run in these tests. `useLottie` is only
// wrapped so the tests can read the state of the engine `LottieView` drives.
const mockLatest: { instance?: LottieInstance } = {}

jest.mock("lottie-react", () => {
  const actual =
    jest.requireActual<typeof import("lottie-react")>("lottie-react")

  return {
    ...actual,
    useLottie: (...args: Parameters<typeof actual.useLottie>) => {
      const instance = actual.useLottie(...args)
      mockLatest.instance = instance
      return instance
    },
  }
})

/** The lottie-web animation behind the `LottieView` rendered last. */
const engine = () => {
  const animationItem = mockLatest.instance?.animationItem
  if (!animationItem) {
    throw new Error("lottie-react has not loaded an animation")
  }
  return animationItem
}

const renderLottieView = (props: Partial<LottieViewProps> = {}) => {
  const ref = createRef<ComponentRef<typeof LottieView>>()
  const { container } = render(
    <LottieView ref={ref} source={animation} {...props} />,
  )
  return {
    ref,
    container,
    /** The element `LottieView` renders, which the animation is drawn into. */
    get element() {
      const element = container.firstElementChild
      if (!(element instanceof HTMLElement)) {
        throw new Error("LottieView rendered nothing")
      }
      return element
    },
  }
}

let warn: jest.SpyInstance

beforeEach(() => {
  mockLatest.instance = undefined
  warn = jest.spyOn(console, "warn").mockImplementation(() => {})
})

afterEach(() => {
  warn.mockRestore()
})

describe("LottieView.react", () => {
  it("is what the package exports on web", () => {
    expect(PackageLottieView).toBe(LottieView)
  })

  describe("source", () => {
    it("draws parsed animation JSON as SVG", () => {
      const { element } = renderLottieView()

      expect(element.querySelector("svg")).not.toBeNull()
      expect(warn).not.toHaveBeenCalled()
    })

    it.each([
      ["a local asset name", "loader"],
      ["a remote uri", { uri: "https://example.com/loader.json" }],
    ])("renders nothing and warns for %s", (_, source) => {
      const { container } = renderLottieView({ source })

      expect(container.innerHTML).toBe("")
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining("not supported on web"),
      )
    })
  })

  describe("playback props", () => {
    it("waits on the first frame without `autoPlay`", () => {
      renderLottieView()

      expect(engine().isPaused).toBe(true)
      expect(engine().currentFrame).toBe(0)
    })

    it("starts playing on mount with `autoPlay`", () => {
      renderLottieView({ autoPlay: true })

      expect(engine().isPaused).toBe(false)
    })

    it("loops forward at normal speed by default", () => {
      renderLottieView()

      expect(engine().loop).toBe(true)
      expect(engine().playSpeed).toBe(1)
      expect(engine().playDirection).toBe(1)
    })

    it("applies `loop`, `speed` and `direction`", () => {
      renderLottieView({ loop: false, speed: 2, direction: -1 })

      expect(engine().loop).toBe(false)
      expect(engine().playSpeed).toBe(2)
      expect(engine().playDirection).toBe(-1)
    })

    it("applies `style` to the element", () => {
      const { element } = renderLottieView({
        style: { width: 120, height: 80 },
      })

      expect(element.style.width).toBe("120px")
      expect(element.style.height).toBe("80px")
    })

    it("warns that `progress` is not supported", () => {
      renderLottieView({ progress: 0.5 })

      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining("progress is not supported on web"),
      )
    })
  })

  describe("dataSet", () => {
    const dataAttributes = (element: HTMLElement) =>
      element.getAttributeNames().filter(name => name.startsWith("data-"))

    it("renders the entries as hyphenated data attributes", () => {
      const { element } = renderLottieView({
        dataSet: {
          chromatic: "ignore",
          customAttr: "value",
          step2Label: 3,
          isReady: true,
        },
      })

      expect(element.getAttribute("data-chromatic")).toBe("ignore")
      expect(element.getAttribute("data-custom-attr")).toBe("value")
      expect(element.getAttribute("data-step2-label")).toBe("3")
      expect(element.getAttribute("data-is-ready")).toBe("true")
      expect(dataAttributes(element)).toHaveLength(4)
    })

    it("adds no data attributes without a `dataSet`", () => {
      const { element } = renderLottieView()

      expect(dataAttributes(element)).toStrictEqual([])
    })
  })

  describe("hover", () => {
    it("plays on mouse enter, then stops on mouse leave", () => {
      const { element } = renderLottieView({ hover: true })

      fireEvent.mouseEnter(element)
      expect(engine().isPaused).toBe(false)

      fireEvent.mouseLeave(element)
      expect(engine().isPaused).toBe(true)
      expect(engine().currentFrame).toBe(0)
    })

    it("ignores the mouse when `hover` is not set", () => {
      const { element } = renderLottieView()

      fireEvent.mouseEnter(element)

      expect(engine().isPaused).toBe(true)
    })
  })

  describe("callbacks", () => {
    it("calls `onAnimationLoaded` once the animation is ready", async () => {
      const onAnimationLoaded = jest.fn()
      renderLottieView({ onAnimationLoaded })

      await waitFor(() => expect(onAnimationLoaded).toHaveBeenCalledTimes(1))
    })

    it("calls `onAnimationFinish` with `false` when the animation plays to the end", async () => {
      const onAnimationFinish = jest.fn()
      renderLottieView({ autoPlay: true, loop: false, onAnimationFinish })

      await waitFor(() => expect(onAnimationFinish).toHaveBeenCalledTimes(1))
      expect(onAnimationFinish).toHaveBeenCalledWith(false)
    })

    it("calls `onAnimationLoop` when a loop completes", async () => {
      const onAnimationLoop = jest.fn()
      const onAnimationFinish = jest.fn()
      renderLottieView({ autoPlay: true, onAnimationLoop, onAnimationFinish })

      await waitFor(() => expect(onAnimationLoop).toHaveBeenCalled())
      expect(onAnimationFinish).not.toHaveBeenCalled()
    })

    it("calls `onAnimationFailure` when the animation can't be loaded", async () => {
      const onAnimationFailure = jest.fn()
      const onAnimationLoaded = jest.fn()
      renderLottieView({
        source: { notAnAnimation: true } as unknown as AnimationObject,
        onAnimationFailure,
        onAnimationLoaded,
      })

      await waitFor(() =>
        expect(onAnimationFailure).toHaveBeenCalledWith(
          "Failed to load animation",
        ),
      )
      expect(onAnimationLoaded).not.toHaveBeenCalled()
    })
  })

  describe("ref", () => {
    it("plays from the current frame without arguments", () => {
      const { ref } = renderLottieView()

      act(() => ref.current?.play())

      expect(engine().isPaused).toBe(false)
      expect(engine().currentFrame).toBe(0)
    })

    it("plays from the start frame when only it is given", () => {
      const { ref } = renderLottieView()

      act(() => ref.current?.play(3))

      expect(engine().isPaused).toBe(false)
      expect(engine().currentFrame).toBe(3)
    })

    it("plays the segment between the start and end frames", () => {
      const { ref } = renderLottieView()

      act(() => ref.current?.play(2, 5))

      expect(engine().isPaused).toBe(false)
      expect(engine().firstFrame).toBe(2)
      expect(engine().totalFrames).toBe(3)
    })

    it("plays from the frame when the start and end frames are equal", () => {
      const { ref } = renderLottieView()

      act(() => ref.current?.play(4, 4))

      expect(engine().isPaused).toBe(false)
      expect(engine().currentFrame).toBe(4)
      // The whole animation stays playable, rather than an empty segment.
      expect(engine().firstFrame).toBe(0)
      expect(engine().totalFrames).toBe(6)
    })

    it("runs a command sent before the animation has loaded", () => {
      const PlaysOnMount = () => {
        const ref = useRef<ComponentRef<typeof LottieView>>(null)
        useEffect(() => {
          // lottie-react has not created the engine yet at this point.
          ref.current?.play(3)
        }, [])
        return <LottieView ref={ref} source={animation} />
      }

      render(<PlaysOnMount />)

      expect(engine().isPaused).toBe(false)
      expect(engine().currentFrame).toBe(3)
    })

    it("logs playback errors instead of throwing them", () => {
      const failure = new Error("boom")
      const error = jest.spyOn(console, "error").mockImplementation(() => {})
      const { ref } = renderLottieView()
      jest.spyOn(engine(), "play").mockImplementation(() => {
        throw failure
      })

      expect(() => act(() => ref.current?.play())).not.toThrow()
      expect(error).toHaveBeenCalledWith(failure)

      error.mockRestore()
    })

    it("restarts from the first frame on `reset`", () => {
      const { ref } = renderLottieView()
      act(() => ref.current?.play(3))
      act(() => ref.current?.pause())

      act(() => ref.current?.reset())

      expect(engine().isPaused).toBe(false)
      expect(engine().currentFrame).toBe(0)
    })

    it("pauses and reports the animation as cancelled on `pause`", () => {
      const onAnimationFinish = jest.fn()
      const { ref } = renderLottieView({ autoPlay: true, onAnimationFinish })

      act(() => ref.current?.pause())

      expect(engine().isPaused).toBe(true)
      expect(onAnimationFinish).toHaveBeenCalledTimes(1)
      expect(onAnimationFinish).toHaveBeenCalledWith(true)
    })

    it("pauses without an `onAnimationFinish` callback", () => {
      const { ref } = renderLottieView({ autoPlay: true })

      expect(() => act(() => ref.current?.pause())).not.toThrow()
      expect(engine().isPaused).toBe(true)
    })

    it("continues from where it paused on `resume`", () => {
      const { ref } = renderLottieView()
      act(() => ref.current?.play(3))
      act(() => ref.current?.pause())

      act(() => ref.current?.resume())

      expect(engine().isPaused).toBe(false)
      expect(engine().currentFrame).toBe(3)
    })
  })
})
