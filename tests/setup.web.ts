// lottie-web paints a 1x1 canvas as soon as it is imported, and jsdom has no 2D
// context to give it. Nothing else touches the canvas: animations render as SVG.
const context = { fillStyle: "", fillRect() {} }

HTMLCanvasElement.prototype.getContext = (() =>
  context) as unknown as HTMLCanvasElement["getContext"]
