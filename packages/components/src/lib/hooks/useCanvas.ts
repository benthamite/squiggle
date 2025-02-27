import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

export type DrawContext = {
  context: CanvasRenderingContext2D;
  width: number;
};

type DrawFunction = (context: DrawContext) => void;

export function useCanvas({
  height,
  init,
  draw,
}: {
  height: number;
  init?: DrawFunction; // useful for cursor initializations, see useCanvasCursor()
  draw: DrawFunction;
}) {
  const [width, setWidth] = useState<number | undefined>();
  const [context, setContext] = useState<
    CanvasRenderingContext2D | undefined
  >();

  const devicePixelRatio =
    typeof window === "undefined" ? 1 : window.devicePixelRatio;

  const observer = useMemo(() => {
    if (typeof window === "undefined") {
      return undefined;
    }
    return new window.ResizeObserver((entries) => {
      if (!entries[0]) {
        return;
      }
      setWidth(entries[0].contentRect.width);
    });
  }, []);

  useEffect(() => {
    return () => {
      observer?.disconnect();
    };
  }, [observer]);

  const ref = useCallback(
    (canvas: HTMLCanvasElement) => {
      if (!canvas) {
        return;
      }
      const usedWidth = canvas.getBoundingClientRect().width;
      setWidth(usedWidth);

      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Failed to initialize 2d context"); // shouldn't happen, all browsers support 2d context
      }
      context.resetTransform();
      context.scale(devicePixelRatio, devicePixelRatio);

      setContext(context);
      init?.({ context, width: usedWidth });
      // TODO - call `draw` too? would be slightly faster; but we can't put `draw` in callback dependencies

      observer?.disconnect();
      observer?.observe(canvas);
    },
    [init, observer, devicePixelRatio]
  );

  const redraw = useCallback(() => {
    if (width === undefined || context === undefined) {
      return;
    }
    // We have to do this here and not on observer's callback, because otherwise there's a delay between
    // width change and drawing (setWidth is not synchronous), and that causes flickering and other issues.
    const { canvas } = context;
    canvas.style.height = `${height}px`;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;

    // context.reset() would be better, but it's still experimental
    context.resetTransform();
    context.scale(devicePixelRatio, devicePixelRatio);

    draw({ width, context });
  }, [draw, width, height, context, devicePixelRatio]);

  useLayoutEffect(() => {
    redraw();
  }, [redraw]);

  return {
    ref,
    redraw,
    width,
  };
}
