import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { tree } from "./parseTree";

export interface Camera {
  cx: number;
  cy: number;
  zoom: number;
}
const MINZOOM = 0.125;
const MAXZOOM = 4;

export default function SkillTree() {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  const [dims, setDims] = useState<[number, number]>([0, 0]);
  const [camera, setCamera] = useState<Camera>({ cx: 0, cy: 0, zoom: 1 });

  useLayoutEffect(() => {
    let interval: number;
    if (ctx) {
      const draw = () => {
        drawTree(ctx, dims);
        interval = window.requestAnimationFrame(draw);
      };
      interval = window.requestAnimationFrame(draw);
    }
    return () => {
      cancelAnimationFrame(interval);
    };
  }, [ctx, dims]);

  useEffect(() => {
    if (ctx) {
      // Transformation matrix is represented like so:
      // | a c e |
      // | b d f |
      // | 0 0 1 |
      ctx?.setTransform(camera.zoom, 0, 0, camera.zoom, camera.cx, camera.cy);
    }
  }, [ctx, camera]);

  const handleScroll = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      console.log(e.deltaY);
      const deltaZoom = e.deltaY * -0.001;
      setCamera((c) => ({
        ...c,
        zoom: Math.min(Math.max(c.zoom + deltaZoom, MINZOOM), MAXZOOM),
      }));
    },
    [setCamera]
  );

  const canvasRefCallback: React.RefCallback<HTMLCanvasElement> = useCallback(
    (node) => {
      if (node === null) {
        // do cleanup
        return;
      }

      const context = node.getContext("2d");
      if (context === null) {
        console.error("Rendering context not found");
        return;
      }
      setCtx(context);

      const { width, height } = node.getBoundingClientRect();
      node.width = width;
      node.height = height;
      setDims([width, height]);

      node.addEventListener("wheel", handleScroll, { passive: false });
    },
    [setCtx, setDims, handleScroll]
  );

  console.log(tree);

  return (
    <div>
      <div className="float">
        camera
        <div>cx: {camera.cx}</div>
        <div>cy: {camera.cy}</div>
        <div>zoom: {camera.zoom}</div>
      </div>
      <canvas className="w-full h-full" ref={canvasRefCallback}></canvas>
    </div>
  );
}

function drawTree(
  ctx: CanvasRenderingContext2D,
  [width, height]: [number, number]
) {
  const mat = ctx.getTransform();
  ctx.resetTransform();
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);
  ctx.setTransform(mat);

  // render groups
  ctx.fillStyle = "red";
  ctx.lineWidth = 2;
  ctx.strokeStyle = "white";
  Object.entries(tree.groups).forEach(([groupId, group]) => {
    const { x, y, orbits } = group;

    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
  });
}
