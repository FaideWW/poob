import { useRef, useEffect } from "react";

export interface UseCanvasOptions {
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
  predraw?: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
  postdraw?: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
}

/**
 * Instantiates a reference to an HTMLCanvasElement, and starts a render loop
 * based on the passed-in draw argument.
 */
export default ({
  draw,
  predraw = _predraw,
  postdraw = _postdraw,
}: UseCanvasOptions) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error(
        "Ref from useCanvas was not attached to a mounted node; rendering context is not available."
      );
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      console.error("No context available.");
      return;
    }
    let frameCount = 0;
    let animationFrameId: number;

    const render = () => {
      frameCount += 1;
      predraw(context, canvas);
      draw(context, canvas.width, canvas.height);
      postdraw(context, canvas);
      // animationFrameId = window.requestAnimationFrame(render);
    };
    render();
    return () => {
      // window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  return canvasRef;
};

export function resizeCanvasToDisplay(canvas: HTMLCanvasElement): boolean {
  const { width, height } = canvas.getBoundingClientRect();

  if (canvas.width !== width || canvas.height !== height) {
    const { devicePixelRatio: ratio = 1 } = window;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    return true;
  }

  return false;
}

export const _predraw = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): void => {
  ctx.save();
  resizeCanvasToDisplay(canvas);
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);
};

export const _postdraw = (ctx: CanvasRenderingContext2D): void => {
  ctx.restore();
  ctx.resetTransform();
};
