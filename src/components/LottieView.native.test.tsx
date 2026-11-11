// Runs on iOS and Android only: `jest.config.ts` keeps `*.native.test.tsx` out
// of the web project.

import { fireEvent, render, screen } from "@testing-library/react-native"
import NativeLottieView from "lottie-react-native"
import { type ComponentRef, createRef } from "react"

import { LottieView as ResolvedLottieView } from "./LottieView"
import { LottieView } from "./LottieView.native"
import type { AnimationObject } from "./types"

const animation: AnimationObject = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  assets: [],
  layers: [],
}

// lottie-react-native drives playback through native view commands, which have
// nothing to talk to in the test renderer, so the commands are stubbed out.
const commands = {
  play: jest.spyOn(NativeLottieView.prototype, "play"),
  reset: jest.spyOn(NativeLottieView.prototype, "reset"),
  pause: jest.spyOn(NativeLottieView.prototype, "pause"),
  resume: jest.spyOn(NativeLottieView.prototype, "resume"),
}

beforeEach(() => {
  for (const command of Object.values(commands)) {
    command.mockReset()
  }
})

describe("LottieView.native", () => {
  it("is what `./LottieView` resolves to on native platforms", () => {
    expect(ResolvedLottieView).toBe(LottieView)
  })

  describe("source", () => {
    it("passes parsed animation JSON to the native view", async () => {
      await render(<LottieView testID="lottie" source={animation} />)

      expect(screen.getByTestId("lottie")).toHaveProp(
        "sourceJson",
        JSON.stringify(animation),
      )
    })

    it("passes a local asset name to the native view", async () => {
      await render(<LottieView testID="lottie" source="loader" />)

      expect(screen.getByTestId("lottie")).toHaveProp("sourceName", "loader")
    })

    it("passes a remote uri to the native view", async () => {
      const uri = "https://example.com/loader.json"
      await render(<LottieView testID="lottie" source={{ uri }} />)

      expect(screen.getByTestId("lottie")).toHaveProp("sourceURL", uri)
    })
  })

  describe("props", () => {
    it("forwards playback and layout props to the native view", async () => {
      await render(
        <LottieView
          testID="lottie"
          source={animation}
          style={{ width: 120, height: 80 }}
          loop={false}
          speed={2}
          progress={0.5}
          resizeMode="cover"
        />,
      )

      const view = screen.getByTestId("lottie")
      expect(view).toHaveStyle({ width: 120, height: 80 })
      expect(view).toHaveProp("loop", false)
      expect(view).toHaveProp("speed", 2)
      expect(view).toHaveProp("progress", 0.5)
      expect(view).toHaveProp("resizeMode", "cover")
    })

    it("accepts the web-only `dataSet` prop", async () => {
      await render(
        <LottieView
          testID="lottie"
          source={animation}
          dataSet={{ chromatic: "ignore" }}
        />,
      )

      expect(screen.getByTestId("lottie")).toBeOnTheScreen()
    })

    it("starts playing on mount when `autoPlay` is set", async () => {
      await render(<LottieView source={animation} autoPlay />)

      expect(commands.play).toHaveBeenCalledTimes(1)
    })

    it("does not start playing on mount without `autoPlay`", async () => {
      await render(<LottieView source={animation} />)

      expect(commands.play).not.toHaveBeenCalled()
    })
  })

  describe("callbacks", () => {
    it("calls `onAnimationFinish` with whether the animation was cancelled", async () => {
      const onAnimationFinish = jest.fn()
      await render(
        <LottieView
          testID="lottie"
          source={animation}
          onAnimationFinish={onAnimationFinish}
        />,
      )

      await fireEvent(screen.getByTestId("lottie"), "animationFinish", {
        nativeEvent: { isCancelled: true },
      })

      expect(onAnimationFinish).toHaveBeenCalledTimes(1)
      expect(onAnimationFinish).toHaveBeenCalledWith(true)
    })

    it("calls `onAnimationFailure` with the native error", async () => {
      const onAnimationFailure = jest.fn()
      await render(
        <LottieView
          testID="lottie"
          source={animation}
          onAnimationFailure={onAnimationFailure}
        />,
      )

      await fireEvent(screen.getByTestId("lottie"), "animationFailure", {
        nativeEvent: { error: "Unable to parse composition" },
      })

      expect(onAnimationFailure).toHaveBeenCalledTimes(1)
      expect(onAnimationFailure).toHaveBeenCalledWith(
        "Unable to parse composition",
      )
    })

    it("calls `onAnimationLoaded` once the animation is loaded", async () => {
      const onAnimationLoaded = jest.fn()
      await render(
        <LottieView
          testID="lottie"
          source={animation}
          onAnimationLoaded={onAnimationLoaded}
        />,
      )

      await fireEvent(screen.getByTestId("lottie"), "animationLoaded")

      expect(onAnimationLoaded).toHaveBeenCalledTimes(1)
    })
  })

  describe("ref", () => {
    const renderWithRef = async () => {
      const ref = createRef<ComponentRef<typeof LottieView>>()
      await render(<LottieView ref={ref} source={animation} />)
      return ref
    }

    it("forwards the ref to the lottie-react-native view", async () => {
      const ref = await renderWithRef()

      expect(ref.current).toBeInstanceOf(NativeLottieView)
    })

    it("plays the whole animation", async () => {
      const ref = await renderWithRef()

      ref.current?.play()

      expect(commands.play).toHaveBeenCalledTimes(1)
      expect(commands.play).toHaveBeenCalledWith()
    })

    it("plays a segment of the animation", async () => {
      const ref = await renderWithRef()

      ref.current?.play(10, 50)

      expect(commands.play).toHaveBeenCalledTimes(1)
      expect(commands.play).toHaveBeenCalledWith(10, 50)
    })

    it.each(["reset", "pause", "resume"] as const)(
      "exposes `%s`",
      async command => {
        const ref = await renderWithRef()

        ref.current?.[command]()

        expect(commands[command]).toHaveBeenCalledTimes(1)
      },
    )
  })
})
