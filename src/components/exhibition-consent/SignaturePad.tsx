"use client";

import { useCallback, useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
}

interface SignaturePadProps {
  value: string | null;
  disabled?: boolean;
  readOnly?: boolean;
  strokeColor?: string;
  strokeWidth?: number;
  onChange?: (value: string | null) => void;
}

export default function SignaturePad({
  value,
  disabled = false,
  readOnly = false,
  strokeColor = "#1A1A1E",
  strokeWidth = 2,
  onChange,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawingRef = useRef(false);
  const hasInkRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);

  const resetContextStyle = useCallback(
    (context: CanvasRenderingContext2D) => {
      context.strokeStyle = strokeColor;
      context.lineWidth = strokeWidth;
      context.lineCap = "round";
      context.lineJoin = "round";
    },
    [strokeColor, strokeWidth]
  );

  const redrawValue = useCallback(
    (context: CanvasRenderingContext2D, width: number, height: number) => {
      context.clearRect(0, 0, width, height);

      if (!value) {
        hasInkRef.current = false;
        return;
      }

      const image = new Image();
      image.onload = () => {
        context.clearRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);
        resetContextStyle(context);
        hasInkRef.current = true;
      };
      image.src = value;
    },
    [resetContextStyle, value]
  );

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * ratio);
    canvas.height = Math.floor(rect.height * ratio);

    const context = canvas.getContext("2d");
    if (!context) return;

    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    resetContextStyle(context);
    contextRef.current = context;
    redrawValue(context, rect.width, rect.height);
  }, [redrawValue, resetContextStyle]);

  useEffect(() => {
    resizeCanvas();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new ResizeObserver(() => {
      resizeCanvas();
    });
    observer.observe(canvas);

    return () => {
      observer.disconnect();
    };
  }, [resizeCanvas]);

  const getPoint = (event: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const exportSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    onChange?.(hasInkRef.current ? canvas.toDataURL("image/png") : null);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled || readOnly) return;

    const context = contextRef.current;
    if (!context) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    const point = getPoint(event);
    isDrawingRef.current = true;
    hasInkRef.current = true;
    lastPointRef.current = point;

    context.beginPath();
    context.moveTo(point.x, point.y);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || disabled || readOnly) return;

    const context = contextRef.current;
    const lastPoint = lastPointRef.current;
    if (!context || !lastPoint) return;

    event.preventDefault();

    const point = getPoint(event);
    context.beginPath();
    context.moveTo(lastPoint.x, lastPoint.y);
    context.lineTo(point.x, point.y);
    context.stroke();
    lastPointRef.current = point;
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;

    event.preventDefault();
    isDrawingRef.current = false;
    lastPointRef.current = null;
    exportSignature();
  };

  return (
    <canvas
      ref={canvasRef}
      aria-label="서명 입력 영역"
      className="border-border-primary h-[152px] w-full touch-none rounded-lg border bg-[linear-gradient(45deg,#F1F1F4_25%,transparent_25%),linear-gradient(-45deg,#F1F1F4_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#F1F1F4_75%),linear-gradient(-45deg,transparent_75%,#F1F1F4_75%)] bg-[length:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0px]"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onPointerLeave={handlePointerEnd}
    />
  );
}
