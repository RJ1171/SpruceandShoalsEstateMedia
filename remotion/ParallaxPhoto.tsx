import { AbsoluteFill, Easing, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export type ParallaxPhotoProps = {
  originalUrl: string;
  depthMapUrl?: string | null;
  direction?: "left" | "right";
};

export const ParallaxPhoto = ({ originalUrl, depthMapUrl, direction = "right" }: ParallaxPhotoProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const sign = direction === "right" ? 1 : -1;
  const blur = interpolate(Math.sin(progress * Math.PI), [0, 1], [0, 0.9]);

  const layer = (speed: number, scaleStart: number, scaleEnd: number) => ({
    transform: `perspective(1400px) translate3d(${sign * interpolate(progress, [0, 1], [-32, 32]) * speed}px, ${interpolate(progress, [0, 1], [18, -18]) * speed}px, 0) scale(${interpolate(progress, [0, 1], [scaleStart, scaleEnd])})`,
    filter: `blur(${blur * speed}px)`,
    willChange: "transform, filter" as const
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f2c25", overflow: "hidden" }}>
      <Img
        src={originalUrl}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.76,
          ...layer(0.35, 1.14, 1.19)
        }}
      />

      <AbsoluteFill
        style={{
          clipPath: "inset(8% 0 20% 0 round 1px)",
          WebkitMaskImage: depthMapUrl ? `url(${depthMapUrl})` : "linear-gradient(to bottom, transparent 2%, black 20%, black 78%, transparent 96%)",
          WebkitMaskSize: "cover",
          WebkitMaskPosition: "center",
          maskImage: depthMapUrl ? `url(${depthMapUrl})` : "linear-gradient(to bottom, transparent 2%, black 20%, black 78%, transparent 96%)",
          maskSize: "cover",
          maskPosition: "center"
        }}
      >
        <Img
          src={originalUrl}
          style={{ width: "100%", height: "100%", objectFit: "cover", ...layer(0.7, 1.1, 1.18) }}
        />
      </AbsoluteFill>

      <AbsoluteFill style={{ clipPath: "polygon(0 58%, 100% 50%, 100% 100%, 0 100%)" }}>
        <Img
          src={originalUrl}
          style={{ width: "100%", height: "100%", objectFit: "cover", ...layer(1, 1.08, 1.2) }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(15,44,37,0.08) 0%, rgba(15,44,37,0) 42%, rgba(10,24,21,0.82) 100%)"
        }}
      />
    </AbsoluteFill>
  );
};
